import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Loader2, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { toast } from 'sonner';

const Profile = () => {
  const { user, setUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({ name: user.name, email: user.email });
    }
  }, [user]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await api.put('/users/profile', formData);
      setUser(response.data); // Update global context immediately
      setIsEditing(false);
      toast.success('Profile updated successfully!', { icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" />});
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile.');
      toast.error('Profile update failed.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 sm:mb-12"
      >
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight mb-2 sm:mb-3">
          User <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-400 via-primary-500 to-indigo-500 drop-shadow-[0_0_15px_rgba(139,92,246,0.5)]">Profile</span>
        </h1>
        <p className="text-slate-400 text-base sm:text-lg font-medium max-w-2xl">Manage your personal information and account preferences.</p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card rounded-[2rem] sm:rounded-[3rem] p-8 sm:p-12 border border-white/5 relative overflow-hidden"
      >
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8 mb-12 relative z-10 w-full">
          <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-primary-500 to-indigo-500 p-1 shadow-[0_0_30px_rgba(124,58,237,0.4)] shrink-0 mt-2">
            <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center border border-white/10">
              <span className="text-4xl font-black text-white">{user?.name?.charAt(0)?.toUpperCase()}</span>
            </div>
          </div>
          
          <div className="flex-1 w-full text-center sm:text-left">
            {!isEditing ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
                  <h2 className="text-3xl font-bold text-white max-w-full break-words">{user?.name}</h2>
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white font-bold transition-all mx-auto sm:mx-0 shrink-0"
                  >
                    Edit Profile
                  </button>
                </div>
                <p className="text-slate-400 text-lg font-medium max-w-full break-all">{user?.email}</p>
                <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-primary-500/10 border border-primary-500/20 rounded-xl text-primary-400 font-bold text-sm">
                  <User className="w-4 h-4" />
                  Pro Member
                </div>
              </motion.div>
            ) : (
              <motion.form 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="w-full space-y-4 pt-1"
                onSubmit={handleUpdate}
              >
                {error && (
                  <div className="flex items-start gap-3 p-3 bg-red-500/10 text-red-500 text-sm font-bold rounded-xl border border-red-500/20 mb-4">
                    <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                    <p>{error}</p>
                  </div>
                )}
                <div className="space-y-1 text-left">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-primary-500 focus:bg-white/10 outline-none transition-all"
                  />
                </div>
                <div className="space-y-1 text-left">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-primary-500 focus:bg-white/10 outline-none transition-all"
                  />
                </div>
                <div className="flex items-center justify-end gap-3 pt-2">
                  <button 
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setFormData({ name: user.name, email: user.email });
                      setError('');
                    }}
                    disabled={isSubmitting}
                    className="px-5 py-2.5 text-slate-400 hover:text-white font-bold transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={isSubmitting || (formData.name === user.name && formData.email === user.email)}
                    className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-500 hover:to-indigo-500 text-white rounded-xl font-bold shadow-lg shadow-primary-500/25 transition-all disabled:opacity-50 active:scale-95"
                  >
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                    Save Changes
                  </button>
                </div>
              </motion.form>
            )}
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 relative z-10">
          <div className="max-w-2xl space-y-6">
            <h3 className="text-xl font-bold text-white mb-6">Account Settings (Coming Soon)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-4 bg-white/5 border border-white/5 rounded-2xl">
                <p className="text-slate-500 text-sm font-bold uppercase tracking-widest mb-1">Timezone</p>
                <p className="text-white font-medium">UTC</p>
              </div>
              <div className="p-4 bg-white/5 border border-white/5 rounded-2xl">
                <p className="text-slate-500 text-sm font-bold uppercase tracking-widest mb-1">Theme</p>
                <p className="text-white font-medium">Aurora Dark (Default)</p>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full blur-[80px] -mr-32 -mt-32 pointer-events-none"></div>
      </motion.div>
    </div>
  );
};

export default Profile;
