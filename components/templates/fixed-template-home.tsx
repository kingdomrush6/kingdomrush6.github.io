import { NativeAdSlot } from "@/components/integrations/native-ad-slot";
import { JsonLd } from "@/components/site/json-ld";
import { siteConfig } from "@/config/site";
import type { HomePageDefinition } from "@/config/types";
import { visibleCorePages } from "@/content/registry";
import { renderFixedDocument, esc } from "@/lib/fixed-template/render";
import { sectionsHtml, screenshotsHtml, faqHtml } from "@/lib/fixed-template/sections";
import { homeSchemas } from "@/lib/schema";
import { routePath, assetPath } from "@/lib/urls";

export function FixedTemplateHome({ home }: { home: HomePageDefinition }) {
  const hero = `<section class="guide-hero"><div><p class="kicker">${esc(home.hero.eyebrow)}</p><p class="guide-answer">${esc(home.hero.lead)}</p><p>${esc(home.hero.supportingText)}</p><div class="guide-ctas">${visibleCorePages.filter(p => ["heroes", "towers", "tier-list", "map-stages"].includes(p.slug)).map(p => `<a href="${routePath(p.slug)}">${esc(p.navLabel)}</a>`).join("")}</div></div><img src="${assetPath(siteConfig.assets.cover)}" alt="Kingdom Rush 6: Genesis cover artwork" width="460" height="215" fetchpriority="high"></section>`;
  const rendered = renderFixedDocument({ skin: "editorial", page: "home", accentColorId: siteConfig.theme.accentColorId, gameName: siteConfig.shortName, nav: [], homeHref: "/", heading: home.hero.heading, entries: [], supplementHtml: hero + `<p class="guide-reviewed">Reviewed ${esc(home.lastReviewed)}</p>` + sectionsHtml(home.sections) + screenshotsHtml(home.screenshots) + faqHtml(home.faq, "Kingdom Rush 6 FAQ") });
  return <><JsonLd data={homeSchemas(home)} /><div dangerouslySetInnerHTML={{ __html: rendered.rest }} /><div className="site-container"><NativeAdSlot /></div></>;
}
