import React, { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import TaskCard from '../components/TaskCard';
import TaskForm from '../components/TaskForm';
import { Plus, Search, Filter, ChevronLeft, ChevronRight, Loader2, CheckCircle2, Clock, ListTodo } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editTask, setEditTask] = useState(null);
  
  // Query states
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');

  const [stats, setStats] = useState({ total: 0, pending: 0, completed: 0 });

  const fetchStats = async () => {
    try {
      const [totalRes, pendingRes, completedRes] = await Promise.all([
        api.get('/tasks', { params: { limit: 1 } }),
        api.get('/tasks', { params: { limit: 1, status: 'Pending' } }),
        api.get('/tasks', { params: { limit: 1, status: 'Completed' } })
      ]);
      setStats({
        total: totalRes.data.totalTasks,
        pending: pendingRes.data.totalTasks,
        completed: completedRes.data.totalTasks
      });
    } catch (err) {
      console.error('Failed to fetch stats', err);
    }
  };

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/tasks', {
        params: { page, limit: 10, search, status }
      });
      setTasks(data.tasks);
      setTotalPages(data.totalPages);
    } catch (err) {
      setError('Could not load tasks. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [page, search, status]);

  useEffect(() => {
    fetchTasks();
    fetchStats();
  }, [fetchTasks]);

  const handleCreateOrUpdate = async (formData) => {
    try {
      if (editTask) {
        await api.put(`/tasks/${editTask._id}`, formData);
      } else {
        await api.post('/tasks', formData);
      }
      setIsModalOpen(false);
      setEditTask(null);
      fetchTasks();
      toast.success(editTask ? 'Task updated successfully' : 'Task created successfully');
    } catch (err) {
      console.error('Task Error:', err);
      const message = err.response?.data?.message || 'Error saving task';
      toast.error(message);
    }
  };

  const handleDelete = async (id) => {
    toast.custom((t) => (
      <div className="bg-slate-900 border border-white/10 p-4 rounded-xl shadow-2xl backdrop-blur-md max-w-sm w-full">
        <h1 className="text-white font-bold mb-2">Delete Task?</h1>
        <p className="text-sm text-slate-400 mb-4">Are you sure you want to delete this task? This action cannot be undone.</p>
        <div className="flex gap-2 justify-end">
          <button onClick={() => toast.dismiss(t)} className="px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors">Cancel</button>
          <button onClick={async () => {
            toast.dismiss(t);
            try {
              await api.delete(`/tasks/${id}`);
              fetchTasks();
              toast.success('Task deleted');
            } catch (err) {
              toast.error('Error deleting task');
            }
          }} className="px-4 py-2 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 rounded-lg shadow-lg">Delete</button>
        </div>
      </div>
    ), { duration: Infinity });
  };

  const openEditModal = (task) => {
    setEditTask(task);
    setIsModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
        className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 sm:gap-8 mb-10 sm:mb-12"
      >
        <div className="text-center lg:text-left">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-bold tracking-widest uppercase text-slate-400 mb-4"
          >
            <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse"></span>
            Workspace
          </motion.div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight mb-2 sm:mb-3">
            Your <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-400 via-primary-500 to-indigo-500 drop-shadow-[0_0_15px_rgba(139,92,246,0.5)]">Productivity</span>
          </h1>
          <p className="text-slate-400 text-base sm:text-lg lg:text-xl font-medium max-w-2xl">Streamline your workflow with precision, elegance, and unmatched speed.</p>
        </div>
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="flex justify-center"
        >
          <button
            onClick={() => { setEditTask(null); setIsModalOpen(true); }}
            className="group relative inline-flex items-center justify-center gap-3 w-full sm:w-auto px-8 py-4 bg-white text-slate-950 font-extrabold rounded-2xl shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:bg-slate-200 transition-all active:scale-95 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/40 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            <Plus className="h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
            New Task
          </button>
        </motion.div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-10"
      >
        <div className="glass-card p-6 rounded-[2rem] border border-white/5 flex items-center gap-5 hover:border-primary-500/30 transition-colors group">
          <div className="p-4 bg-primary-500/10 rounded-2xl group-hover:bg-primary-500/20 transition-colors">
            <ListTodo className="h-8 w-8 text-primary-400" />
          </div>
          <div>
            <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-1">Total Tasks</p>
            <h3 className="text-3xl font-black text-white">{stats.total}</h3>
          </div>
        </div>
        <div className="glass-card p-6 rounded-[2rem] border border-white/5 flex items-center gap-5 hover:border-amber-500/30 transition-colors group">
          <div className="p-4 bg-amber-500/10 rounded-2xl group-hover:bg-amber-500/20 transition-colors">
            <Clock className="h-8 w-8 text-amber-400" />
          </div>
          <div>
            <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-1">Pending</p>
            <h3 className="text-3xl font-black text-white">{stats.pending}</h3>
          </div>
        </div>
        <div className="glass-card p-6 rounded-[2rem] border border-white/5 flex items-center gap-5 hover:border-emerald-500/30 transition-colors group">
          <div className="p-4 bg-emerald-500/10 rounded-2xl group-hover:bg-emerald-500/20 transition-colors">
            <CheckCircle2 className="h-8 w-8 text-emerald-400" />
          </div>
          <div>
            <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-1">Completed</p>
            <h3 className="text-3xl font-black text-white">{stats.completed}</h3>
          </div>
        </div>
      </motion.div>

      {/* Filters and Search */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-card p-3 sm:p-4 rounded-[1.5rem] sm:rounded-[2rem] flex flex-col md:flex-row gap-3 sm:gap-4 mb-8 sm:mb-12 items-center"
      >
        <div className="relative flex-grow w-full group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-primary-500 transition-colors" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-14 pr-6 py-3.5 sm:py-4 bg-white/5 border border-white/5 rounded-xl sm:rounded-2xl text-white placeholder-slate-500 focus:bg-white/10 focus:border-primary-500/50 outline-none transition-all"
          />
        </div>
        <div className="relative w-full md:w-64 group">
          <Filter className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-primary-500 transition-colors" />
          <select
            value={status}
            onChange={(e) => { setStatus(e.target.value); setPage(1); }}
            className="w-full pl-14 pr-10 py-3.5 sm:py-4 bg-white/5 border border-white/5 rounded-xl sm:rounded-2xl text-white outline-none focus:bg-white/10 focus:border-primary-500/50 transition-all appearance-none cursor-pointer"
          >
            <option value="" className="bg-slate-800">All Status</option>
            <option value="Pending" className="bg-slate-800">Pending</option>
            <option value="In Progress" className="bg-slate-800">In Progress</option>
            <option value="Completed" className="bg-slate-800">Completed</option>
          </select>
          <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 group-focus-within:text-primary-400">
            <ChevronRight className="h-5 w-5 rotate-90" />
          </div>
        </div>
      </motion.div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 sm:py-32 glass-card rounded-2xl sm:rounded-[3rem]">
          <div className="relative">
            <Loader2 className="h-12 w-12 sm:h-16 sm:w-16 text-primary-500 animate-spin" />
            <div className="absolute inset-0 blur-2xl bg-primary-500/20 animate-pulse"></div>
          </div>
          <p className="text-slate-400 font-bold mt-6 sm:mt-8 tracking-widest uppercase text-[10px] sm:text-xs">Syncing data...</p>
        </div>
      ) : tasks.length > 0 ? (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
          }}
        >
          <AnimatePresence>
            {tasks.map((task) => (
              <motion.div 
                key={task._id} 
                layout
                variants={{
                  hidden: { opacity: 0, scale: 0.8, y: 20 },
                  visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
                }}
                exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
              >
                <TaskCard
                  task={task}
                  onEdit={openEditModal}
                  onDelete={handleDelete}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <div className="text-center py-24 sm:py-32 glass-card rounded-2xl sm:rounded-[3rem] px-6">
          <div className="bg-white/5 w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/5 shadow-inner">
            <Search className="h-8 w-8 sm:h-10 sm:w-10 text-slate-600" />
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-3">No tasks found</h3>
          <p className="text-slate-500 max-w-sm mx-auto font-medium text-sm sm:text-base leading-relaxed">
            {search || status ? "Adjust your filters or try a different search term." : "Your list is empty. Time to plan something amazing!"}
          </p>
        </div>
      )}

      {/* Pagination */}
      {!loading && tasks.length > 0 && totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 sm:gap-6 mt-12 sm:mt-16">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center glass-card rounded-xl sm:rounded-2xl hover:bg-white/10 disabled:opacity-20 disabled:hover:bg-transparent transition-all active:scale-90"
          >
            <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
          <div className="glass-card px-4 py-2 sm:px-6 sm:py-3 rounded-xl sm:rounded-2xl">
            <span className="text-xs sm:text-sm font-bold text-white tracking-widest">
              {page.toString().padStart(2, '0')} <span className="text-slate-600 mx-1 sm:mx-2">/</span> {totalPages.toString().padStart(2, '0')}
            </span>
          </div>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center glass-card rounded-xl sm:rounded-2xl hover:bg-white/10 disabled:opacity-20 disabled:hover:bg-transparent transition-all active:scale-90"
          >
            <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
        </div>
      )}

      {/* Modals */}
      <TaskForm
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditTask(null); }}
        onSubmit={handleCreateOrUpdate}
        editTask={editTask}
      />
    </div>
  );
};

export default Dashboard;
