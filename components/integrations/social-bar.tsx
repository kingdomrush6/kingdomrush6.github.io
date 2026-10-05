"use client";

import Script from "next/script";
import { socialBarUrl } from "@/config/adsterra";

export function SocialBar() {
  // Root layout persists on navigation; Next also caches this script id/src.
  return <Script id="adsterra-social-bar" src={socialBarUrl} strategy="afterInteractive" />;
}
