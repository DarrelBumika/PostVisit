import React from 'react';
import { useVisit } from '@PostVisit/context/VisitContext';
import { WizardLayout } from './WizardLayout';

interface StepDiagnosisProps {
  onNext: () => void;
  onBack: () => void;
}

export const StepDiagnosis: React.FC<StepDiagnosisProps> = ({
  onNext,
  onBack,
}) => {
  const { visit } = useVisit();
  if (!visit)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );

  return (
    <WizardLayout stepNumber={1} totalSteps={4} onNext={onNext} onBack={onBack}>
      <div className="space-y-6">
        <div className="bg-indigo-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Patient</p>
          <p className="text-xl font-semibold text-gray-800">{visit.patientName}</p>
          <p className="text-sm text-gray-500 mt-1">
            Visit Date:{' '}
            {new Date(visit.visitDate).toLocaleDateString('id-ID', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Diagnosis</h3>
          <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{visit.diagnosis}</p>
        </div>
        {visit.symptoms && visit.symptoms.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Symptoms</h3>
            <div className="flex flex-wrap gap-2">
              {visit.symptoms.map((symptom, idx) => (
                <span
                  key={idx}
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                >
                  {symptom}
                </span>
              ))}
            </div>
          </div>
        )}
        {visit.findings && (
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Clinical Findings
            </h3>
            <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">
              {visit.findings}
            </p>
          </div>
        )}
        <div className="text-sm text-gray-600">
          <p>
            Doctor: <span className="font-semibold">{visit.doctorName}</span>
          </p>
        </div>
      </div>
    </WizardLayout>
  );
};
