import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, User, Mail, Shield, CheckCircle } from 'lucide-react';
import Card from './Ui/Card';
import Input from './Ui/Input';
import Button from './Ui/Button';
import { useAuth } from './../context/AuthContext';

const WorkerProfile = () => {
  const { user } = useAuth();

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
            <div className="w-24 h-24 bg-slate-800 rounded-full mx-auto mb-4 border-4 border-indigo-500 flex items-center justify-center text-4xl font-bold text-indigo-400">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <h3 className="font-bold text-lg mb-1">{user?.name}</h3>
            <p className="text-slate-400 text-sm mb-4">Worker Account</p>
            
            <div className="flex justify-center items-center gap-2 text-emerald-400 bg-emerald-500/10 py-1.5 px-3 rounded-full text-sm font-medium mx-auto w-fit">
              <CheckCircle size={16} /> Identity Verified
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
                <span className="font-bold text-yellow-500 flex items-center">4.8 ★</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default WorkerProfile;
