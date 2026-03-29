import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Visit, ChatMessage } from '@PostVisit/types';
import ApiClient from '@PostVisit/lib/api';

interface VisitContextType {
  visit: Visit | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  chatMessages: ChatMessage[];
  currentStep: number;
  visitHistory: Visit[];
  loadVisit: (token: string) => Promise<void>;
  sendMessage: (message: string) => Promise<void>;
  setCurrentStep: (step: number) => void;
  resetError: () => void;
  isSendingMessage: boolean;
}

const VisitContext = createContext<VisitContextType | undefined>(undefined);

export const VisitProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [visit, setVisit] = useState<Visit | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [visitHistory, setVisitHistory] = useState<Visit[]>([]);
  const [isSendingMessage, setIsSendingMessage] = useState(false);

  const loadVisit = async (visitToken: string) => {
    setLoading(true);
    setError(null);
    try {
      const visitData = await ApiClient.fetchVisit(visitToken);
      setVisit(visitData);
      setToken(visitToken);
      setVisitHistory((prev) => {
        const exists = prev.some((v) => v.id === visitData.id);
        return exists ? prev : [visitData, ...prev];
      });
    } catch (err: any) {
      setError(err.message || 'Failed to load visit');
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (message: string) => {
    if (!visit || !token) {
      setError('Visit data not loaded');
      return;
    }
    setIsSendingMessage(true);
    setError(null);
    try {
      const userMessage: ChatMessage = {
        id: `user-${Date.now()}`,
        role: 'user',
        content: message,
        createdAt: new Date().toISOString(),
      };
      setChatMessages((prev) => [...prev, userMessage]);
      const response = await ApiClient.sendChatMessage(visit.id, token, message);
      const assistantMessage: ChatMessage = {
        id: response.messageId,
        role: 'assistant',
        content: response.content,
        createdAt: new Date().toISOString(),
      };
      setChatMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      setError(err.message || 'Failed to send message');
      setChatMessages((prev) => prev.slice(0, -1));
    } finally {
      setIsSendingMessage(false);
    }
  };

  const resetError = () => setError(null);

  return (
    <VisitContext.Provider
      value={{
        visit,
        token,
        loading,
        error,
        chatMessages,
        currentStep,
        visitHistory,
        loadVisit,
        sendMessage,
        setCurrentStep,
        resetError,
        isSendingMessage,
      }}
    >
      {children}
    </VisitContext.Provider>
  );
};

export const useVisit = () => {
  const context = useContext(VisitContext);
  if (context === undefined) {
    throw new Error('useVisit must be used within a VisitProvider');
  }
  return context;
};
