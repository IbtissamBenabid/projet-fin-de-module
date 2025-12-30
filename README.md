# BioTrust : Système de Confiance Numérique Biométrique Multimodal

## 1. Introduction
Ce projet implémente un système d'identité numérique sécurisé basé sur la biométrie multimodale (Visage et Empreintes Digitales). Il est conçu pour fournir des identifiants uniques aux populations sans-papiers et aux réfugiés, facilitant leur accès aux services publics essentiels.

## 2. Cas d’Usage : Accès Universel aux Services Publics (Universal Service Access)

### Méthodologie du Dataset (Cadre Académique)
Pour simuler un environnement réaliste sans utiliser de données personnelles réelles, le projet utilise un **Mapping Multimodal Inter-Dataset** :
*   **Visages** : Issus de la **Yale Face Database** (15 sujets avec 11 variations chacun).
*   **Empreintes** : Issues du dataset **NIST Special Database 4 (SD-4)**.
*   **Lien** : Chaque sujet Yale est lié systématiquement à un sujet NIST (ex: Yale Subject 01 <-> NIST Subject f0001) pour créer une identité numérique multimodale cohérente.
*   **Stockage** : Seuls les descripteurs (vecteurs) sont extraits et stockés, respectant la minimisation des données.

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
*   **Database (PostgreSQL/H2)** : Stockage des identités et des logs d'audit.
*   **Frontend (React/Vite)** : Interface utilisateur professionnelle de style gouvernemental avec design responsive.

## 4.1 Interface Utilisateur - Design Gouvernemental
L'interface frontend adopte un design professionnel inspiré des sites web gouvernementaux :
*   **Couleurs officielles** : Bleu institutionnel (#1e40af), blanc, gris professionnels
*   **Typographie** : Police Inter pour une lisibilité optimale
*   **Layout responsive** : Adapté aux ordinateurs de bureau et appareils mobiles
*   **Accessibilité** : Conformité aux standards WCAG pour l'inclusion
*   **Sécurité visuelle** : Indicateurs de statut, badges de sécurité, icônes professionnelles

### Fonctionnalités de l'Interface
- **Tableau de Bord** : Vue d'ensemble avec statistiques en temps réel
- **Enrôlement** : Formulaire sécurisé pour la création d'identités numériques
- **Vérification** : Interface de validation d'identité avec capture biométrique
- **Évaluation** : Tableaux de bord des métriques de performance système

## 5. Exigences de Sécurité Appliquées
- [x] Séparation Données Brutes / Descripteurs.
- [x] Chiffrement des descripteurs au repos (AES-256).
- [x] Communications cryptées (HTTPS/TLS).
- [x] Journalisation (Audit Trail) de chaque accès biométrique.
- [x] RBAC (Role-Based Access Control).

## 7. Installation et Configuration

### Prérequis
*   **Java 17+** (Backend Spring Boot)
*   **Python 3.8+** (Moteur biométrique)
*   **Node.js 16+** (Frontend React)
*   **Maven 3.6+** (Build Java)
*   **Docker** (Optionnel pour le déploiement)

### Démarrage Rapide
```bash
# 1. Cloner le repository
git clone <repository-url>
cd biotrust

# 2. Démarrer les services avec Docker (recommandé)
docker-compose up --build

# Ou démarrage manuel:
# Backend
cd backend && mvn spring-boot:run

# Biometric Engine (dans un autre terminal)
cd biometric-service && uvicorn main:app --host 0.0.0.0 --port 8000

# Frontend (dans un autre terminal)
cd frontend && npm install && npm run dev
```

### Accès aux Services
*   **Frontend** : http://localhost:3000
*   **Backend API** : http://localhost:8081
*   **Biometric Engine** : http://localhost:8000
*   **Base de données H2** : http://localhost:8081/h2-console (dev seulement)

## 8. Fichiers de Configuration

### .gitignore
Le projet inclut un fichier `.gitignore` complet couvrant :
*   **Java** : `target/`, `*.class`, IDE files
*   **Python** : `__pycache__/`, `*.pyc`, virtual environments
*   **Node.js** : `node_modules/`, `dist/`, build artifacts
*   **OS** : `.DS_Store`, `Thumbs.db`, temporary files
*   **Application** : datasets bruts, logs, fichiers temporaires
