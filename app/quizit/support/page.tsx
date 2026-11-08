import type { Metadata } from "next";
import Markdown from "@/components/markdown";

export const metadata: Metadata = {
  title: "Quizit Support",
  description:
    "Help and contact for Quizit, the pass-the-phone party trivia game.",
  alternates: {
    canonical: "/quizit/support",
  },
};

const content = `
Quizit is a pass-the-phone trivia game for a group in one room. Players take turns answering questions, the next player judges the answer, and three misses knock you out.

## Get help or report a problem

Found a bug or have an idea? Email [kustrablazej@gmail.com](mailto:kustrablazej@gmail.com). Mention your iPhone model and iOS version if you can.

## Common questions

**How does judging work?** There are no answer buttons. The player after you swipes up to see the answer and marks it right or wrong.

**Can I change the language?** Yes. Open Options from the gear on the first screen. Quizit speaks English, Polish, German and Spanish.

**Questions repeat too often.** Pick more categories, or more difficulty levels, in the game settings. Quizit avoids questions you saw recently.

**Where are my players and settings saved?** On this device only. Deleting the app removes them.

See also the [privacy policy](/quizit/privacy) and [terms of use](/quizit/terms).
`;

export default function QuizitSupportPage() {
  return (
    <article className="mb-10">
      <h1 className="text-2xl font-bold mb-8 text-balance">
        Quizit Support
      </h1>
      <div className="text-post leading-relaxed font-normal text-text-primary">
        <Markdown content={content} />
      </div>
    </article>
  );
}
