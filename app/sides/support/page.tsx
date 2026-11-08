import type { Metadata } from "next";
import Markdown from "@/components/markdown";

export const metadata: Metadata = {
  title: "Sides Support",
  description:
    "Help and contact for Sides, the pass-the-phone party game about picking sides.",
  alternates: {
    canonical: "/sides/support",
  },
};

const content = `
Sides is a pass-the-phone party game. Two players secretly rate how much they agree with the same statement, the phone reveals both answers, and the table argues it out.

## Get help or report a problem

Found a bug or have an idea? Email [kustrablazej@gmail.com](mailto:kustrablazej@gmail.com). Mention your iPhone model and iOS version if you can.

## Common questions

**How many people can play?** From 2 to 8 players on one phone. Pairs rotate so everyone gets matched up.

**Can I change the language?** Yes. Open Options from the gear on the first screen. Sides speaks English, Polish, German and Spanish.

**Where are my players and settings saved?** On this device only. Deleting the app removes them.

See also the [privacy policy](/sides/privacy) and [terms of use](/sides/terms).
`;

export default function SidesSupportPage() {
  return (
    <article className="mb-10">
      <h1 className="text-2xl font-bold mb-8 text-balance">
        Sides Support
      </h1>
      <div className="text-post leading-relaxed font-normal text-text-primary">
        <Markdown content={content} />
      </div>
    </article>
  );
}
