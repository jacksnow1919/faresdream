import { useEffect, useState, type ReactNode } from "react";
import { Coins, Globe, Languages } from "lucide-react";
import { useCurrency } from "@/components/site/CurrencyContext";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { CURRENCIES, DEFAULT_CURRENCY } from "@/lib/brand";
import { COUNTRIES, countryByCode, currencyShort } from "@/lib/regional";

const selectCls =
  "h-12 w-full cursor-pointer rounded-xl border border-border bg-card px-3.5 text-[15px] text-foreground outline-none transition focus:border-primary";

function Setting({
  id,
  icon,
  label,
  hint,
  children,
}: {
  id: string;
  icon: ReactNode;
  label: string;
  hint?: string | undefined;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="flex items-center gap-2 text-sm font-semibold text-navy">
        <span className="text-primary">{icon}</span> {label}
      </label>
      {hint ? <p className="mt-1 text-xs text-muted-foreground">{hint}</p> : null}
      <div className="mt-2">{children}</div>
    </div>
  );
}

/** The visitor's language, flag and country, and currency, for the buttons that open the dialog. */
export function RegionalSummary() {
  const { country, currency } = useCurrency();
  const place = countryByCode(country);
  return (
    <>
      <span>English</span>
      <span className="inline-flex min-w-0 items-center gap-1.5">
        {place ? (
          <img
            src={`/flags/${place.code.toLowerCase()}.png`}
            alt=""
            width={20}
            height={15}
            className="h-[0.9375rem] w-5 shrink-0 rounded-[2px] object-cover"
          />
        ) : null}
        <span className="max-w-[8.125rem] truncate">{place?.name ?? country}</span>
      </span>
      <span className="whitespace-nowrap">{currencyShort(currency)}</span>
    </>
  );
}

/** Country and currency for this visitor. The site is only in English so far. */
export function RegionalSettingsDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { country, currency, setRegion } = useCurrency();
  const [draftCountry, setDraftCountry] = useState(country);
  const [draftCurrency, setDraftCurrency] = useState(currency);

  // Each time it opens, start from what's saved, so Cancel leaves nothing behind.
  useEffect(() => {
    if (!open) return;
    setDraftCountry(country);
    setDraftCurrency(currency);
  }, [open, country, currency]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] w-[calc(100%-2rem)] max-w-[27.5rem] gap-0 overflow-y-auto rounded-3xl border-0 p-6 sm:rounded-3xl">
        <DialogTitle className="font-display text-xl font-bold text-navy">
          Regional settings
        </DialogTitle>
        <DialogDescription className="sr-only">
          Choose your country and the currency for prices.
        </DialogDescription>

        <form
          className="mt-5 space-y-5"
          onSubmit={(e) => {
            e.preventDefault();
            setRegion({ country: draftCountry, currency: draftCurrency });
            onOpenChange(false);
          }}
        >
          <Setting id="region-language" icon={<Languages className="size-4" />} label="Language">
            <select id="region-language" defaultValue="en" className={selectCls}>
              <option value="en">English</option>
            </select>
          </Setting>

          <Setting
            id="region-country"
            icon={<Globe className="size-4" />}
            label="Country / Region"
            hint="Sets your usual currency and the airport your searches start from."
          >
            <select
              id="region-country"
              value={draftCountry}
              onChange={(e) => {
                setDraftCountry(e.target.value);
                setDraftCurrency(countryByCode(e.target.value)?.currency ?? draftCurrency);
              }}
              className={selectCls}
            >
              {COUNTRIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.name}
                </option>
              ))}
            </select>
          </Setting>

          <Setting
            id="region-currency"
            icon={<Coins className="size-4" />}
            label="Currency"
            hint={
              draftCurrency === DEFAULT_CURRENCY
                ? undefined
                : "Prices are shown as estimates in this currency. You pay in US dollars at checkout."
            }
          >
            <select
              id="region-currency"
              value={draftCurrency}
              onChange={(e) => setDraftCurrency(e.target.value)}
              className={selectCls}
            >
              {CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code} – {c.name}
                </option>
              ))}
            </select>
          </Setting>

          <div className="space-y-2.5 pt-1">
            <button
              type="submit"
              className="h-12 w-full cursor-pointer rounded-xl bg-navy font-semibold text-navy-foreground transition hover:brightness-110"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="h-12 w-full cursor-pointer rounded-xl bg-secondary font-semibold text-navy transition hover:brightness-95"
            >
              Cancel
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
