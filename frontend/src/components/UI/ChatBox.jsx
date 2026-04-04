import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, User } from 'lucide-react';
import { useAuth } from '../../Context/AuthContext';
import { fetchJobs } from '../../services/jobsService.js';
import { fetchChatMessages, sendChatMessage } from '../../services/chatService.js';

function employerId(job) {
  const e = job.employer;
  if (!e) return '';
  if (typeof e === 'object') return String(e._id || e.id || '');
  return String(e);
}

function workerId(job) {
  const w = job.worker;
  if (!w) return '';
  if (typeof w === 'object') return String(w._id || w.id || '');
  return String(w);
}

function findChatJob(jobs, uid) {
  const id = String(uid);
  for (const j of jobs) {
    if (!['applied', 'in-progress', 'completed'].includes(j.status)) continue;
    const eid = employerId(j);
    const wid = workerId(j);
    const isApplicant = j.applicants?.some(
      (a) => String(a.user) === id || String(a.user?._id) === id
    );
    if (eid === id || wid === id || isApplicant) {
      return j;
    }
  }
  return null;
}

function getReceiverId(job, myId) {
  const uid = String(myId);
  const eid = employerId(job);
  if (uid === eid) {
    if (workerId(job)) return workerId(job);
    const first = job.applicants?.[0];
    return first ? String(first.user) : null;
  }
  return eid || null;
}

const ChatBox = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [chatJob, setChatJob] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadContext = useCallback(async () => {
    if (!user?.id) return;
    try {
      const jobs = await fetchJobs();
      const j = findChatJob(jobs, user.id);
      setChatJob(j);
      if (j) {
        const msgs = await fetchChatMessages(j.id || j._id);
        setMessages(
          (msgs || []).map((m) => ({
            id: m.id,
            senderId: String(m.senderId),
            text: m.message,
            time: new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          }))
        );
      } else {
        setMessages([]);
      }
    } catch {
      setChatJob(null);
      setMessages([]);
    }
  }, [user?.id]);

  useEffect(() => {
    if (!user) return;
    loadContext();
    const t = setInterval(loadContext, 10000);
    return () => clearInterval(t);
  }, [user, loadContext]);

  useEffect(() => {
    if (isOpen) {
      loadContext();
      scrollToBottom();
    }
  }, [messages, isOpen, loadContext]);

  if (!user) return null;
  const showChat = user.activeJobs > 0 || user.jobApplied || user.jobAccepted;
  if (!showChat) return null;

  const myId = String(user.id);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || !chatJob) return;
    const receiverId = getReceiverId(chatJob, myId);
    if (!receiverId) return;
    const jobId = chatJob.id || chatJob._id;
    try {
      await sendChatMessage({
        jobId,
        message: inputText.trim(),
        receiverId,
      });
      setInputText('');
      await loadContext();
    } catch {
      setInputText(inputText);
    }
  };

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <button
              onClick={() => setIsOpen(true)}
              className="bg-indigo-600 hover:bg-indigo-500 text-white p-4 rounded-full shadow-lg shadow-indigo-500/20 transition-all group flex items-center justify-center relative outline-none"
            >
              <MessageCircle size={24} className="group-hover:scale-110 transition-transform" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-pink-500"></span>
              </span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-6 right-6 w-[350px] sm:w-[400px] h-[550px] max-h-[80vh] bg-slate-900 border border-slate-700 shadow-2xl rounded-2xl z-50 flex flex-col overflow-hidden"
          >
            <div className="bg-slate-800/80 backdrop-blur-md p-4 border-b border-slate-700 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-500/20 rounded-full flex items-center justify-center border border-indigo-500/30">
                  <User size={20} className="text-indigo-400" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-100">{user.role === 'Worker' ? 'Employer' : 'Worker'} Support</h3>
                  <p className="text-xs text-emerald-400 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> Online
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white hover:bg-slate-700 p-2 rounded-lg transition-colors outline-none"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-950/50">
              {!chatJob ? (
                <p className="text-sm text-slate-500 text-center py-6">No active conversation yet. Apply or accept a job to chat.</p>
              ) : (
                messages.map((msg) => {
                  const isMe = String(msg.senderId) === myId;
                  return (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      key={msg.id}
                      className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`px-4 py-2 rounded-2xl max-w-[85%] text-sm ${
                          isMe
                            ? 'bg-indigo-600 text-white rounded-tr-none'
                            : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-tl-none'
                        }`}
                      >
                        {msg.text}
                      </div>
                      <span className="text-[10px] text-slate-500 mt-1 px-1">{msg.time}</span>
                    </motion.div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-3 bg-slate-900 border-t border-slate-700">
              <form onSubmit={handleSend} className="flex items-center gap-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                  disabled={!chatJob}
                />
                <button
                  type="submit"
                  disabled={!inputText.trim() || !chatJob}
                  className={`p-3 rounded-xl flex items-center justify-center transition-all ${
                    inputText.trim() && chatJob
                      ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  <Send size={18} className={inputText.trim() ? 'translate-x-0.5' : ''} />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatBox;
