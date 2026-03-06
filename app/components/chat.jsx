'use client'

import { useState, useRef, useEffect } from 'react'
import { cn } from '@/app/lib/utils'

const SUGGESTIONS = [
  "What's your tech stack?",
  'Tell me about your cloud experience.',
  'What are you working on lately?',
  'What got you into data science?',
]

const MAX_MESSAGES = 20

export default function Chat({ isOpen, onClose }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const [messageCount, setMessageCount] = useState(0)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  // Restore session
  useEffect(() => {
    const saved = sessionStorage.getItem('chat_messages')
    const savedCount = sessionStorage.getItem('chat_count')
    if (saved) setMessages(JSON.parse(saved))
    if (savedCount) setMessageCount(parseInt(savedCount))
  }, [])

  // Persist session
  useEffect(() => {
    if (messages.length > 0) {
      sessionStorage.setItem('chat_messages', JSON.stringify(messages))
      sessionStorage.setItem('chat_count', messageCount.toString())
    }
  }, [messages, messageCount])

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Focus input when opened
  useEffect(() => {
    if (isOpen) inputRef.current?.focus()
  }, [isOpen])

  async function sendMessage(content) {
    if (!content.trim() || isStreaming) return
    if (messageCount >= MAX_MESSAGES) return

    const userMessage = { role: 'user', content: content.trim() }
    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setInput('')
    setMessageCount((c) => c + 1)
    setIsStreaming(true)

    // Add placeholder for assistant response
    const assistantIndex = newMessages.length
    setMessages([...newMessages, { role: 'assistant', content: '' }])

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      })

      if (!response.ok) {
        const err = await response.json().catch(() => ({}))
        throw new Error(err.error || 'Request failed')
      }

      // Check if response is SSE stream or JSON (injection short-circuit returns JSON)
      const contentType = response.headers.get('content-type') || ''
      if (contentType.includes('application/json')) {
        const data = await response.json()
        setMessages((prev) => {
          const updated = [...prev]
          updated[assistantIndex] = { role: 'assistant', content: data.content }
          return updated
        })
        setIsStreaming(false)
        return
      }

      // Stream SSE response
      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          const data = line.replace(/^data: /, '')
          if (data === '[DONE]') break
          try {
            const parsed = JSON.parse(data)
            if (parsed.text) {
              setMessages((prev) => {
                const updated = [...prev]
                updated[assistantIndex] = {
                  role: 'assistant',
                  content: updated[assistantIndex].content + parsed.text,
                }
                return updated
              })
            }
          } catch {
            // skip malformed chunks
          }
        }
      }
    } catch (error) {
      setMessages((prev) => {
        const updated = [...prev]
        updated[assistantIndex] = {
          role: 'assistant',
          content: "Something broke. Try again in a sec.",
        }
        return updated
      })
    } finally {
      setIsStreaming(false)
    }
  }

  function handleSubmit(e) {
    e.preventDefault()
    sendMessage(input)
  }

  const limitReached = messageCount >= MAX_MESSAGES

  return (
    <div
      className={cn(
        'fixed bottom-20 right-4 z-40 w-[380px] max-h-[520px] flex flex-col',
        'glass-card glow-cyan rounded-2xl shadow-2xl',
        'transition-all duration-300 origin-bottom-right',
        'md:right-6 md:bottom-20',
        isOpen
          ? 'scale-100 opacity-100 pointer-events-auto'
          : 'scale-95 opacity-0 pointer-events-none',
        // Mobile: full screen
        'max-md:fixed max-md:inset-0 max-md:w-full max-md:max-h-full max-md:rounded-none max-md:bottom-0 max-md:right-0',
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border/30">
        <span className="text-sm font-semibold text-foreground">ask jake</span>
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground">
            {MAX_MESSAGES - messageCount} left
          </span>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Close chat"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
        {messages.length === 0 && !limitReached && (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground mb-3">
              ask me anything about my work, experience, or interests.
            </p>
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => sendMessage(s)}
                className="block w-full text-left text-xs px-3 py-2 rounded-lg
                  bg-secondary/50 hover:bg-secondary text-foreground
                  transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={cn(
              'text-sm leading-relaxed max-w-[85%]',
              msg.role === 'user'
                ? 'ml-auto bg-secondary/60 rounded-2xl rounded-br-sm px-3 py-2'
                : 'mr-auto text-foreground',
            )}
          >
            {msg.content}
            {msg.role === 'assistant' && msg.content === '' && isStreaming && (
              <span className="inline-block w-2 h-4 bg-neon-cyan animate-pulse ml-0.5" />
            )}
          </div>
        ))}

        {limitReached && (
          <p className="text-xs text-muted-foreground text-center py-2">
            that's a wrap for this session. come back anytime.
          </p>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      {!limitReached && (
        <form onSubmit={handleSubmit} className="p-3 border-t border-border/30">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="type something..."
              maxLength={500}
              disabled={isStreaming}
              className="flex-1 bg-secondary/30 rounded-lg px-3 py-2 text-sm
                text-foreground placeholder:text-muted-foreground
                border border-border/30 focus:border-neon-cyan/50
                focus:outline-none transition-colors disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isStreaming || !input.trim()}
              className="px-3 py-2 rounded-lg bg-neon-cyan/20 text-neon-cyan
                text-sm font-medium hover:bg-neon-cyan/30 transition-colors
                disabled:opacity-30 disabled:cursor-not-allowed"
            >
              send
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
