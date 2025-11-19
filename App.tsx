import React, { useEffect, useState } from 'react';
import { fetchPaintings } from './services/geminiService';
import { Painting, LoadingState } from './types';
import { Loader } from './components/Loader';
import { Timeline } from './components/Timeline';
import { ArtworkModal } from './components/ArtworkModal';

const App: React.FC = () => {
  const [paintings, setPaintings] = useState<Painting[]>([]);
  const [status, setStatus] = useState<LoadingState>(LoadingState.IDLE);
  const [selectedPainting, setSelectedPainting] = useState<Painting | null>(null);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const init = async () => {
      setStatus(LoadingState.LOADING);
      try {
        const data = await fetchPaintings();
        setPaintings(data);
        setStatus(LoadingState.SUCCESS);
      } catch (e) {
        console.error(e);
        setStatus(LoadingState.ERROR);
      }
    };
    init();
  }, []);

  // Toggle Dark Mode Class
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950/40 text-slate-800 dark:text-slate-200 pb-20 selection:bg-blue-200 selection:text-blue-900 dark:selection:bg-blue-900 dark:selection:text-blue-100 transition-colors duration-700 ease-in-out">
      
      {/* Ambient Background Shapes - Liquid Glassy Feel */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
         <div className="absolute top-[-10%] right-[-5%] w-[900px] h-[900px] bg-blue-400/20 dark:bg-blue-600/10 rounded-full blur-[120px] animate-pulse" style={{animationDuration: '8s'}}></div>
         <div className="absolute bottom-[-10%] left-[-10%] w-[800px] h-[800px] bg-indigo-300/20 dark:bg-indigo-500/10 rounded-full blur-[100px] animate-pulse" style={{animationDuration: '10s'}}></div>
         <div className="absolute top-[40%] left-[30%] w-[500px] h-[500px] bg-cyan-200/20 dark:bg-cyan-900/10 rounded-full blur-[80px]"></div>
      </div>

      {/* Header - Centered Toggle, Non-sticky */}
      <header className="relative z-10 bg-white/10 dark:bg-black/5 backdrop-blur-sm border-b border-white/20 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600/80 to-indigo-600/80 rounded-2xl flex items-center justify-center text-white font-serif font-bold text-2xl shadow-[0_8px_32px_rgba(37,99,235,0.3)] backdrop-blur-md border border-white/20">A</div>
              <div>
                <h1 className="text-3xl md:text-4xl font-serif text-slate-900 dark:text-white tracking-tight leading-none drop-shadow-lg">
                  Ivan <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500 dark:from-blue-400 dark:to-indigo-400 italic">Aivazovsky</span>
                </h1>
              </div>
            </div>

            {/* Theme Toggle - Right Aligned & Centered Vertically */}
            <div className="flex items-center gap-6">
               <div className="hidden md:block text-right opacity-80">
                 <div className="text-[10px] font-bold tracking-widest text-slate-500 dark:text-slate-500 uppercase">Curated by</div>
                 <div className="text-sm font-bold text-slate-700 dark:text-slate-300">Gemini 2.5 Flash</div>
               </div>
               
               <button 
                onClick={() => setDarkMode(!darkMode)}
                className="relative p-3 rounded-full bg-white/20 dark:bg-slate-800/30 border border-white/40 dark:border-white/10 hover:bg-white/40 dark:hover:bg-slate-700/50 transition-all duration-300 group shadow-[0_8px_32px_rgba(0,0,0,0.05)] backdrop-blur-xl active:scale-95"
                aria-label="Toggle Dark Mode"
              >
                <div className="absolute inset-0 rounded-full bg-white/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                {darkMode ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-300 group-hover:rotate-90 transition-transform duration-500 relative z-10" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-600 group-hover:rotate-12 transition-transform duration-500 relative z-10" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 space-y-20">
        
        {status === LoadingState.LOADING && <Loader />}
        
        {status === LoadingState.ERROR && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
             <div className="p-6 rounded-full bg-red-50/50 dark:bg-red-900/10 backdrop-blur-xl border border-red-100 dark:border-red-900/30 text-red-500 dark:text-red-400 mb-6 shadow-xl">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            </div>
            <h3 className="text-3xl font-serif font-bold text-slate-800 dark:text-slate-200 mb-2">Unable to load collection</h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-md">We encountered an issue connecting to the gallery archives. Please verify your connection and try again.</p>
          </div>
        )}

        {status === LoadingState.SUCCESS && (
          <>
            {/* Hero / Intro Section */}
            <section className="text-center max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
              <h2 className="text-6xl md:text-7xl lg:text-8xl font-serif text-slate-900 dark:text-white leading-[0.9] drop-shadow-xl">
                Master of <br/>
                <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-500 dark:from-blue-400 dark:via-indigo-300 dark:to-cyan-300">Light & Sea</span>
              </h2>
              <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 font-light leading-relaxed max-w-2xl mx-auto">
                A curated journey through the most translucent waves and dramatic storms ever captured on canvas.
              </p>
            </section>

            {/* Timeline Visualization - Liquid Glass Card */}
            <section className="transform transition-transform duration-700">
              <Timeline paintings={paintings} onSelect={setSelectedPainting} />
            </section>

            {/* Gallery Grid */}
            <section>
              <div className="flex items-end justify-between mb-12 border-b border-slate-200/60 dark:border-white/10 pb-6">
                <h2 className="text-4xl font-serif text-slate-800 dark:text-slate-100 tracking-tight">The Collection</h2>
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 font-mono text-sm bg-white/30 dark:bg-slate-800/30 px-3 py-1 rounded-full backdrop-blur-sm border border-white/20">
                  <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                  {paintings.length} WORKS
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 xl:gap-12">
                {paintings.map((painting, i) => (
                  <div 
                    key={painting.id}
                    onClick={() => setSelectedPainting(painting)}
                    className="group relative bg-white/10 dark:bg-slate-900/20 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/20 dark:border-white/5 shadow-[0_8px_32px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_50px_rgba(37,99,235,0.15)] transition-all duration-500 cursor-pointer hover:-translate-y-3"
                    style={{ animationDelay: `${i * 100}ms` }}
                  >
                    {/* Image Container */}
                    <div className="aspect-[4/3] overflow-hidden relative bg-slate-200 dark:bg-slate-800">
                       <img 
                         src={painting.imageUrl} 
                         alt={painting.title}
                         className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                         loading="lazy"
                         onError={(e) => {
                           (e.target as HTMLImageElement).src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png';
                         }}
                       />
                       <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
                       
                       {/* Floating Glass Badge */}
                       <div className="absolute top-4 right-4">
                         <span className="bg-white/20 dark:bg-black/40 backdrop-blur-md border border-white/30 dark:border-white/10 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                           {painting.year}
                         </span>
                       </div>

                       {/* Hover Overlay */}
                       <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 bg-blue-900/20 backdrop-blur-[2px]">
                          <span className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl text-slate-900 dark:text-white px-6 py-3 rounded-full text-xs uppercase tracking-widest font-bold shadow-2xl border border-white/50 dark:border-white/10 flex items-center gap-2">
                            View Details
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                          </span>
                       </div>
                    </div>
                    
                    {/* Content */}
                    <div className="p-6 border-t border-white/10 dark:border-white/5">
                      <h3 className="text-2xl font-serif text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-tight mb-3">{painting.title}</h3>
                      
                      <p className="text-slate-600 dark:text-slate-300 text-sm line-clamp-2 mb-5 leading-relaxed font-light opacity-90">{painting.description}</p>
                      
                      <div className="flex items-center justify-between border-t border-slate-200/50 dark:border-white/5 pt-4 mt-auto">
                         <div className="flex items-center text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">
                            <svg className="w-3.5 h-3.5 mr-1.5 text-blue-500 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                            <span className="line-clamp-1 max-w-[150px]">{painting.location}</span>
                         </div>
                         <div className="text-xs font-bold text-slate-300 dark:text-slate-600">
                           ID: {painting.id.split('_')[0]}
                         </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}
      </main>
      
      <footer className="relative z-10 border-t border-slate-200/50 dark:border-white/5 mt-32 py-16 bg-white/30 dark:bg-black/20 backdrop-blur-xl">
         <div className="max-w-7xl mx-auto px-6 flex flex-col items-center text-center">
           <div className="w-10 h-10 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-800 dark:to-slate-900 rounded-xl mb-6 flex items-center justify-center text-slate-500 dark:text-slate-400 font-serif font-bold shadow-inner">A</div>
           <p className="text-slate-600 dark:text-slate-400 text-sm font-medium tracking-wide">&copy; {new Date().getFullYear()} Aivazovsky Digital Archives.</p>
           <div className="w-12 h-1 bg-gradient-to-r from-blue-400/50 to-indigo-400/50 rounded-full my-4"></div>
           <p className="text-xs text-slate-400 dark:text-slate-500 max-w-md leading-relaxed">
             Images sourced directly from Wikimedia Commons via automated curation. 
             Historical data generated by Google Gemini 2.5 Flash.
             Educational demonstration only.
           </p>
         </div>
      </footer>

      {selectedPainting && (
        <ArtworkModal 
          painting={selectedPainting} 
          onClose={() => setSelectedPainting(null)} 
        />
      )}
    </div>
  );
};

export default App;