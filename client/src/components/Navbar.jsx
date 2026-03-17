import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, CheckSquare } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full z-50 px-4 sm:px-6 py-4 sm:py-6 pointer-events-none">
      <nav className="glass-navbar mx-auto max-w-4xl rounded-full px-5 py-3 sm:px-6 sm:py-4 pointer-events-auto shadow-2xl transition-all">
        <div className="flex justify-between items-center h-10 sm:h-12">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="bg-primary-600 p-2 sm:p-2.5 rounded-xl sm:rounded-2xl group-hover:rotate-12 transition-all duration-300 shadow-[0_0_20px_rgba(124,58,237,0.4)]">
                <CheckSquare className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
              <span className="text-lg sm:text-2xl font-extrabold tracking-tight text-white group-hover:text-primary-300 transition-colors">TaskFlow</span>
            </Link>
          </div>
          
          <div className="flex items-center gap-4 sm:gap-6">
            {user ? (
              <>
                <div className="flex flex-col items-end hidden sm:flex">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mb-1">Welcome</span>
                  <span className="text-sm text-white font-bold leading-none">{user.name}</span>
                </div>
                <div className="w-px h-8 bg-white/10 hidden sm:block"></div>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 border border-white/5 text-xs sm:text-sm font-bold rounded-xl text-white bg-white/5 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/30 focus:outline-none transition-all active:scale-95"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden xs:inline">Logout</span>
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2 sm:gap-4">
                <Link to="/login" className="px-4 py-2 sm:px-5 sm:py-2.5 text-xs sm:text-sm font-bold text-slate-300 hover:text-white hover:bg-white/5 rounded-xl transition-all">Login</Link>
                <Link 
                  to="/register" 
                  className="px-4 py-2 sm:px-6 sm:py-2.5 bg-white text-slate-950 text-xs sm:text-sm font-extrabold rounded-xl hover:bg-slate-200 shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all active:scale-95"
                >
                  Join
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
