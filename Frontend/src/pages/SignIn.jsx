import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Stethoscope, 
  Mail, 
  Lock, 
  AlertCircle, 
  HeartPulse, 
  Shield, 
  Zap,
  ChevronRight,
  Activity
} from 'lucide-react';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  
  const { login, loginAsGuest } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  const handleEmergencyAccess = () => {
    setLoading(true);
    const result = loginAsGuest();
    if (result.success) {
      navigate('/dashboard');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden font-sans">
      {/* Top progress line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-slate-200 z-50">
        <div className="h-full w-1/3 bg-gradient-to-r from-teal-500 to-emerald-500 transition-all duration-500" />
      </div>

      {/* Decorative Blur Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-teal-400/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-violet-400/15 rounded-full blur-[120px] pointer-events-none" />

      {/* Grid Pattern overlay */}
      <div 
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, #0F766E 1px, transparent 1px),
            linear-gradient(to bottom, #0F766E 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />

      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="w-full max-w-5xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Column - Form */}
            <div className="order-2 lg:order-1">
              <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl shadow-slate-200/85 border border-white/60 p-8 sm:p-10 relative overflow-hidden transition-all duration-350 hover:shadow-teal-950/5">
                <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />
                
                <div className="relative z-10">
                  {/* Header */}
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-2xl shadow-md shadow-teal-500/20 mb-4">
                      <Stethoscope className="h-7 w-7 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                      Welcome Back
                    </h2>
                    <p className="mt-1.5 text-sm text-slate-500">
                      Sign in to manage your health workspace
                    </p>
                  </div>

                  {/* Error Alert */}
                  {error && (
                    <div className="mb-6 flex items-start gap-2 bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-2xl animate-fade-in text-sm">
                      <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                      <span>{error}</span>
                    </div>
                  )}

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="email" className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className={`absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 transition-colors ${focusedField === 'email' ? 'text-teal-500' : 'text-slate-400'}`} />
                        <input
                          id="email"
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          onFocus={() => setFocusedField('email')}
                          onBlur={() => setFocusedField(null)}
                          className="block w-full pl-11 pr-4 py-3 bg-white/50 border border-slate-200/80 focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 rounded-xl text-sm outline-none text-slate-800 transition-all duration-200"
                          placeholder="doctor@hospital.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="password" className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                        Password
                      </label>
                      <div className="relative">
                        <Lock className={`absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 transition-colors ${focusedField === 'password' ? 'text-teal-500' : 'text-slate-400'}`} />
                        <input
                          id="password"
                          type="password"
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          onFocus={() => setFocusedField('password')}
                          onBlur={() => setFocusedField(null)}
                          className="block w-full pl-11 pr-4 py-3 bg-white/50 border border-slate-200/80 focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 rounded-xl text-sm outline-none text-slate-800 transition-all duration-200"
                          placeholder="••••••••"
                        />
                      </div>
                    </div>

                    {/* Action Row */}
                    <div className="flex items-center justify-between text-xs pt-1">
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input type="checkbox" className="w-4 h-4 rounded border-slate-350 text-teal-600 focus:ring-teal-500/20 focus:ring-2" />
                        <span className="text-slate-500 font-semibold">Remember me</span>
                      </label>
                      <a href="#" className="text-teal-600 hover:text-teal-700 font-bold">
                        Forgot password?
                      </a>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full flex items-center justify-center gap-1.5 py-3.5 px-6 bg-gradient-to-tr from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-bold rounded-xl shadow-md shadow-teal-900/10 hover:shadow-teal-950/20 transition transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-sm mt-2"
                    >
                      {loading ? (
                        <>
                          <Activity className="h-4 w-4 animate-spin" />
                          <span>Signing in...</span>
                        </>
                      ) : (
                        <>
                          <span>Sign In</span>
                          <ChevronRight className="h-4 w-4" />
                        </>
                      )}
                    </button>
                  </form>

                  {/* Footer Link */}
                  <p className="mt-6 text-center text-sm text-slate-500">
                    Don't have an account?{' '}
                    <Link to="/signup" className="text-teal-600 hover:text-teal-700 font-bold">
                      Create Account
                    </Link>
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column - Info & Guest Entrance */}
            <div className="order-1 lg:order-2 space-y-6">
              <div className="text-center lg:text-left">
                <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                  Medi<span className="text-teal-600">Care</span> AI
                </h1>
                <p className="text-sm sm:text-base text-slate-500 max-w-md mx-auto lg:mx-0 mt-2 leading-relaxed">
                  Your smart medical partner helping you analyze records, consult specialized bots, and review health scoring.
                </p>
              </div>

              {/* Benefits */}
              <div className="grid grid-cols-2 gap-4 max-w-md mx-auto lg:mx-0">
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-slate-200/50 shadow-sm transition hover:shadow-md hover:bg-white">
                  <HeartPulse className="h-6 w-6 text-teal-500 mb-2" />
                  <h4 className="font-bold text-slate-800 text-sm">Health Scoring</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Automated wellness stats</p>
                </div>
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-slate-200/50 shadow-sm transition hover:shadow-md hover:bg-white">
                  <Shield className="h-6 w-6 text-emerald-500 mb-2" />
                  <h4 className="font-bold text-slate-800 text-sm">Secure Data</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Encrypted indexing</p>
                </div>
              </div>

              {/* Guest Login Card */}
              <div className="bg-gradient-to-br from-teal-950 via-slate-900 to-slate-950 border border-teal-500/25 rounded-3xl p-6 sm:p-8 shadow-xl shadow-teal-950/20 max-w-md mx-auto lg:mx-0 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/10 rounded-full blur-xl pointer-events-none" />
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-rose-500 to-rose-600 rounded-xl flex items-center justify-center shadow-lg shadow-rose-500/20">
                      <Zap className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm sm:text-base tracking-wide">Emergency Access</h3>
                      <p className="text-teal-400 text-xs">Enter as a guest instantly</p>
                    </div>
                  </div>
                  
                  <p className="text-teal-200/80 text-xs sm:text-sm leading-relaxed mb-6">
                    Need immediate feedback? Access basic AI chatbot consultations instantly without register forms.
                  </p>

                  <div className="space-y-3">
                    <button
                      onClick={handleEmergencyAccess}
                      disabled={loading}
                      className="w-full flex items-center justify-center gap-1.5 py-3.5 px-6 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-bold rounded-xl shadow-lg shadow-rose-500/20 transition transform hover:-translate-y-0.5 disabled:opacity-50 disabled:transform-none text-sm"
                    >
                      <Zap className="h-4 w-4" />
                      <span>Enter as Guest</span>
                    </button>
                    
                    <p className="text-center text-[10px] text-teal-400/60">
                      Limited local history features
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
