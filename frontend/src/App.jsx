import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './Context/AuthContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Ui/Sidebar';
import Home from './components/Home';
import ChooseYourPath from './components/ChooseYourPath';
import Login from './components/Login';
import Register from './components/Register';

// Job Giver Pages
import PostJob from './components/JobGiver/PostJob';
import MyJobs from './components/JobGiver/MyJobs';
import EscrowWallet from './components/JobGiver/EscrowWallet';
import JobHistory from './components/JobGiver/JobHistory';
import WorkerMap from './components/JobGiver/WorkerMap';
import EmployerProfile from './components/JobGiver/Profile';

// Worker Pages
import JobList from './components/Worker/JobList';
import WorkerDashboard from './components/Worker/Dashboard';
import WorkerWallet from './components/Worker/Wallet';
import WorkerHistory from './components/Worker/JobHistory';
import ActiveJob from './components/Worker/ActiveJob';
import WorkerProfile from './components/Worker/Profile';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRole }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (allowedRole && user.role !== allowedRole) return <Navigate to="/" />;

  return children;
};

const App = () => {
  const { user } = useAuth();
  const location = useLocation();
  const isDashboardLayout = user && (location.pathname.includes('/giver/') || location.pathname.includes('/worker/'));

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 selection:bg-indigo-500/30 font-sans">
      <Navbar />
      <Sidebar />
      <main className={isDashboardLayout ? "md:pl-64 pt-16" : "pt-16"}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/choose-path" element={<ChooseYourPath />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register/:role" element={<Register />} />
          <Route path="/about" element={<div className="pt-24 text-center">About GetWork V2...</div>} />

          {/* JobGiver (Employer) Routes */}
          <Route path="/giver/dashboard" element={<ProtectedRoute allowedRole="JobGiver"><MyJobs /></ProtectedRoute>} />
          <Route path="/giver/post-job" element={<ProtectedRoute allowedRole="JobGiver"><PostJob /></ProtectedRoute>} />
          <Route path="/giver/escrow" element={<ProtectedRoute allowedRole="JobGiver"><EscrowWallet /></ProtectedRoute>} />
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
      </main>
    </div>
  );
};

export default App;
