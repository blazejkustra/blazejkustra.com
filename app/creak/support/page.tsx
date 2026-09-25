import type { Metadata } from "next";
import Markdown from "@/components/markdown";

export const metadata: Metadata = {
  title: "Creak — Support",
  description:
    "Help and contact for Creak, the iOS app that turns your iPhone into a creaky old door.",
  alternates: {
    canonical: "/creak/support",
  },
};

const content = `
Creak turns your iPhone into a creaky old door. Swipe the door to open it and hear it creak; slam it shut for a thud.

## How to use

- Swipe the door left to open it and right to close it.
- Open it slowly or quickly for different creaks.
- Tap the gear to choose a door. Each one has its own sound and wood.
- If you hear nothing, check the ringer/silent switch and the volume.

## Contact

Questions, bugs or ideas? Email [kustrablazej@gmail.com](mailto:kustrablazej@gmail.com).

See also the [privacy policy](/creak/privacy).
`;

export default function CreakSupportPage() {
  return (
    <article className="mb-10">
      <h1 className="text-2xl font-bold mb-8 text-balance">Creak — Support</h1>
      <div className="text-post leading-relaxed font-normal text-text-primary">
        <Markdown content={content} />
      </div>
    </article>
  );
}
