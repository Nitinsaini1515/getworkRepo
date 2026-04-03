import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Scan, Timer, MapPin, CheckCircle, Navigation } from 'lucide-react';
import Card from '../UI/Card';
import Button from '../UI/Button';
import FileInput from '../UI/FileInput';
import Toast from '../UI/Toast';
import FeedbackModal from '../UI/FeedbackModal';
import { useAuth } from '../../Context/AuthContext';
import { fetchJobs, uploadJobProof, fetchJobById } from '../../services/jobsService.js';
import { submitFeedback } from '../../services/feedbackService.js';
import { getApiErrorMessage } from '../../utils/getApiErrorMessage.js';

function employerRef(job) {
  const e = job.employer;
  if (!e) return { id: '', name: 'Employer' };
  if (typeof e === 'object') {
    return {
      id: String(e._id || e.id || ''),
      name: e.businessName || e.name || 'Employer',
      rating: e.rating,
    };
  }
  return { id: String(e), name: 'Employer' };
}

function workerRef(job) {
  const w = job.worker;
  if (!w) return '';
  if (typeof w === 'object') return String(w._id || w.id || '');
  return String(w);
}

function parseHoursNum(h) {
  const m = String(h || '').match(/(\d+(?:\.\d+)?)/);
  return m ? parseFloat(m[1]) : 0;
}

