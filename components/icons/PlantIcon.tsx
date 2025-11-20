
import React from 'react';

interface PlantIconProps {
  growth: number; // 0 to 1
  className?: string;
  status?: 'alive' | 'withered';
}

export const PlantIcon: React.FC<PlantIconProps> = ({ growth, className, status = 'alive' }) => {
  const stage = Math.min(Math.floor(growth * 5), 4);
  const isWithered = status === 'withered';
  
  const potColor = "#A16207"; // Amber-800
  const stemColor = isWithered ? "#64748B" : "#10B981"; // Slate-500 (dry) vs Emerald (alive)
  const leafColor = isWithered ? "#94A3B8" : "#10B981"; // Slate-400 vs Emerald
  const flowerColor = isWithered ? "#CBD5E1" : "#34D399"; // Slate-300 vs Emerald-light
  
  const pot = <path d="M14 18H2v2h12v-2zM12 14H4a2 2 0 00-2 2v2h12v-2a2 2 0 00-2-2z" fill={potColor}/>;

  const stages = [
    // Stage 0: Seed
    <circle key="0" cx="8" cy="16" r="1.5" fill={stemColor} opacity={0.5} />,
    // Stage 1: Sprout
    <path key="1" d="M8 16v-3c0-1.1.9-2 2-2h0" stroke={stemColor} strokeWidth="1.5" strokeLinecap="round" />,
    // Stage 2: Sapling
    <g key="2">
      <path d="M8 16v-5c0-1.66 1.34-3 3-3" stroke={stemColor} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M8 12c-1.1 0-2 .9-2 2s.9 2 2 2" fill={leafColor} />
    </g>,
    // Stage 3: Small Plant
    <g key="3">
      <path d="M8 16V7c0-1.1.9-2 2-2" stroke={stemColor} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M8 13c-1.1 0-2 .9-2 2s.9 2 2 2z" fill={leafColor} />
      <path d="M8 9.5c1.1 0 2-.9 2-2s-.9-2-2-2z" fill={leafColor} />
    </g>,
    // Stage 4: Full Plant
    <g key="4">
      <path d="M8 16V6" stroke={stemColor} strokeWidth="2" strokeLinecap="round" />
      <ellipse cx="6" cy="11" rx="2.5" ry="2" fill={leafColor} transform={`rotate(${isWithered ? -60 : -30} 6 11)`} />
      <ellipse cx="10" cy="8" rx="2.5" ry="2" fill={leafColor} transform={`rotate(${isWithered ? 60 : 30} 10 8)`} />
      <circle cx="8" cy="5" r="2" fill={flowerColor} />
    </g>
  ];

  return (
    <svg viewBox="0 0 16 20" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {pot}
      <g style={{ transition: 'all 0.5s ease-in-out' }}>
        {stages[stage]}
      </g>
    </svg>
  );
};
