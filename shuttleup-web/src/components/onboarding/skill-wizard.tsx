"use client";

import { useState, useCallback } from "react";
import { useRouter } from "@/i18n/navigation";
import { toast } from "sonner";
import { Loader2, ArrowLeft, ArrowRight, SkipForward, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { getTierInfo } from "@/components/belo/belo-calc-engine";
import { WIZARD_QUESTIONS, calculateClientElo, BASE_ELO } from "./wizard-questions";
import { WizardProgressBar } from "./wizard-progress-bar";
import { WizardStep } from "./wizard-step";
import { EloPreviewCounter } from "./elo-preview-counter";

type WizardPhase = "questions" | "result";

export function SkillWizard() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [phase, setPhase] = useState<WizardPhase>("questions");
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [direction, setDirection] = useState<"forward" | "backward">("forward");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentElo = calculateClientElo(answers);
  const currentTier = getTierInfo(currentElo);
  const totalSteps = WIZARD_QUESTIONS.length;
  const currentQuestion = WIZARD_QUESTIONS[step];
  const canProceed = currentQuestion && answers[currentQuestion.id] !== undefined;
  const isLastQuestion = step === totalSteps - 1;
  const hasAnswers = Object.keys(answers).length > 0;

  const handleSelect = useCallback(
    (index: number) => {
      setAnswers((prev) => ({
        ...prev,
        [currentQuestion.id]: index,
      }));
    },
    [currentQuestion],
  );

  const handleNext = useCallback(() => {
    if (!canProceed) return;
    setDirection("forward");
    if (isLastQuestion) {
      setPhase("result");
    } else {
      setStep((s) => s + 1);
    }
  }, [canProceed, isLastQuestion]);

  const handleBack = useCallback(() => {
    setDirection("backward");
    if (phase === "result") {
      setPhase("questions");
    } else if (step > 0) {
      setStep((s) => s - 1);
    }
  }, [phase, step]);

  const handleSkip = useCallback(() => {
    router.push("/dashboard");
  }, [router]);

  const handleFinish = useCallback(async () => {
    if (!hasAnswers) {
      router.push("/dashboard");
      return;
    }

    setIsSubmitting(true);
    try {
      // Convert answers to index-based format for backend
      const payload = {
        answers: {
          experience: answers.experience ?? 0,
          frequency: answers.frequency ?? 0,
          tournament: answers.tournament ?? 0,
          gameStyle: answers.gameStyle ?? 0,
          technique: answers.technique ?? 0,
          training: answers.training ?? 0,
          selfRating: answers.selfRating ?? 0,
        },
      };

      await api.patch("/api/users/me/onboarding", payload);
      toast.success(`Welcome! Your starting BELo is ${currentElo}`);
      router.push("/dashboard");
      router.refresh();
    } catch {
      toast.error("Failed to save your assessment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }, [answers, currentElo, hasAnswers, router]);

  // ── Result Screen ──────────────────────────────────────────────────────

  if (phase === "result") {
    return (
      <div className="w-full max-w-md mx-auto space-y-8 px-4">
        <div className="text-center space-y-6 animate-slide-in-right">
          {/* Celebration */}
          <div className="text-6xl animate-bounce-slow">🎉</div>

          <div className="space-y-2">
            <p className="text-sm uppercase tracking-widest text-muted-foreground">
              Your Starting BELo
            </p>
            <p
              className="font-barlow-condensed text-6xl sm:text-7xl font-bold tabular-nums leading-none"
              style={{
                background:
                  "linear-gradient(90deg, #F5C842 0%, #FF6B35 50%, #E8385A 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {currentElo}
            </p>
          </div>

          {/* Tier Badge */}
          <div className="flex items-center justify-center gap-2">
            <span className="text-3xl">{currentTier.emoji}</span>
            <span
              className={`text-lg font-bold ${currentTier.color} px-3 py-1 rounded-lg`}
            >
              {currentTier.name}
            </span>
          </div>

          <p className="text-sm text-muted-foreground max-w-xs mx-auto">
            Based on your answers, you&apos;ll start in the{" "}
            <strong className="text-foreground">{currentTier.name}</strong> tier.
            Play 5 games to calibrate your true rating.
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            variant="ghost"
            onClick={handleBack}
            className="flex-shrink-0"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back
          </Button>
          <Button
            onClick={handleFinish}
            disabled={isSubmitting}
            className="flex-1 h-12 text-base font-semibold bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving…
              </>
            ) : (
              <>
                <Rocket className="w-4 h-4 mr-2" />
                Start Playing
              </>
            )}
          </Button>
        </div>
      </div>
    );
  }

  // ── Question Phase ─────────────────────────────────────────────────────

  return (
    <div className="w-full max-w-md mx-auto space-y-6 px-4">
      {/* Progress Bar */}
      <WizardProgressBar currentStep={step} totalSteps={totalSteps} />

      {/* Current Question */}
      <WizardStep
        question={currentQuestion}
        selectedIndex={answers[currentQuestion.id] ?? null}
        onSelect={handleSelect}
        direction={direction}
      />

      {/* Navigation */}
      <div className="flex items-center justify-between pt-2">
        {/* Back */}
        <Button
          variant="ghost"
          onClick={handleBack}
          disabled={step === 0}
          className="text-muted-foreground"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back
        </Button>

        <div className="flex items-center gap-2">
          {/* Skip */}
          <Button
            variant="ghost"
            onClick={handleSkip}
            className="text-muted-foreground text-xs"
          >
            Skip
            <SkipForward className="w-3 h-3 ml-1" />
          </Button>

          {/* Next / Review */}
          <Button
            onClick={handleNext}
            disabled={!canProceed}
            className="bg-primary hover:bg-primary/90 text-primary-foreground min-w-[100px]"
          >
            {isLastQuestion ? "See Results" : "Next"}
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>

      {/* ELO Preview */}
      {hasAnswers && <EloPreviewCounter elo={currentElo} />}
    </div>
  );
}
