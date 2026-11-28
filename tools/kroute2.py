"""Extract KAYAK route-page insight charts (public page, Nov 2026 format) into JSON.
usage: python3 kroute2.py OUT.json path1 path2 ...   (path like New-York-NYC/Rome-ROM)
Each chart: {"type":"chart","id":"FLIGHTS_..._INSIGHT","text":{question,answer},"labels":[...],"values":[...]}
"""
import re, sys, json, subprocess, html

UA = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/130 Safari/537.36"
IDS = {
    "FLIGHTS_CHEAPEST_MONTH_INSIGHT": "monthly",
    "FLIGHTS_CHEAPEST_DAY_INSIGHT": "weekday",
    "FLIGHTS_CHEAPEST_AIRLINES_INSIGHT": "cheapestAirlines",
    "FLIGHTS_BOOK_IN_ADVANCE_PRICE_INSIGHT": "bookAdvance",
    "FLIGHTS_PUNCTUAL_AIRLINE_INSIGHT": "punctual",
    "FLIGHTS_DELAY_FREQUENCY_INSIGHT": "delays",
}


def chart(s, cid):
    i = s.find('"id":"%s"' % cid)
    if i < 0:
        return None
    j = s.rfind("{", 0, i)
    depth = 0
    for k in range(j, min(len(s), j + 30000)):
        c = s[k]
        if c == "{":
            depth += 1
        elif c == "}":
            depth -= 1
            if depth == 0:
                try:
                    return json.loads(s[j:k + 1])
                except Exception:
                    return None
    return None


def clean(t):
    t = html.unescape(re.sub(r"<[^>]+>", " ", t or ""))
    return re.sub(r"\s+", " ", t).strip()


out = {}
for path in sys.argv[2:]:
    url = "https://www.kayak.com/flight-routes/" + path
    s = subprocess.run(["curl", "-sL", "-m", "45", "-A", UA, url], capture_output=True, text=True, errors="ignore").stdout
    t = clean(re.sub(r"<(script|style)[^>]*>.*?</\1>", " ", s, flags=re.S))
    d = {"url": url, "bytes": len(s)}
    for cid, key in IDS.items():
        c = chart(s, cid)
        if c:
            d[key] = {"labels": c.get("labels"), "values": c.get("values"),
                      "answer": clean((c.get("text") or {}).get("answer"))}
    for name, p in {
        "range": r"range from \$([\d,]+) to \$([\d,]+), with an average of \$([\d,]+)",
        "typical": r"typically (?:cost|range) (?:from )?\$([\d,]+)(?: to \$([\d,]+))?",
        "direct": r"fly direct with ([^.]{0,160})\. Average duration is ([\dhm ]+)",
        "noDirect": r"(no direct flights?[^.]{0,120})\.",
    }.items():
        m = re.search(p, t)
        if m:
            d[name] = [g.strip() for g in m.groups() if g]
    out[path] = d
    print(path, len(s), sorted(k for k in d if k not in ("url", "bytes")), file=sys.stderr)
json.dump(out, open(sys.argv[1], "w"), indent=1)
