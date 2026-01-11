import { getDocsData } from "../lib/parse";
import { notFound } from "next/navigation";
import { ContentRenderer } from "../components/ContentRenderer";

export async function generateStaticParams() {
  const sections = getDocsData();
  return sections.map((section) => ({
    slug: section.slug,
  }));
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;
  const sections = getDocsData();
  const section = sections.find((s) => s.slug === slug);

  if (!section) {
    notFound();
  }

  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      <header className="space-y-4 border-b border-gray-200 dark:border-gray-800 pb-8">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
          {section.title.replace(/^[0-9]+\.\s*/, "")}
        </h1>
        {section.intro.length > 0 && (
          <div className="mt-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-4">
              Recommended Learning
            </h3>
            <ContentRenderer
              blocks={section.intro}
              idPrefix={`${section.slug}-intro`}
            />
          </div>
        )}
      </header>

      <div className="space-y-16">
        {section.subsections.map((sub, idx) => (
          <section key={idx} id={sub.slug} className="scroll-mt-20">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#d0a04f]"></span>
              {sub.title}
            </h2>
            <ContentRenderer
              blocks={sub.blocks}
              idPrefix={`${section.slug}-${sub.slug}`}
            />
          </section>
        ))}
      </div>
    </div>
  );
}
