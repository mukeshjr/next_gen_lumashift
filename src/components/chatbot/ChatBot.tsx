'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  MessageCircle,
  X,
  Send,
  Loader,
  ChevronDown,
  Bot,
  User,
  Minimize2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const GUEST_QUESTIONS = [
  'Which service is right for me?',
  'What certifications should I get?',
  'How much do cybersecurity roles pay in Malaysia?',
  'I want to switch into cybersecurity',
];

const LOGGED_IN_QUESTIONS = [
  'What should I focus on next?',
  'Analyze my skill gaps',
  'Which certification should I pursue?',
  'Help me plan my career roadmap',
];

// Lightweight markdown renderer for chat messages
function renderChatMarkdown(text: string) {
  return text
    .split('\n')
    .map((line, i) => {
      // Headers
      if (line.startsWith('**') && line.endsWith('**'))
        return <p key={i} className="font-bold mt-2 mb-1">{line.slice(2, -2)}</p>;
      // Bold inline
      const parts = line.split(/\*\*(.*?)\*\*/g);
      const rendered = parts.map((p, j) =>
        j % 2 === 1 ? <strong key={j}>{p}</strong> : p
      );
      // Bullet
      if (line.startsWith('- '))
        return <li key={i} className="ml-3 flex gap-1.5"><span className="text-orange-400 shrink-0">•</span><span>{rendered.slice(1)}</span></li>;
      // Table rows
      if (line.startsWith('|'))
        return <code key={i} className="block text-xs bg-black/10 dark:bg-white/10 px-2 py-0.5 rounded my-0.5">{line}</code>;
      // Horizontal rule
      if (line === '---') return <hr key={i} className="border-gray-200 dark:border-gray-700 my-2" />;
      // Link pattern [text](/path)
      if (line.match(/\[.+\]\(.+\)/)) {
        const withLinks = line.replace(/\[(.+?)\]\((.+?)\)/g, (_, text, href) => `<a href="${href}">${text}</a>`);
        return (
          <p key={i} className="my-0.5" dangerouslySetInnerHTML={{ __html: withLinks
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
        );
      }
      if (!line.trim()) return <br key={i} />;
      return <p key={i} className="my-0.5">{rendered}</p>;
    });
}

export function ChatBot() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [minimised, setMinimised] = useState(false);

  const suggestedQuestions = user ? LOGGED_IN_QUESTIONS : GUEST_QUESTIONS;

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      role: 'assistant',
      content: user
        ? "Hi! I'm your LumaShift Career Advisor. I have access to your profile and can give you personalised guidance on your cybersecurity career.\n\nAsk me about your next steps, skill gaps, certifications, or anything career-related."
        : "Hi! I'm LumaShift's Career Advisor. I can help you find the right coaching service, understand cybersecurity career paths, or answer questions about certifications and salaries.\n\nWhat can I help you with today?",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (open) {
      scrollToBottom();
      setHasNewMessage(false);
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [open, messages, scrollToBottom]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;
    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: text };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      const contentType = res.headers.get('content-type') ?? '';
      const assistantId = (Date.now() + 1).toString();

      if (contentType.includes('text/plain')) {
        // Streaming response (Anthropic API mode)
        const assistantMsg: Message = { id: assistantId, role: 'assistant', content: '' };
        setMessages((prev) => [...prev, assistantMsg]);

        const reader = res.body?.getReader();
        const decoder = new TextDecoder();
        if (reader) {
          let done = false;
          while (!done) {
            const { value, done: d } = await reader.read();
            done = d;
            if (value) {
              const chunk = decoder.decode(value, { stream: true });
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantId ? { ...m, content: m.content + chunk } : m
                )
              );
            }
          }
        }
      } else {
        // JSON fallback (rule-based mode)
        const data = await res.json();
        setMessages((prev) => [
          ...prev,
          { id: assistantId, role: 'assistant', content: data.response },
        ]);
      }

      if (!open) setHasNewMessage(true);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content:
            'Sorry, something went wrong. Please email [lumashift@outlook.com](mailto:lumashift@outlook.com) directly.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => { setOpen(true); setMinimised(false); }}
        className={cn(
          'fixed bottom-6 right-6 z-50 w-14 h-14 bg-orange-500 hover:bg-orange-600',
          'rounded-full shadow-xl shadow-orange-500/30 flex items-center justify-center',
          'transition-all duration-300 hover:scale-110',
          open && !minimised && 'scale-0 opacity-0 pointer-events-none'
        )}
        aria-label="Open chat"
      >
        <MessageCircle size={24} className="text-white" />
        {hasNewMessage && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-pulse" />
        )}
      </button>

      {/* Chat window */}
      <div
        className={cn(
          'fixed bottom-6 right-6 z-50 w-[360px] max-w-[calc(100vw-2rem)]',
          'bg-card rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700',
          'flex flex-col transition-all duration-300 origin-bottom-right',
          open ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none',
          minimised ? 'h-14' : 'h-[520px]'
        )}
      >
        {/* Header */}
        <div className="flex items-center gap-3 p-4 bg-orange-500 rounded-t-2xl shrink-0">
          <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
            <Bot size={20} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-white">LumaShift Career Advisor</p>
            <p className="text-xs text-orange-100">{user ? 'Personalised career guidance' : 'Cybersecurity career guidance'}</p>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setMinimised((m) => !m)}
              className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/20 hover:bg-white/30 text-white transition-colors"
              aria-label="Minimise"
            >
              {minimised ? <ChevronDown size={15} /> : <Minimize2 size={15} />}
            </button>
            <button
              onClick={() => setOpen(false)}
              className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/20 hover:bg-white/30 text-white transition-colors"
              aria-label="Close"
            >
              <X size={15} />
            </button>
          </div>
        </div>

        {!minimised && (
          <>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    'flex gap-2 items-start',
                    msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                  )}
                >
                  {/* Avatar */}
                  <div
                    className={cn(
                      'w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5',
                      msg.role === 'user'
                        ? 'bg-orange-500'
                        : 'bg-gray-100 dark:bg-gray-800'
                    )}
                  >
                    {msg.role === 'user' ? (
                      <User size={13} className="text-white" />
                    ) : (
                      <Bot size={13} className="text-orange-500" />
                    )}
                  </div>

                  {/* Bubble */}
                  <div
                    className={cn(
                      'max-w-[85%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed',
                      msg.role === 'user'
                        ? 'bg-orange-500 text-white rounded-tr-sm'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-tl-sm'
                    )}
                  >
                    <div className="space-y-0.5">
                      {renderChatMarkdown(msg.content)}
                    </div>
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex gap-2 items-start">
                  <div className="w-7 h-7 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0">
                    <Bot size={13} className="text-orange-500" />
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl rounded-tl-sm px-4 py-3">
                    <div className="flex gap-1 items-center h-4">
                      {[0, 1, 2].map((i) => (
                        <div
                          key={i}
                          className="w-2 h-2 bg-orange-400 rounded-full animate-bounce"
                          style={{ animationDelay: `${i * 0.15}s` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggested questions (only when messages are short) */}
            {messages.length <= 1 && (
              <div className="px-4 pb-2">
                <p className="text-xs text-gray-400 mb-2">Quick questions:</p>
                <div className="flex flex-wrap gap-1.5">
                  {suggestedQuestions.map((q) => (
                    <button
                      key={q}
                      onClick={() => sendMessage(q)}
                      className="text-xs px-2.5 py-1.5 bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 rounded-lg border border-orange-200 dark:border-orange-500/20 hover:bg-orange-100 dark:hover:bg-orange-500/20 transition-colors font-medium"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <form
              onSubmit={handleSubmit}
              className="p-3 border-t border-gray-100 dark:border-gray-700 flex gap-2 shrink-0"
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about services, careers, certs..."
                className="form-input flex-1 py-2 text-sm"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="w-9 h-9 bg-orange-500 hover:bg-orange-600 disabled:opacity-40 rounded-xl flex items-center justify-center transition-all shrink-0"
              >
                {loading ? (
                  <Loader size={15} className="text-white animate-spin" />
                ) : (
                  <Send size={15} className="text-white" />
                )}
              </button>
            </form>

            <p className="text-center text-xs text-gray-400 pb-2">
              Or email{' '}
              <a href="mailto:lumashift@outlook.com" className="text-orange-500 hover:underline">
                lumashift@outlook.com
              </a>
            </p>
          </>
        )}
      </div>
    </>
  );
}
