import React from 'react';
import { useVisit } from '@PostVisit/context/VisitContext';
import { ChatHistory } from '@PostVisit/components/ChatInterface/ChatHistory';
import { ChatInput } from '@PostVisit/components/ChatInterface/ChatInput';

interface StepChatProps {
  onBack: () => void;
}

export const StepChat: React.FC<StepChatProps> = ({ onBack }) => {
  const { visit } = useVisit();
  if (!visit) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Ask Questions</h1>
          <p className="text-gray-600 mt-2">Step 4 of 4</p>
        </div>
        <div className="mb-8 bg-gray-200 rounded-full h-2">
          <div className="bg-indigo-600 h-2 rounded-full w-full" />
        </div>
        <details className="mb-8 bg-white rounded-lg shadow-lg p-6">
          <summary className="cursor-pointer font-semibold text-gray-800 text-lg">
            📋 View Visit Summary
          </summary>
          <div className="mt-4 text-sm text-gray-600 space-y-2">
            <p>
              <strong>Diagnosis:</strong> {visit.diagnosis}
            </p>
            <p>
              <strong>Doctor:</strong> {visit.doctorName}
            </p>
            {visit.medications.length > 0 && (
              <p>
                <strong>Medications:</strong>{' '}
                {visit.medications.map((m) => m.name).join(', ')}
              </p>
            )}
          </div>
        </details>
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <ChatHistory />
          <ChatInput />
        </div>
        <div className="flex justify-start">
          <button
            onClick={onBack}
            className="px-6 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-colors"
          >
            ← Back
          </button>
        </div>
      </div>
    </div>
  );
};
