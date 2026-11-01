export type Point=[number,number];
export type Island={floor:string[];loose:string[];sockets:string[];start:Point;home:Point;runes:string[];plates:string[];gates:string[]};
export type Level={title:string;region:string;lesson:string;mechanic:string;par:number;islands:[Island,Island]};
// Every gap is on a route to home or a required keepsake. Stars are actual ground,
// not a free resource pool. Adjacent harvesting makes the order matter.
export function parse(rows:string[]):Island{
 const out:Island={floor:[],loose:[],sockets:[],start:[0,0],home:[0,0],runes:[],plates:[],gates:[]};
 if(rows.length!==5||rows.some(r=>r.length!==7))throw new Error('Islands must be 7 by 5.');
 rows.forEach((row,y)=>[...row].forEach((c,x)=>{const k=x+','+y;if(c==='#')return;if(c==='o'){out.sockets.push(k);return;}out.floor.push(k);if(c==='S')out.start=[x,y];if(c==='H')out.home=[x,y];if(c==='*')out.loose.push(k);if(c==='R')out.runes.push(k);if(c==='P')out.plates.push(k);if(c==='G')out.gates.push(k);}));return out;
}
const level=(title:string,region:string,mechanic:string,lesson:string,par:number,a:string[],b:string[]):Level=>({title,region,mechanic,lesson,par,islands:[parse(a),parse(b)]});
export const LEVELS:Level[]=[
 level('A little give and take','The Clearing','First exchange','Step past your star before giving it. Build the missing bridge for each other.',12,
 ['#######','...####','S*.o..H','#######','#######'],
 ['#######','#######','S*.####','##.####','##.o..H']),
 level('Something worth returning for','Fern Hollow','Keepsakes','Collect your glowing keepsake before going home. Taking a shortcut apart too early can strand you.',18,
 ['#R#####','#.#####','S*.o..H','#..####','#######'],
 ['#######','###R###','###.###','S*.o..H','#..####']),
 level('One piece ahead','Moonlit Bend','Uneven needs','One world needs two bridges, the other needs one. Gifts are ground you still have to travel across.',34,
 ['#######','#######','S**o..H','#..####','#######'],
 ['#######','###R###','###o###','S*..o.H','#..####']),
 level('The order of things','Split Creek','Two bridges','Carry one piece at a time. Both gaps matter: one leads to a keepsake, the other leads home.',26,
 ['#######','###R###','###o###','S**.o.H','#######'],
 ['#######','####R##','####o##','S**..oH','#######']),
 level('Across the distance','Lantern Marsh','Shared switches','A round switch in your world opens the gate in your partner’s. Once crossed, a gate stays open.',24,
 ['#######','##R####','##.####','S*.o.GH','#..####'],
 ['#######','##P####','##.####','S*.o..H','#..####']),
 level('A favor, then a favor','The Watchtowers','Reciprocal gates','Each gate needs the other world’s switch. Reach your keepsake and agree who crosses first.',34,
 ['###R###','###.###','S*.o.GH','#.P####','#######'],
 ['#######','###P###','S*.o.GH','#..###.','#####R.']),
 level('The last safe footing','Starfall Pass','Commitment','Collect both keepsakes. Choose a safe place to stand before lifting a tile you may need again.',40,
 ['#R#####','#.##R##','S**.o##','#..#.##','####o.H'],
 ['#######','R.o.###','###*###','S*..o.H','#..####']),
 level('Room for two','Homeward Sky','Final crossing','Use everything you learned: keepsakes, shared switches, and gifts made from the path beneath you.',48,
 ['#R#####','#.##P##','S**ooGH','#..####','#######'],
 ['#######','##P#R##','##..o##','S**.oGH','#..####']),
];
