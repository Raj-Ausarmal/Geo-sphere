import { countries } from '../data/countries'; import type { Country, Difficulty, Question, Region } from '../types';
export const shuffle = <T,>(a:T[]) => [...a].sort(() => Math.random() - .5);
export function pool(region:Region, difficulty:Difficulty) { const base=region==='All'?countries:countries.filter(c=>c.region===region); const n={Easy:20,Medium:35,Hard:48,Expert:base.length}[difficulty]; return shuffle(base).slice(0,n); }
export function question(country:Country, kind:'capital'|'flag'):Question { const answer=kind==='capital'?country.capital:country.code; const options=shuffle(countries.filter(c=>c.id!==country.id)).slice(0,3).map(c=>kind==='capital'?c.capital:c.code); return {country,choices:shuffle([answer,...options])}; }
