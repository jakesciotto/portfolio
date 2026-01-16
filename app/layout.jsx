import './global.css'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Navbar } from './components/nav'
import Footer from './components/footer'

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`text-black bg-white dark:text-white dark:bg-black ${GeistSans.variable} ${GeistMono.variable}`}
    >
      <body className="antialiased max-w-2xl mx-4 mt-8 lg:mx-auto min-h-screen flex flex-col">
        <main className="flex-auto min-w-0 mt-6 flex flex-col px-2 md:px-0 flex-grow">
          <Navbar />
          {children}
          <Footer />
        </main>
      </body>
    </html>
  )
}
