import { LEVELS, type Point } from './levels.ts';
export { LEVELS, type Point } from './levels.ts';
export const key = (p:Point)=>p.join(',');
export type Offer = { from: number; tile: string };
export type Game = { rules:2; level: number; positions: [Point,Point]; floors: [string[],string[]]; inventories: [number,number]; offer: Offer|null; moves:number; gifts:number; ready:number[]; restart:number[]; message:string; collected:[string[],string[]]; opened:[string[],string[]]; startedAt?:number;finishedAt?:number;journeyMoves?:number;journeyGifts?:number };
export type Action = {type:'signal';message:'Need a piece'|'Stand on your switch'|'Wait for me'}|{type:'move';to:Point}|{type:'offer';tile:string}|{type:'accept'|'decline'|'cancel'|'restart'|'next'}|{type:'place';tile:string};
export function initial(level=0):Game { const l=LEVELS[level];return {rules:2,level,positions:l.islands.map(x=>[...x.start]) as [Point,Point],floors:l.islands.map(x=>[...x.floor]) as [string[],string[]],inventories:[0,0],offer:null,moves:0,gifts:0,ready:[],restart:[],collected:[[],[]],opened:[[],[]],message:'Two worlds. One way forward: together.'}; }
export const won = (s:Game) => s.positions.every((p,i)=>key(p)===key(LEVELS[s.level].islands[i].home)&&LEVELS[s.level].islands[i].runes.every(r=>s.collected[i].includes(r)));
export function apply(state:Game, player:number, action:Action):Game {
 if(player!==0&&player!==1)throw new Error('Unknown player.');
 const s:Game=structuredClone(state), other=1-player,l=LEVELS[s.level];
 s.collected ||= [[],[]];s.opened ||= [[],[]];
 if(action.type==='restart') {if(!s.restart.includes(player))s.restart.push(player); if(s.restart.length===2)return {...initial(s.level),journeyMoves:s.journeyMoves||0,journeyGifts:s.journeyGifts||0};s.message='Your partner is asking to restart. Both players must agree.';return s;}
 if(action.type==='next') {if(!won(s))throw new Error('Both creatures need to reach home first.');if(!s.ready.includes(player))s.ready.push(player);if(s.ready.length===2&&s.level<LEVELS.length-1)return {...initial(s.level+1),journeyMoves:(s.journeyMoves||0)+s.moves,journeyGifts:(s.journeyGifts||0)+s.gifts};return s;}
 if(action.type==='signal'){if(!['Need a piece','Stand on your switch','Wait for me'].includes(action.message))throw new Error('Unknown signal.');s.message=(player===0?'Blue':'Lilac')+' traveler: '+action.message;return s;}
 if(won(s))throw new Error('This chapter is complete.');
 s.ready=[];s.restart=[];
 if(action.type==='move'){
 const p=action.to;if(!Array.isArray(p)||p.length!==2||!p.every(Number.isInteger)||Math.abs(p[0]-s.positions[player][0])+Math.abs(p[1]-s.positions[player][1])!==1||!s.floors[player].includes(key(p)))throw new Error('Choose a neighboring solid tile.');
 const target=key(p);
 if(l.islands[player].gates.includes(target)&&!s.opened[player].includes(target)){
 if(!l.islands[other].plates.includes(key(s.positions[other])))throw new Error('Your partner must stand on their round switch to open this gate.');
 s.opened[player].push(target);
 }
 s.positions[player]=p;if(l.islands[player].runes.includes(target)&&!s.collected[player].includes(target))s.collected[player].push(target);s.moves++;s.message=won(s)?'Both home. You made room for each other.':'One step closer.';
 }else if(action.type==='offer'){
 if(s.offer)throw new Error('Resolve the current offer first.');
 if(!l.islands[player].loose.includes(action.tile)||!s.floors[player].includes(action.tile))throw new Error('Only a remaining star-marked tile can be offered.');
 if(key(s.positions[player])===action.tile)throw new Error('Step off this tile before offering it.');
 if(!adjacent(s.positions[player],action.tile))throw new Error('Stand beside a star tile to lift it.');
 if(s.inventories[other]>=1)throw new Error('Your partner must place their carried piece first.');
 s.offer={from:player,tile:action.tile};s.message='A piece offered. It stays put until accepted.';
 }else if(action.type==='accept'){
 if(!s.offer||s.offer.from===player)throw new Error('There is no incoming offer.');
 const {from,tile}=s.offer;
 if(s.inventories[player]>=1)throw new Error('Place your carried piece before accepting another.');
 if(!adjacent(s.positions[from],tile))throw new Error('Your partner must stand beside the offered piece.');
 if(key(s.positions[from])===tile)throw new Error('Your partner must step off the offered tile first.');
 s.floors[from]=s.floors[from].filter(x=>x!==tile);s.inventories[player]++;s.gifts++;s.offer=null;s.message='A piece crossed the space between you. Place it in a dotted gap.';
 }else if(action.type==='place'){
 if(s.inventories[player]<1||!l.islands[player].sockets.includes(action.tile)||s.floors[player].includes(action.tile))throw new Error('Place a received piece in an empty dotted gap.');
 if(!adjacent(s.positions[player],action.tile))throw new Error('Stand beside a dotted gap to build there.');
 s.floors[player].push(action.tile);s.inventories[player]--;s.message='What was missing is now a way forward.';
 }else if(action.type==='decline'||action.type==='cancel'){
 if(!s.offer||(action.type==='cancel'?s.offer.from!==player:s.offer.from===player))throw new Error('No matching offer.');s.offer=null;s.message='Offer withdrawn. Nothing was removed.';
 }else {throw new Error('Unknown action.');}
 return s;
}

export function adjacent(p:Point,t:string){const [x,y]=t.split(',').map(Number);return Math.abs(p[0]-x)+Math.abs(p[1]-y)===1;}

// An optimistic reachability check: even allowing every future bridge, will a
// gift cut the donor off from an uncollected keepsake or home?
export function giftWarning(s:Game,player:number,tile:string):string|null{
 const l=LEVELS[s.level].islands[player],floor=new Set([...s.floors[player],...l.sockets].filter(t=>t!==tile));
 const queue=[key(s.positions[player])],seen=new Set(queue);
 for(let i=0;i<queue.length;i++){const [x,y]=queue[i].split(',').map(Number);for(const [a,b] of [[x+1,y],[x-1,y],[x,y+1],[x,y-1]]){const t=a+','+b;if(floor.has(t)&&!seen.has(t)){seen.add(t);queue.push(t);}}}
 if(l.runes.some(r=>!s.collected[player].includes(r)&&!seen.has(r)))return 'This gift cuts off an uncollected keepsake. Collect it or move to the other side first.';
 if(!seen.has(key(l.home)))return 'This gift cuts off the donor’s route home. Move to the other side first.';
 return null;
}
