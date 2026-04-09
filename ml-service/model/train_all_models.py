"""
Train all disease prediction models:
- Heart Disease (RandomForest)
- Diabetes (GradientBoosting)
- Thyroid (RandomForest)
"""

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import accuracy_score, classification_report
import joblib
import os

MODEL_DIR = os.path.dirname(__file__)

def save_model(model, scaler, model_file, scaler_file):
    joblib.dump(model, os.path.join(MODEL_DIR, model_file))
    joblib.dump(scaler, os.path.join(MODEL_DIR, scaler_file))
    print(f"  Saved: {model_file}, {scaler_file}")


# ──────────────────────────────────────────
# 1. HEART DISEASE
# ──────────────────────────────────────────
def train_heart_disease():
    print("\n=== Training Heart Disease Model ===")
    np.random.seed(42)
    n = 800

    # Try to load real CSV first
    csv_path = os.path.join(os.path.dirname(MODEL_DIR), 'data', 'heart_disease_sample.csv')
    if os.path.exists(csv_path):
        df = pd.read_csv(csv_path)
        print(f"  Loaded real data: {len(df)} records")
    else:
        data = {
            'age': np.random.randint(30, 80, n),
            'sex': np.random.randint(0, 2, n),
            'cp': np.random.randint(0, 4, n),
            'trestbps': np.random.randint(90, 200, n),
            'chol': np.random.randint(150, 400, n),
            'fbs': np.random.randint(0, 2, n),
            'restecg': np.random.randint(0, 3, n),
            'thalach': np.random.randint(80, 200, n),
            'exang': np.random.randint(0, 2, n),
            'oldpeak': np.random.uniform(0, 6, n),
            'slope': np.random.randint(0, 3, n),
            'ca': np.random.randint(0, 5, n),
            'thal': np.random.randint(0, 4, n)
        }
        df = pd.DataFrame(data)
        df['target'] = ((df['age'] > 55).astype(int) + (df['cp'] > 1).astype(int) +
                        (df['trestbps'] > 140).astype(int) + (df['chol'] > 240).astype(int) +
                        (df['thalach'] < 120).astype(int) + (df['oldpeak'] > 2).astype(int))
        df['target'] = (df['target'] >= 3).astype(int)
        print(f"  Generated synthetic data: {n} records")

    features = ['age','sex','cp','trestbps','chol','fbs','restecg','thalach','exang','oldpeak','slope','ca','thal']
    X = df[features]; y = df['target']
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    scaler = StandardScaler()
    X_train_s = scaler.fit_transform(X_train)
    X_test_s = scaler.transform(X_test)

    model = RandomForestClassifier(n_estimators=100, max_depth=10, random_state=42, n_jobs=-1)
    model.fit(X_train_s, y_train)

    acc = accuracy_score(y_test, model.predict(X_test_s))
    print(f"  Test accuracy: {acc:.4f}")
    save_model(model, scaler, 'heart_disease_model.pkl', 'scaler.pkl')


# ──────────────────────────────────────────
# 2. DIABETES
# ──────────────────────────────────────────
def train_diabetes():
    print("\n=== Training Diabetes Model ===")
    np.random.seed(123)
    n = 768

    data = {
        'pregnancies': np.random.randint(0, 17, n),
        'glucose': np.random.randint(50, 200, n),
        'bloodPressure': np.random.randint(40, 130, n),
        'skinThickness': np.random.randint(0, 100, n),
        'insulin': np.random.randint(0, 850, n),
        'bmi': np.round(np.random.uniform(15, 65, n), 1),
        'diabetesPedigreeFunction': np.round(np.random.uniform(0.08, 2.5, n), 3),
        'age': np.random.randint(21, 81, n)
    }
    df = pd.DataFrame(data)
    df['target'] = (
        (df['glucose'] > 140).astype(int) +
        (df['bmi'] > 32).astype(int) +
        (df['age'] > 45).astype(int) +
        (df['insulin'] > 200).astype(int) +
        (df['diabetesPedigreeFunction'] > 1.0).astype(int)
    )
    df['target'] = (df['target'] >= 3).astype(int)
    print(f"  Generated diabetes data: {n} records, positive rate: {df['target'].mean():.2f}")

    features = ['pregnancies','glucose','bloodPressure','skinThickness','insulin','bmi','diabetesPedigreeFunction','age']
    X = df[features]; y = df['target']
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    scaler = StandardScaler()
    X_train_s = scaler.fit_transform(X_train)
    X_test_s = scaler.transform(X_test)

    model = GradientBoostingClassifier(n_estimators=100, max_depth=4, random_state=42)
    model.fit(X_train_s, y_train)

    acc = accuracy_score(y_test, model.predict(X_test_s))
    print(f"  Test accuracy: {acc:.4f}")
    save_model(model, scaler, 'diabetes_model.pkl', 'diabetes_scaler.pkl')


# ──────────────────────────────────────────
# 3. THYROID
# ──────────────────────────────────────────
def train_thyroid():
    print("\n=== Training Thyroid Model ===")
    np.random.seed(456)
    n = 600

    data = {
        'age': np.random.randint(18, 85, n),
        'sex': np.random.randint(0, 2, n),
        'on_thyroxine': np.random.randint(0, 2, n),
        'tsh': np.round(np.random.uniform(0.1, 40.0, n), 2),
        't3': np.round(np.random.uniform(0.5, 8.0, n), 2),
        'tt4': np.round(np.random.uniform(30, 350, n), 1),
        't4u': np.round(np.random.uniform(0.5, 2.5, n), 2),
        'fti': np.round(np.random.uniform(30, 350, n), 1)
    }
    df = pd.DataFrame(data)
    df['target'] = (
        (df['tsh'] > 10).astype(int) +
        (df['t3'] < 1.5).astype(int) +
        (df['tt4'] < 60).astype(int) +
        (df['fti'] < 60).astype(int) +
        (df['on_thyroxine'] == 1).astype(int)
    )
    df['target'] = (df['target'] >= 3).astype(int)
    print(f"  Generated thyroid data: {n} records, positive rate: {df['target'].mean():.2f}")

    features = ['age','sex','on_thyroxine','tsh','t3','tt4','t4u','fti']
    X = df[features]; y = df['target']
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    scaler = StandardScaler()
    X_train_s = scaler.fit_transform(X_train)
    X_test_s = scaler.transform(X_test)

    model = RandomForestClassifier(n_estimators=150, max_depth=8, random_state=42, n_jobs=-1)
    model.fit(X_train_s, y_train)

    acc = accuracy_score(y_test, model.predict(X_test_s))
    print(f"  Test accuracy: {acc:.4f}")
    save_model(model, scaler, 'thyroid_model.pkl', 'thyroid_scaler.pkl')


if __name__ == '__main__':
    print("🏥 Aarogya Mitra - Training All Disease Models")
    train_heart_disease()
    train_diabetes()
    train_thyroid()
    print("\n✅ All models trained and saved successfully!\n")
