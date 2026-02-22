import React, { useState, useRef, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, Cell } from 'recharts';
import { Painting } from '../types';

interface TimelineProps {
  paintings: Painting[];
  onSelect: (painting: Painting) => void;
}

interface HoveredPoint {
  painting: Painting & { x: number; y: number; aestheticScore: number };
  mouseX: number;
  mouseY: number;
}

export const Timeline: React.FC<TimelineProps> = ({ paintings, onSelect }) => {
  const minChartWidth = Math.max(800, paintings.length * 50) + "px";
  const [hovered, setHovered] = useState<HoveredPoint | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const data = paintings.map(p => ({
    x: p.year,
    y: p.aestheticScore,
    z: 1,
    ...p
  })).sort((a, b) => a.x - b.x);

  const handleMouseMove = useCallback((state: any) => {
    if (state?.activePayload?.length) {
      const point = state.activePayload[0].payload;
      const chartWrapper = containerRef.current?.querySelector('.recharts-wrapper');
      if (chartWrapper) {
        const rect = chartWrapper.getBoundingClientRect();
        const x = rect.left + (state.chartX ?? 0);
        const y = rect.top + (state.chartY ?? 0);
        setHovered({ painting: point, mouseX: x, mouseY: y });
      }
    } else {
      setHovered(null);
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHovered(null);
  }, []);

  const tooltipLeft = hovered ? hovered.mouseX + 16 : 0;
  const tooltipTop = hovered ? hovered.mouseY - 100 : 0;

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
      <div className="w-full overflow-x-auto pb-6 px-4 scrollbar-thin scrollbar-thumb-blue-500/20 scrollbar-track-transparent" ref={containerRef}>
        {/* Chart Container with dynamic fixed width */}
        <div style={{ width: minChartWidth, height: '320px' }} className="relative">
             {/* Decorative glow behind chart */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-2/3 bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

            <ResponsiveContainer width="100%" height="100%">
                <ScatterChart
                margin={{ top: 20, right: 40, bottom: 20, left: 20 }}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                >
                <XAxis
                    type="number"
                    dataKey="x"
                    name="Year"
                    domain={['dataMin - 2', 'dataMax + 2']}
                    tick={{ fill: 'currentColor', fontSize: 12, opacity: 0.6 }}
                    tickCount={Math.ceil(paintings.length / 3)}
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
                    content={() => null}
                />
                <Scatter name="Paintings" data={data} onClick={(p) => onSelect(p.payload as Painting)}>
                    {data.map((entry, index) => (
                    <Cell
                        key={`cell-${index}`}
                        fill={index % 2 === 0 ? '#3b82f6' : '#0ea5e9'}
                        className="cursor-pointer opacity-80 transition-opacity duration-300 filter drop-shadow-lg"
                        stroke="none"
                    />
                    ))}
                </Scatter>
                </ScatterChart>
            </ResponsiveContainer>
        </div>
      </div>

      {/* Portal tooltip - renders outside all clipping containers */}
      {hovered && ReactDOM.createPortal(
        <div
          className="fixed pointer-events-none"
          style={{ left: tooltipLeft, top: tooltipTop, zIndex: 9999 }}
        >
          <div className="bg-white/95 dark:bg-slate-900/95 border border-white/40 dark:border-white/10 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.25)] text-sm backdrop-blur-xl w-[260px] overflow-hidden">
            <div className="w-full h-32 bg-slate-200 dark:bg-slate-800 overflow-hidden">
              <img src={hovered.painting.imageUrl} alt={hovered.painting.title} className="w-full h-full object-cover" />
            </div>
            <div className="p-4">
              <p className="font-bold text-slate-900 dark:text-white font-serif text-lg mb-1 leading-tight">{hovered.painting.title}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="px-2 py-0.5 rounded bg-blue-100/50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-bold">{hovered.painting.year}</span>
                <span className="text-slate-500 dark:text-slate-400 text-xs">Score: {hovered.painting.aestheticScore}</span>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};
