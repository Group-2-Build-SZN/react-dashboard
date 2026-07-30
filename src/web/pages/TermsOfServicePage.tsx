import { LegalPageLayout, type LegalSection } from "../components/legal/LegalPageLayout";

const sections: LegalSection[] = [
  {
    title: "Acceptance of Terms",
    body: [
      {
        paragraph:
          "By accessing or using My Ulo, you agree to be bound by these Terms and our Privacy Policy.",
      },
    ],
  },
  {
    title: "Eligibility",
    body: [
      {
        paragraph:
          "You must be at least 18 years old to use our platform. Using My Ulo automatically means you represent that you meet this requirement.",
      },
    ],
  },
  {
    title: "User Accounts",
    body: [
      {
        paragraph:
          "You are responsible for maintaining the confidentiality of your account and for all activities under your account.",
      },
    ],
  },
  {
    title: "Use of the Platform",
    body: [
      {
        paragraph:
          "You agree to use My Ulo only for lawful purposes and in accordance with these Terms.",
      },
    ],
  },
  {
    title: "User Responsibilities",
    body: [
      {
        paragraph:
          "You agree to provide accurate information when creating listings or inquiries, and not to post misleading, fraudulent, or duplicate property listings.",
      },
    ],
  },
  {
    title: "Payments and Fees",
    body: [
      {
        paragraph:
          "Certain features, such as unlocking landlord contact details, may require payment. All fees are disclosed before you complete a transaction.",
      },
    ],
  },
  {
    title: "Intellectual Property",
    body: [
      {
        paragraph:
          "My Ulo and its content, features, and branding are owned by us and protected by applicable intellectual property laws. You may not copy or reuse them without permission.",
      },
    ],
  },
  {
    title: "Termination",
    body: [
      {
        paragraph:
          "We may suspend or terminate your access to My Ulo if you violate these Terms or engage in fraudulent or harmful activity on the platform.",
      },
    ],
  },
  {
    title: "Disclaimer of Warranties",
    body: [
      {
        paragraph:
          "My Ulo is provided \"as is.\" While we verify listings to the best of our ability, we do not guarantee the accuracy of every listing or the conduct of any landlord, agent, or tenant.",
      },
    ],
  },
  {
    title: "Limitation of Liability",
    body: [
      {
        paragraph:
          "To the fullest extent permitted by law, My Ulo is not liable for indirect, incidental, or consequential damages arising from your use of the platform.",
      },
    ],
  },
  {
    title: "Governing Law",
    body: [
      {
        paragraph:
          "These Terms are governed by the laws of the Federal Republic of Nigeria, without regard to conflict of law principles.",
      },
    ],
  },
  {
    title: "Changes to Terms",
    body: [
      {
        paragraph:
          "We may update these Terms from time to time. Continued use of My Ulo after changes take effect constitutes acceptance of the updated Terms.",
      },
    ],
  },
  {
    title: "Contact Us",
    body: [
      {
        paragraph:
          "If you have questions about these Terms, reach out to us at hello@myulo.com.",
      },
    ],
  },
];

export function TermsOfServicePage() {
  return (
    <LegalPageLayout
      title="Terms of Service"
      lastUpdated="July 23, 2026"
      intro='These Terms of Service ("Terms") govern your access to and use of My Ulo. By using our platform you agree to these Terms.'
      sections={sections}
    />
  );
}
