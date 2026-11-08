import type { Metadata } from "next";
import Markdown from "@/components/markdown";

export const metadata: Metadata = {
  title: "The Crown Support",
  description:
    "Help and contact for The Crown, the pass-the-phone hidden role game.",
  alternates: {
    canonical: "/the-crown/support",
  },
};

const content = `
The Crown is a pass-the-phone hidden role game for 5 to 10 players set in a royal court. Loyalists pass Loyal decrees while the Traitors and their hidden Usurper push Treacherous ones.

## Get help or report a problem

Found a bug or have an idea? Email [kustrablazej@gmail.com](mailto:kustrablazej@gmail.com). Mention your iPhone model and iOS version if you can.

## Common questions

**How many people can play?** From 5 to 10 players on one phone.

**Where are the full rules?** Open the rules from the game settings screen before you start.

**Can I change the language?** Yes. Open Options from the gear on the first screen. The Crown speaks English, Polish, German and Spanish.

**Where are my players and settings saved?** On this device only. Deleting the app removes them.

See also the [privacy policy](/the-crown/privacy) and [terms of use](/the-crown/terms).
`;

export default function TheCrownSupportPage() {
  return (
    <article className="mb-10">
      <h1 className="text-2xl font-bold mb-8 text-balance">
        The Crown Support
      </h1>
      <div className="text-post leading-relaxed font-normal text-text-primary">
        <Markdown content={content} />
      </div>
    </article>
  );
}
