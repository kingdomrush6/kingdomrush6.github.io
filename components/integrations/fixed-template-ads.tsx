"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { NativeAdClient } from "./native-ad-client";
import { ResponsiveBanner } from "./responsive-banner";

export function FixedTemplateAds() {
  const [slots, setSlots] = useState<{ banner: HTMLElement; native: HTMLElement } | null>(null);

  useEffect(() => {
    let active = true;
    queueMicrotask(() => {
      if (!active) return;
      const banner = document.getElementById("adsterra-banner-slot");
      const native = document.getElementById("adsterra-native-slot");
      if (banner && native) setSlots({ banner, native });
    });
    return () => { active = false; };
  }, []);

  if (!slots) return null;
  return <>
    {createPortal(<ResponsiveBanner />, slots.banner)}
    {createPortal(<NativeAdClient />, slots.native)}
  </>;
}
