import { Inter } from 'next/font/google';   // This will be the rpimary font
import { Lusitana } from 'next/font/google';

export const inter=Inter({subsets:  ['latin']}) // Load the 'latin' variant of the font
export const lusitana=Lusitana({weight: ['400','700'], subsets: ['latin']})