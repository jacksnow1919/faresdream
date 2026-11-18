import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { CalendarCheck, CheckCircle2, ExternalLink, Phone, Search } from "lucide-react";
import { guideBySlug, guides } from "@/lib/guides";
import { PageShell, Card, SectionTitle } from "@/components/site/ui";
import { FaqAccordion } from "@/components/site/FaqAccordion";
import { PHONE_DISPLAY, PHONE_TEL } from "@/lib/brand";
import { articleLd, breadcrumbLd, faqLd, jsonLdScript } from "@/lib/structured-data";

const longDate = (iso: string) =>
  new Date(iso + "T12:00:00Z").toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });

export const Route = createFileRoute("/guides/$slug")({
  loader: ({ params }) => {
    const guide = guideBySlug(params.slug);
    if (!guide) throw notFound();
    return { guide };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Guide not found" }, { name: "robots", content: "noindex" }] };
    }
    const g = loaderData.guide;
    const path = `/guides/${g.slug}`;
    return {
      meta: [
        { title: g.metaTitle },
        { name: "description", content: g.description },
        { property: "og:type", content: "article" },
        { property: "og:title", content: g.title },
        { property: "og:description", content: g.description },
        { property: "article:published_time", content: g.published },
        { property: "article:modified_time", content: g.updated },
      ],
      scripts: [
        jsonLdScript([
          articleLd({
            headline: g.title,
            description: g.description,
            path,
            published: g.published,
            updated: g.updated,
            author: g.author,
          }),
          breadcrumbLd([
            { name: "Travel guides", path: "/guides" },
            { name: g.title, path },
          ]),
          faqLd(g.faqs),
        ]),
      ],
    };
  },
  component: GuidePage,
  notFoundComponent: () => (
    <PageShell title="Guide not found">
      <Link to="/guides" className="font-semibold text-navy underline">
        Back to travel guides
      </Link>
    </PageShell>
  ),
});

