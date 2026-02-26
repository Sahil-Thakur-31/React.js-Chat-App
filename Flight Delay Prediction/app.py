from flask import Flask, render_template, request
import pandas as pd
import joblib

app = Flask(__name__)

# Load dataset & trained model
df = pd.read_csv("indian_flight_delays_100k.csv")
model = joblib.load("flight_delay_model.pkl")

# Dropdown values
airports = sorted(df["Origin"].unique())
airlines = sorted(df["Airline"].unique())
weathers = sorted(df["Weather"].unique())
days = [(i, ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"][i-1]) for i in range(1,8)]

@app.route("/", methods=["GET", "POST"])
def index():
    predicted_delay = None
    historical_delays = None

    if request.method == "POST":
        origin = request.form["origin"]
        destination = request.form["destination"]
        airline = request.form["airline"]
        day_of_week = int(request.form["day_of_week"])
        
        dep_time_str = request.form["dep_time"]  # e.g., "11:12"
        dep_time = int(dep_time_str.replace(":", ""))  # → 1112
        
        weather = request.form["weather"]

        # Historical records (latest 20 for route)
        historical_delays = df[
            (df["Origin"] == origin) & (df["Destination"] == destination)
        ][[
            "Airline", "ScheduledDeparture", "Weather", "DepDelayMinutes"
        ]].sample(20)

        # Median distance for this route
        distance = df[
            (df["Origin"] == origin) & (df["Destination"] == destination)
        ]["DistanceKM"].median()

        # Prepare input for prediction
        sample = pd.DataFrame([{
            "Airline": airline,
            "Origin": origin,
            "Destination": destination,
            "DayOfWeek": day_of_week,
            "ScheduledDeparture": dep_time,
            "DistanceKM": distance,
            "Weather": weather
        }])

        predicted_delay = round(model.predict(sample)[0], 2)

    return render_template(
        "index.html",
        airports=airports,
        airlines=airlines,
        weathers=weathers,
        days=days,
        predicted_delay=predicted_delay,
        historical_delays=historical_delays
    )

if __name__ == "__main__":
    app.run(debug=True)
