import { LegalPageLayout, type LegalSection } from "../components/legal/LegalPageLayout";

const sections: LegalSection[] = [
  {
    title: "Information We Collect",
    body: [
      {
        paragraph:
          "We collect information you provide directly to us and information we collect automatically when you use our service.",
      },
      {
        heading: "Personal Information",
        paragraph:
          "This may include your name, email address, phone number, identification number (NIN), payment information.",
      },
      {
        heading: "Usage Information",
        paragraph:
          "We collect information about how you use our platform, including your searches, interactions and device information.",
      },
      {
        heading: "Location Information",
        paragraph:
          "With your consent, we collect precise location data to provide neighborhood insights and property verification.",
      },
    ],
  },
  {
    title: "How We Use Your Information",
    body: [
      {
        paragraph:
          "We use the information we collect to operate, maintain, and improve My Ulo, to verify listings and identities, to personalize your search results, and to communicate with you about your account and properties you're interested in.",
      },
    ],
  },
  {
    title: "How We Share Your Information",
    body: [
      {
        paragraph:
          "We may share information with landlords and agents you choose to contact, with service providers who help us operate the platform, and when required by law. We do not sell your personal information to third parties.",
      },
    ],
  },
  {
    title: "Data Security",
    body: [
      {
        paragraph:
          "We use industry-standard technical and organizational measures to protect your information from unauthorized access, loss, or misuse. No method of transmission over the internet is completely secure, but we work continuously to protect your data.",
      },
    ],
  },
  {
    title: "Your Rights",
    body: [
      {
        paragraph:
          "You have the right to access, correct, or delete your personal information, and to object to or restrict certain processing. You can manage most of this directly from your account settings, or contact us for assistance.",
      },
    ],
  },
  {
    title: "Cookies",
    body: [
      {
        paragraph:
          "We use cookies and similar technologies to keep you signed in, remember your preferences, and understand how you use My Ulo so we can improve it.",
      },
    ],
  },
  {
    title: "Third-Part Services",
    body: [
      {
        paragraph:
          "Our platform may include links to or integrations with third-party services, such as maps and payment providers. Those services have their own privacy practices, which we encourage you to review.",
      },
    ],
  },
  {
    title: "Children's Privacy",
    body: [
      {
        paragraph:
          "My Ulo is not directed at children under 18, and we do not knowingly collect personal information from children.",
      },
    ],
  },
  {
    title: "Changes To This Policy",
    body: [
      {
        paragraph:
          "We may update this policy from time to time. We'll notify you of significant changes and post the updated policy on this page with a new \"Last Updated\" date.",
      },
    ],
  },
  {
    title: "Contact Us",
    body: [
      {
        paragraph:
          "If you have questions about this Privacy Policy, reach out to us at hello@myulo.com.",
      },
    ],
  },
];

export function PrivacyPolicyPage() {
  return (
    <LegalPageLayout
      title="Privacy Policy"
      lastUpdated="July 23, 2026"
      intro="At My Ulo, we respect your policy and we are committed to protecting your personal data. This policy explains how we collect, use, disclose and safeguard your information when you use our platform."
      sections={sections}
    />
  );
}
