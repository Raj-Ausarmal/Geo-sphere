export function Timer({seconds}:{seconds:number}) { return <div className={seconds<10?'timer low':'timer'}>00:{String(Math.max(0,seconds)).padStart(2,'0')}</div> }
