import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Card from '../Ui/Card';
import Input from '../Ui/Input';
import Button from '../Ui/Button';
import Toast from '../Ui/Toast';
import { Briefcase, MapPin, DollarSign, Calendar as CalendarIcon, Zap, CheckCircle2 } from 'lucide-react';

const PostJob = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [selectedTier, setSelectedTier] = useState('Standard');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    setTimeout(() => {
      setIsSubmitting(false);
      setToast({ show: true, message: 'Job posted successfully & funds locked!', type: 'success' });
      setTimeout(() => navigate('/giver/dashboard'), 2000);
    }, 1500);
  };

  const pricingTiers = [
    { name: 'Standard', desc: 'Active for 7 days', price: '₹20/job', icon: Briefcase },
    { name: 'Boosted', desc: 'Highlighted everywhere', price: '₹49/job', icon: Zap, highlight: true },
    { name: 'Unlimited', desc: 'Post up to 100 jobs', price: '₹149/mo', icon: CheckCircle2 }
  ];

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Create a Job Post</h1>
        <p className="text-slate-400">Reach thousands of premium workers instantly. Balances are held securely in escrow.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="p-6 md:p-8">
          <h2 className="text-xl font-bold mb-6">Job Details</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <Input label="Job Title" placeholder="e.g. Senior Frontend Engineer" icon={Briefcase} required />
            </div>
            
            <Input label="Location" placeholder="e.g. New York, NY or Remote" icon={MapPin} required />
            <Input label="Hourly Rate / Compensation" placeholder="e.g. ₹500/hr" icon={DollarSign} required />
            
            <div>
              <label className="text-sm font-medium text-slate-300 ml-1 mb-1 block">Job Date & Time (Schedule)</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                  <CalendarIcon size={18} />
                </div>
                <input 
                  type="datetime-local" 
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 pl-10 py-3 text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all custom-calendar-input" 
                  required 
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-300 ml-1 mb-1 block">Required Experience</label>
              <select className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all appearance-none cursor-pointer">
                <option>Entry Level</option>
                <option>Intermediate</option>
                <option>Expert</option>
              </select>
            </div>
          </div>

          <div className="mt-6">
            <label className="text-sm font-medium text-slate-300 ml-1 mb-1 block">Job Description</label>
            <textarea 
              className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all h-32 resize-none"
              placeholder="Describe the responsibilities, requirements, and benefits..."
              required
            ></textarea>
          </div>
        </Card>

        {/* Pricing Tiers */}
        <Card className="p-6 md:p-8">
          <h2 className="text-xl font-bold mb-6">Select Visibility Package</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {pricingTiers.map(tier => (
              <div 
                key={tier.name}
                onClick={() => setSelectedTier(tier.name)}
                className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 relative ${
                  selectedTier === tier.name 
                    ? tier.highlight ? 'border-indigo-500 bg-indigo-500/10' : 'border-emerald-500 bg-emerald-500/10'
                    : 'border-slate-800 bg-slate-900/50 hover:border-slate-700'
                }`}
              >
                {tier.highlight && selectedTier === tier.name && (
                  <div className="absolute top-0 right-0 px-3 py-1 bg-indigo-500 text-white text-xs font-bold rounded-bl-lg rounded-tr-lg">
                    RECOMMENDED
                  </div>
                )}
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${
                  selectedTier === tier.name 
                    ? tier.highlight ? 'bg-indigo-500/20 text-indigo-400' : 'bg-emerald-500/20 text-emerald-400'
                    : 'bg-slate-800 text-slate-400'
                }`}>
                  <tier.icon size={24} />
                </div>
                <h3 className="font-bold text-lg mb-1">{tier.name}</h3>
                <p className="text-sm text-slate-400 mb-4 h-10">{tier.desc}</p>
                <p className="text-2xl font-bold">{tier.price}</p>
              </div>
            ))}
          </div>
        </Card>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="ghost" onClick={() => navigate('/giver/dashboard')}>Cancel</Button>
          <Button type="submit" isLoading={isSubmitting} className="px-8 shadow-indigo-500/20">
            Secure Payment & Publish Job
          </Button>
        </div>
      </form>

      <Toast 
        message={toast.message} 
        isVisible={toast.show} 
        type={toast.type} 
        onClose={() => setToast({ ...toast, show: false })} 
      />
    </div>
  );
};

export default PostJob;
