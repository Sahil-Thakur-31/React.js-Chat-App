# ============================================
# 🚗 Car Price Prediction Model Trainer (RandomForest)
# ============================================

import pandas as pd
import numpy as np
import warnings
warnings.filterwarnings("ignore")

from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import r2_score, mean_absolute_error, mean_squared_error
import joblib

# ===============================
# 1️⃣ Load and Prepare the Dataset
# ===============================
print("🔹 Loading dataset...\n")
df = pd.read_csv("car.csv")

print("✅ Dataset loaded successfully!")
print(f"Shape: {df.shape}")
print(df.head(), "\n")

# ===============================
# 2️⃣ Feature Engineering
# ===============================
# One-hot encode categorical features
df = pd.get_dummies(df, drop_first=True)

# Separate input and output
X = df.drop(["Selling_Price", "Car_Name"], axis=1, errors="ignore")
y = df["Selling_Price"]

# Save feature columns for later use in Flask
feature_columns = X.columns
joblib.dump(feature_columns, "feature_columns.pkl")
print(f"✅ Feature columns saved ({len(feature_columns)} features)")

# ===============================
# 3️⃣ Train-Test Split
# ===============================
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)
print(f"Training samples: {len(X_train)}, Testing samples: {len(X_test)}\n")

# ===============================
# 4️⃣ Scaling
# ===============================
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# ===============================
# 5️⃣ Model Definition + Grid Search
# ===============================
print("🔹 Training RandomForest with GridSearchCV...")

rf_params = {
    "n_estimators": [100, 200],
    "max_depth": [10, 15, 20],
    "min_samples_split": [2, 5],
}

rf_grid = GridSearchCV(
    RandomForestRegressor(random_state=42),
    rf_params,
    cv=3,
    scoring="r2",
    n_jobs=1,
    verbose=1
)
rf_grid.fit(X_train_scaled, y_train)

best_model = rf_grid.best_estimator_
print(f"✅ Best RandomForest Parameters: {rf_grid.best_params_}\n")

# ===============================
# 6️⃣ Model Evaluation
# ===============================
y_pred = best_model.predict(X_test_scaled)

r2 = r2_score(y_test, y_pred)
mae = mean_absolute_error(y_test, y_pred)
rmse = np.sqrt(mean_squared_error(y_test, y_pred))

print("📊 Model Performance")
print(f"R² Score: {r2:.3f}")
print(f"MAE: {mae:.3f}")
print(f"RMSE: {rmse:.3f}")
print("-" * 40)

# ===============================
# 7️⃣ Save Model + Scaler
# ===============================
joblib.dump(best_model, "best_car_price_model.pkl")
joblib.dump(scaler, "scaler.pkl")
print("✅ Model and Scaler saved successfully!\n")

# ===============================
# 8️⃣ Sample Prediction
# ===============================
sample = X_test.iloc[[0]]
sample_scaled = scaler.transform(sample)
pred_price = best_model.predict(sample_scaled)[0]

print("🚘 Sample Prediction:")
print("Features:", sample.to_dict(orient="records")[0])
print(f"Predicted Selling Price: ₹{round(pred_price, 2)} Lakh")
