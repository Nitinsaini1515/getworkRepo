import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, PhoneCall, X, MessageSquare, Mail } from 'lucide-react';
import { sendSOSAlert } from '../../services/sosService.js';

const SOSButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [actionLabel, setActionLabel] = useState(null);
  const [actionDesc, setActionDesc] = useState(null);

  const handleAction = async (type) => {
    let message = '';
    if (type === 'call') {
      message = 'SOS: user requested emergency call / authorities';
      setActionLabel('Calling emergency contact...');
      setActionDesc('Alerting authorities and your alternate mobile number.');
    } else if (type === 'sms') {
      message = "SOS SMS: I am not feeling safe. [Live location shared via app]";
      setActionLabel('Sending Emergency SMS...');
      setActionDesc("Message sent: 'I am not feeling safe. My live location: [Mock Location, Bandra]'");
    } else if (type === 'email') {
      message = 'SOS Email: Emergency help needed — location shared via GetWork';
      setActionLabel('Sending Emergency Email...');
      setActionDesc("To: alternate@contact.com | Subject: Emergency Help Needed | Message: I am not feeling safe. My live location: [Mock Location]");
    }
    try {
      await sendSOSAlert({ message, timestamp: new Date().toISOString() });
    } catch {
      setActionDesc((d) => (d ? `${d} (server log may have failed — check connection)` : 'Could not reach server.'));
    }
  };

  const closeModal = () => {
    setIsOpen(false);
    setActionLabel(null);
    setActionDesc(null);
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="relative bg-red-600 hover:bg-red-500 text-white font-bold py-3 px-6 rounded-full shadow-[0_0_20px_rgba(220,38,38,0.6)] flex items-center gap-2 overflow-hidden outline-none"
      >
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 bg-red-500 rounded-full z-0"
          style={{ mixBlendMode: 'screen' }}
        />
        <AlertTriangle size={20} className="relative z-10 animate-pulse" />
        <span className="relative z-10 tracking-wider">SOS EMERGENCY</span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
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

              {!actionLabel ? (
                <>
                  <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/30">
                    <AlertTriangle size={32} className="text-red-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">Emergency Help</h2>
                  <p className="text-slate-300 text-sm mb-6">Choose how you want to be rescued. This will send your live location to your emergency contacts.</p>

                  <div className="space-y-3 mb-6">
                    <button type="button" onClick={() => handleAction('call')} className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-between transition-colors">
                      <span className="flex items-center gap-2"><PhoneCall size={20}/> Call Authorities</span>
                    </button>
                    <button type="button" onClick={() => handleAction('sms')} className="w-full bg-orange-600 hover:bg-orange-500 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-between transition-colors">
                      <span className="flex items-center gap-2"><MessageSquare size={20}/> Send Alert SMS</span>
                    </button>
                    <button type="button" onClick={() => handleAction('email')} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-between transition-colors">
                      <span className="flex items-center gap-2"><Mail size={20}/> Email Contacts</span>
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <motion.div
                    animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1 }}
                    className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/30 shadow-[0_0_30px_rgba(239,68,68,0.4)]"
                  >
                    <AlertTriangle size={32} className="text-red-400" />
                  </motion.div>

                  <h2 className="text-xl font-bold text-white mb-2">{actionLabel}</h2>
                  <p className="text-slate-400 text-sm mb-8">{actionDesc}</p>
                </>
              )}

              <button
                type="button"
                onClick={closeModal}
                className="w-full bg-slate-800 hover:bg-slate-700 text-white font-medium py-3 px-6 rounded-xl transition-colors border border-slate-700 flex items-center justify-center gap-2"
              >
                <X size={18} /> Cancel & Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SOSButton;
