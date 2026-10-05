"use client";

import { useEffect, useRef } from "react";
import { nativeAdCode } from "@/config/adsterra";

export function NativeAdClient() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const slot = host.closest<HTMLElement>("[data-ad-placement]");
    let active = true;
    let frame: HTMLIFrameElement | undefined;
    let observer: MutationObserver | undefined;
    let resizeObserver: ResizeObserver | undefined;
    let timer: ReturnType<typeof setTimeout> | undefined;

    queueMicrotask(() => {
      if (!active) return;
      frame = document.createElement("iframe");
      frame.title = "Native advertisement";
      frame.className = "adsterra-native-frame";
      frame.height = "0";
      // Keep the official GET CODE intact. Each visit has its own document,
      // so a late response from an old route cannot populate the new slot.
      frame.srcdoc = `<!doctype html><html><head><meta name="viewport" content="width=device-width, initial-scale=1"><style>html,body{margin:0;padding:0}</style></head><body>${nativeAdCode}</body></html>`;
      frame.onload = () => {
        if (!active || !frame) return;
        const body = frame.contentDocument?.body;
        const container = body?.querySelector<HTMLElement>("[id^='container-']");
        if (!body || !container) return;
        const check = () => {
          if (!frame || !active) return;
          const height = Math.ceil(container.getBoundingClientRect().height);
          const filled = container.childElementCount > 0 && height > 0;
          frame.height = String(filled ? height : 0);
          if (slot) slot.dataset.adState = filled ? "filled" : "empty";
        };
        observer = new MutationObserver(check);
        observer.observe(body, { childList: true, subtree: true, attributes: true });
        resizeObserver = new ResizeObserver(check);
        resizeObserver.observe(container);
        check();
      };
      host.appendChild(frame);
      timer = setTimeout(() => {
        if (slot && slot.dataset.adState !== "filled") slot.dataset.adState = "empty";
      }, 12000);
    });

    return () => {
      active = false;
      clearTimeout(timer);
      observer?.disconnect();
      resizeObserver?.disconnect();
      if (frame) frame.onload = null;
      host.replaceChildren();
    };
  }, []);

  return <div className="adsterra-slot adsterra-native" aria-label="Advertisement">
    <span className="adsterra-label">Advertisement</span>
    <div ref={hostRef} data-native-ad-slot />
  </div>;
}
