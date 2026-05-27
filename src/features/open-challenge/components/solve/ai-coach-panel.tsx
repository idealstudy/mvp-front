'use client';

import { useEffect, useRef, useState } from 'react';

import Link from 'next/link';

import { cn } from '@/shared/lib';
import { Bot, Send } from 'lucide-react';

import {
  MOCK_AI_COACH_MESSAGES,
  MOCK_AI_COACH_QUICK_REPLIES,
} from '../../mock/ai-coach';

type AiCoachMessageRole = 'ai' | 'user';

type AiCoachMessage = {
  id: string;
  role: AiCoachMessageRole;
  content: string;
  timestamp: string;
};

const MAX_COMMENT_LENGTH = 200;

type AiCoachPanelProps = {
  isLoggedIn: boolean;
};

export const AiCoachPanel = ({ isLoggedIn }: AiCoachPanelProps) => {
  const [messages, setMessages] = useState<AiCoachMessage[]>(
    MOCK_AI_COACH_MESSAGES as AiCoachMessage[]
  );
  const [inputMessage, setInputMessage] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    setMessages((previousMessages) => [
      ...previousMessages,
      {
        id: String(Date.now()),
        role: 'user',
        content: inputMessage.trim(),
        timestamp: new Date().toLocaleTimeString('ko-KR', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      },
    ]);
    setInputMessage('');
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputMessage(event.target.value.slice(0, MAX_COMMENT_LENGTH));
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') handleSendMessage();
  };

  const handleQuickReply = (replyText: string) => {
    setInputMessage(replyText);
  };

  if (!isLoggedIn) {
    return (
      <div className="border-line-line1 flex h-full flex-col items-center justify-center gap-4 rounded-xl border bg-white p-8 text-center">
        <div className="bg-gray-1 flex h-16 w-16 items-center justify-center rounded-full">
          <Bot
            size={32}
            className="text-gray-7"
          />
        </div>
        <div>
          <p className="font-body1-heading text-text-main">AI 코치</p>
          <p className="text-gray-8 mt-1 text-sm">
            로그인하면 AI 코치와 함께
            <br />
            문제를 풀 수 있어요.
          </p>
        </div>
        <Link
          href="/login"
          className="bg-orange-7 w-full rounded-lg py-3 text-center text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          로그인하기
        </Link>
      </div>
    );
  }

  return (
    <div className="border-line-line1 flex h-full flex-col rounded-xl border bg-white">
      <div className="border-line-line1 flex items-center gap-2 border-b px-4 py-3">
        <div className="h-2.5 w-2.5 rounded-full bg-blue-500" />
        <span className="font-body1-heading text-text-main">AI 코치</span>
      </div>

      <div
        ref={scrollAreaRef}
        className="flex flex-1 flex-col gap-4 overflow-y-auto p-4"
      >
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              'flex',
              message.role === 'user' ? 'justify-end' : 'items-start gap-2'
            )}
          >
            {message.role === 'ai' && (
              <div className="bg-gray-1 mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full">
                <Bot
                  size={16}
                  className="text-gray-7"
                />
              </div>
            )}
            <div
              className={cn(
                'flex max-w-[80%] flex-col gap-1',
                message.role === 'user' && 'items-end'
              )}
            >
              <div
                className={cn(
                  'rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-line',
                  message.role === 'ai'
                    ? 'bg-gray-1 text-text-main rounded-tl-none'
                    : 'bg-orange-7 rounded-tr-none text-white'
                )}
              >
                {message.content}
              </div>
              <span className="text-gray-6 text-xs">{message.timestamp}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2 px-4 pb-2">
        {MOCK_AI_COACH_QUICK_REPLIES.map((replyOption) => (
          <button
            key={replyOption}
            onClick={() => handleQuickReply(replyOption)}
            className="border-line-line2 hover:bg-gray-1 flex-1 cursor-pointer rounded-full border px-2 py-1.5 text-xs"
          >
            {replyOption}
          </button>
        ))}
      </div>

      <div className="border-line-line1 flex items-center gap-2 border-t px-4 py-3">
        <input
          value={inputMessage}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="메시지를 입력하세요..."
          className="placeholder:text-gray-6 flex-1 text-sm outline-none"
        />
        <button
          onClick={handleSendMessage}
          disabled={!inputMessage.trim()}
          className="bg-orange-7 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Send size={14} />
        </button>
      </div>
    </div>
  );
};
