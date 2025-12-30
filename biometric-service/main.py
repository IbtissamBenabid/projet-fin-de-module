from fastapi import FastAPI, File, UploadFile, HTTPException
import numpy as np
import cv2
from PIL import Image
import io
import base64
from cryptography.fernet import Fernet
import os
import logging

# Configuration du logging pour la traçabilité (Exigence 5)
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("BiometricProcessor")

app = FastAPI(title="BioTrust Biometric Engine - Data Collection & Processing")

# Clé de chiffrement (En production, utiliserait un HSM ou KMS)
# Cette clé sera utilisée pour chiffrer les descripteurs avant de les envoyer au stockage
SECRET_KEY = b'G6V6-zX8Z9_u5f-k6_yR9Xp2v1X6J-oI8i_f_4e9_U0=' # Exemple statique pour la démo
cipher_suite = Fernet(SECRET_KEY)

def process_face(image_bytes):
    """
    Traitement du visage : 
    1. Détection de visage (Haar Cascades ou DNN)
    2. Normalisation (Alignement, Passage en Gris)
    3. Extraction (Simulation de vecteur 128-d)
    """
    nparr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    
    if img is None:
        raise ValueError("Image invalide")

    # 1. Détection (Simplifiée pour la démo)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
    faces = face_cascade.detectMultiScale(gray, 1.3, 5)
    
    if len(faces) == 0:
        raise ValueError("Aucun visage détecté")

    # On prend le premier visage trouvé
    (x, y, w, h) = faces[0]
    face_roi = gray[y:y+h, x:x+w]
    
    # 2. Normalisation (Redimensionnement standard 160x160)
    face_normalized = cv2.resize(face_roi, (160, 160))
    
    # 3. Extraction (Vecteur de caractéristiques simulé basé sur l'histogramme pour la démo)
    # Dans un système réel, on utiliserait un modèle Deep Learning (Facenet, ArcFace)
    hist = cv2.calcHist([face_normalized], [0], None, [128], [0, 256])
    vector = cv2.normalize(hist, hist).flatten().tolist()
    
    return vector

def process_fingerprint(image_bytes):
    """
    Traitement de l'empreinte :
    1. Amélioration de l'image (Égalisation d'histogramme)
    2. Binarisation d'Otsu (Extraction des crêtes)
    3. Extraction de descripteurs (Simulé)
    """
    nparr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_GRAYSCALE)
    
    if img is None:
        raise ValueError("Image d'empreinte invalide")

    # 1. Amélioration
    enhanced = cv2.equalizeHist(img)
    
    # 2. Binarisation (Séparation crêtes/vallées)
    _, binary = cv2.threshold(enhanced, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
    
    # 3. Extraction de Minuties (Simulation via détection de coins Harris sur l'image binarisée)
    # Les minuties sont les terminaisons et bifurcations des crêtes.
    dst = cv2.cornerHarris(binary, 2, 3, 0.04)
    vector = np.random.RandomState(int(np.sum(dst))).rand(128).tolist()
    
    return vector

@app.post("/collect/enroll")
async def collect_and_process(
    face: UploadFile = File(...), 
    fingerprint: UploadFile = File(...)
):
    """
    Endpoint principal pour la collecte et le traitement initial.
    Conformité : Les images brutes ne sont JAMAIS stockées ici (Minimisation).
    """
    try:
        logger.info(f"Début du traitement pour un nouvel enrôlement")
        
        # Lecture des données en mémoire
        face_bytes = await face.read()
        finger_bytes = await fingerprint.read()
        
        # Traitement Biométrique
        face_vector = process_face(face_bytes)
        finger_vector = process_fingerprint(finger_bytes)
        
        # Chiffrement des descripteurs (Sécurité au repos)
        # On transforme le vecteur en string puis on le chiffre
        enc_face = cipher_suite.encrypt(str(face_vector).encode())
        enc_finger = cipher_suite.encrypt(str(finger_vector).encode())
        
        logger.info("Traitement réussi. Descripteurs générés et chiffrés.")
        
        return {
            "status": "processed",
            "face_descriptor": base64.b64encode(enc_face).decode(),
            "fingerprint_descriptor": base64.b64encode(enc_finger).decode(),
            "metrics": {
                "face_confidence": 0.92,
                "finger_quality_score": 0.85
            }
        }
        
    except ValueError as ve:
        logger.error(f"Erreur de validation : {ve}")
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        logger.error(f"Erreur système : {e}")
        raise HTTPException(status_code=500, detail="Erreur lors du traitement biométrique")

@app.post("/process/verify")
async def process_verification(
    face: UploadFile = File(...),
    stored_descriptor: str = ""
):
    """
    Traitement d'une image pour vérification (1:1)
    """
    try:
        face_bytes = await face.read()
        current_vector = process_face(face_bytes)
        
        # Déchiffrement du descripteur stocké pour comparaison
        stored_raw = cipher_suite.decrypt(base64.b64decode(stored_descriptor)).decode()
        stored_vector = np.array(eval(stored_raw))
        
        # Calcul de distance (Traitement de décision)
        distance = np.linalg.norm(np.array(current_vector) - stored_vector)
        
        # En biométrie, plus la distance est faible, plus la similarité est haute
        is_match = distance < 0.5 # Seuil arbitraire pour la démo
        
        return {
            "is_match": bool(is_match),
            "score": round(float(1 - distance), 4)
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail="Échec de la vérification")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
