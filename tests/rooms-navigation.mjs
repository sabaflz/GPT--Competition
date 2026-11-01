import assert from 'node:assert/strict';
const base=process.env.GAME_TEST_URL||'http://127.0.0.1:4173';
async function post(body){const res=await fetch(base+'/api/rooms',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body),signal:AbortSignal.timeout(15000)});return {status:res.status,data:await res.json()};}
const bad=await post({op:'create',name:'Invalid test',traveler:{color:'neon',shape:'round'}});assert.equal(bad.status,400);
const host=await post({op:'create',name:'Color test A',traveler:{color:'sage',shape:'round'}});assert.equal(host.status,200);assert.deepEqual(host.data.travelers[0],{color:'sage',shape:'round'});
const preview=await fetch(base+'/api/rooms?preview=1&code='+host.data.code,{signal:AbortSignal.timeout(15000)}).then(r=>r.json());assert.deepEqual(preview.colorsTaken,['sage']);assert.equal(preview.full,false);assert.equal(preview.state,undefined);assert.equal(preview.host_hash,undefined);
const clash=await post({op:'join',code:host.data.code,name:'Color test B',traveler:{color:'sage',shape:'leaf'}});assert.equal(clash.status,409);assert.deepEqual(clash.data.colorsTaken,['sage']);
const guest=await post({op:'join',code:host.data.code,name:'Color test B',traveler:{color:'peach',shape:'leaf'}});assert.equal(guest.status,200);assert.deepEqual(guest.data.travelers,[{color:'sage',shape:'round'},{color:'peach',shape:'leaf'}]);
const sync=await fetch(base+'/api/rooms?code='+host.data.code,{headers:{Authorization:'Bearer '+host.data.token},signal:AbortSignal.timeout(15000)}).then(r=>r.json());assert.deepEqual(sync.travelers,guest.data.travelers);
console.log('Room preview, reserved colors, server-side collision rejection, shape persistence, and two-client avatar sync passed.');
