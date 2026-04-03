import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Card from './Ui/Card';
import Input from './Ui/Input';
import Button from './Ui/Button';
import { Mail, Lock, User as UserIcon, AlertCircle } from 'lucide-react';
import Toast from './Ui/Toast';

const Register = () => {
  const { role } = useParams();
  const parsedRole = role === 'employer' ? 'JobGiver' : 'Worker';
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: parsedRole
  });
  
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '' });
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!formData.name || !formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    try {
      await register(formData);
      setToast({ show: true, message: 'Account created successfully!' });
      setTimeout(() => {
        if (formData.role === 'JobGiver') navigate('/giver/dashboard');
        else navigate('/worker/jobs');
      }, 1500);
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[100px]" />
      
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md z-10">
        <Card className="p-8">
          <div className="text-center mb-8">
            <div className="inline-block px-3 py-1 bg-slate-800 rounded-full text-indigo-400 text-xs font-medium mb-4 uppercase tracking-wider">
              {formData.role} Account
            </div>
            <h1 className="text-3xl font-bold mb-2">Create an Account</h1>
            <p className="text-slate-400">Join GetWork to {formData.role === 'JobGiver' ? 'hire talent' : 'find opportunities'}</p>
          </div>

          {error && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-red-500/10 border border-red-500/50 p-3 rounded-lg flex items-center gap-2 mb-6">
              <AlertCircle size={18} className="text-red-400" />
              <span className="text-red-400 text-sm">{error}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input 
              label={formData.role === 'JobGiver' ? "Company Name" : "Full Name"}
              name="name"
              type="text" 
              placeholder={formData.role === 'JobGiver' ? "Acme Corp" : "John Doe"} 
              icon={UserIcon} 
              value={formData.name}
              onChange={handleChange}
            />
            <Input 
              label="Email Address" 
              name="email"
              type="email" 
              placeholder="you@example.com" 
              icon={Mail} 
              value={formData.email}
              onChange={handleChange}
            />
            <Input 
              label="Password" 
              name="password"
              type="password" 
              placeholder="••••••••" 
              icon={Lock} 
              value={formData.password}
              onChange={handleChange}
            />
            
            <Button type="submit" className="w-full mt-2" isLoading={isLoading}>
              Sign Up
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-400">
            Already have an account? <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-medium">Log in</Link>
          </div>
        </Card>
      </motion.div>

      <Toast 
        message={toast.message} 
        isVisible={toast.show} 
        onClose={() => setToast({ ...toast, show: false })} 
        type="success" 
      />
    </div>
  );
};

export default Register;
