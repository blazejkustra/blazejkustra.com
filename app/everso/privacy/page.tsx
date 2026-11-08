import type { Metadata } from "next";
import Markdown from "@/components/markdown";

export const metadata: Metadata = {
  title: "Everso Privacy Policy",
  description:
    "Privacy policy for Everso, the iOS app for recurring chores, trips and reminders.",
  alternates: {
    canonical: "/everso/privacy",
  },
};

const content = `
Everso doesn't collect, store or share any personal data. Everything you enter stays on your device.

The app has no accounts, analytics, advertising or tracking, and makes no network requests.

## What stays on your device

Your chores, areas, trips, packing lists, reminders, notes and settings are saved on your iPhone or iPad, in storage shared only between the app and its widgets. They are never sent to me or to anyone else. Deleting the app removes them. If you back up your device to iCloud or a computer, that backup includes Everso's data like any other app's.

## Photos

When you give an area, chore or trip a cover photo, you choose it in the system photo picker. Everso only receives the photo you pick and has no access to the rest of your library. The photo is resized and saved on your device with the item.

## Notifications

Reminders for chores, trips and to-dos are local notifications, scheduled on your device. No server is involved.

## Links in notes

If you tap a link in a reminder's notes, it opens in your browser.

## Children

Everso collects no data from anyone, including children.

## Changes

If this policy changes, the new version will be posted on this page with a new date.

## Contact

Questions? Contact [kustrablazej@gmail.com](mailto:kustrablazej@gmail.com).
`;

export default function EversoPrivacyPage() {
  return (
    <article className="mb-10">
      <h1 className="text-2xl font-bold mb-1 text-balance">
        Everso Privacy Policy
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
