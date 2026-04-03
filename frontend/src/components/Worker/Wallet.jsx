import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Wallet as WalletIcon, ArrowDownRight, ArrowUpRight, CheckCircle } from 'lucide-react';
import Card from '../UI/Card';
import Button from '../UI/Button';
import Modal from '../UI/Modal';
import Toast from '../UI/Toast';
import { useAuth } from '../../Context/AuthContext';
import { fetchWalletTransactions } from '../../services/walletService.js';
import { formatTxDate } from '../../utils/formatTime.js';

const WorkerWallet = () => {
  const { user, refreshUser } = useAuth();
  const [isWithdrawOpen, setWithdrawOpen] = useState(false);
  const [withdrawStatus, setWithdrawStatus] = useState('idle');
  const [transactions, setTransactions] = useState([]);

  const loadTx = useCallback(async () => {
    try {
      const rows = await fetchWalletTransactions();
      setTransactions(rows || []);
    } catch {
      setTransactions([]);
    }
  }, []);

  useEffect(() => {
    loadTx();
    refreshUser();
  }, [loadTx, refreshUser]);

  const handleWithdraw = () => {
    setWithdrawStatus('processing');
    setTimeout(() => {
      setWithdrawStatus('complete');
      setTimeout(() => {
        setWithdrawOpen(false);
        setWithdrawStatus('idle');
      }, 2000);
    }, 2000);
  };

  const displayTx = transactions.slice(0, 8).map((tx) => ({
    id: tx.id,
    type: tx.type === 'credit' || tx.type === 'addition' ? 'credit' : 'debit',
    title: tx.description || 'Transaction',
    amount: `₹${Number(tx.amount).toFixed(0)}`,
    date: formatTxDate(tx.createdAt),
    status: tx.type === 'deduction' ? 'Completed' : 'Cleared',
  }));

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Earnings Wallet</h1>
      <p className="text-slate-400 mb-8">Manage your payments and withdraw instantly to your bank account.</p>

      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="bg-gradient-to-br from-indigo-900/40 to-slate-900 border-indigo-500/30 p-8 h-full flex flex-col justify-between">
            <div>
              <p className="text-indigo-300 font-medium mb-1 flex items-center gap-2"><WalletIcon size={18}/> Available to Withdraw</p>
              <h2 className="text-6xl font-bold mb-4 tracking-tight">₹{user?.walletBalance?.toLocaleString() || '0'}</h2>
            </div>
            <Button className="w-full sm:w-auto mt-4 px-8 py-4 text-lg" onClick={() => setWithdrawOpen(true)}>
              Withdraw Instantly
            </Button>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="space-y-4">
          <Card className="flex items-center justify-between p-6">
            <div>
              <p className="text-slate-400 text-sm">Total Lifetime Earnings</p>
              <p className="text-2xl font-bold text-slate-200">₹{user?.totalEarned?.toLocaleString() || '0'}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <ArrowDownRight size={24} />
            </div>
          </Card>
          <Card className="flex items-center justify-between p-6">
            <div>
              <p className="text-slate-400 text-sm">Pending Clearing</p>
              <p className="text-2xl font-bold text-slate-200">₹0</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-400">
              <ClockIcon size={24} />
            </div>
          </Card>
        </motion.div>
      </div>

      <h3 className="text-xl font-bold mb-4">Transaction History</h3>
      <Card className="p-0 overflow-hidden">
        <div className="divide-y divide-slate-800">
          {displayTx.length === 0 ? (
            <div className="p-6 text-slate-500 text-sm">No transactions yet.</div>
          ) : (
            displayTx.map(tx => (
              <div key={tx.id} className="p-5 flex items-center justify-between hover:bg-slate-800/20 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex flex-shrink-0 items-center justify-center ${tx.type === 'debit' ? 'bg-slate-800 text-slate-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                    {tx.type === 'debit' ? <ArrowUpRight size={20} /> : <ArrowDownRight size={20} />}
                  </div>
                  <div>
                    <p className="font-bold text-slate-200">{tx.title}</p>
                    <p className="text-xs text-slate-500 flex items-center gap-2">
                      {tx.date} <span className="w-1 h-1 bg-slate-600 rounded-full"></span>
                      <span className={tx.type === 'debit' ? "text-slate-400" : "text-emerald-500"}>{tx.status}</span>
                    </p>
                  </div>
                </div>
                <p className={`font-bold ${tx.type === 'debit' ? 'text-slate-300' : 'text-emerald-400'}`}>
                  {tx.type === 'debit' ? '-' : '+'}{tx.amount}
                </p>
              </div>
            ))
          )}
        </div>
      </Card>

      <Modal isOpen={isWithdrawOpen} onClose={() => withdrawStatus === 'idle' && setWithdrawOpen(false)} title="Withdraw Funds">
        {withdrawStatus === 'idle' ? (
          <div>
            <div className="bg-slate-900 border border-slate-700 p-4 rounded-xl mb-6">
              <p className="text-sm text-slate-400">Available to withdraw</p>
              <p className="text-3xl font-bold text-indigo-400">₹{user?.walletBalance}</p>
            </div>
            <p className="mb-4 text-sm">Funds will be instantly transferred to your linked bank account via IMPS.</p>
            <div className="flex items-center gap-3 p-3 border border-slate-700 rounded-lg bg-slate-800/50 mb-6">
              <div className="w-8 h-8 bg-slate-700 rounded flex items-center justify-center text-xs font-bold font-serif">HDFC</div>
              <div className="flex-1">
                <p className="text-sm font-bold">HDFC Bank Limited</p>
                <p className="text-xs text-slate-400">Account ending in 1234</p>
              </div>
            </div>
            <Button className="w-full" onClick={handleWithdraw}>Confirm Withdrawal</Button>
          </div>
        ) : withdrawStatus === 'processing' ? (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mb-4" />
            <p className="font-medium animate-pulse text-indigo-400">Processing Transfer securely...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-400 mb-4 scale-in-center">
              <CheckCircle size={40} />
            </div>
            <h3 className="text-2xl font-bold text-emerald-400 mb-2">Success!</h3>
            <p className="text-slate-300">₹{user?.walletBalance} has been sent to your bank.</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

const ClockIcon = ({size}) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;

export default WorkerWallet;
