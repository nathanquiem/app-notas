import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import PwaInstallPrompt from '@/components/PwaInstallPrompt'
import ServiceWorkerRegister from '@/components/ServiceWorkerRegister'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MyDocs',
  description: 'Seu workspace pessoal e seguro para anotações, senhas e mapas mentais.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'MyDocs',
  },
}

export const viewport = {
  themeColor: '#000000',
}


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
          <PwaInstallPrompt />
          <ServiceWorkerRegister />
        </ThemeProvider>
      </body>
    </html>
  )
}
