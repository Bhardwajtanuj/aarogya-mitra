from flask import Flask, request, jsonify
from flask_cors import CORS
from model.predict import HeartDiseasePredictor, DiabetesPredictor, ThyroidPredictor
import os

app = Flask(__name__)
CORS(app)

# Initialize predictors
predictors = {}

def load_predictors():
    try:
        predictors['heart'] = HeartDiseasePredictor()
        print("[OK] Heart Disease model loaded")
    except Exception as e:
        print(f"[WARN] Heart Disease model not loaded: {e}")

    try:
        predictors['diabetes'] = DiabetesPredictor()
        print("[OK] Diabetes model loaded")
    except Exception as e:
        print(f"[WARN] Diabetes model not loaded: {e}")

    try:
        predictors['thyroid'] = ThyroidPredictor()
        print("[OK] Thyroid model loaded")
    except Exception as e:
        print(f"[WARN] Thyroid model not loaded: {e}")

load_predictors()

@app.route('/', methods=['GET'])
def home():
    return jsonify({
        'success': True,
        'message': 'Aarogya Mitra ML Service v2.0',
        'models_loaded': list(predictors.keys()),
        'endpoints': ['/predict', '/predict/diabetes', '/predict/thyroid', '/health', '/model-info']
    })

@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        'success': True,
        'status': 'healthy',
        'models': {k: 'loaded' for k in predictors}
    })

@app.route('/predict', methods=['POST'])
def predict_heart():
    if 'heart' not in predictors:
        return jsonify({'success': False, 'message': 'Heart disease model not loaded'}), 503
    try:
        data = request.get_json()
        if not data:
            return jsonify({'success': False, 'message': 'No input data provided'}), 400
        result = predictors['heart'].predict(data)
        return jsonify({'success': True, **result})
    except ValueError as e:
        return jsonify({'success': False, 'message': str(e)}), 400
    except Exception as e:
        return jsonify({'success': False, 'message': f'Prediction error: {str(e)}'}), 500

@app.route('/predict/diabetes', methods=['POST'])
def predict_diabetes():
    if 'diabetes' not in predictors:
        return jsonify({'success': False, 'message': 'Diabetes model not loaded. Run train_all_models.py'}), 503
    try:
        data = request.get_json()
        if not data:
            return jsonify({'success': False, 'message': 'No input data provided'}), 400
        result = predictors['diabetes'].predict(data)
        return jsonify({'success': True, **result})
    except ValueError as e:
        return jsonify({'success': False, 'message': str(e)}), 400
    except Exception as e:
        return jsonify({'success': False, 'message': f'Prediction error: {str(e)}'}), 500

@app.route('/predict/thyroid', methods=['POST'])
def predict_thyroid():
    if 'thyroid' not in predictors:
        return jsonify({'success': False, 'message': 'Thyroid model not loaded. Run train_all_models.py'}), 503
    try:
        data = request.get_json()
        if not data:
            return jsonify({'success': False, 'message': 'No input data provided'}), 400
        result = predictors['thyroid'].predict(data)
        return jsonify({'success': True, **result})
    except ValueError as e:
        return jsonify({'success': False, 'message': str(e)}), 400
    except Exception as e:
        return jsonify({'success': False, 'message': f'Prediction error: {str(e)}'}), 500

@app.route('/model-info', methods=['GET'])
def model_info():
    info = {}
    for key, predictor in predictors.items():
        info[key] = {
            'type': predictor.model_type,
            'features': predictor.feature_names,
            'feature_count': len(predictor.feature_names)
        }
    return jsonify({'success': True, 'models': info})

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5001))
    print(f"\n[ML SERVICE] Starting ML Service v2.0 on port {port}")
    print(f"[ML API] http://localhost:{port}")
    app.run(host='0.0.0.0', port=port, debug=True)
