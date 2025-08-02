'use client'
import './globals.css'
import Navbar from '../components/Navbar'
import { motion } from 'framer-motion'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-cyber-darker text-cyber-primary font-mono overflow-x-hidden">
        <div className="cyber-grid fixed inset-0 opacity-20 pointer-events-none" />
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="relative z-10"
        >
          <Navbar />
          <main className="relative">
            {children}
          </main>
        </motion.div>
      </body>
    </html>
  )
}
