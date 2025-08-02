'use client'
import './globals.css'
import Navbar from '../components/Navbar'
import { AuthProvider } from '@/contexts/AuthContext'
import { motion } from 'framer-motion'
import ErrorBoundary from '../components/ui/ErrorBoundary'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-900 text-gray-100 font-sans overflow-x-hidden">
        <AuthProvider>
          <ErrorBoundary>
            <div className="dark-grid fixed inset-0 opacity-10 pointer-events-none" />
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
          </ErrorBoundary>
        </AuthProvider>
      </body>
    </html>
  )
}
