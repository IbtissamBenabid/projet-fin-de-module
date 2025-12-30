import os
import json

# Configuration des sources académiques
# Source 1: Yale Face Database (15 sujets)
# Source 2: NIST Special Database 4 (Empreintes)
DATASET_DIR = "dataset"
PAIRS_FILE = os.path.join(DATASET_DIR, "yale_nist_mapping.json")

def setup_yale_nist_mapping():
    """
    Crée un mapping systématique entre Yale (Visages) et NIST (Empreintes).
    Comme Yale a 15 sujets, nous lions les 15 premiers sujets NIST.
    """
    if not os.path.exists(DATASET_DIR):
        os.makedirs(DATASET_DIR)

    mapping = []
    
    # Yale subjects: 01 to 15
    # NIST subjects: often numbered in sequence (f0001, f0002...)
    for i in range(1, 16):
        subject_id = f"{i:02d}"
        
        # Mapping Multimodal Académique
        entry = {
            "digital_id": f"BT-YALE-NIST-{subject_id}",
            "full_name": f"Subject Yale-{subject_id}",
            "face_data": {
                "dataset": "Yale Face Database",
                "subject": f"subject{subject_id}",
                "variations": ["normal", "happy", "sad", "sleepy", "wink"]
            },
            "fingerprint_data": {
                "dataset": "NIST SD-4",
                "subject_ref": f"f{i:04d}",
                "fingers": ["index_right", "index_left"]
            }
        }
        mapping.append(entry)

    with open(PAIRS_FILE, 'w') as f:
        json.dump(mapping, f, indent=4)
        
    print(f"Mapping Yale <-> NIST généré : {len(mapping)} identités créées.")

if __name__ == "__main__":
    setup_yale_nist_mapping()
