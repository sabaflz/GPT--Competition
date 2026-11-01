/** Original procedural score and synthesized effects, dedicated to CC0.
 * No recordings, samples, external tracks, or third-party audio assets.
 */
export type Cue='move'|'offer'|'accept'|'place'|'keepsake'|'gate'|'home'|'win';
class Soundscape {
 private context:AudioContext|null=null;
 private musicBus:GainNode|null=null;
 private effectBus:GainNode|null=null;
 private timer:ReturnType<typeof setInterval>|null=null;
 private next=0;
 private beat=0;
 music=false;
 effects=false;
 private volume=.5;
 private async activate(){
  if(!this.context){this.context=new AudioContext();this.musicBus=this.context.createGain();this.effectBus=this.context.createGain();this.musicBus.connect(this.context.destination);this.effectBus.connect(this.context.destination);this.levels();}
  if(this.context.state==='suspended')await this.context.resume();
 }
 private levels(){if(!this.context)return;const t=this.context.currentTime;this.musicBus?.gain.setTargetAtTime(this.music?this.volume*.11:0,t,.07);this.effectBus?.gain.setTargetAtTime(this.effects?this.volume*.2:0,t,.025);}
 setVolume(value:number){this.volume=Math.max(0,Math.min(1,value));this.levels();}
 async configure(music:boolean,effects:boolean){this.music=music;this.effects=effects;
  if(music||effects)await this.activate();this.levels();
  if(this.music&&!this.timer){this.next=this.context!.currentTime+.1;this.beat=0;this.timer=setInterval(()=>this.schedule(),120);this.schedule();}
  if(!this.music&&this.timer){clearInterval(this.timer);this.timer=null;}
 }
 async pause(){if(this.context?.state==='running')await this.context.suspend();}
 private tone(note:number,time:number,duration:number,gain:number,bus:GainNode,type:OscillatorType='sine'){
  const c=this.context!;const osc=c.createOscillator(),amp=c.createGain();osc.type=type;osc.frequency.value=440*Math.pow(2,(note-69)/12);amp.gain.setValueAtTime(0,time);amp.gain.linearRampToValueAtTime(gain,time+.018);amp.gain.exponentialRampToValueAtTime(.0001,time+duration);osc.connect(amp);amp.connect(bus);osc.start(time);osc.stop(time+duration+.04);osc.onended=()=>{osc.disconnect();amp.disconnect();};
 }
 private schedule(){const c=this.context;if(!c||!this.music||c.state!=='running')return;
  if(this.next<c.currentTime-.2)this.next=c.currentTime+.08;
  // Eight original four-beat phrases, slowly arpeggiated at 72 bpm.
  const melody=[74,0,78,81,78,0,76,74,71,0,74,78,76,0,74,69,67,0,71,74,76,0,74,71,69,0,73,76,74,0,71,0];
  const bass=[50,47,43,45];
  while(this.next<c.currentTime+.35){const i=this.beat%32,n=melody[i];if(n)this.tone(n,this.next,1.8,.26,this.musicBus!);if(i%8===0){const root=bass[Math.floor(i/8)];this.tone(root,this.next,5,.32,this.musicBus!);this.tone(root+7,this.next+.12,4.5,.12,this.musicBus!);}
   this.next+=60/72;this.beat++;
  }
 }
 play(cue:Cue){if(!this.effects||!this.context||this.context.state!=='running')return;
  const sequences:Record<Cue,number[]>={move:[62],offer:[69,74],accept:[74,78],place:[50,57],keepsake:[81,86],gate:[55,62,67],home:[74,78,81],win:[74,78,81,86]};
  sequences[cue].forEach((n,i)=>this.tone(n,this.context!.currentTime+i*.1,cue==='move'?.11:cue==='win'?.9:.38,cue==='move'?.18:.3,this.effectBus!,cue==='place'?'triangle':'sine'));
 }
}
let shared:Soundscape|null=null;
export const soundscape=()=>shared??(shared=new Soundscape());
export const playCue=(cue:Cue)=>{if(typeof window!=='undefined')soundscape().play(cue);};
