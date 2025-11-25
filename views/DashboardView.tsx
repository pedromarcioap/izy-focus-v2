import { React, useState, useEffect, BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from '../libs/deps.js';
import type { GardenPlant, CycleStat } from '../types';
import { getAIInsights } from '../services/geminiService';
import { PlantIcon } from '../components/icons/PlantIcon';

interface DashboardViewProps {
  garden: GardenPlant[];
  stats: CycleStat[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="card p-3 shadow-lg" style={{ backgroundColor: '#18181b', borderColor: '#27272a', minWidth: '150px' }}>
        <p className="text-xs font-bold text-muted mb-2 border-b border-subtle pb-1">{label}</p>
        <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                    <span className="text-xs text-white">Completos</span>
                </div>
                <span className="text-sm font-bold text-primary">{data.completed}</span>
            </div>
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{backgroundColor: '#3f3f46'}}></div>
                    <span className="text-xs text-muted">Interrompidos</span>
                </div>
                <span className="text-sm font-bold text-muted">{data.interrupted}</span>
            </div>
        </div>
      </div>
    );
  }
  return null;
};

export const DashboardView = ({ garden, stats }: DashboardViewProps) => {
    const [insight, setInsight] = useState('Conectando com a natureza...');
    
    const alivePlants = garden.filter(p => p.status === 'alive');
    const witheredPlants = garden.filter(p => p.status === 'withered');

    useEffect(() => {
        const fetchInsight = async () => {
            if (stats.length > 0) {
                const newInsight = await getAIInsights(stats);
                setInsight(newInsight);
            } else {
                setInsight("Complete seu primeiro ciclo para receber insights.");
            }
        };
        fetchInsight();
    }, [stats]);

    return (
        <div className="page-container animate-in">
            <h1 className="title-hero">Jardim</h1>
            
            {/* Stats Overview */}
            <div className="grid grid-cols-2 gap-3">
                <div className="card-glass flex flex-col items-center justify-center p-4 bg-primary/5 border-primary/20">
                    <span className="text-3xl font-bold text-primary">{alivePlants.length}</span>
                    <span className="text-xs text-muted uppercase tracking-wider mt-1">Vivas</span>
                </div>
                <div className="card-glass flex flex-col items-center justify-center p-4 bg-white/5">
                    <span className="text-3xl font-bold text-white opacity-50">{witheredPlants.length}</span>
                    <span className="text-xs text-muted uppercase tracking-wider mt-1">Murchas</span>
                </div>
            </div>

            {/* Garden Grid */}
            <div>
                <span className="text-label mb-2 px-1">Sua Coleção</span>
                <div className="grid grid-cols-4 gap-2 p-3 rounded-xl bg-black/20 border border-dim max-h-48 overflow-y-auto">
                    {alivePlants.map(plant => (
                        <div key={plant.id} className="aspect-square flex justify-center items-center bg-white/5 rounded-lg border border-white/5 hover:border-primary/30 transition-colors">
                            <PlantIcon growth={1} status="alive" className="w-8 h-8 drop-shadow-lg" />
                        </div>
                    ))}
                    {garden.length === 0 && (
                        <div className="col-span-4 py-8 text-center">
                            <p className="text-sm text-muted opacity-60">Seu jardim está esperando a primeira semente.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* AI Insight */}
             <div className="card-glass border-l-4 border-l-emerald-500 relative group">
                <div className="absolute top-2 right-2 p-2 opacity-20 group-hover:opacity-40 transition-opacity pointer-events-none">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-emerald-400"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" /></svg>
                </div>
                <p className="text-xs uppercase font-bold text-emerald-400 mb-2 tracking-wide">Insight da IA</p>
                <p className="text-sm text-white opacity-90 leading-relaxed italic pr-14 break-words whitespace-pre-wrap">"{insight}"</p>
            </div>

            {/* Chart */}
            <div className="w-full flex flex-col">
               <span className="text-label mb-2 px-1">Performance Semanal</span>
               <div className="w-full h-48 card-glass p-2">
                   <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={stats}>
                        <XAxis 
                            dataKey="date" 
                            tick={{ fill: '#71717a', fontSize: 9 }} 
                            tickFormatter={(val) => val.substring(5)} 
                            axisLine={false} 
                            tickLine={false} 
                        />
                        <Tooltip 
                            content={<CustomTooltip />}
                            cursor={{fill: 'rgba(255,255,255,0.05)'}} 
                        />
                        <Bar dataKey="completed" fill="#34d399" radius={[4, 4, 0, 0]} stackId="a" />
                        <Bar dataKey="interrupted" fill="#3f3f46" radius={[4, 4, 0, 0]} stackId="a" />
                        </BarChart>
                    </ResponsiveContainer>
               </div>
            </div>
        </div>
    );
};