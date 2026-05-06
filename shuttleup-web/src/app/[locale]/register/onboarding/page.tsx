"use client";

import { useSession } from "@/lib/auth-client";
import { useRouter } from "@/i18n/navigation";
import { SkillWizard } from "@/components/onboarding/skill-wizard";
import { Loader2 } from "lucide-react";

export default function OnboardingPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  // Loading state
  if (isPending) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Redirect if not logged in
  if (!session?.user) {
    router.push("/register");
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12">
      <SkillWizard />
    </div>
  );
}
