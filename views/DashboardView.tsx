
import React, { useState, useEffect } from 'react';
import type { GardenPlant, CycleStat } from '../types';
import { getAIInsights } from '../services/geminiService';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { PlantIcon } from '../components/icons/PlantIcon';

interface DashboardViewProps {
  garden: GardenPlant[];
  stats: CycleStat[];
}

const ChartCard: React.FC<{title: string; children: React.ReactNode}> = ({title, children}) => (
    <div className="bg-slate-800 p-4 rounded-xl">
        <h3 className="font-semibold text-slate-200 mb-4">{title}</h3>
        <div className="h-48">
            {children}
        </div>
    </div>
);

export const DashboardView: React.FC<DashboardViewProps> = ({ garden, stats }) => {
    const [insight, setInsight] = useState<string>('Analisando seu progresso...');
    const [isLoadingInsight, setIsLoadingInsight] = useState(true);

    const alivePlants = garden.filter(p => p.status === 'alive');
    const witheredPlants = garden.filter(p => p.status === 'withered');

    useEffect(() => {
        const fetchInsight = async () => {
            setIsLoadingInsight(true);
            const newInsight = await getAIInsights(stats);
            setInsight(newInsight);
            setIsLoadingInsight(false);
        };
        fetchInsight();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [stats]);

    return (
        <div className="p-6 h-full overflow-y-auto animate-fade-in">
            <h1 className="text-3xl font-bold text-slate-100 mb-2">Seu Jardim</h1>
            <p className="text-slate-400 mb-6">Veja como seu foco cresceu.</p>

            <div className="bg-slate-800 p-4 rounded-xl mb-6">
                <h3 className="font-semibold text-slate-200 mb-2">Plantas Cultivadas ({alivePlants.length})</h3>
                <div className="flex flex-wrap gap-4 max-h-40 overflow-y-auto">
                    {alivePlants.map(plant => (
                        <div key={plant.id} className="flex flex-col items-center">
                            <PlantIcon growth={1} status="alive" className="w-12 h-12" />
                            <span className="text-[10px] text-slate-500 mt-1">{plant.date.substring(5)}</span>
                        </div>
                    ))}
                    {alivePlants.length === 0 && <p className="text-slate-500 text-sm italic">Complete um ciclo para plantar.</p>}
                </div>
                
                {witheredPlants.length > 0 && (
                    <div className="mt-6 border-t border-slate-700 pt-4">
                        <h3 className="font-semibold text-slate-400 mb-2 text-sm">Plantas Murchas (Desistências)</h3>
                        <div className="flex flex-wrap gap-4">
                            {witheredPlants.map(plant => (
                                <div key={plant.id} className="flex flex-col items-center opacity-70">
                                    <PlantIcon growth={1} status="withered" className="w-10 h-10" />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <div className="space-y-6">
                 <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-4 rounded-xl shadow-lg">
                    <h3 className="font-bold text-white mb-2 text-sm uppercase tracking-wide">Coach IA</h3>
                    {isLoadingInsight ? 
                        <div className="space-y-2">
                            <div className="h-2 bg-white/20 rounded w-3/4 animate-pulse"></div>
                            <div className="h-2 bg-white/20 rounded w-1/2 animate-pulse"></div>
                        </div> :
                        <p className="text-white text-sm leading-relaxed italic">"{insight}"</p>
                    }
                </div>

                <ChartCard title="Histórico de Ciclos">
                   <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={stats} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis dataKey="date" tick={{ fill: '#94A3B8' }} fontSize={10} tickFormatter={(val) => val.substring(5)} />
                        <YAxis tick={{ fill: '#94A3B8' }} fontSize={10} allowDecimals={false} />
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#1E293B', border: '1px solid #334155', color: '#F1F5F9' }} 
                            labelStyle={{ color: '#94A3B8' }}
                        />
                        <Bar dataKey="completed" name="Completos" fill="#10B981" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="interrupted" name="Interrompidos" fill="#64748B" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartCard>
            </div>
        </div>
    );
};
