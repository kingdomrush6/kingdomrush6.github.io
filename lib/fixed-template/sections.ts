import type { PageSection, DataTable, ScreenshotItem, FaqItem } from "@/config/types";
import { assetPath, routePath } from "@/lib/urls";
import { esc } from "./render";

function tableHtml(table: DataTable) {
  return `<div class="guide-table" tabindex="0" role="region" aria-label="${esc(table.caption)}"><table><caption>${esc(table.caption)}</caption><thead><tr>${table.columns.map(c => `<th scope="col">${esc(c)}</th>`).join("")}</tr></thead><tbody>${table.rows.map(row => `<tr>${row.map(c => `<td>${esc(c)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
}
const paragraphs = (items: string[] = []) => items.map(p => `<p>${esc(p)}</p>`).join("");
export function sectionsHtml(sections: PageSection[]) {
  return sections.map(s => `<section id="${esc(s.id)}"><h2>${esc(s.heading)}</h2>${s.intro ? paragraphs([s.intro]) : ""}${paragraphs(s.paragraphs)}${(s.subsections ?? []).map(sub => `<div class="guide-subsection"><h3>${esc(sub.heading)}</h3>${paragraphs(sub.paragraphs)}${sub.bullets?.length ? `<ul>${sub.bullets.map(b => `<li>${esc(b)}</li>`).join("")}</ul>` : ""}${sub.table ? tableHtml(sub.table) : ""}</div>`).join("")}${s.table ? tableHtml(s.table) : ""}${s.steps?.length ? `<ol>${s.steps.map(step => `<li><h3>${esc(step.heading)}</h3><p>${esc(step.description)}</p></li>`).join("")}</ol>` : ""}${s.links?.length ? `<div class="guide-links">${s.links.map(l => `<a href="${esc(routePath(l.slug))}"><strong>${esc(l.label)}</strong>${l.description ? `<span>${esc(l.description)}</span>` : ""}</a>`).join("")}</div>` : ""}${s.externalLinks?.length ? `<div class="guide-links">${s.externalLinks.map(l => `<a href="${esc(l.url)}" rel="noopener noreferrer">${esc(l.label)}</a>`).join("")}</div>` : ""}</section>`).join("");
}
export function screenshotsHtml(shots: ScreenshotItem[] = []) {
  return shots.map(s => `<figure><img src="${esc(assetPath(s.src))}" alt="${esc(s.alt)}" width="1200" height="675" loading="lazy">${s.caption ? `<figcaption>${esc(s.caption)}</figcaption>` : ""}</figure>`).join("");
}
export function faqHtml(items: FaqItem[] = [], heading = "Frequently Asked Questions") {
  return items.length ? `<section id="faq"><h2>${esc(heading)}</h2>${items.map(f => `<details class="guide-faq"><summary>${esc(f.question)}</summary><p>${esc(f.answer)}</p></details>`).join("")}</section>` : "";
}
