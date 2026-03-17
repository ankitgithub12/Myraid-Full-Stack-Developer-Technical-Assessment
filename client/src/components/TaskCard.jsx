import React from 'react';
import { Edit2, Trash2, Clock, CheckCircle2, PlayCircle } from 'lucide-react';

const TaskCard = ({ task, onEdit, onDelete }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5';
      case 'In Progress': return 'text-amber-400 border-amber-500/20 bg-amber-500/5';
      case 'Pending': return 'text-rose-400 border-rose-500/20 bg-rose-500/5';
      default: return 'text-slate-400 border-slate-500/20 bg-slate-500/5';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'text-red-400 bg-red-500/10 border-red-500/20';
      case 'Medium': return 'text-orange-400 bg-orange-500/10 border-orange-500/20';
      case 'Low': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      default: return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Completed': return <CheckCircle2 className="h-3.5 w-3.5" />;
      case 'In Progress': return <PlayCircle className="h-3.5 w-3.5" />;
      default: return <Clock className="h-3.5 w-3.5" />;
    }
  };

  return (
    <div className="glass-card rounded-[2rem] p-6 hover:shadow-[0_0_40px_-10px_rgba(139,92,246,0.5),inset_0_1px_0_0_rgba(255,255,255,0.2)] transition-all duration-300 group flex flex-col h-full border border-white/10 hover:border-primary-500/50 relative overflow-hidden bg-gradient-to-br from-slate-900/80 to-slate-950/80">
      {/* Cyber Glow Effect */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 rounded-full blur-[60px] -mr-16 -mt-16 group-hover:bg-primary-400/30 transition-all duration-500"></div>
      
      {/* Desktop Actions */}
      <div className="absolute top-5 right-5 flex gap-2 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0 hidden sm:flex z-30">
        <button 
          onClick={() => onEdit(task)}
          className="p-2.5 text-slate-400 hover:text-white bg-white/5 hover:bg-primary-500/20 border border-white/10 hover:border-primary-500/50 rounded-xl transition-all active:scale-95 shadow-[0_0_15px_rgba(0,0,0,0.5)]"
        >
          <Edit2 className="h-4 w-4" />
        </button>
        <button 
          onClick={() => onDelete(task._id)}
          className="p-2.5 text-slate-400 hover:text-red-400 bg-white/5 hover:bg-red-500/20 border border-white/10 hover:border-red-500/50 rounded-xl transition-all active:scale-95 shadow-[0_0_15px_rgba(0,0,0,0.5)]"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      <div className="mb-4 relative z-10 flex flex-wrap items-center gap-2">
        <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold tracking-widest uppercase border ${getStatusColor(task.status)} shadow-[0_0_15px_rgba(0,0,0,0.2)] backdrop-blur-md`}>
          <div className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></div>
          {task.status}
        </span>
        {task.priority && (
          <span className={`inline-flex items-center px-2 py-1.5 rounded-lg text-[10px] font-bold tracking-widest uppercase border ${getPriorityColor(task.priority)}`}>
            {task.priority}
          </span>
        )}
      </div>
      
      <div className="space-y-2.5 flex-grow relative z-10 mt-2">
        <h3 className="text-xl sm:text-2xl font-black text-white leading-tight group-hover:text-primary-300 transition-colors tracking-tight line-clamp-2">
          {task.title}
        </h3>
        <p className="text-slate-400 text-sm leading-relaxed line-clamp-3 font-medium opacity-80 group-hover:opacity-100 transition-opacity">
          {task.description}
        </p>
      </div>
      
      <div className="mt-6 pt-5 border-t border-white/10 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary-500 to-indigo-500 p-[2px] shadow-[0_0_10px_rgba(124,58,237,0.3)] shrink-0">
            <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center border border-white/10">
              <span className="text-[10px] font-bold text-white uppercase">Me</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-slate-500 group-hover:text-slate-400 transition-colors">
            <Clock className="h-3.5 w-3.5" />
            <span className="text-[10px] font-bold tracking-widest leading-none">
              {new Date(task.createdDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
            </span>
          </div>
        </div>

        {/* Mobile-only action buttons */}
        <div className="sm:hidden flex gap-2">
          <button 
            onClick={() => onEdit(task)}
            className="p-2.5 text-primary-400 bg-primary-500/10 rounded-xl border border-primary-500/30"
          >
            <Edit2 className="h-4 w-4" />
          </button>
          <button 
            onClick={() => onDelete(task._id)}
            className="p-2.5 text-red-400 bg-red-500/10 rounded-xl border border-red-500/30"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
