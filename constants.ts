
import type { FocusList, BlockList, GardenPlant, CycleStat, UserSettings, AudioTrack } from './types';

export const COLORS = {
  darkNavy: '#0F172A',
  emerald: '#10B981',
  amber: '#F59E0B',
  purple: '#A855F7',
  slate: {
    '100': '#F1F5F9',
    '300': '#CBD5E1',
    '400': '#94A3B8',
    '500': '#64748B',
    '600': '#475569',
    '700': '#334155',
    '800': '#1E293B',
  }
};

export const INITIAL_BLOCK_LISTS: BlockList[] = [
  { id: 'bl1', name: 'Redes Sociais', sites: ['twitter.com', 'facebook.com', 'instagram.com', 'reddit.com'], type: 'block' },
  { id: 'bl2', name: 'Notícias e Entretenimento', sites: ['youtube.com', 'netflix.com', 'cnn.com', 'g1.globo.com'], type: 'block' },
  { id: 'bl3', name: 'Bloquear Tudo', sites: ['*'], type: 'block' },
  { id: 'wl1', name: 'Modo Trabalho (Permitidos)', sites: ['google.com', 'docs.google.com', 'notion.so', 'slack.com'], type: 'allow' },
];

export const INITIAL_FOCUS_LISTS: FocusList[] = [
  { id: 'fl1', name: 'Estudo 45 min', focusMinutes: 45, breakMinutes: 10, blockListId: 'bl1' },
  { id: 'fl2', name: 'Foco Profundo 60 min', focusMinutes: 60, breakMinutes: 15, blockListId: 'bl2' },
  { id: 'fl3', name: 'Leitura Rápida 25/5', focusMinutes: 25, breakMinutes: 5, blockListId: 'bl1' },
  { id: 'fl4', name: 'Trabalho Leve', focusMinutes: 30, breakMinutes: 5, blockListId: 'bl1' },
];

export const INITIAL_GARDEN: GardenPlant[] = [
    { id: 1, type: 'sapling', date: '2023-10-26', status: 'alive' },
    { id: 2, type: 'flower', date: '2023-10-27', status: 'alive' },
    { id: 3, type: 'tree', date: '2023-10-28', status: 'alive' },
];

export const INITIAL_STATS: CycleStat[] = [
    { date: '2023-10-26', completed: 3, interrupted: 1, emergencyAccess: { 'youtube.com': 1 } },
    { date: '2023-10-27', completed: 5, interrupted: 0, emergencyAccess: {} },
    { date: '2023-10-28', completed: 4, interrupted: 2, emergencyAccess: { 'reddit.com': 2 } },
];

export const MICRO_BREAK_SUGGESTIONS = [
    "Alongue as costas e os ombros",
    "Beba um copo d'água gelada",
    "Olhe para um ponto distante por 20s",
    "Respire fundo 5 vezes (inspire 4s, expire 4s)",
    "Dê uma volta rápida pelo ambiente",
];

// --- Audio Assets ---
// Using reliable CDN links for demo purposes. In production, these would be local assets.
export const NOTIFICATION_SOUNDS: AudioTrack[] = [
    { id: 'bell', name: 'Sino Zen', url: 'https://cdn.freesound.org/previews/339/339816_5121236-lq.mp3' },
    { id: 'chime', name: 'Carrilhão Suave', url: 'https://cdn.freesound.org/previews/352/352651_4019029-lq.mp3' },
    { id: 'success', name: 'Sucesso Digital', url: 'https://cdn.freesound.org/previews/270/270404_5123851-lq.mp3' },
    { id: 'none', name: 'Silencioso', url: '' }
];

export const FOCUS_MUSIC_TRACKS: AudioTrack[] = [
    { id: 'brown', name: 'Brown Noise (Profundo)', url: 'https://cdn.pixabay.com/download/audio/2022/11/03/audio_c9937f643d.mp3' },
    { id: 'white', name: 'White Noise (Foco)', url: 'https://cdn.pixabay.com/download/audio/2021/08/09/audio_0555827922.mp3' },
    { id: 'alpha', name: 'Ondas Alpha (Relax)', url: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3' },
    { id: 'rain', name: 'Chuva Suave', url: 'https://cdn.pixabay.com/download/audio/2022/02/15/audio_bd1c5d8f5d.mp3' },
    { id: 'lofi', name: 'Lo-Fi Study', url: 'https://cdn.pixabay.com/download/audio/2022/05/05/audio_132476e3c5.mp3' }
];

export const DEFAULT_SETTINGS: UserSettings = {
    notificationTitleFocus: "Ciclo Concluído!",
    notificationTitleBreak: "Hora de Voltar!",
    notificationSound: 'bell',
    focusMusicEnabled: false,
    focusMusicTrack: 'brown',
    focusMusicVolume: 0.5
};
