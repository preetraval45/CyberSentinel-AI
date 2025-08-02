'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Shield, Plus, Settings, Check, X } from 'lucide-react'
import { SSOProvider, SSO_PROVIDERS } from '../../types/settings'
import toast from 'react-hot-toast'

interface SSOIntegrationsProps {
  providers: SSOProvider[]
  onUpdate: (providers: SSOProvider[]) => void
}

export default function SSOIntegrations({ providers, onUpdate }: SSOIntegrationsProps) {
  const [editingProvider, setEditingProvider] = useState<string | null>(null)
  const [showAddProvider, setShowAddProvider] = useState(false)

  const toggleProvider = (providerId: string) => {
    const updatedProviders = providers.map(p => 
      p.id === providerId ? { ...p, enabled: !p.enabled } : p
    )
    onUpdate(updatedProviders)
    toast.success(`SSO provider ${providers.find(p => p.id === providerId)?.enabled ? 'disabled' : 'enabled'}`)
  }

  const addProvider = (providerType: typeof SSO_PROVIDERS[0]) => {
    const newProvider: SSOProvider = {
      id: providerType.id,
      name: providerType.name,
      type: providerType.type,
      enabled: false,
      config: {}
    }
    onUpdate([...providers, newProvider])
    setShowAddProvider(false)
    toast.success('SSO provider added')
  }

  return (
    <div className="cyber-card">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Shield className="w-6 h-6 text-cyber-primary" />
          <h3 className="font-cyber font-bold text-cyber-primary">SSO INTEGRATIONS</h3>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddProvider(true)}
          className="cyber-button flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>ADD PROVIDER</span>
        </motion.button>
      </div>

      <div className="space-y-4">
        {providers.map((provider) => {
          const providerInfo = SSO_PROVIDERS.find(p => p.id === provider.id)
          return (
            <motion.div
              key={provider.id}
              whileHover={{ scale: 1.01 }}
              className={`p-4 rounded-lg border transition-all ${
                provider.enabled 
                  ? 'border-cyber-green/30 bg-cyber-green/5' 
                  : 'border-cyber-primary/30 bg-cyber-primary/5'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="text-2xl">{providerInfo?.icon}</span>
                  <div>
                    <h4 className="font-cyber font-bold text-cyber-primary">{provider.name}</h4>
                    <p className="text-cyber-primary/70 text-sm uppercase">{provider.type}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-cyber font-bold ${
                    provider.enabled 
                      ? 'bg-cyber-green/20 text-cyber-green' 
                      : 'bg-cyber-red/20 text-cyber-red'
                  }`}>
                    {provider.enabled ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                    <span>{provider.enabled ? 'ENABLED' : 'DISABLED'}</span>
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setEditingProvider(provider.id)}
                    className="p-2 rounded border border-cyber-primary/30 hover:border-cyber-primary/60 transition-colors"
                  >
                    <Settings className="w-4 h-4 text-cyber-primary" />
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggleProvider(provider.id)}
                    className={`px-4 py-2 rounded font-cyber font-bold text-xs transition-colors ${
                      provider.enabled
                        ? 'bg-cyber-red/20 text-cyber-red hover:bg-cyber-red hover:text-cyber-dark'
                        : 'bg-cyber-green/20 text-cyber-green hover:bg-cyber-green hover:text-cyber-dark'
                    }`}
                  >
                    {provider.enabled ? 'DISABLE' : 'ENABLE'}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {showAddProvider && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 glass-dark rounded-lg border border-cyber-primary/30"
        >
          <h4 className="font-cyber font-bold text-cyber-primary mb-4">ADD SSO PROVIDER</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {SSO_PROVIDERS.filter(p => !providers.find(existing => existing.id === p.id)).map((provider) => (
              <motion.button
                key={provider.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => addProvider(provider)}
                className="p-3 rounded border border-cyber-primary/30 hover:border-cyber-primary/60 transition-colors flex items-center space-x-3"
              >
                <span className="text-xl">{provider.icon}</span>
                <div className="text-left">
                  <p className="font-cyber font-bold text-cyber-primary text-sm">{provider.name}</p>
                  <p className="text-cyber-primary/70 text-xs uppercase">{provider.type}</p>
                </div>
              </motion.button>
            ))}
          </div>
          <div className="flex justify-end mt-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAddProvider(false)}
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