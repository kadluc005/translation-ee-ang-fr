from transformers import VitsModel, AutoTokenizer
import os

TOKEN = os.getenv("HF_TOKEN")

# Public MMS-VITS checkpoints — one per language, same model family as the Éwé
# TTS used in the original Streamlit app. All three produce natural-sounding
# speech; no browser SpeechSynthesis fallback is needed.
MODEL_REPOS: dict[str, str] = {
    "ee": os.getenv("HF_MODEL_TTS_EE", "facebook/mms-tts-ewe"),
    "en": os.getenv("HF_MODEL_TTS_EN", "facebook/mms-tts-eng"),
    "fr": os.getenv("HF_MODEL_TTS_FR", "facebook/mms-tts-fra"),
}

# Lazy-loaded cache: populated on first request per language.
_cache: dict[str, dict] = {}


def get_model(lang: str = "ee") -> tuple:
    if lang not in _cache:
        repo = MODEL_REPOS[lang]
        print(f"LOADING TTS ({lang}) from {repo}...")
        tokenizer = AutoTokenizer.from_pretrained(repo, token=TOKEN)
        model = VitsModel.from_pretrained(repo, token=TOKEN)
        model.eval()
        _cache[lang] = {"tokenizer": tokenizer, "model": model}
        print(f"TTS ({lang}) READY !!")

    return _cache[lang]["tokenizer"], _cache[lang]["model"]
