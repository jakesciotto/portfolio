export const metadata = {
  title: {
    default: 'jake sciotto',
    template: '%s | jake sciotto',
  },
  description: 'engineer by training, problem solver by trade, chaos agent by choice',
}

import './global.css'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Navbar } from './components/nav'
import Footer from './components/footer'
import StatsBar from './components/stats-bar'
import ScrollProvider from './components/scroll-provider'
import { TooltipProvider } from '@/app/components/ui/tooltip'

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`bg-background text-foreground ${GeistSans.variable} ${GeistMono.variable}`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme:dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}})()`,
          }}
        />
      </head>
      <body className="antialiased mt-8 min-h-screen flex flex-col">
        <ScrollProvider>
          <TooltipProvider>
            <StatsBar />
            <main className="flex-auto min-w-0 mt-6 flex flex-col flex-grow max-w-3xl mx-auto w-full px-4 md:px-0">
              <Navbar />
              {children}
              <Footer />
            </main>
          </TooltipProvider>
        </ScrollProvider>
      </body>
    </html>
  )
}
