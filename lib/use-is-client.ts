"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/**
 * False during SSR and the first render, true afterwards. For the handful of
 * things that only exist in a browser (portals, the Fullscreen API) without
 * setting state from an effect.
 */
export function useIsClient() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
