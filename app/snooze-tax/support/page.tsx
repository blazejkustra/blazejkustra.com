import type { Metadata } from "next";
import Markdown from "@/components/markdown";

export const metadata: Metadata = {
  title: "Snooze Tax Support",
  description:
    "Help and contact for Snooze Tax, the iOS alarm clock where every snooze costs a little more than the last.",
  alternates: {
    canonical: "/snooze-tax/support",
  },
};

const content = `
Snooze Tax is an alarm clock with timers, a stopwatch and a world clock. Stopping an alarm is free. Your first snooze is free. After that, snoozing costs money, and every snooze costs more than the last.

## How snooze pricing works

- When an alarm rings, Stop is free. Snooze opens the app and shows the price of your next snooze.
- Your first snooze after installing the app is free. Every snooze after that is a paid one-time purchase.
- If you pay, the alarm rings again after its snooze time. If you cancel or wait, it rings again in 2 minutes.
- Paid snoozes climb through fixed steps, from about $0.99 to about $99.99 in the US, and stay at the top step. Your local App Store price is shown before you pay.
- The paid price never resets. It is tied to your purchase history, so reinstalling the app does not lower it.

## How much have I spent?

Open the Snooze Bill from the banknote button on the Alarms screen, or from Settings. It shows your total, the next price and every paid snooze. There is also a Snooze Bill widget. After a reinstall, tap Restore purchase history to load your past snoozes from the App Store.

## Tips for reliable alarms

- Allow alarms when the app asks. If you said no, turn them on in Settings, Snooze Tax.
- Alarms ring on Silent and during Focus, but check your volume before bed.
- Keep your iPhone charged, or on a charger overnight.
- Use a backup alarm for anything you cannot miss.

## Refunds

Apple handles all payments. To request a refund, go to [reportaproblem.apple.com](https://reportaproblem.apple.com).

## Contact

Questions, bugs or ideas? Email [kustrablazej@gmail.com](mailto:kustrablazej@gmail.com). Mention your iPhone model and iOS version if you can.

See also the [privacy policy](/snooze-tax/privacy) and [terms of use](/snooze-tax/terms).
`;

export default function SnoozeTaxSupportPage() {
  return (
    <article className="mb-10">
      <h1 className="text-2xl font-bold mb-8 text-balance">
        Snooze Tax Support
      </h1>
      <div className="text-post leading-relaxed font-normal text-text-primary">
        <Markdown content={content} />
      </div>
    </article>
  );
}
