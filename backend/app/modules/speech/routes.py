import os
import tempfile

from fastapi import APIRouter, UploadFile

from .service import transcribe

router = APIRouter(prefix="/speech")


@router.post("/transcribe")
async def speech_to_text(file: UploadFile):
    data = await file.read()

    # Write to a temp file and **close** it before handing the path to
    # soundfile. Keeping the file handle open (inside a `with` block) means
    # the OS write-buffer may not be fully flushed when soundfile opens the
    # same path, leading to incomplete or empty reads.
    tmp = tempfile.NamedTemporaryFile(delete=False, suffix=".wav")
    try:
        tmp.write(data)
        tmp.flush()
        tmp.close()
        text = await transcribe(tmp.name)
        return {"text": text}
    finally:
        os.unlink(tmp.name)