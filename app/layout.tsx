import '@/app/ui/global.css'; // Add the global style rules to this file
import { inter } from './ui/fonts';
//By adding Inter to the body element, the font will be applied throughout your application. Here, you're also adding the Tailwind antialiased class which smooths out the font.

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>{children}</body> 
    </html>
  );
}
