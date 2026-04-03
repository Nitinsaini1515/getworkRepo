import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import Card from './UI/Card';
import Input from './UI/Input';
import Button from './UI/Button';
import FileInput from './UI/FileInput';
import { Mail, Lock, User as UserIcon, AlertCircle, Briefcase, Award, FileText, Settings, Building, Store } from 'lucide-react';
import Toast from './UI/Toast';

const Register = () => {
  const { role } = useParams();
  const parsedRole = role === 'employer' ? 'JobGiver' : 'Worker';
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    qualification: '',
    skills: '',
    businessName: '',
    businessDetails: '',
    role: parsedRole
  });
  
  const [files, setFiles] = useState({
    govtId: null,
    profilePic: null
  });
  
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '' });
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (field, file) => {
    setFiles({ ...files, [field]: file });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Basic validations
    if (!formData.name || !formData.email || !formData.password) {
      setError('Please fill in all basic required fields.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (parsedRole === 'Worker') {
      if (!formData.qualification || !formData.skills) {
        setError('Please provide your qualifications and skills.');
        return;
      }
    }

    if (parsedRole === 'JobGiver') {
      if (!formData.businessName) {
        setError('Business name is required for Employer registration.');
        return;
      }
    }

    setIsLoading(true);
    try {
      // Pass both text data and files (mocked backend handles this or use FormData in real scenario)
      await register({ ...formData, ...files });
      setToast({ show: true, message: 'Account created successfully!' });
      setTimeout(() => {
        if (formData.role === 'JobGiver') navigate('/giver/dashboard');
        else navigate('/worker/dashboard');
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
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-pink-600/10 rounded-full blur-[100px]" />
      
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-2xl z-10 my-8">
        <Card className="p-8 md:p-10">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center px-4 py-1.5 bg-slate-900 border border-slate-800 rounded-full text-indigo-400 text-sm font-semibold mb-6 uppercase tracking-widest shadow-lg shadow-indigo-500/5">
              {parsedRole === 'JobGiver' ? <Briefcase size={16} className="mr-2" /> : <UserIcon size={16} className="mr-2" />}
              {parsedRole} Registration
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              Complete Your Profile
            </h1>
            <p className="text-slate-400 text-lg">
              {parsedRole === 'JobGiver' ? 'Join GetWork to find top talent for your business.' : 'Join GetWork to find premium hourly and full-time opportunities.'}
            </p>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0, scale: 0.95 }} 
                animate={{ opacity: 1, height: 'auto', scale: 1 }} 
                exit={{ opacity: 0, height: 0 }}
                className="bg-red-500/10 border border-red-500/30 p-4 rounded-xl flex items-center gap-3 mb-8"
              >
                <div className="h-8 w-8 bg-red-500/20 rounded-lg flex items-center justify-center shrink-0">
                  <AlertCircle size={18} className="text-red-400" />
                </div>
                <span className="text-red-300 font-medium">{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Info Section */}
            <div className="space-y-5">
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-2">
                <UserIcon size={16}/> Basic Information
              </h3>
              <div className="grid md:grid-cols-2 gap-5">
                <Input 
                  label="Full Name"
                  name="name"
                  type="text" 
                  placeholder={parsedRole === 'JobGiver' ? "e.g. John Doe (Owner)" : "e.g. John Doe"} 
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
              </div>
              <Input 
                label="Password" 
                name="password"
                type="password" 
                placeholder="••••••••" 
                icon={Lock} 
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            {/* Role Specific Section */}
            <div className="space-y-5">
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-2">
                {parsedRole === 'JobGiver' ? <Building size={16}/> : <Award size={16}/>} 
                {parsedRole === 'JobGiver' ? 'Business Details' : 'Professional Details'}
              </h3>
              
              {parsedRole === 'Worker' ? (
                <div className="grid md:grid-cols-2 gap-5">
                  <Input 
                    label="Qualification" 
                    name="qualification"
                    type="text" 
                    placeholder="e.g. High School, Plumber Cert" 
                    icon={Award} 
                    value={formData.qualification}
                    onChange={handleChange}
                  />
                  <Input 
                    label="Skills (Comma separated)" 
                    name="skills"
                    type="text" 
                    placeholder="e.g. Carpentry, React, Delivery" 
                    icon={Settings} 
                    value={formData.skills}
                    onChange={handleChange}
                  />
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-5">
                  <Input 
                    label="Business / Shop Name" 
                    name="businessName"
                    type="text" 
                    placeholder="e.g. Acme Plumbing Co." 
                    icon={Store} 
                    value={formData.businessName}
                    onChange={handleChange}
                  />
                  <Input 
                    label="Business Details / Address" 
                    name="businessDetails"
                    type="text" 
                    placeholder="e.g. Est. 2010, Downtown NY" 
                    icon={FileText} 
                    value={formData.businessDetails}
                    onChange={handleChange}
                  />
                </div>
              )}
            </div>

            {/* Document Upload Section */}
            <div className="space-y-5">
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-2">
                <FileText size={16}/> Verification Documents
              </h3>
              <div className="grid md:grid-cols-2 gap-5">
                <FileInput 
                  label="Government ID (PDF/Image)" 
                  accept=".pdf,image/*" 
                  onChange={(file) => handleFileChange('govtId', file)}
                  icon={FileText}
                />
                <FileInput 
                  label="Profile Picture (Image)" 
                  accept="image/*" 
                  onChange={(file) => handleFileChange('profilePic', file)}
                  icon={UserIcon}
                />
              </div>
            </div>
            
            <div className="pt-4 mt-8 border-t border-slate-800/50">
              <Button type="submit" className="w-full py-4 text-base tracking-wide" isLoading={isLoading}>
                Submit Registration
              </Button>
            </div>
          </form>

          <div className="mt-8 text-center text-sm text-slate-400 bg-slate-900/50 py-4 rounded-xl border border-slate-800">
            Already have an account? <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-semibold px-2 py-1 rounded-md hover:bg-indigo-500/10 transition-colors">Log in instead</Link>
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
