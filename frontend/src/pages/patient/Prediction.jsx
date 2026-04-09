import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { Heart, Activity, Brain, AlertCircle, TrendingUp, History } from 'lucide-react';

const DISEASES = {
  heart_disease: {
    label: 'Heart Disease',
    icon: Heart,
    color: 'text-red-600',
    bg: 'bg-red-50',
    border: 'border-red-200',
    endpoint: '/predictions/heart-disease',
    fields: [
      { key: 'age', label: 'Age', type: 'number', min: 1, max: 120 },
      { key: 'sex', label: 'Sex', type: 'select', options: [{ value: '1', label: 'Male' }, { value: '0', label: 'Female' }] },
      { key: 'cp', label: 'Chest Pain Type (0-3)', type: 'number', min: 0, max: 3 },
      { key: 'trestbps', label: 'Resting Blood Pressure', type: 'number', min: 80, max: 250 },
      { key: 'chol', label: 'Cholesterol (mg/dl)', type: 'number', min: 100, max: 600 },
      { key: 'fbs', label: 'Fasting Blood Sugar >120', type: 'select', options: [{ value: '0', label: 'No' }, { value: '1', label: 'Yes' }] },
      { key: 'restecg', label: 'Resting ECG (0-2)', type: 'number', min: 0, max: 2 },
      { key: 'thalach', label: 'Max Heart Rate', type: 'number', min: 60, max: 250 },
      { key: 'exang', label: 'Exercise Induced Angina', type: 'select', options: [{ value: '0', label: 'No' }, { value: '1', label: 'Yes' }] },
      { key: 'oldpeak', label: 'ST Depression', type: 'number', step: '0.1', min: 0, max: 10 },
      { key: 'slope', label: 'Slope (0-2)', type: 'number', min: 0, max: 2 },
      { key: 'ca', label: 'CA (0-4)', type: 'number', min: 0, max: 4 },
      { key: 'thal', label: 'Thal (0-3)', type: 'number', min: 0, max: 3 }
    ],
    defaults: { age: '', sex: '1', cp: '0', trestbps: '', chol: '', fbs: '0', restecg: '0', thalach: '', exang: '0', oldpeak: '', slope: '0', ca: '0', thal: '0' }
  },
  diabetes: {
    label: 'Diabetes',
    icon: Activity,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    endpoint: '/predictions/diabetes',
    fields: [
      { key: 'pregnancies', label: 'Pregnancies', type: 'number', min: 0, max: 20 },
      { key: 'glucose', label: 'Glucose Level', type: 'number', min: 0, max: 300 },
      { key: 'bloodPressure', label: 'Blood Pressure', type: 'number', min: 0, max: 200 },
      { key: 'skinThickness', label: 'Skin Thickness', type: 'number', min: 0, max: 100 },
      { key: 'insulin', label: 'Insulin', type: 'number', min: 0, max: 900 },
      { key: 'bmi', label: 'BMI', type: 'number', step: '0.1', min: 0, max: 70 },
      { key: 'diabetesPedigreeFunction', label: 'Diabetes Pedigree Function', type: 'number', step: '0.001', min: 0, max: 3 },
      { key: 'age', label: 'Age', type: 'number', min: 1, max: 120 }
    ],
    defaults: { pregnancies: '0', glucose: '', bloodPressure: '', skinThickness: '', insulin: '', bmi: '', diabetesPedigreeFunction: '', age: '' }
  },
  thyroid: {
    label: 'Thyroid',
    icon: Brain,
    color: 'text-purple-600',
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    endpoint: '/predictions/thyroid',
    fields: [
      { key: 'age', label: 'Age', type: 'number', min: 1, max: 120 },
      { key: 'sex', label: 'Sex', type: 'select', options: [{ value: '1', label: 'Male' }, { value: '0', label: 'Female' }] },
      { key: 'on_thyroxine', label: 'On Thyroxine', type: 'select', options: [{ value: '0', label: 'No' }, { value: '1', label: 'Yes' }] },
      { key: 'tsh', label: 'TSH Level', type: 'number', step: '0.01', min: 0, max: 50 },
      { key: 't3', label: 'T3 Level', type: 'number', step: '0.01', min: 0, max: 10 },
      { key: 'tt4', label: 'TT4 Level', type: 'number', step: '0.1', min: 0, max: 400 },
      { key: 't4u', label: 'T4U Level', type: 'number', step: '0.01', min: 0, max: 3 },
      { key: 'fti', label: 'FTI Level', type: 'number', step: '0.1', min: 0, max: 400 }
    ],
    defaults: { age: '', sex: '1', on_thyroxine: '0', tsh: '', t3: '', tt4: '', t4u: '', fti: '' }
  }
};

const getRiskColor = (risk) => {
  switch (risk) {
    case 'low': return 'text-green-600 bg-green-100';
    case 'medium': return 'text-yellow-600 bg-yellow-100';
    case 'high': return 'text-red-600 bg-red-100';
    default: return 'text-gray-600 bg-gray-100';
  }
};

