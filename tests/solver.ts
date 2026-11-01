import {apply,initial,won,key,adjacent,type Game,type Action,type Point,LEVELS} from '../lib/game.ts';
type Step={player:number;action:Action};
export function path(s:Game,p:number,target:string):Step[]|null{
 const queue:[string,Step[]][]=[[key(s.positions[p]),[]]],seen=new Set([key(s.positions[p])]);
 for(let i=0;i<queue.length;i++){const [at,steps]=queue[i];if(at===target)return steps;const [x,y]=at.split(',').map(Number);
 for(const [a,b] of [[x+1,y],[x-1,y],[x,y+1],[x,y-1]]){const k=a+','+b;if(seen.has(k)||!s.floors[p].includes(k))continue;
 if(LEVELS[s.level].islands[p].gates.includes(k)&&!s.opened[p].includes(k)&&!LEVELS[s.level].islands[1-p].plates.includes(key(s.positions[1-p])))continue;
 seen.add(k);queue.push([k,[...steps,{player:p,action:{type:'move',to:[a,b]}}]]);}}
 return null;
}
const signature=(s:Game)=>JSON.stringify([s.positions,s.floors.map(a=>[...a].sort()),s.inventories,s.collected.map(a=>[...a].sort()),s.opened.map(a=>[...a].sort())]);
export function solve(level:number,blocked?:{player:number;tile:string}):Step[]{
 const start=initial(level),queue:{s:Game,parent:number,steps:Step[]}[]=[{s:start,parent:-1,steps:[]}],seen=new Set([signature(start)]);
 for(let i=0;i<queue.length;i++){
 const {s}=queue[i];if(won(s)){const route:Step[][]=[];let n=i;while(n>0){route.push(queue[n].steps);n=queue[n].parent;}return route.reverse().flat();}
 if(queue.length>180000)throw new Error('Search exceeded budget on level '+level);
 function add(steps:Step[]){try{let next=s;for(const step of steps)next=apply(next,step.player,step.action);const sig=signature(next);if(!seen.has(sig)){seen.add(sig);queue.push({s:next,parent:i,steps});}}catch{}}
 for(let p=0;p<2;p++){
 const l=LEVELS[level].islands[p];
 for(const target of [...l.runes.filter(t=>!s.collected[p].includes(t)),...l.plates,key(l.home)]){const route=path(s,p,target);if(route?.length)add(route);}
 for(const tile of l.loose.filter(t=>s.floors[p].includes(t))){if(s.inventories[1-p])continue;for(const at of s.floors[p].filter(t=>adjacent(t.split(',').map(Number) as Point,tile))){const route=path(s,p,at);if(route)add([...route,{player:p,action:{type:'offer',tile}},{player:1-p,action:{type:'accept'}}]);}}
 if(s.inventories[p])for(const tile of l.sockets.filter(t=>!s.floors[p].includes(t)&&!(blocked?.player===p&&blocked.tile===t))){for(const at of s.floors[p].filter(t=>adjacent(t.split(',').map(Number) as Point,tile))){const route=path(s,p,at);if(route)add([...route,{player:p,action:{type:'place',tile}}]);}}
 }
 }
 throw new Error('No solution for level '+level+' '+LEVELS[level].title+' ('+queue.length+' states)');
}
if(process.argv.includes('--write')){const fs=await import('node:fs');const solutions=LEVELS.map((l,i)=>{const steps=solve(i);console.log(i+1,l.title,steps.length);return steps;});fs.writeFileSync('tests/solutions.json',JSON.stringify(solutions,null,2)+'\n');}
