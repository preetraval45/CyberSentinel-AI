'use client'

import { motion } from 'framer-motion'
import { Filter, Calendar, Building, Users } from 'lucide-react'
import { LeaderboardFilters, DEPARTMENTS, ORGANIZATIONS } from '../../types/leaderboard'

interface LeaderboardFiltersProps {
  filters: LeaderboardFilters
  onFiltersChange: (filters: LeaderboardFilters) => void
}

export default function LeaderboardFiltersComponent({ filters, onFiltersChange }: LeaderboardFiltersProps) {
  const updateFilter = (key: keyof LeaderboardFilters, value: any) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="cyber-card mb-8"
    >
      <div className="flex items-center space-x-3 mb-6">
        <Filter className="w-6 h-6 text-cyber-primary" />
        <h3 className="font-cyber font-bold text-cyber-primary">LEADERBOARD FILTERS</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="flex items-center space-x-2 text-cyber-primary/70 text-sm mb-2">
            <Building className="w-4 h-4" />
            <span>Organization</span>
          </label>
          <select
            value={filters.organization}
            onChange={(e) => updateFilter('organization', e.target.value)}
            className="cyber-input w-full"
          >
            {ORGANIZATIONS.map(org => (
              <option key={org} value={org}>{org}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="flex items-center space-x-2 text-cyber-primary/70 text-sm mb-2">
            <Users className="w-4 h-4" />
            <span>Department</span>
          </label>
          <select
            value={filters.department}
            onChange={(e) => updateFilter('department', e.target.value)}
            className="cyber-input w-full"
          >
            {DEPARTMENTS.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="flex items-center space-x-2 text-cyber-primary/70 text-sm mb-2">
            <Calendar className="w-4 h-4" />
            <span>Timeframe</span>
          </label>
          <select
            value={filters.timeframe}
            onChange={(e) => updateFilter('timeframe', e.target.value)}
            className="cyber-input w-full"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="all">All Time</option>
          </select>
        </div>

        <div>
          <label className="text-cyber-primary/70 text-sm mb-2 block">
            Min Score: {filters.minScore}
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={filters.minScore}
            onChange={(e) => updateFilter('minScore', parseInt(e.target.value))}
            className="w-full h-2 bg-cyber-dark rounded-lg appearance-none cursor-pointer slider"
          />
        </div>
      </div>
    </motion.div>
  )
}