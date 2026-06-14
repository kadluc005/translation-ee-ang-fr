from pydantic import BaseModel


class TranslationRequest(BaseModel):

    text: str

    source: str

    target: str