import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  User, 
  Mail, 
  Lock, 
  AlertCircle, 
  CheckCircle2, 
  Activity, 
  ShieldAlert, 
  Trash2,
  ArrowLeft
} from 'lucide-react';

const ProfilePage = () => {
  const { user, updateProfile, deleteProfile } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [focusedField, setFocusedField] = useState(null);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (password && password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    const result = await updateProfile(name, email, password || undefined);
    setLoading(false);

    if (result.success) {
      setSuccess('Profile updated successfully!');
      setPassword('');
      setConfirmPassword('');
    } else {
      setError(result.error);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText.toLowerCase() !== 'delete') {
      setError('Please type "delete" to confirm account deletion.');
      return;
    }
    
    setError('');
    setLoading(true);
    const result = await deleteProfile();
    setLoading(false);

    if (result.success) {
      navigate('/signin');
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden font-sans pb-16">
      {/* Decorative Blur Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-teal-400/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[50%] h-[50%] bg-cyan-400/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-8">
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)}
          className="inline-flex items-center space-x-2 text-slate-500 hover:text-slate-800 transition-colors mb-6 text-sm font-semibold"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </button>

        <div className="grid md:grid-cols-12 gap-8">
          {/* Left Column: Form details */}
          <div className="md:col-span-8">
            <div className="bg-white/70 backdrop-blur-md rounded-3xl shadow-xl border border-slate-200/50 p-6 sm:p-8">
              <h1 className="text-2xl font-bold text-slate-900 mb-2">Account Settings</h1>
              <p className="text-slate-500 text-sm mb-6">Update your personal account details, email address, or update credentials.</p>

              {error && (
                <div className="mb-6 flex items-start gap-2 bg-rose-55 border border-rose-200 text-rose-700 px-4 py-3 rounded-2xl animate-fade-in text-sm">
                  <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {success && (
                <div className="mb-6 flex items-start gap-2 bg-emerald-50 border border-emerald-250 text-emerald-700 px-4 py-3 rounded-2xl animate-fade-in text-sm">
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  <span>{success}</span>
                </div>
              )}

              <form onSubmit={handleUpdate} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Full Name</label>
                  <div className="relative">
                    <User className={`absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 transition-colors ${focusedField === 'name' ? 'text-teal-600' : 'text-slate-400'}`} />
                    <input 
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      onFocus={() => setFocusedField('name')}
                      onBlur={() => setFocusedField(null)}
                      className="block w-full pl-11 pr-4 py-3 bg-white/50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 rounded-xl text-sm outline-none text-slate-800 transition-all duration-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Email Address</label>
                  <div className="relative">
                    <Mail className={`absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 transition-colors ${focusedField === 'email' ? 'text-teal-600' : 'text-slate-400'}`} />
                    <input 
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField(null)}
                      className="block w-full pl-11 pr-4 py-3 bg-white/50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 rounded-xl text-sm outline-none text-slate-800 transition-all duration-200"
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <h3 className="text-sm font-bold text-slate-800 mb-3">Update Password (Optional)</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">New Password</label>
                      <div className="relative">
                        <Lock className={`absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 transition-colors ${focusedField === 'password' ? 'text-teal-600' : 'text-slate-400'}`} />
                        <input 
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          onFocus={() => setFocusedField('password')}
                          onBlur={() => setFocusedField(null)}
                          placeholder="••••••••"
                          className="block w-full pl-11 pr-4 py-3 bg-white/50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 rounded-xl text-sm outline-none text-slate-800 transition-all duration-200"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Confirm Password</label>
                      <div className="relative">
                        <Lock className={`absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 transition-colors ${focusedField === 'confirm' ? 'text-teal-600' : 'text-slate-400'}`} />
                        <input 
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          onFocus={() => setFocusedField('confirm')}
                          onBlur={() => setFocusedField(null)}
                          placeholder="••••••••"
                          className="block w-full pl-11 pr-4 py-3 bg-white/50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 rounded-xl text-sm outline-none text-slate-800 transition-all duration-200"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center justify-center space-x-2 py-3 px-6 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-md transition transform hover:-translate-y-0.5 disabled:opacity-50 text-sm ml-auto"
                >
                  {loading ? (
                    <>
                      <Activity className="h-4 w-4 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>Save Changes</span>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Right Column: Profile Overview & Danger Zone */}
          <div className="md:col-span-4 space-y-6">
            <div className="bg-white/70 backdrop-blur-md rounded-3xl shadow-xl border border-slate-200/50 p-6 text-center">
              <div className="w-20 h-20 rounded-full bg-teal-100 text-teal-600 mx-auto flex items-center justify-center mb-4 border border-teal-200">
                <User className="h-10 w-10" />
              </div>
              <h2 className="text-lg font-bold text-slate-850 truncate">{user?.name}</h2>
              <p className="text-xs text-slate-500 mb-4">{user?.email}</p>
              <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-teal-500/10 text-teal-700 border border-teal-500/20 uppercase tracking-wider">
                {user?.role || 'User'}
              </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-rose-50/70 backdrop-blur-md rounded-3xl shadow-xl border border-rose-100 p-6">
              <div className="flex items-center space-x-2 text-rose-800 mb-4">
                <ShieldAlert className="h-5 w-5" />
                <h3 className="font-bold text-sm uppercase tracking-wider">Danger Zone</h3>
              </div>
              <p className="text-xs text-rose-700 mb-4 leading-relaxed">
                Permanently delete your account. This action is irreversible and all your health scores, chat history, and analysis records will be permanently erased.
              </p>

              {!showDeleteConfirm ? (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-md transition"
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="text-sm">Delete Account</span>
                </button>
              ) : (
                <div className="space-y-3 animate-fade-in">
                  <label className="block text-[10px] font-bold text-rose-800 uppercase mb-1">
                    Type "delete" to confirm:
                  </label>
                  <input
                    type="text"
                    value={deleteConfirmText}
                    onChange={(e) => setDeleteConfirmText(e.target.value)}
                    placeholder="delete"
                    className="block w-full px-3 py-2 bg-white border border-rose-200 rounded-lg text-xs outline-none text-rose-800 focus:ring-2 focus:ring-rose-500/20"
                  />
                  <div className="flex space-x-2">
                    <button
                      onClick={handleDeleteAccount}
                      disabled={loading || deleteConfirmText.toLowerCase() !== 'delete'}
                      className="flex-1 py-2 px-3 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-bold rounded-lg text-xs transition"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => {
                        setShowDeleteConfirm(false);
                        setDeleteConfirmText('');
                      }}
                      className="flex-1 py-2 px-3 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-lg text-xs transition"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
