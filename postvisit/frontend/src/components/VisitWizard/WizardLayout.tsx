import React, { ReactNode } from 'react';

interface WizardLayoutProps {
  children: ReactNode;
  stepNumber: number;
  totalSteps: number;
  onNext?: () => void;
  onBack?: () => void;
  nextDisabled?: boolean;
}

export const WizardLayout: React.FC<WizardLayoutProps> = ({
  children,
  stepNumber,
  totalSteps,
  onNext,
  onBack,
  nextDisabled = false,
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Medical Visit Details</h1>
          <p className="text-gray-600 mt-2">
            Step {stepNumber} of {totalSteps}
          </p>
        </div>
        <div className="mb-8 bg-gray-200 rounded-full h-2">
          <div
            className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(stepNumber / totalSteps) * 100}%` }}
          />
        </div>
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">{children}</div>
        <div className="flex justify-between items-center">
          <button
            onClick={onBack}
            className="px-6 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-colors disabled:opacity-50"
            disabled={stepNumber === 1}
          >
            ← Back
          </button>
          <span className="text-sm text-gray-600">
            Step {stepNumber} of {totalSteps}
          </span>
          <button
            onClick={onNext}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
            disabled={nextDisabled}
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
};
