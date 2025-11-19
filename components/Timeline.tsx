import React from 'react';
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, Cell } from 'recharts';
import { Painting } from '../types';

interface TimelineProps {
  paintings: Painting[];
  onSelect: (painting: Painting) => void;
}

export const Timeline: React.FC<TimelineProps> = ({ paintings, onSelect }) => {
  // Fixed pixel width per item to ensure consistent spacing regardless of container size
  // 50px per painting gives enough room for the dots and tooltips
  const minChartWidth = Math.max(800, paintings.length * 50) + "px";
  
  const data = paintings.map(p => ({
    x: p.year,
    y: p.aestheticScore,
    z: 1, // size
    ...p
  })).sort((a, b) => a.x - b.x);

  return (
    <div className="w-full bg-white/10 dark:bg-slate-800/20 rounded-3xl p-1 border border-white/30 dark:border-white/5 shadow-[0_8px_32px_rgba(0,0,0,0.05)] backdrop-blur-3xl transition-all duration-500 relative">
      
      {/* Header Container */}
      <div className="px-8 pt-8 pb-2">
        <h3 className="text-2xl font-serif text-slate-800 dark:text-slate-100 flex items-center relative z-10">
            <span className="bg-gradient-to-b from-blue-400 to-blue-600 w-1.5 h-8 mr-4 rounded-full shadow-[0_0_15px_rgba(37,99,235,0.5)]"></span>
            Chronological Journey
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 ml-6 mt-2">Scroll right to explore the timeline</p>
      </div>
      
      {/* Scrollable Area */}
      <div className="w-full overflow-x-auto pb-6 px-4 scrollbar-thin scrollbar-thumb-blue-500/20 scrollbar-track-transparent">
        {/* Chart Container with dynamic fixed width */}
        <div style={{ width: minChartWidth, height: '320px' }} className="relative">
             {/* Decorative glow behind chart */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-2/3 bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

            <ResponsiveContainer width="100%" height="100%">
                <ScatterChart
                margin={{ top: 20, right: 40, bottom: 20, left: 20 }}
                >
                <XAxis 
                    type="number" 
                    dataKey="x" 
                    name="Year" 
                    domain={['dataMin - 2', 'dataMax + 2']} 
                    tick={{ fill: 'currentColor', fontSize: 12, opacity: 0.6 }}
                    tickCount={Math.ceil(paintings.length / 3)} // Fewer ticks to prevent crowding
                    tickLine={false}
                    axisLine={{ stroke: 'currentColor', opacity: 0.1 }}
                    className="text-slate-600 dark:text-slate-400"
                />
                <YAxis 
                    type="number" 
                    dataKey="y" 
                    name="Impact" 
                    domain={[75, 105]} 
                    hide 
                />
                <ZAxis type="number" range={[100, 300]} />
                <Tooltip 
                    cursor={{ strokeDasharray: '3 3', stroke: '#64748b' }}
                    isAnimationActive={false} 
                    content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                        <div className="bg-white/95 dark:bg-slate-900/95 border border-white/40 dark:border-white/10 p-4 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.25)] text-sm backdrop-blur-xl z-50 min-w-[200px] pointer-events-none">
                            <p className="font-bold text-slate-900 dark:text-white font-serif text-lg mb-1 leading-tight">{data.title}</p>
                            <div className="flex items-center gap-2 mt-2">
                            <span className="px-2 py-0.5 rounded bg-blue-100/50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-bold">{data.year}</span>
                            <span className="text-slate-500 dark:text-slate-400 text-xs">Score: {data.aestheticScore}</span>
                            </div>
                        </div>
                        );
                    }
                    return null;
                    }}
                />
                <Scatter name="Paintings" data={data} onClick={(p) => onSelect(p.payload as Painting)}>
                    {data.map((entry, index) => (
                    <Cell 
                        key={`cell-${index}`} 
                        fill={index % 2 === 0 ? '#3b82f6' : '#0ea5e9'} 
                        className="cursor-pointer hover:opacity-100 opacity-80 transition-all duration-300 hover:scale-150 filter drop-shadow-lg"
                        stroke="none"
                    />
                    ))}
                </Scatter>
                </ScatterChart>
            </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};