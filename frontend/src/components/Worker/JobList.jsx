import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, DollarSign, Clock, Filter, Briefcase } from 'lucide-react';
import Card from '../Ui/Card';
import Input from '../Ui/Input';
import Button from '../Ui/Button';

// Mock Data
const MOCK_JOBS = [
  { id: 1, title: 'Senior Frontend Developer', company: 'Acme Corp', location: 'Remote', salary: '$120k - $150k', type: 'Full-time', posted: '2h ago', tags: ['React', 'Tailwind', 'Vite'] },
  { id: 2, title: 'UX/UI Designer', company: 'Studio 11', location: 'New York, NY', salary: '$90k - $110k', type: 'Contract', posted: '5h ago', tags: ['Figma', 'Prototyping', 'User Research'] },
  { id: 3, title: 'Warehouse Associate', company: 'LogiTech', location: 'Chicago, IL', salary: '$20/hr', type: 'Hourly', posted: '1d ago', tags: ['Physical', 'Shift Work'] },
  { id: 4, title: 'Marketing Consultant', company: 'GrowthX', location: 'San Francisco, CA', salary: '$4k/project', type: 'Project', posted: '2d ago', tags: ['SEO', 'Content Strategy'] },
];

const JobList = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredJobs = MOCK_JOBS.filter(job => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    job.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="pt-24 pb-16 min-h-screen px-4 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-bold mb-2">Find Your Next Gig</h1>
          <p className="text-slate-400">Discover premium opportunities tailored to your skills.</p>
        </div>
        
        <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
          <Input 
            className="w-full sm:w-80" 
            placeholder="Search roles, companies..." 
            icon={Search}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button variant="secondary" className="px-4">
            <Filter size={18} /> Filters
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Sidebar filters could go here, for now it's responsive grid */}
        <div className="lg:col-span-3 grid md:grid-cols-2 gap-6">
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job, index) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card className="h-full flex flex-col hover:border-indigo-500/50 cursor-pointer group">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold group-hover:text-indigo-400 transition-colors">{job.title}</h3>
                      <div className="flex items-center gap-2 text-slate-400 text-sm mt-1">
                        <Briefcase size={14} /> {job.company}
                      </div>
                    </div>
                    <div className="bg-slate-800 text-xs px-2 py-1 rounded text-slate-300">
                      {job.posted}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm text-slate-300 mb-6">
                    <div className="flex items-center gap-1.5"><MapPin size={16} className="text-indigo-400" /> {job.location}</div>
                    <div className="flex items-center gap-1.5"><DollarSign size={16} className="text-green-400" /> {job.salary}</div>
                    <div className="flex items-center gap-1.5"><Clock size={16} className="text-orange-400" /> {job.type}</div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-6 mt-auto">
                    {job.tags.map(tag => (
                      <span key={tag} className="bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-xs px-2 py-1 rounded-md">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-3 mt-auto border-t border-slate-800 pt-4">
                    <Button className="flex-1">Apply Now</Button>
                    <Button variant="secondary" className="px-4">View Details</Button>
                  </div>
                </Card>
              </motion.div>
            ))
          ) : (
            <div className="col-span-2 py-12 text-center text-slate-400">
              <div className="bg-slate-800/50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-700">
                <Search size={24} className="text-slate-500" />
              </div>
              <p className="text-lg">No jobs found matching "{searchTerm}"</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobList;

