import { create } from 'zustand'; import type { Difficulty, Mode, Region } from '../types';
type State={mode:Mode;difficulty:Difficulty;region:Region;set:(next:Partial<Pick<State,'mode'|'difficulty'|'region'>>)=>void};
export const useGameStore=create<State>(set=>({mode:'locator',difficulty:'Medium',region:'All',set:(next)=>set(next)}));
