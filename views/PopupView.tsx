
import React, { useState } from 'react';
import type { FocusList } from '../types';
import { Button } from '../components/common/Button';

interface PopupViewProps {
  focusLists: FocusList[];
  onStartFocus: (list: FocusList, withPrep: boolean) => void;
}

export const PopupView: React.FC<PopupViewProps> = ({ focusLists, onStartFocus }) => {
  const [selectedListId, setSelectedListId] = useState<string>(focusLists[0]?.id || '');
  const [usePrepTimer, setUsePrepTimer] = useState(false);

  const selectedList = focusLists.find(l => l.id === selectedListId);

  const handleStart = () => {
    if (selectedList) {
      onStartFocus(selectedList, usePrepTimer);
    }
  };

  return (
    <div className="view-scroll animate-in">
      <header>
        <h1 className="h1-hero">Olá, Focuser</h1>
        <p className="text-muted text-sm mt-1">Pronto para cultivar foco?</p>
      </header>

      <main className="flex flex-col gap-6">
        
        {/* Seção de Seleção de Ciclo */}
        <section>
          <div className="h2-section">Ciclo Escolhido</div>
          <div className="input-group">
            <select
              value={selectedListId}
              onChange={(e) => setSelectedListId(e.target.value)}
              className="input-field"
              style={{ appearance: 'none', cursor: 'pointer' }}
            >
              {focusLists.map(list => (
                <option key={list.id} value={list.id} style={{color: '#000'}}>
                  {list.name}
                </option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none text-muted">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
            </div>
          </div>

          {/* Card de Detalhes */}
          <div className="grid grid-cols-2 gap-3 mt-3">
             <div className="card flex flex-col items-center justify-center py-4 bg-primary-dim border border-focus">
                 <span className="text-2xl font-bold text-primary">{selectedList?.focusMinutes || 0}</span>
                 <span className="text-xs text-muted uppercase tracking-wide font-bold">Foco</span>
             </div>
             <div className="card flex flex-col items-center justify-center py-4">
                 <span className="text-2xl font-bold text-white">{selectedList?.breakMinutes || 0}</span>
                 <span className="text-xs text-muted uppercase tracking-wide font-bold">Pausa</span>
             </div>
          </div>
        </section>

        {/* Configurações Rápidas */}
        <section>
          <div className="h2-section">Preferências</div>
          <div 
            className={`toggle-row ${usePrepTimer ? 'border-primary' : ''}`}
            onClick={() => setUsePrepTimer(!usePrepTimer)}
          >
            <div>
              <div className="font-bold text-sm text-white">Modo Preparação</div>
              <div className="text-xs text-muted mt-0.5">1 min para arrumar a mesa</div>
            </div>
            <div className={`toggle-switch ${usePrepTimer ? 'active' : ''}`}>
              <div className="toggle-dot" />
            </div>
          </div>
        </section>

        {/* Botão de Ação Principal - Espaçado para o final */}
        <div className="mt-auto pt-4">
            <Button 
              variant="primary" 
              size="lg" 
              onClick={handleStart} 
              disabled={!selectedListId}
              className="shadow-lg"
              style={{ height: '56px', fontSize: '1.1rem' }}
            >
              INICIAR SESSÃO
            </Button>
        </div>

      </main>
    </div>
  );
};
    