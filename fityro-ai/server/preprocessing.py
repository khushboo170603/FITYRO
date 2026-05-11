# preprocessing.py

import cv2
import numpy as np
from PIL import Image

# ✅ existing function (keep it)
def crop_upper_body(image_path, output_path="temp/upper_body.png"):
    image = cv2.imread(image_path)
    h, w, _ = image.shape

    upper_body = image[0:int(h * 0.6), :]
    cv2.imwrite(output_path, upper_body)

    return output_path


# 🔥 ADD THIS NEW FUNCTION
def generate_mask(image: Image.Image):
    """
    Simple mask for upper body (t-shirt region)
    """

    img = np.array(image)

    # convert to grayscale
    gray = cv2.cvtColor(img, cv2.COLOR_RGB2GRAY)

    # threshold (detect body)
    _, mask = cv2.threshold(gray, 200, 255, cv2.THRESH_BINARY_INV)

    # keep only upper body
    h, w = mask.shape
    mask[int(h * 0.5):, :] = 0

    # smooth mask
    mask = cv2.GaussianBlur(mask, (15, 15), 0)

    return Image.fromarray(mask)