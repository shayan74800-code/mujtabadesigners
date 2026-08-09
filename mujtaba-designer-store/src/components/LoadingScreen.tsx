import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import logoImg from '../assets/images/mujtaba_gold_logo_1786177848393.jpg';

interface LoadingScreenProps {
  onComplete: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 400);
          return 100;
        }
        return prev + 2;
      });
    }, 22);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { duration: 0.8, ease: 'easeInOut' } }}
        className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/90 backdrop-blur-2xl text-slate-900 select-none"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center px-6 max-w-sm bg-white/60 backdrop-blur-xl p-10 rounded-2xl border border-white/50 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.12)]"
        >
          {/* Logo Badge */}
          <div className="w-24 h-24 mx-auto mb-5 border border-amber-300/40 rounded-full flex items-center justify-center bg-white p-1 shadow-md relative overflow-hidden group">
            <img
              src={logoImg}
              alt="Mujtaba Designer Logo"
              loading="lazy"
              className="w-full h-full object-cover rounded-full"
            />
            <div className="absolute inset-0 rounded-full border border-amber-500/30 animate-ping opacity-20" />
          </div>

          <h1 className="font-serif text-2xl md:text-3xl font-bold tracking-[0.3em] uppercase text-slate-950">
            MUJTABA
          </h1>
          <p className="text-[10px] uppercase tracking-[0.4em] text-amber-800 font-semibold mt-1">
            HAUTE COUTURE • ISLAMABAD & LAHORE
          </p>

          {/* Progress Bar */}
          <div className="w-full h-[3px] bg-gray-100 mx-auto mt-7 relative overflow-hidden rounded-full">
            <motion.div
              className="absolute left-0 top-0 bottom-0 bg-slate-950"
              style={{ width: `${progress}%` }}
            />
          </div>

          <p className="text-[9px] tracking-[0.3em] text-slate-400 mt-3 font-semibold uppercase">
            {progress}% PREPARING BOUTIQUE
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
