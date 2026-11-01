import type { Metadata } from 'next';
import './globals.css';
export const metadata:Metadata={title:'The Missing Piece | A game for two',description:'Two little worlds. Every piece you give leaves a hole behind. A cooperative puzzle for two players.',icons:{icon:'/favicon.svg'}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>;}
