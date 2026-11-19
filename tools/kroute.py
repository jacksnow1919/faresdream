"""Extract KAYAK route-page chart data (public page) into JSON.
usage: python3 kroute.py OUT.json path1 path2 ...   (path like New-York-John-F-Kennedy-Intl-JFK/Orlando-MCO)
"""
import re, sys, json, subprocess, html
UA = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/130 Safari/537.36"
KEYS = ["monthlyFlightPrice", "cheapestTimeToBook", "cheapestTimeToFlyDaily", "cheapestAirlines",
        "airlinesRouteDailyFrequency", "directFlightsDay", "flightDelayFrequency",
        "flightDelayMostPunctualAirline", "flightsDepartureTime", "typicalPriceChart",
        "flightDelayMostPunctualDayOfWeek"]

def block(s, key):
    i = s.find('"%s":{"labels"' % key)
    if i < 0:
        return None
    j = s.find("{", i + len(key) + 2)
    depth = 0
    for k in range(j, min(len(s), j + 20000)):
        if s[k] == "{": depth += 1
        elif s[k] == "}":
            depth -= 1
            if depth == 0:
                try:
                    return json.loads(s[j:k + 1])
                except Exception:
                    return None
    return None

out = {}
for path in sys.argv[2:]:
    url = "https://www.kayak.com/flight-routes/" + path
    s = subprocess.run(["curl", "-sL", "-m", "45", "-A", UA, url], capture_output=True, text=True, errors="ignore").stdout
    t = re.sub(r"<(script|style)[^>]*>.*?</\1>", " ", s, flags=re.S)
    t = html.unescape(re.sub(r"<[^>]+>", " ", t)); t = re.sub(r"\s+", " ", t)
    d = {"url": url, "bytes": len(s)}
    for k in KEYS:
        b = block(s, k)
        if b:
            d[k] = {kk: b.get(kk) for kk in ("labels", "values", "unit", "title") if kk in b} or b
    for name, p in {
        "range": r"range from \$([\d,]+) to \$([\d,]+), with an average of \$([\d,]+)",
        "direct": r"fly direct with ([^.]{0,120})\. Average duration is ([\dhm ]+)",
        "distance": r"distance (?:between|from)[^.]{0,80}? is (?:about |approximately )?([\d,]+) (?:miles|mi)",
        "nonstopCount": r"(\d+) direct flights? (?:per|a) (?:day|week)",
    }.items():
        m = re.search(p, t)
        if m: d[name] = [g.strip() for g in m.groups()]
    out[path] = d
    print(path, len(s), sorted(k for k in d if k not in ("url", "bytes")), file=sys.stderr)
json.dump(out, open(sys.argv[1], "w"), indent=1)
