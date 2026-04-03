import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, User, LogOut, Bell, CheckCircle } from 'lucide-react';
import Button from './UI/Button';

const INITIAL_NOTIFICATIONS = [
  { id: 1, text: 'New worker available nearby', time: 'Just now', unread: true },
  { id: 2, text: 'New job available: Plumber', time: '10m ago', unread: true },
  { id: 3, text: 'Job "Senior Dev" accepted', time: '1h ago', unread: true },
  { id: 4, text: 'Payment received for milestone 1', time: '2d ago', unread: false },
];

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => n.unread).length;

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <motion.div whileHover={{ scale: 1.1, rotate: 5 }} transition={{ duration: 0.2 }}>
            <div className="bg-indigo-500/10 p-1.5 rounded-lg border border-indigo-500/20">
              <Briefcase className="w-6 h-6 text-indigo-400" />
            </div>
          </motion.div>
          <span className="text-xl font-bold text-white tracking-wide">Get<span className="text-indigo-400">Work</span></span>
        </Link>

        <div className="flex items-center gap-6">
          {!isAuthenticated ? (
            <>
              <Link to="/" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Home</Link>
              <Link to="/about" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">About</Link>
              <div className="flex gap-3">
                <Link to="/login">
                  <Button variant="ghost" className="hidden sm:flex text-sm">Login</Button>
                </Link>
                <Link to="/choose-path">
                  <Button variant="primary" className="text-sm px-5">Register</Button>
                </Link>
              </div>
            </>
          ) : (
            <>
              <Link to="/dashboard" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Dashboard</Link>
              <Link to="/profile" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Profile</Link>

              <div className="flex items-center gap-5 ml-4 pl-4 border-l border-slate-800 relative">
                
                {/* Notifications Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button 
                    onClick={() => setShowNotifications(!showNotifications)}
                    className={`relative p-2 rounded-lg transition-colors outline-none ${showNotifications ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}`}
                  >
                    <Bell size={20} />
                    {unreadCount > 0 && (
                      <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-slate-950"></span>
                    )}
                  </button>

                  <AnimatePresence>
                    {showNotifications && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-3 w-80 bg-slate-900 border border-slate-700/50 shadow-2xl rounded-xl overflow-hidden z-50 transform origin-top-right"
                      >
                        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800/60 bg-slate-900/50">
                          <h3 className="font-bold text-slate-200">Notifications</h3>
                          <span className="text-xs font-medium text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full">{unreadCount} new</span>
                        </div>
                        <div className="max-h-80 overflow-y-auto">
                          {notifications.length > 0 ? (
                            notifications.map((notif) => (
                              <div key={notif.id} className={`px-4 py-3 border-b border-slate-800/30 hover:bg-slate-800/50 transition-colors flex gap-3 ${notif.unread ? 'bg-indigo-500/5' : ''}`}>
                                <div className="mt-1 flex-shrink-0">
                                  {notif.unread ? <div className="w-2 h-2 bg-indigo-500 rounded-full mt-1.5"></div> : <CheckCircle size={14} className="text-slate-500 mt-0.5" />}
                                </div>
                                <div>
                                  <p className={`text-sm ${notif.unread ? 'text-slate-200 font-medium' : 'text-slate-400'}`}>{notif.text}</p>
                                  <p className="text-xs text-slate-500 mt-1">{notif.time}</p>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="px-4 py-6 text-center text-slate-400 text-sm">
                              No new notifications
                            </div>
                          )}
                        </div>
                        <div 
                          onClick={markAllAsRead}
                          className="px-4 py-2 border-t border-slate-800/60 text-center bg-slate-900/50 hover:bg-slate-800 transition-colors cursor-pointer"
                        >
                          <span className="text-xs font-medium text-indigo-400">Mark all as read</span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="flex items-center gap-2.5 text-sm text-slate-300 bg-slate-900/50 px-3 py-1.5 rounded-full border border-slate-800">
                  <div className="w-6 h-6 bg-indigo-500/20 text-indigo-400 rounded-full flex items-center justify-center">
                    <User size={14} />
                  </div>
                  <span className="font-medium mr-1">{user.name}</span>
                </div>
                
                <button onClick={handleLogout} className="text-slate-400 hover:text-red-400 hover:bg-red-500/10 p-2 rounded-lg transition-colors outline-none" title="Logout">
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
