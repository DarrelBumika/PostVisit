import React from 'react';
import { useVisit } from '@PostVisit/context/VisitContext';
import { WizardLayout } from './WizardLayout';

interface StepMedicationProps {
  onNext: () => void;
  onBack: () => void;
}

export const StepMedication: React.FC<StepMedicationProps> = ({
  onNext,
  onBack,
}) => {
  const { visit } = useVisit();
  if (!visit) return <div>Loading...</div>;

  return (
    <WizardLayout stepNumber={2} totalSteps={4} onNext={onNext} onBack={onBack}>
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800">Medications & Treatment</h2>
        {visit.medications && visit.medications.length > 0 ? (
          <div className="space-y-4">
            {visit.medications.map((med, idx) => (
              <div
                key={idx}
                className="border-l-4 border-green-500 bg-green-50 p-4 rounded-lg"
              >
                <h3 className="text-lg font-semibold text-gray-800">{med.name}</h3>
                <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-gray-600 text-xs uppercase">Dosage</p>
                    <p className="font-semibold text-gray-800">{med.dosage}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-xs uppercase">Frequency</p>
                    <p className="font-semibold text-gray-800">{med.frequency}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-xs uppercase">Duration</p>
                    <p className="font-semibold text-gray-800">{med.duration}</p>
                  </div>
                  {med.instructions && (
                    <div>
                      <p className="text-gray-600 text-xs uppercase">Instructions</p>
                      <p className="font-semibold text-gray-800">
                        {med.instructions}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No medications prescribed.</p>
        )}
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
          <p className="text-sm text-blue-800">
            💡 <strong>Tip:</strong> Take medications exactly as prescribed. Don&apos;t
            skip doses or adjust without consulting your doctor.
          </p>
        </div>
      </div>
    </WizardLayout>
  );
};
