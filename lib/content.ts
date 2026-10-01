import type { HomePageDefinition, PageSection, SeoPageDefinition } from "@/config/types";

function tableText(table?: import("@/config/types").DataTable) {
  return table ? [table.caption, ...table.columns, ...table.rows.flat()].join("\n") : "";
}

function sectionText(section: PageSection) {
  const parts = [section.heading, section.intro, ...(section.paragraphs ?? [])];
  for (const subsection of section.subsections ?? []) {
    parts.push(subsection.heading, ...subsection.paragraphs, ...(subsection.bullets ?? []));
  }
  parts.push(tableText(section.table));
  for (const sub of section.subsections ?? []) parts.push(tableText(sub.table));
  for (const link of [...(section.links ?? []), ...(section.externalLinks ?? [])]) parts.push(link.label, "description" in link ? link.description : "");
  for (const step of section.steps ?? []) parts.push(step.heading, step.description);
  return parts.filter(Boolean).join("\n");
}

export function pagePlainText(page: HomePageDefinition | SeoPageDefinition) {
  const heroLead = page.hero.lead;
  const supporting = "supportingText" in page.hero ? page.hero.supportingText : "";
  const sections = page.sections.map(sectionText);
  const faq = (page.faq ?? []).flatMap((item) => [item.question, item.answer]);
  return [page.title, page.description, page.hero.heading, heroLead, supporting, ...sections, ...faq].join("\n");
}

export function wordCount(text: string) {
  return text.toLowerCase().match(/[a-z0-9]+(?:['-][a-z0-9]+)*/g)?.length ?? 0;
}

export function termCount(text: string, term: string) {
  const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return (text.match(new RegExp(`\\b${escaped}\\b`, "gi")) ?? []).length;
}
