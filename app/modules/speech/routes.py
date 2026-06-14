from fastapi import APIRouter, UploadFile

import tempfile
from .service import transcribe

router = APIRouter(prefix="/speech")

@router.post("/transcribe")
async def speech_to_text(file: UploadFile):

    with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as f:
        f.write(await file.read())
        path = f.name

        text = await transcribe(path)
        return {"text": text}