import React from 'react';
import { useVisit } from '@PostVisit/context/VisitContext';
import { WizardLayout } from './WizardLayout';

interface StepInstructionsProps {
  onNext: () => void;
  onBack: () => void;
}

export const StepInstructions: React.FC<StepInstructionsProps> = ({
  onNext,
  onBack,
}) => {
  const { visit } = useVisit();
  if (!visit) return <div>Loading...</div>;

  return (
    <WizardLayout stepNumber={3} totalSteps={4} onNext={onNext} onBack={onBack}>
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800">Care Instructions</h2>
        {visit.instructions && (
          <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              What You Should Do
            </h3>
            <p className="text-gray-700 whitespace-pre-wrap">
              {visit.instructions}
            </p>
          </div>
        )}
        {visit.followUpDate && (
          <div className="bg-purple-50 border border-purple-200 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-800 mb-2">
              📅 Follow-up Appointment
            </h3>
            <p className="text-gray-700">
              Please schedule a follow-up visit on{' '}
              <strong>
                {new Date(visit.followUpDate).toLocaleDateString('id-ID', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </strong>
            </p>
          </div>
        )}
        {visit.notes && (
          <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-800 mb-2">📝 Doctor&apos;s Notes</h3>
            <p className="text-gray-700">{visit.notes}</p>
          </div>
        )}
        <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
          <p className="text-sm text-red-800">
            ⚠️ <strong>Important:</strong> If you experience severe symptoms or
            allergic reactions, seek immediate medical attention.
          </p>
        </div>
      </div>
    </WizardLayout>
  );
};
