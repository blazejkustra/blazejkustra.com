import type { Metadata } from "next";
import Markdown from "@/components/markdown";

export const metadata: Metadata = {
  title: "Everso Support",
  description:
    "Help and contact for Everso, the iOS app for recurring chores, trips and reminders.",
  alternates: {
    canonical: "/everso/support",
  },
};

const content = `
Everso keeps track of the chores that come back on a schedule, packs for your trips and holds your reminders, all on your iPhone or iPad.

## Common questions

- **How do I add a chore?** Pick one from the library, which has about 140 chores with how-to guides, or create your own with its own schedule, steps and photo.
- **Can a chore repeat only in certain months?** Yes. Choose a seasonal schedule, such as gutters in April and November. Seasonal months flip for the southern hemisphere.
- **How does the packing list work?** One master list holds your usual items with simple rules, such as only for cold weather or one per day. A new trip builds its checklist from that list.
- **Why am I not getting notifications?** Check that notifications are on in Everso's Settings and allowed for Everso in the iOS Settings app. iOS limits each app to 64 scheduled notifications, so Everso schedules the soonest ones first.
- **How do I add a widget?** Touch and hold your Home Screen or Lock Screen, tap Edit, then add an Everso widget and choose a reminders list or your chores.
- **Can I hide parts of the app I don't use?** Yes. Settings > Areas chooses which areas Everso covers and can hide the Reminders tab.
- **Where is my data saved?** On this device only. Deleting the app removes it.
- **Is the health advice medical advice?** No. Health intervals are general guidance for healthy adults. Your doctor or dentist may recommend a different schedule.

## Contact

Questions, bugs or ideas? Email [kustrablazej@gmail.com](mailto:kustrablazej@gmail.com). Mention your device and the screen you were on if you can.

See also the [privacy policy](/everso/privacy).
`;

export default function EversoSupportPage() {
  return (
    <article className="mb-10">
      <h1 className="text-2xl font-bold mb-8 text-balance">Everso Support</h1>
      <div className="text-post leading-relaxed font-normal text-text-primary">
        <Markdown content={content} />
      </div>
    </article>
  );
}
