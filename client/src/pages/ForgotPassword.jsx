import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Mail, AlertCircle, Loader2, ChevronRight, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [resetLink, setResetLink] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return setError('Please enter your email address');

    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const response = await api.post('/auth/forgotpassword', { email });
      setSuccess('Reset link generated successfully!');
      setResetLink(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reset link.');
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
        <div className="absolute top-[-20%] left-[-20%] w-64 h-64 bg-primary-600/30 rounded-full blur-[80px] pointer-events-none"></div>
        <div className="absolute bottom-[-20%] right-[-20%] w-64 h-64 bg-indigo-600/20 rounded-full blur-[80px] pointer-events-none"></div>

        <div className="relative z-10 text-center mb-8">
          <div className="inline-flex items-center justify-center bg-primary-600/20 p-3 rounded-2xl border border-primary-500/30 mb-6">
            <Mail className="h-6 w-6 text-primary-400" />
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Forgot Password?</h2>
          <p className="text-slate-400 font-medium mt-2 leading-relaxed">No worries. Enter your email and we'll send you a reset link.</p>
        </div>

        <form className="space-y-6 relative z-10" onSubmit={handleSubmit}>
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
                <div className="p-4 bg-emerald-500/10 text-emerald-400 text-sm rounded-2xl border border-emerald-500/20 shadow-inner mb-4 space-y-3">
                  <div className="flex items-center gap-3 font-bold">
                    <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
                    <p>{success}</p>
                  </div>
                  {resetLink && (
                    <div className="bg-black/30 border border-emerald-500/20 rounded-xl p-3">
                      <p className="text-slate-400 text-xs mb-2">⚠️ Demo mode: In a real app this link would be emailed. Click below to reset your password:</p>
                      <a 
                        href={resetLink} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-emerald-300 font-bold text-xs break-all hover:text-emerald-200 underline underline-offset-2 transition-colors"
                      >
                        {resetLink}
                      </a>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <div className="space-y-2">
            <label htmlFor="email" className="block text-xs font-bold text-slate-300 uppercase tracking-widest ml-1">Email Address</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-primary-400 transition-colors">
                <Mail className="h-5 w-5" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error || success) {
                    setError('');
                    setSuccess('');
                  }
                }}
                className="block w-full pl-12 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-slate-600 focus:bg-white/10 focus:border-primary-500/50 outline-none transition-all shadow-inner"
                placeholder="name@example.com"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center py-4 px-6 bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-500 hover:to-indigo-500 text-white rounded-2xl shadow-[0_0_20px_rgba(124,58,237,0.4)] font-extrabold tracking-wider transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            {isSubmitting ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <span className="flex items-center gap-3 relative z-10">
                Send Reset Link <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </span>
            )}
          </button>
        </form>

        <div className="mt-8 text-center pt-8 border-t border-white/10 relative z-10">
          <p className="text-slate-400 font-medium text-sm">
            Remembered your password?{' '}
            <Link to="/login" className="text-white font-bold hover:text-primary-400 transition-colors">
              Log back in &rarr;
            </Link>
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default ForgotPassword;
