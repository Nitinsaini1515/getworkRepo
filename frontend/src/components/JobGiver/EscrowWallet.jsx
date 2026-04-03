import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Wallet, ArrowDownRight, ArrowUpRight, Plus, RefreshCw } from 'lucide-react';
// import Card from '../Ui/Card';
// import Button from '../Ui/Button';
// import Input from '../Ui/Input';
// import Modal from '../Ui/Modal';
// import Toast from '../Ui/Toast';
// import Card from '../Ui/Card';
import { useAuth } from '../../Context/AuthContext';

const EscrowWallet = () => {
  const { user } = useAuth();
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '' });

  const mockTransactions = [
    { id: 1, type: 'deduction', amount: 50.00, desc: 'Escrow Lock: Senior Frontend Job', date: 'Today, 2:30 PM' },
    { id: 2, type: 'addition', amount: 500.00, desc: 'Deposit via Credit Card', date: 'Yesterday, 10:15 AM' },
    { id: 3, type: 'deduction', amount: 120.00, desc: 'Payment Released to John Doe', date: '12 Oct, 4:00 PM' },
  ];

  const handleAddFunds = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setAddModalOpen(false);
      setToast({ show: true, message: `Successfully added ₹${amount} to escrow!` });
      setAmount('');
    }, 1500);
  };

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Escrow Wallet</h1>
        <p className="text-slate-400">Manage your protected balances and transactions securely.</p>
      </div>

      {/* Main Balance Card */}
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
        <Card className=" bg-indigo-600/10 from-indigo-900/40 to-slate-900 border-indigo-500/30 mb-8 p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl" />
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center relative z-10 gap-6">
            <div>
              <p className="text-indigo-300 font-medium mb-1">Available Escrow Balance</p>
              <h2 className="text-5xl font-bold mb-4 tracking-tight">₹{user?.walletBalance?.toLocaleString()}</h2>
              <div className="flex items-center gap-2 text-sm text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full w-fit">
                <ArrowUpRight size={16} /> 12% increase from last month
              </div>
            </div>
            
            <div className="flex gap-4">
              <Button onClick={() => setAddModalOpen(true)} className="px-6 py-3 shadow-indigo-500/20">
                <Plus size={20} /> Add Funds
              </Button>
              <Button variant="secondary" className="px-4">
                <RefreshCw size={20} />
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Transactions */}
      <h3 className="text-xl font-bold mb-4">Recent Escrow Activity</h3>
      <Card className="p-0 overflow-hidden">
        <div className="divide-y divide-slate-800">
          {mockTransactions.map((tx, i) => (
            <motion.div 
              key={tx.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-4 sm:p-6 flex items-center justify-between hover:bg-slate-800/30 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${tx.type === 'addition' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-orange-500/10 text-orange-400'}`}>
                  {tx.type === 'addition' ? <ArrowDownRight size={24} /> : <ArrowUpRight size={24} />}
                </div>
                <div>
                  <p className="font-semibold text-slate-200">{tx.desc}</p>
                  <p className="text-sm text-slate-500">{tx.date}</p>
                </div>
              </div>
              <div className={`font-bold text-lg ${tx.type === 'addition' ? 'text-emerald-400' : 'text-slate-300'}`}>
                {tx.type === 'addition' ? '+' : '-'}₹{tx.amount.toFixed(2)}
              </div>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Add Funds Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setAddModalOpen(false)} title="Add Funds to Escrow">
        <form onSubmit={handleAddFunds} className="space-y-6">
          <p className="text-sm text-slate-400">Funds added to escrow are securely held until you release them for completed jobs.</p>
          
          <Input 
            label="Amount (₹)" 
            type="number" 
            placeholder="e.g. 5000" 
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            autoFocus
          />

          <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-slate-400">Current Balance</span>
              <span>₹{user?.walletBalance}</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-indigo-400">
              <span>New Balance</span>
              <span>₹{(user?.walletBalance + (Number(amount) || 0)).toLocaleString()}</span>
            </div>
          </div>

          <Button type="submit" className="w-full" isLoading={isLoading}>
            Confirm Payment
          </Button>
        </form>
      </Modal>

      <Toast 
        isVisible={toast.show} 
        message={toast.message} 
        onClose={() => setToast({ show: false, message: '' })}
      />
    </div>
  );
};

export default EscrowWallet;
