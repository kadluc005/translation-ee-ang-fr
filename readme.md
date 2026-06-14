# 🚀 FastAPI AI Backend — ASR + Translation + Auth

Ce projet est un backend basé sur **FastAPI** permettant :

- 🔐 Authentification JWT (signup/login)
- 🧠 Traduction automatique (NLLB + LoRA Hugging Face)
- 🎙️ Speech-to-Text (Wav2Vec2 ASR)
- 📊 Historique utilisateur
- 🐳 Déploiement Dockerisé
- 🗄️ Base de données PostgreSQL

---

# 🧱 Architecture du projet


## 🧱 Architecture

app/
│
├── core/
│ └── database.py
│
├── modules/
│ ├── users/
│ │ ├── routes.py
│ │ ├── service.py
│ │ └── model.py
│ │
│ ├── translation/
│ │ ├── routes.py
│ │ ├── service.py
│ │ └── model.py
│ │
│ ├── speech/
│ │ ├── routes.py
│ │ ├── service.py
│ │ └── model.py
│
└── main.py


---


---

# ⚙️ Prérequis

- Python 3.10+
- Docker + Docker Compose
- PostgreSQL (via Docker)
- Hugging Face account (token requis)

---

# 📦 Installation locale (sans Docker)

## 1. Cloner le projet

```bash
git clone https://github.com/your-repo.git
cd your-repo
```

## 2. Créer un environnement virtuel
```bash
python -m venv venv
```


## Activer
### Linux/mac

```bash
source venv/bin/activate
```

### Windows
```bash
venv\Scripts\activate
```


## 3. Installer les dépendances

```bash
pip install -r requirements.txt

```

---
## 4. Créer un fichier .env à la racine

```
DATABASE_URL=postgresql+psycopg://admin:password@localhost:5432/fastapi_db

SECRET_KEY=
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=500

HF_TOKEN=

HF_MODEL_ASR=
HF_MODEL_LORA=
```


## 5. Lancer Docker

```
docker compose up --build
```
## Allez sur 

http://localhost:8000

### Pour voir les endpoints allez sur 
http://localhost:8000/docs