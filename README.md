# BioTrust : Système de Confiance Numérique Biométrique Multimodal

## 1. Introduction
Ce projet implémente un système d'identité numérique sécurisé basé sur la biométrie multimodale (Visage et Empreintes Digitales). Il est conçu pour fournir des identifiants uniques aux populations sans-papiers et aux réfugiés, facilitant leur accès aux services publics essentiels.

## 2. Cas d’Usage : Accès Universel aux Services Publics (Universal Service Access)

### Acteurs
*   **Bénéficiaire** : Personne sans identité officielle cherchant à accéder aux services.
*   **Agent d'Enrôlement** : Officier autorisé à collecter les données biométriques.
*   **Agent de Service (Vérificateur)** : Employé de service public vérifiant l'identité pour fournir une prestation.
*   **Administrateur** : Gérant du système, des politiques de sécurité et des audits.

### Scénarios
1.  **Enrôlement (Standard)** : Collecte du visage et de l'empreinte -> Extraction des descripteurs -> Hachage sécurisé -> Génération d'un Digital ID.
2.  **Vérification (1:1)** : Le bénéficiaire présente son Digital ID et son visage/doigt -> Comparaison avec les descripteurs enregistrés.
3.  **Identification (1:N)** : Recherche d'un individu dans la base à partir de ses données biométriques uniquement (prévention des doublons).
4.  **Mode Dégradé** : Si une modalité échoue (ex: blessure au doigt), le système bascule sur la modalité secondaire (visage) avec un seuil de confiance renforcé.

### Analyse des Risques et Attaques
*   **Spoofing / Presentation Attack (PA)** : Utilisation d'une photo ou d'un silicone. *Contre-mesure : Détection de vivacité (Liveness Detection).*
*   **Replay Attack** : Capture de l'identifiant biométrique pendant la transmission. *Contre-mesure : TLS 1.3 et Signature des requêtes.*
*   **Biais Algorithmique** : Erreur de reconnaissance plus élevée sur certaines ethnies. *Discussion : Utilisation de modèles entraînés sur des datasets diversifiés (ex: VGGFace2).*
*   **Usurpation d'Identité** : Vol de descripteurs. *Contre-mesure : Transformation non inversible (Cancelable Biometrics) et chiffrement AES-256.*

## 3. Conformité Légale (Loi 08.09 & RGPD)
*   **Consentement** : Recueilli explicitement au moment de l'enrôlement (Signature numérique).
*   **Minimisation** : Seuls les descripteurs mathématiques sont conservés ; les images brutes sont supprimées après traitement.
*   **Durée de conservation** : Jusqu'à la naturalisation ou demande de suppression par le bénéficiaire.
*   **Droit à l'oubli** : Fonctionnalité de révocation totale des données biométriques.

## 4. Architecture Technique
Le système repose sur une séparation stricte des responsabilités (SOC) :
*   **Backend (Java/Spring Boot)** : Orchestration, Gestion des Identités, Sécurité (JWT), Audit Log.
*   **Biometric Engine (Python/FastAPI)** : Extraction de caractéristiques via Deep Learning, Calcul de scores de similarité.
*   **Database (PostgreSQL)** : Stockage des identités et des logs d'audit.
*   **Frontend (React/Vite)** : Interface utilisateur moderne et sécurisée.

## 5. Exigences de Sécurité Appliquées
- [x] Séparation Données Brutes / Descripteurs.
- [x] Chiffrement des descripteurs au repos (AES-256).
- [x] Communications cryptées (HTTPS/TLS).
- [x] Journalisation (Audit Trail) de chaque accès biométrique.
- [x] RBAC (Role-Based Access Control).

## 6. Métriques Biométriques (Cibles)
*   **FAR (False Acceptance Rate)** : < 0.001%
*   **FRR (False Rejection Rate)** : < 1%
*   **EER (Equal Error Rate)** : Optimisé pour le compromis sécurité/confort utilisateur.
