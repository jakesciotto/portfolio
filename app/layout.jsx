export const metadata = {
  title: {
    default: 'jake sciotto',
    template: '%s | jake sciotto',
  },
  description:
    'engineer by training, problem solver by trade, chaos agent by choice',
}

import './global.css'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import FixedHeader from './components/fixed-header'
import Footer from './components/footer'
import ScrollProvider from './components/scroll-provider'
import { TooltipProvider } from '@/app/components/ui/tooltip'

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`bg-background text-foreground ${GeistSans.variable} ${GeistMono.variable}`}
    >
      <body className="antialiased pt-14 min-h-screen flex flex-col">
        <ScrollProvider>
          <TooltipProvider>
            <FixedHeader />
            <main className="flex-auto min-w-0 flex flex-col flex-grow">
              {children}
            </main>
            <Footer />
          </TooltipProvider>
        </ScrollProvider>
      </body>
    </html>
  )
}
