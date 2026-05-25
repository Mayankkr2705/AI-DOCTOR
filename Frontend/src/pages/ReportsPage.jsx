import { useState, useEffect } from 'react';
import { FileText, Upload, Loader, CheckCircle2, AlertCircle, Eye, Trash2, XCircle, Rss, ClipboardList, Shield, Printer, Check, Info } from 'lucide-react';
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
  const [reportFile, setReportFile] = useState(null);

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

    if (!reportFile) {
      alert('Please select a report file to upload.');
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('reportType', reportType);
      formData.append('reportFile', reportFile);

      await reportsAPI.uploadReport(formData);

      // Reset form
      setTitle('');
      setDescription('');
      setReportType('other');
      setReportFile(null);
      setShowUpload(false);

      // Reload reports
      loadReports();
    } catch (error) {
      console.error('Upload failed:', error);
      const serverMessage = error?.response?.data?.message || error?.response?.data?.error;
      alert(serverMessage || 'Failed to upload report. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (reportId) => {
    if (!window.confirm('Are you sure you want to delete this report? This action cannot be undone.')) {
      return;
    }

    try {
      await reportsAPI.deleteReport(reportId);
      setReports(prev => prev.filter(r => r._id !== reportId));
      if (selectedReport?._id === reportId) {
        setSelectedReport(null);
      }
    } catch (error) {
      console.error('Failed to delete report:', error);
      alert('Failed to delete report. Please try again.');
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
      pending: { bg: 'bg-amber-50 border-amber-200 text-amber-700', label: 'Pending Analysis' },
      analyzed: { bg: 'bg-emerald-50 border-emerald-200 text-emerald-700', label: 'AI Analyzed' },
      reviewed: { bg: 'bg-sky-50 border-sky-200 text-sky-700', label: 'Reviewed' }
    };
    
    const badge = badges[status] || badges.pending;
    
    return (
      <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full border ${badge.bg}`}>
        {badge.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <Loader className="h-10 w-10 animate-spin text-teal-600 mx-auto mb-4" />
          <p className="text-sm font-medium text-slate-500">Loading Clinical Reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden py-8 font-sans">
      {/* Glow Blur Orbs */}
      <div className="absolute top-[5%] left-[-10%] w-[35%] h-[35%] bg-teal-400/5 rounded-full blur-[90px] pointer-events-none" />
      <div className="absolute bottom-[5%] right-[-10%] w-[35%] h-[35%] bg-violet-400/5 rounded-full blur-[90px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <ClipboardList className="h-8 w-8 text-teal-500" />
              Medical Reports
            </h1>
            <p className="text-sm text-slate-500 mt-1">Upload and review diagnostic text extractions and AI reports.</p>
          </div>
          <button
            onClick={() => setShowUpload(!showUpload)}
            className="bg-gradient-to-tr from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-bold px-5 py-2.5 rounded-xl transition shadow-md shadow-teal-900/10 flex items-center gap-1.5"
          >
            <Upload className="h-4 w-4" />
            <span>Upload New File</span>
          </button>
        </div>

        {/* Upload Form Panel */}
        {showUpload && (
          <div className="bg-white rounded-3xl shadow-md border border-slate-200/50 p-6 mb-8 animate-fade-in">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Upload Diagnostic Report</h2>
            <form onSubmit={handleUpload} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-650 uppercase tracking-wider mb-1">
                    Report Title *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 rounded-xl px-4 py-2.5 text-sm outline-none text-slate-800 transition"
                    placeholder="e.g. Complete Blood Count - Jan 2026"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-650 uppercase tracking-wider mb-1">
                    Report Type
                  </label>
                  <select
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 rounded-xl px-4 py-2.5 text-sm outline-none text-slate-850 transition"
                  >
                    {reportTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-650 uppercase tracking-wider mb-1">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows="2"
                    className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 rounded-xl px-4 py-2.5 text-sm outline-none text-slate-800 transition resize-none"
                    placeholder="Brief description of the diagnostic context or findings"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-650 uppercase tracking-wider mb-2">
                    Report File *
                  </label>
                  <div className="border-2 border-dashed border-slate-250 rounded-2xl p-6 bg-slate-50/50 hover:bg-slate-55 transition-colors relative flex flex-col items-center justify-center text-center">
                    <input
                      type="file"
                      accept=".pdf,.txt,.csv,.json"
                      required
                      onChange={(e) => setReportFile(e.target.files?.[0] || null)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <Upload className="h-8 w-8 text-slate-400 mb-2" />
                    <p className="text-sm font-semibold text-slate-700">
                      {reportFile ? reportFile.name : 'Click or Drag file here to choose'}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">Supported: PDF, TXT, CSV, JSON (max 10MB)</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-2 border-t border-slate-100">
                <button
                  type="submit"
                  disabled={uploading}
                  className="bg-gradient-to-tr from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-bold px-6 py-2.5 rounded-xl transition shadow-md shadow-teal-900/10 disabled:from-slate-200 disabled:to-slate-250 disabled:shadow-none disabled:cursor-not-allowed"
                >
                  {uploading ? 'Extracting & Saving...' : 'Upload & Process'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowUpload(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-750 font-bold px-6 py-2.5 rounded-xl transition border border-slate-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Reports List Grid */}
        {reports.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200/50 p-12 text-center max-w-xl mx-auto">
            <FileText className="h-16 w-16 text-slate-350 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-800 mb-2">No Reports Indexed</h3>
            <p className="text-slate-505 text-sm mb-6 leading-relaxed">Upload a health scan or blood test PDF. Our system will immediately index its content in Mongoose and back up the document.</p>
            <button
              onClick={() => setShowUpload(true)}
              className="bg-gradient-to-tr from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-bold px-6 py-3 rounded-xl transition shadow-md shadow-teal-900/10"
            >
              Upload Your First Report
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reports.map((report) => (
              <div key={report._id} className="group bg-white rounded-3xl shadow-sm p-6 border border-slate-200/50 hover:shadow-xl hover:shadow-slate-100 hover:border-slate-300 transition-all duration-300 transform hover:-translate-y-0.5 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start gap-2 mb-3">
                    <h3 className="text-base font-bold text-slate-900 leading-snug group-hover:text-teal-700 transition-colors">
                      {report.title}
                    </h3>
                    {getStatusBadge(report.status)}
                  </div>
                  
                  {report.description && (
                    <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                      {report.description}
                    </p>
                  )}
                  
                  <div className="space-y-1 text-xs text-slate-500 mb-6">
                    <p>
                      Type:{' '}
                      <span className="font-semibold text-slate-700 capitalize">
                        {report.reportType.replace('_', ' ')}
                      </span>
                    </p>
                    <p>
                      Indexed:{' '}
                      <span className="font-semibold text-slate-700">
                        {new Date(report.createdAt).toLocaleDateString()}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex gap-2 pt-3 border-t border-slate-100">
                  <button
                    onClick={() => setSelectedReport(report)}
                    className="flex-1 bg-slate-900 hover:bg-slate-800 text-white px-3 py-2 rounded-xl transition text-xs font-bold flex items-center justify-center gap-1 shadow-sm"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    <span>View</span>
                  </button>
                  
                  {report.status === 'pending' && (
                    <button
                      onClick={() => handleAnalyze(report._id)}
                      className="flex-1 bg-gradient-to-tr from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white px-3 py-2 rounded-xl transition text-xs font-bold"
                    >
                      Analyze
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(report._id)}
                    className="bg-rose-50 hover:bg-rose-100 border border-rose-100 text-rose-600 p-2 rounded-xl transition"
                    title="Delete Report"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Report Detail Modal */}
        {selectedReport && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-slate-200/50 shadow-2xl">
              {/* Header */}
              <div className="sticky top-0 bg-white border-b border-slate-100 p-6 flex justify-between items-center z-10">
                <div>
                  <h2 className="text-xl font-bold text-slate-950">{selectedReport.title}</h2>
                  <div className="flex items-center gap-2 mt-1.5">
                    {getStatusBadge(selectedReport.status)}
                    <span className="text-[10px] text-slate-400">
                      Indexed: {new Date(selectedReport.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedReport(null)}
                  className="text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 p-2 rounded-full transition"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>
              
              {/* Content Body */}
              <div className="p-6 space-y-6">
                {selectedReport.description && (
                  <div>
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Description</h3>
                    <p className="text-sm text-slate-800 bg-slate-50 rounded-2xl p-4 leading-relaxed border border-slate-200/20">{selectedReport.description}</p>
                  </div>
                )}

                {/* Extracted Text */}
                <div>
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Extracted Report Text</h3>
                  <div className="bg-slate-950 text-emerald-400 font-mono rounded-2xl p-4 overflow-x-auto text-xs leading-relaxed max-h-60 border border-slate-800">
                    <pre className="whitespace-pre-wrap">{selectedReport.reportData}</pre>
                  </div>
                </div>

                {/* Cloudinary Link */}
                {selectedReport.fileUrl && (
                  <div className="flex items-center gap-2 bg-slate-50 px-4 py-3 rounded-2xl border border-slate-200/20 text-xs">
                    <Shield className="h-4 w-4 text-teal-600 flex-shrink-0" />
                    <p className="text-slate-650">
                      Document backed up securely to Cloudinary:{' '}
                      <a 
                        href={selectedReport.fileUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-teal-600 hover:underline font-semibold"
                      >
                        [Download Original File]
                      </a>
                    </p>
                  </div>
                )}

                {/* AI Analysis Result */}
                {selectedReport.analysis && (
                  <div className="bg-gradient-to-br from-teal-50/50 via-teal-50/30 to-cyan-50/10 border border-teal-200/50 rounded-3xl p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-teal-500/5 rounded-full blur-2xl pointer-events-none" />
                    <h3 className="font-bold text-base text-teal-900 mb-4 flex items-center gap-1.5">
                      <CheckCircle2 className="h-5 w-5 text-teal-600 fill-teal-100" />
                      Diagnostic AI Analysis
                    </h3>
                    
                    <div className="mb-5">
                      <h4 className="text-xs font-bold text-teal-800 uppercase tracking-wider mb-1.5">Report Summary</h4>
                      <p className="text-sm text-slate-700 leading-relaxed bg-white/60 backdrop-blur-sm rounded-xl p-3 border border-teal-200/10">{selectedReport.analysis.summary}</p>
                    </div>

                    {selectedReport.analysis.findings?.length > 0 && (
                      <div className="mb-5">
                        <h4 className="text-xs font-bold text-teal-800 uppercase tracking-wider mb-1.5">Key Findings</h4>
                        <ul className="space-y-1.5">
                          {selectedReport.analysis.findings.map((finding, i) => (
                            <li key={i} className="text-sm text-slate-700 flex items-start gap-1.5">
                              <Check className="h-4 w-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                              <span>{finding}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {selectedReport.analysis.recommendations?.length > 0 && (
                      <div>
                        <h4 className="text-xs font-bold text-teal-800 uppercase tracking-wider mb-1.5">Recommendations</h4>
                        <ul className="space-y-1.5">
                          {selectedReport.analysis.recommendations.map((rec, i) => (
                            <li key={i} className="text-sm text-slate-700 flex items-start gap-1.5">
                              <Info className="h-4 w-4 text-teal-600 flex-shrink-0 mt-0.5" />
                              <span>{rec}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {/* Footer Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  {selectedReport.status === 'pending' && (
                    <button
                      onClick={() => {
                        handleAnalyze(selectedReport._id);
                      }}
                      className="flex-1 bg-gradient-to-tr from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-bold px-6 py-3.5 rounded-2xl transition shadow-md shadow-teal-900/10 flex items-center justify-center gap-1.5"
                    >
                      <Bot className="h-5 w-5" />
                      <span>Analyze with AI</span>
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(selectedReport._id)}
                    className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-bold px-6 py-3.5 rounded-2xl transition shadow-md shadow-rose-900/10 flex items-center justify-center gap-1.5"
                  >
                    <Trash2 className="h-5 w-5" />
                    <span>Delete Report</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportsPage;
