from transformers import AutoProcessor, Wav2Vec2ForCTC
import os

MODEL = os.getenv("HF_MODEL_ASR")
TOKEN = os.getenv("HF_TOKEN")

processor=None
model=None


def get_model():
    global processor
    global model

    if model is None:
        print("LOADING ASR...")

        processor = AutoProcessor.from_pretrained(MODEL, token=TOKEN)
        model = Wav2Vec2ForCTC.from_pretrained(MODEL, token=TOKEN)
        model.eval()

        print('ASR READY !!')

    return processor, model