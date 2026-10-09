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

    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext("2d");

    if (ctx) {
      ctx.beginPath();
      ctx.arc(32, 32, 28, 0, 2 * Math.PI);
      ctx.fillStyle = color;
      ctx.fill();

      const href = canvas.toDataURL("image/png");

      let link = document.querySelector<HTMLLinkElement>("link[rel='icon']");
      if (!link) {
        link = document.createElement("link");
        link.rel = "icon";
        document.head.appendChild(link);
      }
      link.type = "image/png";
      link.href = href;

      let appleLink = document.querySelector<HTMLLinkElement>("link[rel='apple-touch-icon']");
      if (!appleLink) {
        appleLink = document.createElement("link");
        appleLink.rel = "apple-touch-icon";
        document.head.appendChild(appleLink);
      }
      appleLink.href = href;
    }
  }, [mode]);
}