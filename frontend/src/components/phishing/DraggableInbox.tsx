'use client'

import { useState } from 'react'
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { motion } from 'framer-motion'
import { GripVertical, Paperclip, AlertTriangle } from 'lucide-react'
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'

interface Email {
  id: string
  subject: string
  sender: string
  urgencyScore: number
  hasAttachment: boolean
  attachmentType?: string
  preview: string
}

interface SortableEmailProps {
  email: Email
  onSelect: (email: Email) => void
  isSelected: boolean
}

function SortableEmail({ email, onSelect, isSelected }: SortableEmailProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: email.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const getUrgencyColor = (score: number) => {
    if (score >= 80) return '#ff0066'
    if (score >= 60) return '#ffff00'
    if (score >= 40) return '#ff00ff'
    return '#00ffff'
  }

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...attributes}
      whileHover={{ scale: isDragging ? 1 : 1.02 }}
      className={`cyber-card cursor-pointer transition-all duration-300 ${
        isSelected ? 'border-cyber-primary cyber-glow' : 'border-cyber-primary/30'
      } ${isDragging ? 'opacity-50' : ''}`}
      onClick={() => onSelect(email)}
    >
      <div className="flex items-center space-x-4">
        <div {...listeners} className="cursor-grab active:cursor-grabbing">
          <GripVertical className="w-4 h-4 text-cyber-primary/50" />
        </div>
        
        <div className="w-12 h-12">
          <CircularProgressbar
            value={email.urgencyScore}
            text={`${email.urgencyScore}`}
            styles={buildStyles({
              textSize: '24px',
              pathColor: getUrgencyColor(email.urgencyScore),
              textColor: getUrgencyColor(email.urgencyScore),
              trailColor: 'rgba(255,255,255,0.1)',
            })}
          />
        </div>
        
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <h3 className="font-cyber font-bold text-cyber-primary text-sm">{email.subject}</h3>
            {email.hasAttachment && (
              <Paperclip className="w-4 h-4 text-cyber-accent" />
            )}
            {email.urgencyScore >= 80 && (
              <AlertTriangle className="w-4 h-4 text-cyber-red animate-pulse" />
            )}
          </div>
          <p className="text-cyber-primary/70 text-xs font-mono mb-1">{email.sender}</p>
          <p className="text-cyber-primary/50 text-xs">{email.preview}</p>
        </div>
        
        <div className="text-right">
          <div className="text-xs font-cyber font-bold text-cyber-accent mb-1">
            URGENCY: {email.urgencyScore}%
          </div>
          {email.hasAttachment && (
            <div className="text-xs text-cyber-primary/70">
              {email.attachmentType}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

interface DraggableInboxProps {
  emails: Email[]
  onEmailSelect: (email: Email) => void
  selectedEmail: Email | null
}

export default function DraggableInbox({ emails: initialEmails, onEmailSelect, selectedEmail }: DraggableInboxProps) {
  const [emails, setEmails] = useState(initialEmails)
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  function handleDragEnd(event: any) {
    const { active, over } = event

    if (active.id !== over.id) {
      setEmails((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id)
        const newIndex = items.findIndex(item => item.id === over.id)
        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-cyber font-bold neon-text">PHISHING INBOX</h2>
        <div className="text-cyber-primary/70 font-mono text-sm">
          {emails.length} EMAILS • DRAG TO REORDER
        </div>
      </div>
      
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={emails.map(e => e.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {emails.map((email) => (
              <SortableEmail
                key={email.id}
                email={email}
                onSelect={onEmailSelect}
                isSelected={selectedEmail?.id === email.id}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  )
}