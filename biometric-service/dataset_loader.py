import os
import json

MAPPING_PATH = "dataset/yale_nist_mapping.json"

class AcademicDatasetLoader:
    """
    Chargeur spécialisé pour Yale (Face) et NIST (Fingerprint).
    Gère l'extraction des identités liées pour l'enrôlement et la vérification.
    """
    def __init__(self):
        self.identities = []
        if os.path.exists(MAPPING_PATH):
            with open(MAPPING_PATH, 'r') as f:
                self.identities = json.load(f)

    def get_list(self):
        return [
            {"id": ident["digital_id"], "name": ident["full_name"]} 
            for ident in self.identities
        ]

    def get_details(self, digital_id):
        for ident in self.identities:
            if ident["digital_id"] == digital_id:
                return ident
        return None

# Singleton
loader = AcademicDatasetLoader()
