import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, PhoneCall, X } from 'lucide-react';

const SOSButton = () => {
  const [isCalling, setIsCalling] = useState(false);
  
  const handleSOSClick = () => {
    setIsCalling(true);
    // Simulate auto hang up after 5 seconds
    setTimeout(() => {
      setIsCalling(false);
    }, 5000);
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleSOSClick}
        className="relative bg-red-600 hover:bg-red-500 text-white font-bold py-3 px-6 rounded-full shadow-[0_0_20px_rgba(220,38,38,0.6)] flex items-center gap-2 overflow-hidden outline-none"
      >
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 bg-red-500 rounded-full z-0"
          style={{ mixBlendMode: 'screen' }}
        />
        <AlertTriangle size={20} className="relative z-10" />
        <span className="relative z-10 tracking-wider">SOS EMERGENCY</span>
      </motion.button>

      <AnimatePresence>
        {isCalling && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              className="bg-red-950/90 border border-red-500/50 p-8 rounded-3xl shadow-2xl max-w-sm w-full text-center relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-red-500 shadow-[0_0_10px_rgba(239,68,68,1)]" />
              
              <motion.div 
                animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
                transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1 }}
                className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/30 shadow-[0_0_30px_rgba(239,68,68,0.4)]"
              >
                <PhoneCall size={32} className="text-red-400" />
              </motion.div>
              
              <h2 className="text-2xl font-bold text-white mb-2">Emergency SOS</h2>
              <p className="text-red-300 font-medium mb-1">Calling Emergency Contact...</p>
              <p className="text-slate-400 text-sm mb-8">Alerting authorities and your alternate mobile number.</p>
              
              <button 
                onClick={() => setIsCalling(false)}
                className="w-full bg-slate-800 hover:bg-slate-700 text-white font-medium py-3 px-6 rounded-xl transition-colors border border-slate-700 flex items-center justify-center gap-2"
              >
                <X size={18} /> Cancel Call
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SOSButton;
