"use client";

import { useEffect, useRef } from "react";
import { desktopBannerCode, mobileBannerCode } from "@/config/adsterra";

export function ResponsiveBanner() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    // Select once per visit: resizing must not execute a second ad unit.
    const mobile = !window.matchMedia("(min-width: 768px)").matches;
    const slot = host.closest<HTMLElement>("[data-ad-placement]");
    let active = true;
    let observer: MutationObserver | undefined;
    let frame: HTMLIFrameElement | undefined;
    let timer: ReturnType<typeof setTimeout> | undefined;

    // React Strict Mode's discarded effect must not request an ad.
    queueMicrotask(() => {
      if (!active) return;
      frame = document.createElement("iframe");
      frame.title = "Advertisement";
      frame.width = mobile ? "320" : "728";
      frame.height = mobile ? "50" : "90";
      frame.className = "adsterra-banner-frame";
      frame.dataset.bannerSize = mobile ? "320x50" : "728x90";
      // Isolate atOptions and the official parser-executed GET CODE in an
      // ad document; provider document.write cannot replace the site page.
      frame.srcdoc = `<!doctype html><html><head><meta name="viewport" content="width=device-width, initial-scale=1"><style>html,body{margin:0;padding:0;overflow:hidden}</style></head><body>${mobile ? mobileBannerCode : desktopBannerCode}</body></html>`;
      frame.onload = () => {
        if (!active || !frame) return;
        const body = frame.contentDocument?.body;
        if (!body) return;
        const check = () => {
          const creative = body.querySelector("iframe, img, object, embed, video");
          const filled = !!creative && creative.getBoundingClientRect().height > 0;
          if (slot) slot.dataset.adState = filled ? "filled" : "empty";
        };
        observer = new MutationObserver(check);
        observer.observe(body, { childList: true, subtree: true, attributes: true });
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
      if (frame) frame.onload = null;
      host.replaceChildren();
    };
  }, []);

  return <div className="adsterra-slot" aria-label="Advertisement">
    <span className="adsterra-label">Advertisement</span>
    <div ref={hostRef} className="adsterra-banner-host" />
  </div>;
}
