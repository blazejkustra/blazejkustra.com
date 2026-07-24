---
title: "React Compiler Marker: Visualizing Optimizations in VSCode/Cursor"
date: "2025-10-05"
description: "A VS Code/Cursor extension that shows directly in your editor which React components were optimized by React Compiler, and why others were not."
canonical: "https://medium.com/@kustrablazej/react-compiler-marker-visualizing-optimizations-in-vscode-cursor-82b0fc96126d"
---

![Visualizing optimizations in your editor](https://cdn-images-1.medium.com/max/1024/1*siRnoizagrMogVIDfosPiA.png)

When you adopt React Compiler (the compile-time optimizer that transforms React code into faster, memoized output), a remaining challenge is *observability*: how do you know which components got optimized, and which didn’t… and why? That’s exactly where [**react-compiler-marker**](https://marketplace.visualstudio.com/items?itemName=blazejkustra.react-compiler-marker) shines.

## 🧩 What It Does

At its core, [**react-compiler-marker**](https://marketplace.visualstudio.com/items?itemName=blazejkustra.react-compiler-marker) is just a [VS Code](https://marketplace.visualstudio.com/items?itemName=blazejkustra.react-compiler-marker)/[Cursor](https://open-vsx.org/extension/blazejkustra/react-compiler-marker) extension that adds visual markers (✨ or 🚫) directly in your editor next to React components. These markers tell you:

- ✅ Component *was* successfully optimized by the React Compiler

![](https://cdn-images-1.medium.com/max/761/1*ZlO3FvsFzG29H06CNmYnbw.png)

*Optimized component*

- ❌ Component *failed* optimization, along with the cause

![](https://cdn-images-1.medium.com/max/761/1*TX2Xj67Fja80nwYvl1LiFA.png)

*Not optimized 😢*

## Why It Matters

React performance tuning often feels like black magic: you optimize, run benchmarks, inspect bundles, hope for better results. With **react-compiler-marker**, you get *immediate feedback* in your editor as you code , no need to waste time in react devtools.

It helps you:

- Spot where the compiler *misses* optimization (e.g. due to closures, references or not following the [**Rules of React**](https://react.dev/reference/rules))
- Learn from failures by reading hover tooltips explaining *why* a component wasn’t optimized
- Iteratively refactor immediately — change code, see the marker shift from “🚫” to “✅”!

## ⚙️ How To Install React Compiler?

Most frameworks like [**Next.js**](https://nextjs.org/docs/app/api-reference/config/next-config-js/reactCompiler) **(14.2+)** or [**Expo SDK 52+**](https://docs.expo.dev/guides/react-compiler/) already ship with React Compiler built-in . You just need to enable it in your config. For example, in Next.js:

```js
// next.config.js
module.exports = {
  experimental: {
    reactCompiler: true,
  },
};
```

If you’re not using a framework, you can add it via Babel:

```bash
npm install -D babel-plugin-react-compiler@rc
```

```js
// babel.config.json
plugins: [
  'babel-plugin-react-compiler', // must run first!
  // ... other plugins
],
```

Once that’s in place, **react-compiler-marker** can start showing you which components are optimized ✨ and which are 🚫.

If you find it useful, consider giving the project a ⭐ on [GitHub](https://github.com/blazejkustra/react-compiler-marker)!
