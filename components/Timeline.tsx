import React from 'react';
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, Cell } from 'recharts';
import { Painting } from '../types';

interface TimelineProps {
  paintings: Painting[];
  onSelect: (painting: Painting) => void;
}

export const Timeline: React.FC<TimelineProps> = ({ paintings, onSelect }) => {
  const data = paintings.map(p => ({
    x: p.year,
    y: p.aestheticScore,
    z: 1, // size
    ...p
  })).sort((a, b) => a.x - b.x);

  return (
    <div className="w-full h-80 bg-white/10 dark:bg-slate-800/20 rounded-3xl p-8 border border-white/30 dark:border-white/5 shadow-[0_8px_32px_rgba(0,0,0,0.05)] backdrop-blur-3xl transition-all duration-500 relative overflow-hidden">
      {/* Decorative glow behind chart */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2/3 h-2/3 bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
      
      <h3 className="text-2xl font-serif text-slate-800 dark:text-slate-100 mb-6 flex items-center relative z-10">
        <span className="bg-gradient-to-b from-blue-400 to-blue-600 w-1.5 h-8 mr-4 rounded-full shadow-[0_0_15px_rgba(37,99,235,0.5)]"></span>
        Chronological Journey
      </h3>
      <ResponsiveContainer width="100%" height="80%">
        <ScatterChart
          margin={{ top: 20, right: 20, bottom: 20, left: 10 }}
        >
          <XAxis 
            type="number" 
            dataKey="x" 
            name="Year" 
            domain={['dataMin - 5', 'dataMax + 5']} 
            tick={{ fill: 'currentColor', fontSize: 12, opacity: 0.6 }}
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
          <ZAxis type="number" range={[150, 150]} />
          <Tooltip 
            cursor={{ strokeDasharray: '3 3', stroke: '#64748b' }}
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                  <div className="bg-white/70 dark:bg-slate-900/70 border border-white/40 dark:border-white/10 p-4 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.1)] text-sm backdrop-blur-xl">
                    <p className="font-bold text-slate-900 dark:text-white font-serif text-lg mb-1">{data.title}</p>
                    <div className="flex items-center gap-2">
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
  );
};