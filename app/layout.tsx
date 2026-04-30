import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'VisionCrypt - Password Generator, QR Code, Image Editor & Color Palette',
  description: 'All-in-one utility toolkit featuring secure password generation, QR code creation, image compression & resizing, color palette generation, and password strength analysis. Fast, private, and beautiful.',
  keywords: 'password generator, QR code generator, image editor, color palette, password analyzer, compression, image resizer, secure tools',
  authors: [{ name: 'VisionCrypt' }],
  openGraph: {
    title: 'VisionCrypt - Your Complete Digital Toolbox',
    description: 'Secure password generation, QR codes, image editing, and color design. All with modern glassmorphic design.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VisionCrypt',
    description: 'Your Complete Digital Toolbox for Security & Design',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#00D4FF',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} dark:bg-slate-900`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}


