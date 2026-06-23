import io

import torch
import soundfile as sf

from .model import get_model


def synthesize(text: str, lang: str = "ee") -> bytes:
    """Generate speech for `text` in `lang` (ee/en/fr) and return WAV bytes."""
    text = text.strip()
    if not text:
        raise ValueError("Text must not be empty.")

    tokenizer, model = get_model(lang)
    inputs = tokenizer(text, return_tensors="pt")

    with torch.inference_mode():
        waveform = model(**inputs).waveform

    audio = waveform.squeeze().cpu().numpy()
    sampling_rate = model.config.sampling_rate

    buffer = io.BytesIO()
    sf.write(buffer, audio, sampling_rate, format="WAV")
    buffer.seek(0)
    return buffer.read()
