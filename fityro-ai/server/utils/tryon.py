# utils/tryon.py

from PIL import Image, ImageFilter
import sys
import os
import numpy as np
import torch

# 🔥 Fix import path
sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from preprocessing import generate_mask
from diffusers import StableDiffusionInpaintPipeline

pipe = None

# ------------------ LOAD PIPELINE ------------------
def get_pipeline():
    global pipe

    if pipe is None:
        device = "cuda" if torch.cuda.is_available() else "cpu"

        pipe = StableDiffusionInpaintPipeline.from_pretrained(
            "runwayml/stable-diffusion-inpainting",
            torch_dtype=torch.float32 if device == "cuda" else torch.float32,
        )

        if device == "cuda":
            pipe.enable_attention_slicing()

        pipe = pipe.to(device)
        pipe.safety_checker = None

    return pipe


# ------------------ MAIN TRY-ON FUNCTION ------------------
def run_tryon(person_path, cloth_path):

    os.makedirs("temp", exist_ok=True)

    person = Image.open(person_path).convert("RGB").resize((512,512))
    cloth = Image.open(cloth_path).convert("RGB").resize((512,512))

    # ------------------ MASK FIX ------------------
    mask = generate_mask(person)
    mask = mask.convert("L")

    mask_np = np.array(mask)

    # 🔥 Focus only on torso region (shirt area)
    h, w = mask_np.shape

    mask_np[:int(0.22*h), :] = 0        # remove head
    mask_np[int(0.52*h):, :] = 0        # remove legs
    mask_np[:, :int(0.18*w)] = 0        # remove left side
    mask_np[:, int(0.82*w):] = 0        # remove right side
    expanded = np.copy(mask_np)

    for i in range(2):  # increase iterations if needed
        expanded[:-1, :] = np.maximum(expanded[:-1, :], mask_np[1:, :])
        expanded[1:, :]  = np.maximum(expanded[1:, :], mask_np[:-1, :])
        expanded[:, :-1] = np.maximum(expanded[:, :-1], mask_np[:, 1:])
        expanded[:, 1:]  = np.maximum(expanded[:, 1:], mask_np[:, :-1])
        mask_np = expanded.copy()
    # Binary mask
    mask_np = (mask_np > 127).astype(np.uint8) * 255

    mask = Image.fromarray(mask_np)
    mask = mask.filter(ImageFilter.GaussianBlur(6))
    mask = mask.resize((512, 512))

    # Save debug
    mask.save("temp/debug_mask.png")
    person.save("temp/debug_person.png")

    # ------------------ COLOR EXTRACTION ------------------
    cloth_np = np.array(cloth)
    avg_color = cloth_np.mean(axis=(0,1)).astype(int)

    if avg_color.mean() > 200:
        color = "light gray"
    elif avg_color[0] > avg_color[1] and avg_color[0] > avg_color[2]:
        color = "red"
    elif avg_color[1] > avg_color[0] and avg_color[1] > avg_color[2]:
        color = "green"
    else:
        color = "blue"

    # ------------------ SMART PROMPT ------------------
    prompt = f"a realistic high quality plain {color} cotton t-shirt with natural folds, worn by a person, detailed fabric texture"

    # ------------------ RUN MODEL ------------------
    pipe_instance = get_pipeline()

    result = pipe_instance(
        prompt=prompt,
        image=person,
        mask_image=mask,
        num_inference_steps=20,
        guidance_scale=9
    ).images[0]

    # ------------------ SAVE OUTPUT ------------------
    output_path = "temp/output.png"
    result.save(output_path)

    return output_path