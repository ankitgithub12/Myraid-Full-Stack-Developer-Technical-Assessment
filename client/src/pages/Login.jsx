import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, Mail, Lock, Eye, EyeOff, AlertCircle, Loader2, ChevronRight, CheckCircle2, ListTodo, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return false;
    }

    if (!password) {
      setError('Password is required.');
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
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to login. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="min-h-screen flex items-center justify-center p-4 sm:p-8 relative z-10"
    >
      <div className="w-full max-w-6xl glass-card rounded-[2.5rem] sm:rounded-[3rem] overflow-hidden flex flex-col lg:flex-row shadow-2xl relative">
        
        {/* Left Side - Abstract Features Design */}
        <div className="hidden lg:flex w-1/2 relative bg-slate-950 overflow-hidden group items-center justify-center p-12">
          {/* Animated Background Orbs */}
          <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary-600/20 rounded-full blur-[100px] group-hover:bg-primary-500/30 transition-colors duration-1000"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[100px] group-hover:bg-indigo-500/30 transition-colors duration-1000"></div>
          <div className="absolute top-[40%] left-[20%] w-64 h-64 bg-emerald-500/10 rounded-full blur-[60px] group-hover:bg-emerald-400/20 transition-colors duration-1000"></div>
          
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTMwLjUgMjEuNWExIDEgMCAxIDAgMCAyIDEgMSAwIDAgMCAwLTJ6bTAgMTBhMSAxIDAgMSAwIDAgMiAxIDEgMCAwIDAgMC0yem0wIDEwYTEgMSAwMSAwIDAgMiAxIDEgMCAwIDAgMC0yem0wIDEwYTEgMSAwMSAwIDAgMiAxIDEgMCAwIDAgMC0yem0wIDEwYTEgMSAwMSAwIDAgMiAxIDEgMCAwIDAgMC0yeiIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgZmlsbC1ydWxlPSJldmVub2RkIi8+PC9zdmc+')] opacity-50 mix-blend-overlay"></div>
          
          {/* Content */}
          <div className="relative z-20 w-full max-w-md">
            <div className="glass-card p-8 rounded-3xl border border-white/5 shadow-2xl backdrop-blur-md mb-8 transform -rotate-3 group-hover:rotate-0 transition-transform duration-700 hover:border-primary-500/30">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-4 bg-primary-500/10 rounded-2xl border border-primary-500/20">
                  <ListTodo className="h-6 w-6 text-primary-400" />
                </div>
                <div>
                  <h3 className="text-white text-lg font-bold">Project Alpha</h3>
                  <p className="text-slate-400 text-sm">8/10 tasks completed</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="h-2.5 w-full bg-slate-800 rounded-full overflow-hidden border border-white/5">
                  <div className="h-full bg-gradient-to-r from-primary-500 to-indigo-500 w-[80%] shadow-[0_0_10px_rgba(139,92,246,0.6)]"></div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-emerald-400 font-medium">
                    <CheckCircle2 className="h-4 w-4" /> <span>On track for delivery</span>
                  </div>
                  <span className="text-white font-bold">80%</span>
                </div>
              </div>
            </div>

            <div className="glass-card p-6 rounded-3xl border border-white/5 shadow-2xl backdrop-blur-md ml-12 transform rotate-2 group-hover:rotate-0 transition-transform duration-700 delay-100 hover:border-amber-500/30">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-amber-500/10 rounded-2xl border border-amber-500/20">
                  <Star className="h-6 w-6 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-white font-bold">High Priority</h3>
                  <p className="text-slate-400 text-sm mt-0.5">Review Marketing Strategy</p>
                </div>
              </div>
            </div>

            <div className="mt-16 relative">
              <div className="w-12 h-1 bg-gradient-to-r from-primary-500 to-transparent rounded-full mb-6"></div>
              <h2 className="text-4xl sm:text-5xl font-black text-white mb-6 leading-[1.1] tracking-tight">Supercharge<br/><span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-indigo-400">Your Workflow.</span></h2>
              <p className="text-slate-400 font-medium text-lg leading-relaxed max-w-sm">Experience precision, elegance, and extreme productivity with our modern task management suite.</p>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full lg:w-1/2 p-8 sm:p-12 lg:p-16 flex flex-col justify-center bg-slate-950/40 backdrop-blur-xl">
          <div className="max-w-md w-full mx-auto">
            <div className="mb-10 lg:hidden text-center">
              <div className="inline-flex bg-primary-600 p-4 rounded-2xl shadow-xl shadow-primary-500/30 mb-4">
                <LogIn className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-3xl font-extrabold text-white tracking-tight">Welcome Back</h2>
              <p className="text-slate-400 font-medium mt-2">Elevate your productivity today.</p>
            </div>
            
            <div className="hidden lg:block mb-10">
              <div className="inline-flex items-center justify-center bg-primary-600/20 p-3 rounded-2xl border border-primary-500/30 mb-6">
                <LogIn className="h-6 w-6 text-primary-400" />
              </div>
              <h2 className="text-4xl font-extrabold text-white tracking-tight">Welcome Back</h2>
              <p className="text-slate-400 font-medium mt-2">Please sign in to your account.</p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <AnimatePresence>
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0, scale: 0.95 }}
                    animate={{ opacity: 1, height: 'auto', scale: 1 }}
                    exit={{ opacity: 0, height: 0, scale: 0.95 }}
                    className="overflow-hidden"
                  >
                    <div className="flex items-start gap-4 p-4 bg-red-500/10 text-red-500 text-sm font-bold rounded-2xl border border-red-500/20 shadow-inner">
                      <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                      <p className="leading-relaxed">{error}</p>
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
                      if (error) setError('');
                    }}
                    className="block w-full pl-12 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-slate-600 focus:bg-white/10 focus:border-primary-500/50 outline-none transition-all shadow-inner"
                    placeholder="name@example.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="block text-xs font-bold text-slate-300 uppercase tracking-widest ml-1">Password</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-primary-400 transition-colors">
                      <Lock className="h-5 w-5" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (error) setError('');
                      }}
                      className="block w-full pl-12 pr-12 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-slate-600 focus:bg-white/10 focus:border-primary-500/50 outline-none transition-all shadow-inner"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 rounded border-white/20 bg-white/5 text-primary-500 focus:ring-primary-500 focus:ring-offset-slate-900 transition-all cursor-pointer"
                  />
                  <label htmlFor="remember-me" className="text-sm font-medium text-slate-400 cursor-pointer hover:text-white transition-colors">
                    Remember me
                  </label>
                </div>
                <div className="text-sm">
                  <Link to="/forgotpassword" className="font-bold text-primary-400 hover:text-primary-300 transition-colors">
                    Forgot password?
                  </Link>
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
                    Sign In <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                )}
              </button>
            </form>

            <div className="mt-8 text-center pt-8 border-t border-white/10">
              <p className="text-slate-400 font-medium text-sm">
                New here?{' '}
                <Link to="/register" className="text-white font-bold hover:text-primary-400 transition-colors">
                  Create an account &rarr;
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Login;
