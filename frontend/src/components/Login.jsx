import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '.../context/AuthContext';
import Card from '../Ui/Card';
import Input from '../Ui/Input';
import Button from '../Ui/Button';
import { Mail, Lock, AlertCircle } from 'lucide-react';
import Toast from '../Ui/Toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isToastVisible, setToastVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      const user = await login(email, password);
      setToastVisible(true);
      setTimeout(() => {
        if (user.role === 'JobGiver') navigate('/giver/dashboard');
        else navigate('/worker/jobs');
      }, 1500);
    } catch (err) {
      setError(err.message || 'Failed to login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl" />

      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md z-10">
        <Card className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
            <p className="text-slate-400">Log in to your GetWork account</p>
          </div>

          {error && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-red-500/10 border border-red-500/50 p-3 rounded-lg flex items-center gap-2 mb-6">
              <AlertCircle size={18} className="text-red-400" />
              <span className="text-red-400 text-sm">{error}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input 
              label="Email Address" 
              type="email" 
              placeholder="employer@test.com or worker@test.com" 
              icon={Mail} 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input 
              label="Password" 
              type="password" 
              placeholder="••••••••" 
              icon={Lock} 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            
            <div className="flex justify-end">
              <Link to="#" className="text-sm text-indigo-400 hover:text-indigo-300">Forgot password?</Link>
            </div>

            <Button type="submit" className="w-full" isLoading={isLoading}>
              Log In
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-400">
            Don't have an account? <Link to="/choose-path" className="text-indigo-400 hover:text-indigo-300 font-medium">Sign up</Link>
          </div>
        </Card>
      </motion.div>

      <Toast 
        message="Successfully logged in! Redirecting..." 
        isVisible={isToastVisible} 
        onClose={() => setToastVisible(false)} 
        type="success" 
      />
    </div>
  );
};

export default Login;
