import { useState, useCallback } from 'react';
import { getAdvisorResponse } from '@/features/emissions/api';
import type { ChatMessage, AdvisorRequest } from '@/shared/types';

interface UseAdvisorReturn {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  sendMessage: (prompt: string) => Promise<void>;
  clearChat: () => void;
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function useAdvisor(): UseAdvisorReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(async (prompt: string) => {
    if (!prompt.trim()) return;

    const userMessage: ChatMessage = {
      id: generateId(),
      role: 'user',
      content: prompt.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      const request: AdvisorRequest = {
        prompt: userMessage.content,
        history: messages,
      };

      const response = await getAdvisorResponse(request);

      if (response.error) {
        setError(response.error);
      } else {
        const modelMessage: ChatMessage = {
          id: generateId(),
          role: 'model',
          content: response.content,
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, modelMessage]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get response');
    } finally {
      setIsLoading(false);
    }
  }, [messages]);

  const clearChat = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return { messages, isLoading, error, sendMessage, clearChat };
}
