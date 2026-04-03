import React from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, Clock, CheckCircle, Search, Filter } from 'lucide-react';
// import Card from '../Ui/Card';
// import {Input} from '../Ui/Input';
// import Button from './Ui/Button';
// import Card from '../Ui/Card';
// import Button from '../Ui/Button';

import Button from '../UI/Button';
import Card from '../UI/Card';
import Input from '../UI/Input';
const MOCK_HISTORY = [
  { id: 1, title: 'Senior Frontend Engineer', date: 'Oct 15, 2026', worker: 'John Doe', status: 'Active', amount: '₹12,000' },
  { id: 2, title: 'UI/UX Designer', date: 'Sep 22, 2026', worker: 'Jane Smith', status: 'Completed', amount: '₹4,500' },
  { id: 3, title: 'Content Writer', date: 'Aug 10, 2026', worker: 'Unknown', status: 'Cancelled', amount: '₹0' },
  { id: 4, title: 'Warehouse Staff', date: 'Jul 05, 2026', worker: 'Alex M.', status: 'Completed', amount: '₹2,100' },
];

const JobHistory = () => {
  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Job History</h1>
          <p className="text-slate-400">Track all your past and active job postings.</p>
        </div>
        <div className="flex gap-3">
          <Input placeholder="Search jobs..." icon={Search} className="w-full md:w-64" />
          <Button variant="secondary"><Filter size={18} /></Button>
        </div>
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900 border-b border-slate-800 text-sm font-semibold text-slate-400">
                <th className="px-6 py-4">Job Title & Date</th>
                <th className="px-6 py-4">Assigned Worker</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Payment</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {MOCK_HISTORY.map((job) => (
                <tr key={job.id} className="hover:bg-slate-800/30 transition-colors group">
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-200">{job.title}</p>
                    <p className="text-xs text-slate-500">{job.date}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-300">
                    {job.worker}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                      job.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                      job.status === 'Active' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' : 
                      'bg-slate-800 text-slate-400 border-slate-700'
                    }`}>
                      {job.status === 'Completed' && <CheckCircle size={12} />}
                      {job.status === 'Active' && <Clock size={12} />}
                      {job.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-300">
                    {job.amount}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button variant="ghost" className="text-sm px-3 py-1.5">View</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default JobHistory;
