import React from 'react'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Battle64 Community - Fanart & Screenshot Gallery',
  description: 'Share your retro gaming fanart and screenshots with the Battle64 community. Join competitions, earn badges, and connect with fellow retro gaming enthusiasts.',
  keywords: 'battle64, community, fanart, screenshots, retro gaming, n64, mario kart, gaming art',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-br from-retro-gray via-gray-900 to-black">
          {children}
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#1F2937',
                color: '#fff',
                border: '1px solid #4B5563',
              },
            }}
          />
        </div>
      </body>
    </html>
  )
}