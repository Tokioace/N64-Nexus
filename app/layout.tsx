import React from 'react'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AnimationProvider } from '../components/AnimationProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Battle64 - Premium Retro Gaming',
  description: 'Experience the ultimate retro gaming platform with advanced animations and 90s nostalgia',
  keywords: 'retro gaming, N64, animations, battle, gaming platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-retro-black text-crt-green overflow-x-hidden`}>
        <AnimationProvider>
          <div className="crt-scanlines crt-flicker min-h-screen">
            {children}
          </div>
        </AnimationProvider>
      </body>
    </html>
  )
}