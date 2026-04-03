import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Scan, Timer, MapPin, CheckCircle, Navigation } from 'lucide-react';
import Card from './Ui/Card.jsx';
import Button from './Ui/Button.jsx';
import Toast from './Ui/Toast.jsx';

const ActiveJob = () => {
  const [step, setStep] = useState(1); // 1: Navigate, 2: Scan QR, 3: Working, 4: Finished
  const [time, setTime] = useState(0);
  const [toast, setToast] = useState({ show: false, message: '' });

  // Timer simulation
  useEffect(() => {
    let interval;
    if (step === 3) {
      interval = setInterval(() => setTime((prev) => prev + 1), 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [step]);

  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleScan = () => {
    setToast({ show: true, message: 'QR Code Scanned Successfully! Timer Started.' });
    setStep(3);
  };

  const handleEndJob = () => {
    setStep(4);
    setToast({ show: true, message: 'Job completed! Payment transferred to wallet.' });
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto min-h-[calc(100vh-4rem)] flex flex-col">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-1">Active Job Workspace</h1>
        <p className="text-slate-400">Warehouse Organizer for Logistics Inc.</p>
      </div>

      <div className="flex-1 grid md:grid-cols-2 gap-6">
        
        {/* State Machine UI */}
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
                  <MapPin size={16} /> 124 Industrial Pkwy, Chicago
                </p>
                <Button className="w-full" onClick={() => setStep(2)}>I've Arrived</Button>
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
                <p className="text-emerald-400 mb-8 font-medium">Earned so far: ₹{((time / 3600) * 400).toFixed(2)}</p>
                <Button variant="danger" className="w-full shadow-red-500/20" onClick={handleEndJob}>End Job</Button>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="text-emerald-400 w-12 h-12" />
                </div>
                <h3 className="text-2xl font-bold mb-2 text-emerald-400">Job Complete!</h3>
                <p className="text-slate-300 mb-2">Total Time: <span className="font-bold">{formatTime(time)}</span></p>
                <p className="text-slate-300 mb-8">Amount Transferred: <span className="font-bold text-emerald-400">₹{((time / 3600) * 400).toFixed(2)}</span></p>
                <Button className="w-full">Rate Employer</Button>
              </motion.div>
            )}
          </div>
        </Card>

        {/* Map / Job Details Panel */}
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
              <div className="flex justify-between"><span className="text-slate-400">Hourly Rate</span> <span className="font-medium text-emerald-400">₹400/hr</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Est. Duration</span> <span className="font-medium">4 Hours</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Employer</span> <span className="font-medium">Logistics Inc. (4.9★)</span></div>
            </div>
          </Card>
        </div>
      </div>

      <Toast message={toast.message} isVisible={toast.show} onClose={() => setToast({show: false, message: ''})} type="success" />
    </div>
  );
};

export default ActiveJob;
