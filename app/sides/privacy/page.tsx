import type { Metadata } from "next";
import Markdown from "@/components/markdown";

export const metadata: Metadata = {
  title: "Sides Privacy Policy",
  description:
    "Privacy policy for Sides, the pass-the-phone party game about picking sides.",
  alternates: {
    canonical: "/sides/privacy",
  },
};

const content = `
Sides is a party game played on one phone passed around the room. It does not collect, store or share any personal data.

## What stays on your device

The game saves player names, chosen topics, number of rounds, scale and discussion timer, language, vibration setting and a list of statements you have already seen. This is kept only on your device, in the app's local storage, so the next game starts where you left off. It is never sent to me or anyone else. It may be included in your own device or iCloud backup. Deleting the app removes it.

## What the app does not do

- No accounts or sign-in.
- No analytics, tracking or advertising.
- No third-party services or SDKs that collect data.
- No access to your location, contacts, photos, camera or microphone.
- The game makes no network requests while you play and works offline. Links in Options open this website in your browser.

## Children

Sides collects no data from anyone, including children.

## Changes

If this policy changes, the new version will be posted on this page with a new date.

## Contact

Questions? Contact [kustrablazej@gmail.com](mailto:kustrablazej@gmail.com).
`;

export default function SidesPrivacyPage() {
  return (
    <article className="mb-10">
      <h1 className="text-2xl font-bold mb-1 text-balance">
        Sides Privacy Policy
      </h1>
      <p className="font-mono text-xs text-text-secondary mb-8">
        Last updated: November 8, 2026
      </p>
      <div className="text-post leading-relaxed font-normal text-text-primary">
        <Markdown content={content} />
      </div>
    </article>
  );
}
