import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Star, User } from 'lucide-react';
import Card from '../UI/Card';
import Input from '../UI/Input';
import Button from '../UI/Button';
// import Modal from /Ui/Modal';
// import Modal  from '../Ui/Modal';
import Modal from '../UI/Modal';
const MOCK_WORKERS = [
  { id: 1, name: 'Alex M.', skills: 'Plumbing, Electric', rating: 4.9, jobs: 120, lat: 40.7128, lng: -74.0060, distance: '0.8 miles' },
  { id: 2, name: 'Sarah J.', skills: 'React, Node', rating: 5.0, jobs: 45, lat: 40.7200, lng: -74.0100, distance: '1.2 miles' },
  { id: 3, name: 'David K.', skills: 'Delivery, Moving', rating: 4.7, jobs: 89, lat: 40.7150, lng: -73.9900, distance: '2.5 miles' },
];

const WorkerMap = () => {
  const [selectedWorker, setSelectedWorker] = useState(null);

  return (
    <div className="p-4 md:p-8 h-[calc(100vh-4rem)] flex flex-col">
      <div className="mb-4 flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Nearby Workers</h1>
          <p className="text-slate-400">Discover and hire local talent instantly.</p>
        </div>
        <div className="w-full md:w-72">
          <Input placeholder="Search skills or names..." icon={Search} className="w-full max-w-[500px]" />
        </div>
      </div>

      {/* Mock Map Container */}
      <Card className="flex-1 p-0 relative overflow-hidden bg-slate-900 border-slate-700">
        {/* Fake Map Background Texture */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at center, #6366f1 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
        
        {/* Interactive Mock Map Elements */}
        {MOCK_WORKERS.map((worker, i) => (
          <motion.button
            key={worker.id}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: i * 0.2 + 0.5, type: "spring" }}
            onClick={() => setSelectedWorker(worker)}
            className="absolute flex items-center justify-center cursor-pointer group"
            style={{
              top: `${20 + (i * 25)}%`,
              left: `${30 + (i * 20)}%`
            }}
          >
            <div className="w-12 h-12 bg-indigo-500/20 rounded-full flex items-center justify-center animate-pulse absolute" />
            <div className="w-8 h-8 bg-indigo-500 rounded-full border-2 border-slate-900 flex items-center justify-center text-white shadow-lg shadow-indigo-500/50 z-10">
              <User size={16} />
            </div>
            
            <div className="absolute top-10 whitespace-nowrap bg-slate-800 border border-slate-700 text-slate-200 text-xs px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none">
              {worker.name} • {worker.rating}★
            </div>
          </motion.button>
        ))}

        {/* Floating Controls */}
        <div className="absolute bottom-6 right-6 flex flex-col gap-2">
          <Button variant="secondary" className="w-12 h-12 !p-0 flex items-center justify-center rounded-full shadow-lg">+</Button>
          <Button variant="secondary" className="w-12 h-12 !p-0 flex items-center justify-center rounded-full shadow-lg">-</Button>
          <Button className="w-12 h-12 !p-0 flex items-center justify-center rounded-full shadow-lg shadow-indigo-500/30 mt-2">
            <MapPin size={20} />
          </Button>
        </div>
      </Card>

      {/* Selected Worker Info Panel */}
      <Modal isOpen={!!selectedWorker} onClose={() => setSelectedWorker(null)} title="Worker Profile">
        {selectedWorker && (
          <div className="space-y-4">
            <div className="flex items-center gap-4 border-b border-slate-800 pb-4">
              <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center border-2 border-indigo-500 text-indigo-400">
                <User size={32} />
              </div>
              <div>
                <h3 className="text-xl font-bold">{selectedWorker.name}</h3>
                <div className="text-sm text-slate-400">{selectedWorker.skills}</div>
                <div className="flex items-center gap-3 mt-1">
                  <div className="flex items-center text-yellow-400 text-sm">
                    <Star size={14} className="fill-yellow-400 mr-1" /> {selectedWorker.rating}
                  </div>
                  <div className="text-sm text-slate-400">({selectedWorker.jobs} jobs)</div>
                </div>
              </div>
            </div>
            
            <div className="py-2">
              <p className="text-sm text-slate-400 mb-1">Distance</p>
              <p className="font-medium">{selectedWorker.distance} away</p>
            </div>

            <Button className="w-full">Direct message</Button>
            <Button variant="secondary" className="w-full">Invite to apply</Button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default WorkerMap;
