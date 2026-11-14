import { Flame, Target, Trophy } from 'lucide-react';
export function ScoreBoard({score,streak,answered,correct}:{score:number;streak:number;answered:number;correct:number}){const accuracy=answered?Math.round(correct/answered*100):0;return <div className="stats"><span><Trophy/> {score}</span><span><Flame/> {streak}</span><span><Target/> {accuracy}%</span></div>}
