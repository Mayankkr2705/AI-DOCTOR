import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Stethoscope, 
  Mail, 
  Lock, 
  User,
  AlertCircle, 
  HeartPulse, 
  Shield, 
  Zap,
  ChevronRight,
  Activity,
  CheckCircle2,
  Bot,
  FileText
} from 'lucide-react';

const SignUp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  
  const { register, loginAsGuest } = useAuth();
  const navigate = useNavigate();

  // Password strength checker
  const getPasswordStrength = (pass) => {
    let strength = 0;
    if (pass.length >= 6) strength++;
    if (pass.length >= 8) strength++;
    if (/[A-Z]/.test(pass)) strength++;
    if (/[0-9]/.test(pass)) strength++;
    if (/[^A-Za-z0-9]/.test(pass)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength(password);
  const strengthColors = ['bg-slate-200', 'bg-rose-500', 'bg-orange-500', 'bg-yellow-500', 'bg-emerald-400', 'bg-emerald-500'];
  const strengthLabels = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Excellent'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    const result = await register(name, email, password);
    
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

  // Calculate progress based on filled fields
  const filledFields = [name, email, password, confirmPassword].filter(f => f.length > 0).length;
  const progress = (filledFields / 4) * 100;

  return (
    <div className="min-h-screen bg-slate-100 relative overflow-hidden">
      {/* Progress Bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-slate-200 z-50">
        <div 
          className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 transition-all duration-500 ease-out" 
          style={{ width: `${progress}%` }}
        />
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
        className="absolute bottom-0 left-0 w-[600px] h-[600px] opacity-[0.05] text-teal-600 transform -scale-x-100"
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
        {[10, 30, 50, 70, 90, 110, 130, 150, 170, 190].map((y, i) => (
          <line key={i} x1="40" y1={y} x2="160" y2={y} stroke="currentColor" strokeWidth="0.5" opacity="0.5" />
        ))}
      </svg>

      {/* Heartbeat Line SVG */}
      <svg
        className="absolute bottom-20 right-0 w-full h-32 opacity-[0.04]"
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
            
            {/* Left Column - Emergency Access & Features */}
            <div className="order-1 space-y-6">
              {/* Welcome Section */}
              <div className="text-center lg:text-left">
                <h1 className="text-4xl sm:text-5xl font-bold text-slate-800 mb-4">
                  Join Medi<span className="text-teal-600">Care</span> AI
                </h1>
                <p className="text-lg text-slate-600 max-w-md mx-auto lg:mx-0">
                  Create your account and unlock the full potential of AI-powered healthcare
                </p>
              </div>

              {/* Benefits List */}
              <div className="space-y-4 max-w-md mx-auto lg:mx-0">
                <div className="flex items-start gap-4 backdrop-blur-sm bg-white/60 rounded-2xl p-4 border border-white/50">
                  <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Bot className="h-5 w-5 text-teal-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800">AI Medical Assistant</h3>
                    <p className="text-sm text-slate-500">Get instant answers to health questions from our advanced AI</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 backdrop-blur-sm bg-white/60 rounded-2xl p-4 border border-white/50">
                  <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <FileText className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800">Report Analysis</h3>
                    <p className="text-sm text-slate-500">Upload and analyze medical reports with AI insights</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 backdrop-blur-sm bg-white/60 rounded-2xl p-4 border border-white/50">
                  <div className="w-10 h-10 bg-cyan-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <HeartPulse className="h-5 w-5 text-cyan-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800">Health Tracking</h3>
                    <p className="text-sm text-slate-500">Monitor your health journey with personalized dashboards</p>
                  </div>
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
                    <p className="text-slate-400 text-sm">Skip registration</p>
                  </div>
                </div>
                
                <p className="text-slate-300 text-sm mb-6">
                  Need help right now? Enter as a guest to access basic AI medical consultation without creating an account.
                </p>

                <button
                  onClick={handleEmergencyAccess}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-4 px-6 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-semibold rounded-xl shadow-lg shadow-rose-500/30 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50"
                >
                  <Zap className="h-5 w-5" />
                  Quick Guest Access
                </button>
                
                <div className="mt-4 flex items-center justify-center gap-4 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Shield className="h-3 w-3" />
                    Secure
                  </span>
                  <span>•</span>
                  <span>No credit card</span>
                  <span>•</span>
                  <span>Instant access</span>
                </div>
              </div>
            </div>

            {/* Right Column - Sign Up Card */}
            <div className="order-2">
              {/* Glassmorphism Card */}
              <div className="backdrop-blur-xl bg-white/80 rounded-3xl shadow-2xl border border-white/50 p-8 sm:p-10 relative overflow-hidden">
                {/* Decorative gradient orbs */}
                <div className="absolute -top-20 -left-20 w-40 h-40 bg-gradient-to-br from-emerald-400/20 to-teal-400/20 rounded-full blur-3xl" />
                <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-gradient-to-br from-teal-400/20 to-cyan-400/20 rounded-full blur-3xl" />
                
                <div className="relative z-10">
                  {/* Logo & Header */}
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl shadow-lg shadow-teal-500/30 mb-4">
                      <Stethoscope className="h-8 w-8 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800">
                      Create Your Account
                    </h2>
                    <p className="mt-2 text-slate-600">
                      Join thousands of healthcare professionals
                    </p>
                  </div>

                  {/* Step Indicator */}
                  <div className="flex items-center justify-center gap-2 mb-6">
                    {[1, 2, 3, 4].map((s) => (
                      <div
                        key={s}
                        className={`w-2 h-2 rounded-full transition-all ${
                          filledFields >= s ? 'bg-teal-500 w-4' : 'bg-slate-200'
                        }`}
                      />
                    ))}
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="mb-6 flex items-center gap-2 bg-rose-50 border border-rose-200 text-rose-600 px-4 py-3 rounded-xl">
                      <AlertCircle className="h-5 w-5 flex-shrink-0" />
                      <span className="text-sm">{error}</span>
                    </div>
                  )}

                  {/* Sign Up Form */}
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name Field */}
                    <div className="relative">
                      <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                        Full Name
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <User className={`h-5 w-5 transition-colors ${focusedField === 'name' ? 'text-teal-500' : 'text-slate-400'}`} />
                        </div>
                        <input
                          id="name"
                          name="name"
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          onFocus={() => setFocusedField('name')}
                          onBlur={() => setFocusedField(null)}
                          className={`block w-full pl-12 pr-4 py-3.5 bg-slate-50 border-2 rounded-xl text-slate-800 placeholder-slate-400 transition-all duration-200 outline-none ${
                            focusedField === 'name' 
                              ? 'border-teal-500 ring-4 ring-teal-500/20 bg-white' 
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                          placeholder="Dr. John Smith"
                        />
                        {name && (
                          <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                          </div>
                        )}
                      </div>
                    </div>

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
                        {email && email.includes('@') && (
                          <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                          </div>
                        )}
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
                          placeholder="Min 6 characters"
                        />
                      </div>
                      {/* Password Strength Indicator */}
                      {password && (
                        <div className="mt-2">
                          <div className="flex gap-1 mb-1">
                            {[1, 2, 3, 4, 5].map((level) => (
                              <div
                                key={level}
                                className={`h-1 flex-1 rounded-full transition-all ${
                                  passwordStrength >= level ? strengthColors[passwordStrength] : 'bg-slate-200'
                                }`}
                              />
                            ))}
                          </div>
                          <p className={`text-xs ${passwordStrength >= 4 ? 'text-emerald-500' : passwordStrength >= 2 ? 'text-orange-500' : 'text-rose-500'}`}>
                            {strengthLabels[passwordStrength]}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Confirm Password Field */}
                    <div className="relative">
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 mb-2">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Lock className={`h-5 w-5 transition-colors ${focusedField === 'confirmPassword' ? 'text-teal-500' : 'text-slate-400'}`} />
                        </div>
                        <input
                          id="confirmPassword"
                          name="confirmPassword"
                          type="password"
                          required
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          onFocus={() => setFocusedField('confirmPassword')}
                          onBlur={() => setFocusedField(null)}
                          className={`block w-full pl-12 pr-4 py-3.5 bg-slate-50 border-2 rounded-xl text-slate-800 placeholder-slate-400 transition-all duration-200 outline-none ${
                            focusedField === 'confirmPassword' 
                              ? 'border-teal-500 ring-4 ring-teal-500/20 bg-white' 
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                          placeholder="Repeat password"
                        />
                        {confirmPassword && password === confirmPassword && (
                          <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Terms */}
                    <div className="flex items-start gap-2">
                      <input 
                        type="checkbox" 
                        required
                        className="mt-1 w-4 h-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500" 
                      />
                      <span className="text-sm text-slate-600">
                        I agree to the{' '}
                        <a href="#" className="text-teal-600 hover:underline">Terms of Service</a>
                        {' '}and{' '}
                        <a href="#" className="text-teal-600 hover:underline">Privacy Policy</a>
                      </span>
                    </div>

                    {/* Sign Up Button */}
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full flex items-center justify-center gap-2 py-4 px-6 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-semibold rounded-xl shadow-lg shadow-teal-500/30 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      {loading ? (
                        <>
                          <Activity className="h-5 w-5 animate-pulse" />
                          Creating account...
                        </>
                      ) : (
                        <>
                          Create Account
                          <ChevronRight className="h-5 w-5" />
                        </>
                      )}
                    </button>
                  </form>

                  {/* Sign In Link */}
                  <p className="mt-6 text-center text-slate-600">
                    Already have an account?{' '}
                    <Link to="/signin" className="text-teal-600 hover:text-teal-700 font-semibold">
                      Sign In
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
