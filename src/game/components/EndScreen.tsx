import React from 'react';
import { ResourceState, VictoryType } from '../types';

interface EndScreenProps {
  status: 'gameover' | 'victory';
  victoryType: VictoryType | null;
  resources: ResourceState;
  onRestart: () => void;
  onPlaySound: (type: any) => void;
  onExit: () => void;
  playerName: string;
}

const EndScreen: React.FC<EndScreenProps> = ({ status, victoryType, resources, onRestart, onPlaySound, onExit, playerName }) => {
  const isVictory = status === 'victory';
  const getEndingDetails = () => {
    if (!isVictory) return { title: "YOU DIED", subtitle: "OUT OF PROVISIONS", description: "The sand dunes claim your wagons.", color: "#ff5555", icon: "💀" };
    switch (victoryType) {
      case 'hero': return { title: "SAVIOR OF THE ROADS", subtitle: "LEGENDARY STATUS", description: "You arrived with little gold, but the cheers of the villagers shake the sky.", color: "#55ff55", icon: "⭐" };
      case 'merchant_prince': return { title: "MERCHANT PRINCE", subtitle: "WEALTHY & WISE", description: "Your wagons are heavy with gold. You played the roads perfectly.", color: "#ffff55", icon: "👑" };
      case 'iron_monger': return { title: "THE IRON MONGER", subtitle: "PROFIT AT ANY COST", description: "Mountains of gold, but few friends behind.", color: "#aaaaaa", icon: "⚔️" };
      default: return { title: "HUMBLE SURVIVOR", subtitle: "JOURNEY ENDED", description: "You made it. Staying in one piece is a victory in itself.", color: "#ffffff", icon: "🏠" };
    }
  };
  const details = getEndingDetails();

  return (
    <div className="absolute inset-0 bg-black/90 flex items-center justify-center p-6 z-[100]">
      <div className="max-w-3xl w-full border-4 border-black overflow-hidden">
        <div className="p-10 text-center border-b-4 border-black relative" style={{ backgroundColor: details.color + '22' }}>
          <div className="absolute top-2 right-4 text-6xl opacity-20">{details.icon}</div>
          <h1 className="text-6xl md:text-8xl font-black uppercase leading-none mb-2" style={{ color: details.color }}>{details.title}</h1>
          <p className="text-2xl font-bold text-white/60 tracking-[0.4em] uppercase">{details.subtitle}</p>
          <p className="text-lg text-white/40 mt-2">Player: {playerName}</p>
        </div>
        <div className="p-8 bg-[#c6c6c6] space-y-8">
          <div className="bg-[#8b8b8b] p-6 border-4 border-black"><p className="text-2xl text-stone-900 font-bold leading-relaxed text-center italic">"{details.description}"</p></div>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-[#484848] border-4 border-black p-4 flex flex-col items-center"><span className="text-white/40 text-[10px] font-bold uppercase">Renown</span><span className="text-3xl text-blue-400 font-bold">{resources.reputation}</span></div>
            <div className="bg-[#484848] border-4 border-black p-4 flex flex-col items-center"><span className="text-white/40 text-[10px] font-bold uppercase">Wealth</span><span className="text-3xl text-yellow-400 font-bold">{resources.gold}G</span></div>
            <div className="bg-[#484848] border-4 border-black p-4 flex flex-col items-center"><span className="text-white/40 text-[10px] font-bold uppercase">Regions</span><span className="text-3xl text-emerald-400 font-bold">{resources.journeyCount}</span></div>
          </div>
          <div className="flex gap-4">
            <button onClick={() => { onPlaySound('confirm'); onRestart(); }} className="flex-1 text-3xl py-6 bg-emerald-700 hover:bg-emerald-600 border-4 border-black text-white font-black uppercase">RESPAWN</button>
            <button onClick={onExit} className="flex-1 text-3xl py-6 bg-amber-700 hover:bg-amber-600 border-4 border-black text-white font-black uppercase">EXIT</button>
          </div>
        </div>
        <div className="bg-[#313131] p-3 text-center border-t-4 border-black"><span className="text-white/20 text-xs font-bold uppercase">Seed: {Math.floor(Math.random() * 9999999)}</span></div>
      </div>
    </div>
  );
};

export default EndScreen;
