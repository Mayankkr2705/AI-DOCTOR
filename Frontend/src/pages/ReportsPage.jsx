import { useState, useEffect } from 'react';
import { FileText, Upload, Loader, CheckCircle, XCircle, Eye } from 'lucide-react';
import { reportsAPI } from '../services/api';

const ReportsPage = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  
  // Upload form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [reportType, setReportType] = useState('other');
  const [reportData, setReportData] = useState('');

  const reportTypes = [
    { value: 'blood_test', label: 'Blood Test' },
    { value: 'xray', label: 'X-Ray' },
    { value: 'mri', label: 'MRI' },
    { value: 'ct_scan', label: 'CT Scan' },
    { value: 'ultrasound', label: 'Ultrasound' },
    { value: 'other', label: 'Other' }
  ];

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      const data = await reportsAPI.getReports();
      setReports(data);
    } catch (error) {
      console.error('Failed to load reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      await reportsAPI.uploadReport({
        title,
        description,
        reportType,
        reportData
      });

      // Reset form
      setTitle('');
      setDescription('');
      setReportType('other');
      setReportData('');
      setShowUpload(false);

      // Reload reports
      loadReports();
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload report. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleAnalyze = async (reportId) => {
    try {
      const result = await reportsAPI.analyzeReport(reportId);
      
      // Update the report in the list
      setReports(prev => prev.map(r => 
        r._id === reportId ? result.report : r
      ));
      
      // If this report is currently selected, update it
      if (selectedReport?._id === reportId) {
        setSelectedReport(result.report);
      }
    } catch (error) {
      console.error('Analysis failed:', error);
      alert('Failed to analyze report. Make sure the backend server is running.');
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending' },
      analyzed: { bg: 'bg-green-100', text: 'text-green-800', label: 'Analyzed' },
      reviewed: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Reviewed' }
    };
    
    const badge = badges[status] || badges.pending;
    
    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${badge.bg} ${badge.text}`}>
        {badge.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="h-12 w-12 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Medical Reports</h1>
          <button
            onClick={() => setShowUpload(!showUpload)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition flex items-center space-x-2"
          >
            <Upload className="h-5 w-5" />
            <span>Upload Report</span>
          </button>
        </div>

        {/* Upload Form */}
        {showUpload && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Upload New Report</h2>
            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Report Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Blood Test - Jan 2026"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Report Type
                </label>
                <select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {reportTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows="2"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Brief description of the report"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Report Data/Results *
                </label>
                <textarea
                  value={reportData}
                  onChange={(e) => setReportData(e.target.value)}
                  required
                  rows="6"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Paste your report data, test results, or findings here..."
                />
              </div>

              <div className="flex space-x-4">
                <button
                  type="submit"
                  disabled={uploading}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-300"
                >
                  {uploading ? 'Uploading...' : 'Upload Report'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowUpload(false)}
                  className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Reports List */}
        {reports.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Reports Yet</h3>
            <p className="text-gray-500 mb-4">Upload your first medical report to get started</p>
            <button
              onClick={() => setShowUpload(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Upload Report
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reports.map((report) => (
              <div key={report._id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-semibold text-gray-900 flex-1">
                    {report.title}
                  </h3>
                  {getStatusBadge(report.status)}
                </div>
                
                <p className="text-sm text-gray-600 mb-2">
                  Type: <span className="font-medium">{report.reportType.replace('_', ' ')}</span>
                </p>
                
                <p className="text-sm text-gray-500 mb-4">
                  {new Date(report.createdAt).toLocaleDateString()}
                </p>

                <div className="flex space-x-2">
                  <button
                    onClick={() => setSelectedReport(report)}
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm flex items-center justify-center space-x-1"
                  >
                    <Eye className="h-4 w-4" />
                    <span>View</span>
                  </button>
                  
                  {report.status === 'pending' && (
                    <button
                      onClick={() => handleAnalyze(report._id)}
                      className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition text-sm"
                    >
                      Analyze
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Report Detail Modal */}
        {selectedReport && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center">
                <h2 className="text-2xl font-bold">{selectedReport.title}</h2>
                <button
                  onClick={() => setSelectedReport(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>
              
              <div className="p-6 space-y-6">
                <div>
                  <p className="text-sm text-gray-600">
                    Type: <span className="font-medium">{selectedReport.reportType.replace('_', ' ')}</span>
                  </p>
                  <p className="text-sm text-gray-600">
                    Status: {getStatusBadge(selectedReport.status)}
                  </p>
                  <p className="text-sm text-gray-600">
                    Date: {new Date(selectedReport.createdAt).toLocaleDateString()}
                  </p>
                </div>

                {selectedReport.description && (
                  <div>
                    <h3 className="font-semibold mb-2">Description</h3>
                    <p className="text-gray-700">{selectedReport.description}</p>
                  </div>
                )}

                <div>
                  <h3 className="font-semibold mb-2">Report Data</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <pre className="whitespace-pre-wrap text-sm text-gray-700">
                      {selectedReport.reportData}
                    </pre>
                  </div>
                </div>

                {selectedReport.analysis && (
                  <div className="bg-blue-50 p-6 rounded-lg">
                    <h3 className="font-semibold text-lg mb-4 text-blue-900">AI Analysis</h3>
                    
                    <div className="mb-4">
                      <h4 className="font-semibold text-blue-800 mb-2">Summary</h4>
                      <p className="text-gray-700">{selectedReport.analysis.summary}</p>
                    </div>

                    {selectedReport.analysis.findings?.length > 0 && (
                      <div className="mb-4">
                        <h4 className="font-semibold text-blue-800 mb-2">Key Findings</h4>
                        <ul className="list-disc list-inside space-y-1">
                          {selectedReport.analysis.findings.map((finding, i) => (
                            <li key={i} className="text-gray-700">{finding}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {selectedReport.analysis.recommendations?.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-blue-800 mb-2">Recommendations</h4>
                        <ul className="list-disc list-inside space-y-1">
                          {selectedReport.analysis.recommendations.map((rec, i) => (
                            <li key={i} className="text-gray-700">{rec}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {selectedReport.status === 'pending' && (
                  <button
                    onClick={() => {
                      handleAnalyze(selectedReport._id);
                    }}
                    className="w-full bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
                  >
                    Analyze with AI
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportsPage;
