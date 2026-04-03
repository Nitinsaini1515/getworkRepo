import React, { useState } from 'react';
import { UploadCloud, CheckCircle } from 'lucide-react';

const FileInput = ({ label, onChange, accept, icon: Icon = UploadCloud }) => {
  const [fileName, setFileName] = useState('');

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
      if (onChange) onChange(e.target.files[0]);
    }
  };

  return (
    <div className="flex flex-col gap-1.5 focus-within:text-indigo-400">
      <label className="text-sm font-medium text-slate-400 ml-1 transition-colors">{label}</label>
      <div className={`relative group flex items-center gap-3 p-3 rounded-xl bg-slate-900/50 border transition-all duration-300 ${fileName ? 'border-indigo-500/50 shadow-sm shadow-indigo-500/10' : 'border-slate-800 hover:border-slate-700'}`}>
        <input 
          type="file" 
          onChange={handleFileChange}
          accept={accept}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        />
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-slate-800 transition-colors ${fileName ? 'bg-indigo-500/20 text-indigo-400' : 'text-slate-400 group-hover:text-indigo-400 group-hover:bg-slate-800/80'}`}>
          {fileName ? <CheckCircle className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
        </div>
        <div className="flex flex-col flex-1 overflow-hidden">
          <span className={`text-sm tracking-wide ${fileName ? 'text-slate-200' : 'text-slate-400'} truncate`}>
            {fileName || `Click to upload ${label}`}
          </span>
          <span className="text-xs text-slate-500 mt-0.5">Max size 5MB</span>
        </div>
      </div>
    </div>
  );
};

export default FileInput;
