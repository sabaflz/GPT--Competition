export const COLORS = [
 {id:'blue',name:'Sky',body:'#b7dfe4',shade:'#78aeb9'},
 {id:'lilac',name:'Lilac',body:'#d5c5e9',shade:'#a18abf'},
 {id:'sage',name:'Sage',body:'#c2dab3',shade:'#86aa7d'},
 {id:'peach',name:'Peach',body:'#edc7ad',shade:'#c3927c'},
] as const;
export const SHAPES = ['sprout','round','leaf'] as const;
export type Traveler={color:string;shape:string};
export const defaults: [Traveler,Traveler]=[{color:'blue',shape:'sprout'},{color:'lilac',shape:'sprout'}];
export function validTraveler(input:unknown):Traveler{
 const value=input as Partial<Traveler>|undefined;
 if(!value||!COLORS.some(c=>c.id===value.color)||!SHAPES.some(s=>s===value.shape))throw new Error('Choose one of the available travelers.');
 return {color:value.color!,shape:value.shape!};
}
export function chooseAvailable(choice:Traveler,taken:string[]):Traveler{return taken.includes(choice.color)?{...choice,color:COLORS.find(c=>!taken.includes(c.id))?.id||'blue'}:choice;}
