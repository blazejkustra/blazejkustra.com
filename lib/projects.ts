export type Project = {
  title: string;
  description: string;
  meta: string;
  href: string;
  image?: string;
  video?: string;
  aspect: string;
};

export const projects: Project[] = [
  {
    title: "CookinBuddy",
    description: "Your magical kitchen sidekick — recipes, groceries & AI chef for iOS",
    meta: "2026 · iOS app",
    href: "https://www.cookinbuddy.com/",
    video: "/projects/cookinbuddy.mp4",
    aspect: "1328 / 720",
  },
  {
    title: "Purrkour",
    description: "A cozy cat parkour puzzle game for iOS and the browser",
    meta: "2026 · iOS & web game",
    href: "https://blazejkustra.github.io/purrkour/",
    video: "/projects/purrkour.mp4",
    aspect: "1280 / 776",
  },
  {
    title: "react-compiler-marker",
    description: "IDE extension visualizing which components React Compiler optimizes",
    meta: "2025 · 448★ on GitHub",
    href: "https://github.com/blazejkustra/react-compiler-marker",
    image: "/projects/react-compiler-marker-showcase.png",
    aspect: "1622 / 866",
  },
  {
    title: "react-native-effects",
    description: "WebGPU-powered shader effects for React Native, on a separate thread",
    meta: "2026 · 233★ on GitHub",
    href: "https://github.com/blazejkustra/react-native-effects",
    video: "/projects/react-native-effects.mp4",
    aspect: "1280 / 720",
  },
  {
    title: "react-native-pretty-toast",
    description: "Dynamic Island-aware toasts for React Native on iOS, Android and Web",
    meta: "2026 · 117★ on GitHub",
    href: "https://github.com/blazejkustra/react-native-pretty-toast",
    video: "/projects/react-native-pretty-toast.mp4",
    aspect: "1280 / 720",
  },
  {
    title: "react-native-morph-view",
    description: "Morph one image into another with a smooth gooey effect",
    meta: "2026 · 117★ on GitHub",
    href: "https://github.com/blazejkustra/react-native-morph-view",
    video: "/projects/react-native-morph-view.mp4",
    aspect: "1280 / 720",
  },
  {
    title: "lego-sorting-machine",
    description: "AI LEGO sorting machine prototype using computer vision",
    meta: "2024 · 25★ on GitHub",
    href: "https://github.com/blazejkustra/lego-sorting-machine",
    video: "/projects/lego-sorting-machine.mp4",
    aspect: "560 / 340",
  },
];
