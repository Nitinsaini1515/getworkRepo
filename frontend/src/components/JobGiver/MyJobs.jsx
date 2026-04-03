import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Card from '../UI/Card';
import Button from '../UI/Button';
import { Plus, Users, Eye, MoreHorizontal } from 'lucide-react';

const MOCK_MY_JOBS = [
  { id: 1, title: 'Senior Frontend Engineer', applicants: 12, views: 342, status: 'Active', posted: '2 days ago' },
  { id: 2, title: 'Product Designer', applicants: 8, views: 156, status: 'Active', posted: '1 week ago' },
  { id: 3, title: 'Marketing Manager', applicants: 45, views: 890, status: 'Closed', posted: '1 month ago' },
];

const MyJobs = () => {
  return (
    <div className="pt-24 pb-16 min-h-screen px-4 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-1">Company Dashboard</h1>
          <p className="text-slate-400">Manage your job listings and applicants.</p>
        </div>
        <Link to="/giver/post-job">
          <Button>
            <Plus size={18} /> Post New Job
          </Button>
        </Link>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card className="flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center border border-indigo-500/20 text-indigo-400">
            <BriefcaseIcon size={24} />
          </div>
          <div>
            <p className="text-slate-400 text-sm font-medium">Active Jobs</p>
            <p className="text-2xl font-bold">2</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4">
          <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center border border-green-500/20 text-green-400">
            <Users size={24} />
          </div>
          <div>
            <p className="text-slate-400 text-sm font-medium">Total Applicants</p>
            <p className="text-2xl font-bold">65</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center border border-blue-500/20 text-blue-400">
            <Eye size={24} />
          </div>
          <div>
            <p className="text-slate-400 text-sm font-medium">Profile Views</p>
            <p className="text-2xl font-bold">1.2k</p>
          </div>
        </Card>
      </div>

      <h2 className="text-xl font-bold mb-4">Recent Postings</h2>
      <div className="space-y-4">
        {MOCK_MY_JOBS.map((job, index) => (
          <motion.div
            key={job.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-lg font-bold">{job.title}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${job.status === 'Active' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-slate-800 text-slate-400 border-slate-700'}`}>
                    {job.status}
                  </span>
                </div>
                <p className="text-sm text-slate-400">Posted {job.posted}</p>
              </div>

              <div className="flex items-center gap-6 text-sm">
                <div className="text-center">
                  <p className="font-bold text-lg">{job.applicants}</p>
                  <p className="text-slate-400">Applicants</p>
                </div>
                <div className="text-center">
                  <p className="font-bold text-lg">{job.views}</p>
                  <p className="text-slate-400">Views</p>
                </div>
                <div className="flex items-center gap-2 pl-4 border-l border-slate-800">
                  <Button variant="secondary" className="px-3 py-2 text-sm hidden sm:flex">View Applicants</Button>
                  <button className="p-2 text-slate-400 hover:text-white bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors">
                    <MoreHorizontal size={18} />
                  </button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// Helper icon component
const BriefcaseIcon = ({ size }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
);

export default MyJobs;

