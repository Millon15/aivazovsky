import React from 'react';
import { Painting } from '../types';
import { ChatInterface } from './ChatInterface';

interface ArtworkModalProps {
  painting: Painting;
  onClose: () => void;
}

export const ArtworkModal: React.FC<ArtworkModalProps> = ({ painting, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 animate-in fade-in duration-500">
      {/* Backdrop with extreme blur */}
      <div 
        className="absolute inset-0 bg-slate-100/60 dark:bg-black/80 backdrop-blur-3xl transition-opacity duration-500" 
        onClick={onClose}
      />

      <button 
        onClick={onClose}
        className="absolute top-4 right-4 md:top-8 md:right-8 text-slate-500 dark:text-white/70 hover:text-slate-800 dark:hover:text-white z-50 p-3 rounded-full bg-white/40 dark:bg-white/10 hover:bg-white/60 dark:hover:bg-white/20 transition-all backdrop-blur-md border border-white/20 shadow-lg group"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transition-transform group-hover:rotate-90 duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <div className="relative z-10 bg-white/70 dark:bg-slate-900/70 w-full max-w-7xl h-[85vh] md:h-[90vh] rounded-[2rem] overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.25)] flex flex-col lg:flex-row ring-1 ring-white/40 dark:ring-white/10 backdrop-blur-3xl transform transition-all duration-500 scale-100">
        
        {/* Visual Section */}
        <div className="lg:w-2/3 relative h-[40%] lg:h-full bg-slate-100 dark:bg-slate-950 flex items-center justify-center overflow-hidden group">
           {/* Ambient Glow Background derived from image */}
           <div 
            className="absolute inset-0 bg-cover bg-center blur-[100px] opacity-60 dark:opacity-40 scale-150"
            style={{ backgroundImage: `url(${painting.imageUrl})` }}
           />
           
           <img 
             src={painting.imageUrl} 
             alt={painting.title} 
             className="relative max-w-[95%] max-h-[90%] object-contain shadow-[0_20px_50px_rgba(0,0,0,0.3)] rounded-lg z-10 transition-transform duration-700 group-hover:scale-[1.02]"
           />
           
           {/* Gradient Overlay for text readability */}
           <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent p-8 md:p-12 z-20 pointer-events-none">
              <h2 className="text-3xl md:text-5xl font-serif text-white mb-3 drop-shadow-lg">{painting.title}</h2>
              <div className="flex items-center gap-3">
                <span className="bg-white/20 backdrop-blur-md border border-white/20 text-white px-3 py-1 rounded-md text-xs font-bold tracking-wider uppercase">{painting.year}</span>
                <span className="text-blue-100 font-medium tracking-wide drop-shadow opacity-90 text-sm md:text-base border-l border-white/30 pl-3">{painting.location}</span>
              </div>
           </div>
        </div>

        {/* Info & Chat Section */}
        <div className="lg:w-1/3 flex flex-col h-[60%] lg:h-full bg-white/30 dark:bg-slate-900/30 border-l border-white/20 dark:border-white/5 backdrop-blur-md">
          
          {/* Details Scrollable */}
          <div className="p-6 md:p-8 overflow-y-auto flex-1 space-y-8 scrollbar-thin scrollbar-thumb-slate-300/50 dark:scrollbar-thumb-slate-700/50">
            <div>
              <h3 className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                <span className="w-8 h-[1px] bg-blue-600 dark:bg-blue-400"></span>
                About the Masterpiece
              </h3>
              <p className="text-slate-800 dark:text-slate-200 leading-relaxed text-base md:text-lg font-serif font-light">"{painting.description}"</p>
            </div>
            
            <div className="bg-amber-100/50 dark:bg-amber-900/10 p-5 rounded-2xl border border-amber-200/50 dark:border-amber-500/20 backdrop-blur-sm">
              <h3 className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-widest mb-2">Curator's Note</h3>
              <p className="text-amber-900/80 dark:text-amber-200/80 text-sm leading-relaxed italic font-serif">
                {painting.significance}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/40 dark:bg-slate-800/30 p-4 rounded-xl border border-white/30 dark:border-white/5 shadow-sm">
                <span className="block text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider mb-1">Dimensions</span>
                <span className="text-slate-800 dark:text-slate-200 text-sm font-medium">{painting.dimensions}</span>
              </div>
              <div className="bg-white/40 dark:bg-slate-800/30 p-4 rounded-xl border border-white/30 dark:border-white/5 shadow-sm">
                <span className="block text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider mb-1">Aesthetic Impact</span>
                <div className="flex items-end gap-1">
                   <span className="text-blue-600 dark:text-blue-400 text-2xl font-serif font-bold">{painting.aestheticScore}</span>
                   <span className="text-slate-400 text-xs mb-1 font-medium opacity-70">/100</span>
                </div>
              </div>
            </div>
          </div>

          {/* Chat Fixed at Bottom */}
          <div className="h-[45%] lg:h-[42%] border-t border-white/20 dark:border-white/5 bg-white/20 dark:bg-black/10 p-4 md:p-6 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.05)] backdrop-blur-lg">
            <ChatInterface painting={painting} />
          </div>
        </div>

      </div>
    </div>
  );
};