import {test} from 'node:test';
import assert from 'node:assert/strict';
import {soundscape} from '../lib/audio.ts';
class Param{value=0;setTargetAtTime(v:number){this.value=v;}setValueAtTime(v:number){this.value=v;}linearRampToValueAtTime(v:number){this.value=v;}exponentialRampToValueAtTime(v:number){this.value=v;}}
class Node{gain=new Param();frequency=new Param();type='sine';onended:(()=>void)|null=null;connect(){}disconnect(){}start(){FakeAudio.notes++;}stop(){}}
class FakeAudio{static notes=0;static instance:FakeAudio;currentTime=0;state='suspended';destination={};gains:Node[]=[];constructor(){FakeAudio.instance=this;}createGain(){const n=new Node();this.gains.push(n);return n;}createOscillator(){return new Node();}async resume(){this.state='running';}async suspend(){this.state='suspended';}}
test('audio stays silent by default and respects independent switches, mute, and pause',async()=>{
 Object.defineProperty(globalThis,'AudioContext',{value:FakeAudio,configurable:true});
 const sound=soundscape();assert.equal(sound.music,false);assert.equal(sound.effects,false);sound.play('win');assert.equal(FakeAudio.notes,0);
 await sound.configure(false,true);sound.play('accept');assert.equal(FakeAudio.notes,2);
 await sound.configure(false,false);sound.play('win');assert.equal(FakeAudio.notes,2);
 await sound.configure(true,false);assert.ok(FakeAudio.notes>2);const before=FakeAudio.notes;sound.play('win');assert.equal(FakeAudio.notes,before,'effects must remain muted while music plays');
 sound.setVolume(0);assert.equal(FakeAudio.instance.gains[0].gain.value,0);assert.equal(FakeAudio.instance.gains[1].gain.value,0);
 await sound.pause();assert.equal(FakeAudio.instance.state,'suspended');
 await sound.configure(false,false);assert.equal(sound.music,false);assert.equal(sound.effects,false);
});
