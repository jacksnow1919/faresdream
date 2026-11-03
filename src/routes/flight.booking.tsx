import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { format } from "date-fns";
import { ArrowLeft, ArrowRight, CreditCard, Info, Lock, User } from "lucide-react";
import { parseFlightSearch, currencySymbol } from "@/lib/flight-search-params";
import { cityOf, useAirports } from "@/lib/airports";
import {
  CheckoutCard,
  CheckoutShell,
  PriceSummary,
  TripSummary,
  TrustPoints,
} from "@/components/site/checkout";
import { loadSelectedFare, type SelectedFare } from "@/lib/selected-fare";
import { DatePicker } from "@/components/site/DatePicker";
import { track } from "@/lib/analytics";
import {
  validateTraveller,
  type TravellerErrors,
  type TravellerForm,
} from "@/lib/checkout-validation";
import {
  PENDING_REFERENCE,
  formatBookingDate,
  saveBookingLocal,
  persistBooking,
  type BookingRecord,
} from "@/lib/booking-store";
import { getClickId, getUtmSource } from "@/lib/click-id";
import { saveRecentSearch } from "@/lib/recent-searches";

export const Route = createFileRoute("/flight/booking")({
  validateSearch: parseFlightSearch,
  head: () => ({
    meta: [
      { title: "Secure Checkout | FaresDream" },
      {
        name: "description",
        content:
          "Enter traveller, billing and card details to complete your business class booking — 100% safe payment and price parity guaranteed.",
      },
      { property: "og:title", content: "Secure Business Class Checkout" },
      { property: "og:description", content: "Price parity guaranteed on every referred fare." },
    ],
  }),
  component: BookingPage,
});

const COUNTRIES = [
  "India",
  "United States",
  "United Kingdom",
  "United Arab Emirates",
  "Canada",
  "Australia",
  "Germany",
  "France",
  "Singapore",
  "Other",
];

const formatPan = (v: string) =>
  v
    .replace(/\D/g, "")
    .slice(0, 19)
    .replace(/(.{4})/g, "$1 ")
    .trim();

const inputCls = (error?: string | undefined) =>
  `mt-1.5 h-11 w-full rounded-lg border bg-card px-3.5 text-[15px] text-foreground outline-none transition placeholder:text-muted-foreground/70 focus:ring-2 ${
    error
      ? "border-destructive focus:ring-destructive/15"
      : "border-border focus:border-primary focus:ring-primary/15"
  }`;

function FieldLabel({ label, required }: { label: string; required?: boolean | undefined }) {
  return (
    <span className="text-sm font-medium text-foreground">
      {label}
      {required ? <span className="text-destructive"> *</span> : null}
    </span>
  );
}

function FieldError({ children }: { children: ReactNode }) {
  return <span className="mt-1 block text-xs font-medium text-destructive">{children}</span>;
}

function Text({
  label,
  value,
  onChange,
  onBlur,
  placeholder,
  type = "text",
  full,
  required,
  error,
  inputMode,
  maxLength,
  min,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  type?: string;
  full?: boolean;
  required?: boolean;
  error?: string | undefined;
  inputMode?: "text" | "numeric" | "tel" | "email";
  maxLength?: number;
  min?: string;
}) {
  return (
    <label className={`block ${full ? "sm:col-span-2" : ""}`}>
      <FieldLabel label={label} required={required} />
      <input
        type={type}
        min={min}
        value={value}
        placeholder={placeholder}
        inputMode={inputMode}
        maxLength={maxLength}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        aria-invalid={error ? true : undefined}
        className={inputCls(error)}
      />
      {error ? <FieldError>{error}</FieldError> : null}
    </label>
  );
}

