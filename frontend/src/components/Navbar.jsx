import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './ChooseYourPath';
import { motion } from 'framer-motion';
import { Briefcase, User, LogOut } from 'lucide-react';
import Button from '../Ui/Button';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <motion.div whileHover={{ rotate: 180 }} transition={{ duration: 0.3 }}>
            <Briefcase className="w-8 h-8 text-indigo-500" />
          </motion.div>
          <span className="text-xl font-bold text-white tracking-wide">Get<span className="text-indigo-400">Work</span></span>
        </Link>

        <div className="flex items-center gap-6">
          {!user ? (
            <>
              <Link to="/about" className="text-slate-300 hover:text-white transition-colors">About</Link>
              <div className="flex gap-3">
                <Link to="/login">
                  <Button variant="ghost" className="hidden sm:flex">Log in</Button>
                </Link>
                <Link to="/choose-path">
                  <Button variant="primary">Get Started</Button>
                </Link>
              </div>
            </>
          ) : (
            <>
              {user.role === 'JobGiver' && (
                <>
                  <Link to="/giver/dashboard" className="text-slate-300 hover:text-white transition-colors">Dashboard</Link>
                  <Link to="/giver/post-job" className="text-slate-300 hover:text-white transition-colors">Post a Job</Link>
                </>
              )}
              {user.role === 'Worker' && (
                <>
                  <Link to="/worker/dashboard" className="text-slate-300 hover:text-white transition-colors">Dashboard</Link>
                  <Link to="/worker/jobs" className="text-slate-300 hover:text-white transition-colors">Find Work</Link>
                </>
              )}
              <div className="flex items-center gap-5 ml-4 pl-4 border-l border-slate-800">
                <button className="relative text-slate-400 hover:text-white transition-colors outline-none focus:outline-none">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-slate-950"></span>
                </button>
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <User size={16} />
                  <span className="font-medium mr-2">{user.name}</span>
                </div>
                <button onClick={handleLogout} className="text-slate-400 hover:text-red-400 transition-colors">
                  <LogOut size={18} />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
