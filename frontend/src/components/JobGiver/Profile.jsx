import React from 'react';
import { motion } from 'framer-motion';
import { Settings, Upload, Shield, CheckCircle } from 'lucide-react';
import Card from '../UI/Card';
import Input from '../UI/Input';
import Button from '../UI/Button';
import { useAuth } from '../../Context/AuthContext';

const EmployerProfile = () => {
  const { user } = useAuth();

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Company Settings</h1>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Settings size={20} className="text-indigo-400" /> Basic Details</h2>
            <div className="space-y-4">
              <Input label="Company Name" defaultValue={user?.name} />
              <Input label="Email Address" defaultValue={user?.email} />
              <Input label="Business Address" placeholder="Enter full address" />
              <Button>Save Changes</Button>
            </div>
          </Card>

          <Card>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Shield size={20} className="text-indigo-400" /> Verification Details</h2>
            <p className="text-sm text-slate-400 mb-4">Complete your KYC to unlock unlimited job postings and verified badges.</p>
            
            <div className="border border-slate-700 bg-slate-800/50 rounded-xl p-4 mb-4">
              <p className="font-medium text-slate-200 mb-2">Aadhar Front & Back</p>
              <div className="flex gap-4">
                <Button variant="secondary" className="flex items-center gap-2 text-sm"><Upload size={16} /> Choose File</Button>
                <div className="text-sm text-slate-400 p-2">Status: <span className="text-yellow-500">Unverified</span></div>
              </div>
            </div>

            <div className="border border-slate-700 bg-slate-800/50 rounded-xl p-4">
              <p className="font-medium text-slate-200 mb-2">GSTIN / Shop License</p>
              <Input placeholder="Enter registration number" />
            </div>
            
            <Button className="mt-4">Submit for Verification</Button>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-indigo-600/10 from-slate-800 to-slate-900 border-slate-700">
            <h3 className="font-bold text-slate-200 mb-4">Verification Status</h3>
            <div className="flex items-center gap-3 mb-3">
              <CheckCircle size={18} className="text-emerald-500" />
              <span className="text-sm">Email Verified</span>
            </div>
            <div className="flex items-center gap-3 mb-3">
              <CheckCircle size={18} className="text-emerald-500" />
              <span className="text-sm">Phone Verified</span>
            </div>
            <div className="flex items-center gap-3 opacity-50">
              <Shield size={18} />
              <span className="text-sm">KYC Processing</span>
            </div>
          </Card>

          <Card>
            <h3 className="font-bold text-slate-200 mb-4">Account Stats</h3>
            <div className="space-y-3 divide-y divide-slate-800">
              <div className="flex justify-between py-2">
                <span className="text-slate-400">Total Hires</span>
                <span className="font-bold">24</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-slate-400">Hours Billed</span>
                <span className="font-bold">{user?.hoursBooked || 0}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-slate-400">Avg Rating</span>
                <span className="font-bold text-yellow-500 flex items-center">4.9 ★</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EmployerProfile;
