import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Sparkles, ShoppingBag, ArrowRight, Check, Film, Maximize } from 'lucide-react';
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

  // Featured outfits from the video
  const emeraldGownProduct: Product = {
    id: 'video-outfit-1',
    title: 'Gull-e-Emerald Royal Couture Gown',
    description: 'As featured in the Mujtaba Designer video. Deep emerald green silk shirt enriched with antique gold hand zardozi motifs on neckline and sleeves.',
    price: 195000,
    salePrice: 175000,
    category: 'Couture',
    collection: 'Pure Luxury Video Edition',
    images: [showcasePoster],
    sizes: ['S', 'M', 'L', 'Custom Stitching'],
    inStock: true,
    isFeatured: true,
    createdAt: new Date().toISOString(),
  };

  const velvetVelourProduct: Product = {
    id: 'video-outfit-2',
    title: 'Noor-e-Jehan Crimson Velvet Ensemble',
    description: 'As featured in the Mujtaba Designer video. Regal crimson velvet embellished with gold threadwork, cutdana, and scalloped organza dupatta.',
    price: 210000,
    salePrice: 195000,
    category: 'Couture',
    collection: 'Pure Luxury Video Edition',
    images: [showcasePoster],
    sizes: ['XS', 'S', 'M', 'L', 'Custom Stitching'],
    inStock: true,
    isFeatured: true,
    createdAt: new Date().toISOString(),
  };

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

          {/* Bottom Video Caption & Quick Shop Banner Overlay */}
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-white via-white/80 to-transparent p-6 sm:p-10 flex flex-col md:flex-row items-start md:items-end justify-between gap-6 z-20">
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

            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <button
                onClick={() => onQuickView(emeraldGownProduct)}
                className="flex-1 md:flex-none px-6 py-3.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs sm:text-sm tracking-[0.2em] uppercase rounded-xl transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>SHOP EMERALD GOWN</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onQuickView(velvetVelourProduct)}
                className="flex-1 md:flex-none px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-white border border-stone-300 font-bold text-xs sm:text-sm tracking-[0.2em] uppercase rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg"
              >
                <span>SHOP VELVET ENSEMBLE</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Video Outfits Featured Cards Grid below video */}
        <div className="mt-12 sm:mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card 1: Emerald Gown */}
          <div className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-full sm:w-48 h-64 sm:h-56 rounded-xl overflow-hidden relative flex-shrink-0 border border-stone-200">
              <img
                src={showcasePoster}
                alt="Emerald Green Embroidered Couture Gown"
                loading="lazy"
                className="w-full h-full object-cover object-top"
              />
              <span className="absolute top-3 left-3 bg-slate-950 text-white text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-md">
                AS SEEN IN VIDEO
              </span>
            </div>
            <div className="flex-1 flex flex-col justify-between h-full">
              <div>
                <span className="text-[11px] font-bold tracking-[0.25em] text-amber-800 uppercase">
                  BRIDAL & FORMAL COUTURE
                </span>
                <h4 className="font-serif text-xl sm:text-2xl font-bold text-slate-950 mt-1">
                  Gull-e-Emerald Couture Gown
                </h4>
                <p className="text-stone-600 text-xs sm:text-sm leading-relaxed mt-2">
                  Hand-embroidered gold zardozi motifs on pure emerald silk. Custom stitching & fitting available.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-stone-200 flex items-center justify-between">
                <div>
                  <span className="text-amber-800 font-bold text-lg sm:text-xl font-sans">
                    Rs. 175,000
                  </span>
                  <span className="text-stone-400 text-xs line-through ml-2">
                    Rs. 195,000
                  </span>
                </div>
                <button
                  onClick={() => {
                    onAddToCart(emeraldGownProduct, 'M');
                    setAddedEmerald(true);
                    setTimeout(() => setAddedEmerald(false), 1500);
                  }}
                  className={`px-4 py-2.5 text-xs font-bold tracking-wider uppercase rounded-lg flex items-center gap-2 transition-all cursor-pointer ${
                    addedEmerald ? 'bg-emerald-600 text-white' : 'bg-amber-800 hover:bg-amber-900 text-white shadow-md'
                  }`}
                >
                  {addedEmerald ? (
                    <>
                      <Check className="w-4 h-4" /> Added
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" /> Add to Bag
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Card 2: Velvet Ensemble */}
          <div className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-full sm:w-48 h-64 sm:h-56 rounded-xl overflow-hidden relative flex-shrink-0 border border-stone-200">
              <img
                src={showcasePoster}
                alt="Noor-e-Jehan Crimson Velvet Ensemble"
                className="w-full h-full object-cover object-bottom"
              />
              <span className="absolute top-3 left-3 bg-slate-950 text-white text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-md border border-slate-700/30">
                AS SEEN IN VIDEO
              </span>
            </div>
            <div className="flex-1 flex flex-col justify-between h-full">
              <div>
                <span className="text-[11px] font-bold tracking-[0.25em] text-amber-800 uppercase">
                  VELVET EDITION 2026
                </span>
                <h4 className="font-serif text-xl sm:text-2xl font-bold text-slate-950 mt-1">
                  Noor-e-Jehan Velvet Ensemble
                </h4>
                <p className="text-stone-600 text-xs sm:text-sm leading-relaxed mt-2">
                  Regal crimson velvet shirt with gold threadwork, cutdana, and scalloped organza dupatta.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-stone-200 flex items-center justify-between">
                <div>
                  <span className="text-amber-800 font-bold text-lg sm:text-xl font-sans">
                    Rs. 195,000
                  </span>
                  <span className="text-stone-400 text-xs line-through ml-2">
                    Rs. 210,000
                  </span>
                </div>
                <button
                  onClick={() => {
                    onAddToCart(velvetVelourProduct, 'S');
                    setAddedSuit(true);
                    setTimeout(() => setAddedSuit(false), 1500);
                  }}
                  className={`px-4 py-2.5 text-xs font-bold tracking-wider uppercase rounded-lg flex items-center gap-2 transition-all cursor-pointer ${
                    addedSuit ? 'bg-emerald-600 text-white' : 'bg-amber-800 hover:bg-amber-900 text-white shadow-md'
                  }`}
                >
                  {addedSuit ? (
                    <>
                      <Check className="w-4 h-4" /> Added
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" /> Add to Bag
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
