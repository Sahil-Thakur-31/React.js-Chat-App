import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OneHotEncoder
from sklearn.ensemble import RandomForestRegressor
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
import joblib

# Load dataset
df = pd.read_csv("indian_flight_delays_100k.csv")

# Features and Target
X = df[["Airline", "Origin", "Destination", "DayOfWeek", 
        "ScheduledDeparture", "DistanceKM", "Weather"]]
y = df["DepDelayMinutes"]

# Define categorical and numerical columns
categorical_features = ["Airline", "Origin", "Destination", "Weather"]
numeric_features = ["DayOfWeek", "ScheduledDeparture", "DistanceKM"]

# Preprocessor: OneHot for categorical, passthrough numeric
preprocessor = ColumnTransformer(
    transformers=[
        ("cat", OneHotEncoder(handle_unknown="ignore"), categorical_features),
    ],
    remainder="passthrough"  # keep numeric features
)

# Define model pipeline
model = Pipeline([
    ("preprocessor", preprocessor),
    ("regressor", RandomForestRegressor(
        n_estimators=200,
        random_state=42,
        n_jobs=-1
    ))
])

# Split data
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Train model
print("⏳ Training model...")
model.fit(X_train, y_train)
print("✅ Training complete")

# Save model
joblib.dump(model, "flight_delay_model.pkl")
print("💾 Model saved as flight_delay_model.pkl")

# Quick evaluation
score = model.score(X_test, y_test)
print(f"📊 Model R² score on test data: {score:.3f}")
