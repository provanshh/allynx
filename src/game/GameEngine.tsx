import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ResourceState, GameStatus, Encounter, Choice, VictoryType, NPC, Passenger, ControlMode, Bullet, VehicleType, ThemeType } from './types';
import { INITIAL_RESOURCES, PLAYER_SPEED, SCROLL_SPEED, FOOD_DRAIN_RATE, WORLD_WIDTH, WORLD_HEIGHT, ROAD_TOP, ROAD_BOTTOM, INTERACTION_RANGE } from './constants';
import { ENCOUNTERS } from './gameData';
import GameCanvas from './components/GameCanvas';
import ChoiceModal from './components/ChoiceModal';
import UIOverlay from './components/UIOverlay';
import EndScreen from './components/EndScreen';
import VehicleModal from './components/VehicleModal';
import LotteryModal from './components/LotteryModal';

let audioCtx: AudioContext | null = null;
let bgmGain: GainNode | null = null;
let ambientGain: GainNode | null = null;
let isBgmPlaying = false;

const BASE_BGM_GAIN = 0.6;
const BASE_AMBIENT_GAIN = 0.6;

const initAudio = () => {
  if (!audioCtx) audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
};

const playSound = (type: string) => {
  if (!audioCtx) return;
  const now = audioCtx.currentTime;
  const createOsc = (freq: number, oscType: OscillatorType, startTime: number, duration: number, gainValue: number) => {
    const osc = audioCtx!.createOscillator();
    const gain = audioCtx!.createGain();
    osc.type = oscType; osc.frequency.setValueAtTime(freq, startTime);
    gain.gain.setValueAtTime(gainValue, startTime); gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
    osc.connect(gain); gain.connect(audioCtx!.destination); osc.start(startTime); osc.stop(startTime + duration);
  };
  switch(type) {
    case 'spin': createOsc(220 + Math.random() * 220, 'sawtooth', now, 0.05, 0.05); break;
    case 'win': [523,659,783,1046].forEach((f,i) => createOsc(f,'sine',now+i*0.1,0.4,0.1)); break;
    case 'coin': createOsc(987.77,'sine',now,0.1,0.15); createOsc(1318.51,'sine',now+0.05,0.15,0.15); break;
    case 'money': for(let i=0;i<4;i++) createOsc(1500+Math.random()*2000,'triangle',now+i*0.04,0.1,0.1); break;
    case 'shoot': { const o=audioCtx.createOscillator();const g=audioCtx.createGain();o.type='sawtooth';o.frequency.setValueAtTime(440,now);o.frequency.exponentialRampToValueAtTime(80,now+0.15);g.gain.setValueAtTime(0.1,now);g.gain.linearRampToValueAtTime(0,now+0.15);o.connect(g);g.connect(audioCtx.destination);o.start(now);o.stop(now+0.15);break; }
    case 'impact': { const o=audioCtx.createOscillator();const g=audioCtx.createGain();o.type='square';o.frequency.setValueAtTime(120,now);o.frequency.exponentialRampToValueAtTime(40,now+0.1);g.gain.setValueAtTime(0.1,now);g.gain.linearRampToValueAtTime(0,now+0.1);o.connect(g);g.connect(audioCtx.destination);o.start(now);o.stop(now+0.1);break; }
    case 'select': createOsc(440,'square',now,0.1,0.1); break;
    case 'confirm': createOsc(523.25,'triangle',now,0.2,0.2); break;
    case 'trade': [440,554,659].forEach((f,i)=>createOsc(f,'sawtooth',now+i*0.05,0.2,0.05)); break;
    case 'collision': createOsc(100,'square',now,0.3,0.1); break;
    case 'hurt': createOsc(80,'sawtooth',now,0.5,0.2); break;
    case 'gameover': createOsc(120,'sawtooth',now,1.5,0.3); break;
    case 'victory': [523,659,783,1046,1318].forEach((f,i)=>createOsc(f,'triangle',now+i*0.1,0.6,0.1)); break;
    case 'onboard': createOsc(440,'triangle',now,0.3,0.2); break;
  }
};

interface GameEngineProps {
  playerName: string;
  onGameEnd: (score: number, gold: number, reputation: number) => void;
  onExit: () => void;
}

