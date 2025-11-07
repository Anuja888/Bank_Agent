"use client"

import { useState, FormEvent } from "react"
import { Send, Bot, Paperclip, Mic, CornerDownLeft, MessageCircle } from "lucide-react"
import { Button } from "../../components/ui/button"
import {
  ChatBubble,
  ChatBubbleAvatar,
  ChatBubbleMessage,
} from "../../components/ui/chat-bubble"
import { ChatInput } from "../../components/ui/chat-input"
import {
  ExpandableChat,
  ExpandableChatHeader,
  ExpandableChatBody,
  ExpandableChatFooter,
} from "../../components/ui/expandable-chat"
import { ChatMessageList } from "../../components/ui/chat-message-list"

type Message = {
  id?: number;
  username: string;
  content: string;
  timestamp?: string;
};

export default function Home() {
  const [showChat, setShowChat] = useState(false)
  const [messages, setMessages] = useState([
    {
      id: 1,
      content: "Hello! I'm your Tata Capital personal loan specialist. May I have your good name to begin our discussion?",
      username: "bot",
    }
  ])

  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const startChat = () => {
    setShowChat(true)
    // The chat will automatically open when showChat is true
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    // Add user message
    const userMessage = { id: messages.length + 1, username: "user", content: input };
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      // Send message to API
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          username: 'user', 
          content: input,
          sessionId: 'user-session'
        }),
      })

      const data = await res.json()
      if (data?.message) {
        const botMessage = { id: messages.length + 2, username: "bot", content: data.message };
        setMessages((prev) => [...prev, botMessage])
      }
    } catch (err) {
      console.error('Send message failed', err)
      // Fallback response
      const botMessage = { id: messages.length + 2, username: "bot", content: "I apologize, but I encountered an issue processing your request. Please try again." };
      setMessages((prev) => [...prev, botMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleAttachFile = () => {
    // File attachment functionality
    console.log("Attach file clicked")
  }

  const handleMicrophoneClick = () => {
    // Voice input functionality
    console.log("Microphone clicked")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Landing Page */}
      {!showChat && (
        <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center">
          <div className="max-w-2xl mx-auto">
            <div className="mb-8">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                <MessageCircle className="h-10 w-10 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Tata Capital Personal Loans
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Get instant assistance for your personal loan needs
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <h3 className="font-semibold text-lg mb-2">Competitive Rates</h3>
                <p className="text-gray-600">Interest rates starting from 10.99% p.a.</p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-lg mb-2">Quick Approval</h3>
                <p className="text-gray-600">Fast processing with minimal documentation</p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-lg mb-2">Expert Support</h3>
                <p className="text-gray-600">Professional loan specialists to guide you</p>
              </div>
            </div>

            <Button 
              onClick={startChat}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Start Chat with Loan Specialist
            </Button>

            <div className="mt-8 text-sm text-gray-500">
              <p>Get personalized assistance for loan amounts from ₹75,000 to ₹35 lakhs</p>
            </div>
          </div>
        </div>
      )}

      {/* Chat Interface */}
      {showChat && (
        <div className="h-screen relative">
          <ExpandableChat
            size="lg"
            position="bottom-right"
            icon={<Bot className="h-6 w-6" />}
            open={true}
            onOpenChange={(open) => {
              if (!open) {
                // If chat is closed, you can choose to hide it completely or keep it visible
                // For now, we'll keep it visible but closed
              }
            }}
          >
            <ExpandableChatHeader className="flex-col text-center justify-center">
              <h1 className="text-xl font-semibold">Tata Capital Personal Loans</h1>
              <p className="text-sm text-muted-foreground">
                Your trusted loan specialist is here to help
              </p>
            </ExpandableChatHeader>

            <ExpandableChatBody>
              <ChatMessageList>
                {messages.map((message) => (
                  <ChatBubble
                    key={message.id}
                    variant={message.username === "user" ? "sent" : "received"}
                  >
                    <ChatBubbleAvatar
                      className="h-8 w-8 shrink-0"
                      src={
                        message.username === "user"
                          ? "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&h=64&q=80&crop=faces&fit=crop"
                          : "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&q=80&crop=faces&fit=crop"
                      }
                      fallback={message.username === "user" ? "US" : "AI"}
                    />
                    <ChatBubbleMessage
                      variant={message.username === "user" ? "sent" : "received"}
                    >
                      {message.content}
                    </ChatBubbleMessage>
                  </ChatBubble>
                ))}

                {isLoading && (
                  <ChatBubble variant="received">
                    <ChatBubbleAvatar
                      className="h-8 w-8 shrink-0"
                      src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&q=80&crop=faces&fit=crop"
                      fallback="AI"
                    />
                    <ChatBubbleMessage isLoading />
                  </ChatBubble>
                )}
              </ChatMessageList>
            </ExpandableChatBody>

            <ExpandableChatFooter>
              <form
                onSubmit={handleSubmit}
                className="relative rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring p-1"
              >
                <ChatInput
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message..."
                  className="min-h-12 resize-none rounded-lg bg-background border-0 p-3 shadow-none focus-visible:ring-0"
                />
                <div className="flex items-center p-3 pt-0 justify-between">
                  <div className="flex">
                    <Button
                      variant="ghost"
                      size="icon"
                      type="button"
                      onClick={handleAttachFile}
                    >
                      <Paperclip className="size-4" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      type="button"
                      onClick={handleMicrophoneClick}
                    >
                      <Mic className="size-4" />
                    </Button>
                  </div>
                  <Button type="submit" size="sm" className="ml-auto gap-1.5">
                    Send Message
                    <CornerDownLeft className="size-3.5" />
                  </Button>
                </div>
              </form>
            </ExpandableChatFooter>
          </ExpandableChat>
        </div>
      )}
    </div>
  )
}
