
import React, { useState } from 'react';
import type { FocusList } from '../types';
import { Button } from '../components/common/Button';
import { COLORS } from '../constants';

interface PopupViewProps {
  focusLists: FocusList[];
  onStartFocus: (list: FocusList, withPrep: boolean) => void;
}

export const PopupView: React.FC<PopupViewProps> = ({ focusLists, onStartFocus }) => {
  const [selectedListId, setSelectedListId] = useState<string>(focusLists[0]?.id || '');
  const [usePrepTimer, setUsePrepTimer] = useState(false);

  const handleStart = () => {
    const selectedList = focusLists.find(list => list.id === selectedListId);
    if (selectedList) {
      onStartFocus(selectedList, usePrepTimer);
    }
  };

  return (
    <div className="p-8 flex flex-col h-full justify-between animate-fade-in">
      <div>
        <header className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-slate-100">Izy Focus</h1>
          <p className="text-slate-400 mt-2">Cultive seu foco, colha resultados.</p>
        </header>

        <main className="space-y-6">
          <div className="relative">
            <label className="block text-sm text-slate-400 mb-2 font-semibold">Escolha seu ciclo</label>
            <select
              value={selectedListId}
              onChange={(e) => setSelectedListId(e.target.value)}
              className="w-full bg-slate-800 border-2 border-slate-700 text-slate-100 text-lg p-4 rounded-xl appearance-none focus:outline-none focus:border-emerald-500 transition-colors cursor-pointer hover:border-slate-600"
            >
              {focusLists.map(list => (
                <option key={list.id} value={list.id}>
                  {list.name} ({list.focusMinutes}min / {list.breakMinutes}min)
                </option>
              ))}
            </select>
             <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400 mt-6">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" /></svg>
            </div>
          </div>

          <label className="flex items-center justify-between p-4 bg-slate-800 rounded-xl cursor-pointer hover:bg-slate-750 transition-colors">
            <div className="flex flex-col">
                <span className="font-semibold text-slate-200">Tempo de Preparação</span>
                <span className="text-sm text-slate-400">1 min para se organizar.</span>
            </div>
            <div
              className={`w-14 h-8 flex items-center rounded-full p-1 transition-colors duration-300 ${usePrepTimer ? 'bg-emerald-500' : 'bg-slate-700'}`}
              onClick={() => setUsePrepTimer(!usePrepTimer)}
            >
              <div
                className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 ${usePrepTimer ? 'translate-x-6' : ''}`}
              />
            </div>
          </label>
        </main>
      </div>

      <footer className="space-y-4">
        <Button onClick={handleStart} disabled={!selectedListId}>
          Iniciar Foco
        </Button>
      </footer>
    </div>
  );
};