const GameEngine: React.FC<GameEngineProps> = ({ playerName, onGameEnd, onExit }) => {
  const [status, setStatus] = useState<GameStatus>('playing');
  const [controlMode, setControlMode] = useState<ControlMode>('caravan');
  const [theme] = useState<ThemeType>('desert');
  const [isPaused, setIsPaused] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [victoryType, setVictoryType] = useState<VictoryType | null>(null);
  const [resources, setResources] = useState<ResourceState>(INITIAL_RESOURCES);
  const [playerPos, setPlayerPos] = useState({ x: 200, y: 300 });
  const [personPos, setPersonPos] = useState({ x: 200, y: 300 });
  const [npcs, setNpcs] = useState<NPC[]>([]);
  const [bullets, setBullets] = useState<Bullet[]>([]);
  const [scrollOffset, setScrollOffset] = useState(0);
  const [activeEncounter, setActiveEncounter] = useState<Encounter | null>(null);
  const [lastChoiceResult, setLastChoiceResult] = useState<string | null>(null);
  const [flags, setFlags] = useState<Set<string>>(new Set());
  const [pendingAction, setPendingAction] = useState<'continue_journey' | 'end_journey' | 'remove_passenger' | null>(null);
  const [notifications, setNotifications] = useState<{id: number, message: string}[]>([]);
  const [replacementTarget, setReplacementTarget] = useState<Passenger | null>(null);
  const [musicVolume, setMusicVolume] = useState(0.5);
  const [ambientVolume, setAmbientVolume] = useState(0.5);
  const [isMouseControlEnabled, setIsMouseControlEnabled] = useState(false);

  const keys = useRef<Set<string>>(new Set());
  const requestRef = useRef<number>();
  const spawnTimer = useRef<number>(0);
  const mousePos = useRef({ x: 200, y: 300 });

  useEffect(() => {
    initAudio();
    // Start BGM
    if (!isBgmPlaying && audioCtx) {
      isBgmPlaying = true;
      bgmGain = audioCtx.createGain();
      bgmGain.gain.setValueAtTime(0, audioCtx.currentTime);
      bgmGain.gain.linearRampToValueAtTime(BASE_BGM_GAIN * musicVolume * 0.15, audioCtx.currentTime + 3);
      bgmGain.connect(audioCtx.destination);
      let step = 0;
      const loop = () => {
        if (!isBgmPlaying || !audioCtx) return;
        const now = audioCtx.currentTime;
        if (step % 4 === 0) {
          const kOsc = audioCtx.createOscillator(); kOsc.frequency.setValueAtTime(150, now); kOsc.frequency.exponentialRampToValueAtTime(0.01, now + 0.1);
          const kEnv = audioCtx.createGain(); kEnv.gain.setValueAtTime(0.2, now); kEnv.gain.linearRampToValueAtTime(0, now + 0.1);
          kOsc.connect(kEnv); kEnv.connect(bgmGain!); kOsc.start(); kOsc.stop(now + 0.1);
        }
        step++; setTimeout(loop, 220);
      };
      loop();
      // Ambient
      ambientGain = audioCtx.createGain();
      ambientGain.gain.setValueAtTime(0, audioCtx.currentTime);
      ambientGain.gain.linearRampToValueAtTime(BASE_AMBIENT_GAIN * ambientVolume * 0.2, audioCtx.currentTime + 2);
      ambientGain.connect(audioCtx.destination);
    }
    addNotification(`Welcome ${playerName}! Game started.`);
    return () => { isBgmPlaying = false; if (bgmGain && audioCtx) { bgmGain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 1); bgmGain = null; } if (ambientGain && audioCtx) { ambientGain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 1); ambientGain = null; } };
  }, []);

  const addNotification = (message: string) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message }]);
    setTimeout(() => setNotifications(prev => prev.filter(n => n.id !== id)), 5000);
  };

  const spawnNPC = useCallback(() => {
    const rand = Math.random();
    let type: NPC['type'] = 'trader'; let eId = ''; let passenger: Passenger | undefined;
    if (rand < 0.12) { type = 'mystery_box'; eId = 'mystery'; }
    else if (rand < 0.28) { type = 'coin'; eId = Math.random() < 0.1 ? 'big_coin' : 'small_coin'; }
    else if (rand < 0.55 && resources.progress < 90) {
      type = 'person';
      const pType = (['merchant','cook','scholar','guard'] as const)[Math.floor(Math.random()*4)];
      passenger = { id: Math.random().toString(), name: "Traveler", type: pType, bonusText: "Ready for hire" };
    } else {
      const pool = Object.keys(ENCOUNTERS).filter(k => k !== 'waystation' && k !== 'haven_checkpoint');
      eId = pool[Math.floor(Math.random() * pool.length)];
      if (resources.progress > 45 && resources.progress < 55) eId = 'waystation';
      if (resources.progress >= 95) eId = 'haven_checkpoint';
      type = eId === 'haven_checkpoint' ? 'haven' : 'trader';
    }
    const newNpc: NPC = {
      id: Math.random().toString(), x: WORLD_WIDTH + 100,
      y: ROAD_TOP + Math.random() * (ROAD_BOTTOM - ROAD_TOP - 40),
      type, encounterId: eId, width: type === 'coin' || type === 'mystery_box' ? 32 : 48, height: type === 'coin' || type === 'mystery_box' ? 32 : 48,
      speedMultiplier: 0.5 + Math.random() * 0.5, passengerData: passenger
    };
    setNpcs(prev => [...prev, newNpc]);
  }, [resources.progress]);

  const generatePassengerTradeEncounter = (): Encounter => {
    const choices: Choice[] = resources.passengers.map(p => {
      let c: Choice = { id: `trade_${p.id}`, text: `Trade with ${p.name}`, consequenceText: "Deal done.", color: 'bg-emerald-700' };
      if (p.type === 'merchant') { c.text = 'Exchange 15⭐ for 60💰'; c.reputationCost = 15; c.goldGain = 60; c.color = 'bg-yellow-700'; }
      else if (p.type === 'cook') { c.text = 'Buy Food (20💰 -> 40🥩)'; c.goldCost = 20; c.foodGain = 40; c.color = 'bg-orange-700'; }
      else if (p.type === 'scholar') { c.text = 'Donate (30💰 -> 25⭐)'; c.goldCost = 30; c.reputationGain = 25; c.color = 'bg-indigo-700'; }
      else if (p.type === 'guard') { c.text = 'Training (10🥩 -> 10⭐)'; c.foodCost = 10; c.reputationGain = 10; c.color = 'bg-slate-700'; }
      return c;
    });
    return { id: 'passenger_trade', title: 'CREW CARAVAN TRADE', description: 'Your crew gathers. "We have supplies to swap, Boss."', icon: '🤝', choices: choices.length > 0 ? choices : [{ id: 'no_pass', text: 'Empty wagon...', consequenceText: 'Nothing to trade.', color: 'bg-stone-800' }] };
  };

  const generateReplacementEncounter = (newPass: Passenger): Encounter => ({
    id: 'passenger_replacement', title: 'CRITICAL REPLACEMENT',
    description: `The caravan is full, but this ${newPass.type.toUpperCase()} offers 50 GOLD to join.`,
    icon: '💰',
    choices: [
      { id: 'confirm_replacement', text: 'Accept Bounty (50G) & Replace', consequenceText: 'Replacement complete.', color: 'bg-yellow-600', goldGain: 50 },
      { id: 'cancel_replacement', text: 'No, my crew is family.', consequenceText: 'The traveler wanders off.', color: 'bg-stone-600' }
    ]
  });

  const stopAllAudio = () => {
    isBgmPlaying = false;
    if (bgmGain && audioCtx) { bgmGain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 1); bgmGain = null; }
    if (ambientGain && audioCtx) { ambientGain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 1); ambientGain = null; }
  };

  const gameLoop = useCallback(() => {
    if (status !== 'playing' || isPaused || showSettings) { requestRef.current = requestAnimationFrame(gameLoop); return; }
    let vSpeedMult = 1.0, vFoodMult = 1.0;
    switch(resources.vehicle) { case 'bike': vSpeedMult = 1.4; vFoodMult = 0.8; break; case 'car': vSpeedMult = 1.2; break; case 'truck': vSpeedMult = 0.8; vFoodMult = 1.2; break; case 'train': vSpeedMult = 1.6; vFoodMult = 1.8; break; }
    const currentSpeed = PLAYER_SPEED * vSpeedMult * (flags.has('speed_upgrade') ? 1.4 : 1.0);

    if (controlMode === 'person') {
      setPersonPos(prev => {
        let nx = prev.x, ny = prev.y;
        if (isMouseControlEnabled) { nx += (mousePos.current.x - prev.x) * 0.15; ny += (mousePos.current.y - prev.y) * 0.15; }
        else { if (keys.current.has('w')||keys.current.has('arrowup')) ny -= PLAYER_SPEED * 1.2; if (keys.current.has('s')||keys.current.has('arrowdown')) ny += PLAYER_SPEED * 1.2; if (keys.current.has('a')||keys.current.has('arrowleft')) nx -= PLAYER_SPEED * 1.2; if (keys.current.has('d')||keys.current.has('arrowright')) nx += PLAYER_SPEED * 1.2; }
        return { x: Math.max(0, Math.min(WORLD_WIDTH, nx)), y: Math.max(0, Math.min(WORLD_HEIGHT, ny)) };
      });
      setBullets(prev => {
        const next = prev.map(b => ({ ...b, x: b.x + b.vx, y: b.y + b.vy })).filter(b => b.x > 0 && b.x < WORLD_WIDTH && b.y > 0 && b.y < WORLD_HEIGHT);
        let hitNpcId: string | null = null; let bulletIdToRemove: string | null = null;
        for (const bullet of next) { const hit = npcs.find(n => n.type !== 'coin' && n.type !== 'haven' && n.type !== 'mystery_box' && Math.abs(n.x - bullet.x) < 30 && Math.abs(n.y - bullet.y) < 30); if (hit) { hitNpcId = hit.id; bulletIdToRemove = bullet.id; break; } }
        if (hitNpcId) { playSound('impact'); setResources(r => ({ ...r, gold: Math.max(0, r.gold - 5) })); setNpcs(n => n.filter(npc => npc.id !== hitNpcId)); return next.filter(b => b.id !== bulletIdToRemove); }
        return next;
      });
    } else {
      setPlayerPos(prev => {
        let nx = prev.x, ny = prev.y;
        if (isMouseControlEnabled) { nx += (mousePos.current.x - prev.x) * 0.1; ny += (mousePos.current.y - prev.y) * 0.1; }
        else { if (keys.current.has('w')||keys.current.has('arrowup')) ny -= currentSpeed; if (keys.current.has('s')||keys.current.has('arrowdown')) ny += currentSpeed; if (keys.current.has('a')||keys.current.has('arrowleft')) nx -= currentSpeed; if (keys.current.has('d')||keys.current.has('arrowright')) nx += currentSpeed; }
        return { x: Math.max(50, Math.min(WORLD_WIDTH - 50, nx)), y: Math.max(ROAD_TOP + 20, Math.min(ROAD_BOTTOM - 20, ny)) };
      });
      setResources(prev => {
        const isMoving = keys.current.size > 0 || isMouseControlEnabled;
        let drain = (isMoving ? FOOD_DRAIN_RATE * 2 : FOOD_DRAIN_RATE) * vFoodMult;
        if (prev.passengers.some(p => p.type === 'cook')) drain *= 0.8;
        if (flags.has('efficiency_upgrade')) drain *= 0.75;
        let nextFood = Math.max(0, prev.food - drain); let nextLives = prev.lives;
        if (nextFood <= 0) { if (nextLives > 1) { playSound('hurt'); nextLives -= 1; nextFood = 50; } else { playSound('gameover'); setStatus('gameover'); stopAllAudio(); onGameEnd(prev.gold + prev.reputation * 2, prev.gold, prev.reputation); } }
        return { ...prev, food: nextFood, lives: nextLives, progress: Math.min(100, prev.progress + ((SCROLL_SPEED * vSpeedMult) / 80)) };
      });
      setScrollOffset(prev => (prev + SCROLL_SPEED * vSpeedMult) % 100);
      setNpcs(prev => {
        const updated = prev.map(n => ({ ...n, x: n.x - SCROLL_SPEED * vSpeedMult * n.speedMultiplier })).filter(n => n.x > -150);
        const coinIdx = updated.findIndex(n => n.type === 'coin' && Math.abs(n.x - playerPos.x) < 35 && Math.abs(n.y - playerPos.y) < 35);
        if (coinIdx !== -1) { playSound('coin'); setResources(r => ({ ...r, gold: r.gold + (updated[coinIdx].encounterId === 'big_coin' ? 25 : 5) })); return updated.filter((_, i) => i !== coinIdx); }
        const mysteryIdx = updated.findIndex(n => n.type === 'mystery_box' && Math.abs(n.x - playerPos.x) < 35 && Math.abs(n.y - playerPos.y) < 35);
        if (mysteryIdx !== -1) { playSound('confirm'); setStatus('lottery'); return updated.filter((_, i) => i !== mysteryIdx); }
        const hit = updated.find(n => n.type !== 'person' && n.type !== 'coin' && n.type !== 'mystery_box' && Math.abs(n.x - playerPos.x) < 45 && Math.abs(n.y - playerPos.y) < 45);
        if (hit) { playSound('collision'); setActiveEncounter(ENCOUNTERS[hit.encounterId]); setStatus('encounter'); return updated.filter(n => n.id !== hit.id); }
        return updated;
      });
      spawnTimer.current += 16;
      if (spawnTimer.current > 1000 && resources.progress < 95) { spawnNPC(); spawnTimer.current = 0; }
    }
    requestRef.current = requestAnimationFrame(gameLoop);
  }, [status, playerPos, personPos, controlMode, npcs, spawnNPC, isPaused, showSettings, flags, resources.vehicle, resources.food, resources.lives, resources.progress, resources.passengers, isMouseControlEnabled, onGameEnd]);

  useEffect(() => { requestRef.current = requestAnimationFrame(gameLoop); return () => cancelAnimationFrame(requestRef.current!); }, [gameLoop]);

  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      if (status === 'playing' && controlMode === 'person') {
        playSound('shoot');
        setBullets(prev => [...prev, { id: Math.random().toString(), x: personPos.x + 10, y: personPos.y - 8, vx: 12, vy: 0 }]);
      }
    };
    const handleMouseMove = (e: MouseEvent) => {
      const rect = document.querySelector('svg')?.getBoundingClientRect();
      if (rect) { mousePos.current = { x: ((e.clientX - rect.left) / rect.width) * WORLD_WIDTH, y: ((e.clientY - rect.top) / rect.height) * WORLD_HEIGHT }; }
    };
    window.addEventListener('mousedown', handleMouseDown); window.addEventListener('mousemove', handleMouseMove);
    return () => { window.removeEventListener('mousedown', handleMouseDown); window.removeEventListener('mousemove', handleMouseMove); };
  }, [status, controlMode, personPos]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (key === 'escape' || (key === ' ' && status === 'playing' && !activeEncounter)) {
        if (showSettings) setShowSettings(false);
        else if (status === 'vehicle_select') setStatus('playing');
        else if (status === 'playing') setIsPaused(prev => !prev);
        playSound('select'); return;
      }
      if (key === 's' && status === 'playing') { setShowSettings(prev => !prev); playSound('select'); return; }
      if (key === 'p' && status === 'playing' && controlMode === 'caravan') { setActiveEncounter(generatePassengerTradeEncounter()); setStatus('encounter'); playSound('select'); return; }
      if (key === 'p' && status === 'encounter' && activeEncounter?.id === 'passenger_trade') { closeEncounter(); playSound('select'); return; }
      if (key === 'v' && status === 'playing' && controlMode === 'caravan') { setStatus('vehicle_select'); playSound('select'); return; }
      if (key === 't' && status === 'playing' && controlMode === 'caravan') {
        const pool = ['technomancer','soul_stitcher','provision_master','food_provisioner','traveling_artisan','hungry_merchant'];
        setActiveEncounter(ENCOUNTERS[pool[Math.floor(Math.random()*pool.length)]]); setStatus('encounter'); playSound('confirm'); return;
      }
      if (key === 'c' && status === 'playing') {
        if (controlMode === 'caravan') { playSound('onboard'); setControlMode('person'); setPersonPos({ x: playerPos.x, y: playerPos.y }); setBullets([]); }
        else if (Math.sqrt(Math.pow(personPos.x - playerPos.x, 2) + Math.pow(personPos.y - playerPos.y, 2)) < 80) { playSound('confirm'); setControlMode('caravan'); setBullets([]); }
        return;
      }
      keys.current.add(key);
      if (status === 'playing' && key === 'e' && controlMode === 'caravan') {
        const idx = npcs.findIndex(n => n.type === 'person' && Math.abs(n.x - playerPos.x) < INTERACTION_RANGE);
        if (idx !== -1) {
          const cap = flags.has('capacity_upgrade') ? 5 : 3;
          const targetPass = npcs[idx].passengerData!;
          if (resources.passengers.length < cap) {
            playSound('onboard'); playSound('coin');
            setResources(prev => ({ ...prev, passengers: [...prev.passengers, targetPass], gold: prev.gold + 20 }));
            addNotification("Passenger onboarded! +20 gold.");
            setNpcs(prev => prev.filter((_, i) => i !== idx));
          } else {
            setReplacementTarget(targetPass); setNpcs(prev => prev.filter((_, i) => i !== idx));
            setActiveEncounter(generateReplacementEncounter(targetPass)); setStatus('encounter'); playSound('select');
          }
        }
      }
      if (status === 'encounter' && activeEncounter && !lastChoiceResult) {
        const num = parseInt(key);
        if (!isNaN(num) && num > 0 && num <= activeEncounter.choices.length) handleChoice(activeEncounter.choices[num - 1]);
      } else if (status === 'encounter' && lastChoiceResult && (key === ' ' || key === 'enter')) { playSound('confirm'); closeEncounter(); }
    };
    const up = (e: KeyboardEvent) => keys.current.delete(e.key.toLowerCase());
    window.addEventListener('keydown', down); window.addEventListener('keyup', up);
    return () => { window.removeEventListener('keydown', down); window.removeEventListener('keyup', up); };
  }, [status, isPaused, showSettings, activeEncounter, lastChoiceResult, npcs, playerPos, personPos, controlMode, flags, resources.passengers]);

  const handleChoice = (choice: Choice) => {
    playSound('money');
    if (choice.id === 'confirm_replacement' && replacementTarget) {
      setResources(prev => { const next = [...prev.passengers]; next.splice(Math.floor(Math.random() * next.length), 1); next.push(replacementTarget); return { ...prev, passengers: next, gold: prev.gold + 50 }; });
    }
    setResources(prev => ({
      ...prev,
      food: Math.max(0, Math.min(100, prev.food - (choice.foodCost || 0) + (choice.foodGain || 0))),
      gold: Math.max(0, prev.gold - (choice.goldCost || 0) + (choice.goldGain || 0)),
      reputation: Math.max(0, prev.reputation - (choice.reputationCost || 0) + (choice.reputationGain || 0)),
      lives: Math.min(3, prev.lives + (choice.id === 'mend_spirit' && prev.reputation >= 30 ? 1 : 0))
    }));
    if (choice.flagToSet) setFlags(prev => new Set(prev).add(choice.flagToSet!));
    if (choice.action) setPendingAction(choice.action);
    setLastChoiceResult(choice.consequenceText);
  };

  const handleLotteryReward = (reward: any) => {
    playSound('money');
    const tradeValue = reward.gold || (reward.food ? 45 : reward.rep ? 35 : reward.lives ? 100 : 25);
    setResources(prev => ({ ...prev, gold: prev.gold + tradeValue }));
    addNotification("Mystery traded!");
    setStatus('playing');
  };

  const closeEncounter = () => {
    const action = pendingAction; setPendingAction(null); setActiveEncounter(null); setLastChoiceResult(null); setReplacementTarget(null);
    if (action === 'continue_journey') { setResources(prev => ({ ...prev, journeyCount: prev.journeyCount + 1, progress: 0 })); setNpcs([]); setStatus('playing'); }
    else if (action === 'end_journey') { setVictoryType('hero'); setStatus('victory'); stopAllAudio(); onGameEnd(resources.gold + resources.reputation * 2, resources.gold, resources.reputation); }
    else setStatus('playing');
  };

  const handleVehicleSelect = (v: VehicleType) => {
    const costs: Record<VehicleType, number> = { caravan: 0, bike: 50, car: 100, truck: 200, train: 500 };
    if (resources.gold >= costs[v] || v === resources.vehicle) {
      setResources(prev => ({ ...prev, vehicle: v, gold: v === prev.vehicle ? prev.gold : prev.gold - costs[v] }));
      setStatus('playing');
    }
  };

  const restartGame = () => {
    setResources(INITIAL_RESOURCES); setPlayerPos({ x: 200, y: 300 }); setPersonPos({ x: 200, y: 300 }); setControlMode('caravan');
    setNpcs([]); setBullets([]); setScrollOffset(0); setFlags(new Set()); setVictoryType(null); setIsPaused(false); setShowSettings(false); setStatus('playing'); setNotifications([]);
    addNotification(`Welcome back ${playerName}!`);
  };

  return (
    <div className="relative w-full h-screen bg-[#111] text-stone-100 overflow-hidden select-none">
      <GameCanvas playerPos={playerPos} personPos={personPos} controlMode={controlMode} npcs={npcs} bullets={bullets} scrollOffset={scrollOffset} status={status} progress={resources.progress} passengers={resources.passengers} vehicle={resources.vehicle} theme={theme} />
      {status !== 'gameover' && status !== 'victory' && (
        <UIOverlay resources={resources} flags={flags} musicVolume={musicVolume} ambientVolume={ambientVolume} isMouseControlEnabled={isMouseControlEnabled} onSetMusicVolume={setMusicVolume} onSetAmbientVolume={setAmbientVolume} onSetMouseControl={setIsMouseControlEnabled} onPlaySound={playSound} notifications={notifications} showSettings={showSettings} onToggleSettings={() => setShowSettings(!showSettings)} />
      )}
      {status === 'encounter' && activeEncounter && <ChoiceModal encounter={activeEncounter} onChoice={handleChoice} result={lastChoiceResult} onClose={closeEncounter} flags={flags} reputation={resources.reputation} passengers={resources.passengers} onPlaySound={playSound} />}
      {status === 'lottery' && <LotteryModal onComplete={handleLotteryReward} onClose={() => setStatus('playing')} onPlaySound={playSound} />}
      {status === 'vehicle_select' && <VehicleModal currentVehicle={resources.vehicle} onSelect={handleVehicleSelect} onClose={() => setStatus('playing')} onPlaySound={playSound} />}
      {(status === 'gameover' || status === 'victory') && <EndScreen status={status} victoryType={victoryType} resources={resources} onRestart={restartGame} onPlaySound={playSound} onExit={onExit} playerName={playerName} />}
      {isPaused && (
        <div className="absolute inset-0 z-[60] bg-black/60 backdrop-blur-md flex items-center justify-center">
          <div className="p-12 text-center border-[8px] border-black bg-[#555] space-y-8 relative">
            <h2 className="text-8xl font-black text-white uppercase italic animate-pulse">PAUSED</h2>
            <div className="flex flex-col gap-4">
              <button onClick={() => { setIsPaused(false); playSound('confirm'); }} className="text-4xl py-4 bg-emerald-600 border-4 border-black text-white font-black uppercase">RESUME [ESC/SPACE]</button>
              <button onClick={() => { setIsPaused(false); stopAllAudio(); onExit(); }} className="text-3xl py-3 bg-red-800 border-4 border-black text-white font-black uppercase">ABANDON</button>
            </div>
          </div>
        </div>
      )}
      {status === 'playing' && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-40 bg-black/50 px-6 py-2 border-2 border-white/20 text-yellow-400 font-bold uppercase tracking-widest pointer-events-none text-center text-sm">
          {controlMode === 'caravan' ? "[S] SETTINGS | [C] EXIT | [V] HANGAR | [P] TRADE | [SPACE] PAUSE" : "LEFT CLICK SHOOT | WALK NEAR & [C] ENTER"}
        </div>
      )}
    </div>
  );
};

export default GameEngine;
