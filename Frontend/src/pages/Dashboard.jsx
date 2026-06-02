import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Bot, FileBarChart, Rss, Sparkles, HeartPulse, ShieldAlert, ArrowRight, UserCircle, Calendar, Star, Pill } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { chatAPI, reportsAPI, medicationAPI } from '../services/api';

const Dashboard = () => {
  const { user } = useAuth();
  const [conversationCount, setConversationCount] = useState(0);
  const [reportCount, setReportCount] = useState(0);
  const [medicationCount, setMedicationCount] = useState(0);
  const [showHealthForm, setShowHealthForm] = useState(false);
  const [isAnalyzingHealth, setIsAnalyzingHealth] = useState(false);
  const [showHealthDetails, setShowHealthDetails] = useState(false);
  const [healthForm, setHealthForm] = useState({
    age: '',
    sleepHours: '7',
    exerciseDays: '3',
    waterLiters: '2',
    stressLevel: '2',
    smoking: 'no',
    alcohol: 'no',
    fruitsVegDays: '5',
    chronicCondition: 'no'
  });

  const getHealthStorageKey = () => `health-score-${user?._id || user?.id || 'guest'}`;

  const getSavedHealthData = () => {
    try {
      const raw = localStorage.getItem(getHealthStorageKey());
      return raw ? JSON.parse(raw) : null;
    } catch (error) {
      console.error('Invalid health score data in storage:', error);
      return null;
    }
  };

  const savedHealthData = getSavedHealthData();
  const healthScore = savedHealthData?.score ?? null;
  const healthCategory = savedHealthData?.category ?? '';
  const lastAssessedAt = savedHealthData?.assessedAt ?? null;
  const healthSummary = savedHealthData?.summary ?? '';
  const healthRecommendations = Array.isArray(savedHealthData?.recommendations)
    ? savedHealthData.recommendations
    : [];

  const getHealthCategory = (score) => {
    if (score >= 85) return 'Excellent';
    if (score >= 70) return 'Good';
    if (score >= 55) return 'Fair';
    return 'Needs Attention';
  };

  const calculateHealthScore = (formValues) => {
    let score = 50;

    const sleepHours = Number(formValues.sleepHours || 0);
    const exerciseDays = Number(formValues.exerciseDays || 0);
    const waterLiters = Number(formValues.waterLiters || 0);
    const stressLevel = Number(formValues.stressLevel || 0);
    const fruitsVegDays = Number(formValues.fruitsVegDays || 0);
    const age = Number(formValues.age || 0);

    // Sleep: best around 7-8 hours
    if (sleepHours >= 7 && sleepHours <= 8) score += 12;
    else if (sleepHours >= 6 && sleepHours <= 9) score += 8;
    else score += 3;

    // Exercise (0-7 days/week)
    score += Math.min(exerciseDays, 7) * 3;

    // Hydration
    if (waterLiters >= 2) score += 10;
    else if (waterLiters >= 1.5) score += 6;
    else score += 2;

    // Diet quality
    score += Math.min(fruitsVegDays, 7) * 2;

    // Stress (1 low - 5 high)
    score += Math.max(0, 12 - stressLevel * 2);

    // Lifestyle risk factors
    if (formValues.smoking === 'yes') score -= 15;
    if (formValues.alcohol === 'yes') score -= 8;
    if (formValues.chronicCondition === 'yes') score -= 10;

    // Mild age normalization (not medical diagnosis)
    if (age > 60) score -= 4;
    else if (age >= 45) score -= 2;

    return Math.max(0, Math.min(100, Math.round(score)));
  };

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [conversations, reports, medications] = await Promise.all([
          chatAPI.getHistory(),
          reportsAPI.getReports(),
          medicationAPI.getMedications()
        ]);

        setConversationCount(Array.isArray(conversations) ? conversations.length : 0);
        setReportCount(Array.isArray(reports) ? reports.length : 0);
        setMedicationCount(Array.isArray(medications) ? medications.length : 0);
      } catch (error) {
        console.error('Failed to load dashboard stats:', error);
        setConversationCount(0);
        setReportCount(0);
        setMedicationCount(0);
      }
    };

    loadStats();
  }, []);

  const handleHealthInputChange = (e) => {
    const { name, value } = e.target;
    setHealthForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleHealthFormSubmit = async (e) => {
    e.preventDefault();

    setIsAnalyzingHealth(true);
    const assessedAt = new Date().toISOString();

    try {
      const result = await chatAPI.analyzeHealthScore(healthForm);

      const score = Number.isFinite(Number(result?.score))
        ? Math.max(0, Math.min(100, Math.round(Number(result.score))))
        : calculateHealthScore(healthForm);

      const category = result?.category || getHealthCategory(score);

      localStorage.setItem(getHealthStorageKey(), JSON.stringify({
        score,
        category,
        assessedAt,
        summary: result?.summary || 'Estimated score generated from your health assessment.',
        recommendations: Array.isArray(result?.recommendations) ? result.recommendations : [],
        source: result?.source || 'fallback',
        answers: healthForm
      }));

      setShowHealthForm(false);
    } catch (error) {
      console.error('Health score analysis failed:', error);

      const score = calculateHealthScore(healthForm);
      const category = getHealthCategory(score);

      localStorage.setItem(getHealthStorageKey(), JSON.stringify({
        score,
        category,
        assessedAt,
        summary: 'Estimated score generated from local assessment rules.',
        recommendations: [
          'Sleep 7–8 hours and stay physically active.',
          'Eat a balanced diet and hydrate well.',
          'Consult a healthcare professional for personalized guidance.'
        ],
        source: 'fallback',
        answers: healthForm
      }));

      setShowHealthForm(false);
    } finally {
      setIsAnalyzingHealth(false);
    }
  };

  const openHealthForm = () => {
    const savedAnswers = savedHealthData?.answers;
    if (savedAnswers) {
      setHealthForm((prev) => ({ ...prev, ...savedAnswers }));
    }
    setShowHealthForm(true);
  };

  const features = [
    {
      title: 'AI Chatbot',
      description: 'Consult with specialized bots for instant advice',
      icon: Bot,
      link: '/chatbot',
      gradient: 'from-violet-500 to-purple-600',
      shadow: 'shadow-purple-500/10 hover:border-purple-500/20'
    },
    {
      title: 'Medication Tracker',
      description: 'Manage prescriptions and set daily reminders',
      icon: Pill,
      link: '/medications',
      gradient: 'from-blue-500 to-indigo-600',
      shadow: 'shadow-blue-500/10 hover:border-blue-500/20'
    },
    {
      title: 'Medical Reports',
      description: 'Upload reports and files for smart AI extraction',
      icon: FileBarChart,
      link: '/reports',
      gradient: 'from-emerald-500 to-teal-600',
      shadow: 'shadow-emerald-500/10 hover:border-emerald-500/20'
    },
    {
      title: 'Health News',
      description: 'Browse curated wellness discoveries and bulletins',
      icon: Rss,
      link: '/news',
      gradient: 'from-amber-500 to-orange-600',
      shadow: 'shadow-amber-500/10 hover:border-amber-500/20'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden py-8 font-sans">
      {/* Glow Blur Orbs */}
      <div className="absolute top-[5%] right-[-10%] w-[35%] h-[35%] bg-teal-400/5 rounded-full blur-[90px] pointer-events-none" />
      <div className="absolute bottom-[5%] left-[-10%] w-[35%] h-[35%] bg-violet-400/5 rounded-full blur-[90px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-slate-900 border border-teal-500/25 rounded-3xl p-8 mb-8 text-white relative overflow-hidden shadow-lg shadow-teal-950/10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-2 tracking-tight">
            Welcome back, {user?.name || 'User'}! 👋
          </h1>
          <p className="text-teal-200 text-sm sm:text-base max-w-2xl leading-relaxed">
            Your personal digital clinic dashboard is active. Seamlessly manage clinical files, initiate AI consults, and review wellness trends in one workspace.
          </p>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Card 1 - Chats */}
          <div className="bg-white rounded-3xl shadow-sm p-6 border border-slate-200/50 hover:shadow-xl hover:shadow-slate-100 hover:border-purple-500/20 transition-all duration-300 transform hover:-translate-y-0.5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">Conversations</p>
                <p className="text-3xl font-extrabold text-slate-800">{conversationCount}</p>
              </div>
              <div className="bg-purple-50 p-3 rounded-2xl border border-purple-100">
                <Bot className="h-7 w-7 text-purple-600" />
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center">
              <span className="text-xs text-slate-400">Archived consultation list</span>
              <Link to="/chatbot" className="text-xs font-bold text-purple-600 hover:text-purple-700 flex items-center gap-0.5">
                <span>View Chat</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>

          {/* Card 2 - Medications */}
          <div className="bg-white rounded-3xl shadow-sm p-6 border border-slate-200/50 hover:shadow-xl hover:shadow-slate-100 hover:border-blue-500/20 transition-all duration-300 transform hover:-translate-y-0.5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">Medications</p>
                <p className="text-3xl font-extrabold text-slate-800">{medicationCount}</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-2xl border border-blue-100">
                <Pill className="h-7 w-7 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center">
              <span className="text-xs text-slate-400">Active prescriptions</span>
              <Link to="/medications" className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-0.5">
                <span>Manage</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>

          {/* Card 3 - Reports */}
          <div className="bg-white rounded-3xl shadow-sm p-6 border border-slate-200/50 hover:shadow-xl hover:shadow-slate-100 hover:border-emerald-500/20 transition-all duration-300 transform hover:-translate-y-0.5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">Uploaded Reports</p>
                <p className="text-3xl font-extrabold text-slate-800">{reportCount}</p>
              </div>
              <div className="bg-emerald-50 p-3 rounded-2xl border border-emerald-100">
                <FileBarChart className="h-7 w-7 text-emerald-600" />
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center">
              <span className="text-xs text-slate-400">Indexed diagnostics files</span>
              <Link to="/reports" className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-0.5">
                <span>Upload</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>

          {/* Card 4 - Health Score */}
          <div className="bg-white rounded-3xl shadow-sm p-6 border border-slate-200/50 hover:shadow-xl hover:shadow-slate-100 hover:border-rose-500/20 transition-all duration-300 transform hover:-translate-y-0.5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">Health Score</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-extrabold text-slate-800">{healthScore ?? '--'}</p>
                  {healthCategory && (
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      healthScore >= 80 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                        : healthScore >= 60 
                          ? 'bg-amber-50 text-amber-700 border-amber-200' 
                          : 'bg-rose-50 text-rose-700 border-rose-200'
                    }`}>
                      {healthCategory}
                    </span>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowHealthDetails((prev) => !prev)}
                className="bg-rose-50 hover:bg-rose-100 p-3 rounded-2xl border border-rose-100 transition-colors"
                title={showHealthDetails ? "Hide analysis" : "Show analysis details"}
              >
                <HeartPulse className={`h-7 w-7 text-rose-600 ${healthScore ? 'animate-pulse' : ''}`} />
              </button>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                onClick={openHealthForm}
                className="text-xs bg-rose-600 hover:bg-rose-700 text-white font-bold px-3 py-2 rounded-xl transition"
              >
                {healthScore === null ? 'Take Assessment' : 'Retake Assessment'}
              </button>
              {lastAssessedAt ? (
                <span className="text-[10px] text-slate-400">
                  Assessed: {new Date(lastAssessedAt).toLocaleDateString()}
                </span>
              ) : (
                <span className="text-[10px] text-slate-400">No data found</span>
              )}
            </div>
          </div>
        </div>

        {/* Health Insights Expandable Panel (moved outside the grid for better layout) */}
        {showHealthDetails && healthSummary && (
          <div className="mb-8 text-sm text-slate-600 bg-white border border-rose-100 rounded-3xl p-6 shadow-sm animate-fade-in">
            <p className="font-bold text-rose-800 mb-3 flex items-center gap-2">
              <Star className="h-5 w-5 fill-rose-600 text-rose-600" />
              Your Health Insights & Recommendations
            </p>
            <p className="leading-relaxed mb-4 text-slate-700">{healthSummary}</p>
            {healthRecommendations.length > 0 && (
              <div className="grid sm:grid-cols-3 gap-4">
                {healthRecommendations.slice(0, 3).map((item, index) => (
                  <div key={index} className="bg-rose-50/50 p-4 rounded-2xl border border-rose-100/50 flex items-start gap-2">
                    <span className="bg-rose-100 text-rose-700 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold">{index + 1}</span>
                    <span className="text-xs text-slate-600 leading-snug">{item}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Assessment Form Modal Dialog */}
        {showHealthForm && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-slate-200/50 transform transition-all duration-300">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold text-slate-950 flex items-center gap-1.5">
                    <HeartPulse className="h-6 w-6 text-rose-600" />
                    Clinical Health Assessment
                  </h3>
                  <p className="text-xs text-slate-450 mt-1">Estimate your wellness parameters below to calculate your diagnostic score.</p>
                </div>
                <button 
                  onClick={() => setShowHealthForm(false)} 
                  className="text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 p-2 rounded-full transition"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleHealthFormSubmit} className="p-6 space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Age</label>
                    <input
                      type="number"
                      min="1"
                      max="120"
                      name="age"
                      value={healthForm.age}
                      onChange={handleHealthInputChange}
                      required
                      className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 rounded-xl px-4 py-2.5 outline-none text-slate-800 text-sm transition"
                      placeholder="e.g. 35"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Sleep (hours/day)</label>
                    <input
                      type="number"
                      min="0"
                      max="14"
                      step="0.5"
                      name="sleepHours"
                      value={healthForm.sleepHours}
                      onChange={handleHealthInputChange}
                      required
                      className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 rounded-xl px-4 py-2.5 outline-none text-slate-800 text-sm transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Exercise (days/week)</label>
                    <input
                      type="number"
                      min="0"
                      max="7"
                      name="exerciseDays"
                      value={healthForm.exerciseDays}
                      onChange={handleHealthInputChange}
                      required
                      className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 rounded-xl px-4 py-2.5 outline-none text-slate-800 text-sm transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Water intake (liters/day)</label>
                    <input
                      type="number"
                      min="0"
                      max="8"
                      step="0.1"
                      name="waterLiters"
                      value={healthForm.waterLiters}
                      onChange={handleHealthInputChange}
                      required
                      className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 rounded-xl px-4 py-2.5 outline-none text-slate-800 text-sm transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Stress level</label>
                    <select
                      name="stressLevel"
                      value={healthForm.stressLevel}
                      onChange={handleHealthInputChange}
                      className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 rounded-xl px-4 py-2.5 outline-none text-slate-800 text-sm transition"
                    >
                      <option value="1">1 - Very Low</option>
                      <option value="2">2 - Low</option>
                      <option value="3">3 - Moderate</option>
                      <option value="4">4 - High</option>
                      <option value="5">5 - Very High</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Fruits/vegetables (days/week)</label>
                    <input
                      type="number"
                      min="0"
                      max="7"
                      name="fruitsVegDays"
                      value={healthForm.fruitsVegDays}
                      onChange={handleHealthInputChange}
                      required
                      className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 rounded-xl px-4 py-2.5 outline-none text-slate-800 text-sm transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Do you smoke?</label>
                    <select
                      name="smoking"
                      value={healthForm.smoking}
                      onChange={handleHealthInputChange}
                      className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 rounded-xl px-4 py-2.5 outline-none text-slate-800 text-sm transition"
                    >
                      <option value="no">No</option>
                      <option value="yes">Yes</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Regular alcohol intake?</label>
                    <select
                      name="alcohol"
                      value={healthForm.alcohol}
                      onChange={handleHealthInputChange}
                      className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 rounded-xl px-4 py-2.5 outline-none text-slate-800 text-sm transition"
                    >
                      <option value="no">No</option>
                      <option value="yes">Yes</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Any chronic condition (diabetes, BP, thyroid, etc.)?</label>
                    <select
                      name="chronicCondition"
                      value={healthForm.chronicCondition}
                      onChange={handleHealthInputChange}
                      className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 rounded-xl px-4 py-2.5 outline-none text-slate-800 text-sm transition"
                    >
                      <option value="no">No</option>
                      <option value="yes">Yes</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-3 pt-3 border-t border-slate-100">
                  <button
                    type="submit"
                    disabled={isAnalyzingHealth}
                    className="flex-1 bg-rose-600 hover:bg-rose-700 disabled:bg-rose-350 text-white font-bold px-4 py-2.5 rounded-xl transition shadow-md shadow-rose-900/10"
                  >
                    {isAnalyzingHealth ? 'Analyzing Parameters...' : 'Calculate Health Score'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowHealthForm(false)}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-6 py-2.5 rounded-xl transition border border-slate-200"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Features / Quick Access Section */}
        <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-teal-500" />
          Quick Access
        </h2>
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {features.map((feature, index) => (
            <Link
              key={index}
              to={feature.link}
              className={`group bg-white rounded-3xl shadow-sm p-6 hover:shadow-xl hover:shadow-slate-100 border border-slate-200/50 hover:border-slate-300 transition transform hover:-translate-y-1 flex flex-col justify-between`}
            >
              <div>
                <div className={`bg-gradient-to-br ${feature.gradient} w-12 h-12 rounded-2xl flex items-center justify-center mb-5 shadow-lg group-hover:scale-105 transition-transform`}>
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-4">
                  {feature.description}
                </p>
              </div>
              <span className="text-xs font-bold text-teal-600 group-hover:text-teal-700 flex items-center gap-1 group-hover:gap-1.5 transition-all">
                <span>Access Tool</span>
                <ArrowRight className="h-3 w-3" />
              </span>
            </Link>
          ))}
        </div>

        {/* Pro Tip Section */}
        <div className="mt-8 bg-gradient-to-r from-teal-50/50 via-cyan-50/40 to-slate-100/10 border-l-4 border-teal-500 p-6 rounded-r-3xl border border-teal-100/50">
          <h3 className="text-base font-bold text-teal-900 mb-2 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-teal-600 animate-pulse" />
            Healthcare Pro Tip
          </h3>
          <p className="text-teal-800 text-sm leading-relaxed">
            Initiate a chat session with our specialized AI doctors (Pediatric, Adult, Women's, or Veterinary) to get instant symptoms feedback or preventative healthcare advice.
          </p>
        </div>

        {/* Medical Disclaimer Section */}
        <div className="mt-8 bg-gradient-to-r from-amber-50/50 via-orange-50/30 to-slate-100/10 border-l-4 border-amber-500 p-6 rounded-r-3xl border border-amber-100/50">
          <h3 className="text-base font-bold text-amber-900 mb-2 flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-amber-600" />
            Important Clinical Disclaimer
          </h3>
          <p className="text-amber-800 text-sm leading-relaxed">
            This AI-powered assistant provides general educational healthcare references only. It does not constitute formal medical diagnosis, advice, or treatment plans. Always consult your primary care doctor or clinical specialists immediately for medical needs.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
