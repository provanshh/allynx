export interface Passenger {
  id: string;
  name: string;
  type: 'merchant' | 'cook' | 'scholar' | 'guard';
  bonusText: string;
}

export type VehicleType = 'caravan' | 'bike' | 'truck' | 'car' | 'train';

export type ThemeType = 'desert' | 'neon' | 'frozen' | 'toxic';

export interface ResourceState {
  food: number;
  gold: number;
  reputation: number;
  journeyCount: number;
  progress: number;
  lives: number;
  score: number;
  passengers: Passenger[];
  vehicle: VehicleType;
}

export interface Choice {
  id: string;
  text: string;
  consequenceText: string;
  reputationCost?: number;
  goldCost?: number;
  foodCost?: number;
  reputationGain?: number;
  goldGain?: number;
  foodGain?: number;
  flagToSet?: string;
  requiredFlag?: string;
  requiredPassengerType?: 'merchant' | 'cook' | 'scholar' | 'guard';
  action?: 'continue_journey' | 'end_journey' | 'remove_passenger';
  color?: string;
}

export interface Encounter {
  id: string;
  title: string;
  description: string;
  icon: string;
  choices: Choice[];
}

export interface NPC {
  id: string;
  x: number;
  y: number;
  type: 'trader' | 'bandit' | 'traveler' | 'mystic' | 'haven' | 'food_cart' | 'person' | 'coin' | 'mystery_box';
  encounterId: string;
  width: number;
  height: number;
  speedMultiplier: number;
  passengerData?: Passenger;
}

export interface Bullet {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
}

export type VictoryType = 'hero' | 'merchant_prince' | 'iron_monger' | 'survivor';

export type GameStatus = 'title' | 'playing' | 'encounter' | 'gameover' | 'victory' | 'vehicle_select' | 'lottery';

export type ControlMode = 'caravan' | 'person';
