'use client'

import { motion } from 'framer-motion'
import { UserRole, getRoleConfig } from '../../types/roles'
import { Crown, Shield, GraduationCap, BarChart, User } from 'lucide-react'

interface RoleSelectorProps {
  selectedRole: UserRole
  onRoleChange: (role: UserRole) => void
  availableRoles?: UserRole[]
}

const roleIcons = {
  superadmin: Crown,
  admin: Shield,
  securitytrainer: GraduationCap,
  analyst: BarChart,
  employee: User
}

export default function RoleSelector({ 
  selectedRole, 
  onRoleChange, 
  availableRoles = ['admin', 'securitytrainer', 'analyst', 'employee'] 
}: RoleSelectorProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-cyber font-bold text-cyber-primary mb-4">SELECT ROLE</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {availableRoles.map((role) => {
          const config = getRoleConfig(role)
          const IconComponent = roleIcons[role]
          const isSelected = selectedRole === role
          
          return (
            <motion.div
              key={role}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onRoleChange(role)}
              className={`cyber-card cursor-pointer transition-all duration-300 ${
                isSelected ? 'border-cyber-primary cyber-glow' : 'border-cyber-primary/30'
              }`}
            >
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br from-current to-current/70 flex items-center justify-center ${config.color}`}>
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className={`font-cyber font-bold ${config.color} mb-1`}>
                    {config.displayName}
                  </h4>
                  <p className="text-cyber-primary/70 text-sm">
                    {config.description}
                  </p>
                </div>
                {isSelected && (
                  <div className="w-6 h-6 bg-cyber-primary rounded-full flex items-center justify-center">
                    <span className="text-cyber-dark text-sm">✓</span>
                  </div>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}