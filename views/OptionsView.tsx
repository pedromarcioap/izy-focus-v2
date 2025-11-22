
import React, { useState } from 'react';
import type { FocusList, BlockList } from '../types';
import { Button } from '../components/common/Button';

interface OptionsViewProps {
  focusLists: FocusList[];
  blockLists: BlockList[];
  onSaveFocusLists: (lists: FocusList[]) => void;
  onSaveBlockLists: (lists: BlockList[]) => void;
}

export const OptionsView: React.FC<OptionsViewProps> = ({
  focusLists, blockLists, onSaveFocusLists, onSaveBlockLists,
}) => {
  const [editingBlockList, setEditingBlockList] = useState<BlockList | null>(null);
  const [editingFocusList, setEditingFocusList] = useState<FocusList | null>(null);

  // --- Helper Functions for Save/Delete (same logic, better formatting) ---
  const saveBlockList = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBlockList) return;
    const newLists = [...blockLists];
    const idx = newLists.findIndex(l => l.id === editingBlockList.id);
    if (idx >= 0) newLists[idx] = editingBlockList; else newLists.push(editingBlockList);
    onSaveBlockLists(newLists);
    setEditingBlockList(null);
  };
  
  const saveFocusList = (e: React.FormEvent) => {
      e.preventDefault();
      if (!editingFocusList) return;
      const newLists = [...focusLists];
      const idx = newLists.findIndex(l => l.id === editingFocusList.id);
      if (idx >= 0) newLists[idx] = editingFocusList; else newLists.push(editingFocusList);
      onSaveFocusLists(newLists);
      setEditingFocusList(null);
  };

  const createNewBlock = () => setEditingBlockList({ id: `bl_${Date.now()}`, name: '', sites: [] });
  const deleteBlock = (id: string) => { if(confirm('Remover?')) onSaveBlockLists(blockLists.filter(l => l.id !== id)); };
  const createNewFocus = () => setEditingFocusList({ id: `fl_${Date.now()}`, name: '', focusMinutes: 25, breakMinutes: 5, blockListId: blockLists[0]?.id || '' });
  const deleteFocus = (id: string) => { if(confirm('Remover?')) onSaveFocusLists(focusLists.filter(l => l.id !== id)); };

  // --- EDITOR MODES ---
  if (editingBlockList) {
      return (
          <div className="view-scroll animate-in">
              <h2 className="h1-hero">Editar Bloqueio</h2>
              <form onSubmit={saveBlockList} className="flex flex-col gap-4 flex-1">
                  <div>
                    <label className="h2-section">Nome</label>
                    <input className="input-field" placeholder="Ex: Redes Sociais" value={editingBlockList.name} onChange={e => setEditingBlockList({...editingBlockList, name: e.target.value})} required autoFocus />
                  </div>
                  <div className="flex-1 flex flex-col">
                    <label className="h2-section">Sites (separados por vírgula)</label>
                    <textarea className="input-field flex-1" style={{resize: 'none', minHeight: '150px'}} placeholder="facebook.com, twitter.com" value={editingBlockList.sites.join(', ')} onChange={e => setEditingBlockList({...editingBlockList, sites: e.target.value.split(',').map(s => s.trim())})} />
                  </div>
                  <div className="flex gap-3 mt-4">
                      <Button type="button" variant="ghost" onClick={() => setEditingBlockList(null)}>Cancelar</Button>
                      <Button type="submit">Salvar</Button>
                  </div>
              </form>
          </div>
      );
  }

  if (editingFocusList) {
    return (
        <div className="view-scroll animate-in">
            <h2 className="h1-hero">Editar Ciclo</h2>
            <form onSubmit={saveFocusList} className="flex flex-col gap-4 flex-1">
                <div>
                    <label className="h2-section">Nome</label>
                    <input className="input-field" placeholder="Ex: Pomodoro" value={editingFocusList.name} onChange={e => setEditingFocusList({...editingFocusList, name: e.target.value})} required autoFocus />
                </div>
                <div className="flex gap-4">
                    <div className="flex-1">
                        <label className="h2-section">Foco (min)</label>
                        <input type="number" className="input-field text-center font-bold text-lg" value={editingFocusList.focusMinutes} onChange={e => setEditingFocusList({...editingFocusList, focusMinutes: parseInt(e.target.value)||0})} />
                    </div>
                    <div className="flex-1">
                        <label className="h2-section">Pausa (min)</label>
                        <input type="number" className="input-field text-center font-bold text-lg" value={editingFocusList.breakMinutes} onChange={e => setEditingFocusList({...editingFocusList, breakMinutes: parseInt(e.target.value)||0})} />
                    </div>
                </div>
                <div>
                    <label className="h2-section">Lista de Bloqueio</label>
                    <select className="input-field" style={{appearance: 'none', color: editingFocusList.blockListId ? 'white' : 'gray'}} value={editingFocusList.blockListId} onChange={e => setEditingFocusList({...editingFocusList, blockListId: e.target.value})}>
                        {blockLists.map(bl => <option key={bl.id} value={bl.id} style={{color:'#000'}}>{bl.name}</option>)}
                    </select>
                </div>
                <div className="flex gap-3 mt-auto pt-4">
                    <Button type="button" variant="ghost" onClick={() => setEditingFocusList(null)}>Cancelar</Button>
                    <Button type="submit">Salvar</Button>
                </div>
            </form>
        </div>
    );
  }
  
  // --- LIST MODE ---
  return (
    <div className="view-scroll animate-in">
      <h1 className="h1-hero">Configurações</h1>
      
      <section>
        <div className="flex justify-between items-center mb-2">
            <span className="h2-section mb-0">Listas de Bloqueio</span>
            <button onClick={createNewBlock} className="text-primary text-xs font-bold px-2 py-1 bg-primary-dim rounded hover:bg-primary hover:text-black transition-colors">+ NOVO</button>
        </div>
        <div className="flex flex-col gap-2">
            {blockLists.map(list => (
                <div key={list.id} className="card card-interactive flex justify-between items-center group">
                    <span className="font-medium text-sm text-white">{list.name}</span>
                    <div className="flex gap-2">
                        <button onClick={() => setEditingBlockList(list)} className="text-xs text-muted hover:text-white p-2">Editar</button>
                        <button onClick={() => deleteBlock(list.id)} className="text-xs text-danger hover:text-red-400 p-2">✕</button>
                    </div>
                </div>
            ))}
        </div>
      </section>

      <section>
        <div className="flex justify-between items-center mb-2">
            <span className="h2-section mb-0">Meus Ciclos</span>
            <button onClick={createNewFocus} className="text-primary text-xs font-bold px-2 py-1 bg-primary-dim rounded hover:bg-primary hover:text-black transition-colors">+ NOVO</button>
        </div>
        <div className="flex flex-col gap-2">
            {focusLists.map(list => (
                <div key={list.id} className="card card-interactive flex justify-between items-center group">
                    <div>
                        <div className="font-bold text-sm text-white">{list.name}</div>
                        <div className="text-xs text-muted mt-1">{list.focusMinutes}m Foco • {list.breakMinutes}m Pausa</div>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={() => setEditingFocusList(list)} className="text-xs text-muted hover:text-white p-2">Editar</button>
                        <button onClick={() => deleteFocus(list.id)} className="text-xs text-danger hover:text-red-400 p-2">✕</button>
                    </div>
                </div>
            ))}
        </div>
      </section>
    </div>
  );
};
    