import type { Metadata } from "next";
import Markdown from "@/components/markdown";

export const metadata: Metadata = {
  title: "Coffee Thought Support",
  description:
    "Help and contact for Coffee Thought, the iOS app that shows one thought a day on a cup of coffee.",
  alternates: {
    canonical: "/coffee-thought/support",
  },
};

const content = `
Coffee Thought shows one thought a day, a question to sit with or a quote, poured as latte art into a cup of coffee. A new one arrives at midnight.

## Common questions

- **Can I see tomorrow's thought?** Each day has one thought, and the next one appears at midnight in your time zone.
- **How do I add a widget?** Touch and hold an empty area of the Home Screen, tap Edit, then Add Widget, and pick Coffee Thought. There are small and medium Home Screen widgets and a Lock Screen widget.
- **Where are my likes saved?** On your iPhone only. Deleting the app removes them.
- **Where are the privacy and support links in the app?** Tap the date under the cup, or the small info icon next to it.
- **Will a thought repeat?** There are more than a thousand, and each one is shown once before any repeats.

## Credits

The coffee footage is a video by John Diez on Pexels, used under the Pexels License. Quotes are credited to their authors in the app.

## Contact

Questions, bugs or ideas? Email [kustrablazej@gmail.com](mailto:kustrablazej@gmail.com). Mention your iPhone model and iOS version if you can.

See also the [privacy policy](/coffee-thought/privacy).
`;

export default function CoffeeThoughtSupportPage() {
  return (
    <article className="mb-10">
      <h1 className="text-2xl font-bold mb-8 text-balance">
        Coffee Thought Support
      </h1>
      <div className="text-post leading-relaxed font-normal text-text-primary">
        <Markdown content={content} />
      </div>
    </article>
  );
}
