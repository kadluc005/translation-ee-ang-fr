import torch
import torchaudio
import soundfile as sf

from .model import get_model

async def transcribe(path):
    processor, model = get_model()

    speech, sr = sf.read(path)
    speech = torch.tensor(speech).float()
    
    if sr != 16000:
        speech = torchaudio.functional.resample(speech, sr, 16000)

    inputs = processor(speech.squeeze().numpy(), sampling_rate=16000, return_tensors="pt")

    with torch.inference_mode():
        logits = model(**inputs).logits

    pred = torch.argmax(logits, dim=-1)

    text = processor.batch_decode(pred, skip_special_tokens=True)[0]

    return text