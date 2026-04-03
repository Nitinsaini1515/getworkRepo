import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { User, Briefcase } from 'lucide-react';
import Card from './Ui/Card';

const ChooseYourPath = () => {
  return (
    <div className="min-h-screen pt-24 pb-16 flex items-center justify-center px-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold mb-4"
          >
            How do you want to use <span className="text-indigo-400">GetWork</span>?
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-slate-400"
          >
            Select your path. You can always change this later in settings.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Link to="/register/worker" className="block outline-none">
            <Card hover={true} delay={0.3} className="h-full flex flex-col items-center text-center p-12 cursor-pointer border-2 border-transparent hover:border-indigo-500/50 group">
              <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 group-hover:bg-indigo-500/20">
                <User className="w-10 h-10 text-indigo-400" />
              </div>
              <h2 className="text-2xl font-bold mb-4">I'm a Worker</h2>
              <p className="text-slate-400">Find hourly, daily, or full-time jobs that match your skills.</p>
            </Card>
          </Link>

          <Link to="/register/employer" className="block outline-none">
            <Card hover={true} delay={0.4} className="h-full flex flex-col items-center text-center p-12 cursor-pointer border-2 border-transparent hover:border-indigo-500/50 group">
              <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 group-hover:bg-indigo-500/20">
                <Briefcase className="w-10 h-10 text-indigo-400" />
              </div>
              <h2 className="text-2xl font-bold mb-4">I'm an Employer</h2>
              <p className="text-slate-400">Post jobs, review applicants, and hire top talent instantly.</p>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ChooseYourPath;
