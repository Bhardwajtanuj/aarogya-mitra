import joblib
import numpy as np
import os

MODEL_DIR = os.path.dirname(__file__)

class BasePredictor:
    model_type = 'Random Forest Classifier'

    def _load(self, model_file, scaler_file):
        mp = os.path.join(MODEL_DIR, model_file)
        sp = os.path.join(MODEL_DIR, scaler_file)
        if not os.path.exists(mp) or not os.path.exists(sp):
            raise FileNotFoundError(f"Model files not found: {model_file}, {scaler_file}. Run train_all_models.py first.")
        self.model = joblib.load(mp)
        self.scaler = joblib.load(sp)

    def predict(self, input_data):
        try:
            features = [input_data[f] for f in self.feature_names]
            arr = np.array(features).reshape(1, -1)
            scaled = self.scaler.transform(arr)
            prediction = self.model.predict(scaled)[0]
            probability = self.model.predict_proba(scaled)[0]
            disease_prob = float(probability[1])

            if disease_prob < 0.3:
                risk_level = 'low'
            elif disease_prob < 0.7:
                risk_level = 'medium'
            else:
                risk_level = 'high'

            return {
                'prediction': 'Positive' if prediction == 1 else 'Negative',
                'probability': disease_prob,
                'risk_level': risk_level,
                'confidence': float(max(probability))
            }
        except KeyError as e:
            raise ValueError(f"Missing required feature: {e}")
        except Exception as e:
            raise Exception(f"Prediction error: {str(e)}")


class HeartDiseasePredictor(BasePredictor):
    def __init__(self):
        self.feature_names = ['age','sex','cp','trestbps','chol','fbs','restecg','thalach','exang','oldpeak','slope','ca','thal']
        self._load('heart_disease_model.pkl', 'scaler.pkl')


class DiabetesPredictor(BasePredictor):
    def __init__(self):
        self.feature_names = ['pregnancies','glucose','bloodPressure','skinThickness','insulin','bmi','diabetesPedigreeFunction','age']
        self._load('diabetes_model.pkl', 'diabetes_scaler.pkl')


class ThyroidPredictor(BasePredictor):
    def __init__(self):
        self.feature_names = ['age','sex','on_thyroxine','tsh','t3','tt4','t4u','fti']
        self._load('thyroid_model.pkl', 'thyroid_scaler.pkl')
