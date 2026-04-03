import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Shield, Wallet, Star } from 'lucide-react';
import Card from './UI/Card';

const About = () => {
  return (
    <div className="pt-24 pb-16 px-4 max-w-5xl mx-auto min-h-screen">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">About <span className="text-indigo-400">GetWork</span></h1>
        <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          GetWork is a modern platform bridging the gap between skilled workers and employers. 
          We eliminate intermediaries, ensuring transparent connections, verified jobs, and instant payments.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="h-full bg-slate-900 border-slate-800 hover:border-indigo-500/50 transition-colors">
            <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-400 mb-6 border border-indigo-500/20">
              <Briefcase size={24} />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Smart Job Matching</h3>
            <p className="text-slate-400 leading-relaxed">
              We match employers with verified workers instantly based on skills, location, and availability. Find the right person or the right job in minutes, not days.
            </p>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="h-full bg-slate-900 border-slate-800 hover:border-red-500/50 transition-colors">
            <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center text-red-400 mb-6 border border-red-500/20">
              <Shield size={24} />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Worker Safety System</h3>
            <p className="text-slate-400 leading-relaxed">
              Safety is our priority. With our integrated SOS emergency system, location tracking during commutes, and identity verification, workers and employers remain completely secure.
            </p>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="h-full bg-slate-900 border-slate-800 hover:border-emerald-500/50 transition-colors">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-400 mb-6 border border-emerald-500/20">
              <Wallet size={24} />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Escrow Wallet Security</h3>
            <p className="text-slate-400 leading-relaxed">
              Never worry about unpaid dues. Our escrow wallet system secures payments from employers before work begins and releases them instantly upon verified job completion.
            </p>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="h-full bg-slate-900 border-slate-800 hover:border-yellow-500/50 transition-colors">
            <div className="w-12 h-12 bg-yellow-500/10 rounded-xl flex items-center justify-center text-yellow-400 mb-6 border border-yellow-500/20">
              <Star size={24} />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Ratings & Feedback</h3>
            <p className="text-slate-400 leading-relaxed">
              A robust feedback system maintains platform quality. Read reviews, check ratings, and confidently connect with top-rated professionals for your needs.
            </p>
          </Card>
        </motion.div>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-16 text-center"
      >
        <p className="text-slate-500 text-sm font-medium tracking-wide">Building a secure, verified, and reliable workforce ecosystem.</p>
      </motion.div>
    </div>
  );
};

export default About;
