
import React, { useState } from 'react';
import type { FocusList, BlockList } from '../types';
import { Button } from '../components/common/Button';
import { getAISiteSuggestions } from '../services/geminiService';

interface OptionsViewProps {
  focusLists: FocusList[];
  blockLists: BlockList[];
  onSaveFocusLists: (lists: FocusList[]) => void;
  onSaveBlockLists: (lists: BlockList[]) => void;
}

export const OptionsView: React.FC<OptionsViewProps> = ({
  focusLists,
  blockLists,
  onSaveFocusLists,
  onSaveBlockLists,
}) => {
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [suggestedSites, setSuggestedSites] = useState<string[]>([]);
  const [editingBlockList, setEditingBlockList] = useState<BlockList | null>(null);
  const [editingFocusList, setEditingFocusList] = useState<FocusList | null>(null);
  
  // In a real extension, you'd get this from chrome.history API
  const mockHistory = ['github.com', 'stackoverflow.com', 'youtube.com', 'figma.com', 'twitter.com', 'developer.mozilla.org'];

  const handleSuggestSites = async () => {
    setIsSuggesting(true);
    setSuggestedSites([]);
    const suggestions = await getAISiteSuggestions(mockHistory);
    setSuggestedSites(suggestions);
    setIsSuggesting(false);
  };

  // --- Block List Actions ---
  const saveBlockList = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBlockList) return;
    
    const updatedList = { ...editingBlockList };
    const existingIndex = blockLists.findIndex(l => l.id === updatedList.id);
    
    let newLists = [...blockLists];
    if (existingIndex >= 0) {
        newLists[existingIndex] = updatedList;
    } else {
        newLists.push(updatedList);
    }
    onSaveBlockLists(newLists);
    setEditingBlockList(null);
  };

  const deleteBlockList = (id: string) => {
      if (confirm('Tem certeza que deseja excluir esta lista de bloqueio?')) {
        onSaveBlockLists(blockLists.filter(l => l.id !== id));
      }
  };

  const createNewBlockList = () => {
      setEditingBlockList({ id: `bl_${Date.now()}`, name: '', sites: [] });
  };

  // --- Focus List Actions ---
  const saveFocusList = (e: React.FormEvent) => {
      e.preventDefault();
      if (!editingFocusList) return;
      
      const updatedList = { ...editingFocusList };
      const existingIndex = focusLists.findIndex(l => l.id === updatedList.id);
      
      let newLists = [...focusLists];
      if (existingIndex >= 0) {
          newLists[existingIndex] = updatedList;
      } else {
          newLists.push(updatedList);
      }
      onSaveFocusLists(newLists);
      setEditingFocusList(null);
  };

  const deleteFocusList = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este modo de foco?')) {
      onSaveFocusLists(focusLists.filter(l => l.id !== id));
    }
  };

  const createNewFocusList = () => {
      setEditingFocusList({ 
          id: `fl_${Date.now()}`, 
          name: '', 
          focusMinutes: 25, 
          breakMinutes: 5, 
          blockListId: blockLists[0]?.id || '' 
      });
  };

  // --- Renders ---

  // Form for Editing/Creating Block List
  if (editingBlockList) {
      return (
          <div className="p-6 h-full flex flex-col animate-fade-in">
              <h2 className="text-2xl font-bold text-slate-100 mb-6">
                 {blockLists.find(b => b.id === editingBlockList.id) ? 'Editar Lista de Bloqueio' : 'Nova Lista de Bloqueio'}
              </h2>
              <form onSubmit={saveBlockList} className="flex-1 space-y-4">
                  <div>
                      <label className="block text-sm text-slate-400 mb-1">Nome da Lista</label>
                      <input 
                          type="text" 
                          required
                          className="w-full bg-slate-800 border border-slate-600 rounded p-3 text-white focus:border-emerald-500 outline-none"
                          value={editingBlockList.name}
                          onChange={e => setEditingBlockList({...editingBlockList, name: e.target.value})}
                      />
                  </div>
                  <div className="flex-1">
                      <label className="block text-sm text-slate-400 mb-1">Sites (separados por vírgula ou nova linha)</label>
                      <textarea 
                          className="w-full h-64 bg-slate-800 border border-slate-600 rounded p-3 text-white focus:border-emerald-500 outline-none"
                          value={editingBlockList.sites.join('\n')}
                          onChange={e => setEditingBlockList({...editingBlockList, sites: e.target.value.split(/[\n,]+/).map(s => s.trim()).filter(Boolean)})}
                          placeholder="ex: facebook.com, twitter.com"
                      />
                  </div>
                  <div className="flex space-x-3 pt-4">
                      <Button type="button" variant="ghost" onClick={() => setEditingBlockList(null)}>Cancelar</Button>
                      <Button type="submit">Salvar</Button>
                  </div>
              </form>
          </div>
      );
  }

  // Form for Editing/Creating Focus List
  if (editingFocusList) {
    return (
        <div className="p-6 h-full flex flex-col animate-fade-in">
            <h2 className="text-2xl font-bold text-slate-100 mb-6">
                {focusLists.find(f => f.id === editingFocusList.id) ? 'Editar Modo de Foco' : 'Novo Modo de Foco'}
            </h2>
            <form onSubmit={saveFocusList} className="space-y-4">
                <div>
                    <label className="block text-sm text-slate-400 mb-1">Nome do Modo</label>
                    <input 
                        type="text" 
                        required
                        className="w-full bg-slate-800 border border-slate-600 rounded p-3 text-white focus:border-emerald-500 outline-none"
                        value={editingFocusList.name}
                        onChange={e => setEditingFocusList({...editingFocusList, name: e.target.value})}
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm text-slate-400 mb-1">Foco (min)</label>
                        <input 
                            type="number" 
                            required
                            min="1"
                            className="w-full bg-slate-800 border border-slate-600 rounded p-3 text-white focus:border-emerald-500 outline-none"
                            value={editingFocusList.focusMinutes}
                            onChange={e => setEditingFocusList({...editingFocusList, focusMinutes: parseInt(e.target.value) || 0})}
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-slate-400 mb-1">Pausa (min)</label>
                        <input 
                            type="number" 
                            required
                            min="1"
                            className="w-full bg-slate-800 border border-slate-600 rounded p-3 text-white focus:border-emerald-500 outline-none"
                            value={editingFocusList.breakMinutes}
                            onChange={e => setEditingFocusList({...editingFocusList, breakMinutes: parseInt(e.target.value) || 0})}
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-sm text-slate-400 mb-1">Lista de Bloqueio</label>
                    <select 
                        className="w-full bg-slate-800 border border-slate-600 rounded p-3 text-white focus:border-emerald-500 outline-none"
                        value={editingFocusList.blockListId}
                        onChange={e => setEditingFocusList({...editingFocusList, blockListId: e.target.value})}
                    >
                        {blockLists.map(bl => (
                            <option key={bl.id} value={bl.id}>{bl.name}</option>
                        ))}
                    </select>
                </div>
                <div className="flex space-x-3 pt-4 mt-auto">
                    <Button type="button" variant="ghost" onClick={() => setEditingFocusList(null)}>Cancelar</Button>
                    <Button type="submit">Salvar</Button>
                </div>
            </form>
        </div>
    );
  }
  
  // Main Settings View
  return (
    <div className="p-6 h-full overflow-y-auto text-slate-300 animate-fade-in">
      <h1 className="text-3xl font-bold text-slate-100 mb-6">Configurações</h1>
      
      <div className="space-y-8 pb-20">
        {/* Block Lists Editor */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-xl font-semibold text-slate-200">Listas de Bloqueio</h2>
            <button onClick={createNewBlockList} className="text-sm text-emerald-400 hover:text-emerald-300 font-bold">+ Criar Nova</button>
          </div>
          <div className="space-y-3">
            {blockLists.map(list => (
              <div key={list.id} className="p-4 bg-slate-800 rounded-lg flex justify-between items-start group">
                <div className="flex-1 mr-2">
                    <p className="font-bold text-slate-100">{list.name}</p>
                    <p className="text-sm text-slate-400 truncate">{list.sites.join(', ')}</p>
                </div>
                <div className="flex space-x-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                    <button onClick={() => setEditingBlockList(list)} className="p-1 text-slate-400 hover:text-white" title="Editar">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                    </button>
                    <button onClick={() => deleteBlockList(list.id)} className="p-1 text-slate-400 hover:text-red-400" title="Excluir">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                </div>
              </div>
            ))}
             <div className="p-4 bg-slate-800 rounded-lg border-2 border-dashed border-slate-700">
                <p className="font-semibold text-slate-100 mb-2">Descubra distrações</p>
                <Button onClick={handleSuggestSites} disabled={isSuggesting} variant="secondary" className="py-2 text-sm">
                    {isSuggesting ? 'Analisando...' : 'Sugerir sites com IA'}
                </Button>
                {suggestedSites.length > 0 && (
                    <div className="mt-3 text-sm">
                        <p className="text-slate-300">IA sugere bloquear:</p>
                        <ul className="list-disc list-inside text-emerald-400">
                            {suggestedSites.map(s => <li key={s}>{s}</li>)}
                        </ul>
                    </div>
                )}
            </div>
          </div>
        </div>

        {/* Focus Lists Editor */}
        <div>
           <div className="flex justify-between items-center mb-3">
                <h2 className="text-xl font-semibold text-slate-200">Modos de Foco</h2>
                <button onClick={createNewFocusList} className="text-sm text-emerald-400 hover:text-emerald-300 font-bold">+ Criar Novo</button>
            </div>
          <div className="space-y-3">
            {focusLists.map(list => (
              <div key={list.id} className="p-4 bg-slate-800 rounded-lg flex justify-between items-start group">
                <div className="flex-1 mr-2">
                    <p className="font-bold text-slate-100">{list.name}</p>
                    <p className="text-sm text-slate-400">
                    {list.focusMinutes} min foco / {list.breakMinutes} min pausa
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                    Bloqueia: {blockLists.find(bl => bl.id === list.blockListId)?.name || 'Nada'}
                    </p>
                </div>
                 <div className="flex space-x-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                    <button onClick={() => setEditingFocusList(list)} className="p-1 text-slate-400 hover:text-white" title="Editar">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                    </button>
                    <button onClick={() => deleteFocusList(list.id)} className="p-1 text-slate-400 hover:text-red-400" title="Excluir">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
