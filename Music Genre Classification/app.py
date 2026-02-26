# Flask backend with improved error handling and percent display
from flask import Flask, render_template, request, redirect, url_for, flash
import os, io, pickle
import numpy as np
import pandas as pd
import librosa
import soundfile as sf
from pathlib import Path

app = Flask(__name__)
app.secret_key = 'replace-this-with-a-secure-key'

BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = BASE_DIR / 'music_genre_classifier.pkl'
FEATURES_CSV = BASE_DIR / 'data' / 'features_30_sec.csv'

# Load model
if not MODEL_PATH.exists():
    print("⚠️ Model file not found. Place 'music_genre_classifier.pkl' in the project root.")
    MODEL = None
else:
    with open(MODEL_PATH, 'rb') as f:
        MODEL = pickle.load(f)
    print("✅ Model loaded successfully.")

# Load reference feature columns
if FEATURES_CSV.exists():
    ref_df = pd.read_csv(FEATURES_CSV)
    FEATURE_COLUMNS = [c for c in ref_df.columns if c not in ['filename', 'length', 'label']]
    print(f"✅ Loaded {len(FEATURE_COLUMNS)} feature columns from CSV.")
else:
    FEATURE_COLUMNS = None

# ===== Feature Extraction Function =====
def extract_features_from_audio_file(file_bytes):
    import tempfile, librosa, numpy as np, warnings

    warnings.filterwarnings("ignore", category=FutureWarning)

    with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as tmp:
        tmp.write(file_bytes)
        tmp_path = tmp.name

    y, sr = librosa.load(tmp_path, sr=None, mono=True)

    # Pad/trim to 30 sec
    target_len = sr * 30
    if len(y) < target_len:
        y = np.pad(y, (0, target_len - len(y)))
    else:
        y = y[:target_len]

    chroma_stft = librosa.feature.chroma_stft(y=y, sr=sr)
    rms = librosa.feature.rms(y=y)
    spec_cent = librosa.feature.spectral_centroid(y=y, sr=sr)
    spec_bw = librosa.feature.spectral_bandwidth(y=y, sr=sr)
    rolloff = librosa.feature.spectral_rolloff(y=y, sr=sr)
    zcr = librosa.feature.zero_crossing_rate(y)
    harmony, perceptr = librosa.effects.hpss(y)

    # Safe tempo extraction
    try:
        from librosa.feature.rhythm import tempo as librosa_tempo
    except ImportError:
        from librosa.beat import tempo as librosa_tempo

    tempo = librosa_tempo(y=y, sr=sr)[0]

    mfcc = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=20)

    features = [
        np.mean(chroma_stft), np.var(chroma_stft),
        np.mean(rms), np.var(rms),
        np.mean(spec_cent), np.var(spec_cent),
        np.mean(spec_bw), np.var(spec_bw),
        np.mean(rolloff), np.var(rolloff),
        np.mean(zcr), np.var(zcr),
        np.mean(harmony), np.var(harmony),
        np.mean(perceptr), np.var(perceptr),
        tempo
    ]

    for i in range(mfcc.shape[0]):
        mfcc_i = np.ravel(mfcc[i, :])
        features.append(np.mean(mfcc_i))
        features.append(np.var(mfcc_i))

    return np.array(features, dtype=np.float32).reshape(1, -1)

# ===== Routes =====
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    if MODEL is None:
        flash("Model not loaded.")
        return redirect(url_for('index'))

    file = request.files.get('audio_file')
    if not file or file.filename == '':
        flash('No audio file uploaded.')
        return redirect(url_for('index'))

    try:
        features = extract_features_from_audio_file(file.read())
        # convert to DataFrame for sklearn to avoid warnings
        if FEATURE_COLUMNS is not None:
            features_df = pd.DataFrame(features, columns=FEATURE_COLUMNS)
        else:
            features_df = pd.DataFrame(features)

        try:
            probs = MODEL.predict_proba(features_df)
            idx = np.argmax(probs)
            genre = MODEL.classes_[idx]
            prob_percent = f"{np.max(probs)*100:.1f}%"
        except Exception:
            genre = MODEL.predict(features_df)[0]
            prob_percent = 'N/A'

        return render_template('index.html', genre=genre, prob=prob_percent)

    except Exception as e:
        flash(f"Error processing file: {e}")
        return redirect(url_for('index'))

if __name__ == '__main__':
    app.run(debug=True)
