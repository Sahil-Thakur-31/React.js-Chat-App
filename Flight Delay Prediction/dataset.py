# generate_dataset.py
import pandas as pd
import random
import numpy as np

# Airports in India
airports = ["DEL", "BOM", "BLR", "HYD", "MAA", "CCU", "PNQ", "GOI", "AMD", "COK"]

# Airlines in India
airlines = ["IndiGo", "Air India", "SpiceJet", "Vistara", "Go First", "Akasa Air", "AirAsia India"]

# Weather conditions
weather_conditions = ["Clear", "Rain", "Fog", "Thunderstorm", "Windy"]

# Function to generate random time in HHMM format
def random_time():
    hour = random.randint(0, 23)
    minute = random.choice([0, 15, 30, 45])
    return hour * 100 + minute

# Generate synthetic dataset
rows = []
for _ in range(100000):
    origin = random.choice(airports)
    dest = random.choice([a for a in airports if a != origin])
    airline = random.choice(airlines)
    day_of_week = random.randint(1, 7)
    scheduled_dep = random_time()
    distance = random.randint(200, 2500)
    weather = random.choice(weather_conditions)

    # Simulate delays based on weather and congestion
    base_delay = np.random.normal(5, 15)  # avg 5 min, std 15
    if weather in ["Rain", "Fog", "Thunderstorm"]:
        base_delay += random.randint(10, 60)
    if scheduled_dep in range(1700, 2100):  # evening congestion
        base_delay += random.randint(5, 20)

    dep_delay = max(0, int(base_delay))  # no negative delay

    rows.append([
        airline, origin, dest, day_of_week, scheduled_dep,
        distance, weather, dep_delay
    ])

# Create DataFrame
df = pd.DataFrame(rows, columns=[
    "Airline", "Origin", "Destination", "DayOfWeek",
    "ScheduledDeparture", "DistanceKM", "Weather", "DepDelayMinutes"
])

# Save CSV
df.to_csv("indian_flight_delays_100k.csv", index=False)
print("✅ Dataset with 100,000 rows saved as indian_flight_delays_100k.csv")
