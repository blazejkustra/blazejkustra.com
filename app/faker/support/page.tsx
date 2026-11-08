import type { Metadata } from "next";
import Markdown from "@/components/markdown";

export const metadata: Metadata = {
  title: "Faker Support",
  description:
    "Help and contact for Faker, the pass-the-phone party impostor game.",
  alternates: {
    canonical: "/faker/support",
  },
};

const content = `
Faker is a pass-the-phone bluffing game. Everyone sees the same secret word except the impostor, then the group gives one-word clues and votes on who is faking it.

## Get help or report a problem

Found a bug or have an idea? Email [kustrablazej@gmail.com](mailto:kustrablazej@gmail.com). Mention your iPhone model and iOS version if you can.

## Common questions

**How many people can play?** From 3 to 12 players on one phone.

**Can I change the language?** Yes. Open Options from the gear on the first screen. Faker speaks English, Polish, German and Spanish.

**Where are my players and settings saved?** On this device only. Deleting the app removes them.

See also the [privacy policy](/faker/privacy) and [terms of use](/faker/terms).
`;

export default function FakerSupportPage() {
  return (
    <article className="mb-10">
      <h1 className="text-2xl font-bold mb-8 text-balance">
        Faker Support
      </h1>
      <div className="text-post leading-relaxed font-normal text-text-primary">
        <Markdown content={content} />
      </div>
    </article>
  );
}
