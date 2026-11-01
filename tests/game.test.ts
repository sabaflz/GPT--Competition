import {test} from 'node:test';
import assert from 'node:assert/strict';
// @ts-ignore Node executes TypeScript directly for these engine tests.
import {initial,apply,won,key,LEVELS,type Game,type Point} from '../lib/game.ts';
function walk(s:Game,p:number,target:string):Game{
 const start=key(s.positions[p]),queue:[[string,string[]]]|[string,string[]][]=[[start,[]]],seen=new Set([start]);
 for(let i=0;i<queue.length;i++){const [pos,path]=queue[i];if(pos===target){for(const t of path)s=apply(s,p,{type:'move',to:t.split(',').map(Number) as Point});return s;}
 const [x,y]=pos.split(',').map(Number);for(const [a,b] of [[x+1,y],[x-1,y],[x,y+1],[x,y-1]]){const t=a+','+b;if(s.floors[p].includes(t)&&!seen.has(t)){seen.add(t);queue.push([t,[...path,t]]);}}}throw new Error('No path to '+target);
}
test('accepting transfers exactly one floor tile and preserves total material',()=>{let s=initial();s=apply(s,0,{type:'offer',tile:'1,2'});assert.ok(s.floors[0].includes('1,2'));assert.throws(()=>apply(s,0,{type:'accept'}));s=apply(s,1,{type:'accept'});assert.equal(s.inventories[1],1);assert.ok(!s.floors[0].includes('1,2'));s=apply(s,1,{type:'place',tile:'3,2'});assert.equal(s.inventories[1],0);assert.equal(s.floors[0].length+s.floors[1].length,18);});
test('occupied tile cannot be offered or removed after an offer',()=>{let s=initial();s=walk(s,0,'1,2');assert.throws(()=>apply(s,0,{type:'offer',tile:'1,2'}));s=walk(s,0,'2,2');s=apply(s,0,{type:'offer',tile:'1,2'});s=walk(s,0,'1,2');assert.throws(()=>apply(s,1,{type:'accept'}));});
test('rejects teleportation, void movement, forged tiles and invalid players',()=>{const s=initial();for(const a of [{type:'move',to:[6,2]},{type:'move',to:[0,4]},{type:'offer',tile:'6,2'},{type:'place',tile:'3,2'}])assert.throws(()=>apply(s,0,a as never));assert.throws(()=>apply(s,2,{type:'restart'}));assert.deepEqual(s,initial());});
test('all chapters admit legal complete cooperative solutions',()=>{for(let level=0;level<LEVELS.length;level++){
 let s=initial(level);const l=LEVELS[level];
 if(level===0){for(let p=0;p<2;p++)s=walk(s,p,'2,2');}
 if(level===1){for(let p=0;p<2;p++)s=walk(s,p,'4,2');}
 if(level===2){s=walk(s,0,'2,1');s=walk(s,1,'2,3');}
 for(let p=0;p<2;p++)for(const tile of l.islands[p].loose){s=apply(s,p,{type:'offer',tile});s=apply(s,1-p,{type:'accept'});}
 for(let p=0;p<2;p++)for(const tile of l.islands[p].sockets)s=apply(s,p,{type:'place',tile});
 for(let p=0;p<2;p++)s=walk(s,p,key(l.islands[p].home));
 assert.ok(won(s));if(level<2){s=apply(s,0,{type:'next'});assert.equal(s.level,level);s=apply(s,1,{type:'next'});assert.equal(s.level,level+1);}
}});
test('intro supports an upper detour before gifting, as well as direct crossing',()=>{let s=initial();for(const t of ['0,1','1,1','2,1','2,2'])s=walk(s,0,t);s=apply(s,0,{type:'offer',tile:'1,2'});s=apply(s,1,{type:'accept'});assert.equal(s.inventories[1],1);});
test('restart requires both players and decline preserves all material',()=>{let s=apply(initial(),0,{type:'offer',tile:'1,2'});s=apply(s,1,{type:'decline'});assert.deepEqual(s.floors,initial().floors);s=walk(s,0,'1,2');s=apply(s,0,{type:'restart'});assert.equal(key(s.positions[0]),'1,2');s=apply(s,1,{type:'restart'});assert.deepEqual(s,initial());});
