import { useLayoutEffect } from "react";
import { modeStyles } from "../lib/consts";
import type { BreathMode } from "../lib/types";

export function useFavicon(mode: BreathMode) {
  useLayoutEffect(() => {
    const probe = document.createElement("div");
    probe.className = modeStyles[mode].bgPrimary;
    probe.style.position = "fixed";
    probe.style.visibility = "hidden";
    probe.style.pointerEvents = "none";
    document.body.appendChild(probe);

    const color = getComputedStyle(probe).backgroundColor;
    document.body.removeChild(probe);

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
    <circle cx="16" cy="16" r="14" fill="${color}" /></svg>`;
    const href = `data:image/svg+xml,${encodeURIComponent(svg)}`;

    let link = document.querySelector<HTMLLinkElement>("link[rel='icon']");
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }
    link.href = href;
  }, [mode]);
}