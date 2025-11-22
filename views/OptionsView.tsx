
import React, { useState } from 'react';
import type { FocusList, BlockList, UserSettings } from '../types';
import { NOTIFICATION_SOUNDS, FOCUS_MUSIC_TRACKS } from '../constants';
import { Button } from '../components/common/Button';

interface OptionsViewProps {
  focusLists: FocusList[];
  blockLists: BlockList[];
  settings: UserSettings;
  onSaveFocusLists: (lists: FocusList[]) => void;
  onSaveBlockLists: (lists: BlockList[]) => void;
  onSaveSettings: (settings: UserSettings) => void;
}

export const OptionsView: React.FC<OptionsViewProps> = ({
  focusLists, blockLists, settings, onSaveFocusLists, onSaveBlockLists, onSaveSettings
}) => {
  const [editingBlockList, setEditingBlockList] = useState<BlockList | null>(null);
  const [editingFocusList, setEditingFocusList] = useState<FocusList | null>(null);
  const [currentTab, setCurrentTab] = useState<'general' | 'lists'>('lists');

  // --- Helper Functions ---
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

  const createNewBlock = () => setEditingBlockList({ id: `bl_${Date.now()}`, name: '', sites: [], type: 'block' });
  const deleteBlock = (id: string) => { if(confirm('Remover?')) onSaveBlockLists(blockLists.filter(l => l.id !== id)); };
  const createNewFocus = () => setEditingFocusList({ id: `fl_${Date.now()}`, name: '', focusMinutes: 25, breakMinutes: 5, blockListId: blockLists[0]?.id || '' });
  const deleteFocus = (id: string) => { if(confirm('Remover?')) onSaveFocusLists(focusLists.filter(l => l.id !== id)); };
  
  const updateSetting = (key: keyof UserSettings, value: any) => {
      const newSettings = { ...settings, [key]: value };
      onSaveSettings(newSettings);
      
      // Preview Sound
      if (key === 'notificationSound' && value !== 'none') {
          const track = NOTIFICATION_SOUNDS.find(s => s.id === value);
          if (track && track.url) {
              new Audio(track.url).play().catch(e => console.warn("Audio preview error", e));
          }
      }
  };

  // --- EDITOR MODES ---
  if (editingBlockList) {
      return (
          <div className="view-scroll animate-in">
              <h2 className="h1-hero">Editar Lista</h2>
              <form onSubmit={saveBlockList} className="flex flex-col gap-4 flex-1">
                  <div>
                    <label className="h2-section">Nome</label>
                    <input className="input-field" placeholder="Ex: Redes Sociais" value={editingBlockList.name} onChange={e => setEditingBlockList({...editingBlockList, name: e.target.value})} required autoFocus />
                  </div>
                  <div>
                    <label className="h2-section">Tipo de Lista</label>
                    <div className="grid grid-cols-2 gap-3">
                      <div className={`card card-interactive flex flex-col items-center p-3 border ${editingBlockList.type === 'block' ? 'border-danger bg-danger-dim/20' : 'border-subtle'}`} onClick={() => setEditingBlockList({...editingBlockList, type: 'block'})}>
                         <span className="text-danger text-lg mb-1">⛔</span>
                         <span className="text-xs font-bold text-white">Bloqueio</span>
                      </div>
                      <div className={`card card-interactive flex flex-col items-center p-3 border ${editingBlockList.type === 'allow' ? 'border-primary bg-primary-dim/20' : 'border-subtle'}`} onClick={() => setEditingBlockList({...editingBlockList, type: 'allow'})}>
                         <span className="text-primary text-lg mb-1">✅</span>
                         <span className="text-xs font-bold text-white">Whitelist</span>
                      </div>
                    </div>
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
                    <label className="h2-section">Lista de Sites</label>
                    <select className="input-field" style={{appearance: 'none', color: editingFocusList.blockListId ? 'white' : 'gray'}} value={editingFocusList.blockListId} onChange={e => setEditingFocusList({...editingFocusList, blockListId: e.target.value})}>
                        {blockLists.map(bl => <option key={bl.id} value={bl.id} style={{color:'#000'}}>{bl.type === 'allow' ? '✅ ' : '⛔ '} {bl.name}</option>)}
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
  
  // --- MAIN OPTIONS ---
  return (
    <div className="view-scroll animate-in">
      <h1 className="h1-hero">Configurações</h1>
      
      <div className="flex gap-2 mb-4">
          <Button variant={currentTab === 'lists' ? 'primary' : 'ghost'} size="sm" onClick={() => setCurrentTab('lists')}>Listas</Button>
          <Button variant={currentTab === 'general' ? 'primary' : 'ghost'} size="sm" onClick={() => setCurrentTab('general')}>Notificações & Áudio</Button>
      </div>
      
      {currentTab === 'lists' ? (
          <>
            <section>
                <div className="flex justify-between items-center mb-2">
                    <span className="h2-section mb-0">Listas de Sites</span>
                    <button onClick={createNewBlock} className="text-primary text-xs font-bold px-2 py-1 bg-primary-dim rounded hover:bg-primary hover:text-black transition-colors">+ NOVO</button>
                </div>
                <div className="flex flex-col gap-2">
                    {blockLists.map(list => (
                        <div key={list.id} className="card card-interactive flex justify-between items-center group border-l-4" style={{borderLeftColor: list.type === 'allow' ? 'var(--primary)' : 'var(--danger)'}}>
                            <div className="flex items-center gap-3">
                                <div>
                                    <span className="font-medium text-sm text-white flex items-center gap-2">{list.name}</span>
                                    <div className="text-xs text-muted">{list.sites.length} sites • <span className={list.type === 'allow' ? 'text-primary' : 'text-danger'}>{list.type === 'allow' ? 'Whitelist' : 'Blocklist'}</span></div>
                                </div>
                            </div>
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
          </>
      ) : (
          <div className="flex flex-col gap-6">
              <section>
                  <h2 className="h2-section mb-3 text-primary">Notificações</h2>
                  <div className="flex flex-col gap-4">
                      <div>
                          <label className="text-xs text-muted mb-1 block">Título (Fim do Foco)</label>
                          <input className="input-field" value={settings.notificationTitleFocus} onChange={(e) => updateSetting('notificationTitleFocus', e.target.value)} />
                      </div>
                      <div>
                          <label className="text-xs text-muted mb-1 block">Título (Fim da Pausa)</label>
                          <input className="input-field" value={settings.notificationTitleBreak} onChange={(e) => updateSetting('notificationTitleBreak', e.target.value)} />
                      </div>
                      <div>
                          <label className="text-xs text-muted mb-1 block">Som da Notificação</label>
                          <select className="input-field" style={{appearance:'none', color: '#fff'}} value={settings.notificationSound} onChange={(e) => updateSetting('notificationSound', e.target.value)}>
                              {NOTIFICATION_SOUNDS.map(sound => (
                                  <option key={sound.id} value={sound.id} style={{color: '#000'}}>{sound.name}</option>
                              ))}
                          </select>
                      </div>
                  </div>
              </section>
              
              <section>
                  <h2 className="h2-section mb-3 text-emerald-400">Música de Foco (Brainwave)</h2>
                  <div className="card border-primary/20 bg-primary-dim/5">
                      <div className="toggle-row border-none bg-transparent p-0 mb-4" onClick={() => updateSetting('focusMusicEnabled', !settings.focusMusicEnabled)}>
                          <div>
                            <div className="font-bold text-sm text-white">Ativar Música de Foco</div>
                            <div className="text-xs text-muted mt-0.5">Toca automaticamente durante o ciclo</div>
                          </div>
                          <div className={`toggle-switch ${settings.focusMusicEnabled ? 'active' : ''}`}>
                            <div className="toggle-dot" />
                          </div>
                      </div>
                      
                      {settings.focusMusicEnabled && (
                          <div className="flex flex-col gap-3 animate-in">
                              <div>
                                  <label className="text-xs text-muted mb-1 block">Faixa de Áudio</label>
                                  <select className="input-field bg-black/20" style={{appearance:'none', color: '#fff'}} value={settings.focusMusicTrack} onChange={(e) => updateSetting('focusMusicTrack', e.target.value)}>
                                      {FOCUS_MUSIC_TRACKS.map(track => (
                                          <option key={track.id} value={track.id} style={{color: '#000'}}>{track.name}</option>
                                      ))}
                                  </select>
                              </div>
                              <div>
                                  <label className="text-xs text-muted mb-1 block">Volume: {Math.round(settings.focusMusicVolume * 100)}%</label>
                                  <input 
                                    type="range" 
                                    min="0" max="1" step="0.1" 
                                    value={settings.focusMusicVolume} 
                                    onChange={(e) => updateSetting('focusMusicVolume', parseFloat(e.target.value))}
                                    className="w-full h-2 bg-highlight rounded-lg appearance-none cursor-pointer"
                                  />
                              </div>
                          </div>
                      )}
                  </div>
              </section>
          </div>
      )}
    </div>
  );
};
