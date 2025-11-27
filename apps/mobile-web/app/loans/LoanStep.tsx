import React from 'react';

interface StepIndicatorProps {
  title: string;
  totalSteps?: number;
  currentStep: number;
}

const StepIndicator = ({ 
  title, 
  totalSteps = 4, 
  currentStep 
}: StepIndicatorProps) => {
  
  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <nav className="step-wrap" aria-label="진행 단계">
      <div className="step-progress-bar">
        <span 
          className="bar" 
          style={{ width: `${progressPercentage}%` }} 
          role="progressbar"
          aria-valuenow={progressPercentage}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>

      <h2 className="step-tit">{title}</h2>

      <ol className="step-num">
        {Array.from({ length: totalSteps }, (_, index) => {
          const stepNum = index + 1;
          const isCompleted = stepNum < currentStep;
          const isActive = stepNum === currentStep;

          return (
            <li 
              key={stepNum}
              className={`${isCompleted ? 'ok' : ''} ${isActive ? 'selected' : ''}`.trim()}
              aria-current={isActive ? 'step' : undefined}
            >
              {isCompleted ? (
                <>
                  <span className="ky-hide">완료된 단계: </span>
                  {stepNum}
                </>
              ) : isActive ? (
                <>
                  <span className="ky-hide">현재 단계: </span>
                  {stepNum}
                </>
              ) : (
                <>
                  <span className="ky-hide">남은 단계: </span>
                  {stepNum}
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default StepIndicator;