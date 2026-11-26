import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  Building2,
  CalendarCheck,
  CalendarDays,
  CalendarRange,
  CheckCircle2,
  ChevronRight,
  Clock,
  ExternalLink,
  HelpCircle,
  Lightbulb,
  ListChecks,
  Phone,
  Plane,
  Search,
  ShieldCheck,
  Sparkles,
  UserRound,
} from "lucide-react";
import { FareCalendar, GuideStatTiles, MonthlyFareChart } from "@/components/site/GuideVisuals";
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
        ...(g.photo ? [{ property: "og:image", content: g.photo }] : []),
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
  const rows = g.table?.rows ?? [];
  const hasChart = rows.some((r) => r.monthly?.length === 12);
  const place = g.title.replace(/^Cheapest Time to Fly to /, "").replace(/ from the USA$/, "");

  return (
    <PageShell
      eyebrow="Travel guide"
      title={g.title}
      crumb={g.title}
      photo={g.photo}
      parents={[{ label: "Travel guides", href: "/guides" }]}
      subtitle={
        <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="inline-flex items-center gap-1.5">
            <UserRound className="size-4" aria-hidden="true" /> {g.author}
          </span>
          <span aria-hidden="true">·</span>
          <span className="inline-flex items-center gap-1.5">
            <CalendarCheck className="size-4" aria-hidden="true" /> Updated{" "}
            <time dateTime={g.updated}>{longDate(g.updated)}</time>
          </span>
          {rows.length ? (
            <>
              <span aria-hidden="true">·</span>
              <span className="inline-flex items-center gap-1.5">
                <Plane className="size-4" aria-hidden="true" /> {rows.length} routes compared
              </span>
            </>
          ) : null}
        </span>
      }
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
        <article className="min-w-0 space-y-6">
          <section
            aria-label="Quick answer"
            className="relative overflow-hidden rounded-2xl bg-linear-to-br from-navy to-primary p-5 text-white shadow-card sm:p-7"
          >
            <Lightbulb aria-hidden="true" className="absolute -right-4 -top-4 size-28 text-white/10" />
            <p className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="size-3.5" aria-hidden="true" /> Quick answer
            </p>
            <p className="relative mt-3 text-base leading-relaxed sm:text-lg">{g.answer}</p>
          </section>

          {hasChart ? <GuideStatTiles rows={rows} /> : null}

          {hasChart ? (
            <MonthlyFareChart rows={rows} title={`Flight prices to ${place} by month`} />
          ) : null}

          <Card>
            <SectionTitle>Key facts</SectionTitle>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {g.keyFacts.map((f) => (
                <li key={f} className="flex gap-3 rounded-xl bg-secondary/60 p-3 text-sm leading-relaxed text-foreground/85">
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-600" aria-hidden="true" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </Card>

          {hasChart ? (
            <FareCalendar rows={rows} title={`${place} fare calendar: every route, every month`} />
          ) : null}

          {g.table ? (
            <Card>
              <h2 className="font-display text-lg font-bold text-navy">{g.table.caption}</h2>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full min-w-[860px] text-left text-sm">
                  <thead>
                    <tr className="bg-secondary text-xs uppercase tracking-wide text-muted-foreground">
                      <th scope="col" className="rounded-l-lg px-3 py-2.5 font-semibold">Route</th>
                      <th scope="col" className="px-3 py-2.5 font-semibold">Cheapest month (avg)</th>
                      <th scope="col" className="px-3 py-2.5 font-semibold">Priciest months</th>
                      <th scope="col" className="px-3 py-2.5 font-semibold">{g.table.typicalLabel ?? "Typical fare"}</th>
                      <th scope="col" className="px-3 py-2.5 font-semibold">Book ahead</th>
                      <th scope="col" className="rounded-r-lg px-3 py-2.5 font-semibold">Cheapest day</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {g.table.rows.map((r) => (
                      <tr key={r.route} className="transition hover:bg-secondary/40">
                        <th scope="row" className="min-w-[200px] px-3 py-3 font-semibold text-navy">
                          <span className="inline-flex items-center gap-2">
                            <span className="grid size-7 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
                              <Plane className="size-3.5" aria-hidden="true" />
                            </span>
                            {r.route}
                          </span>
                        </th>
                        <td className="px-3 py-3">
                          <span className="inline-block whitespace-nowrap rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-800">
                            {r.cheapestMonth}
                          </span>
                        </td>
                        <td className="px-3 py-3">
                          <span className="inline-block whitespace-nowrap rounded-full bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-800">
                            {r.priciestMonths}
                          </span>
                        </td>
                        <td className="px-3 py-3 font-medium">{r.typical}</td>
                        <td className="px-3 py-3">{r.bookAhead}</td>
                        <td className="px-3 py-3 font-medium">{r.cheapestDay}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{g.table.note}</p>
            </Card>
          ) : null}

          <section className="flex flex-col items-start gap-4 rounded-2xl bg-linear-to-r from-gold/15 via-gold/5 to-transparent p-5 ring-1 ring-gold/30 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div>
              <p className="font-display text-lg font-bold text-navy">Found your month? Check today's fares.</p>
              <p className="mt-0.5 text-sm text-muted-foreground">
                Compare airlines in seconds, or call for fares that aren't shown online.
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap gap-2">
              <Link
                to="/"
                search={g.searchTo ? { to: g.searchTo } : {}}
                className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-sm font-bold text-gold-foreground transition hover:brightness-110"
              >
                <Search className="size-4" aria-hidden="true" /> Search flights
              </Link>
              <a
                href={`tel:${PHONE_TEL}`}
                className="inline-flex items-center gap-2 rounded-full border border-navy/20 bg-card px-5 py-2.5 text-sm font-bold text-navy transition hover:bg-navy/5"
              >
                <Phone className="size-4" aria-hidden="true" /> {PHONE_DISPLAY}
              </a>
            </div>
          </section>

          {g.sections.map((s) => {
            const Icon = sectionIcon(s.heading);
            return (
              <Card key={s.id}>
                <div className="flex items-center gap-3">
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <h2 id={s.id} className="scroll-mt-24 font-display text-lg font-bold text-navy">
                      {s.heading}
                    </h2>
                  </div>
                </div>
                {s.paragraphs.map((p) => (
                  <p key={p.slice(0, 40)} className="mt-3 text-[15px] leading-relaxed text-foreground/85">
                    {p}
                  </p>
                ))}
                {s.bullets ? (
                  <ul className="mt-4 space-y-2">
                    {s.bullets.map((b) => (
                      <li
                        key={b.slice(0, 40)}
                        className="flex gap-2.5 rounded-xl border border-border px-3 py-2.5 text-[15px] leading-relaxed text-foreground/85"
                      >
                        <ChevronRight className="mt-1 size-4 shrink-0 text-gold" aria-hidden="true" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </Card>
            );
          })}

          <Card>
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-xl bg-gold/15 text-gold">
                <HelpCircle className="size-5" aria-hidden="true" />
              </span>
              <h2 className="font-display text-lg font-bold text-navy">Frequently asked questions</h2>
            </div>
            <div className="mt-3">
              <FaqAccordion items={g.faqs} />
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-xl bg-secondary text-navy">
                <ShieldCheck className="size-5" aria-hidden="true" />
              </span>
              <div>
                <h2 className="font-display text-lg font-bold text-navy">Sources</h2>
                <p className="text-xs text-muted-foreground">Every fare on this page comes from these pages.</p>
              </div>
            </div>
            <ul className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
              {g.sources.map((s) => (
                <li key={s.url} className="rounded-xl bg-secondary/60 px-3 py-2">
                  <a
                    href={s.url}
                    rel="nofollow noopener"
                    target="_blank"
                    className="inline-flex items-center gap-1 font-medium text-navy underline underline-offset-2"
                  >
                    {s.label} <ExternalLink className="size-3.5" aria-hidden="true" />
                  </a>
                  <span className="block text-xs text-muted-foreground">Checked {longDate(s.checked)}</span>
                </li>
              ))}
            </ul>
          </Card>
          {g.authorBio ? (
            <Card>
              <div className="flex items-start gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-secondary text-navy">
                  <UserRound className="size-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">About the author</p>
                  <h2 className="font-display text-lg font-bold text-navy">{g.author}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">{g.authorBio}</p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Published <time dateTime={g.published}>{longDate(g.published)}</time> · Last checked{" "}
                    <time dateTime={g.updated}>{longDate(g.updated)}</time> ·{" "}
                    <Link to="/about" className="font-semibold text-navy underline underline-offset-2">
                      About FaresDream
                    </Link>
                  </p>
                </div>
              </div>
            </Card>
          ) : null}
        </article>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <div className="overflow-hidden rounded-2xl bg-navy text-white shadow-card">
            <div className="p-5">
              <p className="font-display text-lg font-bold">Ready to compare fares?</p>
              <p className="mt-1 text-sm text-white/80">
                Search every airline at once, or talk to an agent about fares that aren't online.
              </p>
              <Link
                to="/"
                search={g.searchTo ? { to: g.searchTo } : {}}
                className="mt-4 flex items-center justify-center gap-2 rounded-full bg-gold px-4 py-2.5 text-sm font-bold text-gold-foreground transition hover:brightness-110"
              >
                <Search className="size-4" aria-hidden="true" /> Search flights
              </Link>
              <a
                href={`tel:${PHONE_TEL}`}
                className="mt-2 flex items-center justify-center gap-2 rounded-full border border-white/30 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-white/10"
              >
                <Phone className="size-4" aria-hidden="true" /> {PHONE_DISPLAY}
              </a>
            </div>
            <p className="bg-white/10 px-5 py-2 text-center text-xs text-white/80">24/7 travel agents</p>
          </div>
          <Card>
            <p className="flex items-center gap-2 font-display text-base font-bold text-navy">
              <ListChecks className="size-4 text-gold" aria-hidden="true" /> In this guide
            </p>
            <ol className="mt-3 space-y-2 text-sm">
              {g.sections.map((s, n) => (
                <li key={s.id} className="flex gap-2">
                  <span className="grid size-5 shrink-0 place-items-center rounded-full bg-secondary text-[11px] font-bold text-navy">
                    {n + 1}
                  </span>
                  <a href={`#${s.id}`} className="text-foreground/80 hover:text-navy hover:underline">
                    {s.heading}
                  </a>
                </li>
              ))}
            </ol>
          </Card>
          <Card>
            <p className="font-display text-base font-bold text-navy">More guides</p>
            <ul className="mt-3 space-y-2">
              {g.related.map((r) => (
                <li key={r.href}>
                  <a href={r.href} className="flex items-center gap-2 rounded-xl px-2 py-1.5 text-sm font-medium text-navy hover:bg-secondary">
                    <ChevronRight className="size-4 text-gold" aria-hidden="true" /> {r.label}
                  </a>
                </li>
              ))}
              {others
                .filter((o) => !g.related.some((r) => r.href.endsWith(o.slug)))
                .map((o) => (
                  <li key={o.slug}>
                    <Link
                      to="/guides/$slug"
                      params={{ slug: o.slug }}
                      className="flex items-center gap-2 rounded-xl px-2 py-1.5 text-sm font-medium text-navy hover:bg-secondary"
                    >
                      <ChevronRight className="size-4 text-gold" aria-hidden="true" /> {o.title}
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

/** A fitting icon for a section heading. */
function sectionIcon(heading: string) {
  const h = heading.toLowerCase();
  if (h.includes("airport")) return Building2;
  if (h.includes("advance") || h.includes("ahead") || h.includes("book")) return Clock;
  if (h.includes("day")) return CalendarDays;
  if (h.includes("airline") || h.includes("nonstop")) return Plane;
  if (h.includes("month") || h.includes("season") || h.includes("when")) return CalendarRange;
  if (h.includes("how we") || h.includes("method")) return ShieldCheck;
  return Lightbulb;
}
