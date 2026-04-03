import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Wallet as WalletIcon, ArrowDownRight, ArrowUpRight, Plus, RefreshCw } from 'lucide-react';
import Card from '../UI/Card';
import Button from '../UI/Button';
import Input from '../UI/Input';
import Modal from '../UI/Modal';
import Toast from '../UI/Toast';
import { useAuth } from '../../Context/AuthContext';
import { fetchWalletTransactions, addWalletFunds } from '../../services/walletService.js';
import { formatTxDate } from '../../utils/formatTime.js';
import { getApiErrorMessage } from '../../utils/getApiErrorMessage.js';

const Wallet = () => {
  const { user, refreshUser } = useAuth();
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [transactions, setTransactions] = useState([]);

  const loadTx = useCallback(async () => {
    try {
      const rows = await fetchWalletTransactions();
      setTransactions(rows || []);
    } catch (e) {
      setTransactions([]);
    }
  }, []);

  useEffect(() => {
    loadTx();
  }, [loadTx, user?.walletBalance]);

  const handleAddFunds = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await addWalletFunds(Number(amount));
      await refreshUser();
      await loadTx();
      setAddModalOpen(false);
      setToast({ show: true, message: `Successfully added ₹${amount} to wallet!`, type: 'success' });
      setAmount('');
    } catch (err) {
      setToast({ show: true, message: getApiErrorMessage(err), type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const mappedTx = transactions.map((tx) => ({
    id: tx.id,
    type: tx.type === 'credit' || tx.type === 'addition' ? 'addition' : 'deduction',
    amount: tx.amount,
    desc: tx.description || 'Transaction',
    date: formatTxDate(tx.createdAt),
  }));

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Wallet</h1>
        <p className="text-slate-400">Manage your balances and transactions securely.</p>
      </div>

      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
        <Card className=" bg-indigo-600/10 from-indigo-900/40 to-slate-900 border-indigo-500/30 mb-8 p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl" />

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center relative z-10 gap-6">
            <div>
              <p className="text-indigo-300 font-medium mb-1">Available Balance</p>
              <h2 className="text-5xl font-bold mb-4 tracking-tight">₹{user?.walletBalance?.toLocaleString()}</h2>
              <div className="flex items-center gap-2 text-sm text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full w-fit">
                <ArrowUpRight size={16} /> Live balance from server
              </div>
            </div>

            <div className="flex gap-4">
              <Button onClick={() => setAddModalOpen(true)} className="px-6 py-3 shadow-indigo-500/20">
                <Plus size={20} /> Add Funds
              </Button>
              <Button variant="secondary" className="px-4" type="button" onClick={() => { refreshUser(); loadTx(); }}>
                <RefreshCw size={20} />
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>

      <h3 className="text-xl font-bold mb-4">Recent Wallet Activity</h3>
      <Card className="p-0 overflow-hidden">
        <div className="divide-y divide-slate-800">
          {mappedTx.length === 0 ? (
            <div className="p-6 text-slate-500 text-sm">No transactions yet.</div>
          ) : (
            mappedTx.map((tx, i) => (
              <motion.div
                key={tx.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
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
                  {tx.type === 'addition' ? '+' : '-'}₹{Number(tx.amount).toFixed(2)}
                </div>
              </motion.div>
            ))
          )}
        </div>
      </Card>

      <Modal isOpen={isAddModalOpen} onClose={() => setAddModalOpen(false)} title="Add Funds to Wallet">
        <form onSubmit={handleAddFunds} className="space-y-6">
          <p className="text-sm text-slate-400">Funds added to your wallet can be used for new jobs.</p>

          <Input
            label="Amount (₹)"
            type="number"
            placeholder="e.g. 5000"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            autoFocus
            min="1"
            step="1"
          />

          <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-slate-400">Current Balance</span>
              <span>₹{user?.walletBalance}</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-indigo-400">
              <span>New Balance</span>
              <span>₹{(Number(user?.walletBalance || 0) + (Number(amount) || 0)).toLocaleString()}</span>
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
        type={toast.type === 'error' ? 'error' : 'success'}
        onClose={() => setToast({ show: false, message: '', type: 'success' })}
      />
    </div>
  );
};

export default Wallet;
