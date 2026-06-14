from dotenv import load_dotenv

load_dotenv()

from fastapi import FastAPI
from app.core.database import Base, engine

from app.modules.users.routes import router as user_router
Base.metadata.create_all(bind=engine)

from app.modules.translation.routes import router as translation_router
from app.modules.speech.routes import router as speech_router


app = FastAPI()
app.include_router(user_router)
app.include_router(translation_router)
app.include_router(speech_router)
# @app.on_event("startup")
# def startup():
#     from app.modules.translation.model import load_model
#     load_model()

@app.get("/")
def read_root():
    return {"hello": "world"}