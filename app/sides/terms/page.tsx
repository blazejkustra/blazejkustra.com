import type { Metadata } from "next";
import Markdown from "@/components/markdown";

export const metadata: Metadata = {
  title: "Sides Terms of Use",
  description:
    "Terms of use for Sides, the pass-the-phone party game about picking sides.",
  alternates: {
    canonical: "/sides/terms",
  },
};

const content = `
These terms apply when you use Sides. By using the app you agree to them. [Apple's Standard License Agreement](https://www.apple.com/legal/internet-services/itunes/dev/stdeula/) also applies, and where the two differ, these terms add to it.

## The game

Sides is a party game for people in the same room. There are no accounts, purchases or subscriptions in the app.

## Play kindly

The game is about talking, guessing and arguing with friends. Keep it friendly, and leave out anything that would hurt someone at the table.

## No warranty

Sides is provided as is, without warranties of any kind. To the extent the law allows, I am not liable for anything that results from using it.

## Changes and ending

I may update the app or these terms. The latest version will always be on this page with a new date. You can stop using the app at any time by deleting it.

## Governing law

These terms are governed by the laws that apply where you live, and nothing in them limits rights you have under local consumer law.

## Contact

Questions? Contact [kustrablazej@gmail.com](mailto:kustrablazej@gmail.com).
`;

export default function SidesTermsPage() {
  return (
    <article className="mb-10">
      <h1 className="text-2xl font-bold mb-1 text-balance">
        Sides Terms of Use
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
