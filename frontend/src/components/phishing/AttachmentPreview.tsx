'use client'

import { motion } from 'framer-motion'
import { FileText, Image, Archive, AlertTriangle, Download, Eye } from 'lucide-react'

interface Attachment {
  name: string
  type: 'pdf' | 'image' | 'zip' | 'doc'
  size: string
  isMalicious: boolean
  preview?: string
}

interface AttachmentPreviewProps {
  attachments: Attachment[]
}

const attachmentIcons = {
  pdf: FileText,
  image: Image,
  zip: Archive,
  doc: FileText
}

const attachmentColors = {
  pdf: 'text-cyber-red',
  image: 'text-cyber-secondary',
  zip: 'text-cyber-accent',
  doc: 'text-cyber-primary'
}

export default function AttachmentPreview({ attachments }: AttachmentPreviewProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-cyber font-bold text-cyber-primary mb-4">ATTACHMENTS</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {attachments.map((attachment, index) => {
          const IconComponent = attachmentIcons[attachment.type]
          const colorClass = attachmentColors[attachment.type]
          
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className={`glass-dark p-4 rounded-lg border transition-all duration-300 ${
                attachment.isMalicious 
                  ? 'border-cyber-red/50 bg-cyber-red/5' 
                  : 'border-cyber-primary/20 hover:border-cyber-primary/40'
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded ${attachment.isMalicious ? 'bg-cyber-red/20' : 'bg-cyber-primary/20'}`}>
                  <IconComponent className={`w-6 h-6 ${attachment.isMalicious ? 'text-cyber-red' : colorClass}`} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <p className="font-cyber font-bold text-cyber-primary text-sm truncate">
                      {attachment.name}
                    </p>
                    {attachment.isMalicious && (
                      <AlertTriangle className="w-4 h-4 text-cyber-red animate-pulse" />
                    )}
                  </div>
                  
                  <p className="text-cyber-primary/70 text-xs font-mono mb-2">
                    {attachment.size} • {attachment.type.toUpperCase()}
                  </p>
                  
                  {attachment.isMalicious && (
                    <div className="text-xs text-cyber-red font-cyber font-bold mb-2">
                      ⚠️ MALICIOUS DETECTED
                    </div>
                  )}
                  
                  <div className="flex space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center space-x-1 px-2 py-1 text-xs bg-cyber-primary/20 text-cyber-primary rounded border border-cyber-primary/30 hover:bg-cyber-primary/30 transition-colors"
                    >
                      <Eye className="w-3 h-3" />
                      <span>PREVIEW</span>
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`flex items-center space-x-1 px-2 py-1 text-xs rounded border transition-colors ${
                        attachment.isMalicious
                          ? 'bg-cyber-red/20 text-cyber-red border-cyber-red/30 hover:bg-cyber-red/30'
                          : 'bg-cyber-accent/20 text-cyber-accent border-cyber-accent/30 hover:bg-cyber-accent/30'
                      }`}
                    >
                      <Download className="w-3 h-3" />
                      <span>{attachment.isMalicious ? 'QUARANTINE' : 'DOWNLOAD'}</span>
                    </motion.button>
                  </div>
                </div>
              </div>
              
              {attachment.preview && (
                <div className="mt-3 p-2 bg-cyber-dark/50 rounded border border-cyber-primary/10">
                  <p className="text-cyber-primary/60 text-xs font-mono">
                    {attachment.preview}
                  </p>
                </div>
              )}
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}