const ActiveJob = () => {
  const { user, refreshUser } = useAuth();
  const [step, setStep] = useState(1);
  const [time, setTime] = useState(0);
  const [proofImage, setProofImage] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [activeJob, setActiveJob] = useState(null);

  const loadJob = useCallback(async () => {
    if (!user?.id) return;
    try {
      const jobs = await fetchJobs();
      const mine = jobs.find(
        (j) =>
          workerRef(j) === String(user.id) &&
          ['accepted', 'pending'].includes(j.status)
      );
      setActiveJob(mine || null);
      if (mine?.status === 'pending') setStep(5);
    } catch {
      setActiveJob(null);
    }
  }, [user?.id]);

  useEffect(() => {
    loadJob();
  }, [loadJob]);

  useEffect(() => {
    let interval;
    if (step === 3) {
      interval = setInterval(() => setTime((prev) => prev + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [step]);

  useEffect(() => {
    if (step !== 5 || !activeJob) return;
    const id = activeJob.id || activeJob._id;
    const iv = setInterval(async () => {
      try {
        const j = await fetchJobById(id);
        if (j.status === 'completed') {
          setStep(6);
          await refreshUser();
          setToast({ show: true, message: 'Job approved! Payment transferred.', type: 'success' });
          clearInterval(iv);
        }
      } catch {
        /* ignore */
      }
    }, 5000);
    return () => clearInterval(iv);
  }, [step, activeJob, refreshUser]);

  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const payRate = activeJob ? Number(activeJob.pay) || 0 : 400;
  const hoursEst = activeJob ? parseHoursNum(activeJob.hours) || 4 : 4;
  const emp = activeJob ? employerRef(activeJob) : { name: '—', id: '' };
  const earnedPreview = ((time / 3600) * payRate).toFixed(2);
  const payoutFinal = activeJob?.escrowAmount
    ? Number(activeJob.escrowAmount).toFixed(2)
    : (hoursEst * payRate).toFixed(2);

  const handleScan = () => {
    setToast({ show: true, message: 'QR Code Scanned Successfully! Timer Started.', type: 'success' });
    setStep(3);
  };

  const handleEndJob = () => {
    setStep(4);
  };

  const handleUploadProof = async () => {
    if (!proofImage || !activeJob) {
      setToast({ show: true, message: 'Please upload a proof of work image first.', type: 'error' });
      return;
    }
    try {
      const id = activeJob.id || activeJob._id;
      await uploadJobProof(id, proofImage);
      await refreshUser();
      await loadJob();
      setStep(5);
      setToast({ show: true, message: 'Proof uploaded. Pending employer approval...', type: 'success' });
    } catch (e) {
      setToast({ show: true, message: getApiErrorMessage(e), type: 'error' });
    }
  };

  const handleFeedbackSubmit = async ({ rating, comment }) => {
    if (!emp.id) return;
    await submitFeedback({
      toUser: emp.id,
      rating,
      comment,
      jobId: activeJob?.id || activeJob?._id,
    });
    await refreshUser();
  };

  if (!activeJob) {
    return (
      <div className="p-4 md:p-8 max-w-4xl mx-auto min-h-[calc(100vh-4rem)] flex flex-col">
        <h1 className="text-3xl font-bold mb-1">Active Job Workspace</h1>
        <p className="text-slate-400 mb-6">No active job assigned. Accept a job from the board to start.</p>
        <Card className="p-8 text-center text-slate-500">Browse &quot;Find Work&quot; and apply to open roles.</Card>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto min-h-[calc(100vh-4rem)] flex flex-col">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-1">Active Job Workspace</h1>
        <p className="text-slate-400">{activeJob.title} — {emp.name}</p>
      </div>

      <div className="flex-1 grid md:grid-cols-2 gap-6">

        <Card className="flex flex-col justify-center items-center p-8 text-center border-indigo-500/20 relative overflow-hidden">
          <div className="absolute inset-0 bg-indigo-500/5 backdrop-blur-3xl" />
          <div className="relative z-10 w-full">
            {step === 1 && (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                <div className="w-24 h-24 bg-indigo-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Navigation className="text-indigo-400 w-12 h-12" />
                </div>
                <h3 className="text-xl font-bold mb-2">Navigate to Location</h3>
                <p className="text-slate-400 mb-6 flex items-center justify-center gap-2">
                  <MapPin size={16} /> {activeJob.location}
                </p>
                <Button className="w-full" onClick={() => setStep(2)}>I&apos;ve Arrived</Button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                <div className="w-48 h-48 border-2 border-dashed border-indigo-500/50 rounded-xl mx-auto mb-6 flex flex-col items-center justify-center bg-slate-900/50">
                  <Scan size={48} className="text-indigo-400 mb-2 animate-pulse" />
                  <p className="text-xs text-indigo-300">Point phone at Employer QR</p>
                </div>
                <h3 className="text-xl font-bold mb-2">Scan QR to Start</h3>
                <p className="text-slate-400 mb-6 text-sm">Scanning confirms your arrival and starts the secure billing timer.</p>
                <Button className="w-full" onClick={handleScan}>Simulate Scan</Button>
                <Button variant="ghost" className="w-full mt-2" onClick={() => setStep(1)}>Back</Button>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                <div className="w-40 h-40 rounded-full border-4 border-indigo-500/30 border-t-indigo-500 mx-auto mb-8 flex items-center justify-center relative">
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }} className="absolute inset-0 rounded-full border-4 border-transparent border-t-indigo-400" />
                  <div className="text-center">
                    <p className="text-3xl font-bold tracking-wider font-mono">{formatTime(time)}</p>
                    <p className="text-indigo-400 text-xs">ELAPSED</p>
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-1">Job in Progress</h3>
                <p className="text-emerald-400 mb-8 font-medium">Earned so far: ₹{earnedPreview}</p>
                <Button variant="danger" className="w-full shadow-red-500/20" onClick={handleEndJob}>End Job</Button>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                <div className="w-24 h-24 bg-indigo-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="text-indigo-400 w-12 h-12" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Upload Proof of Work</h3>
                <p className="text-slate-300 mb-6 text-sm">Please upload an image showing the completed work for employer verification.</p>
                <div className="mb-6 text-left">
                  <FileInput
                    label="Upload Image (JPG, PNG)"
                    accept="image/*"
                    onChange={(file) => setProofImage(file)}
                  />
                  {proofImage && <p className="text-xs text-emerald-400 mt-2 text-center">Image attached successfully.</p>}
                </div>
                <Button className="w-full" onClick={handleUploadProof}>Submit for Approval</Button>
              </motion.div>
            )}

            {step === 5 && (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                <div className="w-24 h-24 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Timer className="text-orange-400 w-12 h-12 animate-pulse" />
                </div>
                <h3 className="text-2xl font-bold mb-2 text-orange-400">Pending Approval</h3>
                <p className="text-slate-300 mb-2">Waiting for the employer to verify your work.</p>
                <p className="text-slate-400 text-sm mb-8">This usually takes a few minutes. You will be notified once approved.</p>
              </motion.div>
            )}

            {step === 6 && (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="text-emerald-400 w-12 h-12" />
                </div>
                <h3 className="text-2xl font-bold mb-2 text-emerald-400">Job Complete!</h3>
                <p className="text-slate-300 mb-2">Total Time: <span className="font-bold">{formatTime(time)}</span></p>
                <p className="text-slate-300 mb-8">Amount Transferred: <span className="font-bold text-emerald-400">₹{payoutFinal}</span></p>
                <Button className="w-full text-indigo-100 border border-indigo-500/50 hover:bg-slate-800" onClick={() => setIsFeedbackOpen(true)}>Review Employer</Button>
              </motion.div>
            )}
          </div>
        </Card>

        <div className="space-y-6 flex flex-col">
          <Card className="flex-1 p-0 overflow-hidden relative min-h-[300px]">
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at center, #6366f1 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
            <div className="p-4 bg-slate-900/80 backdrop-blur-sm border-b border-slate-800">
              <h3 className="font-bold flex items-center gap-2"><MapPin size={18} className="text-indigo-400"/> Live Location Tracking</h3>
            </div>

            {step === 1 && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-800 px-4 py-2 rounded-full border border-slate-700 shadow-xl flex items-center gap-2 text-sm z-10">
                <Navigation size={14} className="text-indigo-400" /> Navigating to site...
              </div>
            )}
          </Card>

          <Card>
            <h3 className="font-bold mb-4 border-b border-slate-800 pb-2">Job Details Summary</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-slate-400">Hourly Rate</span> <span className="font-medium text-emerald-400">₹{payRate}/hr</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Est. Duration</span> <span className="font-medium">{hoursEst} Hours</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Employer</span> <span className="font-medium">{emp.name} ({emp.rating != null ? `${emp.rating}★` : '—'})</span></div>
            </div>
          </Card>
        </div>
      </div>

      <FeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
        targetName={emp.name}
        onSubmit={handleFeedbackSubmit}
      />

      <Toast message={toast.message} isVisible={toast.show} onClose={() => setToast({ show: false, message: '' })} type={toast.type === 'error' ? 'error' : 'success'} />
    </div>
  );
};

export default ActiveJob;