const Prediction = () => {
  const [disease, setDisease] = useState('heart_disease');
  const [formData, setFormData] = useState(DISEASES.heart_disease.defaults);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDiseaseChange = (d) => {
    setDisease(d);
    setFormData(DISEASES[d].defaults);
    setResult(null);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    const numericData = {};
    for (const [key, value] of Object.entries(formData)) {
      numericData[key] = parseFloat(value);
    }

    try {
      const response = await api.post(DISEASES[disease].endpoint, numericData);
      setResult(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Prediction failed. Make sure ML service is running.');
    } finally {
      setLoading(false);
    }
  };

  const cfg = DISEASES[disease];
  const Icon = cfg.icon;

  return (
    <div className="page-container">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-1">AI Disease Prediction</h1>
          <p className="text-gray-500">Multi-disease risk assessment powered by machine learning</p>
        </div>
        <Link to="/patient/prediction-history" className="flex items-center gap-2 btn-secondary text-sm px-4 py-2">
          <History className="h-4 w-4" /> History
        </Link>
      </div>

      {/* Disease Selector */}
      <div className="flex gap-3 mb-8 flex-wrap">
        {Object.entries(DISEASES).map(([key, d]) => {
          const DIcon = d.icon;
          return (
            <button
              key={key}
              onClick={() => handleDiseaseChange(key)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium border-2 transition-all ${
                disease === key
                  ? `${d.bg} ${d.border} ${d.color}`
                  : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              <DIcon className="h-5 w-5" />
              {d.label}
            </button>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="card p-6">
            <div className={`flex items-center gap-3 mb-6 p-3 rounded-lg ${cfg.bg}`}>
              <Icon className={`h-6 w-6 ${cfg.color}`} />
              <h2 className={`font-semibold ${cfg.color}`}>{cfg.label} Risk Assessment</h2>
            </div>
            <form onSubmit={handleSubmit} className="space-y-0">
              <div className="grid md:grid-cols-2 gap-4">
                {cfg.fields.map(field => (
                  <div key={field.key}>
                    <label className="label">{field.label}</label>
                    {field.type === 'select' ? (
                      <select className="input-field" value={formData[field.key] || ''}
                        onChange={e => setFormData({ ...formData, [field.key]: e.target.value })}>
                        {field.options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                      </select>
                    ) : (
                      <input type="number" required className="input-field"
                        min={field.min} max={field.max} step={field.step || '1'}
                        value={formData[field.key] || ''}
                        onChange={e => setFormData({ ...formData, [field.key]: e.target.value })} />
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <button type="submit" disabled={loading} className="w-full btn-primary">
                  {loading ? 'Analyzing...' : `Run ${cfg.label} Prediction`}
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="space-y-4">
          {error && (
            <div className="card p-5 bg-red-50 border-2 border-red-200">
              <AlertCircle className="h-7 w-7 text-red-500 mx-auto mb-2" />
              <p className="text-red-600 text-center text-sm">{error}</p>
            </div>
          )}

          {result && (
            <div className="card p-6">
              <div className="text-center mb-5">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-3 ${result.prediction === 'Positive' ? 'bg-red-100' : 'bg-green-100'}`}>
                  <Icon className={`h-8 w-8 ${result.prediction === 'Positive' ? 'text-red-600' : 'text-green-600'}`} />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-1">Result</h3>
                <p className={`text-2xl font-bold ${result.prediction === 'Positive' ? 'text-red-600' : 'text-green-600'}`}>
                  {result.prediction}
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-3 bg-gray-50 rounded-lg flex justify-between items-center">
                  <span className="text-sm text-gray-500">Probability</span>
                  <span className="font-bold text-gray-800">{(result.probability * 100).toFixed(1)}%</span>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg flex justify-between items-center">
                  <span className="text-sm text-gray-500">Risk Level</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-bold ${getRiskColor(result.riskLevel)}`}>
                    {result.riskLevel?.toUpperCase()}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                  <div
                    className={`h-2.5 rounded-full ${result.riskLevel === 'high' ? 'bg-red-500' : result.riskLevel === 'medium' ? 'bg-yellow-500' : 'bg-green-500'}`}
                    style={{ width: `${(result.probability * 100).toFixed(0)}%` }}
                  />
                </div>
              </div>

              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-xs text-blue-800">
                  <strong>Disclaimer:</strong> This AI prediction is for informational purposes only and does not replace professional medical advice.
                </p>
              </div>
            </div>
          )}

          <div className="card p-4">
            <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary-600" /> Available Models
            </h4>
            {Object.entries(DISEASES).map(([key, d]) => {
              const DIcon = d.icon;
              return (
                <div key={key} className="flex items-center gap-2 py-1">
                  <DIcon className={`h-4 w-4 ${d.color}`} />
                  <span className="text-sm text-gray-600">{d.label}</span>
                  <span className="ml-auto text-xs text-green-600 font-medium">Active</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Prediction;
