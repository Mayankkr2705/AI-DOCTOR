import { useState, useEffect } from 'react';
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
  
  const { register, loginAsGuest, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleGoogleCallback = async (response) => {
    setError('');
    setLoading(true);
    const result = await loginWithGoogle(response.credential);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (window.google) {
      try {
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || "180293113941-mockid.apps.googleusercontent.com",
          callback: handleGoogleCallback,
        });

        window.google.accounts.id.renderButton(
          document.getElementById("googleBtn"),
          { theme: "outline", size: "large", text: "signup_with" }
        );
      } catch (err) {
        console.error("Google accounts SDK failed to load:", err);
      }
    }
  }, []);

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
  const strengthColors = ['bg-slate-200', 'bg-rose-500', 'bg-orange-500', 'bg-yellow-505', 'bg-emerald-400', 'bg-emerald-500'];
  const strengthLabels = ['', 'Weak Password', 'Fair Strength', 'Good Strength', 'Strong Password', 'Excellent Security'];

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
    <div className="min-h-screen bg-slate-50 relative overflow-hidden font-sans">
      {/* Top Progress Bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-slate-200 z-50">
        <div 
          className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 transition-all duration-500 ease-out" 
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Decorative Blur Orbs */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-teal-400/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-violet-400/15 rounded-full blur-[120px] pointer-events-none" />

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
            
            {/* Left Column - Benefits list */}
            <div className="order-2 lg:order-1 space-y-6">
              <div className="text-center lg:text-left">
                <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                  Join Medi<span className="text-teal-600">Care</span> AI
                </h1>
                <p className="text-sm sm:text-base text-slate-500 max-w-md mx-auto lg:mx-0 mt-2 leading-relaxed">
                  Register today to create a confidential personal health workspace, analyze clinical reports, and chart wellness indicators.
                </p>
              </div>

              {/* Benefits Cards */}
              <div className="space-y-4 max-w-md mx-auto lg:mx-0">
                <div className="flex items-start gap-4 bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-slate-200/50 shadow-sm transition hover:shadow-md hover:bg-white">
                  <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Bot className="h-5 w-5 text-teal-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm">AI Medical Consults</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Specialized bots for custom age groups and veterinary advice</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-slate-200/50 shadow-sm transition hover:shadow-md hover:bg-white">
                  <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <FileText className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm">Report Text Extraction</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Index text from scanned files and diagnostic PDFs in MongoDB</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-slate-200/50 shadow-sm transition hover:shadow-md hover:bg-white">
                  <div className="w-10 h-10 bg-cyan-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <HeartPulse className="h-5 w-5 text-cyan-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm">Health Scoring Charts</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Track your assessments and retake metrics history anytime</p>
                  </div>
                </div>
              </div>

              {/* Guest Access Box */}
              <div className="bg-gradient-to-br from-teal-950 via-slate-900 to-slate-950 border border-teal-500/25 rounded-3xl p-6 sm:p-8 shadow-xl shadow-teal-950/20 max-w-md mx-auto lg:mx-0 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/10 rounded-full blur-xl pointer-events-none" />
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-rose-500 to-rose-600 rounded-xl flex items-center justify-center shadow-lg shadow-rose-500/20">
                      <Zap className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm sm:text-base tracking-wide">Emergency Access</h3>
                      <p className="text-teal-400 text-xs">Access basic AI tools instantly</p>
                    </div>
                  </div>
                  
                  <p className="text-teal-200/80 text-xs sm:text-sm leading-relaxed mb-6">
                    Skip the fields. Enter as a guest immediately to try out general symptoms consultations.
                  </p>

                  <button
                    onClick={handleEmergencyAccess}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-1.5 py-3.5 px-6 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-bold rounded-xl shadow-lg shadow-rose-500/20 transition transform hover:-translate-y-0.5 disabled:opacity-50 disabled:transform-none text-sm"
                  >
                    <Zap className="h-4 w-4" />
                    <span>Quick Guest Access</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column - Form */}
            <div className="order-1 lg:order-2">
              <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl shadow-slate-200/85 border border-white/60 p-8 sm:p-10 relative overflow-hidden transition-all duration-350 hover:shadow-teal-950/5">
                <div className="absolute top-0 left-0 w-32 h-32 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />
                
                <div className="relative z-10">
                  {/* Header */}
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-2xl shadow-md shadow-teal-500/20 mb-4">
                      <Stethoscope className="h-7 w-7 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                      Create Your Account
                    </h2>
                    <p className="mt-1.5 text-sm text-slate-500">
                      Join us for a smarter health workspace
                    </p>
                  </div>

                  {/* Step Dot Indicators */}
                  <div className="flex items-center justify-center gap-2 mb-6">
                    {[1, 2, 3, 4].map((s) => (
                      <div
                        key={s}
                        className={`w-1.5 h-1.5 rounded-full transition-all ${
                          filledFields >= s ? 'bg-teal-500 w-3.5' : 'bg-slate-200'
                        }`}
                      />
                    ))}
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
                      <label htmlFor="name" className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                        Full Name
                      </label>
                      <div className="relative">
                        <User className={`absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 transition-colors ${focusedField === 'name' ? 'text-teal-500' : 'text-slate-400'}`} />
                        <input
                          id="name"
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          onFocus={() => setFocusedField('name')}
                          onBlur={() => setFocusedField(null)}
                          className="block w-full pl-11 pr-4 py-3 bg-white/50 border border-slate-200/80 focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 rounded-xl text-sm outline-none text-slate-800 transition-all duration-200"
                          placeholder="Mr, John Smith"
                        />
                      </div>
                    </div>

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
                          placeholder="name@gmail.com"
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
                          placeholder="Min 6 characters"
                        />
                      </div>
                      {/* Strength Bar */}
                      {password && (
                        <div className="mt-2 animate-fade-in">
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
                          <p className={`text-[10px] font-bold ${passwordStrength >= 4 ? 'text-emerald-600' : passwordStrength >= 2 ? 'text-amber-600' : 'text-rose-600'}`}>
                            {strengthLabels[passwordStrength]}
                          </p>
                        </div>
                      )}
                    </div>

                    <div>
                      <label htmlFor="confirmPassword" className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <Lock className={`absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 transition-colors ${focusedField === 'confirmPassword' ? 'text-teal-500' : 'text-slate-400'}`} />
                        <input
                          id="confirmPassword"
                          type="password"
                          required
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          onFocus={() => setFocusedField('confirmPassword')}
                          onBlur={() => setFocusedField(null)}
                          className="block w-full pl-11 pr-4 py-3 bg-white/50 border border-slate-200/80 focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 rounded-xl text-sm outline-none text-slate-800 transition-all duration-200"
                          placeholder="Repeat password"
                        />
                        {confirmPassword && password === confirmPassword && (
                          <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Agree box */}
                    <div className="flex items-start gap-2 pt-1">
                      <input 
                        type="checkbox" 
                        required
                        className="mt-0.5 w-4 h-4 rounded border-slate-350 text-teal-600 focus:ring-teal-500/20 focus:ring-2" 
                      />
                      <span className="text-[11px] text-slate-500 leading-snug">
                        I agree to the{' '}
                        <a href="#" className="text-teal-600 hover:underline font-semibold">Terms of Service</a>
                        {' '}and{' '}
                        <a href="#" className="text-teal-600 hover:underline font-semibold">Privacy Policy</a>.
                      </span>
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
                          <span>Creating account...</span>
                        </>
                      ) : (
                        <>
                          <span>Create Account</span>
                          <ChevronRight className="h-4 w-4" />
                        </>
                      )}
                    </button>
                  </form>

                  {/* Google OAuth SignUp Button */}
                  <div className="mt-5 pt-4 border-t border-slate-100/60 flex flex-col items-center">
                    <span className="text-[10px] text-slate-400 mb-3 uppercase font-bold tracking-wider">Or register using</span>
                    <div id="googleBtn" className="w-full flex justify-center min-h-[40px]"></div>
                  </div>

                  {/* Sign In Link */}
                  <p className="mt-6 text-center text-sm text-slate-500">
                    Already have an account?{' '}
                    <Link to="/signin" className="text-teal-600 hover:text-teal-700 font-bold">
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
