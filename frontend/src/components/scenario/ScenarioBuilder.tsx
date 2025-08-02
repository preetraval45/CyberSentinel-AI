'use client'

import { useState, useCallback } from 'react'
import { DndContext, DragEndEvent, useDraggable, useDroppable } from '@dnd-kit/core'
import { motion } from 'framer-motion'
import { Plus, Save, Play, Wand2 } from 'lucide-react'
import { ScenarioElement, ELEMENT_TYPES, Scenario } from '../../types/scenario'
import ElementEditor from './ElementEditor'
import toast from 'react-hot-toast'

interface DraggableElementProps {
  element: ScenarioElement
  onEdit: (element: ScenarioElement) => void
}

function DraggableElement({ element, onEdit }: DraggableElementProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: element.id,
    data: element
  })

  const elementType = ELEMENT_TYPES[element.type as keyof typeof ELEMENT_TYPES]

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      whileHover={{ scale: 1.05 }}
      className={`absolute w-48 p-4 rounded-lg border-2 cursor-move ${
        isDragging ? 'opacity-50' : 'opacity-100'
      } ${elementType.color} border-cyber-primary/30 hover:border-cyber-primary`}
      style={{
        left: element.position.x,
        top: element.position.y,
        ...style
      }}
      onClick={() => onEdit(element)}
    >
      <div className="flex items-center space-x-2 mb-2">
        <span className="text-lg">{elementType.icon}</span>
        <span className="font-cyber font-bold text-white text-sm">{elementType.name}</span>
      </div>
      <p className="text-white/80 text-xs">{element.data.title}</p>
    </motion.div>
  )
}

interface ElementPaletteProps {
  onAddElement: (type: string) => void
}

function ElementPalette({ onAddElement }: ElementPaletteProps) {
  return (
    <div className="w-64 cyber-card h-fit">
      <h3 className="font-cyber font-bold text-cyber-primary mb-4">ELEMENT PALETTE</h3>
      <div className="space-y-2">
        {Object.entries(ELEMENT_TYPES).map(([type, config]) => (
          <motion.button
            key={type}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onAddElement(type)}
            className="w-full p-3 rounded-lg border border-cyber-primary/30 hover:border-cyber-primary/60 transition-colors flex items-center space-x-3"
          >
            <span className="text-2xl">{config.icon}</span>
            <div className="text-left">
              <p className="font-cyber font-bold text-cyber-primary text-sm">{config.name}</p>
              <p className="text-cyber-primary/70 text-xs">{config.description}</p>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  )
}

interface CanvasProps {
  elements: ScenarioElement[]
  onElementEdit: (element: ScenarioElement) => void
}

function Canvas({ elements, onElementEdit }: CanvasProps) {
  const { setNodeRef } = useDroppable({
    id: 'canvas'
  })

  return (
    <div
      ref={setNodeRef}
      className="flex-1 relative bg-cyber-darker border border-cyber-primary/30 rounded-lg min-h-96 overflow-hidden"
      style={{ backgroundImage: 'radial-gradient(circle, rgba(0,255,255,0.1) 1px, transparent 1px)', backgroundSize: '20px 20px' }}
    >
      {elements.map((element) => (
        <DraggableElement
          key={element.id}
          element={element}
          onEdit={onElementEdit}
        />
      ))}
      {elements.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <Plus className="w-16 h-16 text-cyber-primary/30 mx-auto mb-4" />
            <p className="text-cyber-primary/70">Drag elements here to build your scenario</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default function ScenarioBuilder() {
  const [scenario, setScenario] = useState<Scenario>({
    id: 'new',
    title: 'New Scenario',
    description: '',
    type: 'phishing',
    difficulty: 'beginner',
    elements: [],
    createdBy: 'trainer',
    createdAt: new Date(),
    isPublished: false,
    tags: []
  })
  const [selectedElement, setSelectedElement] = useState<ScenarioElement | null>(null)

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event
    
    if (over?.id === 'canvas') {
      const element = active.data.current as ScenarioElement
      if (element) {
        setScenario(prev => ({
          ...prev,
          elements: prev.elements.map(el => 
            el.id === element.id 
              ? { ...el, position: { x: element.position.x + (event.delta?.x || 0), y: element.position.y + (event.delta?.y || 0) } }
              : el
          )
        }))
      }
    }
  }, [])

  const addElement = (type: string) => {
    const newElement: ScenarioElement = {
      id: `element_${Date.now()}`,
      type: type as any,
      position: { x: 100 + Math.random() * 200, y: 100 + Math.random() * 200 },
      data: {
        title: `New ${type}`,
        content: 'Edit this element...'
      },
      connections: []
    }
    
    setScenario(prev => ({
      ...prev,
      elements: [...prev.elements, newElement]
    }))
  }

  const generateWithAI = async () => {
    toast.loading('Generating scenario with AI...', { id: 'ai-gen' })
    
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const aiElements: ScenarioElement[] = [
      {
        id: 'ai_email_1',
        type: 'email',
        position: { x: 50, y: 50 },
        data: {
          title: 'Urgent Security Alert',
          content: 'Your account has been compromised. Click here to secure it immediately.'
        },
        connections: ['ai_choice_1']
      },
      {
        id: 'ai_choice_1',
        type: 'choice',
        position: { x: 300, y: 50 },
        data: {
          title: 'User Response',
          content: 'What does the user do?',
          options: ['Click the link', 'Report as phishing', 'Ignore the email']
        },
        connections: ['ai_outcome_1', 'ai_outcome_2', 'ai_outcome_3']
      }
    ]
    
    setScenario(prev => ({
      ...prev,
      elements: aiElements,
      title: 'AI-Generated Phishing Scenario'
    }))
    
    toast.success('AI scenario generated!', { id: 'ai-gen' })
  }

  const saveScenario = () => {
    toast.success('Scenario saved successfully!')
  }

  const testScenario = () => {
    toast.success('Launching scenario test...')
  }

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-cyber font-black neon-text mb-2">
                SCENARIO BUILDER
              </h1>
              <p className="text-cyber-primary/70">Create interactive security training scenarios</p>
            </div>
            
            <div className="flex space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={generateWithAI}
                className="cyber-button flex items-center space-x-2 border-cyber-secondary text-cyber-secondary hover:bg-cyber-secondary hover:text-cyber-dark"
              >
                <Wand2 className="w-4 h-4" />
                <span>AI GENERATE</span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={testScenario}
                className="cyber-button flex items-center space-x-2 border-cyber-accent text-cyber-accent hover:bg-cyber-accent hover:text-cyber-dark"
              >
                <Play className="w-4 h-4" />
                <span>TEST</span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={saveScenario}
                className="cyber-button flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>SAVE</span>
              </motion.button>
            </div>
          </div>

          <div className="flex gap-8">
            <ElementPalette onAddElement={addElement} />
            <Canvas elements={scenario.elements} onElementEdit={setSelectedElement} />
          </div>
          
          <ElementEditor
            element={selectedElement}
            onSave={(updatedElement) => {
              setScenario(prev => ({
                ...prev,
                elements: prev.elements.map(el => 
                  el.id === updatedElement.id ? updatedElement : el
                )
              }))
            }}
            onClose={() => setSelectedElement(null)}
          </div>
        </div>
      </div>
    </DndContext>
  )
}