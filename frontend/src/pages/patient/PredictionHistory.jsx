import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { TrendingUp, Heart, Activity, Brain, ArrowLeft, Calendar } from 'lucide-react';

const typeIcons = {
  heart_disease: { icon: Heart, color: 'text-red-500', bg: 'bg-red-100', label: 'Heart Disease' },
  diabetes: { icon: Activity, color: 'text-blue-500', bg: 'bg-blue-100', label: 'Diabetes' },
  thyroid: { icon: Brain, color: 'text-purple-500', bg: 'bg-purple-100', label: 'Thyroid' }
};

const riskColor = { low: 'text-green-600 bg-green-100', medium: 'text-yellow-600 bg-yellow-100', high: 'text-red-600 bg-red-100' };

const PredictionHistory = () => {
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    Promise.all([
      api.get('/predictions/history'),
      api.get('/predictions/stats')
    ]).then(([histRes, statsRes]) => {
      setHistory(histRes.data.data || []);
      setStats(statsRes.data.data || []);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const filtered = filter === 'all' ? history : history.filter(h => h.predictionType === filter);

  // Chart data: group by date
  const chartData = (() => {
    const byDate = {};
    stats.forEach(s => {
      const d = new Date(s.date).toLocaleDateString();
      if (!byDate[d]) byDate[d] = { high: 0, medium: 0, low: 0, total: 0 };
      byDate[d][s.riskLevel || 'low']++;
      byDate[d].total++;
    });
    return Object.entries(byDate).slice(-10).map(([date, counts]) => ({ date, ...counts }));
  })();

  const maxTotal = Math.max(...chartData.map(d => d.total), 1);

  if (loading) return (
    <div className="page-container flex items-center justify-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600" />
    </div>
  );

  return (
    <div className="page-container">
      <div className="flex items-center gap-4 mb-6">
        <Link to="/patient/prediction" className="p-2 rounded-lg hover:bg-gray-100">
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Prediction History</h1>
          <p className="text-gray-500">Your AI health risk assessment timeline</p>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {Object.entries(typeIcons).map(([type, cfg]) => {
          const count = history.filter(h => h.predictionType === type).length;
          const TypeIcon = cfg.icon;
          return (
            <div key={type} className="card p-4 flex items-center gap-3">
              <div className={`p-2 rounded-lg ${cfg.bg}`}>
                <TypeIcon className={`h-5 w-5 ${cfg.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{count}</p>
                <p className="text-xs text-gray-500">{cfg.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bar Chart */}
      {chartData.length > 0 && (
        <div className="card p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary-600" /> Prediction Activity (Last 10 Days)
          </h2>
          <div className="flex items-end gap-2 h-40">
            {chartData.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full flex flex-col justify-end" style={{ height: '120px' }}>
                  <div
                    className="w-full bg-red-400 rounded-t"
                    style={{ height: `${(d.high / maxTotal) * 100}%`, minHeight: d.high ? '4px' : '0' }}
                    title={`High: ${d.high}`}
                  />
                  <div
                    className="w-full bg-yellow-400"
                    style={{ height: `${(d.medium / maxTotal) * 100}%`, minHeight: d.medium ? '4px' : '0' }}
                    title={`Medium: ${d.medium}`}
                  />
                  <div
                    className="w-full bg-green-400 rounded-b"
                    style={{ height: `${(d.low / maxTotal) * 100}%`, minHeight: d.low ? '4px' : '0' }}
                    title={`Low: ${d.low}`}
                  />
                </div>
                <span className="text-xs text-gray-400 truncate w-full text-center">{d.date.split('/').slice(0, 2).join('/')}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-4 mt-3 text-xs">
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-red-400 inline-block" /> High Risk</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-yellow-400 inline-block" /> Medium Risk</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-green-400 inline-block" /> Low Risk</span>
          </div>
        </div>
      )}

      {/* Filter */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {['all', 'heart_disease', 'diabetes', 'thyroid'].map(f => (
          <button key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors capitalize ${filter === f ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            {f.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* History list */}
      {filtered.length === 0 ? (
        <div className="card p-12 text-center">
          <TrendingUp className="h-16 w-16 text-gray-200 mx-auto mb-4" />
          <p className="text-gray-400">No predictions found</p>
          <Link to="/patient/prediction" className="mt-4 inline-block btn-primary text-sm px-6 py-2">
            Run First Prediction
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => {
            const cfg = typeIcons[item.predictionType] || typeIcons.heart_disease;
            const ItemIcon = cfg.icon;
            return (
              <div key={item._id} className="card p-4 flex items-center gap-4">
                <div className={`p-3 rounded-xl ${cfg.bg}`}>
                  <ItemIcon className={`h-5 w-5 ${cfg.color}`} />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">{cfg.label} Assessment</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="h-3 w-3 text-gray-400" />
                    <span className="text-xs text-gray-400">{new Date(item.createdAt).toLocaleString()}</span>
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <p className={`font-bold text-sm ${item.result.prediction === 'Positive' ? 'text-red-600' : 'text-green-600'}`}>
                    {item.result.prediction}
                  </p>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${riskColor[item.result.riskLevel] || 'bg-gray-100 text-gray-600'}`}>
                    {item.result.riskLevel?.toUpperCase()}
                  </span>
                  <p className="text-xs text-gray-400">{(item.result.probability * 100).toFixed(1)}%</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PredictionHistory;
