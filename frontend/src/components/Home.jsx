import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Button from '../Ui/Button';
import { ArrowRight, Briefcase, Zap, ShieldCheck } from 'lucide-react';
import Card from '../Ui/Card';

const Home = () => {
  return (
    <div className="pt-24 min-h-screen pb-16">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 pt-16 pb-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 border border-slate-800 text-indigo-400 text-sm font-medium mb-8"
        >
          <Zap size={14} className="fill-indigo-500" /> Voted #1 Job Platform in 2026
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold tracking-tight mb-6"
        >
          Find Work. <br className="md:hidden" /> Get Paid. <span className="text-gradient">Instantly.</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg text-slate-400 max-w-2xl mx-auto mb-10"
        >
          Join the most premium network of elite professionals and innovative companies. Hourly, daily, or full-time—GetWork connects you smoothly.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row justify-center items-center gap-4"
        >
          <Link to="/choose-path">
            <Button className="px-8 py-4 text-lg">
              Start Your Journey <ArrowRight size={18} />
            </Button>
          </Link>
          <Link to="/about">
            <Button variant="secondary" className="px-8 py-4 text-lg">
              Learn More
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* Features List */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { title: "Lightning Fast Matching", desc: "Our AI connects you with the right opportunities in under 24 hours.", icon: Zap },
            { title: "Premium Opportunities", desc: "Access verified startups and top-tier companies seeking elite talent.", icon: Briefcase },
            { title: "Secure Payments", desc: "Escrow-backed payments ensure you never miss a paycheck.", icon: ShieldCheck }
          ].map((feature, i) => (
            <Card key={i} delay={0.4 + (i * 0.1)}>
              <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center mb-6 border border-indigo-500/20">
                <feature.icon className="text-indigo-400 w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-slate-400">{feature.desc}</p>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
