"use client";

import { useLocale } from "next-intl";
import type { WizardQuestion } from "./wizard-questions";

interface WizardStepProps {
  question: WizardQuestion;
  selectedIndex: number | null;
  onSelect: (index: number) => void;
  direction: "forward" | "backward";
}

export function WizardStep({
  question,
  selectedIndex,
  onSelect,
  direction,
}: WizardStepProps) {
  const locale = useLocale();
  const isVi = locale === "vi";

  return (
    <div
      key={question.id}
      className={`space-y-6 ${
        direction === "forward"
          ? "animate-slide-in-right"
          : "animate-slide-in-left"
      }`}
    >
      {/* Icon + Title */}
      <div className="text-center space-y-3">
        <span className="text-5xl block">{question.icon}</span>
        <h2 className="font-barlow-condensed text-2xl sm:text-3xl font-bold text-foreground leading-tight">
          {isVi ? question.titleVi : question.title}
        </h2>
        <p className="text-sm text-muted-foreground max-w-sm mx-auto">
          {isVi ? question.subtitleVi : question.subtitle}
        </p>
      </div>

      {/* Options */}
      <div className="space-y-3" role="radiogroup" aria-label={question.title}>
        {question.options.map((option, idx) => {
          const isSelected = selectedIndex === idx;

          return (
            <button
              key={idx}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => onSelect(idx)}
              className={`
                w-full text-left rounded-xl px-4 py-3.5 sm:py-4
                border-2 transition-all duration-150
                cursor-pointer select-none
                min-h-[52px] flex items-center gap-3
                ${
                  isSelected
                    ? "border-primary bg-primary/10 text-foreground shadow-sm shadow-primary/10"
                    : "border-border/50 bg-card/50 text-muted-foreground hover:border-border hover:bg-card"
                }
              `}
            >
              {/* Radio indicator */}
              <span
                className={`
                  flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center
                  transition-colors duration-150
                  ${
                    isSelected
                      ? "border-primary bg-primary"
                      : "border-muted-foreground/30"
                  }
                `}
              >
                {isSelected && (
                  <span className="w-2 h-2 rounded-full bg-primary-foreground" />
                )}
              </span>

              {/* Label */}
              <span className={`text-sm sm:text-base font-medium ${isSelected ? "text-foreground" : ""}`}>
                {isVi ? option.labelVi : option.label}
              </span>

              {/* Weight badge — subtle indicator */}
              {isSelected && option.weight > 0 && (
                <span className="ml-auto text-xs font-mono text-primary/70">
                  +{option.weight}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
