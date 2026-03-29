import React, { useEffect, useRef } from 'react';
import { useVisit } from '@PostVisit/context/VisitContext';
import { ChatMessage } from './ChatMessage';

export const ChatHistory: React.FC = () => {
  const { chatMessages } = useVisit();
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  return (
    <div className="h-96 overflow-y-auto bg-gray-50 p-4 rounded-lg mb-4 border border-gray-200">
      {chatMessages.length === 0 ? (
        <div className="flex items-center justify-center h-full text-gray-500">
          <p>Start by asking a question about your visit...</p>
        </div>
      ) : (
        <>
          {chatMessages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          <div ref={endRef} />
        </>
      )}
    </div>
  );
};
