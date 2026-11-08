import type { Metadata } from "next";
import Markdown from "@/components/markdown";

export const metadata: Metadata = {
  title: "Hot Take Support",
  description:
    "Help and contact for Hot Take, the pass-the-phone party opinions game.",
  alternates: {
    canonical: "/hot-take/support",
  },
};

const content = `
Hot Take is a pass-the-phone party game for 3 to 12 players. Everyone writes hot takes in secret, then the table reads them anonymously, rates the heat and guesses who wrote each one.

## Get help or report a problem

Found a bug or have an idea? Email [kustrablazej@gmail.com](mailto:kustrablazej@gmail.com). Mention your iPhone model and iOS version if you can.

## Common questions

**How many people can play?** From 3 to 12 players on one phone.

**Can I change the language?** Yes. Open Options from the gear on the first screen. Hot Take speaks English, Polish, German and Spanish.

**Where are my players and settings saved?** On this device only. Deleting the app removes them.

See also the [privacy policy](/hot-take/privacy) and [terms of use](/hot-take/terms).
`;

export default function HotTakeSupportPage() {
  return (
    <article className="mb-10">
      <h1 className="text-2xl font-bold mb-8 text-balance">
        Hot Take Support
      </h1>
      <div className="text-post leading-relaxed font-normal text-text-primary">
        <Markdown content={content} />
      </div>
    </article>
  );
}
