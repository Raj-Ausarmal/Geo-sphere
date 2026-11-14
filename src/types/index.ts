export type Mode = 'locator' | 'capital' | 'flag';
export type Difficulty = 'Easy' | 'Medium' | 'Hard' | 'Expert';
export type Region = 'All' | 'Asia' | 'Europe' | 'Africa' | 'North America' | 'South America' | 'Oceania';
export interface Country { id: number; name: string; capital: string; code: string; region: Exclude<Region, 'All'>; }
export interface Question { country: Country; choices: string[]; }
