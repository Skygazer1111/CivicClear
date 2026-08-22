import { auth } from "@/features/auth/auth";
import { LandingExperience } from "@/features/marketing/components/landing-experience";
import { PublicBrandHeader } from "@/shared/layout/brand";
import { SiteFooter } from "@/shared/layout/site-footer";
import { Button } from "@/shared/ui/button";
import Link from "next/link";

export default async function HomePage() {
  const session = await auth();
  const signedIn = Boolean(session?.user);
  const signedInHome =
    session?.user?.role === "citizen"
      ? "/dashboard"
      : session?.user?.role === "admin"
        ? "/admin"
        : "/queue";

  return (
    <div className="relative flex min-h-dvh flex-col overflow-x-hidden bg-canvas">
      <PublicBrandHeader
        trailing={
          signedIn ? (
            <Button asChild variant="outline" size="sm">
              <Link href={signedInHome}>Dashboard</Link>
            </Button>
          ) : null
        }
      />

      <main className="relative flex-1">
        <LandingExperience
          signedIn={signedIn}
          signedInHome={signedInHome}
        />
      </main>

      <SiteFooter />
    </div>
  );
}
