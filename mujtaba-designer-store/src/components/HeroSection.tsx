import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, VolumeX, Volume2, ArrowRight, Sparkles, MapPin, Sliders, Film, Maximize } from 'lucide-react';
import { motion } from 'motion/react';
import logoImg from '../assets/images/mujtaba_new_logo_1786264765562.jpg';
import videoHeroPosterDefault from '../assets/images/mujtaba_video_hero_1786177863771.jpg';
import { VideoSettings } from '../types';

interface HeroSectionProps {
  onExploreClick: (category?: string) => void;
  onOpenLocation: () => void;
  videoSettings?: VideoSettings | null;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onExploreClick, onOpenLocation, videoSettings }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [overlayOpacity, setOverlayOpacity] = useState(0.1);
  const videoRef = useRef<HTMLVideoElement>(null);

  const heroVideoSrc = videoSettings?.heroVideoUrl || "https://assets.mixkit.co/videos/preview/mixkit-fashion-model-in-a-white-dress-walking-41443-large.mp4";
  const heroPoster = videoSettings?.heroPosterUrl || videoHeroPosterDefault;

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch(() => {
        // Autoplay policy fallback
      });
      setIsPlaying(true);
    }
  }, [heroVideoSrc]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = () => {
    if (videoRef.current && videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    }
  };

  return (
    <section className="relative w-full h-[88vh] min-h-[600px] max-h-[920px] overflow-hidden bg-[#fcfbf9] text-slate-900 flex items-center justify-center">
      {/* Background Video Loop with High Res Image Fallback */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted={isMuted}
        playsInline
        preload="metadata"
        poster={heroPoster}
        className="absolute inset-0 w-full h-full object-cover object-center scale-105 filter brightness-105 transition-all"
      >
        <source
          src={heroVideoSrc}
          type="video/mp4"
        />
        {/* Fallback image */}
        <img
          src={heroPoster}
          alt="Mujtaba Designer Video Background"
          loading="lazy"
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      </video>

      {/* Light Glass Overlay */}
      <div
        className="absolute inset-0 bg-white transition-opacity duration-300"
        style={{ opacity: overlayOpacity }}
      />

      {/* Video Controls Overlay Bar */}
      <div className="absolute top-6 right-6 z-20 flex items-center gap-3 bg-white/90 backdrop-blur-md px-5 py-2.5 rounded-full border border-stone-200 text-xs sm:text-sm text-slate-800 shadow-lg">
        <button
          onClick={togglePlay}
          className="hover:text-amber-800 transition-colors p-1 cursor-pointer"
          title={isPlaying ? 'Pause Background Video' : 'Play Video'}
        >
          {isPlaying ? <Pause className="w-4 h-4 text-amber-800" /> : <Play className="w-4 h-4 text-amber-800" />}
        </button>
        <div className="w-[1px] h-4 bg-stone-300" />
        <button
          onClick={toggleMute}
          className="hover:text-amber-800 transition-colors p-1 cursor-pointer"
          title={isMuted ? 'Unmute Audio' : 'Mute Video'}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
        <div className="w-[1px] h-4 bg-stone-300" />
        <button
          onClick={toggleFullscreen}
          className="hover:text-amber-800 transition-colors p-1 cursor-pointer"
          title="Fullscreen Video"
        >
          <Maximize className="w-4 h-4" />
        </button>
        <div className="hidden sm:block w-[1px] h-4 bg-stone-300" />
        <div className="hidden sm:flex items-center gap-2 px-1">
          <Sliders className="w-3.5 h-3.5 text-amber-800" />
          <input
            type="range"
            min="0.0"
            max="0.6"
            step="0.05"
            value={overlayOpacity}
            onChange={(e) => setOverlayOpacity(parseFloat(e.target.value))}
            className="w-16 h-1.5 bg-stone-300 rounded-lg appearance-none cursor-pointer accent-amber-800"
            title="Adjust Background Brightness"
          />
        </div>
      </div>

      {/* Currently Viewing Badge (Bottom Right) */}
      <div className="hidden sm:flex absolute bottom-10 right-10 z-20 bg-white/95 backdrop-blur-xl p-4 px-6 border border-amber-300/80 shadow-2xl flex-col gap-1 rounded-2xl text-slate-900 max-w-xs">
        <span className="text-[10px] tracking-[0.3em] text-amber-800 uppercase font-extrabold flex items-center gap-1.5">
          <Film className="w-3.5 h-3.5 text-amber-800 animate-pulse" /> MUJTABA DESIGNER SHOWCASE
        </span>
        <span className="text-sm font-serif-luxury font-bold tracking-wide text-slate-950">
          Luxury Lawn & Unstitched Suits '26
        </span>
        <span className="text-[10px] text-stone-600 uppercase tracking-widest mt-0.5">
          "Unrivalled Elegance & Craftsmanship"
        </span>
      </div>

      {/* Hero Content Overlay */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center flex flex-col items-center">
        {/* Brand Crest Logo Circle */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.7 }}
          className="w-28 h-28 sm:w-36 sm:h-36 mb-6 rounded-full border-2 border-amber-500/80 p-2 bg-white shadow-2xl overflow-hidden group hover:scale-105 transition-transform"
        >
          <img
            src={logoImg}
            alt="Mujtaba Designer Gold Logo"
            className="w-full h-full object-cover rounded-full"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/90 border border-amber-400 text-amber-900 text-xs sm:text-sm font-extrabold tracking-[0.35em] uppercase mb-5 shadow-lg backdrop-blur-md"
        >
          <Sparkles className="w-4 h-4 text-amber-800" />
          100% ORIGINAL LAWN & LUXURY FABRICS 2026
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4 }}
          className="flex flex-col items-center gap-3 bg-white/80 backdrop-blur-md px-8 py-6 rounded-3xl border border-amber-200/80 shadow-2xl"
        >
          <motion.h1 className="font-ethnocentric text-3xl sm:text-5xl md:text-6xl font-black tracking-[0.15em] uppercase leading-none text-slate-950">
            MUJTABA DESIGNER
          </motion.h1>
          <p className="text-xs sm:text-sm md:text-base uppercase tracking-[0.55em] text-amber-900 font-extrabold">
            LUXURY FABRICS & UNSTITCHED LAWN
          </p>

          <p className="max-w-2xl text-slate-800 text-xs sm:text-sm md:text-base font-medium tracking-wide leading-relaxed mt-2">
            Discover Pakistan's finest unstitched Egyptian lawn, velvet ensembles, chiffon embroideries, and royal bridal couture.
          </p>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-8"
        >
          <button
            onClick={() => onExploreClick('UNSTITCHED LAWN')}
            className="px-9 py-4 sm:py-4.5 bg-amber-800 hover:bg-amber-900 text-white font-extrabold text-xs sm:text-sm tracking-[0.3em] uppercase transition-all shadow-xl hover:scale-105 flex items-center gap-3 group cursor-pointer rounded-xl border border-amber-600"
          >
            SHOP LAWN '26
            <ArrowRight className="w-5 h-5 text-amber-200 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={() => onExploreClick('FESTIVE PRET')}
            className="px-8 py-4 sm:py-4.5 bg-white hover:bg-stone-50 text-slate-950 border border-amber-400 font-extrabold text-xs sm:text-sm tracking-[0.3em] uppercase rounded-xl transition-all cursor-pointer shadow-lg hover:scale-105"
          >
            FESTIVE PRET
          </button>

          <button
            onClick={onOpenLocation}
            className="px-8 py-4 sm:py-4.5 bg-slate-950 hover:bg-slate-900 text-white font-bold text-xs sm:text-sm tracking-[0.25em] uppercase rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-xl hover:scale-105"
          >
            <MapPin className="w-4 h-4 text-amber-400" />
            STORE LOCATOR
          </button>
        </motion.div>
      </div>

      {/* Bottom Gradient Transition */}
      <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-[#fcfbf9] to-transparent z-10 pointer-events-none" />
    </section>
  );
};
