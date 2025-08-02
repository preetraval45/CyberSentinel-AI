import Link from 'next/link'
import Image from 'next/image'

export default function Navbar() {
  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Image src="/logo.png" alt="CyberSentinel AI" width={40} height={40} className="rounded" />
              <span className="text-xl font-bold text-gray-800">CyberSentinel AI</span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
              Dashboard
            </Link>
            <Link href="/threats" className="text-gray-600 hover:text-gray-900">
              Threats
            </Link>
            <Link href="/vulnerabilities" className="text-gray-600 hover:text-gray-900">
              Vulnerabilities
            </Link>
            <Link href="/phishing" className="text-gray-600 hover:text-gray-900">
              Phishing
            </Link>
            <Link href="/chat" className="text-gray-600 hover:text-gray-900">
              Chat
            </Link>
            <Link href="/simulation" className="text-gray-600 hover:text-gray-900">
              Simulation
            </Link>
            <Link href="/training" className="text-gray-600 hover:text-gray-900">
              Training
            </Link>
            <Link href="/admin" className="text-gray-600 hover:text-gray-900">
              Admin
            </Link>
            <Link href="/login" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
              Login
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}