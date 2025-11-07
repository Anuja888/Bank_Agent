"use client"

import { useState, FormEvent, useEffect } from "react"
import { Send, Bot, Paperclip, Mic, CornerDownLeft, MessageCircle, Shield, Clock, Users, Star, ChevronRight, X } from "lucide-react"
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
import { LoanAssistantPopup } from "../../components/ui/loan-assistant-popup"

type Message = {
  id?: number;
  username: string;
  content: string;
  timestamp?: string;
};

export default function Home() {
  const [showChat, setShowChat] = useState(false)
  const [showLoanAssistant, setShowLoanAssistant] = useState(true)
  const [messages, setMessages] = useState([
    {
      id: 1,
      content: "Hello! I'm your Tata Capital personal loan specialist. May I have your good name to begin our discussion?",
      username: "bot",
    }
  ])

  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [sessionId, setSessionId] = useState<string>('')

  // Generate unique session ID when component mounts
  useEffect(() => {
    // Generate a unique session ID for this user
    const newSessionId = 'session_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
    setSessionId(newSessionId);
  }, []);

  const startChat = () => {
    setShowChat(true)
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
          sessionId: sessionId || 'user-session'
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Navigation Bar */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <MessageCircle className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Tata Capital</h1>
                <p className="text-sm text-gray-600">Personal Loans</p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors">Home</a>
              <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors">Loan Calculator</a>
              <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors">FAQ</a>
              <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors">Contact</a>
            </div>
            <Button 
              onClick={startChat}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* Landing Page */}
      {!showChat && (
        <div className="relative overflow-hidden">
          {/* Hero Section */}
          <section className="relative py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                {/* Left Content */}
                <div className="space-y-8">
                  <div className="space-y-4">
                    <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium">
                      <Star className="w-4 h-4 mr-2" />
                      Trusted by 2M+ Customers
                    </div>
                    <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                      Personal Loans
                      <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                        Made Simple
                      </span>
                    </h1>
                    <p className="text-xl text-gray-600 max-w-lg">
                      Get instant approval for loans up to ₹35 lakhs with competitive rates starting from 10.99% p.a.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button 
                      onClick={startChat}
                      size="lg"
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                    >
                      <MessageCircle className="w-5 h-5 mr-2" />
                      Start Instant Chat
                    </Button>
                    <Button 
                      variant="outline"
                      size="lg"
                      className="px-8 py-4 text-lg font-semibold rounded-xl border-2 border-gray-300 hover:border-blue-600 hover:text-blue-600 transition-all duration-300"
                    >
                      Calculate EMI
                    </Button>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-8 pt-8">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">₹35L</div>
                      <div className="text-sm text-gray-600">Max Loan Amount</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">10.99%</div>
                      <div className="text-sm text-gray-600">Interest Rate</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">24H</div>
                      <div className="text-sm text-gray-600">Quick Approval</div>
                    </div>
                  </div>
                </div>

                {/* Right Content - Feature Cards */}
                <div className="space-y-6">
                  <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Shield className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Secure & Trusted</h3>
                        <p className="text-gray-600">Your data is protected with bank-level security and encryption.</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Clock className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Quick Processing</h3>
                        <p className="text-gray-600">Get loan approval within 24 hours with minimal documentation.</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Users className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Expert Support</h3>
                        <p className="text-gray-600">Dedicated loan specialists available 24/7 to assist you.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="py-16 bg-white/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Tata Capital?</h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Experience the difference with our customer-first approach and innovative loan solutions.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center group">
                  <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">Competitive Rates</h3>
                  <p className="text-gray-600 text-lg">Interest rates starting from 10.99% p.a. with flexible repayment options.</p>
                </div>

                <div className="text-center group">
                  <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">Quick Approval</h3>
                  <p className="text-gray-600 text-lg">Fast processing with minimal documentation and instant eligibility checks.</p>
                </div>

                <div className="text-center group">
                  <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">Expert Support</h3>
                  <p className="text-gray-600 text-lg">Professional loan specialists available round the clock to guide you.</p>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
            <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
              <h2 className="text-4xl font-bold mb-6">Ready to Get Your Personal Loan?</h2>
              <p className="text-xl mb-8 opacity-90">
                Join millions of satisfied customers who have trusted Tata Capital for their financial needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={startChat}
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Start Chat Now
                </Button>
                <Button 
                  variant="outline"
                  size="lg"
                  className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg font-semibold rounded-xl border-2 transition-all duration-300"
                >
                  Learn More
                </Button>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* Enhanced Chat Interface */}
      {showChat && (
        <div className="h-screen bg-gradient-to-br from-slate-50 to-blue-50">
          <div className="max-w-4xl mx-auto h-full flex flex-col">
            {/* Chat Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                    <Bot className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-gray-900">Tata Capital Loan Specialist</h1>
                    <div className="text-sm text-green-600 flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      Online now
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowChat(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <ChatMessageList>
                {messages.map((message) => (
                  <ChatBubble
                    key={message.id}
                    variant={message.username === "user" ? "sent" : "received"}
                  >
                    <ChatBubbleAvatar
                      className="h-10 w-10 shrink-0"
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
                      className="h-10 w-10 shrink-0"
                      src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&q=80&crop=faces&fit=crop"
                      fallback="AI"
                    />
                    <ChatBubbleMessage isLoading />
                  </ChatBubble>
                )}
              </ChatMessageList>
            </div>

            {/* Chat Input */}
            <div className="bg-white border-t border-gray-200 p-6">
              <form
                onSubmit={handleSubmit}
                className="relative rounded-xl border border-gray-300 bg-white focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 p-2"
              >
                <ChatInput
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message here..."
                  className="min-h-12 resize-none rounded-lg bg-white border-0 p-4 shadow-none focus-visible:ring-0 text-lg"
                />
                <div className="flex items-center p-3 pt-0 justify-between">
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      type="button"
                      onClick={handleAttachFile}
                      className="text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                    >
                      <Paperclip className="size-5" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      type="button"
                      onClick={handleMicrophoneClick}
                      className="text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                    >
                      <Mic className="size-5" />
                    </Button>
                  </div>
                  <Button 
                    type="submit" 
                    size="sm" 
                    className="ml-auto gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-lg font-medium"
                    disabled={!input.trim() || isLoading}
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        Send
                        <Send className="size-4" />
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Loan Assistant Popup */}
      {showLoanAssistant && !showChat && (
        <LoanAssistantPopup
          isOpen={showLoanAssistant}
          onClose={() => setShowLoanAssistant(false)}
          onStartApplication={() => {
            setShowLoanAssistant(false)
            setShowChat(true)
          }}
          onLearnMore={() => {
            setShowLoanAssistant(false)
            // You can add navigation to learn more page here
            console.log("Learn more about personal loans")
          }}
        />
      )}
    </div>
  )
}
