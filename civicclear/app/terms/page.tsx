import type { Metadata } from "next";
import { LegalSection, LegalShell } from "@/shared/layout/legal-shell";

export const metadata: Metadata = {
  title: "Terms of Service · CivicClear",
  description:
    "Terms for using CivicClear to report and resolve campus issues.",
};

export default function TermsPage() {
  return (
    <LegalShell title="Terms of Service" updated="22 August 2026">
      <LegalSection title="Agreement">
        <p>
          These Terms of Service (“Terms”) govern your use of CivicClear, a
          platform for reporting campus issues and helping coordinators verify
          and resolve them. By creating an account or using the service, you
          agree to these Terms and our Privacy Policy.
        </p>
      </LegalSection>

      <LegalSection title="The service">
        <p>
          CivicClear lets students file reports with descriptions, photos, and a
          campus location, and lets authorized coordinators triage, update
          status, view analytics, and export records. Reward points may be
          granted when a coordinator verifies a report, and a smaller bonus may
          apply when it is resolved. Points have no cash value unless a local
          program separately says otherwise.
        </p>
      </LegalSection>

      <LegalSection title="Accounts and roles">
        <ul>
          <li>
            Students may register for their own accounts and must provide
            accurate information.
          </li>
          <li>
            Coordinator and admin accounts are created by an admin; they are not
            self-registered in the student flow.
          </li>
          <li>
            You are responsible for keeping your login credentials confidential
            and for activity under your account.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="Acceptable use">
        <p>You agree not to:</p>
        <ul>
          <li>
            Submit false, duplicate, harassing, or malicious reports, or content
            unrelated to genuine campus issues.
          </li>
          <li>
            Upload unlawful, obscene, or irrelevant images, or photos of people
            without a legitimate campus purpose.
          </li>
          <li>
            Attempt to bypass rate limits, security controls, or role
            restrictions.
          </li>
          <li>
            Scrape, disrupt, or overload the service, or access another user’s
            data without authorization.
          </li>
          <li>
            Misrepresent your identity or your authority as a coordinator.
          </li>
        </ul>
        <p>
          Coordinators may reject invalid reports. Rejected reports do not earn
          points. We (or the operating team) may suspend accounts that abuse the
          system.
        </p>
      </LegalSection>

      <LegalSection title="Your content">
        <p>
          You retain ownership of content you submit. You grant the CivicClear
          operator a license to store, display, process, and export that content
          as needed to investigate and resolve reports and to run campus
          workflows (including analytics, CSV, and PDF files).
        </p>
      </LegalSection>

      <LegalSection title="No emergency service">
        <p>
          CivicClear is not a substitute for emergency services. If someone is
          in immediate danger or you need urgent help, contact local emergency
          numbers first. Response times for campus reports depend on staff
          capacity and are not guaranteed.
        </p>
      </LegalSection>

      <LegalSection title="Disclaimer">
        <p>
          The service is provided “as is.” To the fullest extent permitted by
          law, the operator disclaims warranties of merchantability, fitness for
          a particular purpose, and non-infringement. Campus resolution outcomes
          remain the responsibility of the operating team.
        </p>
      </LegalSection>

      <LegalSection title="Limitation of liability">
        <p>
          To the fullest extent permitted by law, the operator is not liable for
          indirect, incidental, special, consequential, or punitive damages, or
          for loss of data, points, or goodwill arising from use of the service.
        </p>
      </LegalSection>

      <LegalSection title="Changes">
        <p>
          We may update these Terms. Continued use after changes means you
          accept the revised Terms. Material changes will be reflected by the
          “Updated” date on this page.
        </p>
      </LegalSection>

      <LegalSection title="Contact">
        <p>
          Questions about these Terms should go to the team that operates your
          CivicClear instance.
        </p>
      </LegalSection>
    </LegalShell>
  );
}
