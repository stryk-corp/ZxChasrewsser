import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "Stryk's ScholarVerse",
  description: 'Generate academic papers with AI.',
};
 

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Literata:ital,opsz,wght@0,7..72,200..900;1,7..72,200..900&family=Inter:wght@400;500;700&family=Cormorant+Garamond:ital,wght@0,400;0,700;1,400&family=Uncial+Antiqua&family=Roboto+Mono&family=Orbitron&family=Lato&family=Merriweather&family=Source+Code+Pro&family=Architects+Daughter&family=Poppins&family=Playfair+Display&family=Helvetica&family=Quicksand&family=Pacifico&family=Times+New+Roman&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
  {children}
        <Toaster />
      </body>
    </html>
  );
}
