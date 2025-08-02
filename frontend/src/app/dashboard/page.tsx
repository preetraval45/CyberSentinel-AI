export default function Dashboard() {
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Security Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900">Active Threats</h3>
            <p className="text-3xl font-bold text-red-600 mt-2">12</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900">Vulnerabilities</h3>
            <p className="text-3xl font-bold text-yellow-600 mt-2">8</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900">Security Score</h3>
            <p className="text-3xl font-bold text-green-600 mt-2">85%</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900">AI Alerts</h3>
            <p className="text-3xl font-bold text-blue-600 mt-2">3</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Recent Threats</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-red-50 rounded">
                <span>Malware Detection</span>
                <span className="text-red-600 font-semibold">High</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-yellow-50 rounded">
                <span>Suspicious Network Activity</span>
                <span className="text-yellow-600 font-semibold">Medium</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">AI Insights</h2>
            <div className="space-y-3">
              <div className="p-3 bg-blue-50 rounded">
                <p className="text-sm">Unusual login patterns detected from IP 192.168.1.100</p>
              </div>
              <div className="p-3 bg-green-50 rounded">
                <p className="text-sm">Security posture improved by 15% this week</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}