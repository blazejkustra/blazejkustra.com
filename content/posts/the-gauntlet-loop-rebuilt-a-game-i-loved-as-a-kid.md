---
title: "The Gauntlet Loop Rebuilt a Game I Loved as a Kid"
date: "2026-08-01"
image: "/images/posts/gauntlet-loop-og.png"
description: "One prompt, sixteen hours overnight, and a cosy pixel-art farm game that kept grading and fixing itself. How the Gauntlet loop works, where it hits its ceiling, and the parts worth using on everyday work."
---

**I gave Claude Code one prompt and went to sleep. In the morning I woke up to a game I loved playing as a kid 🥹**

![Round zero's coloured rectangles beside the finished farm sixteen hours later](/images/posts/gauntlet-loop-rounds.png)

Left is one of its first playable builds: coloured rectangles where the art should be. Right is where it ended up, sixteen hours in. I didn't touch the keyboard once in between. It went and found its own reference screenshots, wrote its own definition of "cosy", and graded itself all night.

Later that day I ran the same idea again with the same model just without the loop. A working game in forty minutes. **Both are playable further down so you can see the difference.**

## What the loop actually is

The [Gauntlet loop](https://somethingbig.ai/gauntlet-loop) is Matt Shumer's method, and the name oversells the machinery. There is no arena, no tournament, no elimination. There's a lead agent that keeps spawning two kinds of subagent:

- A **builder** gets the goal, one piece of the work, and the last verdict on that piece. It does not get the previous builder's reasoning.
- A **critic** gets the goal, the bar, and the artifact. It does not get the builder's reasoning, the round number, or any hint about what just changed.

<loop-diagram></loop-diagram>

That's it. That's the whole mechanism. Four rules make it work, and every one of them is about the critic:

1. **The bar has to be inspectable.** Real screenshots in a folder. A test suite. A latency budget. Not _"make it amazing"_, which is self-graded and always passes.
1. **The builder never grades its own work.** It remembers why every decision was made, which is exactly the wrong context for judging the result.
1. **Fresh agents, every round.** A critic that passed your sprites in round two is defending that call by round five.
1. **Give a goal, not an architecture.** The moment you prescribe the decomposition, the run is capped at your imagination instead of the model's. Let the lead agent split the work itself.

All of it runs without me. The coordinator even automated the blind test: a script pastes our screenshot next to the reference, shuffles the sides, and hides the answer key. The critic gets two images and one question, "which one is better and why?"

## Why it works

The setup is nothing new. Somebody builds, and somebody else who didn't build it reviews it against a spec, and neither gets to mark their own homework. Every sensible project runs this way.

The thing is that current frontier models like Opus 5 can run whole arrangement like this on its own: split a goal into pieces, spawn dozens of subagents, keep each one on task, read the verdicts coming back, and pick what to fix next. For sixteen hours, without drifting off the goal or quietly forgetting the bar.

## What sixteen hours actually bought

Most of what those hours produced was the rig around the game. It's hard to hand a critic a vibe, it needs something it can point at.

| | the loop, ~16 h | one shot, ~40 min |
|---|---|---|
| Game code | 10,415 lines | 4,557 lines |
| Measurement tooling | 4,260 lines | none |
| Screenshots taken | 252 | 0 |
| Verification suites | 8, all passing | 0 |
| Logged play sessions | 30 minutes, machine-recorded | 0 |

It built its own test equipment. One tool simulates half an hour of farming in seconds, no graphics involved, and checks the money grows steadily instead of spiking or stalling. A second one opens the real game in a browser and plays it properly for the full thirty minutes, clicking and typing like a person, logging anything that went wrong: zero rejected clicks, zero waits over twenty seconds, zero errors. A third A/B tests the sound on its own to make sure nothing clipped.

I asked for none of that. You can't answer "is this cosy?" by looking at it, so the loop turned the question into numbers a fresh critic could check.

The first hour already produced a decent game. The next fifteen went into finding what was still wrong with it and fixing it, one gap at a time.

## Where the loop hits its ceiling

**The loop has no taste of its own.** The taste was in the reference folder, screenshots of a game somebody shipped in 2007. Naming that game is the only piece of judgement I contributed, and the run is worth nothing without it. The loop is very good at closing a measurable distance to a target.

You can see the ceiling in the blind A/B, the test the loop graded itself against all night. Two screenshots, labels hidden and just one question: which one is better?

![The blind A/B: the real game beside the generated one](/images/posts/gauntlet-loop-blind-ab.png)

A is [Alice Greenfingers](https://iwin.com/games/alice-greenfingers), made by Arcade Lab in 2007. B is the overnight run. Four panels, twelve independent critic reads. Eleven picked A, most of them in under four seconds. The reasons they gave kept changing, round after round:

> _"Era mismatch, instantly: B is post-Stardew indie pixel art — crisp uniform grid, flat saturated grass, modern sprite hygiene. A has this unique quality"_

By the end the critics weren't saying the art was bad. They were saying it was too clean to be real. The reference has _"an ugly bottom-right mode dial"_ nobody would draw on purpose. A shipped game is full of things that only make sense once you've played it. Our farm looks like a showroom, one of everything, evenly spaced. A farm somebody actually played has empty corners, a half-finished patch, and things placed slightly wrong because a person put them there. Sixteen hours of self-correction converge on _correct_.

## Play them

Both run right here in the page, so you can see the difference for yourself!

Gauntlet loop, sixteen hours. Click a bed to plant an eggplant, click the stall to sell:

<iframe src="/games/alice-loop/index.html" width="320" height="240" title="Alice's Little Farm, built by a Gauntlet loop"></iframe>

The one-shot, forty minutes. Same idea, just have to sleep to get plants to grow:

<iframe src="/games/alice-oneshot/index.html" width="400" height="225" title="Greenfingers, built in a single session"></iframe>

**The loop is also not what made the game good.** Same Opus 5 wrote both. The one-shot above has hand-authored pixel art, a hand-drawn 5×8 bitmap font, synthesised audio, a tutorial, six crops and a working save. Forty minutes of work. It is genuinely fine. The one-shot just stopped. It hit "this works", declared done, and nothing in that session ever told it otherwise.

## What to steal for normal work

You don't need a sixteen-hour run to use any of this. The parts worth trying on regular feature work, bug fixes and refactors:

- **Make "done" inspectable before you start.** A test suite, a reference screenshot, a budget in milliseconds. If the only definition of done lives in the prompt as an adjective, the agent grades itself and passes.
- **Never let the writer review the work.** Spawn a subagent with the goal and the artifact, and nothing else. Not the diff, not the reasoning, not the plan it was following.
- **Ask the critic for one gap, not a list.** Given five problems, a builder fixes the two cheap ones and calls the round a success. Given the biggest one, it has to do the expensive thing.
- **Clear context more often than feels sensible.** A fresh agent with the spec beats an experienced one with a position to defend. This is the same reason [`/clear` and re-paste beats arguing](/blog/what-i-learned-running-3-claude-agents-in-parallel-for-a-week) with a confused session.
- **Add a reconcile pass.** Each agent improves its own piece, so every piece ends up good and none of them match: two names for the same thing, duplicated helpers, a shadow style that changes halfway across the screen. After a wave of parallel work, send one fresh agent over the whole thing to make it consistent again.

## The prompt, in full

<details>
<summary>The exact text I pasted into Claude Code</summary>

```
Build a cosy pixel-art farm game in the spirit of Alice Greenfingers: plant,
water, harvest, sell, reinvest, watch your little farm get nicer. No urgency,
no timers, no fail states, no stamina, no combat, no NPC dating sim. The whole
feeling is a calm economy loop — earn a bit, buy a better thing, see the farm
visibly improve. Stardew Valley is a comp for pixel-art craft only, not for
pace or scope. Runs in the browser, single file build or simple static bundle,
keyboard + mouse.

The bar is two things, and both must be inspectable:
1. Look: put real Alice Greenfingers gameplay screenshots in reference/ (and a
   couple Stardew shots). Critics screenshot our game at the same resolution
   and do a blind A/B — which one reads as a hand-made cosy farm, which reads
   as programmer art. Original sprites only, never copy reference pixels.
2. Feel: write cosy-contract.md yourself, then actually play the game for a
   logged 30-minute session per round. Log coins over time, purchases made,
   and every moment you felt rushed, punished, bored, or confused. Smooth
   growth curve, zero punish moments.

Do not follow an architecture I give you — decide it. Split the goal into the
smallest pieces that can be improved and judged on their own (sprites, tiles,
farm layout, planting feel, shop pacing, economy curve, sound, save, UI,
whatever you find). For each meaningful piece, fan out a builder subagent and a
separate critic subagent with fresh context. Critics inspect real output,
compare directly to the bar, name the single biggest remaining gap, and send it
back. Loop until we win the blind A/B and the session log is clean, or until I
stop you.

Keep a live progress.html I can refresh: current round per piece, latest
screenshots next to the reference, coin curves, and what each critic said last.

Use subagents and ultracode.
```

</details>

No file list, no task breakdown, no acceptance checklist from me. The two lines doing the work are the one that hands over the decomposition, and the one that keeps the builder away from the grading.

## Final thoughts

The loop didn't make the model smarter. It just kept it looking for the next thing wrong. Sixteen hours of that got me a game I kind of want to play (with a few human tweaks coming).

Eleven critics out of twelve still picked the real game, and that's precisely why the loop kept going all night. Pick a target slightly out of reach, make it something a stranger could check, and then get out of the way.

**The Gauntlet loop's real trick is that it takes away the model's ability to be satisfied with itself.**
