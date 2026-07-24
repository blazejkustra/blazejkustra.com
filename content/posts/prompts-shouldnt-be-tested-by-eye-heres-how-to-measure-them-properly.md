---
title: "Prompts Shouldn’t Be Tested by Eye. Here’s How to Measure Them Properly"
date: "2026-06-02"
description: "When prompts reach production, “looks good” stops being good enough. A practical framework for building test sets, defining criteria, and scoring prompt versions."
canonical: "https://swmansion.com/blog/prompts-shouldn-t-be-tested-by-eye-here-s-how-to-measure-them-properly/"
---

![AI prompts testing](/images/posts/prompts-shouldnt-be-tested-by-eye.png)

Most people write a prompt, test it on a couple of examples by hand, and call it a day. If the outputs _look good_, they ship it.

I've done this. You've probably done this too. And honestly, for a one-off task, it's fine.

But the moment a prompt lands on your production backend, generating outputs for real users, "looks good" stops being good enough. Because the next person who edits that prompt has no idea if their change made things better, worse, or the same. They're also eyeballing it. The whole thing drifts on vibes.

**This is where prompt engineering, prompt evaluation, and LLM evaluation start to matter**. If you're building real AI features, you need a repeatable way to measure whether a prompt actually improved.

Here's how to stop guessing and start treating AI prompt testing like an engineering problem.

## Quick recap: the techniques worth knowing

This post is about measurement, but you need something to measure. **Good AI prompt engineering usually follows a few predictable rules.** A good prompt usually:

- **Starts with a clear instruction.** _"Write three paragraphs about how solar panels work"_ beats _"I'd like to know about that stuff people put on roofs."_
- **Puts persistent rules in the system prompt.** Anything true for every request (role, tone, format constraints, hard rules) belongs there, not glued onto the user message every time.
- **Lists rules and constraints explicitly**. Word count limits, things that must be included, things to avoid. Turn them into a numbered list inside the prompt.
- **Uses XML tags to separate sections.** When you're feeding the model lots of input, wrapping each part in tags like `<docs>...</docs>, <examples>...</examples>, <task>...</task>` makes it trivial for the model to follow.
- **Specifies the audience.** _"Explain X to a 5-year-old"_ is wildly different from _"Explain X to a software engineer"_.
- **Includes examples.** One or two input/output pairs solve more problems than three paragraphs of instructions.

