import type { Metadata } from 'next';
import './globals.css';
export const metadata:Metadata={title:'The Missing Piece | A game for two',description:'Two little worlds. Every piece you give leaves a hole behind. A cooperative puzzle for two players.',icons:{icon:'/favicon.svg'}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en" suppressHydrationWarning><head><script dangerouslySetInnerHTML={{__html:`try{var p=JSON.parse(localStorage.getItem('missing-piece-preferences')||'null');document.documentElement.dataset.theme=p&&p.theme==='light'?'light':'dark';}catch(e){}`}}/></head><body>{children}</body></html>;}
