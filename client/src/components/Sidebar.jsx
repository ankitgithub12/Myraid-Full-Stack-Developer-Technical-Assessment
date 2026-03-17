import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, CheckSquare, User, Settings, LogOut } from 'lucide-react';

const Sidebar = () => {
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

  const navItems = [
    { name: 'Dashboard', icon: <LayoutDashboard />, path: '/dashboard' },
    { name: 'Profile', icon: <User />, path: '/profile' },
    { name: 'Settings', icon: <Settings />, path: '/settings' },
  ];

  return (
    <aside className="w-20 lg:w-64 h-screen fixed top-0 left-0 bg-slate-900/40 backdrop-blur-xl border-r border-white/10 flex flex-col transition-all duration-300 z-40">
      {/* Brand */}
      <div className="h-20 flex items-center justify-center lg:justify-start lg:px-8 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="bg-primary-600 p-2 sm:p-2.5 rounded-xl sm:rounded-2xl shadow-[0_0_20px_rgba(124,58,237,0.4)] flex-shrink-0">
            <CheckSquare className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-extrabold tracking-tight text-white hidden lg:block">TaskFlow</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 lg:px-6 py-8 space-y-2 relative">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-4 px-3 lg:px-4 py-3.5 rounded-2xl transition-all font-bold group ${
                isActive
                  ? 'bg-primary-500/15 text-primary-400 border border-primary-500/20 shadow-[inset_0_1px_rgba(255,255,255,0.1)]'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white border border-transparent'
              }`
            }
          >
            <div className="[&>svg]:w-5 [&>svg]:h-5 shrink-0 transition-transform group-hover:scale-110">
              {item.icon}
            </div>
            <span className="hidden lg:block truncate">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* User Area & Logout */}
      <div className="p-4 lg:p-6 border-t border-white/5">
        <div className="flex items-center justify-center lg:justify-start gap-4 mb-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary-500 to-indigo-500 p-[2px] shadow-[0_0_15px_rgba(124,58,237,0.4)] shrink-0">
            <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center border border-white/10">
              <span className="text-sm font-bold text-white">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>
          </div>
          <div className="hidden lg:block overflow-hidden">
            <p className="text-sm font-bold text-white truncate">{user?.name || 'User'}</p>
            <p className="text-[10px] sm:text-xs text-slate-500 font-semibold truncate">{user?.email}</p>
          </div>
        </div>
        
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center lg:justify-start gap-3 px-3 lg:px-4 py-3 rounded-2xl transition-all font-bold text-slate-400 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 border border-transparent group"
        >
          <LogOut className="w-5 h-5 shrink-0 group-hover:-translate-x-1 transition-transform" />
          <span className="hidden lg:block">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
