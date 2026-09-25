import type { Metadata } from "next";
import Markdown from "@/components/markdown";

export const metadata: Metadata = {
  title: "Creak — Privacy Policy",
  description:
    "Privacy policy for Creak, the iOS app that turns your iPhone into a creaky old door.",
  alternates: {
    canonical: "/creak/privacy",
  },
};

const content = `
Creak doesn't collect, store or share any personal data.

The app has no accounts, analytics, advertising or tracking, and makes no network requests.

Creak reads your iPhone's hinge angle (on foldable iPhones) or your finger's movement on the door only to play the door sound, entirely on your device. Nothing is recorded or sent anywhere.

Your sound and settings choices are saved on your device so they're remembered next time. Deleting the app removes them.

## Contact

Questions? Contact [kustrablazej@gmail.com](mailto:kustrablazej@gmail.com).
`;

export default function CreakPrivacyPage() {
  return (
    <article className="mb-10">
      <h1 className="text-2xl font-bold mb-1 text-balance">
        Creak — Privacy Policy
      </h1>
      <p className="font-mono text-xs text-text-secondary mb-8">
        Last updated: September 25, 2026
      </p>
      <div className="text-post leading-relaxed font-normal text-text-primary">
        <Markdown content={content} />
      </div>
    </article>
  );
}
