import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            CyberSentinel AI
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            AI-powered cybersecurity platform for real-time threat detection and response
          </p>
          <Link href="/dashboard" className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700">
            Get Started
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Link href="/threats" className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-red-600 text-4xl mb-4">🛡️</div>
            <h2 className="text-2xl font-semibold mb-4">Threat Detection</h2>
            <p className="text-gray-600">Real-time monitoring and threat identification with AI-powered analysis</p>
          </Link>
          
          <Link href="/dashboard" className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-blue-600 text-4xl mb-4">🤖</div>
            <h2 className="text-2xl font-semibold mb-4">AI Analysis</h2>
            <p className="text-gray-600">Intelligent security analysis and automated recommendations</p>
          </Link>
          
          <Link href="/vulnerabilities" className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-yellow-600 text-4xl mb-4">🔍</div>
            <h2 className="text-2xl font-semibold mb-4">Vulnerability Scan</h2>
            <p className="text-gray-600">Automated vulnerability assessment and security posture evaluation</p>
          </Link>
        </div>
      </div>
    </main>
  )
}