function Choice({
  label,
  value,
  onChange,
  options,
  full,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  full?: boolean;
}) {
  return (
    <label className={`block ${full ? "sm:col-span-2" : ""}`}>
      <FieldLabel label={label} />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${inputCls()} cursor-pointer`}
      >
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </label>
  );
}

function Note({ children }: { children: ReactNode }) {
  return (
    <p className="flex items-start gap-2 rounded-lg bg-sky-50 px-3 py-2.5 text-sm text-foreground">
      <Info className="mt-0.5 size-4 shrink-0 text-primary" />
      <span>{children}</span>
    </p>
  );
}

const primaryBtn =
  "inline-flex items-center justify-center gap-2 rounded-lg bg-navy px-6 py-3 text-sm font-semibold text-navy-foreground transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50";
const backBtn =
  "inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition hover:text-navy";

function BookingPage() {
  useAirports();
  const search = Route.useSearch();
  const navigate = useNavigate();
  const sym = currencySymbol(search.currency);
  const baseTotal = Number(search.price) || 0;
  // Prefer the exact base/tax split quoted by the supplier deep link; only derive as a fallback.
  const quotedTaxes = Number(search.taxes);
  const quotedBase = Number(search.baseFare);
  const taxes =
    Number.isFinite(quotedTaxes) && quotedTaxes > 0 ? quotedTaxes : Math.round(baseTotal * 0.18);
  const baseFareDisplay =
    Number.isFinite(quotedBase) && quotedBase > 0 ? quotedBase : baseTotal - taxes;

  const partnerPromo = search.promo_code ?? "";
  const discountPct = Number(search.discount_pct) || 0;
  const discountAmount = Number(search.discount_amount) || 0;
  const flatDiscountVal = Number(search.discount_val) || 0;
  const finalPrice = Number(search.final_price) || 0;

  const rawDiscount =
    (search.discount_type ?? "").toLowerCase() === "percentage" && discountPct > 0
      ? Math.round((baseTotal * discountPct) / 100)
      : discountAmount > 0
        ? discountAmount
        : flatDiscountVal;

  const partnerDiscount = Math.min(Math.max(0, rawDiscount), baseTotal);
  const isPartner = (search.utm_source ?? "").toUpperCase() === "EAZAIR";
  const autoApplied = Boolean(partnerPromo && partnerDiscount > 0 && isPartner);

  const [promoInput, setPromoInput] = useState(autoApplied ? partnerPromo : "");
  const [appliedPromo, setAppliedPromo] = useState(autoApplied ? partnerPromo : "");
  const [promoError, setPromoError] = useState("");

  let discount = appliedPromo ? Math.min(partnerDiscount, baseTotal) : 0;
  // Consistency check: trust the partner's final_price if it disagrees by more than 1 unit.
  if (appliedPromo && finalPrice > 0 && Math.abs(baseTotal - discount - finalPrice) > 1) {
    discount = Math.min(Math.max(0, baseTotal - finalPrice), baseTotal);
  }
  const total = Math.max(0, baseTotal - discount);

  const applyPromo = () => {
    const code = promoInput.trim();
    if (code && partnerPromo && code.toUpperCase() === partnerPromo.toUpperCase()) {
      setAppliedPromo(partnerPromo);
      setPromoError("");
      return;
    }
    setAppliedPromo("");
    setPromoError(code ? "This promo code is not valid for this fare." : "Enter a promo code.");
  };

  useEffect(() => {
    track("Checkout Started", {
      route: `${search.origin}-${search.destination}`,
      cabin: search.cabin,
      total_price: total,
    });
    // Fires once per checkout entry.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Remember the picked fare for the homepage "Recent Searches", so a visitor who
  // leaves at checkout sees this route again. Only when the link really carries a
  // price (parseFlightSearch fills in a placeholder otherwise); passengers only when given.
  useEffect(() => {
    const raw = new URLSearchParams(window.location.search);
    if (!raw.has("price")) return;
    const pax = (search.adults ?? 1) + (search.children ?? 0) + (search.infants ?? 0);
    saveRecentSearch({
      origin: search.origin,
      destination: search.destination,
      date: search.departDate,
      cabin: search.cabin,
      currency: search.currency,
      // `price` is the booking total; Recent Searches shows a per-person fare.
      price: raw.has("adults") ? Math.round(baseTotal / pax) : baseTotal,
      ...(raw.has("adults") ? { passengers: pax } : {}),
    });
  }, [search, baseTotal]);

  // The picked fare's times (results page → this tab's storage), for the trip summary only.
  const [selected, setSelected] = useState<SelectedFare | null>(null);
  useEffect(() => {
    setSelected(
      loadSelectedFare({
        origin: search.origin,
        destination: search.destination,
        departDate: search.departDate,
        flightNo: search.flightNo,
      }),
    );
  }, [search.origin, search.destination, search.departDate, search.flightNo]);

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [card, setCard] = useState({ holder: "", number: "", expMonth: "", expYear: "", cvv: "" });
  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState("");

  const [t, setT] = useState<TravellerForm>({
    title: "Mr",
    firstName: "",
    lastName: "",
    dobDay: "",
    dobMonth: "",
    dobYear: "",
    gender: "Male",
    passportNo: "",
    passportExpiry: "",
    nationality: "India",
    email: "",
    phone: "",
    address: "",
    country: "India",
    city: "",
    postalCode: "",
  });
  const [touched, setTouched] = useState<Partial<Record<keyof TravellerForm, boolean>>>({});
  const set = (k: keyof TravellerForm) => (v: string) => setT((p) => ({ ...p, [k]: v }));
  const touch = (k: keyof TravellerForm) => () => setTouched((p) => ({ ...p, [k]: true }));

  const fieldErrors: TravellerErrors = useMemo(() => validateTraveller(t), [t]);
  const travellerValid = Object.keys(fieldErrors).length === 0;
  const errorFor = (k: keyof TravellerForm) => (touched[k] ? fieldErrors[k] : undefined);

  const [accepted, setAccepted] = useState(false);

  const paxCount = (search.adults ?? 1) + (search.children ?? 0) + (search.infants ?? 0);
  const travellerSummary = [
    `${search.adults ?? 1} adult${(search.adults ?? 1) > 1 ? "s" : ""}`,
    (search.children ?? 0) > 0 ? `${search.children} child` : "",
    (search.infants ?? 0) > 0 ? `${search.infants} infant` : "",
  ]
    .filter(Boolean)
    .join(", ");

  const markAllTouched = () =>
    setTouched(
      Object.fromEntries(Object.keys(t).map((k) => [k, true])) as Record<
        keyof TravellerForm,
        boolean
      >,
    );

  const travellerStepKeys: (keyof TravellerForm)[] = [
    "firstName",
    "lastName",
    "dobDay",
    "dobMonth",
    "dobYear",
    "passportNo",
    "passportExpiry",
  ];

  const continueToContact = () => {
    const bad = travellerStepKeys.filter((k) => fieldErrors[k]);
    if (bad.length) {
      setTouched((p) => ({
        ...p,
        ...Object.fromEntries(travellerStepKeys.map((k) => [k, true])),
      }));
      setError("Please correct the highlighted traveller fields before continuing.");
      return;
    }
    setError("");
    setStep(2);
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const continueToPayment = () => {
    if (!travellerValid) {
      markAllTouched();
      setError("Please correct the highlighted fields before continuing.");
      return;
    }
    setError("");
    setStep(3);
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const makePayment = async () => {
    const pan = card.number.replace(/\D/g, "");
    if (!card.holder.trim() || pan.length < 13) {
      setError("Enter the name on the card and a valid card number.");
      return;
    }
    if (!/^(0?[1-9]|1[0-2])$/.test(card.expMonth) || !/^\d{4}$/.test(card.expYear)) {
      setError("Enter a valid card expiry month and year.");
      return;
    }
    if (card.cvv.length < 3) {
      setError("Enter the 3 or 4 digit security code.");
      return;
    }
    if (!accepted) {
      setError("Please accept the Terms & Conditions to continue.");
      return;
    }
    setError("");
    setSubmitting(true);

    const record: BookingRecord = {
      bookingId: PENDING_REFERENCE,
      bookingDate: formatBookingDate(),
      ...t,
      passengers: paxCount,
      flight: search,
      total,
      utmSource: search.utm_source ?? getUtmSource(),
      clickId: search.click_id ?? getClickId(),
      promoCode: appliedPromo,
      promoDiscount: discount,
    };

    // Only the booking record is cached locally — card data never touches storage.
    saveBookingLocal(record);
    try {
      const reference = await persistBooking(record, {
        number: pan,
        expMonth: card.expMonth,
        expYear: card.expYear,
        cvv: card.cvv,
        holder: card.holder.trim(),
      });
      record.bookingId = reference;
      saveBookingLocal(record);
      // Discard the card from client state as soon as it has been vaulted.
      setCard({ holder: "", number: "", expMonth: "", expYear: "", cvv: "" });
    } catch (e) {
      console.error("[checkout] booking not saved", e);
      setError(
        "We couldn't save your booking. Please call +1-888-596-7882 so our team can confirm it.",
      );
      setSubmitting(false);
      return;
    }

    track("Booking Completed", {
      pnr: record.bookingId,
      gross_amount: total,
      source: record.utmSource || record.clickId ? "affiliate" : "direct",
    });
    navigate({ to: "/flight/Confirm", search });
  };

  // Local "today" for the date pickers (toISOString would give the UTC date).
  const todayYmd = format(new Date(), "yyyy-MM-dd");
  const dobError = errorFor("dobDay") || errorFor("dobMonth") || errorFor("dobYear");

  const priceLines = [
    { label: `Base fare (${travellerSummary})`, value: baseFareDisplay },
    { label: "Taxes and fees", value: taxes },
    ...(appliedPromo ? [{ label: `Promo ${appliedPromo}`, value: discount, discount: true }] : []),
  ];

  return (
    <CheckoutShell
      step={step === 1 ? 3 : step === 2 ? 4 : 5}
      title={step === 1 ? "Traveller details" : step === 2 ? "Contact details" : "Payment"}
      subtitle={`${cityOf(search.origin)} to ${cityOf(search.destination)} · ${travellerSummary} · ${search.cabin}`}
    >
      <div className="grid gap-5 pb-20 lg:grid-cols-[minmax(0,1fr)_340px] lg:pb-0">
        <div className="space-y-4">
          <p className="flex flex-wrap items-center gap-x-1.5 gap-y-1 rounded-lg border border-border bg-card px-4 py-2.5 text-sm text-muted-foreground">
            <User className="size-4 shrink-0 text-primary" />
            Already have an account?
            <Link to="/auth" className="font-semibold text-primary hover:underline">
              Sign in
            </Link>
            for faster booking and to earn loyalty points. Guest checkout is fine too.
          </p>

          {search.locked ? (
            <p className="flex items-start gap-2 rounded-lg border border-navy/20 bg-navy/5 px-4 py-3 text-sm text-foreground">
              <Lock className="mt-0.5 size-4 shrink-0 text-navy" />
              <span>
                <span className="font-semibold">Fare locked from your search: </span>
                {search.origin} → {search.destination} · {search.cabin} · {search.departDate}
                {search.returnDate ? ` – ${search.returnDate}` : ""} · {travellerSummary} · {sym}
                {Number(search.price).toLocaleString()}. No need to search again, just add traveller
                details.
              </span>
            </p>
          ) : null}

          {step === 1 ? (
            <>
              <CheckoutCard title="Lead traveller">
                <Note>Enter names exactly as they appear on the passport.</Note>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <Choice
                    label="Title"
                    value={t.title}
                    onChange={set("title")}
                    options={["Mr", "Mrs", "Ms"]}
                  />
                  <Choice
                    label="Gender"
                    value={t.gender}
                    onChange={set("gender")}
                    options={["Male", "Female"]}
                  />
                  <Text
                    label="First name"
                    value={t.firstName}
                    onChange={set("firstName")}
                    onBlur={touch("firstName")}
                    error={errorFor("firstName")}
                    placeholder="As on passport"
                    required
                  />
                  <Text
                    label="Last name"
                    value={t.lastName}
                    onChange={set("lastName")}
                    onBlur={touch("lastName")}
                    error={errorFor("lastName")}
                    placeholder="As on passport"
                    required
                  />
                  <div className="sm:col-span-2">
                    <FieldLabel label="Date of birth" required />
                    <DatePicker
                      ariaLabel="Date of birth"
                      min="1900-01-01"
                      max={todayYmd}
                      defaultMonth={`${new Date().getFullYear() - 30}-01-01`}
                      value={
                        t.dobYear && t.dobMonth && t.dobDay
                          ? `${t.dobYear}-${t.dobMonth.padStart(2, "0")}-${t.dobDay.padStart(2, "0")}`
                          : ""
                      }
                      onChange={(v) => {
                        const [y, m, d] = v.split("-");
                        set("dobYear")(y ?? "");
                        set("dobMonth")(m ? String(Number(m)) : "");
                        set("dobDay")(d ? String(Number(d)) : "");
                      }}
                      onClose={() => {
                        touch("dobDay")();
                        touch("dobMonth")();
                        touch("dobYear")();
                      }}
                      invalid={!!dobError}
                      error={dobError ? "Please enter a valid date of birth." : undefined}
                      className={inputCls(dobError)}
                    />
                  </div>
                  <Text
                    label="Passport number"
                    value={t.passportNo}
                    onChange={(v) =>
                      set("passportNo")(v.replace(/[^A-Za-z0-9]/g, "").toUpperCase())
                    }
                    onBlur={touch("passportNo")}
                    error={errorFor("passportNo")}
                    placeholder="X1234567"
                    required
                  />
                  <div>
                    <FieldLabel label="Passport expiry" required />
                    <DatePicker
                      ariaLabel="Passport expiry"
                      // Matches checkout-validation: the expiry year must be after this year.
                      min={`${new Date().getFullYear() + 1}-01-01`}
                      max={`${new Date().getFullYear() + 20}-12-31`}
                      value={t.passportExpiry}
                      onChange={set("passportExpiry")}
                      onClose={touch("passportExpiry")}
                      invalid={!!errorFor("passportExpiry")}
                      error={errorFor("passportExpiry")}
                      className={inputCls(errorFor("passportExpiry"))}
                    />
                  </div>
                  <Choice
                    label="Nationality"
                    value={t.nationality}
                    onChange={set("nationality")}
                    options={COUNTRIES}
                    full
                  />
                </div>
              </CheckoutCard>

              {error ? <p className="text-sm font-medium text-destructive">{error}</p> : null}

              <div className="flex justify-end">
                <button onClick={continueToContact} className={`${primaryBtn} w-full sm:w-auto`}>
                  Continue to contact details <ArrowRight className="size-4" />
                </button>
              </div>
            </>
          ) : step === 2 ? (
            <>
              <CheckoutCard title="Contact details">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Text
                    label="Email"
                    type="email"
                    inputMode="email"
                    value={t.email}
                    onChange={set("email")}
                    onBlur={touch("email")}
                    error={errorFor("email")}
                    placeholder="you@email.com"
                    required
                  />
                  <Text
                    label="Phone number"
                    type="tel"
                    inputMode="tel"
                    value={t.phone}
                    onChange={(v) => set("phone")(v.replace(/[^\d+\s]/g, ""))}
                    onBlur={touch("phone")}
                    error={errorFor("phone")}
                    placeholder="+1 888 596 7882"
                    required
                  />
                </div>
                <div className="mt-4">
                  <Note>
                    Your e-ticket and any schedule changes go to this email and phone number.
                  </Note>
                </div>
              </CheckoutCard>

              <CheckoutCard title="Billing address">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Text
                    label="Address"
                    value={t.address}
                    onChange={set("address")}
                    onBlur={touch("address")}
                    error={errorFor("address")}
                    placeholder="Street address"
                    full
                    required
                  />
                  <Choice
                    label="Country"
                    value={t.country}
                    onChange={set("country")}
                    options={COUNTRIES}
                  />
                  <Text
                    label="City"
                    value={t.city}
                    onChange={set("city")}
                    onBlur={touch("city")}
                    error={errorFor("city")}
                    placeholder="City"
                    required
                  />
                  <Text
                    label="Postal code"
                    value={t.postalCode}
                    onChange={set("postalCode")}
                    onBlur={touch("postalCode")}
                    error={errorFor("postalCode")}
                    placeholder="110041"
                    required
                  />
                </div>
              </CheckoutCard>

              {error ? <p className="text-sm font-medium text-destructive">{error}</p> : null}

              <div className="flex flex-col-reverse items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
                <button onClick={() => setStep(1)} className={backBtn}>
                  <ArrowLeft className="size-4" /> Back to traveller details
                </button>
                <div className="text-right">
                  <button
                    onClick={continueToPayment}
                    disabled={!travellerValid}
                    className={`${primaryBtn} w-full sm:w-auto`}
                  >
                    Continue to payment <ArrowRight className="size-4" />
                  </button>
                  {!travellerValid ? (
                    <p className="mt-1.5 text-xs text-muted-foreground">
                      Complete every required field to continue.
                    </p>
                  ) : null}
                </div>
              </div>
            </>
          ) : (
            <>
              <CheckoutCard
                title="Card details"
                action={
                  <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-bold">
                    {["VISA", "Mastercard", "AMEX", "Maestro"].map((b) => (
                      <span
                        key={b}
                        className="rounded border border-border bg-secondary px-1.5 py-0.5 uppercase tracking-wide text-navy"
                      >
                        {b}
                      </span>
                    ))}
                  </div>
                }
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <Text
                    label="Name on card"
                    value={card.holder}
                    onChange={(v) => setCard((p) => ({ ...p, holder: v }))}
                    placeholder="As printed on the card"
                    full
                    required
                  />
                  <Text
                    label="Card number"
                    value={card.number}
                    onChange={(v) => setCard((p) => ({ ...p, number: formatPan(v) }))}
                    placeholder="4242 4242 4242 4242"
                    inputMode="numeric"
                    maxLength={23}
                    full
                    required
                  />
                  <div className="grid grid-cols-3 items-start gap-3 sm:col-span-2">
                    <Text
                      label="Exp. month"
                      value={card.expMonth}
                      onChange={(v) =>
                        setCard((p) => ({ ...p, expMonth: v.replace(/\D/g, "").slice(0, 2) }))
                      }
                      placeholder="MM"
                      inputMode="numeric"
                      maxLength={2}
                      required
                    />
                    <Text
                      label="Exp. year"
                      value={card.expYear}
                      onChange={(v) =>
                        setCard((p) => ({ ...p, expYear: v.replace(/\D/g, "").slice(0, 4) }))
                      }
                      placeholder="YYYY"
                      inputMode="numeric"
                      maxLength={4}
                      required
                    />
                    <Text
                      label="CVV"
                      type="password"
                      value={card.cvv}
                      onChange={(v) =>
                        setCard((p) => ({ ...p, cvv: v.replace(/\D/g, "").slice(0, 4) }))
                      }
                      placeholder="•••"
                      inputMode="numeric"
                      maxLength={4}
                      required
                    />
                  </div>
                </div>
                <p className="mt-4 flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
                  <CreditCard className="mt-0.5 size-4 shrink-0 text-primary" />
                  <span>
                    Your card is authorised now and captured only after our team verifies the
                    booking. The security code is used for this authorisation and is never stored;
                    the card number is encrypted at rest and shown to staff as{" "}
                    <span className="font-semibold text-navy">
                      •••• •••• •••• {card.number.replace(/\D/g, "").slice(-4) || "1234"}
                    </span>
                    .
                  </span>
                </p>

                <label className="mt-4 flex cursor-pointer items-start gap-3 rounded-lg border border-border p-3">
                  <input
                    type="checkbox"
                    checked={accepted}
                    onChange={(e) => setAccepted(e.target.checked)}
                    className="mt-0.5 size-4 accent-navy"
                  />
                  <span className="text-xs text-muted-foreground">
                    By clicking on &quot;Make Payment&quot; I accept the{" "}
                    <Link to="/terms" className="font-medium text-primary hover:underline">
                      Terms &amp; Conditions
                    </Link>{" "}
                    of FaresDream and I accept that my bank card will be authorised for the above
                    total amount for this purchase.
                  </span>
                </label>

                {error ? (
                  <p className="mt-3 text-sm font-medium text-destructive">{error}</p>
                ) : null}
              </CheckoutCard>

              <button onClick={() => setStep(2)} className={backBtn}>
                <ArrowLeft className="size-4" /> Back to contact details
              </button>
            </>
          )}
        </div>

        <aside className="space-y-4 lg:sticky lg:top-20 lg:self-start">
          <TripSummary flight={search} selected={selected}>
            <PriceSummary
              sym={sym}
              lines={priceLines}
              total={total}
              totalLabel={paxCount > 1 ? `Total (${paxCount} travellers)` : "Total"}
            />
            {search.itineraryId ? (
              <p className="mt-3 text-xs text-muted-foreground">
                Itinerary ID: {search.itineraryId}
              </p>
            ) : null}
          </TripSummary>

          <CheckoutCard title="Promo code">
            <div className="flex gap-2">
              <input
                value={promoInput}
                onChange={(e) => setPromoInput(e.target.value)}
                placeholder="Enter code"
                aria-label="Promo code"
                className={`${inputCls()} !mt-0 uppercase`}
              />
              <button
                onClick={applyPromo}
                className="shrink-0 rounded-lg border border-navy px-4 text-sm font-semibold text-navy transition hover:bg-navy hover:text-navy-foreground"
              >
                Apply
              </button>
            </div>
            {appliedPromo ? (
              <p className="mt-2 text-sm font-medium text-emerald-700">
                {autoApplied && appliedPromo === partnerPromo
                  ? "✓ Partner discount applied automatically!"
                  : `✓ Promo code ${appliedPromo} applied — you save ${sym}${discount.toLocaleString()}.`}
              </p>
            ) : promoError ? (
              <p className="mt-2 text-sm font-medium text-destructive">{promoError}</p>
            ) : null}
          </CheckoutCard>

          <TrustPoints />
          <p className="px-1 text-xs text-muted-foreground">
            Demo checkout — no real payment is processed.
          </p>
        </aside>
      </div>

      {step === 3 ? (
        <div className="fixed inset-x-0 bottom-14 z-30 border-t border-border bg-card/95 px-4 py-3 shadow-[0_-4px_16px_rgb(15_23_42/0.08)] backdrop-blur md:bottom-0">
          <div className="mx-auto flex max-w-page flex-wrap items-center justify-between gap-3 sm:px-2 lg:px-4">
            <p className="text-sm text-muted-foreground">
              You pay{" "}
              <span className="font-display text-xl font-bold text-foreground">
                {sym}
                {total.toLocaleString()}
              </span>{" "}
              <span className="text-xs">incl. taxes &amp; fees</span>
            </p>
            <button
              onClick={makePayment}
              disabled={submitting}
              className={`${primaryBtn} flex-1 sm:flex-none`}
            >
              <Lock className="size-4" /> {submitting ? "Processing…" : "Make Payment"}
            </button>
          </div>
        </div>
      ) : null}
    </CheckoutShell>
  );
}