function GuidePage() {
  const { guide: g } = Route.useLoaderData();
  const others = guides.filter((o) => o.slug !== g.slug).slice(0, 4);

  return (
    <PageShell
      eyebrow="Travel guide"
      title={g.title}
      crumb={g.title}
      parents={[{ label: "Travel guides", href: "/guides" }]}
      subtitle={
        <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span>By {g.author}</span>
          <span aria-hidden="true">·</span>
          <span>
            Updated <time dateTime={g.updated}>{longDate(g.updated)}</time>
          </span>
        </span>
      }
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
        <article className="min-w-0 space-y-6">
          <section
            aria-label="Quick answer"
            className="rounded-2xl border-l-4 border-gold bg-card p-5 shadow-card sm:p-6"
          >
            <p className="text-xs font-bold uppercase tracking-wider text-gold">
              Quick answer
            </p>
            <p className="mt-2 text-[15px] leading-relaxed text-foreground sm:text-base">{g.answer}</p>
          </section>

          <Card>
            <SectionTitle>Key facts</SectionTitle>
            <ul className="mt-3 space-y-2">
              {g.keyFacts.map((f) => (
                <li key={f} className="flex gap-2 text-sm leading-relaxed text-foreground/85">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-600" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </Card>

          {g.table ? (
            <Card>
              <h2 className="font-display text-lg font-bold text-navy">{g.table.caption}</h2>
              <div className="mt-3 overflow-x-auto">
                <table className="w-full min-w-[640px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
                      <th scope="col" className="py-2 pr-3 font-semibold">Route</th>
                      <th scope="col" className="py-2 pr-3 font-semibold">Cheapest month (avg)</th>
                      <th scope="col" className="py-2 pr-3 font-semibold">Priciest months</th>
                      <th scope="col" className="py-2 pr-3 font-semibold">Typical fare</th>
                      <th scope="col" className="py-2 pr-3 font-semibold">Book ahead</th>
                      <th scope="col" className="py-2 font-semibold">Cheapest day</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {g.table.rows.map((r) => (
                      <tr key={r.route}>
                        <th scope="row" className="py-2.5 pr-3 font-semibold text-navy">{r.route}</th>
                        <td className="py-2.5 pr-3">{r.cheapestMonth}</td>
                        <td className="py-2.5 pr-3">{r.priciestMonths}</td>
                        <td className="py-2.5 pr-3">{r.typical}</td>
                        <td className="py-2.5 pr-3">{r.bookAhead}</td>
                        <td className="py-2.5">{r.cheapestDay}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{g.table.note}</p>
            </Card>
          ) : null}

          {g.sections.map((s) => (
            <Card key={s.id}>
              <h2 id={s.id} className="scroll-mt-24 font-display text-lg font-bold text-navy">
                {s.heading}
              </h2>
              {s.paragraphs.map((p) => (
                <p key={p.slice(0, 40)} className="mt-3 text-[15px] leading-relaxed text-foreground/85">
                  {p}
                </p>
              ))}
              {s.bullets ? (
                <ul className="mt-3 list-disc space-y-1.5 pl-5 text-[15px] leading-relaxed text-foreground/85">
                  {s.bullets.map((b) => (
                    <li key={b.slice(0, 40)}>{b}</li>
                  ))}
                </ul>
              ) : null}
            </Card>
          ))}

          <Card>
            <h2 className="font-display text-lg font-bold text-navy">Frequently asked questions</h2>
            <div className="mt-3">
              <FaqAccordion items={g.faqs} />
            </div>
          </Card>

          <Card>
            <h2 className="font-display text-lg font-bold text-navy">Sources</h2>
            <ul className="mt-3 space-y-2 text-sm">
              {g.sources.map((s) => (
                <li key={s.url}>
                  <a
                    href={s.url}
                    rel="nofollow noopener"
                    target="_blank"
                    className="inline-flex items-center gap-1 font-medium text-navy underline underline-offset-2"
                  >
                    {s.label} <ExternalLink className="size-3.5" />
                  </a>
                  <span className="text-muted-foreground"> · checked {longDate(s.checked)}</span>
                </li>
              ))}
            </ul>
          </Card>
        </article>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <Card>
            <p className="font-display text-base font-bold text-navy">Ready to compare fares?</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Search every airline at once, or talk to an agent about fares that aren't online.
            </p>
            <Link
              to="/"
              className="mt-4 flex items-center justify-center gap-2 rounded-full bg-gold px-4 py-2.5 text-sm font-bold text-gold-foreground transition hover:brightness-110"
            >
              <Search className="size-4" /> Search flights
            </Link>
            <a
              href={`tel:${PHONE_TEL}`}
              className="mt-2 flex items-center justify-center gap-2 rounded-full border border-navy/20 px-4 py-2.5 text-sm font-bold text-navy transition hover:bg-navy/5"
            >
              <Phone className="size-4" /> {PHONE_DISPLAY}
            </a>
          </Card>
          <Card>
            <p className="flex items-center gap-2 font-display text-base font-bold text-navy">
              <CalendarCheck className="size-4 text-gold" /> In this guide
            </p>
            <ul className="mt-2 space-y-1.5 text-sm">
              {g.sections.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="text-foreground/80 hover:text-navy hover:underline">
                    {s.heading}
                  </a>
                </li>
              ))}
            </ul>
          </Card>
          <Card>
            <p className="font-display text-base font-bold text-navy">Related</p>
            <ul className="mt-2 space-y-1.5 text-sm">
              {g.related.map((r) => (
                <li key={r.href}>
                  <a href={r.href} className="font-medium text-navy hover:underline">
                    {r.label}
                  </a>
                </li>
              ))}
              {others.map((o) => (
                <li key={o.slug}>
                  <Link to="/guides/$slug" params={{ slug: o.slug }} className="font-medium text-navy hover:underline">
                    {o.title}
                  </Link>
                </li>
              ))}
            </ul>
          </Card>
        </aside>
      </div>
    </PageShell>
  );
}
