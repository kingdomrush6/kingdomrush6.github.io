import { FixedTemplateAds } from "@/components/integrations/fixed-template-ads";
import { bannerPlacement, nativePlacement } from "@/lib/fixed-template/ad-placements";
import { JsonLd } from "@/components/site/json-ld";
import { siteConfig } from "@/config/site";
import type { SeoPageDefinition } from "@/config/types";
import { getRelatedPages, visibleCorePages } from "@/content/registry";
import { esc, renderFixedDocument } from "@/lib/fixed-template/render";
import { sectionsHtml, screenshotsHtml, faqHtml } from "@/lib/fixed-template/sections";
import { pageSchemas } from "@/lib/schema";
import { routePath } from "@/lib/urls";

export function FixedTemplateInner({ page }: { page: SeoPageDefinition }) {
  const related = getRelatedPages(page);
  const toc = `<details class="guide-toc" open><summary>On this page</summary><nav aria-label="Table of contents">${page.sections.map(s => `<a href="#${esc(s.id)}">${esc(s.heading)}</a>`).join("")}${page.faq?.length ? '<a href="#faq">FAQ</a>' : ""}</nav></details>`;
  const articleHtml = `<p class="guide-answer">${esc(page.hero.lead)}</p>${bannerPlacement}<p class="guide-reviewed">Reviewed ${esc(page.lastReviewed)} · Editorial Team</p>${nativePlacement}${sectionsHtml(page.sections.slice(0, 1))}${toc}${sectionsHtml(page.sections.slice(1))}${screenshotsHtml(page.screenshots)}${faqHtml(page.faq, `${page.hero.heading} FAQ`)}${related.length ? `<section id="related"><h2>Related Guides</h2><div class="guide-links">${related.map(p => `<a href="${routePath(p.slug)}">${esc(p.navLabel)}</a>`).join("")}</div></section>` : ""}`;
  const rendered = renderFixedDocument({ skin: "editorial", page: "inner", accentColorId: siteConfig.theme.accentColorId, gameName: siteConfig.shortName, nav: visibleCorePages.map(p => ({slug:p.slug, label:p.navLabel, href:routePath(p.slug)})), currentSlug: page.slug, homeHref: "/", heading: page.hero.heading, articleHtml });
  return <><JsonLd data={pageSchemas(page)} /><div dangerouslySetInnerHTML={{ __html: rendered.rest }} /><FixedTemplateAds key={page.slug} /></>;
}
