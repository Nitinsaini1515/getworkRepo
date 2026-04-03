import React from 'react';
import { motion } from 'framer-motion';

const Input = React.forwardRef(({ label, error, icon: Icon, className = '', ...props }, ref) => {
  return (
    <div className={`w-full flex flex-col gap-1.5 ${className}`}>
      {label && <label className="text-sm font-medium text-slate-300 ml-1">{label}</label>}
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
            <Icon size={18} />
          </div>
        )}
        <motion.input
          ref={ref}
          initial={false}
          animate={error ? { x: [-5, 5, -5, 0] } : {}}
          transition={{ duration: 0.3 }}
          className={`w-full bg-slate-900/50 border ${error ? 'border-red-500' : 'border-slate-700'} rounded-xl px-4 py-3 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all ${Icon ? 'pl-10' : ''}`}
          {...props}
        />
      </div>
      {error && <span className="text-xs text-red-500 ml-1 mt-1">{error}</span>}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
