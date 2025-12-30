import os
import json
import base64

DATASET_PATH = "dataset/identity_pairs.json"

class AcademicDataset:
    """
    Gestionnaire pour charger les données des datasets open-source (LFW, FVC, etc.)
    """
    def __init__(self):
        self.pairs = []
        if os.path.exists(DATASET_PATH):
            with open(DATASET_PATH, 'r') as f:
                self.pairs = json.load(f)

    def get_all_identities(self):
        return self.pairs

    def get_identity_images(self, identity_id):
        """
        Retourne les images liées à une identité pour la simulation d'enrôlement.
        """
        for item in self.pairs:
            if item['identity_id'] == identity_id:
                # Dans un cas réel, on lirait les fichiers sur le disque
                # Pour la démo, on simule le retour de contenu
                return {
                    "face_path": item['face_source'],
                    "finger_path": item['fingerprint_source']
                }
        return None

# Singleton pour le chargement
loader = AcademicDataset()
