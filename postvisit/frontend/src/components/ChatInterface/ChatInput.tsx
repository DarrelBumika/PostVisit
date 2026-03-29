import React, { useState } from 'react';
import { useVisit } from '@PostVisit/context/VisitContext';

export const ChatInput: React.FC = () => {
  const [input, setInput] = useState('');
  const { sendMessage, isSendingMessage, error } = useVisit();

  const handleSend = async () => {
    if (input.trim() === '') return;
    await sendMessage(input);
    setInput('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="space-y-2">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 p-3 rounded-lg text-sm">
          {error}
        </div>
      )}
      <div className="flex gap-2">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask me a question about your visit..."
          className="flex-1 p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-indigo-600"
          rows={2}
          disabled={isSendingMessage}
        />
        <button
          onClick={handleSend}
          disabled={isSendingMessage || input.trim() === ''}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isSendingMessage ? 'Sending...' : 'Send'}
        </button>
      </div>
    </div>
  );
};
