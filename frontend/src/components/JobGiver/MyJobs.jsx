import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Card from '../UI/Card';
import Button from '../UI/Button';
import Input from '../UI/Input';
import { Plus, Users, Eye, MoreHorizontal, Zap, MapPin, Clock, DollarSign } from 'lucide-react';
import Toast from '../UI/Toast';
import { fetchJobs, createJob, approveJobCompletion } from '../../services/jobsService.js';
import { formatRelativeTime } from '../../utils/formatTime.js';
import { getApiErrorMessage } from '../../utils/getApiErrorMessage.js';

const statusLabel = (s) => {
  if (s === 'completed') return 'Closed';
  if (s === 'pending') return 'Pending review';
  return 'Active';
};

const MyJobs = () => {
  const [quickJob, setQuickJob] = useState({ title: '', location: '', hours: '', pay: '' });
  const [isPosting, setIsPosting] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const list = await fetchJobs();
      setJobs(
        list.map((j) => ({
          id: j.id || j._id,
          title: j.title,
          applicants: j.applicants?.length ?? 0,
          views: Math.max(1, (j.applicants?.length ?? 0) * 12 + 100),
          status: statusLabel(j.status),
          posted: formatRelativeTime(j.createdAt) || '—',
          raw: j,
        }))
      );
    } catch (e) {
      setToast({ show: true, message: getApiErrorMessage(e), type: 'error' });
      setJobs([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const activeCount = jobs.filter((j) => j.status === 'Active').length;
  const totalApplicants = jobs.reduce((a, j) => a + j.applicants, 0);

  const handleApprove = async (raw) => {
    const id = raw.id || raw._id;
    try {
      await approveJobCompletion(id);
      setToast({ show: true, message: 'Job approved. Payment released to worker.', type: 'success' });
      load();
    } catch (e) {
      setToast({ show: true, message: getApiErrorMessage(e), type: 'error' });
    }
  };

  const handleQuickJobSubmit = async (e) => {
    e.preventDefault();
    if (!quickJob.title || !quickJob.location || !quickJob.hours || !quickJob.pay) return;
    setIsPosting(true);
    try {
      await createJob({
        title: quickJob.title,
        description: 'Quick job posted from dashboard.',
        location: quickJob.location,
        hours: quickJob.hours,
        pay: Number(quickJob.pay),
        tier: 'Standard',
        experience: 'Any',
      });
      setToast({ show: true, message: 'Quick Job Posted Successfully!', type: 'success' });
      setQuickJob({ title: '', location: '', hours: '', pay: '' });
      load();
    } catch (err) {
      setToast({ show: true, message: getApiErrorMessage(err), type: 'error' });
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <div className="pt-24 pb-16 min-h-screen px-4 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-1 bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">Company Dashboard</h1>
          <p className="text-slate-400">Manage your job listings and applicants.</p>
        </div>
        <Link to="/giver/post-job">
          <Button>
            <Plus size={18} /> Post Scheduled Job
          </Button>
        </Link>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-10">
        <Card className="flex items-center gap-4 border-slate-800">
          <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center border border-indigo-500/20 text-indigo-400 shadow-sm shadow-indigo-500/20">
            <BriefcaseIcon size={24} />
          </div>
          <div>
            <p className="text-slate-400 text-sm font-medium">Active Jobs</p>
            <p className="text-2xl font-bold">{loading ? '—' : activeCount}</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4 border-slate-800">
          <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center border border-green-500/20 text-green-400 shadow-sm shadow-green-500/20">
            <Users size={24} />
          </div>
          <div>
            <p className="text-slate-400 text-sm font-medium">Total Applicants</p>
            <p className="text-2xl font-bold">{loading ? '—' : totalApplicants}</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4 border-slate-800">
          <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center border border-blue-500/20 text-blue-400 shadow-sm shadow-blue-500/20">
            <Eye size={24} />
          </div>
          <div>
            <p className="text-slate-400 text-sm font-medium">Profile Views</p>
            <p className="text-2xl font-bold">{loading ? '—' : jobs.length * 42}</p>
          </div>
        </Card>
      </div>

      <motion.div
        className="mb-10 relative group"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
        <Card className="relative p-6 sm:p-8 bg-slate-900 border-slate-700/50">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-indigo-500/20 rounded-lg">
              <Zap className="text-indigo-400 w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Quick Job Post</h2>
              <p className="text-sm text-slate-400">Need someone immediately? Post an urgent job in seconds.</p>
            </div>
          </div>

          <form onSubmit={handleQuickJobSubmit} className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <Input
                label="Job Title"
                placeholder="e.g. Plumber needed"
                value={quickJob.title}
                onChange={(e) => setQuickJob({ ...quickJob, title: e.target.value })}
                required
              />
              <Input
                label="Location"
                placeholder="City or Area"
                icon={MapPin}
                value={quickJob.location}
                onChange={(e) => setQuickJob({ ...quickJob, location: e.target.value })}
                required
              />
              <Input
                label="Hours / Duration"
                placeholder="e.g. 4 hrs today"
                icon={Clock}
                value={quickJob.hours}
                onChange={(e) => setQuickJob({ ...quickJob, hours: e.target.value })}
                required
              />
              <Input
                label="Pay ($)"
                type="number"
                placeholder="e.g. 50"
                icon={DollarSign}
                value={quickJob.pay}
                onChange={(e) => setQuickJob({ ...quickJob, pay: e.target.value })}
                required
              />
            </div>
            <Button type="submit" isLoading={isPosting} className="w-full md:w-auto px-6 py-3 h-[46px]">
              Post Quick Job
            </Button>
          </form>
        </Card>
      </motion.div>

      <h2 className="text-xl font-bold mb-4 flex items-center justify-between">
        Recent Postings
      </h2>
      <div className="space-y-4">
        {loading ? (
          <p className="text-slate-400">Loading…</p>
        ) : (
          jobs.map((job, index) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-slate-800/60 hover:bg-slate-800/30 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-lg font-bold text-slate-200">{job.title}</h3>
                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium tracking-wide ${job.status === 'Active' ? 'bg-green-500/10 text-green-400 border border-green-500/30' : 'bg-slate-800 text-slate-400 border border-slate-700'}`}>
                      {job.status}
                    </span>
                  </div>
                  <p className="text-sm text-slate-400 flex items-center gap-2">
                    <Clock size={14}/> Posted {job.posted}
                  </p>
                </div>

                <div className="flex items-center gap-6 text-sm">
                  <div className="text-center">
                    <p className="font-bold text-lg text-slate-200">{job.applicants}</p>
                    <p className="text-slate-500 font-medium">Applicants</p>
                  </div>
                  <div className="text-center hidden sm:block">
                    <p className="font-bold text-lg text-slate-200">{job.views}</p>
                    <p className="text-slate-500 font-medium">Views</p>
                  </div>
                  <div className="flex items-center gap-2 pl-4 border-l border-slate-800">
                    {job.raw?.status === 'pending' && (
                      <Button className="px-3 py-2 text-sm" type="button" onClick={() => handleApprove(job.raw)}>
                        Approve work
                      </Button>
                    )}
                    <Button variant="secondary" className="px-3 py-2 text-sm hidden sm:flex" type="button">View Applicants</Button>
                    <button type="button" className="p-2 text-slate-400 hover:text-white bg-slate-800/50 rounded-lg hover:bg-slate-700 transition-colors">
                      <MoreHorizontal size={18} />
                    </button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))
        )}
      </div>

      <Toast
        message={toast.message}
        isVisible={toast.show}
        onClose={() => setToast({ ...toast, show: false })}
        type={toast.type === 'error' ? 'error' : 'success'}
      />
    </div>
  );
};

const BriefcaseIcon = ({ size }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
);

export default MyJobs;
