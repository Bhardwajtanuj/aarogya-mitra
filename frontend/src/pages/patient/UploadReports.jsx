import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { Upload, FileText, Trash2, AlertCircle, CheckCircle } from 'lucide-react';

const UploadReports = () => {
  const [reports, setReports] = useState([]);
  const [file, setFile] = useState(null);
  const [reportName, setReportName] = useState('');
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await api.get('/patient/reports');
      setReports(response.data.data);
    } catch (error) {
      console.error('Error fetching reports:', error);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) {
        setMessage({ type: 'error', text: 'File size must be less than 5MB' });
        return;
      }
      setFile(selectedFile);
      setMessage({ type: '', text: '' });
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage({ type: 'error', text: 'Please select a file' });
      return;
    }

    setUploading(true);
    setMessage({ type: '', text: '' });

    const formData = new FormData();
    formData.append('report', file);
    formData.append('reportName', reportName || file.name);

    try {
      await api.post('/patient/upload-report', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setMessage({ type: 'success', text: 'Report uploaded successfully!' });
      setFile(null);
      setReportName('');
      fetchReports();
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to upload report'
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="page-container">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Medical Reports</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Upload Form */}
        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-24">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Upload New Report</h2>

            {message.text && (
              <div className={`mb-4 p-4 rounded-lg flex items-start space-x-2 ${
                message.type === 'success'
                  ? 'bg-green-50 border border-green-200'
                  : 'bg-red-50 border border-red-200'
              }`}>
                {message.type === 'success' ? (
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                )}
                <p className={`text-sm ${
                  message.type === 'success' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {message.text}
                </p>
              </div>
            )}

            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <label className="label">Report Name</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g., Blood Test Report"
                  value={reportName}
                  onChange={(e) => setReportName(e.target.value)}
                />
              </div>

              <div>
                <label className="label">Select File</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-500 transition-colors">
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">
                      {file ? file.name : 'Click to upload or drag and drop'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      PDF, JPG, PNG (max 5MB)
                    </p>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={uploading || !file}
                className="w-full btn-primary"
              >
                {uploading ? 'Uploading...' : 'Upload Report'}
              </button>
            </form>
          </div>
        </div>

        {/* Reports List */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Your Reports</h2>
          {reports.length > 0 ? (
            <div className="grid gap-4">
              {reports.map((report, index) => (
                <div key={index} className="card p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <FileText className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{report.name}</h3>
                      <p className="text-sm text-gray-500">
                        Uploaded: {new Date(report.uploadedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <a
                    href={report.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary text-sm px-4 py-2"
                  >
                    View
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <div className="card p-12 text-center">
              <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No reports uploaded yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadReports;
