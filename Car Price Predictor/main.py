from flask import Flask, request, render_template
import pandas as pd
import joblib
import numpy as np

app = Flask(__name__)

# Load trained model + scaler
model = joblib.load("best_car_price_model.pkl")
scaler = joblib.load("scaler.pkl")
feature_columns = joblib.load("feature_columns.pkl")  # saved from trainer

# Load CSV for car name autocomplete
df = pd.read_csv("car.csv")
car_names = sorted(df["Car_Name"].unique())

@app.route("/", methods=["GET"])
def home():
    return render_template("index.html", car_names=car_names)

@app.route("/predict", methods=["POST"])
def predict():
    try:
        # Get input from frontend
        car_name = request.form["Car_Name"]
        car_age = int(request.form["Car_Age"])
        present_price = float(request.form["Present_Price"])
        kms_driven = int(request.form["Kms_Driven"])
        owner = int(request.form["Owner"])
        fuel_type = request.form["Fuel_Type"]
        seller_type = request.form["Seller_Type"]
        transmission = request.form["Transmission"]

        # Build input DataFrame
        input_data = pd.DataFrame({
            "Present_Price": [present_price],
            "Kms_Driven": [kms_driven],
            "Owner": [owner],
            "Car_Age": [car_age],
            "Fuel_Type_Diesel": [1 if fuel_type == "Diesel" else 0],
            "Fuel_Type_Petrol": [1 if fuel_type == "Petrol" else 0],
            "Seller_Type_Individual": [1 if seller_type == "Individual" else 0],
            "Transmission_Manual": [1 if transmission == "Manual" else 0]
        })

        # Add missing columns from training
        for col in feature_columns:
            if col not in input_data.columns:
                input_data[col] = 0

        # Reorder columns to match training
        input_data = input_data[feature_columns]

        # Scale input
        scaled_input = scaler.transform(input_data)

        # Predict
        predicted_price = model.predict(scaled_input)[0]

        print("Input DataFrame sent to model:\n", input_data)
        print(f"Predicted Price: ₹{predicted_price:.2f} Lakh")

        return render_template(
            "index.html",
            car_names=car_names,
            prediction_text=f"🚗 Estimated Selling Price: ₹{round(predicted_price, 2)} Lakh"
        )

    except Exception as e:
        print("⚠️ Error during prediction:", str(e))
        return render_template(
            "index.html",
            car_names=car_names,
            prediction_text=f"⚠️ Error: {str(e)}"
        )

if __name__ == "__main__":
    app.run(debug=True)
