from dotenv import load_dotenv

load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.database import Base, engine

from app.modules.users.routes import router as user_router
Base.metadata.create_all(bind=engine)

from app.modules.translation.routes import router as translation_router
from app.modules.speech.routes import router as speech_router
from app.modules.tts.routes import router as tts_router


app = FastAPI()

# CORS: allow the React frontend (Vite dev server and Nginx container) to call the API.
# In production the frontend is served same-origin via Nginx (/api proxy), so this is a safety net.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:8080",
        "http://127.0.0.1:8080",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user_router)
app.include_router(translation_router)
app.include_router(speech_router)
app.include_router(tts_router)


@app.on_event("startup")
def warmup_translation_model():
    """Pre-load the translation model so the first user request is not slow."""
    from app.modules.translation.model import load_model
    load_model()
# @app.on_event("startup")
# def startup():
#     from app.modules.translation.model import load_model
#     load_model()

@app.get("/")
def read_root():
    return {"hello": "world"}