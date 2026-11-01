import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { addYears, format } from "date-fns";
import { X, Plane, ArrowRight } from "lucide-react";
import { AirportAutocomplete } from "@/components/site/AirportAutocomplete";
import { DatePicker } from "@/components/site/DatePicker";

export type CabinRouteTarget = {
  product: string;
  airline: string;
  airlineCode: string;
  cabin: "Business" | "First";
};

/** Local date (toISOString would give the UTC date, a day off in the evening). */
const today = () => format(new Date(), "yyyy-MM-dd");

export function CabinRouteModal({
  target,
  onClose,
}: {
  target: CabinRouteTarget;
  onClose: () => void;
}) {
  const navigate = useNavigate();
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState(today());

  function submit(e: React.FormEvent) {
    e.preventDefault();
    navigate({
      to: "/flight/search",
      search: {
        origin: origin.trim().toUpperCase(),
        destination: destination.trim().toUpperCase(),
        date,
        passengers: 1,
        cabin: target.cabin,
        airline: target.airlineCode,
      },
    });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-[60] grid place-items-center px-4">
      <button
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-navy/75 backdrop-blur-sm"
      />
      <div className="relative w-full max-w-md rounded-2xl border border-gold/25 bg-navy p-5 text-navy-foreground shadow-lux sm:p-6">
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 grid size-8 place-items-center rounded-lg border border-white/20 text-navy-foreground/70 hover:text-gold"
        >
          <X className="size-4" />
        </button>

        <span className="grid size-11 place-items-center rounded-xl bg-gold text-gold-foreground">
          <Plane className="size-5" />
        </span>
        <h2 className="mt-4 font-display text-xl font-semibold sm:text-2xl">
          Where would you like to fly in {target.product}?
        </h2>
        <p className="mt-2 text-sm text-navy-foreground/70">
          We&apos;ll search {target.airline} {target.cabin.toLowerCase()} class on your dates only.
        </p>

        <form onSubmit={submit} className="mt-5 grid gap-3 sm:grid-cols-2">
          <AirportAutocomplete
            label="From"
            tone="dark"
            value={origin}
            onChange={setOrigin}
            required
          />
          <AirportAutocomplete
            label="To"
            tone="dark"
            value={destination}
            onChange={setDestination}
            required
          />
          <div className="sm:col-span-2">
            <span className={labelCls}>Departure date</span>
            <DatePicker
              ariaLabel="Departure date"
              value={date}
              min={today()}
              max={format(addYears(new Date(), 1), "yyyy-MM-dd")}
              onChange={(v) => setDate(v || today())}
              className={inputCls}
            />
          </div>
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gold px-5 py-3 text-sm font-bold text-gold-foreground sm:col-span-2"
          >
            Find {target.product} Flights <ArrowRight className="size-4" />
          </button>
        </form>
      </div>
    </div>
  );
}

const labelCls = "text-[10px] font-bold uppercase tracking-[0.18em] text-navy-foreground/50";
const inputCls =
  "mt-1 w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2.5 text-sm text-navy-foreground outline-none placeholder:text-navy-foreground/40 focus:border-gold";
