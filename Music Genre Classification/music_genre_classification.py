"""
====================================================
🎵 MUSIC GENRE CLASSIFICATION PROJECT (GTZAN Dataset)
====================================================

Author  : Sahil
Subject : Data Science Mini Project
Dataset : GTZAN Music Genre Dataset (features_30_sec.csv)
Language: Python

This program trains a machine learning model to classify music genres
based on pre-extracted audio features from 30-second clips.

Genres Included:
Blues, Classical, Country, Disco, Hiphop, Jazz,
Metal, Pop, Reggae, Rock
====================================================
"""

# ====== 1. Import Required Libraries ======
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix,
)
import pickle
import os

# ====== 2. Load Dataset ======
print("📂 Loading dataset...")
data_path = os.path.join("data", "features_30_sec.csv")
df = pd.read_csv(data_path)

print(f"✅ Dataset loaded successfully! Shape: {df.shape}")
print("Available columns:", list(df.columns[:10]), "...")

# ====== 3. Prepare Features and Labels ======
print("\n🎯 Preparing features and labels...")

X = df.drop(["filename", "length", "label"], axis=1)
y = df["label"]

print("Number of features:", X.shape[1])
print("Unique genres:", y.unique())

# ====== 4. Split Data ======
print("\n✂️ Splitting dataset into training and test sets...")
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)
print("Training samples:", X_train.shape[0])
print("Testing samples :", X_test.shape[0])

# ====== 5. Train Model ======
print("\n🚀 Training Random Forest Classifier...")
model = RandomForestClassifier(n_estimators=200, random_state=42)
model.fit(X_train, y_train)
print("✅ Model training completed.")

# ====== 6. Evaluate Model ======
print("\n📊 Evaluating model performance...")
y_pred = model.predict(X_test)

accuracy = accuracy_score(y_test, y_pred)
print(f"\n🎯 Accuracy: {accuracy * 100:.2f}%")
print("\nDetailed Classification Report:")
print(classification_report(y_test, y_pred))

# ====== 7. Confusion Matrix Visualization ======
print("\n📉 Generating confusion matrix...")
cm = confusion_matrix(y_test, y_pred, labels=model.classes_)
plt.figure(figsize=(10, 8))
sns.heatmap(
    cm,
    annot=True,
    fmt="d",
    cmap="Blues",
    xticklabels=model.classes_,
    yticklabels=model.classes_,
)
plt.title("Confusion Matrix - Music Genre Classification")
plt.xlabel("Predicted Genre")
plt.ylabel("True Genre")
plt.tight_layout()
plt.show()

# ====== 8. Feature Importance (Top 10) ======
print("\n🔥 Displaying top 10 most important features...")
importances = model.feature_importances_
indices = np.argsort(importances)[::-1]
top_features = X.columns[indices[:10]]

plt.figure(figsize=(8, 5))
sns.barplot(x=importances[indices[:10]], y=top_features, palette="mako")
plt.title("Top 10 Most Important Audio Features")
plt.xlabel("Importance")
plt.ylabel("Feature")
plt.tight_layout()
plt.show()

# ====== 9. Save Model ======
print("\n💾 Saving trained model to file...")
model_path = "music_genre_classifier.pkl"
with open(model_path, "wb") as f:
    pickle.dump(model, f)
print(f"✅ Model saved successfully as {model_path}")

# ====== 10. Predict Sample ======
print("\n🎵 Predicting genre for a random sample...")
sample = X.sample(1, random_state=42)
predicted_genre = model.predict(sample)[0]
print(f"Predicted Genre: 🎧 {predicted_genre}")

print("\n✅ Music Genre Classification Completed Successfully!")