[Anthropic's prompt engineering docs](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices#general-principles) cover all of these in detail.

**These are the standard prompt engineering techniques. Now the real question: how do you know your prompt actually got better when you applied them?**

## The example we'll improve

Let's pick something concrete. I want a prompt that generates a packing list for a trip based on destination, length, planned activities, weather, and luggage limit.

My first attempt:

```
Hey, I'm going on holiday and don't really know what to pack.
Could you help me out?
Where: {destination}
How long: {days}
Activities: {activities}
Weather: {weather}
Luggage: {luggage_limit}
```

It sort of works. Sometimes it gives a clean list. Sometimes it gives me a wall of _prose_. Sometimes it forgets the luggage limit. Sometimes it asks me follow-up questions when I just want a list.

If I now apply the XML structure, add a couple of examples, give the model a role, is the new version actually better? By how much? **That's where prompt testing comes in.**

### Step 1: Build a test set

**The single most underrated step in prompt engineering is just: write down 10 to 20 inputs you actually care about.**

Not "let me think of some examples" while staring at the prompt. Sit down separately ahead of time and write inputs that cover:

- The boring common case (a week in Italy, beach holiday)
- The edge cases (a 3-day business trip, carry-on only)
- The weird ones (a two-week trekking trip with a 6-year-old)
- The adversarial ones (no destination given, contradictory activities)

For the packing list, my test set might look like:

```
1. Italy / 7 days / beach + sightseeing / 28°C sunny / 23kg checked
2. Norway / 5 days / hiking / -2°C snowy / 10kg carry-on
3. Tokyo / 14 days / business + tourism / 18°C mixed / 23kg checked
4. London / 2 days / conference / 12°C rainy / 8kg carry-on
5. ... and so on
```

That's it. That's your test set. You'll use it for every version of the prompt from now on. You can also generate test cases with another LLM, but make sure to review them by hand and edit out any that don't make sense.

### Step 2: Define what "good" looks like

For each test case, decide what a good output should contain. You don't need a 50-page rubric. Four or five criteria are usually enough. For the packing list:

- Does it include weather-appropriate clothing? (yes/no)
- Does it cover the listed activities? (yes/no)
- Does it respect the luggage limit? (yes/no)
- Is it a clean list, not a wall of text? (yes/no)
- Does it specify quantities (e.g. _"3 t-shirts"_ not just _"t-shirt"_)? (yes/no)

Now you have something measurable. Every output either passes each check or it doesn't. With 20 test cases and 5 checks, your prompt has a maximum score of 100, and any given version of it gets some number out of 100.

That number is the thing you're optimizing. This is the core shift from casual AI prompting to structured prompt evaluation.

### Step 3: Score the outputs

You've got three options here, and you'll probably want to try at least two.

**Deterministic checks:** For anything you can write code for: "Does the output contain a numbered list?" or "Is it under 500 tokens?". These run in milliseconds and they don't lie.

**Manual scoring:** For subjective criteria like "Is it a clean list, not a wall of text?" You can read the outputs and score them by hand. This is fine for 20 cases, but it doesn't scale and it's not consistent.

**LLM-as-judge:** You can literally give another LLM call the original input, the output, and your criteria, and ask it to score. Something like:

```
<task>
You are evaluating a packing list generator. Given the user's trip
details and the generated list, score the output on the criteria below.
</task>

<trip_details>
{input}
</trip_details>

<generated_list>
{output}
</generated_list>

<criteria>
1. Weather-appropriate clothing included (yes/no)
2. All listed activities covered (yes/no)
3. Luggage limit respected (yes/no)
4. Output is a clean list, not a wall of text (yes/no)
5. Quantities specified for each item (yes/no)
</criteria>
```

A good judge prompt is itself a prompt you should iterate on. But with 20 cases and 5 criteria, you can spot-check the judge's verdicts by hand and trust it once you've calibrated.

LLM-as-judge isn't perfect. It tends to be lenient, and it has biases (longer outputs often look "better" to it). But you don't need perfection; you need **consistency**. As long as the judge scores the same way across both versions of your prompt, the comparison is fair.

### Step 4: Run it and compare

This is where it gets fun. You run prompt v1 against all 20 cases, score every output, total the score. Then you change one thing about the prompt (add examples, restructure with XML, switch the model) and run v2 against the exact same 20 cases.

Now you can say things like:

```
v1 (original): 64 / 100
v2 (added XML structure): 76 / 100
v3 (added a detailed packing-expert system prompt on top of v3): 92 / 100
v4 (added two examples): 85 / 100
```

That last line is gold. **The examples made things worse. Adding examples is usually a reliable win in prompt engineering best practices, but on this specific task they pulled the model too close to the example format and cost 7 points.** Without the test set, you would have shipped v4 because adding examples should help. With the test set, you ship v3 and move on.
## Tools I recommend for AI prompt testing

Two options depending on how advanced you are.

[Claude Workbench](https://platform.claude.com/workbench/) is good for quick, exploratory work. You can run a prompt against a few inputs, tweak variables, compare two versions side by side. Great for the first hour of an idea, not great for tracking improvement across 30 versions.

[promptfoo](https://www.promptfoo.dev/) is what you want when you build for production. You define your test cases and assertions in YAML, run the suite, and get a table of pass rates per prompt version. It supports deterministic assertions, LLM-as-judge, multi-model comparisons, regression testing, the whole thing. It's basically a Jest for prompts.

A minimal `promptfooconfig.yaml` for the packing list might look like:

```
prompts:
  - file://prompts/packing_v1.txt
  - file://prompts/packing_v2.txt

providers:
  - anthropic:messages:claude-sonnet-4-6

tests:
  - vars:
      destination: Italy
      days: 7
      activities: beach, sightseeing
      weather: 28°C sunny
      luggage_limit: 23kg checked
    assert:
      - type: contains
        value: "sunscreen"
      - type: llm-rubric
        value: "Output is a clean numbered list, not prose"
      - type: llm-rubric
        value: "Respects the 23kg luggage limit"
```

Run `promptfoo eval`, and you get a side-by-side pass-rate table for v1 vs v2 – no more guessing.

## What this changes

**Once you have a test set and a score, prompt engineering stops being a _vibes_ game.** You stop saying _"I think this version is better"_ and instead start catching regressions when someone edits the prompt. You can argue from numbers instead of taste.

It also changes how you write prompts. Instead of trying to think of every edge case in your head and stuffing the prompt full of defensive instructions, you let the test set find the failures for you. The prompt stays lean; the criteria does the catching.

## Final thoughts

The setup cost is real, and building a test set takes a couple of hours. But the moment your prompt goes into production, or gets maintained by more than one person, or starts charging real money per call, that cost pays itself back the first time you avoid shipping a regression.

At [Software Mansion](https://swmansion.com/), we build AI features into production products, and _"did it actually get better?"_ is a question we have to answer all the time. If your team needs help getting prompts and AI features past the "looks good" stage, [get in touch](https://swmansion.com/contact/).