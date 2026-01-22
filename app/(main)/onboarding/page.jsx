import { redirect } from "next/navigation";
import { industries } from "@/data/industries";
import OnboardingForm from "./_components/onboarding-form";
import { getUserOnboardingStatus } from "@/actions/user";

export default async function OnboardingPage() {
  try {
    // Check if user is already onboarded
    const { isOnboarded } = await getUserOnboardingStatus();

    if (isOnboarded) {
      redirect("/dashboard");
    }

    return (
      <main>
        <OnboardingForm industries={industries} />
      </main>
    );
  } catch (error) {
    // If there's an error checking status, still show onboarding form
    console.error("Error checking onboarding status:", error);
    return (
      <main>
        <OnboardingForm industries={industries} />
      </main>
    );
  }
}
