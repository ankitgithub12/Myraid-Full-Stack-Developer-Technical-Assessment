import React from 'react';
import { Edit2, Trash2, Clock, CheckCircle2, PlayCircle, Calendar } from 'lucide-react';

const TaskCard = ({ task, onEdit, onDelete }) => {
  const getStatusConfig = (status) => {
    switch (status) {
      case 'Completed': 
        return {
          bg: 'bg-emerald-500/10',
          border: 'border-emerald-500/20',
          text: 'text-emerald-400',
          dot: 'bg-emerald-400',
          glow: 'shadow-[0_0_15px_rgba(16,185,129,0.3)]'
        };
      case 'In Progress': 
        return {
          bg: 'bg-amber-500/10',
          border: 'border-amber-500/20',
          text: 'text-amber-400',
          dot: 'bg-amber-400',
          glow: 'shadow-[0_0_15px_rgba(245,158,11,0.3)]'
        };
      case 'Pending': 
        return {
          bg: 'bg-rose-500/10',
          border: 'border-rose-500/20',
          text: 'text-rose-400',
          dot: 'bg-rose-400',
          glow: 'shadow-[0_0_15px_rgba(244,63,94,0.3)]'
        };
      default: 
        return {
          bg: 'bg-slate-500/10',
          border: 'border-slate-500/20',
          text: 'text-slate-400',
          dot: 'bg-slate-400',
          glow: ''
        };
    }
  };

  const getPriorityConfig = (priority) => {
    switch (priority) {
      case 'High': 
        return 'text-red-400 bg-red-500/10 border-red-500/20';
      case 'Medium': 
        return 'text-orange-400 bg-orange-500/10 border-orange-500/20';
      case 'Low': 
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      default: 
        return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
    }
  };

  const statusConfig = getStatusConfig(task.status);

  return (
    <div className="group relative h-full flex flex-col rounded-[2rem] overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_10px_40px_-10px_rgba(139,92,246,0.3)]">
      {/* Background Mesh Gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 to-slate-950/90 backdrop-blur-3xl z-0"></div>
      
      {/* Animated Hover Gradients */}
      <div className="absolute -top-[50%] -left-[50%] w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.08)_0%,transparent_50%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none group-hover:animate-[spin_20s_linear_infinite] z-0"></div>
      <div className="absolute top-0 right-0 w-40 h-40 bg-primary-500/10 rounded-full blur-[50px] opacity-0 group-hover:opacity-100 transition-all duration-700 pointer-events-none z-0"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-[40px] opacity-0 group-hover:opacity-100 transition-all duration-700 pointer-events-none z-0"></div>

      {/* Card Content container with gradient border wrapper */}
      <div className="relative flex flex-col h-full z-10 p-[1px] rounded-[2rem] bg-gradient-to-b from-white/10 to-transparent group-hover:from-primary-500/40 group-hover:to-primary-500/5 transition-all duration-500">
        <div className="flex flex-col h-full bg-slate-950/50 rounded-[calc(2rem-1px)] p-6 z-10 border border-white/5 group-hover:border-primary-500/20 transition-all duration-500 shadow-xl overflow-hidden relative">
          
          {/* Internal Glow on Hover */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0"></div>

          <div className="relative z-10 flex flex-col h-full">
            {/* Header Row */}
            <div className="flex items-start justify-between mb-5 gap-4">
              <div className="flex flex-wrap items-center gap-2">
                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold tracking-wide border backdrop-blur-md transition-all duration-300 ${statusConfig.bg} ${statusConfig.border} ${statusConfig.text} ${statusConfig.glow}`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${statusConfig.dot} animate-pulse shadow-[0_0_8px_currentColor]`}></div>
                  {task.status}
                </div>
                {task.priority && (
                  <div className={`inline-flex items-center px-2.5 py-1.5 rounded-xl text-[10px] font-bold tracking-wider uppercase border backdrop-blur-md ${getPriorityConfig(task.priority)}`}>
                    {task.priority}
                  </div>
                )}
              </div>

              {/* Desktop Actions */}
              <div className="hidden sm:flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-3 group-hover:translate-x-0">
                <button 
                  onClick={(e) => { e.preventDefault(); onEdit(task); }}
                  className="p-2 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-primary-500/20 border border-white/10 hover:border-primary-500/50 rounded-lg transition-all active:scale-95 shadow-lg backdrop-blur-sm group/btn"
                  title="Edit Task"
                >
                  <Edit2 className="h-3.5 w-3.5 group-hover/btn:scale-110 transition-transform" />
                </button>
                <button 
                  onClick={(e) => { e.preventDefault(); onDelete(task._id); }}
                  className="p-2 text-slate-400 hover:text-red-400 bg-slate-800/80 hover:bg-red-500/20 border border-white/10 hover:border-red-500/50 rounded-lg transition-all active:scale-95 shadow-lg backdrop-blur-sm group/btn"
                  title="Delete Task"
                >
                  <Trash2 className="h-3.5 w-3.5 group-hover/btn:scale-110 transition-transform" />
                </button>
              </div>
            </div>
            
            {/* Main Content */}
            <div className="space-y-3 flex-grow mb-6">
              <h3 className="text-xl sm:text-2xl font-bold text-slate-100 leading-snug group-hover:text-primary-300 transition-colors line-clamp-2 drop-shadow-sm decoration-primary-500/30 underline-offset-4 group-hover:underline">
                {task.title}
              </h3>
              <p className="text-slate-400/90 text-sm leading-relaxed line-clamp-3 font-medium transition-all duration-300 group-hover:text-slate-300">
                {task.description}
              </p>
            </div>
            
            {/* Footer Row */}
            <div className="mt-auto pt-5 border-t border-white/5 flex items-center justify-between group-hover:border-primary-500/20 transition-colors">
              <div className="flex items-center gap-3">
                {/* Avatar / Profile Graphic */}
                <div className="relative">
                  <div className="absolute inset-0 bg-primary-500 rounded-full blur-[8px] opacity-20 group-hover:opacity-60 transition-opacity"></div>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary-600 to-indigo-500 p-[2px] relative z-10 transform group-hover:-rotate-12 transition-transform duration-500 shadow-md">
                    <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center border border-white/10 overflow-hidden relative">
                      {/* Generative placeholder avatar */}
                      <img src={`https://api.dicebear.com/7.x/shapes/svg?seed=${task._id}&backgroundColor=transparent`} alt="avatar" className="w-[120%] h-[120%] object-cover opacity-80 mix-blend-screen scale-110" />
                    </div>
                  </div>
                </div>
                <div className="flex flex-col justify-center">
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest leading-none mb-1.5 opacity-80">Timeline</span>
                  <div className="flex items-center gap-1.5 text-slate-300 group-hover:text-primary-200 transition-colors">
                    <Calendar className="h-3.5 w-3.5 opacity-80 text-primary-400" />
                    <span className="text-xs font-semibold tracking-wide flex items-center">
                      {new Date(task.createdDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Mobile Actions */}
              <div className="sm:hidden flex gap-2">
                <button 
                  onClick={() => onEdit(task)}
                  className="p-2.5 text-primary-400 bg-primary-500/10 rounded-xl border border-primary-500/30 active:scale-95 transition-transform"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button 
                  onClick={() => onDelete(task._id)}
                  className="p-2.5 text-red-400 bg-red-500/10 rounded-xl border border-red-500/30 active:scale-95 transition-transform"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default TaskCard;
