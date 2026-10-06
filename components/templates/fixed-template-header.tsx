"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { siteConfig } from "@/config/site";
import type { InternalLink } from "@/config/types";
import { assetPath, routePath } from "@/lib/urls";

export function FixedTemplateHeader({ links }: { links: InternalLink[] }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const item = (link: InternalLink) => <Link key={link.slug} href={routePath(link.slug)} aria-current={pathname?.replace(/\/$/, "") === routePath(link.slug).replace(/\/$/, "") ? "page" : undefined} onClick={() => setOpen(false)}>{link.label}</Link>;
  return <><div className="guide-topline" /><header className="guide-header"><div className="guide-head">
    <Link className="guide-brand" href="/" onClick={() => setOpen(false)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={assetPath(siteConfig.assets.logo)} alt="" width="40" height="40" />Kingdom Rush <span>6</span>
    </Link>
    <button className="guide-toggle" aria-controls="guide-mobile-nav" aria-expanded={open} onClick={() => setOpen(!open)}>{open ? "Close menu" : "Menu"}</button>
    <nav className="guide-desktop-nav" aria-label="Primary navigation">{links.slice(0, 4).map(item)}<details className="guide-more"><summary>More</summary><div>{links.slice(4).map(item)}</div></details></nav>
  </div><nav id="guide-mobile-nav" className="guide-mobile-nav" aria-label="Mobile navigation" hidden={!open}>{links.map(item)}</nav></header></>;
}
