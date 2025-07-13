import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'N64-Nexus - Battle64 Achievement System',
  description: 'Ein umfassendes Achievement- und Trophäensystem für Battle64 mit Retro-Charme und Pokémon-ähnlichem Sammelreiz.',
  keywords: ['N64', 'Battle64', 'Achievements', 'Trophies', 'Gaming', 'Retro'],
  authors: [{ name: 'N64-Nexus Team' }],
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de">
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-br from-n64-purple via-n64-blue to-n64-green">
          {children}
        </div>
      </body>
    </html>
  )
}