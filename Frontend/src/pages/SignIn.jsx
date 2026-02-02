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
    <div className="min-h-screen bg-slate-100 relative overflow-hidden">
      {/* Progress Bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-slate-200 z-50">
        <div className="h-full w-1/3 bg-gradient-to-r from-teal-500 to-teal-600 transition-all duration-500" />
      </div>

      {/* Medical Grid Background */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #0D9488 1px, transparent 1px),
            linear-gradient(to bottom, #0D9488 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />

      {/* DNA Helix SVG Background */}
      <svg
        className="absolute bottom-0 right-0 w-[600px] h-[600px] opacity-[0.05] text-teal-600"
        viewBox="0 0 200 200"
        fill="none"
      >
        <path
          d="M20 10 Q100 50 180 10 Q100 50 20 90 Q100 130 180 90 Q100 130 20 170 Q100 210 180 170"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
        />
        <path
          d="M20 30 Q100 70 180 30 Q100 70 20 110 Q100 150 180 110 Q100 150 20 190"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
        />
        {/* Connecting lines */}
        {[10, 30, 50, 70, 90, 110, 130, 150, 170, 190].map((y, i) => (
          <line key={i} x1="40" y1={y} x2="160" y2={y} stroke="currentColor" strokeWidth="0.5" opacity="0.5" />
        ))}
      </svg>

      {/* Heartbeat Line SVG */}
      <svg
        className="absolute top-20 left-0 w-full h-32 opacity-[0.04]"
        viewBox="0 0 1200 100"
        preserveAspectRatio="none"
      >
        <path
          d="M0,50 L200,50 L230,50 L250,20 L270,80 L290,10 L310,90 L330,50 L360,50 L600,50 L630,50 L650,20 L670,80 L690,10 L710,90 L730,50 L760,50 L1000,50 L1030,50 L1050,20 L1070,80 L1090,10 L1110,90 L1130,50 L1200,50"
          stroke="#0D9488"
          strokeWidth="3"
          fill="none"
        />
      </svg>

      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="w-full max-w-5xl">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            
            {/* Left Column - Sign In Card */}
            <div className="order-2 lg:order-1">
              {/* Glassmorphism Card */}
              <div className="backdrop-blur-xl bg-white/80 rounded-3xl shadow-2xl border border-white/50 p-8 sm:p-10 relative overflow-hidden">
                {/* Decorative gradient orb */}
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-teal-400/20 to-cyan-400/20 rounded-full blur-3xl" />
                <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-br from-emerald-400/20 to-teal-400/20 rounded-full blur-3xl" />
                
                <div className="relative z-10">
                  {/* Logo & Header */}
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl shadow-lg shadow-teal-500/30 mb-4">
                      <Stethoscope className="h-8 w-8 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800">
                      Welcome Back, Doctor
                    </h2>
                    <p className="mt-2 text-slate-600">
                      Sign in to access your medical dashboard
                    </p>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="mb-6 flex items-center gap-2 bg-rose-50 border border-rose-200 text-rose-600 px-4 py-3 rounded-xl">
                      <AlertCircle className="h-5 w-5 flex-shrink-0" />
                      <span className="text-sm">{error}</span>
                    </div>
                  )}

                  {/* Sign In Form */}
                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Email Field */}
                    <div className="relative">
                      <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                        Email Address
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Mail className={`h-5 w-5 transition-colors ${focusedField === 'email' ? 'text-teal-500' : 'text-slate-400'}`} />
                        </div>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          autoComplete="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          onFocus={() => setFocusedField('email')}
                          onBlur={() => setFocusedField(null)}
                          className={`block w-full pl-12 pr-4 py-3.5 bg-slate-50 border-2 rounded-xl text-slate-800 placeholder-slate-400 transition-all duration-200 outline-none ${
                            focusedField === 'email' 
                              ? 'border-teal-500 ring-4 ring-teal-500/20 bg-white' 
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                          placeholder="doctor@hospital.com"
                        />
                      </div>
                    </div>

                    {/* Password Field */}
                    <div className="relative">
                      <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                        Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Lock className={`h-5 w-5 transition-colors ${focusedField === 'password' ? 'text-teal-500' : 'text-slate-400'}`} />
                        </div>
                        <input
                          id="password"
                          name="password"
                          type="password"
                          autoComplete="current-password"
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          onFocus={() => setFocusedField('password')}
                          onBlur={() => setFocusedField(null)}
                          className={`block w-full pl-12 pr-4 py-3.5 bg-slate-50 border-2 rounded-xl text-slate-800 placeholder-slate-400 transition-all duration-200 outline-none ${
                            focusedField === 'password' 
                              ? 'border-teal-500 ring-4 ring-teal-500/20 bg-white' 
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                          placeholder="••••••••"
                        />
                      </div>
                    </div>

                    {/* Remember & Forgot */}
                    <div className="flex items-center justify-between text-sm">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500" />
                        <span className="text-slate-600">Remember me</span>
                      </label>
                      <a href="#" className="text-teal-600 hover:text-teal-700 font-medium">
                        Forgot password?
                      </a>
                    </div>

                    {/* Sign In Button */}
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full flex items-center justify-center gap-2 py-4 px-6 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-semibold rounded-xl shadow-lg shadow-teal-500/30 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      {loading ? (
                        <>
                          <Activity className="h-5 w-5 animate-pulse" />
                          Signing in...
                        </>
                      ) : (
                        <>
                          Sign In
                          <ChevronRight className="h-5 w-5" />
                        </>
                      )}
                    </button>
                  </form>

                  {/* Sign Up Link */}
                  <p className="mt-6 text-center text-slate-600">
                    Don't have an account?{' '}
                    <Link to="/signup" className="text-teal-600 hover:text-teal-700 font-semibold">
                      Create Account
                    </Link>
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column - Emergency Access */}
            <div className="order-1 lg:order-2 space-y-6">
              {/* Welcome Section */}
              <div className="text-center lg:text-left">
                <h1 className="text-4xl sm:text-5xl font-bold text-slate-800 mb-4">
                  Medi<span className="text-teal-600">Care</span> AI
                </h1>
                <p className="text-lg text-slate-600 max-w-md mx-auto lg:mx-0">
                  Your intelligent healthcare companion powered by advanced AI technology
                </p>
              </div>

              {/* Features */}
              <div className="grid grid-cols-2 gap-4 max-w-md mx-auto lg:mx-0">
                <div className="backdrop-blur-sm bg-white/60 rounded-2xl p-4 border border-white/50">
                  <HeartPulse className="h-8 w-8 text-teal-600 mb-2" />
                  <h3 className="font-semibold text-slate-800">Health Monitoring</h3>
                  <p className="text-sm text-slate-500">Real-time vitals tracking</p>
                </div>
                <div className="backdrop-blur-sm bg-white/60 rounded-2xl p-4 border border-white/50">
                  <Shield className="h-8 w-8 text-emerald-500 mb-2" />
                  <h3 className="font-semibold text-slate-800">Secure & Private</h3>
                  <p className="text-sm text-slate-500">HIPAA compliant</p>
                </div>
              </div>

              {/* Emergency Access Card */}
              <div className="backdrop-blur-xl bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-700/50 shadow-2xl max-w-md mx-auto lg:mx-0">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-rose-600 rounded-xl flex items-center justify-center shadow-lg shadow-rose-500/30">
                    <Zap className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Emergency Access</h3>
                    <p className="text-slate-400 text-sm">Quick guest entry</p>
                  </div>
                </div>
                
                <p className="text-slate-300 text-sm mb-6">
                  Need immediate access? Use our emergency guest mode to quickly access basic medical AI features without registration.
                </p>

                <div className="space-y-3">
                  <button
                    onClick={handleEmergencyAccess}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 py-4 px-6 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-semibold rounded-xl shadow-lg shadow-rose-500/30 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50"
                  >
                    <Zap className="h-5 w-5" />
                    Enter as Guest
                  </button>
                  
                  <p className="text-center text-slate-500 text-xs">
                    Limited features • No account required
                  </p>
                </div>

                {/* Trust Badges */}
                <div className="mt-6 pt-6 border-t border-slate-700/50 flex items-center justify-center gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">24/7</div>
                    <div className="text-xs text-slate-400">Available</div>
                  </div>
                  <div className="w-px h-10 bg-slate-700" />
                  <div className="text-center">
                    <div className="text-2xl font-bold text-emerald-400">100K+</div>
                    <div className="text-xs text-slate-400">Users</div>
                  </div>
                  <div className="w-px h-10 bg-slate-700" />
                  <div className="text-center">
                    <div className="text-2xl font-bold text-teal-400">AI</div>
                    <div className="text-xs text-slate-400">Powered</div>
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
