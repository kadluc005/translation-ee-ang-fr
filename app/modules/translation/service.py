import torch
from .model import load_model

TARGETS = {
    "en": "eng_Latn",
    "fr": "fra_Latn",
    "ee": "ewe_Latn"
}


def translate(text: str, source: str, target: str):

    tokenizer, model = load_model()

    tokenizer.src_lang = TARGETS[source]

    inputs = tokenizer(text, return_tensors="pt")

    with torch.inference_mode():
        outputs = model.generate(
            **inputs,
            forced_bos_token_id=tokenizer.convert_tokens_to_ids(
                TARGETS[target]
            ),
            max_new_tokens=80,
            num_beams=1
        )

    return tokenizer.batch_decode(
        outputs,
        skip_special_tokens=True
    )[0]