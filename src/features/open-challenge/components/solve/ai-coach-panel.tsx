'use client';

import { useEffect, useRef, useState } from 'react';

import Link from 'next/link';

import { cn } from '@/shared/lib';

type MessageRole = 'ai' | 'user';

type Message = {
  id: string;
  role: MessageRole;
  badge?: string;
  content: string;
  timestamp: string;
};

const MOCK_MESSAGES: Message[] = [
  {
    id: '1',
    role: 'ai',
    badge: '많이 헷갈리는 부분이에요',
    content:
      "분수의 나눗셈에서 '나누는 수의 역수를 곱한다'는 원리를 기억하고 있나요?\n이 문제도 이 원리를 적용하면 풀 수 있어요.",
    timestamp: '오후 2:30',
  },
  {
    id: '2',
    role: 'user',
    content: '네! 그런데 계산 과정이 헷갈려요.',
    timestamp: '오후 2:31',
  },
  {
    id: '3',
    role: 'ai',
    badge: '잘 찾았어요',
    content:
      '좋아요! 그럼 숫자를 대입해서\n차근차근 계산해볼까요?\n어떤 수를 곱해야 할지 먼저 생각해봐요.',
    timestamp: '오후 2:31',
  },
  {
    id: '4',
    role: 'user',
    content: '나누는 수의 역수니까...\n3/5의 역수는 5/3이요!',
    timestamp: '오후 2:32',
  },
  {
    id: '5',
    role: 'ai',
    badge: '정답에 가까워요!',
    content:
      '맞아요! 이제 처음 식에 5/3을 곱해서\n계산해보면 답을 구할 수 있어요.\n한 번 직접 풀어볼래요? 😊',
    timestamp: '오후 2:32',
  },
];

const QUICK_REPLY_OPTIONS = ['잘 모르겠어요', '더 쉽게요', '다음 힌트'];

const MAX_COMMENT_LENGTH = 200;

type AiCoachPanelProps = {
  isLoggedIn: boolean;
};

export const AiCoachPanel = ({ isLoggedIn }: AiCoachPanelProps) => {
  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES);
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
        <div className="bg-gray-1 flex h-16 w-16 items-center justify-center rounded-full text-3xl">
          🤖
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
      {/* 헤더 */}
      <div className="border-line-line1 flex items-center gap-2 border-b px-4 py-3">
        <div className="h-2.5 w-2.5 rounded-full bg-blue-500" />
        <span className="font-body1-heading text-text-main">AI 코치</span>
      </div>

      {/* 메시지 목록 */}
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
              <div className="bg-gray-1 mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm">
                🤖
              </div>
            )}
            <div
              className={cn(
                'flex max-w-[80%] flex-col gap-1',
                message.role === 'user' && 'items-end'
              )}
            >
              {message.badge && (
                <span className="bg-orange-7 w-fit rounded-full px-3 py-0.5 text-xs text-white">
                  {message.badge}
                </span>
              )}
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

      {/* 빠른 답장 */}
      <div className="flex gap-2 px-4 pb-2">
        {QUICK_REPLY_OPTIONS.map((replyOption) => (
          <button
            key={replyOption}
            onClick={() => handleQuickReply(replyOption)}
            className="border-line-line2 hover:bg-gray-1 flex-1 rounded-full border px-2 py-1.5 text-xs"
          >
            {replyOption}
          </button>
        ))}
      </div>

      {/* 입력창 */}
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
          className="bg-orange-7 flex h-8 w-8 items-center justify-center rounded-full text-white disabled:opacity-40"
        >
          ›
        </button>
      </div>
    </div>
  );
};
