import type { Metadata } from "next";
import Markdown from "@/components/markdown";

export const metadata: Metadata = {
  title: "Coffee Thought Privacy Policy",
  description:
    "Privacy policy for Coffee Thought, the iOS app that shows one thought a day on a cup of coffee.",
  alternates: {
    canonical: "/coffee-thought/privacy",
  },
};

const content = `
Coffee Thought shows one thought a day on a cup of coffee. It doesn't collect, store or share any personal data.

The app has no accounts, analytics, advertising or tracking, and makes no network requests.

## What stays on your device

When you mark a thought as liked or disliked, the app saves that choice together with the date. It is kept only on your iPhone, in storage shared only between the app and its widgets, and is never sent to me or to anyone else. It may be included in your own device or iCloud backup. Deleting the app removes it.

All thoughts, the coffee video and the widgets are part of the app. The thought of the day is picked on your device from the date, so the app and its widgets work offline.

## What the app does not do

- No accounts or sign-in.
- No analytics, tracking or advertising.
- No third-party services or SDKs.
- No network requests. The only links are to this page and the support page, which open in your browser.
- No access to your location, contacts, photos, camera or microphone.

## Children

Coffee Thought collects no data from anyone, including children.

## Changes

If this policy changes, the new version will be posted on this page with a new date.

## Contact

Questions? Contact [kustrablazej@gmail.com](mailto:kustrablazej@gmail.com).
`;

export default function CoffeeThoughtPrivacyPage() {
  return (
    <article className="mb-10">
      <h1 className="text-2xl font-bold mb-1 text-balance">
        Coffee Thought Privacy Policy
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
