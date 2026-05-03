export const CROWD_LEVELS = ['Low', 'Moderate', 'High', 'Very High'] as const;

export const CROWD_COLORS = {
  text: ['text-emerald-400', 'text-amber-400', 'text-orange-400', 'text-red-400'],
  marker: ['#10b981','#f59e0b','#f97316','#ef4444'],
  bg: [
    'bg-emerald-500/10 border-emerald-500/20', 
    'bg-amber-500/10 border-amber-500/20', 
    'bg-orange-500/10 border-orange-500/20', 
    'bg-red-500/10 border-red-500/20'
  ]
};

export const MAP_STYLES = [
  { elementType: 'geometry', stylers: [{ color: '#0b1120' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#64748b' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#0b1120' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#1e2a45' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#04080f' }] },
  { featureType: 'poi', stylers: [{ visibility: 'off' }] },
  { featureType: 'transit', stylers: [{ visibility: 'off' }] },
];
