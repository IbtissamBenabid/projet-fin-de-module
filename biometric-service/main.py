from fastapi import FastAPI, File, UploadFile, HTTPException
import numpy as np
import cv2
from PIL import Image
import io
import base64
from cryptography.fernet import Fernet
import os

app = FastAPI(title="BioTrust Biometric Engine")

# Clé de chiffrement pour les descripteurs au repos
# En production, cela serait géré par un KMS (Key Management Service)
SECRET_KEY = Fernet.generate_key()
cipher_suite = Fernet(SECRET_KEY)

@app.get("/")
async def health_check():
    return {"status": "running", "version": "1.0.0"}

@app.post("/extract/face")
async def extract_face_features(file: UploadFile = File(...)):
    """
    Simule l'extraction de descripteurs faciaux (ex: 128-d vector).
    En production, on utiliserait DeepFace ou InsightFace ici.
    """
    try:
        content = await file.read()
        # Simulation d'extraction
        # vector = deepface.represent(img_path=content, model_name="VGG-Face")[0]["embedding"]
        
        # Pour la démo, on génère un vecteur déterministe basé sur l'image
        img = Image.open(io.BytesIO(content))
        img_array = np.array(img.convert('L'))
        mean_val = np.mean(img_array)
        
        # Génération d'un faux descripteur (pour l'exemple)
        vector = np.random.RandomState(int(mean_val)).rand(128).tolist()
        
        # Chiffrement du descripteur avant retour (Sécurité)
        encrypted_vector = cipher_suite.encrypt(str(vector).encode())
        
        return {
            "type": "face",
            "descriptor": base64.b64encode(encrypted_vector).decode(),
            "confidence": 0.98
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/extract/fingerprint")
async def extract_fingerprint_features(file: UploadFile = File(...)):
    """
    Extraction de minuties ou de descripteurs de texture d'empreinte.
    """
    try:
        content = await file.read()
        # Simulation de traitement d'image (Binarisation, Squelettisation)
        img = cv2.imdecode(np.frombuffer(content, np.uint8), cv2.IMREAD_GRAYSCALE)
        _, thresh = cv2.threshold(img, 127, 255, cv2.THRESH_BINARY)
        
        # Génération d'un descripteur basé sur les caractéristiques locales
        desc_val = int(np.sum(thresh) % 1000)
        vector = np.random.RandomState(desc_val).rand(128).tolist()
        
        encrypted_vector = cipher_suite.encrypt(str(vector).encode())
        
        return {
            "type": "fingerprint",
            "descriptor": base64.b64encode(encrypted_vector).decode(),
            "confidence": 0.95
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/compare")
async def compare_descriptors(data: dict):
    """
    Compare deux descripteurs chiffrés et retourne un score de similarité.
    """
    try:
        d1_raw = cipher_suite.decrypt(base64.b64decode(data['descriptor1'])).decode()
        d2_raw = cipher_suite.decrypt(base64.b64decode(data['descriptor2'])).decode()
        
        v1 = np.array(eval(d1_raw))
        v2 = np.array(eval(d2_raw))
        
        # Calcul de la distance euclidienne ou cosinus
        distance = np.linalg.norm(v1 - v2)
        similarity = 1 / (1 + distance) # Formule simple de normalisation
        
        threshold = 0.8
        match = similarity > threshold
        
        return {
            "similarity_score": round(float(similarity), 4),
            "is_match": bool(match),
            "threshold": threshold
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail="Invalid descriptor data")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
