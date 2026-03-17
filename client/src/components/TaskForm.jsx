import React, { useState, useEffect } from 'react';
import { X, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';


const TaskForm = ({ isOpen, onClose, onSubmit, editTask }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'Pending',
    priority: 'Medium'
  });

  useEffect(() => {
    if (editTask) {
      setFormData({
        title: editTask.title,
        description: editTask.description,
        status: editTask.status,
        priority: editTask.priority || 'Medium'
      });
    } else {
      setFormData({
        title: '',
        description: '',
        status: 'Pending',
        priority: 'Medium'
      });
    }
  }, [editTask, isOpen]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center p-2 sm:p-4 bg-slate-950/60 backdrop-blur-md"
        >
          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="glass-card rounded-3xl sm:rounded-[2.5rem] w-full max-w-lg max-h-[95vh] overflow-y-auto transform transition-all shadow-2xl"
          >
        <div className="sticky top-0 z-10 flex justify-between items-center p-6 sm:p-8 border-b border-white/5 bg-slate-900/80 backdrop-blur-xl">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">{editTask ? 'Edit Task' : 'New Task'}</h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">{editTask ? 'Modify your existing task details' : 'Add a new item to your productivity list'}</p>
          </div>
          <button onClick={onClose} className="p-2 sm:p-3 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl sm:rounded-2xl transition-all active:scale-95">
            <X className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5 sm:space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-300 ml-1">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 sm:px-5 py-3.5 sm:py-4 bg-white/5 border border-white/10 rounded-xl sm:rounded-[1.25rem] text-white placeholder-slate-500 focus:bg-white/10 focus:border-primary-500/50 outline-none transition-all shadow-inner text-sm sm:text-base"
              placeholder="What needs to be done?"
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-300 ml-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="4"
              className="w-full px-4 sm:px-5 py-3.5 sm:py-4 bg-white/5 border border-white/10 rounded-xl sm:rounded-[1.25rem] text-white placeholder-slate-500 focus:bg-white/10 focus:border-primary-500/50 outline-none transition-all resize-none shadow-inner text-sm sm:text-base"
              placeholder="Add some details..."
            />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-300 ml-1">Status</label>
              <div className="relative group">
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 sm:px-5 py-3.5 sm:py-4 bg-white/5 border border-white/10 rounded-xl sm:rounded-[1.25rem] text-white outline-none focus:bg-white/10 focus:border-primary-500/50 transition-all appearance-none cursor-pointer text-sm sm:text-base"
                >
                  <option value="Pending" className="bg-slate-800">Pending</option>
                  <option value="In Progress" className="bg-slate-800">In Progress</option>
                  <option value="Completed" className="bg-slate-800">Completed</option>
                </select>
                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-focus-within:text-primary-400 transition-colors">
                  <ChevronRight className="h-5 w-5 rotate-90" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-300 ml-1">Priority</label>
              <div className="relative group">
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="w-full px-4 sm:px-5 py-3.5 sm:py-4 bg-white/5 border border-white/10 rounded-xl sm:rounded-[1.25rem] text-white outline-none focus:bg-white/10 focus:border-primary-500/50 transition-all appearance-none cursor-pointer text-sm sm:text-base"
                >
                  <option value="Low" className="bg-slate-800">Low</option>
                  <option value="Medium" className="bg-slate-800">Medium</option>
                  <option value="High" className="bg-slate-800">High</option>
                </select>
                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-focus-within:text-primary-400 transition-colors">
                  <ChevronRight className="h-5 w-5 rotate-90" />
                </div>
              </div>
            </div>
          </div>
          
          <div className="pt-4 sm:pt-6 flex gap-3 sm:gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3.5 sm:py-4 text-xs sm:text-sm font-bold text-slate-300 bg-white/5 hover:bg-white/10 rounded-xl sm:rounded-2xl transition-all active:scale-95"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3.5 sm:py-4 text-xs sm:text-sm font-bold text-white bg-primary-600 hover:bg-primary-700 rounded-xl sm:rounded-2xl shadow-xl shadow-primary-500/20 transition-all active:scale-95"
            >
              {editTask ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
        </motion.div>
      </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TaskForm;
