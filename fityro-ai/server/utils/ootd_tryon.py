from gradio_client import Client, handle_file
import os
import uuid
import shutil

client = Client("levihsu/OOTDiffusion")
print(client.view_api())

def run_ootd_tryon(person_path, cloth_path, category):

    if not os.path.exists(person_path):
        raise Exception(f"Person image not found: {person_path}")
    if not os.path.exists(cloth_path):
        raise Exception(f"Cloth image not found: {cloth_path}")
    print("PERSON:", person_path)
    print("CLOTH:", cloth_path)
    print("CATEGORY:", category)
    result = client.predict(
    handle_file(person_path),   # model image
    handle_file(cloth_path),    # cloth image
    1,                          # n_samples
    40,                         # n_steps
    2.0,                        # image_scale ✅ ADD THIS
    -1,                         # seed
    api_name="/process_hd"
)

    print("✅ RESULT:", result)

    image_path = result[0]["image"]

    os.makedirs("temp", exist_ok=True)
    output_path = f"temp/{uuid.uuid4()}.png"
    shutil.copy(image_path, output_path)

    return output_path