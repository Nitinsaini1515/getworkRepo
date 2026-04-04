import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Star, User } from 'lucide-react';
import Card from '../UI/Card';
import Input from '../UI/Input';
import Button from '../UI/Button';
import Modal from '../UI/Modal';
import { fetchNearbyWorkers } from '../../services/workersService.js';

const WorkerMap = () => {
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [workers, setWorkers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [center, setCenter] = useState({ lat: 28.7041, lng: 77.1025 });

  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCenter({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      },
      () => {
        /* keep default */
      }
    );
  }, []);

  const load = useCallback(async () => {
    try {
      const list = await fetchNearbyWorkers(center.lat, center.lng);
      setWorkers(
        (list || []).map((w, i) => ({
          id: `${w.name}-${i}`,
          name: w.name,
          lat: w.lat,
          lng: w.lng,
          skills: w.skills || 'Available',
          rating: (4.5 + (i % 5) * 0.1).toFixed(1),
          jobs: 12 + i,
          distance: `${(0.4 + i * 0.15).toFixed(1)} km`,
          isAvailable: w.isAvailable !== false,
        }))
      );
    } catch {
      setWorkers([]);
    }
  }, [center.lat, center.lng]);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = workers.filter(
    (w) =>
      w.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (w.skills || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 md:p-8 h-[calc(100vh-4rem)] flex flex-col">
      <div className="mb-4 flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Nearby Workers</h1>
          <p className="text-slate-400">Discover and hire local talent instantly.</p>
        </div>
        <div className="w-full md:w-72">
          <Input
            placeholder="Search skills or names..."
            icon={Search}
            className="w-full max-w-[500px]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Card className="flex-1 p-0 relative overflow-hidden bg-slate-900 border-slate-700">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at center, #6366f1 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

        {filtered.map((worker, i) => (
          <motion.button
            key={worker.id}
            type="button"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: i * 0.2 + 0.5, type: 'spring' }}
            onClick={() => setSelectedWorker(worker)}
            className="absolute flex items-center justify-center cursor-pointer group"
            style={{
              top: `${20 + (i % 5) * 12}%`,
              left: `${30 + (i % 4) * 15}%`
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

        <div className="absolute bottom-6 right-6 flex flex-col gap-2">
          <Button variant="secondary" className="w-12 h-12 !p-0 flex items-center justify-center rounded-full shadow-lg" type="button">+</Button>
          <Button variant="secondary" className="w-12 h-12 !p-0 flex items-center justify-center rounded-full shadow-lg" type="button">-</Button>
          <Button className="w-12 h-12 !p-0 flex items-center justify-center rounded-full shadow-lg shadow-indigo-500/30 mt-2" type="button">
            <MapPin size={20} />
          </Button>
        </div>
      </Card>

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

            <Button className="w-full" type="button">Direct message</Button>
            <Button variant="secondary" className="w-full" type="button">Invite to apply</Button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default WorkerMap;
