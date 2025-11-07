"use client"

import { useState } from "react"
import { X, MessageCircle, Bot } from "lucide-react"
import { Button } from "./button"

interface LoanAssistantPopupProps {
  isOpen?: boolean
  onClose?: () => void
  onStartApplication?: () => void
  onLearnMore?: () => void
}

export function LoanAssistantPopup({ 
  isOpen = true, 
  onClose, 
  onStartApplication, 
  onLearnMore 
}: LoanAssistantPopupProps) {
  const [isVisible, setIsVisible] = useState(isOpen)

  const handleClose = () => {
    setIsVisible(false)
    onClose?.()
  }

  const handleStartApplication = () => {
    onStartApplication?.()
    handleClose()
  }

  const handleLearnMore = () => {
    onLearnMore?.()
    handleClose()
  }

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-md mx-4">
        {/* Header Bar with Logo */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-t-2xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <MessageCircle className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Tata Capital</h1>
              <p className="text-sm text-white/80">Personal Loans</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="text-white hover:bg-white/20 rounded-lg"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-b-2xl shadow-2xl overflow-hidden">
          {/* Background Image Section */}
          <div 
            className="h-32 bg-cover bg-center relative"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1551836026-d5c88ac5d4a1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80')"
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
          </div>

          {/* Chatbot Content */}
          <div className="p-6">
            <div className="flex items-start space-x-4 mb-6">
              {/* Chatbot Icon */}
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                <div className="relative">
                  {/* Robot Face */}
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                    {/* Eyes */}
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    </div>
                    {/* Smile */}
                    <div className="absolute bottom-1 w-4 h-1 bg-blue-600 rounded-full"></div>
                  </div>
                </div>
              </div>

              {/* Message Bubble */}
              <div className="flex-1">
                <div className="bg-gray-50 rounded-2xl rounded-tl-none p-4 shadow-sm">
                  <p className="text-gray-700 text-sm leading-relaxed">
                    Hello! I'm your digital loan assistant. Looking for a personal loan? I can help you find the best offer — it only takes a few minutes!
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                onClick={handleStartApplication}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Start My Loan Application
              </Button>
              
              <Button
                onClick={handleLearnMore}
                variant="outline"
                className="w-full border-gray-300 text-gray-700 hover:border-blue-600 hover:text-blue-600 py-3 px-6 rounded-xl font-medium transition-all duration-300"
              >
                Learn More About Personal Loans
              </Button>
            </div>

            {/* Footer Note */}
            <div className="mt-4 text-center">
              <p className="text-xs text-gray-500">
                Secure & Confidential • 24/7 Support
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
