import numpy as np
from typing import List, Tuple

class BiometricEvaluator:
    """
    Module d'évaluation pour calculer les métriques de performance biométrique.
    Conformité : Exigence 7 (FAR, FRR, EER).
    """

    @staticmethod
    def calculate_metrics(genuine_scores: List[float], impostor_scores: List[float], thresholds: np.ndarray) -> dict:
        """
        Calcule les taux FAR et FRR pour une plage de seuils.
        - FAR (False Acceptance Rate) : Part des imposteurs acceptés à tort.
        - FRR (False Rejection Rate) : Part des utilisateurs authentiques rejetés à tort.
        """
        far = []
        frr = []

        for t in thresholds:
            # FAR : imposteurs dont le score est > seuil
            false_acc = np.sum(np.array(impostor_scores) > t) / len(impostor_scores)
            # FRR : authentiques dont le score est < seuil
            false_rej = np.sum(np.array(genuine_scores) < t) / len(genuine_scores)
            
            far.append(false_acc)
            frr.append(false_rej)

        far = np.array(far)
        frr = np.array(frr)

        # Calcul de l'EER (Equal Error Rate) : point où FAR = FRR
        # On cherche l'index où la différence est minimale
        idx = np.nanargmin(np.abs(far - frr))
        eer = (far[idx] + frr[idx]) / 2
        optimal_threshold = thresholds[idx]

        return {
            "thresholds": thresholds.tolist(),
            "far": far.tolist(),
            "frr": frr.tolist(),
            "eer": float(eer),
            "optimal_threshold": float(optimal_threshold)
        }

    @staticmethod
    def generate_simulated_scores(n_samples: int = 1000):
        """
        Génère des scores simulés pour la démonstration académique.
        Les scores 'genuine' suivent une distribution normale centrée sur 0.9.
        Les scores 'impostor' suivent une distribution normale centrée sur 0.3.
        """
        genuine = np.random.normal(0.9, 0.05, n_samples)
        impostor = np.random.normal(0.3, 0.15, n_samples)
        
        # Clip entre 0 et 1
        genuine = np.clip(genuine, 0, 1)
        impostor = np.clip(impostor, 0, 1)
        
        return genuine.tolist(), impostor.tolist()
