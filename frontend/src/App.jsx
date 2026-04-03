import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
// import { useAuth } from './Context/AuthContext';
import { useAuth } from './Context/AuthContext';
import Navbar from './components/Navbar';
// import Sidebar from './components/UI/Sidebar';
import Sidebar from './components/Ui/Sidebar';
import Home from './components/Home';
import ChooseYourPath from './components/ChooseYourPath';
import Login from './components/Login';
import Register from './components/Register';
import About from './components/About';
import ChatBox from './components/UI/ChatBox';

// Job Giver Pages
import PostJob from './components/JobGiver/PostJob';
import MyJobs from './components/JobGiver/MyJobs';
import Wallet from './components/JobGiver/Wallet';
import JobHistory from './components/JobGiver/JobHistory';
import WorkerMap from './components/JobGiver/WorkerMap';
import EmployerProfile from './components/JobGiver/Profile';

// Worker Pages
import JobList from './components/Worker/JobList';
import WorkerDashboard from './components/Worker/Dashboard';
import WorkerWallet from './components/Worker/Wallet';
import WorkerHistory from './components/Worker/JobHistory';
import ActiveJob from './components/Worker/ActiveJobs';
import WorkerProfile from './components/Worker/Profile';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRole }) => {
  const { user, loading } = useAuth();
  
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRole && user.role !== allowedRole) return <Navigate to="/" replace />;

  return children;
};

const App = () => {
  const { user } = useAuth();
  const location = useLocation();
  const isDashboardLayout = user && (location.pathname.includes('/giver/') || location.pathname.includes('/worker/'));

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 selection:bg-indigo-500/30 font-sans">
      <Navbar />
      {isDashboardLayout && <Sidebar />}
      <main className={isDashboardLayout ? "md:pl-64 pt-16" : "pt-16"}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/choose-path" element={<ChooseYourPath />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register/:role" element={<Register />} />
          <Route path="/about" element={<About />} />

          {/* Alias Routes */}
          <Route path="/dashboard" element={<ProtectedRoute>{user?.role === 'Worker' ? <Navigate to="/worker/dashboard" replace /> : <Navigate to="/giver/dashboard" replace />}</ProtectedRoute>} />
          <Route path="/dashboard/worker" element={<Navigate to="/worker/dashboard" replace />} />
          <Route path="/dashboard/employer" element={<Navigate to="/giver/dashboard" replace />} />
          <Route path="/profile" element={<ProtectedRoute>{user?.role === 'Worker' ? <Navigate to="/worker/profile" replace /> : <Navigate to="/giver/profile" replace />}</ProtectedRoute>} />
          <Route path="/profile/:id" element={<ProtectedRoute>{user?.role === 'Worker' ? <Navigate to="/worker/profile" replace /> : <Navigate to="/giver/profile" replace />}</ProtectedRoute>} />

          {/* JobGiver (Employer) Routes */}
          <Route path="/giver/dashboard" element={<ProtectedRoute allowedRole="JobGiver"><MyJobs /></ProtectedRoute>} />
          <Route path="/giver/post-job" element={<ProtectedRoute allowedRole="JobGiver"><PostJob /></ProtectedRoute>} />
          <Route path="/giver/escrow" element={<ProtectedRoute allowedRole="JobGiver"><Wallet /></ProtectedRoute>} />
          <Route path="/giver/job-history" element={<ProtectedRoute allowedRole="JobGiver"><JobHistory /></ProtectedRoute>} />
          <Route path="/giver/map" element={<ProtectedRoute allowedRole="JobGiver"><WorkerMap /></ProtectedRoute>} />
          <Route path="/giver/profile" element={<ProtectedRoute allowedRole="JobGiver"><EmployerProfile /></ProtectedRoute>} />

          {/* Worker Routes */}
          <Route path="/worker/dashboard" element={<ProtectedRoute allowedRole="Worker"><WorkerDashboard /></ProtectedRoute>} />
          <Route path="/worker/jobs" element={<ProtectedRoute allowedRole="Worker"><JobList /></ProtectedRoute>} />
          <Route path="/worker/wallet" element={<ProtectedRoute allowedRole="Worker"><WorkerWallet /></ProtectedRoute>} />
          <Route path="/worker/history" element={<ProtectedRoute allowedRole="Worker"><WorkerHistory /></ProtectedRoute>} />
          <Route path="/worker/active" element={<ProtectedRoute allowedRole="Worker"><ActiveJob /></ProtectedRoute>} />
          <Route path="/worker/profile" element={<ProtectedRoute allowedRole="Worker"><WorkerProfile /></ProtectedRoute>} />
        </Routes>
        {user && <ChatBox />}
      </main>
    </div>
  );
};

export default App;
