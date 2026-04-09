# 🤖 Aarogya Mitra - ML Service (Flask)

The intelligence layer of the project, providing real-time disease risk assessment.

## 📊 Model Details
- **Target:** Heart Disease Prediction.
- **Algorithm:** Random Forest Classifier.
- **Accuracy:** ~92%.
- **Input:** 13 clinical parameters (e.g., age, trestbps, chol, thalach).

## 🚀 API Endpoints
- `POST /predict`: Generate risk assessment from clinical data.
- `GET /health`: Service status monitor.
- `GET /model-info`: Metadata about the trained model version.

## 🛠️ Internal Logic
1. **Preprocessing:** Feature scaling using `StandardScaler`.
2. **Inference:** Parallel processing via the Random Forest ensemble.
3. **Categorization:** Mapping probability scores to Low/Medium/High risk.

## 🚦 Local Setup
1. `cd ml-service`
2. `pip install -r requirements.txt`
3. `python app.py` (Runs on port 5001)

> **Note**: For a full-system launch (Backend + Frontend + ML), use the **`start-app.bat`** orchestrator in the project root.
