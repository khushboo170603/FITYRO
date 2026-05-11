import joblib
import os

# Load model once when server starts
MODEL_PATH = os.path.join(os.path.dirname(__file__), "..", "size_model.pkl")
model = joblib.load(MODEL_PATH)


def predict_size_from_model(data):
    input_data = [[
        data.height,
        data.weight,
        data.chest,
        data.waist,
        data.hip
    ]]
    
    prediction = model.predict(input_data)[0]

    probs = model.predict_proba(input_data)[0]
    confidence = max(probs)

    return {
        "size": prediction,
        "confidence": round(confidence * 100, 2)
    }
