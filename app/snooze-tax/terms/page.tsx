import type { Metadata } from "next";
import Markdown from "@/components/markdown";

export const metadata: Metadata = {
  title: "Snooze Tax Terms of Use",
  description:
    "Terms of use for Snooze Tax, the iOS alarm clock where every snooze costs a little more than the last.",
  alternates: {
    canonical: "/snooze-tax/terms",
  },
};

const content = `
These terms apply when you use Snooze Tax. By using the app you agree to them. [Apple's Standard License Agreement](https://www.apple.com/legal/internet-services/itunes/dev/stdeula/) also applies, and where the two differ, these terms add to it.

## Paid snoozes

- Stopping an alarm is always free.
- Your first snooze on each install of the app is free.
- After that, each snooze is a consumable, one-time in-app purchase. It is used up the moment the snooze starts and cannot be saved, transferred or reused.
- Every paid snooze costs more than the one before. The price starts at the lowest tier (about $0.99 in the US) and climbs through fixed steps up to the highest tier (about $99.99 in the US), where it stays. The paid price never resets, including after you reinstall the app.
- The app always shows the exact price in your currency before you pay, and Apple asks you to confirm every purchase.
- There are no subscriptions.

## Payments and refunds

Apple processes all payments, using the payment method on your Apple Account. Refund requests go through Apple at [reportaproblem.apple.com](https://reportaproblem.apple.com). I cannot issue refunds myself.

## Waking up is your job

Snooze Tax is provided as is, without warranties of any kind. You are responsible for waking up on time.

Alarms depend on your iPhone. Silent mode, Focus, volume, low battery, a powered-off or force-quit device, iOS updates, or revoking the app's alarm permission can all affect whether and how an alarm rings. Keep a backup alarm for anything important.

To the extent the law allows, I am not liable for missed or late alarms, or for anything that results from them, such as missed flights, meetings, exams or work.

## Changes and ending

I may update the app or these terms. The latest version will always be on this page with a new date. You can stop using the app at any time by deleting it.

## Governing law

These terms are governed by the laws that apply where you live, and nothing in them limits rights you have under local consumer law.

## Contact

Questions? Contact [kustrablazej@gmail.com](mailto:kustrablazej@gmail.com).
`;

export default function SnoozeTaxTermsPage() {
  return (
    <article className="mb-10">
      <h1 className="text-2xl font-bold mb-1 text-balance">
        Snooze Tax Terms of Use
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
