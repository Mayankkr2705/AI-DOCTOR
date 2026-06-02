import { useState, useEffect } from 'react';
import { 
  Pill, 
  Plus, 
  Trash2, 
  Clock, 
  Calendar, 
  AlertCircle, 
  CheckCircle2, 
  Search,
  Filter,
  MoreVertical,
  Activity,
  ChevronRight,
  Info
} from 'lucide-react';
import { medicationAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const MedicationPage = () => {
  const { isGuest } = useAuth();
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newMed, setNewMed] = useState({
    name: '',
    dosage: '',
    frequency: 'Once daily',
    notes: '',
    timeOfDay: ['08:00'],
    quantity: 10,
    unit: 'tablets'
  });

  const fetchMedications = async () => {
    if (isGuest) {
      const saved = localStorage.getItem('guest_meds');
      setMedications(saved ? JSON.parse(saved) : []);
      setLoading(false);
      return;
    }

    try {
      const data = await medicationAPI.getMedications();
      setMedications(data);
    } catch (err) {
      setError('Failed to load medications');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedications();
  }, [isGuest]);

  const handleAddMedication = async (e) => {
    e.preventDefault();
    setError('');
    
    if (isGuest) {
      const guestMed = {
        ...newMed,
        _id: Date.now().toString(),
        isActive: true,
        createdAt: new Date().toISOString()
      };
      const updated = [guestMed, ...medications];
      setMedications(updated);
      localStorage.setItem('guest_meds', JSON.stringify(updated));
      setSuccess('Medication added successfully (Local storage)');
      setIsAddModalOpen(false);
      setNewMed({ name: '', dosage: '', frequency: 'Once daily', notes: '', timeOfDay: ['08:00'], quantity: 10, unit: 'tablets' });
      return;
    }

    try {
      const added = await medicationAPI.addMedication(newMed);
      setMedications([added, ...medications]);
      setSuccess('Medication added successfully!');
      setIsAddModalOpen(false);
      setNewMed({ name: '', dosage: '', frequency: 'Once daily', notes: '', timeOfDay: ['08:00'], quantity: 10, unit: 'tablets' });
    } catch (err) {
      setError('Failed to add medication');
    }
  };

  const handleDelete = async (id) => {
    if (isGuest) {
      const updated = medications.filter(m => m._id !== id);
      setMedications(updated);
      localStorage.setItem('guest_meds', JSON.stringify(updated));
      return;
    }

    try {
      await medicationAPI.deleteMedication(id);
      setMedications(medications.filter(m => m._id !== id));
    } catch (err) {
      setError('Failed to delete medication');
    }
  };

  const toggleActive = async (id) => {
    if (isGuest) {
      const updated = medications.map(m => 
        m._id === id ? { ...m, isActive: !m.isActive } : m
      );
      setMedications(updated);
      localStorage.setItem('guest_meds', JSON.stringify(updated));
      return;
    }

    try {
      const updated = await medicationAPI.toggleActive(id);
      setMedications(medications.map(m => m._id === id ? updated : m));
    } catch (err) {
      setError('Failed to update status');
    }
  };

  const handleTakeDose = async (id) => {
    if (isGuest) {
      const updated = medications.map(m => {
        if (m._id === id && m.quantity > 0) {
          return { ...m, quantity: m.quantity - 1 };
        }
        return m;
      });
      setMedications(updated);
      localStorage.setItem('guest_meds', JSON.stringify(updated));
      return;
    }

    try {
      const updated = await medicationAPI.takeDose(id);
      setMedications(medications.map(m => m._id === id ? updated : m));
    } catch (err) {
      setError('Failed to update quantity');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden font-sans pb-16">
      {/* Decorative Blur Orbs */}
      <div className="absolute top-[-5%] right-[-5%] w-[40%] h-[40%] bg-teal-400/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[-5%] w-[40%] h-[40%] bg-indigo-400/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
              <Pill className="h-8 w-8 text-teal-600" />
              Medication Tracker
            </h1>
            <p className="text-slate-500 mt-1">Manage your prescriptions and daily supplements safely.</p>
          </div>
          
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center justify-center space-x-2 bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-6 rounded-2xl shadow-lg shadow-teal-600/20 transition transform hover:-translate-y-0.5 active:scale-95"
          >
            <Plus className="h-5 w-5" />
            <span>Add Medication</span>
          </button>
        </div>

        {error && (
          <div className="mb-6 flex items-start gap-3 bg-rose-50 border border-rose-100 text-rose-700 px-4 py-3 rounded-2xl animate-fade-in text-sm">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 flex items-start gap-3 bg-emerald-50 border border-emerald-100 text-emerald-700 px-4 py-3 rounded-2xl animate-fade-in text-sm">
            <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
            <p>{success}</p>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Activity className="h-10 w-10 text-teal-600 animate-spin mb-4" />
            <p className="text-slate-500 font-medium">Loading your medications...</p>
          </div>
        ) : medications.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center shadow-sm">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Pill className="h-10 w-10 text-slate-300" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">No medications found</h3>
            <p className="text-slate-500 max-w-md mx-auto mb-8">Start tracking your health by adding your first medication. We'll help you keep track of dosages and schedules.</p>
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="text-teal-600 font-bold hover:text-teal-700 underline underline-offset-4"
            >
              Add your first medication now
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {medications.map((med) => {
              const isLowStock = med.quantity < 2;
              return (
              <div 
                key={med._id}
                className={`group bg-white rounded-3xl border transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 ${
                  med.isActive ? 'border-slate-200' : 'border-slate-100 opacity-75'
                } ${isLowStock && med.isActive ? 'ring-2 ring-rose-500/20 border-rose-200' : ''}`}
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className={`p-3 rounded-2xl ${med.isActive ? 'bg-teal-50 text-teal-600' : 'bg-slate-100 text-slate-400'}`}>
                      <Pill className="h-6 w-6" />
                    </div>
                    <div className="flex items-center space-x-1">
                      <button 
                        onClick={() => toggleActive(med._id)}
                        className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full border transition-colors ${
                          med.isActive 
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100' 
                            : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'
                        }`}
                      >
                        {med.isActive ? 'Active' : 'Paused'}
                      </button>
                      <button 
                        onClick={() => handleDelete(med._id)}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <h3 className={`text-lg font-bold mb-1 truncate ${med.isActive ? 'text-slate-900' : 'text-slate-500'}`}>
                    {med.name}
                  </h3>
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-slate-500 text-sm flex items-center gap-1.5 font-medium">
                      <Activity className="h-3.5 w-3.5" />
                      {med.dosage}
                    </p>
                    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold ${
                      med.quantity <= 0 
                        ? 'bg-rose-100 text-rose-700' 
                        : med.quantity < 2 
                          ? 'bg-amber-100 text-amber-700' 
                          : 'bg-slate-100 text-slate-700'
                    }`}>
                      <span>{med.quantity} {med.unit || 'tablets'} left</span>
                    </div>
                  </div>

                  {isLowStock && med.isActive && (
                    <div className="mb-4 flex items-center gap-2 bg-rose-50 border border-rose-100 text-rose-700 px-3 py-2 rounded-xl text-[10px] font-bold animate-pulse">
                      <AlertCircle className="h-3.5 w-3.5" />
                      <span>LOW STOCK ALERT: Refill soon!</span>
                    </div>
                  )}

                  <div className="space-y-3 pt-4 border-t border-slate-50">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" />
                        Frequency
                      </span>
                      <span className="text-slate-700 font-semibold">{med.frequency}</span>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" />
                        Reminder Times
                      </span>
                      <div className="flex flex-wrap justify-end gap-1">
                        {med.timeOfDay?.map((time, idx) => (
                          <span key={idx} className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-mono font-bold">
                            {time}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {med.notes && (
                    <div className="mt-4 p-3 bg-slate-50 rounded-2xl text-[11px] text-slate-500 italic leading-relaxed">
                      "{med.notes}"
                    </div>
                  )}

                  <button
                    onClick={() => handleTakeDose(med._id)}
                    disabled={!med.isActive || med.quantity <= 0}
                    className={`mt-4 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-xs transition-all ${
                      !med.isActive || med.quantity <= 0
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        : 'bg-teal-600 text-white hover:bg-teal-700 shadow-md shadow-teal-600/10'
                    }`}
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Mark Dose as Taken
                  </button>
                </div>
                
                <div className="px-6 py-4 bg-slate-50/50 rounded-b-3xl border-t border-slate-100 flex items-center justify-between">
                   <span className="text-[10px] text-slate-400 font-medium italic">
                    Added on {new Date(med.createdAt).toLocaleDateString()}
                   </span>
                   <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-teal-500 transition-colors" />
                </div>
              </div>
            );})}
          </div>
        )}

        {/* Info Box */}
        <div className="mt-12 bg-indigo-50/50 border border-indigo-100 p-6 rounded-3xl flex gap-4">
          <div className="p-3 bg-white rounded-2xl shadow-sm h-fit">
            <Info className="h-6 w-6 text-indigo-600" />
          </div>
          <div>
            <h4 className="font-bold text-indigo-900 mb-1 text-sm">Safe Usage Reminder</h4>
            <p className="text-xs text-indigo-700/80 leading-relaxed">
              This tracker is for informational purposes. Never change your prescribed dosage without consulting your physician. If you experience unexpected side effects, contact a medical professional immediately.
            </p>
          </div>
        </div>

        {/* Add Medication Modal */}
        {isAddModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsAddModalOpen(false)} />
            <div className="relative bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden animate-scale-in">
              <div className="bg-teal-600 px-8 py-6 text-white">
                <h2 className="text-2xl font-bold">New Medication</h2>
                <p className="text-teal-100 text-sm mt-1">Fill in the details to start tracking.</p>
              </div>
              
              <form onSubmit={handleAddMedication} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Medication Name</label>
                  <input 
                    required
                    type="text"
                    value={newMed.name}
                    onChange={(e) => setNewMed({...newMed, name: e.target.value})}
                    placeholder="e.g. Paracetamol, Vitamin D3"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 text-sm focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Dosage</label>
                    <input 
                      required
                      type="text"
                      value={newMed.dosage}
                      onChange={(e) => setNewMed({...newMed, dosage: e.target.value})}
                      placeholder="e.g. 500mg, 1 tablet"
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 text-sm focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Frequency</label>
                    <select 
                      value={newMed.frequency}
                      onChange={(e) => setNewMed({...newMed, frequency: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 text-sm focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all appearance-none"
                    >
                      <option>Once daily</option>
                      <option>Twice a day</option>
                      <option>Three times a day</option>
                      <option>Every 8 hours</option>
                      <option>Weekly</option>
                      <option>As needed (PRN)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Total Quantity</label>
                    <input 
                      required
                      type="number"
                      min="0"
                      value={newMed.quantity}
                      onChange={(e) => setNewMed({...newMed, quantity: parseInt(e.target.value)})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 text-sm focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Unit</label>
                    <input 
                      required
                      type="text"
                      value={newMed.unit}
                      onChange={(e) => setNewMed({...newMed, unit: e.target.value})}
                      placeholder="tablets, capsules, ml..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 text-sm focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Reminder Time</label>
                  <input 
                    type="time"
                    value={newMed.timeOfDay[0]}
                    onChange={(e) => setNewMed({...newMed, timeOfDay: [e.target.value]})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 text-sm focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Notes (Optional)</label>
                  <textarea 
                    value={newMed.notes}
                    onChange={(e) => setNewMed({...newMed, notes: e.target.value})}
                    placeholder="Take after meals, avoid caffeine..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 text-sm focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all resize-none"
                    rows="2"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="flex-1 px-6 py-3 border border-slate-200 text-slate-600 font-bold rounded-2xl hover:bg-slate-50 transition active:scale-95"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 px-6 py-3 bg-teal-600 text-white font-bold rounded-2xl hover:bg-teal-700 shadow-lg shadow-teal-600/20 transition active:scale-95"
                  >
                    Save Medication
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicationPage;
