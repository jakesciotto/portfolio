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
import { TooltipProvider } from '@/app/components/ui/tooltip'

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`bg-background text-foreground ${GeistSans.variable} ${GeistMono.variable}`}
    >
      <body className="antialiased max-w-2xl mx-4 mt-8 lg:mx-auto min-h-screen flex flex-col">
        <TooltipProvider>
          <StatsBar />
          <main className="flex-auto min-w-0 mt-6 flex flex-col px-2 md:px-0 flex-grow">
            <Navbar />
            {children}
            <Footer />
          </main>
        </TooltipProvider>
      </body>
    </html>
  )
}
