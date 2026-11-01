import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const base=process.env.GAME_TEST_URL||'http://127.0.0.1:4173';
const solutions=JSON.parse(readFileSync(new URL('./solutions.json',import.meta.url),'utf8'));
async function request(body,token){const res=await fetch(base+'/api/rooms',{method:'POST',headers:{'Content-Type':'application/json',...(token?{Authorization:'Bearer '+token}:{})},body:JSON.stringify(body)});const data=await res.json();return {status:res.status,data};}
const host=await request({op:'create',name:'Integration Blue'});assert.equal(host.status,200);const guest=await request({op:'join',code:host.data.code,name:'Integration Lilac'});assert.equal(guest.status,200);const tokens=[host.data.token,guest.data.token];let room=guest.data;
const intruder=await request({op:'action',code:room.code,version:room.version,action:{type:'restart'}},'wrong-token');assert.equal(intruder.status,400);
const stale=await request({op:'action',code:room.code,version:0,action:{type:'signal',message:'Wait for me'}},tokens[0]);assert.equal(stale.status,409);
async function act(player,action){const r=await request({op:'action',code:room.code,version:room.version,action},tokens[player]);assert.equal(r.status,200,JSON.stringify(r.data));room=r.data;}
for(let level=0;level<solutions.length;level++){
 assert.equal(room.state.level,level);for(const step of solutions[level])await act(step.player,step.action);
 assert.match(room.state.message,/Both home/);assert.ok(room.state.finishedAt);
 const check=await fetch(base+'/api/rooms?code='+room.code,{headers:{Authorization:'Bearer '+tokens[1]}});const observed=await check.json();assert.equal(observed.version,room.version);assert.deepEqual(observed.state.positions,room.state.positions);
 console.log('HTTP two-client chapter',level+1,'passed');
 if(level<solutions.length-1){await act(0,{type:'next'});await act(1,{type:'next'});assert.ok(room.state.startedAt);}
}
console.log('Unauthorized access, stale versions, synchronized victory, and all eight chapter transitions passed.');
