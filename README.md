# Éwé Voice Translator

Traducteur multilingue **Éwé ↔ Anglais ↔ Français** avec reconnaissance vocale et synthèse vocale, basé sur des modèles Hugging Face.

![Stack](https://img.shields.io/badge/FastAPI-0.115-009688?logo=fastapi) ![React](https://img.shields.io/badge/React-18-61DAFB?logo=react) ![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker)

---

## Fonctionnalités

| Fonction                        | Détail                                                       |
| ------------------------------- | ------------------------------------------------------------ |
| **Traduction**                  | Éwé ↔ Anglais ↔ Français — modèle NLLB-200 + adaptateur LoRA |
| **Reconnaissance vocale (ASR)** | Transcription Éwé via MMS Wav2Vec2-CTC                       |
| **Synthèse vocale (TTS)**       | Voix neurale pour les 3 langues via MMS-VITS                 |
| **Authentification**            | JWT (signup / login) avec bcrypt                             |
| **Historique**                  | 50 dernières traductions stockées localement                 |
| **Interface**                   | Design inspiré de Google Translate                           |

---

## Architecture

```
app/
├── docker-compose.yml        # Orchestration des 3 services
├── backend/                  # API FastAPI (Python 3.11)
│   ├── main.py
│   ├── requirements.txt
│   ├── Dockerfile
│   ├── .env.example
│   └── app/
│       ├── core/
│       │   ├── database.py   # SQLAlchemy 2 + PostgreSQL
│       │   └── security.py   # JWT, bcrypt
│       └── modules/
│           ├── users/        # Auth (signup, login)
│           ├── translation/  # NLLB + LoRA
│           ├── speech/       # ASR Wav2Vec2
│           ├── tts/          # TTS MMS-VITS (ee/en/fr)
│           └── history/      # Historique
└── frontend/                 # React 18 + Vite + TypeScript
    ├── Dockerfile            # Build multi-stage → Nginx
    ├── nginx.conf            # Reverse-proxy /api/ → API
    └── src/
        ├── components/
        ├── hooks/
        ├── lib/              # api.ts, tts.ts, audio.ts
        └── context/          # AuthContext
```

---

## Modèles utilisés

| Rôle              | Modèle                                 | Accès     |
| ----------------- | -------------------------------------- | --------- |
| Traduction base   | `facebook/nllb-200-distilled-600M`     | Public    |
| LoRA (ee ↔ en/fr) | `eplm1iabd/nllb-ewe-multilingual-lora` | **Privé** |
| ASR Éwé           | `eplm1iabd/mms-ewe-asr`                | **Privé** |
| TTS Éwé           | `facebook/mms-tts-ewe`                 | Public    |
| TTS Anglais       | `facebook/mms-tts-eng`                 | Public    |
| TTS Français      | `facebook/mms-tts-fra`                 | Public    |

> **⚠️ Modèles privés — accès restreint**
>
> Les modèles `eplm1iabd/nllb-ewe-multilingual-lora` et `eplm1iabd/mms-ewe-asr` sont maintenus **privés** le temps de vérifier les licences des données d'entraînement.
>
> Pour y accéder, deux options :
>
> - **Option A — Être ajouté à l'organisation Hugging Face** : contacter les mainteneurs pour obtenir l'accès au namespace `eplm1iabd`.
> - **Option B — Utiliser un token fourni** : un `HF_TOKEN` avec les droits de lecture peut être fourni sur demande.
>
> Dans les deux cas, renseigner le token dans `backend/.env` (voir section suivante).

---

## Démarrage rapide (Docker)

### 1. Cloner le dépôt

```bash
git clone git@github.com:RomaricNadjire/ewe_voice_translator.git
cd ewe_voice_translator
```

### 2. Configurer les variables d'environnement

```bash
cp backend/.env.example backend/.env
```

Éditer `backend/.env` :

```env
# Use "localhost" only if you run the API directly on your host machine.
DATABASE_URL=postgresql+psycopg://admin:password@postgres:5432/fastapi_db

SECRET_KEY=
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=500

HF_TOKEN=

# MMS-VITS TTS models — public checkpoints, no auth needed.
HF_MODEL_LORA=eplm1iabd/nllb-ewe-multilingual-lora
HF_MODEL_ASR=eplm1iabd/mms-ewe-asr
HF_MODEL_TTS=facebook/mms-tts-ewe

# Additional TTS models for other languages (English, French) — public checkpoints, no auth needed.
HF_MODEL_TTS_EE=facebook/mms-tts-ewe
HF_MODEL_TTS_EN=facebook/mms-tts-eng
HF_MODEL_TTS_FR=facebook/mms-tts-fra
```

### 3. Lancer la stack

```bash
cd app
docker compose up --build
```

L'interface est accessible sur **http://localhost:8080**.

> **Note :** Le premier démarrage est lent (téléchargement des modèles ~2–4 Go). Les appels suivants sont rapides car les modèles sont mis en cache dans le volume Docker.

---

## Services

| Service    | Port | Description                                 |
| ---------- | ---- | ------------------------------------------- |
| `frontend` | 8080 | Interface React servie par Nginx            |
| `api`      | 8000 | API FastAPI (accessible directement en dev) |
| `postgres` | 5432 | Base de données PostgreSQL 17               |

Le frontend proxifie `/api/*` → `http://api:8000/` via Nginx.

---

## API Endpoints

| Méthode | Route                | Description                                  |
| ------- | -------------------- | -------------------------------------------- |
| `POST`  | `/auth/register`     | Créer un compte                              |
| `POST`  | `/auth/login`        | Se connecter (retourne un token JWT)         |
| `POST`  | `/translation/`      | Traduire un texte                            |
| `POST`  | `/speech/transcribe` | Transcrire un fichier audio (WAV 16kHz mono) |
| `POST`  | `/tts/`              | Synthèse vocale → WAV                        |

Documentation interactive : **http://localhost:8000/docs**

### Exemple — Traduction

```bash
curl -X POST http://localhost:8080/api/translation/ \
  -H "Content-Type: application/json" \
  -d '{"text": "akpe", "source": "ee", "target": "fr"}'
# {"translation": "Merci"}
```

### Exemple — TTS

```bash
curl -X POST http://localhost:8080/api/tts/ \
  -H "Content-Type: application/json" \
  -d '{"text": "Aɖaŋuɖoɖo nyui", "lang": "ee"}' \
  -o output.wav
```

---

## Développement local (sans Docker)

### Backend

```bash
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
# Configurer .env avec DATABASE_URL pointant vers un PostgreSQL local
uvicorn main:app --reload --port 8000
```

### Frontend

```bash
cd frontend
npm install
# Optionnel : créer .env.local avec VITE_API_BASE_URL=http://localhost:8000
npm run dev   # http://localhost:5173
```

---

## Notes techniques

- **LoRA désactivé pour la cible Éwé** : le modèle LoRA est entraîné sur les paires ee→en et ee→fr. Lorsque l'Éwé est la _cible_, le contexte `model.disable_adapter()` (PEFT) est utilisé pour éviter un biais vers l'anglais.
- **ASR** : l'audio est converti en WAV PCM 16 kHz mono dans le navigateur avant envoi (Web Audio API). `echoCancellation` est désactivé pour éviter les silences sur certains pilotes audio (SOF/PipeWire).
- **TTS** : toutes les langues utilisent des voix neurales MMS-VITS (pas de synthèse navigateur).

---

## Licence

Projet académique — INF2229 Informatique & Gestion de Données, M1.
