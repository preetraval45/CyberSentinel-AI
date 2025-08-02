'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { FileCheck, Plus, AlertTriangle, Check, Calendar } from 'lucide-react'
import { CompliancePolicy, COMPLIANCE_FRAMEWORKS } from '../../types/settings'
import toast from 'react-hot-toast'

interface CompliancePoliciesProps {
  policies: CompliancePolicy[]
  onUpdate: (policies: CompliancePolicy[]) => void
}

export default function CompliancePolicies({ policies, onUpdate }: CompliancePoliciesProps) {
  const [showAddPolicy, setShowAddPolicy] = useState(false)

  const togglePolicy = (policyId: string) => {
    const updatedPolicies = policies.map(p => 
      p.id === policyId ? { ...p, enabled: !p.enabled } : p
    )
    onUpdate(updatedPolicies)
    toast.success('Policy updated!')
  }

  const addPolicy = (framework: typeof COMPLIANCE_FRAMEWORKS[0]) => {
    const newPolicy: CompliancePolicy = {
      id: `policy_${Date.now()}`,
      name: framework.name,
      type: framework.id as any,
      description: framework.description,
      requirements: [
        'Data encryption at rest and in transit',
        'Regular security assessments',
        'Employee training and awareness',
        'Incident response procedures'
      ],
      enabled: false,
      lastReview: new Date(),
      nextReview: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      assignedTo: []
    }
    
    onUpdate([...policies, newPolicy])
    setShowAddPolicy(false)
    toast.success('Compliance policy added!')
  }

  const getStatusColor = (policy: CompliancePolicy) => {
    if (!policy.enabled) return 'text-cyber-red'
    const daysUntilReview = Math.ceil((policy.nextReview.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    if (daysUntilReview < 30) return 'text-cyber-accent'
    return 'text-cyber-green'
  }

  const getStatusText = (policy: CompliancePolicy) => {
    if (!policy.enabled) return 'DISABLED'
    const daysUntilReview = Math.ceil((policy.nextReview.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    if (daysUntilReview < 30) return 'REVIEW DUE'
    return 'COMPLIANT'
  }

  return (
    <div className="cyber-card">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <FileCheck className="w-6 h-6 text-cyber-primary" />
          <h3 className="font-cyber font-bold text-cyber-primary">COMPLIANCE POLICIES</h3>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddPolicy(true)}
          className="cyber-button flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>ADD POLICY</span>
        </motion.button>
      </div>

      <div className="space-y-4">
        {policies.map((policy) => (
          <motion.div
            key={policy.id}
            whileHover={{ scale: 1.01 }}
            className={`p-4 rounded-lg border transition-all ${
              policy.enabled 
                ? 'border-cyber-green/30 bg-cyber-green/5' 
                : 'border-cyber-primary/30 bg-cyber-primary/5'
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h4 className="font-cyber font-bold text-cyber-primary">{policy.name}</h4>
                  <span className={`px-2 py-1 text-xs font-cyber font-bold rounded ${getStatusColor(policy)} bg-current/20`}>
                    {getStatusText(policy)}
                  </span>
                </div>
                <p className="text-cyber-primary/70 text-sm mb-3">{policy.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-cyber-primary/70" />
                    <div>
                      <p className="text-cyber-primary/70">Last Review</p>
                      <p className="text-cyber-primary font-mono">
                        {policy.lastReview.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4 text-cyber-primary/70" />
                    <div>
                      <p className="text-cyber-primary/70">Next Review</p>
                      <p className="text-cyber-primary font-mono">
                        {policy.nextReview.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => togglePolicy(policy.id)}
                  className={`px-4 py-2 rounded font-cyber font-bold text-xs transition-colors ${
                    policy.enabled
                      ? 'bg-cyber-red/20 text-cyber-red hover:bg-cyber-red hover:text-cyber-dark'
                      : 'bg-cyber-green/20 text-cyber-green hover:bg-cyber-green hover:text-cyber-dark'
                  }`}
                >
                  {policy.enabled ? 'DISABLE' : 'ENABLE'}
                </motion.button>
              </div>
            </div>
            
            <div className="border-t border-cyber-primary/20 pt-3">
              <p className="text-cyber-primary/70 text-sm mb-2">Requirements:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {policy.requirements.slice(0, 4).map((req, index) => (
                  <div key={index} className="flex items-center space-x-2 text-sm">
                    <Check className="w-3 h-3 text-cyber-green" />
                    <span className="text-cyber-primary/80">{req}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {showAddPolicy && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 glass-dark rounded-lg border border-cyber-primary/30"
        >
          <h4 className="font-cyber font-bold text-cyber-primary mb-4">ADD COMPLIANCE POLICY</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {COMPLIANCE_FRAMEWORKS.filter(f => !policies.find(p => p.type === f.id)).map((framework) => (
              <motion.button
                key={framework.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => addPolicy(framework)}
                className="p-3 rounded border border-cyber-primary/30 hover:border-cyber-primary/60 transition-colors text-left"
              >
                <h5 className="font-cyber font-bold text-cyber-primary text-sm mb-1">
                  {framework.name}
                </h5>
                <p className="text-cyber-primary/70 text-xs">{framework.description}</p>
              </motion.button>
            ))}
          </div>
          <div className="flex justify-end mt-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAddPolicy(false)}
              className="cyber-button border-cyber-red text-cyber-red hover:bg-cyber-red hover:text-cyber-dark"
            >
              CANCEL
            </motion.button>
          </div>
        </motion.div>
      )}
    </div>
  )
}