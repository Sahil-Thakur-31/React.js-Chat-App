import pandas as pd
import numpy as np

# -------------------------------
# Configuration
# -------------------------------
num_per_bracket = 100  # number of cars per price bracket

# Example list of car models
car_names = [
    "Fortuner", "Nexon", "Creta", "Swift", "Sonet", "Altroz", "City", "Verna", "i20", "Polo",
    "XUV500", "Baleno", "Ecosport", "Harrier", "Innova", "Jazz", "Kwid", "Rapid", "Seltos", "Tiago",
    "Triber", "Vento", "Venue", "Ciaz", "Brezza", "CLA", "Q3", "Q5", "Carnival", "Figo",
    "Octavia", "Polo GT", "Fortuner Leg", "E Class", "BMW 3 Series", "BMW X1", "Mercedes C Class",
    "XUV300", "Thar", "Scorpio", "Compass", "Tucson", "Sonata", "Tata Hexa", "Karoq", "Harrier X", 
    "MG Hector", "MG ZS", "Hyundai Aura", "Elantra", "Tata Punch", "Maruti Ertiga", "Toyota Yaris",
    "Honda WRV", "Honda Amaze", "Honda City ZX", "Maruti Celerio", "Maruti Wagon R", "Maruti Alto",
    "Maruti Dzire", "Toyota Corolla", "Toyota Innova Crysta", "Mahindra XUV700", "Mahindra XUV3XO", "Mahindra Bolero",
    "Mahindra Thar 2020", "Hyundai Creta SX", "Hyundai Venue SX", "Hyundai Tucson GLS", "Kia Carnival",
    "Kia Seltos GTX", "Audi A4", "Audi Q7", "BMW X5", "Mercedes GLC", "Jaguar F-Pace", "Land Rover Discovery",
    "Range Rover Evoque", "Volkswagen Tiguan", "Skoda Superb", "Skoda Octavia RS", "Ford EcoSport Titanium",
    "Ford Endeavour", "Renault Duster", "Renault Kiger", "MG Gloster", "Nissan Kicks", "Nissan Magnite",
    "Tata Harrier", "Tata Nexon EV", "Tesla Model 3", "Tesla Model Y", "Volvo XC90", "Volvo XC60", "Mahindra Marazzo",
    "Toyota Fortuner Legender", "Toyota Yaris Cross", "Honda Civic", "Honda CRV", "Hyundai Sonata", "Hyundai Tucson Elite",
    "Kia Carens", "Kia Sonet X", "Volkswagen Polo GT", "Volkswagen Vento GT", "Skoda Kushaq", "Skoda Slavia"
]

fuel_types = ["Petrol", "Diesel", "CNG"]
transmissions = ["Manual", "Automatic"]
owners = [0, 1, 2]

# -------------------------------
# Price Bracket Distribution
# -------------------------------
brackets = [
    (0, 10), (10, 20), (20, 30), (30, 40), (40, 50),
    (50, 60), (60, 70), (70, 80), (80, 90), (90, 100), (100, 500)
]

# -------------------------------
# Data Generation
# -------------------------------
np.random.seed(42)
all_data = []

for low, high in brackets:
    for _ in range(num_per_bracket):
        car_name = np.random.choice(car_names)
        car_age = np.random.randint(0, 16)
        kms_driven = np.random.randint(1000, 200_000)
        fuel_type = np.random.choice(fuel_types)
        transmission = np.random.choice(transmissions)
        owner = np.random.choice(owners)
        
        # Selling price calculation
        selling_price = low + (high - low) * np.random.random()  # Random price within the bracket
        selling_price *= (0.8 ** car_age)  # Depreciation based on age
        selling_price *= (1 - kms_driven / 300_000)  # Depreciation based on mileage
        if fuel_type == "Diesel":
            selling_price *= 1.05  # Diesel cars might have a higher resale value
        if transmission == "Automatic":
            selling_price *= 1.1  # Automatic transmission adds value
        if owner > 0:
            selling_price *= 0.9 ** owner  # Multiple owners reduce value
        selling_price += np.random.normal(0, 0.5)  # Adding noise
        selling_price = round(max(selling_price, 0.2), 2)  # Ensuring non-negative price
        
        all_data.append([
            car_name, car_age, selling_price, kms_driven, fuel_type, transmission, owner
        ])

columns = ["Car_Name", "Car_Age", "Selling_Price", "Kms_Driven", "Fuel_Type", "Transmission", "Owner"]
df = pd.DataFrame(all_data, columns=columns)

# -------------------------------
# Save to CSV
# -------------------------------
df.to_csv("car.csv", index=False)
print("✅ Synthetic dataset created: car.csv")
print(df.head())
