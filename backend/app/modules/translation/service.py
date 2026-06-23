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
    target_token_id = tokenizer.convert_tokens_to_ids(TARGETS[target])

    with torch.inference_mode():
        if target == "ee":
            # The LoRA adapter was fine-tuned on Éwé-as-source pairs (ee→en,
            # ee→fr). When Éwé is the *target* language, the adapter biases
            # the decoder against generating Éwé text. Disabling it for this
            # direction lets the base NLLB model handle the translation, which
            # produces correct Éwé output.
            with model.disable_adapter():
                outputs = model.generate(
                    **inputs,
                    forced_bos_token_id=target_token_id,
                    max_new_tokens=80,
                    num_beams=4,
                )
        else:
            outputs = model.generate(
                **inputs,
                forced_bos_token_id=target_token_id,
                max_new_tokens=80,
                num_beams=1,
            )

    return tokenizer.batch_decode(outputs, skip_special_tokens=True)[0]