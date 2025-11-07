'use client';

import React, { useEffect, useRef, useState } from 'react';

type Message = {
  id?: number;
  username: string;
  content: string;
  timestamp?: string;
};

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    loadMessages();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function loadMessages() {
    try {
      const res = await fetch('/api/chat');
      const data = await res.json();
      const msgs: Message[] = Array.isArray(data?.messages) ? data.messages.reverse() : [];
      setMessages(msgs);
    } catch (err) {
      console.error('Failed to load messages', err);
    }
  }

  async function sendMessage(e?: React.FormEvent) {
    if (e) e.preventDefault();
    const text = input.trim();
    if (!text) return;

    const userMessage: Message = { username: 'user', content: text };
    setMessages((m) => [...m, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'user', content: text }),
      });

      const data = await res.json();
      if (data?.message) {
        const botMessage: Message = { username: 'bot', content: data.message };
        setMessages((m) => [...m, botMessage]);
      } else if (data?.messages) {
        const msgs: Message[] = Array.isArray(data.messages) ? data.messages : [];
        setMessages(msgs.reverse());
      }
    } catch (err) {
      console.error('Send message failed', err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="max-w-2xl mx-auto p-4 font-sans">
      <h1 className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl shadow">
        Tata Capital — Personal Loan Chatbot
      </h1>

      <section className="rounded-xl border border-gray-200 bg-white shadow p-4 mb-4 min-h-[320px]">
        <div className="max-h-[360px] overflow-y-auto px-1 py-2">
          {messages.length === 0 && (
            <p className="text-gray-400">No messages yet. Say hi 👋</p>
          )}
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex flex-col items-${m.username === 'user' ? 'end' : 'start'} mb-3`}
            >
              <div
                className={`px-4 py-2 rounded-2xl shadow 
                  ${m.username === 'user'
                    ? 'bg-blue-600 text-white ml-auto'
                    : 'bg-gray-100 text-gray-800 mr-auto'}
                  `}
                style={{ maxWidth: '80%' }}
              >
                <span className="block text-xs opacity-60 font-bold mb-1">{m.username === 'user' ? 'You' : 'Bot'}</span>
                <div className="whitespace-pre-line">{m.content}</div>
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
      </section>

      <form onSubmit={sendMessage} className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          disabled={loading}
          className="flex-1 px-4 py-3 rounded-xl border border-gray-200 shadow-sm bg-gray-50 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none text-base"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow hover:from-blue-700 hover:to-indigo-700 transition disabled:opacity-60"
        >
          {loading ? 'Sending...' : 'Send'}
        </button>
      </form>
    </main>
  );
}

