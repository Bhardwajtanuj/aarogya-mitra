import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
import joblib
import os

# Create sample heart disease dataset
def create_sample_data():
    """Create sample heart disease data for training"""
    np.random.seed(42)
    n_samples = 500
    
    data = {
        'age': np.random.randint(30, 80, n_samples),
        'sex': np.random.randint(0, 2, n_samples),
        'cp': np.random.randint(0, 4, n_samples),
        'trestbps': np.random.randint(90, 200, n_samples),
        'chol': np.random.randint(150, 400, n_samples),
        'fbs': np.random.randint(0, 2, n_samples),
        'restecg': np.random.randint(0, 3, n_samples),
        'thalach': np.random.randint(80, 200, n_samples),
        'exang': np.random.randint(0, 2, n_samples),
        'oldpeak': np.random.uniform(0, 6, n_samples),
        'slope': np.random.randint(0, 3, n_samples),
        'ca': np.random.randint(0, 5, n_samples),
        'thal': np.random.randint(0, 4, n_samples)
    }
    
    df = pd.DataFrame(data)
    
    # Create target based on risk factors
    df['target'] = (
        (df['age'] > 55).astype(int) +
        (df['cp'] > 1).astype(int) +
        (df['trestbps'] > 140).astype(int) +
        (df['chol'] > 240).astype(int) +
        (df['thalach'] < 120).astype(int) +
        (df['oldpeak'] > 2).astype(int)
    )
    df['target'] = (df['target'] >= 3).astype(int)
    
    return df

def train_model():
    """Train heart disease prediction model"""
    print("Creating sample dataset...")
    df = create_sample_data()
    
    # Save sample data
    os.makedirs('../data', exist_ok=True)
    df.to_csv('../data/heart_disease_sample.csv', index=False)
    print(f"Sample data saved: {len(df)} records")
    
    # Prepare features and target
    X = df.drop('target', axis=1)
    y = df['target']
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )
    
    # Scale features
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    # Train model
    print("Training Random Forest model...")
    model = RandomForestClassifier(
        n_estimators=100,
        max_depth=10,
        random_state=42,
        n_jobs=-1
    )
    model.fit(X_train_scaled, y_train)
    
    # Evaluate
    train_score = model.score(X_train_scaled, y_train)
    test_score = model.score(X_test_scaled, y_test)
    
    print(f"Training accuracy: {train_score:.4f}")
    print(f"Testing accuracy: {test_score:.4f}")
    
    # Save model and scaler
    os.makedirs('.', exist_ok=True)
    joblib.dump(model, 'heart_disease_model.pkl')
    joblib.dump(scaler, 'scaler.pkl')
    
    print("✅ Model and scaler saved successfully!")
    print("   - heart_disease_model.pkl")
    print("   - scaler.pkl")
    
    return model, scaler

if __name__ == '__main__':
    train_model()
