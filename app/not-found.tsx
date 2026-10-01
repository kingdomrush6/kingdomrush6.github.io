import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found",
  description: "The requested guide is not available.",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main className="site-container grid min-h-[65vh] place-items-center py-20 text-center">
      <div>
        <p className="eyebrow">404 · Page not found</p>
        <h1>This Guide Is Not Available</h1>
        <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-muted-foreground">
          This page may have moved. Use the navigation to find heroes, towers, spells and campaign guides.
        </p>
        <Link href="/" className="button-primary mt-8"><ArrowLeft size={18} />Return to Kingdom Rush 6 Guide</Link>
      </div>
    </main>
  );
}
