import type { Metadata } from "next";
import { LegalSection, LegalShell } from "@/shared/layout/legal-shell";

export const metadata: Metadata = {
  title: "Privacy Policy · CivicClear",
  description:
    "How CivicClear collects, uses, and protects personal and report data.",
};

export default function PrivacyPage() {
  return (
    <LegalShell title="Privacy Policy" updated="21 August 2026">
      <LegalSection title="Who we are">
        <p>
          CivicClear is a civic issue reporting platform that helps citizens
          submit reports (such as potholes, garbage, streetlights, and
          drainage) and helps officials verify and resolve them. This policy
          explains what information we collect and how we use it.
        </p>
      </LegalSection>

      <LegalSection title="Information we collect">
        <p>Depending on how you use CivicClear, we may collect:</p>
        <ul>
          <li>
            <strong className="font-semibold text-ink">Account details</strong>{" "}
            — name, email address, phone number (optional), and a hashed
            password.
          </li>
          <li>
            <strong className="font-semibold text-ink">
              Optional identity check
            </strong>{" "}
            — if you provide an Aadhaar number, we store only a one-way hash,
            never the raw number.
          </li>
          <li>
            <strong className="font-semibold text-ink">Complaint content</strong>{" "}
            — titles, descriptions, issue type, photos, map location or
            address text, and status history.
          </li>
          <li>
            <strong className="font-semibold text-ink">Reward activity</strong>{" "}
            — points balance and a ledger of awards tied to verified or
            resolved reports.
          </li>
          <li>
            <strong className="font-semibold text-ink">
              Technical session data
            </strong>{" "}
            — authentication cookies needed to keep you signed in securely.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="How we use your information">
        <ul>
          <li>To create and manage your account.</li>
          <li>
            To investigate, assign, and resolve civic reports you submit.
          </li>
          <li>
            To show officials maps, queues, analytics, and export files needed
            for department work.
          </li>
          <li>
            To award points when an official verifies (and optionally resolves)
            a valid report.
          </li>
          <li>To protect the service against spam and abuse.</li>
        </ul>
        <p>
          We do not sell personal data. We do not use complaint photos or
          location for advertising.
        </p>
      </LegalSection>

      <LegalSection title="Photos and location">
        <p>
          Photos and location pins you attach to a report are used only to
          investigate that civic issue. Officials can see them while handling
          the complaint. Public marketing pages do not list your personal
          reports or contact details.
        </p>
      </LegalSection>

      <LegalSection title="Who can see your data">
        <ul>
          <li>
            <strong className="font-semibold text-ink">Citizens</strong> see
            their own reports, profile, and points history.
          </li>
          <li>
            <strong className="font-semibold text-ink">Officials</strong> see
            complaint details needed for triage and resolution, including
            photos, location, and limited citizen contact fields on the report.
          </li>
          <li>
            <strong className="font-semibold text-ink">Service providers</strong>{" "}
            that host the app, database, or image uploads may process data on
            our behalf under contractual limits.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="Retention">
        <p>
          We keep account and complaint records for as long as needed to
          operate the service, meet departmental record-keeping needs, and
          handle disputes. You may request correction of inaccurate profile
          details from your profile page, or ask for account deletion by
          contacting the department that operates your CivicClear instance.
        </p>
      </LegalSection>

      <LegalSection title="Security">
        <p>
          Passwords are hashed. Optional Aadhaar values are hashed before
          storage. Sessions use secure cookies. Uploaded images are checked for
          allowed types and size. No method of transmission or storage is
          perfectly secure; we take reasonable steps to protect your data.
        </p>
      </LegalSection>

      <LegalSection title="Children">
        <p>
          CivicClear is intended for adults using civic services. If you
          believe a minor’s data was submitted, contact the operating
          department so it can be reviewed and removed where appropriate.
        </p>
      </LegalSection>

      <LegalSection title="Changes">
        <p>
          We may update this policy as the product changes. The “Last updated”
          date at the top of this page will change when we do. Continued use
          after an update means you accept the revised policy.
        </p>
      </LegalSection>

      <LegalSection title="Contact">
        <p>
          For privacy questions about this CivicClear deployment, contact the
          municipal or departmental operator that hosts your instance, or use
          the contact channel published on your local CivicClear landing page.
        </p>
      </LegalSection>
    </LegalShell>
  );
}
