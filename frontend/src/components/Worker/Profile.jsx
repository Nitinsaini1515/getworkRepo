import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, User, Mail, Shield, CheckCircle } from 'lucide-react';
import Card from '../UI/Card';
import Input from '../UI/Input';
import Button from '../UI/Button';
import Toast from '../UI/Toast';
import { useAuth } from '../../Context/AuthContext';
import { updateWorkerAvailability } from '../../services/workersService.js';
import { getApiErrorMessage } from '../../utils/getApiErrorMessage.js';

const WorkerProfile = () => {
  const { user, refreshUser } = useAuth();
  const [isAvailable, setIsAvailable] = useState(!!user?.isAvailable);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  useEffect(() => {
    setIsAvailable(!!user?.isAvailable);
  }, [user?.isAvailable]);

  const toggleAvailability = async () => {
    const next = !isAvailable;
    try {
      await updateWorkerAvailability(next);
      setIsAvailable(next);
      await refreshUser();
      setToast({
        show: true,
        type: 'success',
        message: next
          ? 'Status updated. Employers nearby have been notified!'
          : 'You are now shown as Not Available.',
      });
    } catch (e) {
      setToast({ show: true, type: 'error', message: getApiErrorMessage(e) });
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Worker Profile</h1>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><User size={20} className="text-indigo-400" /> Personal Details</h2>
            <div className="space-y-4">
              <Input label="Full Name" defaultValue={user?.name || ''} />
              <Input label="Email Address" defaultValue={user?.email || ''} icon={Mail} />
              <Input label="Location (City, Area)" placeholder="e.g. Bandra, Mumbai" icon={MapPin} />
              <Button>Save Profile</Button>
            </div>
          </Card>

          <Card>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Shield size={20} className="text-indigo-400" /> Professional Skills</h2>
            <p className="text-sm text-slate-400 mb-4">Add your skills to get matched with the right jobs automatically.</p>
            
            <div className="flex flex-wrap gap-2 mb-6">
              {['Delivery', 'Event Management', 'Warehouse', 'Plumbing', 'Driving'].map(skill => (
                <div key={skill} className="bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 px-3 py-1.5 rounded-full text-sm cursor-pointer hover:bg-indigo-500/20 transition-colors">
                  {skill} ✕
                </div>
              ))}
            </div>

            <div className="flex gap-4">
              <Input placeholder="Add a new skill (e.g. Accounting)" className="flex-1" />
              <Button variant="secondary">Add</Button>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-gradient-to-br from-indigo-900/20 to-slate-900 border-indigo-500/20 text-center">
            <div className="w-24 h-24 bg-slate-800 rounded-full mx-auto mb-4 border-4 border-indigo-500 flex items-center justify-center text-4xl font-bold text-indigo-400 relative">
              {user?.name?.charAt(0) || 'U'}
              {isAvailable && (
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute bottom-1 right-1 w-5 h-5 bg-emerald-500 border-2 border-slate-900 rounded-full flex items-center justify-center"
                >
                  <span className="w-full h-full bg-emerald-400 rounded-full animate-ping absolute opacity-50"></span>
                </motion.span>
              )}
            </div>
            <h3 className="font-bold text-lg mb-1">{user?.name}</h3>
            <p className="text-slate-400 text-sm mb-4">Worker Account</p>
            
            <div className="flex justify-center items-center gap-2 mb-6 text-emerald-400 bg-emerald-500/10 py-1.5 px-3 rounded-full text-sm font-medium mx-auto w-fit">
              <CheckCircle size={16} /> Identity Verified
            </div>

            {/* Availability Toggle */}
            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50 flex items-center justify-between">
              <div className="text-left">
                <p className="text-sm font-bold text-slate-200">Current Status</p>
                <p className="text-xs text-slate-400">{isAvailable ? 'Available for new jobs' : 'Not available'}</p>
              </div>
              <button 
                onClick={toggleAvailability}
                className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors outline-none ${isAvailable ? 'bg-emerald-500' : 'bg-slate-600'}`}
              >
                <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${isAvailable ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
          </Card>

          <Card>
            <h3 className="font-bold text-slate-200 mb-4">Performance Metrics</h3>
            <div className="space-y-3 divide-y divide-slate-800">
              <div className="flex justify-between py-2">
                <span className="text-slate-400">Response Rate</span>
                <span className="font-bold text-emerald-400">98%</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-slate-400">Cancellation Rate</span>
                <span className="font-bold">0%</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-slate-400">Lifetime Rating</span>
                <span className="font-bold text-yellow-500 flex items-center">{user?.rating != null ? user.rating : '—'} ★</span>
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="font-bold text-slate-200 mb-4">Recent Feedback</h3>
            <div className="space-y-4">
              <div className="bg-slate-800/30 p-3 rounded-xl border border-slate-700/50">
                <div className="flex justify-between items-start mb-2">
                  <p className="font-semibold text-sm">Logistics Inc.</p>
                  <p className="text-yellow-500 text-xs flex">★★★★★</p>
                </div>
                <p className="text-xs text-slate-400">"Great worker, arrived on time and finished the organizing task efficiently."</p>
              </div>
              <div className="bg-slate-800/30 p-3 rounded-xl border border-slate-700/50">
                <div className="flex justify-between items-start mb-2">
                  <p className="font-semibold text-sm">Acme Events</p>
                  <p className="text-yellow-500 text-xs flex">★★★★☆</p>
                </div>
                <p className="text-xs text-slate-400">"Good communication. Helped significantly with stage setup."</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
      <Toast message={toast.message} isVisible={toast.show} onClose={() => setToast({ show: false, message: '', type: 'success' })} type={toast.type === 'error' ? 'error' : 'success'} />
    </div>
  );
};

export default WorkerProfile;
