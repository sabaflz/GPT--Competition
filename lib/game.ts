export type Point = [number, number];
export type Island = { floor: string[]; loose: string[]; sockets: string[]; start: Point; home: Point };
export type Level = { title: string; lesson: string; islands: [Island, Island] };
const island = (floor: string[], loose: string[], sockets: string[], start: Point, home: Point): Island => ({ floor, loose, sockets, start, home });
export const key = (p: Point) => p.join(',');
export const LEVELS: Level[] = [
 {title:'A little give and take',lesson:'Cross a loose tile before offering it, or take the upper path. Your partner needs it to bridge their gap.',islands:[
 island(['0,2','1,2','2,2','4,2','5,2','6,2','0,1','1,1','2,1'],['1,2'],['3,2'],[0,2],[6,2]),
 island(['0,2','1,2','2,2','4,2','5,2','6,2','0,3','1,3','2,3'],['1,2'],['3,2'],[0,2],[6,2])]},
 {title:'Leave a way back',lesson:'Two gaps, two gifts. Plan your route before taking the ground apart.',islands:[
 island(['0,2','1,2','2,2','4,2','6,2','0,1','1,1','2,1','3,1','4,1'],['1,2','3,1'],['3,2','5,2'],[0,2],[6,2]),
 island(['0,2','1,2','2,2','4,2','6,2','0,3','1,3','2,3','3,3','4,3'],['1,2','3,3'],['3,2','5,2'],[0,2],[6,2])]},
 {title:'The long way home',lesson:'A gift is still a path until you send it. Meet in the middle, then help each other finish.',islands:[
 island(['0,3','1,3','2,3','2,2','2,1','4,1','5,1','6,1','6,2','6,3','0,2','1,2','1,1'],['1,3','2,2'],['3,1','5,3'],[0,3],[6,3]),
 island(['0,1','1,1','2,1','2,2','2,3','4,3','5,3','6,3','6,2','6,1','0,2','1,2','1,3'],['1,1','2,2'],['3,3','5,1'],[0,1],[6,1])]},
];
export type Offer = { from: number; tile: string };
export type Game = { level: number; positions: [Point,Point]; floors: [string[],string[]]; inventories: [number,number]; offer: Offer|null; moves:number; gifts:number; ready:number[]; restart:number[]; message:string };
export type Action = {type:'move';to:Point}|{type:'offer';tile:string}|{type:'accept'|'decline'|'cancel'|'restart'|'next'}|{type:'place';tile:string};
export function initial(level=0):Game { const l=LEVELS[level];return {level,positions:l.islands.map(x=>[...x.start]) as [Point,Point],floors:l.islands.map(x=>[...x.floor]) as [string[],string[]],inventories:[0,0],offer:null,moves:0,gifts:0,ready:[],restart:[],message:'Two worlds. One way forward: together.'}; }
export const won = (s:Game) => s.positions.every((p,i)=>key(p)===key(LEVELS[s.level].islands[i].home));
export function apply(state:Game, player:number, action:Action):Game {
 if(player!==0&&player!==1)throw new Error('Unknown player.');
 const s:Game=structuredClone(state), other=1-player,l=LEVELS[s.level];
 if(action.type==='restart') {if(!s.restart.includes(player))s.restart.push(player); if(s.restart.length===2)return initial(s.level);s.message='Your partner is asking to restart. Both players must agree.';return s;}
 if(action.type==='next') {if(!won(s))throw new Error('Both creatures need to reach home first.');if(!s.ready.includes(player))s.ready.push(player);if(s.ready.length===2&&s.level<LEVELS.length-1)return initial(s.level+1);return s;}
 if(won(s))throw new Error('This chapter is complete.');
 s.ready=[];s.restart=[];
 if(action.type==='move'){
 const p=action.to;if(!Array.isArray(p)||p.length!==2||!p.every(Number.isInteger)||Math.abs(p[0]-s.positions[player][0])+Math.abs(p[1]-s.positions[player][1])!==1||!s.floors[player].includes(key(p)))throw new Error('Choose a neighboring solid tile.');
 s.positions[player]=p;s.moves++;s.message=won(s)?'Both home. You made room for each other.':'One step closer.';
 }else if(action.type==='offer'){
 if(s.offer)throw new Error('Resolve the current offer first.');
 if(!l.islands[player].loose.includes(action.tile)||!s.floors[player].includes(action.tile))throw new Error('Only a remaining star-marked tile can be offered.');
 if(key(s.positions[player])===action.tile)throw new Error('Step off this tile before offering it.');
 s.offer={from:player,tile:action.tile};s.message='A piece offered. It stays put until accepted.';
 }else if(action.type==='accept'){
 if(!s.offer||s.offer.from===player)throw new Error('There is no incoming offer.');
 const {from,tile}=s.offer;
 if(key(s.positions[from])===tile)throw new Error('Your partner must step off the offered tile first.');
 s.floors[from]=s.floors[from].filter(x=>x!==tile);s.inventories[player]++;s.gifts++;s.offer=null;s.message='A piece crossed the space between you. Place it in a dotted gap.';
 }else if(action.type==='place'){
 if(s.inventories[player]<1||!l.islands[player].sockets.includes(action.tile)||s.floors[player].includes(action.tile))throw new Error('Place a received piece in an empty dotted gap.');
 s.floors[player].push(action.tile);s.inventories[player]--;s.message='What was missing is now a way forward.';
 }else if(action.type==='decline'||action.type==='cancel'){
 if(!s.offer||(action.type==='cancel'?s.offer.from!==player:s.offer.from===player))throw new Error('No matching offer.');s.offer=null;s.message='Offer withdrawn. Nothing was removed.';
 }else {throw new Error('Unknown action.');}
 return s;
}
