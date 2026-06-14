from fastapi import APIRouter
from .service import translate

router = APIRouter(prefix="/translation")


@router.post("/")
def translate_text(body: dict):

    return {
        "translation": translate(
            body["text"],
            body["source"],
            body["target"]
        )
    }