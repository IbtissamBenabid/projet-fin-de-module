import os
import shutil
import json

# Configuration du dataset pour le projet académique
DATASET_DIR = "dataset"
RAW_DIR = os.path.join(DATASET_DIR, "raw")
PAIRS_FILE = os.path.join(DATASET_DIR, "identity_pairs.json")

def initialize_dataset():
    """
    Initialise la structure du dataset.
    Dans un cadre académique, on lie un ID de visage à un ID d'empreinte.
    Exemple : 
    - LFW Person X (Face) <-> FVC Person Y (Fingerprint)
    """
    if not os.path.exists(RAW_DIR):
        os.makedirs(RAW_DIR)
    
    # Structure de mapping (Simulée pour le projet)
    # L'idée est qu'une identité numérique est la fusion de deux sources open-source
    pairs = [
        {
            "identity_id": "STU-001",
            "name": "Bénéficiaire Alpha",
            "face_source": "lfw/Alice_0001.jpg",
            "fingerprint_source": "fvc2002/DB1_1_1.tif"
        },
        {
            "identity_id": "STU-002",
            "name": "Bénéficiaire Beta",
            "face_source": "lfw/Bob_0001.jpg",
            "fingerprint_source": "fvc2002/DB1_2_1.tif"
        }
    ]
    
    with open(PAIRS_FILE, 'w') as f:
        json.dump(pairs, f, indent=4)
        
    print(f"Dataset initialisé. Mapping créé dans {PAIRS_FILE}")

if __name__ == "__main__":
    initialize_dataset()
