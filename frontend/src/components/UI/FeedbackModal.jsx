import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, MessageSquare, X, CheckCircle } from 'lucide-react';
import Button from './Button';

const FeedbackModal = ({ isOpen, onClose, targetName = "Client/Worker", onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) return;

    try {
      if (onSubmit) await onSubmit({ rating, comment });
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setRating(0);
        setComment('');
        onClose();
      }, 2000);
    } catch {
      /* keep modal open; parent may show toast */
    }
  };

  if (!isOpen && (!submitted && !isOpen)) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-slate-900 border border-slate-700/50 rounded-2xl shadow-2xl max-w-md w-full p-6 relative overflow-hidden"
          >
            {/* Top decorative gradient */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

            {!submitted ? (
              <>
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-1">Rate Experience</h2>
                    <p className="text-slate-400 text-sm">How was your experience working with <span className="font-semibold text-slate-300">{targetName}</span>?</p>
                  </div>
                  <button onClick={onClose} className="text-slate-500 hover:text-white hover:bg-slate-800 p-1 rounded-lg transition-colors outline-none">
                    <X size={20} />
                  </button>
                </div>

                <form onSubmit={handleSubmit}>
                  {/* Star Rating */}
                  <div className="flex justify-center gap-2 mb-8 mt-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <motion.button
                        type="button"
                        key={star}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setRating(star)}
                        className={`p-2 transition-colors outline-none ${
                        (hoverRating || rating) >= star ? 'text-yellow-400' : 'text-slate-700'
                        }`}
                      >
                        <Star 
                          size={40} 
                          fill={(hoverRating || rating) >= star ? "currentColor" : "none"} 
                          strokeWidth={1.5} 
                        />
                      </motion.button>
                    ))}
                  </div>

                  {/* Comment */}
                  <div className="mb-6 relative">
                    <label className="block text-sm font-medium text-slate-400 mb-2">Leave a review (optional)</label>
                    <div className="relative">
                      <MessageSquare className="absolute top-3 left-3 text-slate-500" size={18} />
                      <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Write your feedback..."
                        rows={3}
                        className="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all resize-none"
                      />
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={rating === 0}
                  >
                    Submit Review
                  </Button>
                </form>
              </>
            ) : (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-8 text-center"
              >
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", damping: 15 }}
                  className="w-20 h-20 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <CheckCircle size={40} />
                </motion.div>
                <h3 className="text-xl font-bold text-white mb-2">Thank You!</h3>
                <p className="text-slate-400">Your feedback has been submitted successfully.</p>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FeedbackModal;
