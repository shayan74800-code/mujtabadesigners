import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Sparkles, Film, Maximize } from 'lucide-react';
import { motion } from 'motion/react';
import videoHeroPosterDefault from '../assets/images/mujtaba_video_hero_1786177863771.jpg';
import { Product, VideoSettings } from '../types';

interface VideoShowcaseSectionProps {
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product, size: string) => void;
  videoSettings?: VideoSettings | null;
}

export const VideoShowcaseSection: React.FC<VideoShowcaseSectionProps> = ({
  onQuickView,
  onAddToCart,
  videoSettings,
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [addedEmerald, setAddedEmerald] = useState(false);
  const [addedSuit, setAddedSuit] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const showcaseVideoSrc = videoSettings?.showcaseVideoUrl || "https://assets.mixkit.co/videos/preview/mixkit-fashion-model-in-a-white-dress-walking-41443-large.mp4";
  const showcasePoster = videoSettings?.showcasePosterUrl || videoHeroPosterDefault;
  const showcaseTitle = videoSettings?.showcaseTitle || "PURE LUXURY • DEFINE YOUR STYLE";
  const showcaseSubtitle = videoSettings?.showcaseSubtitle || "Watch the official Mujtaba Designer 2026 runway showcase featuring our signature emerald embroidered gown & gold-pinstripe bespoke suit.";

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  }, [showcaseVideoSrc]);

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
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  // Featured outfits removed — not displayed here anymore

  return (
    <section className="w-full bg-white text-slate-950 py-16 sm:py-24 border-y border-slate-200 relative overflow-hidden">
      {/* Background ambient blur */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-slate-100 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold tracking-[0.3em] uppercase mb-3">
            <Sparkles className="w-4 h-4 text-slate-700" />
            WOMEN'S LUXURY CINEMATIC FILM
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl font-light tracking-[0.2em] text-slate-950 uppercase leading-tight">
            {showcaseTitle}
          </h2>
          <p className="text-slate-600 text-sm sm:text-base md:text-lg font-light tracking-wide mt-4">
            {showcaseSubtitle}
          </p>
        </div>

        {/* Large Grand Video Player Container */}
        <div className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg border border-slate-200 bg-white group">
          <video
            ref={videoRef}
            autoPlay
            loop
            muted={isMuted}
            playsInline
            preload="metadata"
            poster={showcasePoster}
            className="w-full aspect-[16/9] md:aspect-[21/9] object-cover object-center filter brightness-100 transition-all duration-500"
          >
            <source
              src={showcaseVideoSrc}
              type="video/mp4"
            />
            <img
              src={showcasePoster}
              alt="Mujtaba Designer Video Frame"
              className="w-full h-full object-cover"
            />
          </video>

          {/* Video Overlay Top Badge */}
          <div className="absolute top-4 sm:top-6 left-4 sm:left-6 z-20 flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full border border-stone-200 text-xs sm:text-sm font-semibold tracking-[0.2em] text-slate-900 shadow-md">
              <Film className="w-4 h-4 text-slate-900 animate-pulse" />
              <span>MUJTABA DESIGNER • OFFICIAL FILM 2026</span>
            </div>
          </div>

          {/* Video Control Buttons Top Right */}
          <div className="absolute top-4 sm:top-6 right-4 sm:right-6 z-20 flex items-center gap-2 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full border border-slate-200 text-slate-900 shadow-md">
            <button
              onClick={togglePlay}
              className="hover:text-slate-900 p-1.5 transition-colors cursor-pointer"
              title={isPlaying ? 'Pause Film' : 'Play Film'}
            >
              {isPlaying ? <Pause className="w-5 h-5 text-slate-900" /> : <Play className="w-5 h-5 text-slate-900" />}
            </button>
            <div className="w-[1px] h-4 bg-white/20" />
            <button
              onClick={toggleMute}
              className="hover:text-slate-900 p-1.5 transition-colors cursor-pointer"
              title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            >
              {isMuted ? <VolumeX className="w-5 h-5 text-slate-900" /> : <Volume2 className="w-5 h-5 text-slate-900" />}
            </button>
            <div className="w-[1px] h-4 bg-white/20" />
            <button
              onClick={toggleFullscreen}
              className="hover:text-amber-300 p-1.5 transition-colors cursor-pointer"
              title="Fullscreen"
            >
              <Maximize className="w-5 h-5" />
            </button>
          </div>

          {/* Bottom caption overlay retained without quick-shop buttons */}
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-white via-white/80 to-transparent p-6 sm:p-10 z-20">
            <div className="max-w-xl">
              <span className="text-slate-900 text-xs font-semibold tracking-[0.3em] uppercase block mb-1">
                FEATURED IN VIDEO
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-slate-950 tracking-wide">
                Welcome to Pure Luxury
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm font-light mt-1">
                "Mujtaba Designer. Define your own style." Handcrafted with raw silk, intricate embroidery & couture tailoring.
              </p>
            </div>
          </div>
        </div>

        {/* Featured product cards removed */}
      </div>
    </section>
  );
};
