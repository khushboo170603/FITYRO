import pandas as pd
from sklearn.ensemble import RandomForestClassifier
import joblib

# Load dataset
df = pd.read_csv("size_data.csv")

# Features and labels
X = df[['height', 'weight', 'chest', 'waist', 'hip']]
y = df['size']

# Train model
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X, y)

# Save model
joblib.dump(model, "size_model.pkl")

print("✅ Model trained and saved as size_model.pkl")
