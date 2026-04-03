import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, Wallet, Briefcase, Map, History, Settings, Star, Calendar } from 'lucide-react';
import { useAuth } from '../../Context/AuthContext';

const Sidebar = () => {
  const location = useLocation();
  const { user } = useAuth();
  
  if (!user) return null;

  const getLinks = () => {
    if (user.role === 'JobGiver') {
      return [
        { path: '/giver/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/giver/post-job', label: 'Post a Job', icon: Briefcase },
        { path: '/giver/job-history', label: 'Job History', icon: History },
        { path: '/giver/escrow', label: 'Escrow Wallet', icon: Wallet },
        { path: '/giver/map', label: 'Worker Map', icon: Map },
        { path: '/giver/profile', label: 'Profile', icon: Settings }
      ];
    } else {
      return [
        { path: '/worker/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/worker/jobs', label: 'Find Work', icon: Briefcase },
        { path: '/worker/active', label: 'Active Job', icon: Star },
        { path: '/worker/history', label: 'Job History', icon: History },
        { path: '/worker/wallet', label: 'Wallet', icon: Wallet },
        { path: '/worker/profile', label: 'Profile', icon: Settings }
      ];
    }
  };

  return (
    <aside className="w-64 fixed left-0 top-16 bottom-0 overflow-y-auto bg-slate-900/50 backdrop-blur-md border-r border-slate-800 p-4 hidden md:block z-40">
      <div className="space-y-1 mt-4">
        {getLinks().map((link) => {
          const isActive = location.pathname.startsWith(link.path);
          return (
            <Link key={link.path} to={link.path} className="block relative">
              {isActive && (
                <motion.div 
                  layoutId="sidebarActiveIndicator" 
                  className="absolute inset-0 bg-indigo-500/10 rounded-xl"
                  initial={false}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <div className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors relative z-10 ${isActive ? 'text-indigo-400 font-medium' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'}`}>
                <link.icon size={20} className={isActive ? "text-indigo-500" : ""} />
                {link.label}
              </div>
            </Link>
          );
        })}
      </div>
    </aside>
  );
};

export default Sidebar;
