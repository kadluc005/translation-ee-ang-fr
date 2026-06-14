import os 

from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
from peft import PeftModel
import torch

BASE = "facebook/nllb-200-distilled-600M"
LORA = os.getenv("HF_MODEL_LORA")
TOKEN = os.getenv("HF_TOKEN")


tokenizer = None
model = None


def load_model():
    global tokenizer
    global model

    if model is None:
        print("🚀 Loading model (one time only)...")

        tokenizer = AutoTokenizer.from_pretrained(BASE)

        base_model = AutoModelForSeq2SeqLM.from_pretrained(BASE, token=TOKEN, low_cpu_mem_usage=True)

        model = PeftModel.from_pretrained(base_model, LORA, token=TOKEN)
        model.eval()

        print("✅ Model loaded")
    return tokenizer, model


# def get_model():
#     load_model()
#     return tokenizer, model