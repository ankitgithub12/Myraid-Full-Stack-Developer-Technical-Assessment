import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings as SettingsIcon, Bell, Lock, Paintbrush, Database, X, AlertOctagon, CheckCircle2, Loader2, Eye, EyeOff } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

const Settings = () => {
  const { logout } = useAuth();
  
  // UI State
  const [activeTab, setActiveTab] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Customization State
  const [theme, setTheme] = useState('dark');
  const [notifications, setNotifications] = useState(true);

  // Password State
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [passwordError, setPasswordError] = useState('');
  
  // Delete State
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteError, setDeleteError] = useState('');

  const getPasswordStrength = (pwd) => {
    if (!pwd) return null;
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[a-z]/.test(pwd)) score++;
    if (/\d/.test(pwd)) score++;
    if (/[@$!%*?&]/.test(pwd)) score++;
    if (score <= 1) return { label: 'Weak', color: 'bg-red-500', textColor: 'text-red-400', width: '20%' };
    if (score === 2) return { label: 'Fair', color: 'bg-orange-500', textColor: 'text-orange-400', width: '40%' };
    if (score === 3) return { label: 'Good', color: 'bg-yellow-400', textColor: 'text-yellow-400', width: '65%' };
    if (score === 4) return { label: 'Strong', color: 'bg-emerald-500', textColor: 'text-emerald-400', width: '85%' };
    return { label: 'Very Strong', color: 'bg-emerald-400', textColor: 'text-emerald-300', width: '100%' };
  };

  const newPasswordStrength = getPasswordStrength(passwordData.newPassword);

  const settingsOptions = [
    { id: 'appearance', icon: <Paintbrush />, title: "Appearance", desc: "Customize the theme and layout" },
    { id: 'notifications', icon: <Bell />, title: "Notifications", desc: "Manage alerts and email preferences" },
    { id: 'security', icon: <Lock />, title: "Privacy & Security", desc: "Change password and security options" },
    { id: 'data', icon: <Database />, title: "Data Management", desc: "Export or delete your account data" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 sm:mb-12"
      >
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight mb-2 sm:mb-3">
          App <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-400 via-primary-500 to-indigo-500 drop-shadow-[0_0_15px_rgba(139,92,246,0.5)]">Settings</span>
        </h1>
        <p className="text-slate-400 text-base sm:text-lg font-medium max-w-2xl">Configure your application preferences and features.</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10 w-full">
        
        {/* Settings Navigation */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col gap-4 lg:col-span-1"
        >
          {settingsOptions.map((opt) => (
            <div 
              key={opt.id} 
              onClick={() => setActiveTab(opt.id === activeTab ? null : opt.id)}
              className={`glass-card p-5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden group ${
                activeTab === opt.id 
                  ? 'border-primary-500/50 bg-primary-500/10 shadow-[0_0_20px_rgba(124,58,237,0.2)]' 
                  : 'border-white/5 hover:border-white/20 hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-4 relative z-10">
                <div className={`p-3 rounded-xl transition-colors ${
                  activeTab === opt.id ? 'bg-primary-500/20 text-primary-400' : 'bg-white/5 text-slate-400 group-hover:text-white'
                }`}>
                  {React.cloneElement(opt.icon, { className: 'w-5 h-5' })}
                </div>
                <div>
                  <h3 className={`font-bold transition-colors ${activeTab === opt.id ? 'text-primary-300' : 'text-white'}`}>{opt.title}</h3>
                  <p className="text-slate-400 text-xs mt-0.5">{opt.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Active Settings Panel */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 relative w-full overflow-hidden"
        >
          <div className="glass-card rounded-[2rem] p-8 sm:p-10 border border-white/5 shadow-2xl min-h-[400px]">
            {!activeTab ? (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-50 py-20">
                <SettingsIcon className="w-16 h-16 text-slate-400 mb-4 animate-[spin_10s_linear_infinite]" />
                <p className="text-xl font-bold text-white">Select a settings category</p>
                <p className="text-slate-400">Choose an option from the left menu to view details.</p>
              </div>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="w-full"
                >
                  {/* APPEARANCE */}
                  {activeTab === 'appearance' && (
                    <div className="space-y-8 fade-in w-full">
                      <div>
                        <h3 className="text-2xl font-bold text-white mb-6">Appearance</h3>
                        <div className="flex items-center justify-between p-5 bg-white/5 border border-white/10 rounded-2xl w-full">
                          <div>
                            <p className="text-white font-bold">Dark Theme</p>
                            <p className="text-slate-400 text-sm">Experience the premium Aurora Dark mode.</p>
                          </div>
                          <button 
                            onClick={() => {
                              setTheme(theme === 'dark' ? 'light' : 'dark');
                              toast.info(theme === 'dark' ? 'Light theme preview engaged (simulated)' : 'Dark theme activated');
                            }}
                            className={`w-14 h-7 rounded-full transition-colors relative flex items-center shrink-0 ${theme === 'dark' ? 'bg-primary-500' : 'bg-slate-600'}`}
                          >
                            <div className={`w-5 h-5 bg-white rounded-full absolute transition-all shadow-sm ${theme === 'dark' ? 'left-8' : 'left-1'}`}></div>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* NOTIFICATIONS */}
                  {activeTab === 'notifications' && (
                    <div className="space-y-8 fade-in w-full">
                      <div>
                        <h3 className="text-2xl font-bold text-white mb-6">Notifications</h3>
                        <div className="flex items-center justify-between p-5 bg-white/5 border border-white/10 rounded-2xl w-full">
                          <div>
                            <p className="text-white font-bold">Push Notifications</p>
                            <p className="text-slate-400 text-sm">Receive alerts for task deadlines.</p>
                          </div>
                          <button 
                            onClick={() => {
                              setNotifications(!notifications);
                              toast.success(`Notifications ${!notifications ? 'enabled' : 'disabled'}`);
                            }}
                            className={`w-14 h-7 rounded-full transition-colors relative flex items-center shrink-0 ${notifications ? 'bg-emerald-500' : 'bg-slate-600'}`}
                          >
                            <div className={`w-5 h-5 bg-white rounded-full absolute transition-all shadow-sm ${notifications ? 'left-8' : 'left-1'}`}></div>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* SECURITY */}
                  {activeTab === 'security' && (
                    <div className="space-y-6 fade-in w-full">
                      <h3 className="text-2xl font-bold text-white mb-2">Change Password</h3>
                      {passwordError && (
                        <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-bold rounded-xl mb-4 w-full break-words">
                          {passwordError}
                        </div>
                      )}
                      <form className="space-y-4 w-full" onSubmit={async (e) => {
                        e.preventDefault();
                        if (passwordData.newPassword !== passwordData.confirmPassword) {
                          return setPasswordError('New passwords do not match');
                        }
                        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
                        if (!passwordRegex.test(passwordData.newPassword)) {
                          return setPasswordError('Password must be at least 8 chars long with uppercase, lowercase, number, and special character');
                        }
                        setIsSubmitting(true);
                        setPasswordError('');
                        try {
                          await api.put('/users/password', { currentPassword: passwordData.currentPassword, newPassword: passwordData.newPassword });
                          toast.success('Password updated successfully');
                          setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                        } catch (err) {
                          setPasswordError(err.response?.data?.message || 'Failed to update password');
                        } finally {
                          setIsSubmitting(false);
                        }
                      }}>
                        <div className="w-full">
                          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Current Password</label>
                          <input type="password" required value={passwordData.currentPassword} onChange={e => setPasswordData({...passwordData, currentPassword: e.target.value})} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-primary-500 outline-none w-full box-border" />
                        </div>
                        <div className="w-full">
                          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">New Password</label>
                          <input type="password" required value={passwordData.newPassword} onChange={e => setPasswordData({...passwordData, newPassword: e.target.value})} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-primary-500 outline-none w-full box-border" />
                          {passwordData.newPassword && newPasswordStrength && (
                            <div className="mt-2 space-y-1">
                              <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                                <div 
                                  className={`h-full ${newPasswordStrength.color} rounded-full transition-all duration-500`}
                                  style={{ width: newPasswordStrength.width }}
                                />
                              </div>
                              <div className="flex justify-between items-center">
                                <p className={`text-xs font-bold ${newPasswordStrength.textColor}`}>{newPasswordStrength.label}</p>
                                <p className="text-slate-600 text-xs">A-Z, 0-9, @$!%*?&</p>
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="w-full">
                          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Confirm New Password</label>
                          <input type="password" required value={passwordData.confirmPassword} onChange={e => setPasswordData({...passwordData, confirmPassword: e.target.value})} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-primary-500 outline-none w-full box-border" />
                        </div>
                        <button type="submit" disabled={isSubmitting} className="mt-4 px-6 py-3 bg-primary-600 hover:bg-primary-500 text-white font-bold rounded-xl transition-colors disabled:opacity-50">
                          {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Update Password'}
                        </button>
                      </form>
                    </div>
                  )}

                  {/* DATA MANAGEMENT */}
                  {activeTab === 'data' && (
                    <div className="space-y-6 fade-in w-full">
                      <h3 className="text-2xl font-bold text-white mb-2">Danger Zone</h3>
                      <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-2xl w-full">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
                          <div className="flex-1 min-w-0 pr-4">
                            <h4 className="text-red-400 font-bold text-lg flex items-center gap-2 max-w-full"><AlertOctagon className="w-5 h-5 shrink-0" /> Delete Account</h4>
                            <p className="text-red-400/70 text-sm mt-1 break-words">Permanently remove your account and all associated data. This action cannot be reversed.</p>
                          </div>
                          <button 
                            onClick={() => setShowDeleteConfirm(true)}
                            className="px-5 py-2.5 bg-red-500/20 hover:bg-red-500 hover:text-white border border-red-500/50 text-red-400 font-bold rounded-xl transition-all shrink-0 max-w-[200px]"
                          >
                            Delete Account
                          </button>
                        </div>
                      </div>

                      {/* Delete Confirmation Modal */}
                      <AnimatePresence>
                        {showDeleteConfirm && (
                          <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden w-full"
                          >
                            <div className="p-6 bg-slate-900 border border-white/10 rounded-2xl w-full shadow-inner mt-4">
                              <p className="text-slate-300 font-medium mb-4 w-full break-words">To confirm deletion, please enter your password:</p>
                              {deleteError && <p className="text-red-400 text-sm font-bold mb-3 break-words">{deleteError}</p>}
                              <div className="flex flex-col sm:flex-row gap-3 w-full">
                                <input 
                                  type="password" 
                                  value={deletePassword}
                                  onChange={e => setDeletePassword(e.target.value)}
                                  placeholder="Current Password"
                                  className="flex-1 w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none min-w-0"
                                />
                                <div className="flex gap-2 shrink-0 self-end sm:self-auto w-full sm:w-auto">
                                  <button onClick={() => {setShowDeleteConfirm(false); setDeletePassword(''); setDeleteError('');}} className="flex-1 sm:flex-none px-4 py-3 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl transition-colors">Cancel</button>
                                  <button 
                                    onClick={async () => {
                                      if(!deletePassword) return setDeleteError('Password required');
                                      setIsSubmitting(true);
                                      try {
                                        await api.delete('/users/profile', { data: { password: deletePassword } });
                                        toast.success('Account successfully deleted');
                                        logout();
                                      } catch (err) {
                                        setDeleteError(err.response?.data?.message || 'Failed to delete account');
                                        setIsSubmitting(false);
                                      }
                                    }}
                                    disabled={isSubmitting}
                                    className="flex-1 sm:flex-none px-4 py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl transition-colors disabled:opacity-50"
                                  >
                                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Confirm'}
                                  </button>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}

                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-12 text-center"
      >
        <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">
          Version 2.0.0 &bull; TaskFlow
        </p>
      </motion.div>
    </div>
  );
};

export default Settings;
