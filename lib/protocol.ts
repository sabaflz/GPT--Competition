import type {Game} from './game';
import type {Traveler} from './travelers';
export type Room={code:string;player:number;names:[string,string|null];joined:boolean;state:Game;version:number;seen:[number,number|null];travelers:[Traveler,Traveler]};
