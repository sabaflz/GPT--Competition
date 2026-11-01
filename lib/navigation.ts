export type Session={code:string;token:string};
export const validRoomCode=(code:string)=>typeof code==='string'&&/^[A-HJ-NP-Z2-9]{6}$/.test(code);
export function invitation(url:string):string{try{const code=new URL(url,'https://game.invalid').searchParams.get('room')?.trim().toUpperCase()||'';return validRoomCode(code)?code:'';}catch{return '';}}
export function bootNavigation(url:string,saved:string|null,lastScreen:string|null){
 let session:Session|null=null;try{const value=JSON.parse(saved||'null');if(value&&validRoomCode(value.code)&&typeof value.token==='string'&&value.token.length>=16&&value.token.length<=100)session=value;}catch{}
 const invite=invitation(url);
 return {session,invite,screen:(invite?'menu':session&&lastScreen!=='menu'?'game':'menu') as 'menu'|'game'};
}
export function inviteLink(origin:string,code:string){if(!validRoomCode(code))throw new Error('Invalid room code.');const url=new URL('/',origin);url.searchParams.set('room',code);return url.toString();}
