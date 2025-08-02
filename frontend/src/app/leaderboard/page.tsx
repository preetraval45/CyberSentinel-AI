'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Trophy, Users, Zap, RefreshCw } from 'lucide-react'
import LeaderboardFiltersComponent from '../../components/leaderboard/LeaderboardFilters'
import LeaderboardEntry from '../../components/leaderboard/LeaderboardEntry'
import { LeaderboardEntry as Entry, LeaderboardFilters, generateLeaderboardData } from '../../types/leaderboard'
import toast from 'react-hot-toast'

export default function LeaderboardPage() {
  const [entries, setEntries] = useState<Entry[]>([])
  const [filteredEntries, setFilteredEntries] = useState<Entry[]>([])
  const [filters, setFilters] = useState<LeaderboardFilters>({
    department: 'All Departments',
    organization: 'All Organizations',
    timeframe: 'month',
    minScore: 0
  })
  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    const data = generateLeaderboardData()
    setEntries(data)
    setFilteredEntries(data)
  }, [])

  useEffect(() => {
    let filtered = entries.filter(entry => {
      if (filters.department !== 'All Departments' && entry.department !== filters.department) return false
      if (filters.organization !== 'All Organizations' && entry.organization !== filters.organization) return false
      if (entry.securityScore < filters.minScore) return false
      return true
    })

    filtered = filtered.map((entry, index) => ({
      ...entry,
      rank: index + 1
    }))

    setFilteredEntries(filtered)
  }, [entries, filters])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    const newData = generateLeaderboardData()
    setEntries(newData)
    setIsRefreshing(false)
    toast.success('Leaderboard updated with latest AI analysis!')
  }

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Trophy className="w-8 h-8 text-cyber-accent" />
              <div>
                <h1 className="text-4xl md:text-6xl font-cyber font-black neon-text">
                  SECURITY LEADERBOARD
                </h1>
                <p className="text-cyber-primary/70 font-mono">
                  AI-powered employee security rankings
                </p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="cyber-button flex items-center space-x-2"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{isRefreshing ? 'UPDATING...' : 'REFRESH'}</span>
            </motion.button>
          </div>
        </motion.div>

        <LeaderboardFiltersComponent filters={filters} onFiltersChange={setFilters} />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-cyber font-bold neon-text">
                  RANKINGS ({filteredEntries.length})
                </h2>
                <div className="flex items-center space-x-4 text-sm text-cyber-primary/70">
                  <span>Updated: {new Date().toLocaleTimeString()}</span>
                  <Zap className="w-4 h-4 text-cyber-accent animate-pulse" />
                </div>
              </div>

              {filteredEntries.map((entry, index) => (
                <LeaderboardEntry key={entry.id} entry={entry} index={index} />
              ))}

              {filteredEntries.length === 0 && (
                <div className="cyber-card text-center py-12">
                  <Users className="w-16 h-16 text-cyber-primary/30 mx-auto mb-4" />
                  <h3 className="font-cyber font-bold text-cyber-primary mb-2">NO RESULTS</h3>
                  <p className="text-cyber-primary/70">No users match the current filters</p>
                </div>
              )}
            </motion.div>
          </div>

          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="cyber-card"
            >
              <h3 className="font-cyber font-bold text-cyber-primary mb-4">STATISTICS</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-cyber-primary/70">Total Users:</span>
                  <span className="font-cyber font-bold text-cyber-primary">
                    {filteredEntries.length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-cyber-primary/70">Avg Score:</span>
                  <span className="font-cyber font-bold text-cyber-accent">
                    {Math.round(filteredEntries.reduce((sum, e) => sum + e.securityScore, 0) / filteredEntries.length || 0)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-cyber-primary/70">High Performers:</span>
                  <span className="font-cyber font-bold text-cyber-green">
                    {filteredEntries.filter(e => e.securityScore >= 90).length}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}