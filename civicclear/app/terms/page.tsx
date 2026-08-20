import type { Metadata } from "next";
import { LegalSection, LegalShell } from "@/shared/layout/legal-shell";

export const metadata: Metadata = {
  title: "Terms of Service · CivicClear",
  description:
    "Terms for using CivicClear to report and resolve civic issues.",
};

export default function TermsPage() {
  return (
    <LegalShell title="Terms of Service" updated="21 August 2026">
      <LegalSection title="Agreement">
        <p>
          These Terms of Service (“Terms”) govern your use of CivicClear, a
          platform for reporting civic issues and helping officials verify and
          resolve them. By creating an account or using the service, you agree
          to these Terms and our Privacy Policy.
        </p>
      </LegalSection>

      <LegalSection title="The service">
        <p>
          CivicClear lets citizens file reports with descriptions, photos, and
          location details, and lets authorized officials triage, update
          status, view maps and analytics, and export records. Reward points may
          be granted when an official verifies a report, and a smaller bonus may
          apply when it is resolved. Points have no cash value unless a local
          program separately says otherwise.
        </p>
      </LegalSection>

      <LegalSection title="Accounts and roles">
        <ul>
          <li>
            Citizens may register for their own accounts and must provide
            accurate information.
          </li>
          <li>
            Official and admin accounts are created by the operating department;
            they are not self-registered in the citizen flow.
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
            unrelated to genuine civic issues.
          </li>
          <li>
            Upload unlawful, obscene, or irrelevant images, or photos of people
            without a legitimate civic purpose.
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
            Misrepresent your identity or your authority as an official.
          </li>
        </ul>
        <p>
          Officials may reject invalid reports. Rejected reports do not earn
          points. We (or the operating department) may suspend accounts that
          abuse the system.
        </p>
      </LegalSection>

      <LegalSection title="Your content">
        <p>
          You retain ownership of content you submit. You grant the CivicClear
          operator a license to store, display, process, and export that content
          as needed to investigate and resolve reports and to run departmental
          workflows (including maps, analytics, CSV, and PDF files).
        </p>
      </LegalSection>

      <LegalSection title="No emergency service">
        <p>
          CivicClear is not a substitute for emergency services. If someone is
          in immediate danger or you need urgent help, contact local emergency
          numbers first. Response times for civic reports depend on departmental
          capacity and are not guaranteed.
        </p>
      </LegalSection>

      <LegalSection title="Disclaimer">
        <p>
          The service is provided “as is.” To the fullest extent permitted by
          law, CivicClear and its operators disclaim warranties of
          uninterrupted availability, perfect accuracy of maps or third-party
          hosting, or fitness for a particular purpose. Points and status
          updates do not create a contractual obligation for any specific
          municipal outcome.
        </p>
      </LegalSection>

      <LegalSection title="Limitation of liability">
        <p>
          To the fullest extent permitted by law, CivicClear and its operators
          are not liable for indirect, incidental, or consequential damages
          arising from use of the service, delayed resolution of reports, or
          reliance on points balances. Nothing in these Terms excludes liability
          that cannot be excluded under applicable law.
        </p>
      </LegalSection>

      <LegalSection title="Changes and termination">
        <p>
          We may update these Terms as the product evolves. The “Last updated”
          date will change when we do. Continued use after changes means you
          accept the updated Terms. You may stop using CivicClear at any time.
          The operator may restrict access for violations of these Terms or for
          operational/legal reasons.
        </p>
      </LegalSection>

      <LegalSection title="Governing law">
        <p>
          These Terms are intended for use with a locally operated CivicClear
          deployment. Disputes are handled under the laws and forums that apply
          to the municipal or departmental operator hosting your instance,
          unless a separate written agreement says otherwise.
        </p>
      </LegalSection>

      <LegalSection title="Contact">
        <p>
          Questions about these Terms should go to the department that operates
          your CivicClear instance.
        </p>
      </LegalSection>
    </LegalShell>
  );
}
