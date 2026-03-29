import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useVisit } from '@PostVisit/context/VisitContext';
import { StepDiagnosis } from '@PostVisit/components/VisitWizard/StepDiagnosis';
import { StepMedication } from '@PostVisit/components/VisitWizard/StepMedication';
import { StepInstructions } from '@PostVisit/components/VisitWizard/StepInstructions';
import { StepChat } from '@PostVisit/components/VisitWizard/StepChat';

function VisitPageContent() {
  const router = useRouter();
  const { token } = router.query;
  const { visit, loading, error, currentStep, setCurrentStep, loadVisit } =
    useVisit();

  useEffect(() => {
    if (token && typeof token === 'string') {
      loadVisit(token);
    }
  }, [token, loadVisit]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">
            Loading your visit information...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg max-w-md">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Oops!</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  if (!visit) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Visit not found</p>
      </div>
    );
  }

  const handleNext = () => setCurrentStep(Math.min(currentStep + 1, 3));
  const handleBack = () => setCurrentStep(Math.max(currentStep - 1, 0));

  return (
    <>
      {currentStep === 0 && (
        <StepDiagnosis onNext={handleNext} onBack={handleBack} />
      )}
      {currentStep === 1 && (
        <StepMedication onNext={handleNext} onBack={handleBack} />
      )}
      {currentStep === 2 && (
        <StepInstructions onNext={handleNext} onBack={handleBack} />
      )}
      {currentStep === 3 && <StepChat onBack={handleBack} />}
    </>
  );
}

export default VisitPageContent;
