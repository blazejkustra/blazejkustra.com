---
title: "What I Learned Running 3 Claude Agents in Parallel for a Week"
date: "2026-04-08"
description: "Three projects, three agents, one week, and a lot of unexpected lessons from shipping three open-source React Native libraries with parallel Claude Code agents."
canonical: "https://swmansion.com/blog/what-i-learned-running-3-claude-agents-in-parallel-for-a-week/"
---

![Three code editor windows with Android icons](/images/posts/running-3-claude-agents-in-parallel.png)

Three projects, three agents, one week, and a lot of lessons I didn't expect.

A month ago, I shipped three open-source React Native libraries. Not one at a time over months, all three in a single week, each built with its own Claude Code agent running in parallel. Here's what that actually looked like.

## What I built

Before I get into the process, here's what came out of it:

- [**react-native-3d**](https://github.com/blazejkustra/react-native-3d): a lightweight component for displaying 3D models using WebGPU directly, no three.js included. The real trick? Everything runs on a background thread using the brand-new [Bundle Mode](https://docs.swmansion.com/react-native-worklets/docs/bundleMode) from `react-native-worklets`, so neither the JS nor the UI thread takes a hit.
- [**react-native-effects**](https://github.com/blazejkustra/react-native-effects): a ready-made toolkit for creating visual effects, animations, and animated backgrounds. Like react-native-3d, it runs entirely on a background thread thanks to `react-native-worklets`.
- [**blaze-navigation**](https://github.com/blazejkustra/blaze-navigation): an alternative to react-navigation and expo-router, built directly on native primitives from `react-native-screens`. The goal was partly practical, partly educational – I wanted to dig into how screens really work under the hood.

All three of these deal with experimental APIs, undocumented flags, and cutting-edge React Native features. I wanted to prove that AI agents can handle conceptually hard problems and not just boilerplate CRUD apps.

## The parallel workflow

_Always start with one agent._ When you notice you're mostly waiting for it to finish, spin up a second. When you still have pauses, that's when you add more.

The early hours were incredible. While one agent was grinding through implementation, I'd switch to another terminal and draft the action plan for the next project. Within a surprisingly short time, I had all three projects scaffolded with codebases in an early but functional state. But this honeymoon phase doesn't last. The real lessons started when bugs started popping up and things got complicated.

## The human side nobody talks about

Here's something nobody prepares you for: **sometimes all three AI agents finish their tasks, and you're still deep in a prompting session with one of them or trying to fix issues.** All agents are idle, waiting, and you feel this weird pressure, like you're falling behind your own AI team… Don't be hard on yourself when this happens. You're still the bottleneck sometimes, and that's completely fine. I also have a habit of writing short prompts with a lot of mental shortcuts and typos. This sometimes made the agent misinterpret what I meant. When that happens, don't fight it. Instead just `/clear` the context and paste your initial prompt again, or copy the relevant parts of the plan that you know are good.

**Starting fresh beats a confused conversation every time.**

## Treat the agent like a new colleague

The best mental model I found: think of the agent as a talented colleague who just joined the team. They're smart and eager but they don't know your codebase yet. Speak in natural language. Explain the context. Don't be afraid to explain why you're doing something a certain way. The more you treat the agent like a human teammate, the better it performs.

My projects used experimental features, the new [Bundle Mode](https://docs.swmansion.com/react-native-worklets/docs/bundleMode) from `react-native-worklets`, and experimental Tabs and Stacks implementations from `react-native-screens`. When you're working with bleeding-edge APIs, don't assume the agent has seen the docs. Find the right pages, paste the URLs, or even copy the relevant sections directly into the prompt.

## The practical setup that actually matters

Some things sound like minor details but they completely change the experience:

- **Use a dedicated terminal.** I use [Warp](https://www.warp.dev/), but [Ghostty](https://ghostty.org/) is another great option. I avoid running agents inside VSCode's terminal. I sometimes have to reload the window, which kills the agent sessions too. Losing an agent mid-task because your editor restarted is incredibly frustrating.
- **Skip the permission prompts.** When you're juggling three agents, every unnecessary confirmation dialog is a context switch that breaks your flow. The `--dangerously-skip-permissions` flag, or the newer [Auto Mode](https://code.claude.com/docs/en/permission-modes#eliminate-prompts-with-auto-mode) will save you from endless clicking.
- **Start from a proven template.** Don't make the AI waste cycles verifying that the base setup works. Start with a template you know is solid, so the agent can focus on the actual problem.
- **Use git worktrees for parallel work in one repo.** Start Claude with the `--worktree` option. When you're done, create a PR and the worktree gets cleaned up automatically. It's the cleanest way to parallelize work in a single repository.

## Test-driven development is back

While building `blaze-navigation`, I tried something I hadn't done with an agent before: [Red/Green TDD](https://agentic-engineering.swmansion.com/becoming-productive/prompting-techniques/#redgreen-tdd). Write the tests first, watch them all fail (red), then let the agent implement functionality and run the test suite on every iteration until everything passes (green).

My first attempt at building the navigation system was without TDD and the result was very inconsistent and the system full of bugs. With the Red/Green approach, the agent got almost everything right in a single pass. The tests acted as a specification, a guardrail, and a verification loop all at once. The agent knew exactly what "done" looked like and could self-correct without me stepping in.

## TL;DR

- **Start with one agent, scale up as you find idle time.**
- **Start from a proven template**, don't waste agent time on boilerplate validation.
- **Make changes testable in a loop** so the agent can self-verify.
- **Use a dedicated terminal** (Warp, Ghostty) — not VS Code's integrated one.
- **Plan thoroughly at the beginning.** Read and refine it carefully. Later plans can be lighter.
- **Link documentation directly** when working with experimental APIs.
- **You're still a dev.** Edit code manually when needed.
- **Be kind to yourself.** You'll be the bottleneck sometimes and that's fine.
- **Skip permissions or use auto mode** to reduce friction across multiple agents.
- **Git worktrees** let you parallelize within a single repo cleanly.
- **Red/Green TDD transforms agent output quality**. Write failing tests with agent first.

## Final thoughts

Running three agents in parallel for a week was intense. I typed prompts so fast they were barely English, but at the end of the week I had three open-source libraries ready to publish, all pushing into territory that most people assume AI can't handle yet.

_It can._ You just have to know how to work with it. If you want to deep dive into agentic engineering, I'd strongly recommend our [Agentic Engineering Guide](https://agentic-engineering.swmansion.com/). We've compressed months of AI development learnings into a single resource that is practical, honest, and useful no matter your current level.

At [Software Mansion](https://swmansion.com/), we're committed to staying ahead of the game. Building with AI isn't just a nice-to-have for us, it's become core to how we work. If your team needs help to get up to speed, or if you want to collaborate on something exciting, [get in touch](https://swmansion.com/contact)!