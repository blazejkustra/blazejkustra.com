import type { Metadata } from "next";
import Markdown from "@/components/markdown";

export const metadata: Metadata = {
  title: "Snooze Tax Privacy Policy",
  description:
    "Privacy policy for Snooze Tax, the iOS alarm clock where every snooze costs a little more than the last.",
  alternates: {
    canonical: "/snooze-tax/privacy",
  },
};

const content = `
Snooze Tax is an alarm clock where stopping an alarm is free and every snooze is a paid in-app purchase. The only data that leaves your iPhone is what is needed to process and remember those purchases.

The app has no accounts, analytics, advertising or tracking.

## Purchases

Apple processes all payments. I never see your name, Apple Account, card or billing details.

Purchases are handled by [RevenueCat](https://www.revenuecat.com/privacy), a service that checks App Store receipts and keeps your snooze history so the price keeps climbing after a reinstall. For that, the app sends RevenueCat:

- A random ID created by the app on first launch. It is stored in your iPhone's keychain, so it survives reinstalling the app, and it has no link to your name or email.
- Your snooze purchases: which snooze you bought, when, and the price and currency.
- Technical details needed to process requests, such as the app and iOS version, your device's vendor identifier, your App Store country and your IP address as part of the connection.

I use this data only to process purchases and keep your snooze price correct. It is never used for advertising or tracking.

## What stays on your device

Your alarms and their labels, timers, stopwatch, world clock cities, and theme and clock face choices are stored only on your iPhone, in storage shared between the app and its widgets. The app also keeps a local copy of your snooze bill there so the widget can show it. None of this is sent to me. They may be included in your own device or iCloud backup. Deleting the app removes them.

Two small items are kept in your iPhone's keychain and survive deleting the app: the random purchase ID described above, and the date you used your free first snooze, which keeps the free snooze to once per device. That date stays on your iPhone.

The world clock uses a list of cities built into the app and your iPhone's time zone setting. The app never asks for your location.

## What the app does not do

- No accounts or sign-in.
- No analytics, tracking or advertising.
- No access to your location, contacts, photos, camera or microphone.
- No third-party services other than RevenueCat for purchases.

## Your data

To have your purchase history deleted from RevenueCat, email me with the dates of your paid snoozes (listed on the Snooze Bill screen) so I can find it. Refunds and Apple's own purchase records are handled by Apple.

## Children

Snooze Tax collects no personal data from anyone, including children, beyond the anonymous purchase records described above.

## Changes

If this policy changes, the new version will be posted on this page with a new date.

## Contact

Questions? Contact [kustrablazej@gmail.com](mailto:kustrablazej@gmail.com).
`;

export default function SnoozeTaxPrivacyPage() {
  return (
    <article className="mb-10">
      <h1 className="text-2xl font-bold mb-1 text-balance">
        Snooze Tax Privacy Policy
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
