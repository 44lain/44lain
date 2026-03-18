import type { Metadata } from 'next'
import { Electrolize, VT323, Share_Tech_Mono } from 'next/font/google'
import './globals.css'

const electrolize = Electrolize({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-electrolize',
  display: 'swap',
})

const vt323 = VT323({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-vt323',
  display: 'swap',
})

const shareTechMono = Share_Tech_Mono({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-share-tech-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'WIRED_OS',
  description: 'Interactive portfolio OS — boot into creativity.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${electrolize.variable} ${vt323.variable} ${shareTechMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  )
}
