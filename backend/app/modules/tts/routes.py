from fastapi import APIRouter, HTTPException
from fastapi.responses import Response
from pydantic import BaseModel
from typing import Literal

from .service import synthesize

router = APIRouter(prefix="/tts")

SUPPORTED_LANGS = {"ee", "en", "fr"}


class TTSRequest(BaseModel):
    text: str
    lang: Literal["ee", "en", "fr"] = "ee"


@router.post("/")
def text_to_speech(body: TTSRequest):
    if body.lang not in SUPPORTED_LANGS:
        raise HTTPException(status_code=400, detail=f"Unsupported lang: {body.lang}")
    try:
        audio = synthesize(body.text, body.lang)
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    return Response(content=audio, media_type="audio/wav")
