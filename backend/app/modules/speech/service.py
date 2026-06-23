import asyncio

import numpy as np
import torch
import torchaudio
import soundfile as sf

from .model import get_model


def _transcribe_sync(path: str) -> str:
    processor, model = get_model()

    # soundfile.read with dtype="float32" gives clean numpy float32 directly.
    audio, sr = sf.read(path, dtype="float32")
    waveform = torch.from_numpy(np.ascontiguousarray(audio))

    # Mix stereo (or any multi-channel) down to mono.
    if waveform.ndim == 2:
        waveform = waveform.mean(dim=1)

    if sr != 16000:
        waveform = torchaudio.functional.resample(waveform, sr, 16000)

    inputs = processor(
        waveform.numpy(), sampling_rate=16000, return_tensors="pt"
    )

    # Pass input_values explicitly (Streamlit-proven approach) to avoid
    # forwarding unexpected keys that some processor versions may include.
    with torch.inference_mode():
        logits = model(inputs.input_values).logits

    pred = torch.argmax(logits, dim=-1)
    return processor.batch_decode(pred, skip_special_tokens=True)[0]


async def transcribe(path: str) -> str:
    """Run ASR in a thread pool executor to avoid blocking the event loop."""
    loop = asyncio.get_event_loop()
    return await loop.run_in_executor(None, _transcribe_sync, path)