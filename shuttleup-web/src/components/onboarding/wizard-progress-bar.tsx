"use client";

interface WizardProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export function WizardProgressBar({
  currentStep,
  totalSteps,
}: WizardProgressBarProps) {
  const progress = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className="w-full space-y-2">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span className="font-mono tracking-wide">
          {currentStep + 1} / {totalSteps}
        </span>
        <span className="font-mono tracking-wide">
          {Math.round(progress)}%
        </span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-muted/50 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-300 ease-out"
          style={{
            width: `${progress}%`,
            background:
              "linear-gradient(90deg, #F5C842 0%, #FF6B35 50%, #E8385A 100%)",
          }}
        />
      </div>
    </div>
  );
}
