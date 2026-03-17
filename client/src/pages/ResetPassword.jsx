import React, { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { Lock, AlertCircle, Loader2, ChevronRight, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { resettoken } = useParams();
  const navigate = useNavigate();

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

  const passwordStrength = getPasswordStrength(password);

  const validateForm = () => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      setError('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&).');
      return false;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setError('');

    try {
      await api.put(`/auth/resetpassword/${resettoken}`, { password });
      setSuccess(true);
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password. Token may be invalid or expired.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="min-h-screen flex items-center justify-center p-4 sm:p-8 relative z-10"
    >
      <div className="w-full max-w-md glass-card rounded-[2.5rem] sm:rounded-[3rem] p-8 sm:p-12 shadow-2xl relative overflow-hidden">
        {/* Decorative Orbs */}
        <div className="absolute top-[-20%] left-[-20%] w-64 h-64 bg-emerald-600/20 rounded-full blur-[80px] pointer-events-none"></div>
        <div className="absolute bottom-[-20%] right-[-20%] w-64 h-64 bg-indigo-600/20 rounded-full blur-[80px] pointer-events-none"></div>

        <div className="relative z-10 text-center mb-8">
          <div className="inline-flex items-center justify-center bg-emerald-500/20 p-3 rounded-2xl border border-emerald-500/30 mb-6">
            <Lock className="h-6 w-6 text-emerald-400" />
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Create New Password</h2>
          <p className="text-slate-400 font-medium mt-2 leading-relaxed">Your new password must be different from previous used passwords.</p>
        </div>

        <form className="space-y-5 relative z-10" onSubmit={handleSubmit}>
          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0, scale: 0.95 }}
                animate={{ opacity: 1, height: 'auto', scale: 1 }}
                exit={{ opacity: 0, height: 0, scale: 0.95 }}
                className="overflow-hidden"
              >
                <div className="flex items-start gap-4 p-4 bg-red-500/10 text-red-500 text-sm font-bold rounded-2xl border border-red-500/20 shadow-inner mb-4">
                  <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  <p className="leading-relaxed">{error}</p>
                </div>
              </motion.div>
            )}

            {success && (
              <motion.div 
                initial={{ opacity: 0, height: 0, scale: 0.95 }}
                animate={{ opacity: 1, height: 'auto', scale: 1 }}
                exit={{ opacity: 0, height: 0, scale: 0.95 }}
                className="overflow-hidden"
              >
                <div className="flex items-start gap-4 p-4 bg-emerald-500/10 text-emerald-400 text-sm font-bold rounded-2xl border border-emerald-500/20 shadow-inner mb-4">
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  <p className="leading-relaxed">Password reset successful! Redirecting to dashboard...</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
            <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-widest ml-1">New Password</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-emerald-400 transition-colors">
                <Lock className="h-5 w-5" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError('');
                }}
                className="block w-full pl-12 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-slate-600 focus:bg-white/10 focus:border-emerald-500/50 outline-none transition-all shadow-inner"
                placeholder="••••••••"
              />
            </div>
            {password && passwordStrength && (
              <div className="mt-2 space-y-1 px-1">
                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${passwordStrength.color} rounded-full transition-all duration-500`}
                    style={{ width: passwordStrength.width }}
                  />
                </div>
                <div className="flex justify-between items-center">
                  <p className={`text-xs font-bold ${passwordStrength.textColor}`}>{passwordStrength.label}</p>
                  <p className="text-slate-600 text-xs">A-Z, 0-9, @$!%*?&</p>
                </div>
              </div>
            )}
            </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-widest ml-1">Confirm Password</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-emerald-400 transition-colors">
                <Lock className="h-5 w-5" />
              </div>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (error) setError('');
                }}
                className="block w-full pl-12 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-slate-600 focus:bg-white/10 focus:border-emerald-500/50 outline-none transition-all shadow-inner"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || success}
            className="w-full flex justify-center py-4 px-6 bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white rounded-2xl shadow-[0_0_20px_rgba(16,185,129,0.4)] font-extrabold tracking-wider transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden mt-4"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            {isSubmitting ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <span className="flex items-center gap-3 relative z-10">
                Reset Password <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </span>
            )}
          </button>
        </form>
        
        {!success && (
          <div className="mt-8 text-center pt-8 border-t border-white/10 relative z-10">
            <p className="text-slate-400 font-medium text-sm">
              <Link to="/login" className="text-white font-bold hover:text-emerald-400 transition-colors">
                &larr; Back to login
              </Link>
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ResetPassword;
