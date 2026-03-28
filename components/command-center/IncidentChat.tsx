'use client'

import React, { useState, useEffect } from 'react'
import { RESQMAP_COLORS } from '@/lib/resqmap-design-tokens'
import { Send } from 'lucide-react'

interface Message {
  id: string
  senderId: string
  senderName: string
  senderRole: string
  text: string
  timestamp: string
}

interface IncidentChatProps {
  incidentId: string
  currentRole: string
}

export function IncidentChat({ incidentId, currentRole }: IncidentChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputText, setInputText] = useState('')

  // Load mock history or clear on incident change
  useEffect(() => {
    setMessages([
      {
        id: 'msg-1',
        senderId: 'sys',
        senderName: 'System',
        senderRole: 'Admin',
        text: `Chat initialized for incident ${incidentId}. Units dispatched.`,
        timestamp: new Date(Date.now() - 600000).toLocaleTimeString(),
      },
      {
        id: 'msg-2',
        senderId: 'dispatcher-1',
        senderName: 'Dispatcher A',
        senderRole: 'Command',
        text: 'Unit Alpha and Beta, please confirm arrival.',
        timestamp: new Date(Date.now() - 300000).toLocaleTimeString(),
      }
    ])
  }, [incidentId])

  const handleSend = () => {
    if (!inputText.trim()) return

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      senderId: 'currentUser',
      senderName: 'You',
      senderRole: currentRole || 'Commander',
      text: inputText.trim(),
      timestamp: new Date().toLocaleTimeString(),
    }

    setMessages([...messages, newMessage])
    setInputText('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSend()
    }
  }

  return (
    <div className="flex flex-col h-full border-t" style={{ borderColor: RESQMAP_COLORS.border }}>
      <div className="p-3 border-b" style={{ borderColor: RESQMAP_COLORS.border, backgroundColor: RESQMAP_COLORS.surface }}>
        <h4 className="text-sm font-semibold m-0" style={{ color: RESQMAP_COLORS.text }}>Live Incident Chat</h4>
      </div>
      
      <div className="flex-1 overflow-y-auto p-3 space-y-3" style={{ backgroundColor: RESQMAP_COLORS.background }}>
        {messages.map((msg) => (
          <div key={msg.id} className="text-xs">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-bold border px-1 rounded" style={{ borderColor: RESQMAP_COLORS.border, color: RESQMAP_COLORS.text }}>
                {msg.senderRole}
              </span>
              <span className="font-medium" style={{ color: RESQMAP_COLORS.textSecondary }}>{msg.senderName}</span>
              <span className="text-gray-500 ml-auto" style={{ fontSize: '10px' }}>{msg.timestamp}</span>
            </div>
            <p className="m-0 p-2 rounded" style={{ backgroundColor: RESQMAP_COLORS.surface, color: RESQMAP_COLORS.text }}>
              {msg.text}
            </p>
          </div>
        ))}
      </div>

      <div className="p-3 border-t flex gap-2" style={{ borderColor: RESQMAP_COLORS.border, backgroundColor: RESQMAP_COLORS.surface }}>
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type message..."
          className="flex-1 px-3 py-1 text-sm rounded border outline-none focus:ring-1"
          style={{ 
            backgroundColor: RESQMAP_COLORS.background, 
            borderColor: RESQMAP_COLORS.border,
            color: RESQMAP_COLORS.text 
          }}
        />
        <button
          onClick={handleSend}
          className="p-2 rounded flex items-center justify-center hover:opacity-80 transition"
          style={{ backgroundColor: RESQMAP_COLORS.accentBlue, color: RESQMAP_COLORS.text }}
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  )
}
