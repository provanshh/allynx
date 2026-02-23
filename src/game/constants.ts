import { ResourceState } from './types';

export const INITIAL_RESOURCES: ResourceState = {
  food: 100,
  gold: 32,
  reputation: 0,
  journeyCount: 1,
  progress: 0,
  lives: 3,
  score: 0,
  passengers: [],
  vehicle: 'caravan',
};

export const WORLD_WIDTH = 1200;
export const WORLD_HEIGHT = 600;
export const ROAD_TOP = 150;
export const ROAD_BOTTOM = 450;
export const PLAYER_SPEED = 5;
export const SCROLL_SPEED = 2.5;
export const FOOD_DRAIN_RATE = 0.05;
export const INTERACTION_RANGE = 60;
