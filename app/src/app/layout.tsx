import type { PropsWithChildren } from 'react'
import type { Metadata } from 'next'

import { Root } from '@/components/Root/Root'
import Navbar from '@/components/NavBar'
import Auth from '@/components/Auth'

import 'normalize.css/normalize.css'
import './_assets/globals.css'
import { ThemeProvider } from '@/components/themeprovider'
import { Toaster } from '@/components/ui/sonner'
import { WalletProvider } from '@/contexts/WalletContext'
import { CSPostHogProvider } from '@/contexts/PostHogProvider'
import BottomNav from '@/components/BottomNav'
import {
  AlertCircleIcon,
  AlertTriangleIcon,
  CheckCircleIcon,
  InfoIcon,
  Loader2Icon
} from 'lucide-react'
import dynamic from 'next/dynamic'

const InstallPWA = dynamic(() => import('@/components/InstallPWA').then((mod) => mod.InstallPWA), {
  ssr: false
})

export const metadata: Metadata = {
  title: 'Instant Send App by CTRL',
  description: 'Instant Send App by CTRL',
  manifest: '/manifest.json',
  themeColor: '#000000',
  viewport: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black',
    title: 'CTRL Wallet'
  },
  icons: {
    apple: '/icons/icon-192x192.png'
  }
}

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
        <meta name="apple-mobile-web-app-title" content="CTRL Wallet" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon-180x180.png" />
      </head>
      <body>
        <Root>
          <CSPostHogProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <WalletProvider>
                <Toaster
                  className="mt-16 text-sm"
                  position="top-center"
                  icons={{
                    success: <CheckCircleIcon className="text-green-500 h-4 w-4" />,
                    info: <InfoIcon className="text-blue-500 h-4 w-4" />,
                    warning: <AlertTriangleIcon className="text-yellow-500 h-4 w-4" />,
                    error: <AlertCircleIcon className="text-red-500 h-4 w-4" />,
                    loading: <Loader2Icon className="text-blue-500 h-4 w-4" />
                  }}
                />
                <Navbar />
                <Auth>
                  <main className="">{children}</main>
                </Auth>
                <InstallPWA />
                <BottomNav />
              </WalletProvider>
            </ThemeProvider>
          </CSPostHogProvider>
        </Root>
      </body>
    </html>
  )
}
