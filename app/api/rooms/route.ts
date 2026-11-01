import { env } from 'cloudflare:workers';
import { initial, apply, type Game, type Action } from '@/lib/game';
export const dynamic='force-dynamic';
type Room={code:string;host_hash:string;guest_hash:string|null;host_name:string;guest_name:string|null;state:string;version:number;created_at:number;host_seen:number;guest_seen:number|null};
const response=(body:unknown,status=200)=>Response.json(body,{status,headers:{'Cache-Control':'no-store'}});
const hash=async(t:string)=>Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(t)))).map(x=>x.toString(16).padStart(2,'0')).join('');
const validCode=(code:string)=>/^[A-HJ-NP-Z2-9]{6}$/.test(code);
function db(){if(!env.DB)throw new Error('Room storage is not ready. Please try again shortly.');return env.DB;}
function view(r:Room,p:number){return {code:r.code,player:p,names:[r.host_name,r.guest_name],joined:!!r.guest_hash,state:JSON.parse(r.state) as Game,version:r.version,seen:[r.host_seen,r.guest_seen]};}
async function authenticate(req:Request,code:string){
 if(!validCode(code))throw new Error('Enter a valid six-character room code.');
 const token=req.headers.get('authorization')?.replace(/^Bearer /,'');if(!token||token.length>100)throw new Error('Your session is missing. Please rejoin.');
 const r=await db().prepare('SELECT * FROM rooms WHERE code=? AND created_at>?').bind(code,Date.now()-86400000).first<Room>();
 if(!r)throw new Error('Room not found or expired. Create a new room.');
 const h=await hash(token),p=h===r.host_hash?0:h===r.guest_hash?1:-1;if(p<0)throw new Error('This session cannot access that room.');
 return {r,p};
}
export async function GET(req:Request){try{
 const {r,p}=await authenticate(req,new URL(req.url).searchParams.get('code')||'');
 const field=p===0?'host_seen':'guest_seen';if(Date.now()-(p===0?r.host_seen:r.guest_seen||0)>15000){await db().prepare(`UPDATE rooms SET ${field}=? WHERE code=?`).bind(Date.now(),r.code).run();if(p===0)r.host_seen=Date.now();else r.guest_seen=Date.now();}
 return response(view(r,p));
}catch(e){return response({error:e instanceof Error?e.message:'Unable to load room.'},400);}}
export async function POST(req:Request){try{
 const origin=req.headers.get('origin');if(origin&&origin!==new URL(req.url).origin)return response({error:'Cross-site requests are not allowed.'},403);
 if(Number(req.headers.get('content-length')||0)>4096)return response({error:'Request too large.'},413);
 const body=await req.json() as {op?:string;name?:string;code?:string;version?:number;action?:Action};
 if(body.op==='create'||body.op==='join'){
 const name=typeof body.name==='string'?body.name.trim().slice(0,24):'';if(!name)throw new Error('Choose a name first.');
 const token=crypto.randomUUID(),h=await hash(token),now=Date.now();
 if(body.op==='create'){
 const alphabet='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
 for(let attempt=0;attempt<5;attempt++){
 const code=Array.from(crypto.getRandomValues(new Uint8Array(6))).map(x=>alphabet[x%alphabet.length]).join('');
 const result=await db().prepare('INSERT OR IGNORE INTO rooms (code,host_hash,host_name,state,version,created_at,host_seen) VALUES (?,?,?,?,0,?,?)').bind(code,h,name,JSON.stringify(initial()),now,now).run();
 if(result.meta.changes){const r=await db().prepare('SELECT * FROM rooms WHERE code=?').bind(code).first<Room>();return response({...view(r!,0),token});}
 }throw new Error('Unable to create a room. Try again.');
 }
 const code=String(body.code||'').toUpperCase();if(!validCode(code))throw new Error('Enter a valid six-character room code.');
 const result=await db().prepare('UPDATE rooms SET guest_hash=?,guest_name=?,guest_seen=?,version=version+1 WHERE code=? AND guest_hash IS NULL AND created_at>?').bind(h,name,now,code,now-86400000).run();
 if(!result.meta.changes)throw new Error('This room is full, missing, or expired.');
 const r=await db().prepare('SELECT * FROM rooms WHERE code=?').bind(code).first<Room>();return response({...view(r!,1),token});
 }
 const {r,p}=await authenticate(req,String(body.code||''));
 if(!r.guest_hash)throw new Error('Wait for your partner to join.');
 if(body.version!==r.version)return response({error:'Your partner just acted. Please try again.',...view(r,p)},409);
 const state=apply(JSON.parse(r.state),p,body.action as Action);
 const result=await db().prepare('UPDATE rooms SET state=?,version=version+1 WHERE code=? AND version=?').bind(JSON.stringify(state),r.code,r.version).run();
 if(!result.meta.changes)return response({error:'Your partner just acted. Please try again.'},409);
 r.state=JSON.stringify(state);r.version++;return response(view(r,p));
 }catch(e){return response({error:e instanceof Error?e.message:'Unable to update room.'},400);}}
