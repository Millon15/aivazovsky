import React from 'react';

export const Loader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-64 space-y-4">
      <div className="w-16 h-16 border-4 border-blue-200 dark:border-blue-900 border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin shadow-lg shadow-blue-200/50 dark:shadow-blue-900/50"></div>
      <p className="text-slate-500 dark:text-slate-400 font-light tracking-widest uppercase text-xs animate-pulse">Curating Collection...</p>
    </div>
  );
};