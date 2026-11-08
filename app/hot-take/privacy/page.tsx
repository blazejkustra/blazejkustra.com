import type { Metadata } from "next";
import Markdown from "@/components/markdown";

export const metadata: Metadata = {
  title: "Hot Take Privacy Policy",
  description:
    "Privacy policy for Hot Take, the pass-the-phone party opinions game.",
  alternates: {
    canonical: "/hot-take/privacy",
  },
};

const content = `
Hot Take is a party game played on one phone passed around the room. It does not collect, store or share any personal data.

## What stays on your device

The game saves player names, takes per player, chosen topic, the Guess who setting, language and vibration setting. This is kept only on your device, in the app's local storage, so the next game starts where you left off. It is never sent to me or anyone else. It may be included in your own device or iCloud backup. Deleting the app removes it.

The takes you write are kept in the app's memory only while a game is running. They are never saved to storage and never leave the phone.

## What the app does not do

- No accounts or sign-in.
- No analytics, tracking or advertising.
- No third-party services or SDKs that collect data.
- No access to your location, contacts, photos, camera or microphone.
- The game makes no network requests while you play and works offline. Links in Options open this website in your browser.

## Children

Hot Take collects no data from anyone, including children.

## Changes

If this policy changes, the new version will be posted on this page with a new date.

## Contact

Questions? Contact [kustrablazej@gmail.com](mailto:kustrablazej@gmail.com).
`;

export default function HotTakePrivacyPage() {
  return (
    <article className="mb-10">
      <h1 className="text-2xl font-bold mb-1 text-balance">
        Hot Take Privacy Policy
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
