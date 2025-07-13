import type { Metadata } from "next";
import "./globals.css";
import Navigation from "@/components/Navigation";

export const metadata: Metadata = {
  title: "Battle64 - Retro neu entfacht",
  description: "Die N64-Community für Millennials. Sammle Spiele, nimm an Events teil und verbinde dich mit anderen Retro-Fans.",
  keywords: "N64, Nintendo 64, Retro Gaming, Speedrun, Sammlung, Community, Millennials",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body className="antialiased">
        <Navigation />
        {children}
      </body>
    </html>
  );
}
