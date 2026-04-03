import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Briefcase, IndianRupee, Clock, CheckCircle } from 'lucide-react';
import Card from './Ui/Card';
import Button from './Ui/Button';
import { useAuth } from './../context/AuthContext';

const WorkerDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-1">Welcome back, {user?.name?.split(' ')[0]}</h1>
          <p className="text-slate-400">Here's what's happening with your jobs today.</p>
        </div>
        <Link to="/worker/jobs">
          <Button><Briefcase size={18} /> Find Work</Button>
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
        <Card className="flex flex-col items-center justify-center p-6 text-center border-emerald-500/20">
          <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-400 mb-3">
            <IndianRupee size={24} />
          </div>
          <p className="text-3xl font-bold">₹{user?.totalEarned?.toLocaleString()}</p>
          <p className="text-slate-400 text-sm mt-1">Total Earnings</p>
        </Card>
        
        <Card className="flex flex-col items-center justify-center p-6 text-center border-blue-500/20">
          <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center text-blue-400 mb-3">
            <Clock size={24} />
          </div>
          <p className="text-3xl font-bold">{user?.hoursWorked}h</p>
          <p className="text-slate-400 text-sm mt-1">Hours Worked</p>
        </Card>

        <Card className="flex flex-col items-center justify-center p-6 text-center border-indigo-500/20 bg-indigo-500/5">
          <div className="w-12 h-12 bg-indigo-500/10 rounded-full flex items-center justify-center text-indigo-400 mb-3">
            <Briefcase size={24} />
          </div>
          <p className="text-3xl font-bold text-indigo-400">{user?.activeJobs}</p>
          <p className="text-slate-400 text-sm mt-1">Active Jobs</p>
        </Card>
        
        <Card className="flex flex-col items-center justify-center p-6 text-center border-slate-700">
          <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center text-slate-400 mb-3">
            <CheckCircle size={24} />
          </div>
          <p className="text-3xl font-bold text-slate-300">{user?.completedJobs}</p>
          <p className="text-slate-400 text-sm mt-1">Completed Jobs</p>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <Card className="p-0 overflow-hidden">
          <div className="p-6 border-b border-slate-800">
            <h3 className="font-bold text-lg">Active Current Job</h3>
          </div>
          {user?.activeJobs > 0 ? (
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="font-bold text-xl text-indigo-300 mb-1">Warehouse Organizer</h4>
                  <p className="text-slate-400 text-sm flex items-center gap-1"><Clock size={14}/> Started 2 hours ago</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-xl">₹400/hr</p>
                  <p className="text-slate-400 text-xs">Escrow Secured</p>
                </div>
              </div>
              <Link to="/worker/active" className="block outline-none">
                <Button className="w-full">Open Active Job Workspace</Button>
              </Link>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400 text-sm">
              No active jobs currently. Browse the job board to find a new gig!
            </div>
          )}
        </Card>

        <Card className="p-0 overflow-hidden">
          <div className="p-6 border-b border-slate-800 flex justify-between items-center">
            <h3 className="font-bold text-lg">Recent Earnings</h3>
            <Link to="/worker/wallet" className="text-sm text-indigo-400 hover:text-indigo-300">View Wallet</Link>
          </div>
          <div className="divide-y divide-slate-800">
            <div className="p-4 px-6 flex justify-between items-center bg-slate-800/20">
              <div>
                <p className="font-bold">UI Design Project</p>
                <p className="text-xs text-slate-400">Oct 12 • 4 hours</p>
              </div>
              <p className="font-bold text-emerald-400">+₹2,400</p>
            </div>
            <div className="p-4 px-6 flex justify-between items-center">
              <div>
                <p className="font-bold">Event Setup</p>
                <p className="text-xs text-slate-400">Oct 05 • 8 hours</p>
              </div>
              <p className="font-bold text-emerald-400">+₹1,600</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default WorkerDashboard;
