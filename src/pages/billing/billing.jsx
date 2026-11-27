import { useEffect, useMemo, useRef, useState } from "react";
import "./billing.css";
import billingContent from "./billing-content.json";
import CalendarDatePicker from "../../components/CalendarDatePicker";
import { formatSelectedDate } from "../../components/calendarDateUtils";

const {
  navigationItems,
  adminPageDetails,
  chargeTypes,
  dispatchChecks: dispatchCheckItems,
  billingSchemes,
  invoiceSocialLinks,
} = billingContent;

const INITIAL_FORM = {
  customerName: "",
  customerPhone: "",
  customerEmail: "",
  bookingId: "",
  vehicle: "Renault Tribber - 2025 -7 Seater",
  vehicleVariant: "",
  billingScheme: "day",
  pickupDate: "",
  pickupTime: "",
  returnDate: "",
  returnTime: "",
  dailyRate: "",
  extraHourRate: "",
  odometerStart: "",
  odometerReturn: "",
  includedDistance: "",
  perKmRate: "",
  packageAmount: "",
  tollCharges: "",
  fuelCharges: "",
  driverCharges: "",
  cleaningCharges: "",
  lateReturnCharges: "",
  damageCharges: "",
  discount: "",
  gstRate: "",
  advancePaid: "",
  returnPaid: "",
  securityDeposit: "",
};

const moneyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 2,
});

const toAmount = (value) => {
  const amount = Number.parseFloat(value);
  return Number.isFinite(amount) && amount > 0 ? amount : 0;
};

const formatMoney = (amount) => moneyFormatter.format(amount);

function SectionCard({ children, className = "gap-4" }) {
  return (
    <section
      className={`bg-surface-container-low p-5 rounded-DEFAULT shadow-sm flex flex-col ${className}`}
      style={{
        background:
          "linear-gradient(145deg, rgba(24, 24, 24, 0.75) 0%, rgba(14, 14, 14, 0.95) 100%)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(212, 175, 55, 0.2)",
        boxShadow:
          "0 14px 35px -8px rgba(0, 0, 0, 0.85), inset 0 1px 0 rgba(255, 255, 255, 0.04)",
      }}
    >
      {children}
    </section>
  );
}

function SectionHeader({ icon, number, title, trailing }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-2.5">
        <span className="material-symbols-outlined text-primary text-[20px]">
          {icon}
        </span>
        <div className="flex flex-col">
          <span className="font-label-caps text-[10px] text-primary tracking-widest uppercase">
            SECTION {number}
          </span>
          <h2 className="text-[16px] font-semibold text-on-surface tracking-wide">
            {title}
          </h2>
        </div>
      </div>
      {trailing}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  inputMode,
  min,
  max,
  step,
  required = false,
  className = "",
  inputClassName = "",
  name,
}) {
  return (
    <label className={`flex min-w-0 flex-col gap-1 ${className}`}>
      <span className="font-label-caps text-[10px] uppercase text-on-surface-variant">
        {label}
      </span>
      <input
        className={`billing-input w-full bg-surface-container-lowest text-on-surface px-3 py-2 text-[13px] focus:outline-none focus:ring-1 focus:ring-primary ${inputClassName}`}
        max={max}
        min={min}
        name={name}
        onChange={onChange}
        inputMode={inputMode}
        placeholder={placeholder}
        required={required}
        step={step}
        type={type}
        value={value}
        style={{ borderRadius: "5px" }}
      />
    </label>
  );
}

function MoneyField({
  label,
  value,
  onChange,
  placeholder = "0.00",
  ...props
}) {
  return (
    <Field
      label={label}
      min="0"
      inputMode="decimal"
      onChange={onChange}
      placeholder={placeholder}
      step="0.01"
      type="text"
      value={value}
      {...props}
    />
  );
}

const HOURS = Array.from({ length: 12 }, (_, index) => index + 1);
const MINUTES = Array.from({ length: 60 }, (_, index) => index);

function toTimeParts(time) {
  const [hour = "0", minute = "0"] = time.split(":");
  const hour24 = Number(hour);
  return {
    hour: hour24 % 12 || 12,
    minute: Number(minute),
    period: hour24 >= 12 ? "PM" : "AM",
  };
}

function formatSelectedTime(time) {
  if (!time) return "Select time";
  const { hour, minute, period } = toTimeParts(time);
  return `${hour}:${String(minute).padStart(2, "0")} ${period}`;
}

function DateTimeField({ label, date, time, onDateChange, onTimeChange }) {
  const pickerRef = useRef(null);
  const [activePicker, setActivePicker] = useState(null);
  const [draftTime, setDraftTime] = useState(() =>
    toTimeParts(time || "00:00"),
  );

  useEffect(() => {
    if (!activePicker) return undefined;

    const closeOnOutsideClick = (event) => {
      if (!pickerRef.current?.contains(event.target)) setActivePicker(null);
    };
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setActivePicker(null);
    };

    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [activePicker]);

  const openTimePicker = () => {
    if (activePicker === "time") {
      setActivePicker(null);
      return;
    }

    setDraftTime(toTimeParts(time || "00:00"));
    setActivePicker("time");
  };

  const selectTime = () => {
    const hour24 = (draftTime.hour % 12) + (draftTime.period === "PM" ? 12 : 0);
    onTimeChange(
      `${String(hour24).padStart(2, "0")}:${String(draftTime.minute).padStart(2, "0")}`,
    );
    setActivePicker(null);
  };

  return (
    <div className="flex min-w-0 flex-col gap-1">
      <span className="font-label-caps text-[10px] uppercase text-on-surface-variant">
        {label}
      </span>
      <div
        className={`billing-datetime-field${activePicker ? " has-open-picker" : ""}`}
        ref={pickerRef}
      >
        <CalendarDatePicker
          date={date}
          isOpen={activePicker === "date"}
          label={label}
          onDateChange={onDateChange}
          onOpenChange={(isOpen) =>
            setActivePicker(isOpen ? "date" : null)
          }
        />
        <span className="billing-datetime-divider" aria-hidden="true" />
        <button
          aria-expanded={activePicker === "time"}
          aria-haspopup="dialog"
          aria-label={`Choose ${label.toLowerCase()} time`}
          className={`billing-datetime-trigger billing-time-trigger${activePicker === "time" ? " is-active" : ""}`}
          onClick={openTimePicker}
          type="button"
        >
          <span className="material-symbols-outlined">schedule</span>
          <span className={time ? "" : "is-placeholder"}>
            {formatSelectedTime(time)}
          </span>
          <span className="material-symbols-outlined billing-picker-chevron">
            expand_more
          </span>
        </button>

        {activePicker === "time" && (
          <div
            aria-label={`${label} time picker`}
            className="billing-picker-popover billing-time-popover"
            role="dialog"
          >
            <div className="billing-time-heading">
              <div>
                <span className="billing-picker-eyebrow">SELECT TIME</span>
                <h3>
                  {formatSelectedTime(
                    `${String(
                      (draftTime.hour % 12) +
                        (draftTime.period === "PM" ? 12 : 0),
                    ).padStart(
                      2,
                      "0",
                    )}:${String(draftTime.minute).padStart(2, "0")}`,
                  )}
                </h3>
              </div>
              <span className="material-symbols-outlined">schedule</span>
            </div>
            <div className="billing-time-columns">
              <div aria-label="Hour" className="billing-time-column">
                <span className="billing-time-column-label">HOUR</span>
                <div className="billing-time-options">
                  {HOURS.map((hour) => (
                    <button
                      aria-pressed={draftTime.hour === hour}
                      className={`billing-time-option${draftTime.hour === hour ? " is-selected" : ""}`}
                      key={hour}
                      onClick={() =>
                        setDraftTime((current) => ({ ...current, hour }))
                      }
                      type="button"
                    >
                      {String(hour).padStart(2, "0")}
                    </button>
                  ))}
                </div>
              </div>
              <div aria-label="Minute" className="billing-time-column">
                <span className="billing-time-column-label">MINUTE</span>
                <div className="billing-time-options">
                  {MINUTES.map((minute) => (
                    <button
                      aria-pressed={draftTime.minute === minute}
                      className={`billing-time-option${draftTime.minute === minute ? " is-selected" : ""}`}
                      key={minute}
                      onClick={() =>
                        setDraftTime((current) => ({ ...current, minute }))
                      }
                      type="button"
                    >
                      {String(minute).padStart(2, "0")}
                    </button>
                  ))}
                </div>
              </div>
              <div aria-label="Period" className="billing-time-column">
                <span className="billing-time-column-label">PERIOD</span>
                <div className="billing-time-periods">
                  {["AM", "PM"].map((period) => (
                    <button
                      aria-pressed={draftTime.period === period}
                      className={`billing-time-option${draftTime.period === period ? " is-selected" : ""}`}
                      key={period}
                      onClick={() =>
                        setDraftTime((current) => ({ ...current, period }))
                      }
                      type="button"
                    >
                      {period}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="billing-time-footer">
              <button
                className="billing-picker-text-button"
                onClick={() => setActivePicker(null)}
                type="button"
              >
                Cancel
              </button>
              <button
                className="billing-time-done"
                onClick={selectTime}
                type="button"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function SummaryRow({ label, amount, className = "", amountClass = "" }) {
  return (
    <div className={`flex items-center justify-between gap-3 ${className}`}>
      <span>{label}</span>
      <span className={`shrink-0 ${amountClass}`}>{amount}</span>
    </div>
  );
}

function InvoiceCard({ children, className = "" }) {
  return (
    <section className={`billing-invoice-card ${className}`}>
      {children}
    </section>
  );
}

function InvoiceSectionTitle({ icon, title }) {
  return (
    <h2 className="billing-invoice-section-title">
      <span className="material-symbols-outlined">{icon}</span>
      {title}
    </h2>
  );
}

function InvoiceField({ label, value }) {
  return (
    <div className="billing-invoice-field">
      <span>{label}</span>
      <strong>{value || "—"}</strong>
    </div>
  );
}

function InvoiceRow({ label, value, emphasis = false }) {
  return (
    <div className={`billing-invoice-row${emphasis ? " is-emphasis" : ""}`}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

export default function Billing({ onBack, activePage = "billing" }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [customCharges, setCustomCharges] = useState([]);
  const [dispatchChecks, setDispatchChecks] = useState([]);
  const [notice, setNotice] = useState("");
  const [isBillPreviewOpen, setIsBillPreviewOpen] = useState(false);
  const [printAfterPreview, setPrintAfterPreview] = useState(false);

  useEffect(() => {
    if (!isBillPreviewOpen || !printAfterPreview) return undefined;

    const printTimeout = window.setTimeout(() => {
      window.print();
      setPrintAfterPreview(false);
    }, 0);

    return () => window.clearTimeout(printTimeout);
  }, [isBillPreviewOpen, printAfterPreview]);

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setNotice("");
  };

  const updateCustomCharge = (id, field, value) => {
    setCustomCharges((current) =>
      current.map((charge) =>
        charge.id === id ? { ...charge, [field]: value } : charge,
      ),
    );
  };

  const duration = useMemo(() => {
    if (
      !form.pickupDate ||
      !form.pickupTime ||
      !form.returnDate ||
      !form.returnTime
    ) {
      return { totalHours: 0, days: 0, extraHours: 0, valid: false };
    }

    const start = new Date(`${form.pickupDate}T${form.pickupTime}`);
    const end = new Date(`${form.returnDate}T${form.returnTime}`);
    const totalHours = (end.getTime() - start.getTime()) / 3_600_000;

    if (!Number.isFinite(totalHours) || totalHours <= 0) {
      return { totalHours: 0, days: 0, extraHours: 0, valid: false };
    }

    const roundedHours = Math.ceil(totalHours);
    return {
      totalHours: roundedHours,
      days: Math.floor(roundedHours / 24),
      extraHours: roundedHours % 24,
      valid: true,
    };
  }, [form.pickupDate, form.pickupTime, form.returnDate, form.returnTime]);

  const totals = useMemo(() => {
    const distance = Math.max(
      0,
      toAmount(form.odometerReturn) - toAmount(form.odometerStart),
    );
    const extraDistance = Math.max(
      0,
      distance - toAmount(form.includedDistance),
    );
    const baseAmount =
      form.billingScheme === "package"
        ? toAmount(form.packageAmount)
        : form.billingScheme === "km"
          ? extraDistance * toAmount(form.perKmRate)
          : duration.days * toAmount(form.dailyRate) +
            duration.extraHours * toAmount(form.extraHourRate);
    const additionalCharges =
      chargeTypes.reduce(
        (sum, charge) => sum + toAmount(form[charge.field]),
        0,
      ) +
      customCharges.reduce((sum, charge) => sum + toAmount(charge.amount), 0);
    const subtotal = baseAmount + additionalCharges;
    const discount = Math.min(toAmount(form.discount), subtotal);
    const taxableBase = subtotal - discount;
    const gst = taxableBase * (toAmount(form.gstRate) / 100);
    const grossTotal = taxableBase + gst;
    const advancePaid = toAmount(form.advancePaid);
    const returnPaid = toAmount(form.returnPaid);
    const totalPaid = advancePaid + returnPaid;

    return {
      distance,
      extraDistance,
      baseAmount,
      additionalCharges,
      subtotal,
      discount,
      taxableBase,
      gst,
      grossTotal,
      advancePaid,
      returnPaid,
      totalPaid,
      balanceDue: Math.max(0, grossTotal - totalPaid),
    };
  }, [customCharges, duration, form]);
  const discountPercentage =
    totals.subtotal > 0 ? (totals.discount / totals.subtotal) * 100 : 0;

  const handleSchemeChange = (billingScheme) => {
    setForm((current) => ({ ...current, billingScheme }));
  };

  const handleReset = () => {
    setForm(INITIAL_FORM);
    setCustomCharges([]);
    setDispatchChecks([]);
    setNotice("");
  };

  const handleSaveDraft = () => {
    window.localStorage.setItem(
      "ren-rental-billing-draft",
      JSON.stringify({ form, customCharges, dispatchChecks }),
    );
    setNotice("Draft saved on this device.");
  };

  const handlePrint = () => {
    setPrintAfterPreview(false);
    setIsBillPreviewOpen(true);
  };

  const handleGenerateBill = () => {
    setPrintAfterPreview(true);
    setIsBillPreviewOpen(true);
  };

  const closeBillPreview = () => {
    setPrintAfterPreview(false);
    setIsBillPreviewOpen(false);
  };

  const handlePreviewPrint = () => {
    window.print();
  };

  const toggleDispatchCheck = (check) => {
    setDispatchChecks((current) =>
      current.includes(check)
        ? current.filter((item) => item !== check)
        : [...current, check],
    );
  };

  const addCustomCharge = () => {
    setCustomCharges((current) => [
      ...current,
      { id: crypto.randomUUID(), label: "", amount: "" },
    ]);
  };

  return (
    <div className="billing-page bg-background font-body-md text-body-md text-on-surface">
      <aside className="fixed left-0 top-0 z-50 flex h-full w-72 flex-col justify-between bg-surface-container-lowest shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
        <div className="flex flex-col">
          <div className="flex h-20 items-center gap-unit bg-surface-container-lowest px-gutter">
            <span className="material-symbols-outlined text-[28px] text-primary">
              speed
            </span>
            <span
              style={{ fontSize: "24px", textTransform: "lowercase" }}
              className="font-headline-md text-headline-md tracking-tight text-on-surface"
            >
              REN RENTAL
            </span>
          </div>
          <nav className="mt-unit flex flex-col gap-1 px-unit">
            {navigationItems.map(({ path, page, icon, label }) => (
              <a
                aria-current={activePage === page ? "page" : undefined}
                className={`flex items-center gap-unit px-unit py-unit transition-all ${
                  activePage === page
                    ? "bg-primary-container font-semibold text-on-primary-container shadow-[0_0_24px_rgba(212,175,55,0.15)]"
                    : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
                }`}
                href={path}
                key={path}
              >
                <span className="material-symbols-outlined text-[20px]">
                  {icon}
                </span>
                <span className="font-body-md text-body-md">{label}</span>
              </a>
            ))}
          </nav>
        </div>
        <div className="flex flex-col gap-unit bg-surface-container-low p-gutter">
          <div className="flex items-center justify-between text-on-surface-variant">
            <span className="font-label-caps text-label-caps uppercase">
              SYSTEM STATUS
            </span>
            <span className="font-label-caps text-label-caps text-primary">
              ENCRYPTED
            </span>
          </div>
          <div className="h-1 w-full rounded-full bg-surface-container-high">
            <div className="h-1 w-full rounded-full bg-primary" />
          </div>
        </div>
      </aside>

      <div className="pl-72">
        <header className="fixed left-72 right-0 top-0 z-40 h-20 bg-surface-dim/80 shadow-[0_1px_8px_rgba(0,0,0,0.04)] backdrop-blur-xl">
          <div className="flex h-20 w-full items-center justify-between px-gutter">
            <div className="flex items-center gap-gutter">
              <a
                className="flex items-center gap-1 font-label-caps text-label-caps uppercase tracking-wider text-on-surface-variant transition-colors hover:text-primary"
                href="/"
                onClick={(event) => {
                  event.preventDefault();
                  onBack?.();
                }}
              >
                <span className="material-symbols-outlined text-[16px]">
                  arrow_back
                </span>
                <span>Back to Public Site</span>
              </a>
              <div className="h-4 w-px bg-surface-container-highest" />
              <div className="flex items-center gap-unit text-on-surface-variant">
                <span className="material-symbols-outlined text-[16px] text-primary">
                  schedule
                </span>
                <span className="font-label-caps text-label-caps uppercase tracking-widest">
                  {new Intl.DateTimeFormat("en-IN", {
                    dateStyle: "medium",
                    timeStyle: "short",
                    timeZone: "Asia/Kolkata",
                  }).format(new Date())}{" "}
                  IST
                </span>
              </div>
            </div>
            <div className="flex items-center gap-gutter">
              <div className="flex items-center gap-unit rounded-full bg-surface-container px-unit py-1">
                <span className="h-2 w-2 rounded-full bg-primary" />
                <span className="font-label-caps text-label-caps uppercase tracking-wider text-on-surface">
                  SECURITY CLEARANCE: L4 ACTIVE
                </span>
              </div>
              <div className="flex items-center gap-unit">
                <div className="flex flex-col text-right">
                  <span className="font-body-md text-body-md font-semibold leading-none text-on-surface">
                    Commander Vance
                  </span>
                  <span className="mt-1 font-label-caps text-label-caps text-on-surface-variant">
                    MASTER DISPATCH
                  </span>
                </div>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
                  <span className="material-symbols-outlined text-[18px] text-on-primary">
                    person
                  </span>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main
          className="min-h-screen w-full bg-background px-gutter pb-gutter pt-20"
          style={{
            background:
              "radial-gradient(circle at 85% 15%, rgba(212, 175, 55, 0.04) 0%, transparent 45%), radial-gradient(circle at 10% 70%, rgba(212, 175, 55, 0.03) 0%, transparent 50%), #0e0e0e",
          }}
        >
          {activePage === "billing" ? (
            <div className="flex w-full flex-col">
              <div className="mb-6 flex flex-col justify-between gap-4 rounded-DEFAULT border border-primary/20 bg-surface-container-lowest/40 p-5 shadow-sm md:flex-row md:items-center">
                <div className="flex flex-col gap-1.5">
                  <nav className="flex items-center gap-2 font-label-caps text-[11px] uppercase tracking-wider text-on-surface-variant">
                    <span>Dashboard</span>
                    <span className="text-outline">/</span>
                    <span>Rentals</span>
                    <span className="text-outline">/</span>
                    <span className="font-semibold text-primary">
                      Generate Bill
                    </span>
                  </nav>
                  <div className="mt-0.5 flex items-center gap-2.5">
                    <div className="h-5 w-1.5 rounded-full bg-primary" />
                    <h1 className="text-[22px] font-semibold tracking-wide text-on-surface">
                      Generate Final Bill
                    </h1>
                  </div>
                  <p className="max-w-2xl text-[13px] text-on-surface-variant">
                    Enter rental, charge, and payment details to prepare the
                    final invoice.
                  </p>
                </div>
                <div className="flex items-center gap-3 self-start rounded-DEFAULT border border-primary/30 bg-surface-container-low px-4 py-2 shadow-sm md:self-auto">
                  <span className="material-symbols-outlined text-primary">
                    verified
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 items-start gap-gutter lg:grid-cols-12">
                <div className="flex flex-col gap-gutter lg:col-span-8">
                  <SectionCard className="relative gap-5 overflow-hidden">
                    <SectionHeader
                      icon="directions_car"
                      number="01"
                      title="Rental Information"
                      trailing={
                        <span className="rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 text-[11px] text-primary">
                          Complete all required fields
                        </span>
                      }
                    />
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <Field
                        label="Customer Name"
                        name="customerName"
                        onChange={updateField}
                        placeholder="Customer’s name"
                        required
                        value={form.customerName}
                      />
                      <Field
                        label="Customer Phone"
                        name="customerPhone"
                        onChange={updateField}
                        placeholder="Customer's Mobile"
                        required
                        type="tel"
                        value={form.customerPhone}
                      />
                      <Field
                        label="Booking ID / Rental ID"
                        name="bookingId"
                        onChange={updateField}
                        placeholder="Booking or rental ID"
                        required
                        value={form.bookingId}
                      />
                      <Field
                        label="Vehicle"
                        name="vehicle"
                        onChange={updateField}
                        placeholder="Enter vehicle Details"
                        required
                        value={form.vehicle}
                      />
                      <div className="flex flex-col gap-1 md:col-span-2">
                        <span className="font-label-caps text-[10px] uppercase text-on-surface-variant">
                          Contractual Billing Scheme
                        </span>
                        <div className="grid grid-cols-1 gap-2 rounded-DEFAULT bg-surface-container-lowest p-1 sm:grid-cols-3">
                          {billingSchemes.map(({ id, icon, label }) => (
                            <button
                              aria-pressed={form.billingScheme === id}
                              className={`flex items-center justify-center gap-2 rounded-DEFAULT px-3 py-2 font-label-caps text-[11px] font-bold uppercase transition-all ${
                                form.billingScheme === id
                                  ? "bg-primary text-on-primary shadow-[0_0_15px_rgba(242,202,80,0.2)]"
                                  : "text-on-surface-variant hover:text-on-surface"
                              }`}
                              key={id}
                              onClick={() => handleSchemeChange(id)}
                              type="button"
                            >
                              <span className="material-symbols-outlined text-[16px]">
                                {icon}
                              </span>
                              {label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </SectionCard>

                  <SectionCard>
                    <SectionHeader
                      icon="history_toggle_off"
                      number="02"
                      title="Rental Duration Details"
                      trailing={
                        <span className="material-symbols-outlined text-[18px] text-on-surface-variant">
                          timer
                        </span>
                      }
                    />
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <DateTimeField
                        date={form.pickupDate}
                        label="Pickup / Dispatch"
                        onDateChange={(value) =>
                          setForm((current) => ({
                            ...current,
                            pickupDate: value,
                          }))
                        }
                        onTimeChange={(value) =>
                          setForm((current) => ({
                            ...current,
                            pickupTime: value,
                          }))
                        }
                        time={form.pickupTime}
                      />
                      <DateTimeField
                        date={form.returnDate}
                        label="Inspection / Return"
                        onDateChange={(value) =>
                          setForm((current) => ({
                            ...current,
                            returnDate: value,
                          }))
                        }
                        onTimeChange={(value) =>
                          setForm((current) => ({
                            ...current,
                            returnTime: value,
                          }))
                        }
                        time={form.returnTime}
                      />
                    </div>
                    <div className="flex flex-wrap items-center gap-3 rounded-DEFAULT bg-surface-container-lowest p-3">
                      <span className="font-label-caps text-[10px] uppercase tracking-wider text-on-surface-variant">
                        Computed Duration
                      </span>
                      <span className="rounded-full bg-primary/10 px-3 py-1 font-label-caps text-[10px] uppercase tracking-wider text-primary">
                        {duration.valid
                          ? `${duration.days} days ${duration.extraHours} extra hours`
                          : "Choose pickup and return date/time"}
                      </span>
                      <span className="rounded-full bg-surface-container-high px-3 py-1 font-label-caps text-[10px] uppercase tracking-wider text-on-surface">
                        {duration.valid
                          ? `${duration.totalHours} total hours`
                          : "Duration not calculated"}
                      </span>
                      {!duration.valid &&
                        form.pickupDate &&
                        form.returnDate && (
                          <span className="text-[11px] text-error">
                            Return must be after pickup.
                          </span>
                        )}
                    </div>
                  </SectionCard>

                  <SectionCard>
                    <SectionHeader
                      icon="account_balance_wallet"
                      number="03"
                      title="Base Rental Calculation"
                      trailing={
                        <span className="font-label-caps text-[10px] uppercase tracking-wider text-on-surface-variant">
                          Amounts calculate automatically
                        </span>
                      }
                    />
                    {form.billingScheme === "day" && (
                      <>
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                          <MoneyField
                            label="Daily Rate (₹ / day)"
                            name="dailyRate"
                            onChange={updateField}
                            placeholder="Enter daily rate"
                            required
                            value={form.dailyRate}
                          />
                          <MoneyField
                            label="Extra Hour Rate (₹ / hour)"
                            name="extraHourRate"
                            onChange={updateField}
                            placeholder="Enter hourly rate"
                            required
                            value={form.extraHourRate}
                          />
                        </div>
                        <div className="rounded-DEFAULT bg-surface-container-lowest p-3">
                          <SummaryRow
                            amount={formatMoney(totals.baseAmount)}
                            className="font-semibold text-primary"
                            label={`Base rental (${duration.days} days + ${duration.extraHours} extra hours)`}
                          />
                        </div>
                      </>
                    )}
                    {form.billingScheme === "km" && (
                      <>
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                          <Field
                            label="Odometer at Pickup (km)"
                            name="odometerStart"
                            onChange={updateField}
                            placeholder="Enter starting odometer"
                            inputMode="numeric"
                            required
                            type="text"
                            value={form.odometerStart}
                          />
                          <Field
                            label="Odometer at Return (km)"
                            name="odometerReturn"
                            onChange={updateField}
                            placeholder="Enter return odometer"
                            inputMode="numeric"
                            required
                            type="text"
                            value={form.odometerReturn}
                          />
                          <Field
                            label="Included Distance (km)"
                            name="includedDistance"
                            onChange={updateField}
                            placeholder="Enter included kilometers"
                            inputMode="numeric"
                            required
                            type="text"
                            value={form.includedDistance}
                          />
                          <MoneyField
                            label="Extra Distance Rate (₹ / km)"
                            name="perKmRate"
                            onChange={updateField}
                            placeholder="Enter per-km rate"
                            required
                            value={form.perKmRate}
                          />
                        </div>
                        <div className="grid grid-cols-1 gap-3 rounded-DEFAULT bg-surface-container-lowest p-3 sm:grid-cols-3">
                          <SummaryRow
                            amount={`${totals.distance} km`}
                            className="text-[12px] text-on-surface-variant"
                            label="Total distance"
                          />
                          <SummaryRow
                            amount={`${totals.extraDistance} km`}
                            className="text-[12px] text-on-surface-variant"
                            label="Chargeable distance"
                          />
                          <SummaryRow
                            amount={formatMoney(totals.baseAmount)}
                            className="font-semibold text-primary"
                            label="Distance charge"
                          />
                        </div>
                      </>
                    )}
                    {form.billingScheme === "package" && (
                      <>
                        <MoneyField
                          label="Complete Package Price (₹)"
                          name="packageAmount"
                          onChange={updateField}
                          placeholder="Enter the fixed price for the full rental"
                          required
                          value={form.packageAmount}
                        />
                        <div className="rounded-DEFAULT bg-surface-container-lowest p-3">
                          <SummaryRow
                            amount={formatMoney(totals.baseAmount)}
                            className="font-semibold text-primary"
                            label="Fixed package amount"
                          />
                        </div>
                      </>
                    )}
                  </SectionCard>

                  <SectionCard>
                    <SectionHeader
                      icon="receipt"
                      number="04"
                      title="Additional Itemized Charges"
                      trailing={
                        <span className="rounded-full border border-primary/20 bg-surface-container-lowest px-3 py-1 font-label-caps text-[10px] uppercase tracking-wider text-primary">
                          CHARGES: {formatMoney(totals.additionalCharges)}
                        </span>
                      }
                    />
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                      {chargeTypes.map(({ icon, label, detail, field }) => (
                        <div
                          className="flex items-center gap-2 bg-surface-container-lowest p-2.5"
                          key={label}
                        >
                          <span className="material-symbols-outlined text-[18px] text-on-surface-variant">
                            {icon}
                          </span>
                          <label className="flex min-w-0 flex-1 flex-col gap-1">
                            <span className="text-[12px] text-on-surface">
                              {label}
                            </span>
                            <span className="font-label-caps text-[9px] text-secondary">
                              {detail}
                            </span>
                          </label>
                          <input
                            aria-label={`${label} amount`}
                            className="billing-input w-20 bg-surface-container px-2 py-2 text-[13px] text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
                            inputMode="decimal"
                            name={field}
                            onChange={updateField}
                            placeholder="₹ 0.00"
                            type="text"
                            value={form[field]}
                            style={{ borderRadius: "5px" }}
                          />
                        </div>
                      ))}
                    </div>
                    <div className="flex flex-col gap-3">
                      {customCharges.map((charge) => (
                        <div
                          className="grid grid-cols-1 items-end gap-2 rounded-DEFAULT bg-surface-container-lowest p-2.5 sm:grid-cols-[1fr_180px_auto]"
                          key={charge.id}
                        >
                          <Field
                            label="Custom charge description"
                            onChange={(event) =>
                              updateCustomCharge(
                                charge.id,
                                "label",
                                event.target.value,
                              )
                            }
                            placeholder="Enter charge description"
                            value={charge.label}
                          />
                          <MoneyField
                            label="Amount (₹)"
                            onChange={(event) =>
                              updateCustomCharge(
                                charge.id,
                                "amount",
                                event.target.value,
                              )
                            }
                            placeholder="Enter amount"
                            value={charge.amount}
                          />
                          <button
                            aria-label="Remove custom charge"
                            className="flex h-10 items-center justify-center rounded-DEFAULT px-3 text-error hover:bg-surface-container"
                            onClick={() =>
                              setCustomCharges((current) =>
                                current.filter((item) => item.id !== charge.id),
                              )
                            }
                            type="button"
                          >
                            <span className="material-symbols-outlined">
                              delete
                            </span>
                          </button>
                        </div>
                      ))}
                    </div>
                    <button
                      className="flex w-full items-center justify-center gap-1.5 rounded-DEFAULT bg-surface-container py-2 font-label-caps text-[11px] uppercase tracking-wider text-primary transition-colors hover:bg-surface-container-high"
                      onClick={addCustomCharge}
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        add_circle
                      </span>
                      Add Custom Surcharge Item
                    </button>
                  </SectionCard>

                  <SectionCard>
                    <SectionHeader
                      icon="payments"
                      number="05"
                      title="Deposit & Discounts"
                      trailing={
                        <span className="material-symbols-outlined text-[18px] text-on-surface-variant">
                          security
                        </span>
                      }
                    />
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                      <MoneyField
                        label="Advance Payment (₹)"
                        name="advancePaid"
                        onChange={updateField}
                        placeholder="Enter amount received in advance"
                        value={form.advancePaid}
                      />
                      <MoneyField
                        label="Paid at Return (₹)"
                        name="returnPaid"
                        onChange={updateField}
                        placeholder="Enter amount paid at return"
                        value={form.returnPaid}
                      />
                      <MoneyField
                        label="Security Deposit Collected (₹)"
                        name="securityDeposit"
                        onChange={updateField}
                        placeholder="Enter security deposit"
                        value={form.securityDeposit}
                      />
                      <MoneyField
                        label="Discount (₹)"
                        name="discount"
                        onChange={updateField}
                        placeholder="Enter discount amount"
                        value={form.discount}
                      />
                    </div>
                  </SectionCard>
                </div>

                <aside className="sticky top-24 flex flex-col gap-gutter lg:col-span-4">
                  <SectionCard>
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[20px] text-primary">
                          receipt_long
                        </span>
                        <div>
                          <span className="block font-label-caps text-[14px] uppercase tracking-widest text-primary">
                            Total
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 text-[13px] text-on-surface-variant">
                      <SummaryRow
                        amount={formatMoney(totals.baseAmount)}
                        label="Base Rental Amount"
                      />
                      <SummaryRow
                        amount={formatMoney(totals.additionalCharges)}
                        label="Additional Charges"
                      />
                      <div className="my-0.5 h-px w-full bg-surface-container-high" />
                      <SummaryRow
                        amount={formatMoney(totals.subtotal)}
                        className="font-semibold text-on-surface"
                        label="Subtotal"
                      />
                      <SummaryRow
                        amount={`-${formatMoney(totals.discount)}`}
                        label="Discount"
                      />
                      <div className="my-0.5 h-px w-full bg-surface-container-high" />
                      <SummaryRow
                        amount={formatMoney(totals.grossTotal)}
                        className="text-[14px] font-semibold text-on-surface"
                        amountClass="text-[18px] font-bold text-primary"
                        label="Gross Rental Total"
                      />
                    </div>
                    <div className="flex flex-col gap-2 rounded-DEFAULT bg-surface-container-low p-3.5 text-[12px]">
                      <span className="font-label-caps text-[10px] uppercase text-on-surface-variant">
                        Payment Summary
                      </span>
                      <SummaryRow
                        amount={`-${formatMoney(totals.advancePaid)}`}
                        label="Advance Paid"
                      />
                      <SummaryRow
                        amount={`-${formatMoney(totals.returnPaid)}`}
                        label="Paid at Return"
                      />
                      <SummaryRow
                        amount={formatMoney(totals.totalPaid)}
                        className="border-t border-surface-container pt-2 font-semibold text-on-surface"
                        label="Total Paid"
                      />
                      <SummaryRow
                        amount={formatMoney(totals.balanceDue)}
                        className="font-semibold text-primary"
                        label="Balance Due"
                      />
                    </div>
                    <div
                      className="flex flex-col gap-1 rounded-DEFAULT p-4 shadow-lg"
                      style={{
                        background:
                          "linear-gradient(135deg, #e4be4a 0%, #d4af37 45%, #b58d22 100%)",
                        color: "#1a1500",
                        border: "1px solid rgba(255, 240, 160, 0.4)",
                        boxShadow:
                          "0 10px 25px rgba(212, 175, 55, 0.3), inset 0 1px 2px rgba(255, 255, 255, 0.6)",
                      }}
                    >
                      <span className="font-label-caps text-[10px] font-bold uppercase tracking-widest">
                        TOTAL BILL
                      </span>
                      <span className="text-[28px] font-bold tracking-tight">
                        {formatMoney(totals.grossTotal)}
                      </span>
                    </div>
                  </SectionCard>

                  <div
                    className="relative my-1 overflow-hidden rounded-DEFAULT p-4 shadow-xl"
                    style={{
                      background:
                        "radial-gradient(circle at 100% 0%, rgba(242, 202, 80, 0.22) 0%, transparent 60%), linear-gradient(135deg, rgba(38, 33, 20, 0.95) 0%, rgba(20, 18, 14, 0.98) 100%)",
                      border: "1.5px solid rgba(242, 202, 80, 0.45)",
                      boxShadow:
                        "0 12px 35px -8px rgba(0, 0, 0, 0.8), 0 0 25px rgba(212, 175, 55, 0.18), inset 0 1px 1px rgba(255, 235, 160, 0.3)",
                    }}
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-primary">
                        <span className="material-symbols-outlined text-[16px]">
                          military_tech
                        </span>
                        <span className="font-label-caps text-[10px] font-bold uppercase tracking-wider">
                          {totals.discount > 0
                            ? "DISCOUNT APPLIED"
                            : "DISCOUNT SUMMARY"}
                        </span>
                        <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-primary/40 bg-primary/10 text-primary shadow-sm">
                          <span className="material-symbols-outlined text-[14px]">
                            verified
                          </span>
                        </div>
                      </div>
                      <span className="rounded-full bg-primary px-2 py-0.5 font-label-caps text-[9px] font-bold uppercase tracking-wider text-on-primary shadow-sm">
                        {discountPercentage.toFixed(1)}% SAVED
                      </span>
                    </div>
                    <div className="flex items-baseline justify-between gap-2">
                      <div className="flex flex-col">
                        <span className="font-label-caps text-[10px] uppercase tracking-widest text-secondary">
                          TOTAL DISCOUNT
                        </span>
                        <div className="flex items-baseline gap-1.5">
                          <span
                            className="text-[26px] font-bold leading-none tracking-tight text-primary"
                            style={{
                              textShadow: "0 0 18px rgba(242, 202, 80, 0.4)",
                            }}
                          >
                            {formatMoney(totals.discount)}
                          </span>
                          <span className="font-label-caps text-[11px] font-semibold text-primary">
                            {totals.discount > 0 ? "Flat Savings" : "SAVINGS"}
                          </span>
                        </div>
                      </div>
                      {/* <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-primary/40 bg-primary/10 text-primary shadow-sm">
                      <span className="material-symbols-outlined text-[20px]">
                        verified
                      </span>
                    </div> */}
                    </div>
                    <div className="mt-2 flex flex-col gap-0.5 border-t border-primary/20 pt-2">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-medium text-on-surface">
                          {discountPercentage.toFixed(1)}% discount applied
                        </span>
                        <span className="font-semibold text-primary">
                          -{formatMoney(totals.discount)}
                        </span>
                      </div>
                      <span className="font-label-caps text-[9px] text-secondary">
                        Percentage is calculated from the rental subtotal.
                      </span>
                    </div>
                  </div>

                  <SectionCard>
                    <span className="font-label-caps text-label-caps uppercase tracking-widest text-primary">
                      DISPATCH STATUS
                    </span>
                    {dispatchCheckItems.map((check) => (
                      <label
                        className="flex cursor-pointer items-center justify-between gap-3 text-[13px] text-on-surface"
                        key={check}
                      >
                        <span>{check}</span>
                        <input
                          checked={dispatchChecks.includes(check)}
                          className="h-4 w-4 accent-[#f2ca50]"
                          onChange={() => toggleDispatchCheck(check)}
                          type="checkbox"
                        />
                      </label>
                    ))}
                  </SectionCard>
                </aside>
              </div>

              <div
                className="sticky bottom-0 z-30 mt-6 flex flex-col items-center justify-between gap-3 rounded-DEFAULT border border-primary/20 px-5 py-3 shadow-2xl backdrop-blur-xl sm:flex-row"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(22, 22, 22, 0.92) 0%, rgba(10, 10, 10, 0.98) 100%)",
                  boxShadow:
                    "0 -10px 40px rgba(0, 0, 0, 0.7), 0 0 25px rgba(212, 175, 55, 0.08)",
                }}
              >
                <div className="flex items-center gap-2.5">
                  <button
                    className="flex items-center gap-1.5 rounded-DEFAULT border border-white/10 px-3.5 py-2 font-label-caps text-[11px] uppercase tracking-wider text-on-surface-variant transition-colors hover:text-on-surface"
                    onClick={handleReset}
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      restart_alt
                    </span>
                    Reset Form
                  </button>
                  <button
                    className="flex items-center gap-1.5 rounded-DEFAULT border border-primary/20 bg-surface-container px-3.5 py-2 font-label-caps text-[11px] uppercase tracking-wider text-on-surface transition-colors hover:bg-surface-container-high"
                    onClick={handleSaveDraft}
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      save
                    </span>
                    Save Draft
                  </button>
                  {notice && (
                    <span
                      aria-live="polite"
                      className="text-[11px] text-primary"
                    >
                      {notice}
                    </span>
                  )}
                </div>
                <div className="flex w-full justify-end gap-2.5 sm:w-auto">
                  <button
                    className="flex items-center gap-1.5 rounded-DEFAULT border border-primary/30 bg-surface-container px-3.5 py-2 font-label-caps text-[11px] uppercase tracking-wider text-primary transition-colors hover:bg-surface-container-high"
                    onClick={handlePrint}
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      visibility
                    </span>
                    Preview Bill
                  </button>
                  <button
                    className="flex items-center gap-2 rounded-DEFAULT border border-primary/50 px-5 py-2 text-[13px] font-semibold uppercase tracking-wider text-on-primary shadow-[0_0_20px_rgba(242,202,80,0.25)] transition-all"
                    onClick={handleGenerateBill}
                    style={{
                      background:
                        "linear-gradient(135deg, #f0cc5b 0%, #d4af37 50%, #ba9223 100%)",
                      color: "#1c1500",
                    }}
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      picture_as_pdf
                    </span>
                    Create Final Bill &amp; Generate PDF
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex w-full flex-col gap-gutter">
              <div className="rounded-DEFAULT border border-primary/20 bg-surface-container-lowest/40 p-5 shadow-sm">
                <nav className="mb-2 flex items-center gap-2 font-label-caps text-[11px] uppercase tracking-wider text-on-surface-variant">
                  <span>Dashboard</span>
                  <span className="text-outline">/</span>
                  <span className="font-semibold text-primary">
                    {adminPageDetails[activePage].title}
                  </span>
                </nav>
                <h1 className="text-[22px] font-semibold tracking-wide text-on-surface">
                  {adminPageDetails[activePage].title}
                </h1>
              </div>
              <SectionCard className="gap-2">
                <h2 className="text-[16px] font-semibold text-on-surface">
                  {adminPageDetails[activePage].title}
                </h2>
                <p className="text-[13px] text-on-surface-variant">
                  {adminPageDetails[activePage].description}
                </p>
              </SectionCard>
            </div>
          )}
        </main>
      </div>
      {isBillPreviewOpen && (
        <div className="billing-invoice-overlay">
          <div
            aria-labelledby="billing-invoice-title"
            aria-modal="true"
            className="billing-invoice-dialog"
            role="dialog"
          >
            <div className="billing-invoice-toolbar">
              <div>
                <span className="billing-invoice-toolbar-eyebrow">
                  REN RENTAL · BILLING
                </span>
                <h1 id="billing-invoice-title">Final Bill Preview</h1>
                <p>This bill preview is read-only.</p>
              </div>
              <div className="billing-invoice-toolbar-actions">
                <button
                  className="billing-invoice-close"
                  onClick={closeBillPreview}
                  type="button"
                >
                  Close
                </button>
                <button
                  className="billing-invoice-print"
                  onClick={handlePreviewPrint}
                  type="button"
                >
                  <span className="material-symbols-outlined">
                    picture_as_pdf
                  </span>
                  Print / Save PDF
                </button>
              </div>
            </div>

            <article className="billing-invoice-sheet">
              <header className="billing-invoice-header">
                <div className="billing-invoice-brand">
                  <span className="material-symbols-outlined">
                    directions_car
                  </span>
                  <div className="billing-invoice-brand-copy">
                    <strong>Ren Rental</strong>
                    <span className="billing-invoice-brand-divider">|</span>
                    <span className="billing-invoice-tagline">
                      PREMIUM SELF-DRIVE RENTALS
                    </span>
                  </div>
                </div>
                <div className="billing-invoice-meta">
                  <span>FINAL RENTAL BILL</span>
                  <strong>{form.bookingId || "Rental invoice"}</strong>
                  <small>
                    {new Intl.DateTimeFormat("en-IN", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    }).format(new Date())}
                  </small>
                </div>
              </header>

              <div className="billing-invoice-layout">
                <div className="billing-invoice-main-column">
                  <InvoiceCard>
                    <InvoiceSectionTitle
                      icon="directions_car"
                      title="Rental Information"
                    />
                    <div className="billing-invoice-fields">
                      <InvoiceField
                        label="Customer Name"
                        value={form.customerName}
                      />
                      <InvoiceField
                        label="Customer Phone"
                        value={form.customerPhone}
                      />
                      <InvoiceField
                        label="Booking ID / Rental ID"
                        value={form.bookingId}
                      />
                      <InvoiceField label="Vehicle" value={form.vehicle} />
                      <InvoiceField
                        label="Billing Scheme"
                        value={
                          form.billingScheme === "day"
                            ? "Day Basis"
                            : form.billingScheme === "km"
                              ? "KM Basis"
                              : "Complete Package"
                        }
                      />
                    </div>
                  </InvoiceCard>

                  <InvoiceCard>
                    <InvoiceSectionTitle
                      icon="history_toggle_off"
                      title="Rental Duration Details"
                    />
                    <div className="billing-invoice-fields">
                      <InvoiceField
                        label="Pickup / Dispatch"
                        value={`${form.pickupDate ? formatSelectedDate(form.pickupDate) : "—"} · ${form.pickupTime ? formatSelectedTime(form.pickupTime) : "—"}`}
                      />
                      <InvoiceField
                        label="Inspection / Return"
                        value={`${form.returnDate ? formatSelectedDate(form.returnDate) : "—"} · ${form.returnTime ? formatSelectedTime(form.returnTime) : "—"}`}
                      />
                      <InvoiceField
                        label="Computed Duration"
                        value={
                          duration.valid
                            ? `${duration.days} days, ${duration.extraHours} extra hours (${duration.totalHours} total hours)`
                            : "Not calculated"
                        }
                      />
                    </div>
                  </InvoiceCard>

                  <InvoiceCard>
                    <InvoiceSectionTitle
                      icon="account_balance_wallet"
                      title="Base Rental Calculation"
                    />
                    <div className="billing-invoice-fields">
                      {form.billingScheme === "day" && (
                        <>
                          <InvoiceField
                            label="Daily Rate"
                            value={`${form.dailyRate ? formatMoney(toAmount(form.dailyRate)) : "—"} / day`}
                          />
                          <InvoiceField
                            label="Extra Hour Rate"
                            value={`${form.extraHourRate ? formatMoney(toAmount(form.extraHourRate)) : "—"} / hour`}
                          />
                          <InvoiceField
                            label="Duration Charge"
                            value={formatMoney(totals.baseAmount)}
                          />
                        </>
                      )}
                      {form.billingScheme === "km" && (
                        <>
                          <InvoiceField
                            label="Odometer at Pickup"
                            value={`${form.odometerStart || "—"} km`}
                          />
                          <InvoiceField
                            label="Odometer at Return"
                            value={`${form.odometerReturn || "—"} km`}
                          />
                          <InvoiceField
                            label="Distance / Chargeable Distance"
                            value={`${totals.distance} km / ${totals.extraDistance} km`}
                          />
                          <InvoiceField
                            label="Distance Charge"
                            value={formatMoney(totals.baseAmount)}
                          />
                        </>
                      )}
                      {form.billingScheme === "package" && (
                        <>
                          <InvoiceField
                            label="Complete Package Price"
                            value={
                              form.packageAmount
                                ? formatMoney(toAmount(form.packageAmount))
                                : "—"
                            }
                          />
                          <InvoiceField
                            label="Package Charge"
                            value={formatMoney(totals.baseAmount)}
                          />
                        </>
                      )}
                    </div>
                  </InvoiceCard>

                  <InvoiceCard>
                    <InvoiceSectionTitle
                      icon="receipt"
                      title="Additional Itemized Charges"
                    />
                    <div className="billing-invoice-lines">
                      {chargeTypes.map(({ field, label }) => (
                        <InvoiceRow
                          key={field}
                          label={label}
                          value={formatMoney(toAmount(form[field]))}
                        />
                      ))}
                      {customCharges.map((charge) => (
                        <InvoiceRow
                          key={charge.id}
                          label={charge.label || "Custom charge"}
                          value={formatMoney(toAmount(charge.amount))}
                        />
                      ))}
                    </div>
                  </InvoiceCard>

                  <InvoiceCard>
                    <InvoiceSectionTitle
                      icon="payments"
                      title="Deposit & Discounts"
                    />
                    <div className="billing-invoice-fields">
                      <InvoiceField
                        label="Advance Payment"
                        value={formatMoney(totals.advancePaid)}
                      />
                      <InvoiceField
                        label="Paid at Return"
                        value={formatMoney(totals.returnPaid)}
                      />
                      <InvoiceField
                        label="Security Deposit Collected"
                        value={formatMoney(toAmount(form.securityDeposit))}
                      />
                    </div>
                  </InvoiceCard>
                </div>

                <aside className="billing-invoice-side-column">
                  <InvoiceCard>
                    <InvoiceSectionTitle icon="receipt_long" title="Total" />
                    <div className="billing-invoice-lines">
                      <InvoiceRow
                        label="Base Rental Amount"
                        value={formatMoney(totals.baseAmount)}
                      />
                      <InvoiceRow
                        label="Additional Charges"
                        value={formatMoney(totals.additionalCharges)}
                      />
                      <InvoiceRow
                        label="Subtotal"
                        value={formatMoney(totals.subtotal)}
                        emphasis
                      />
                      <InvoiceRow
                        label="Discount"
                        value={`-${formatMoney(totals.discount)}`}
                      />
                      {toAmount(form.gstRate) > 0 && (
                        <InvoiceRow
                          label={`GST (${toAmount(form.gstRate)}%)`}
                          value={formatMoney(totals.gst)}
                        />
                      )}
                      <InvoiceRow
                        label="Gross Rental Total"
                        value={formatMoney(totals.grossTotal)}
                        emphasis
                      />
                    </div>
                    <div className="billing-invoice-payment-summary">
                      <span>PAYMENT SUMMARY</span>
                      <InvoiceRow
                        label="Advance Paid"
                        value={`-${formatMoney(totals.advancePaid)}`}
                      />
                      <InvoiceRow
                        label="Paid at Return"
                        value={`-${formatMoney(totals.returnPaid)}`}
                      />
                      <InvoiceRow
                        label="Total Paid"
                        value={formatMoney(totals.totalPaid)}
                        emphasis
                      />
                      <InvoiceRow
                        label="Balance Due"
                        value={formatMoney(totals.balanceDue)}
                        emphasis
                      />
                    </div>
                    <div className="billing-invoice-total">
                      <span>TOTAL BILL</span>
                      <strong>{formatMoney(totals.grossTotal)}</strong>
                    </div>
                  </InvoiceCard>

                  <InvoiceCard className="billing-invoice-discount-card">
                    <InvoiceSectionTitle
                      icon="military_tech"
                      title="Discount Summary"
                    />
                    <div className="billing-invoice-discount-total">
                      <strong>{formatMoney(totals.discount)}</strong>
                      <span>{discountPercentage.toFixed(1)}% SAVED</span>
                    </div>
                    <InvoiceRow
                      label={`${discountPercentage.toFixed(1)}% discount applied`}
                      value={`-${formatMoney(totals.discount)}`}
                    />
                  </InvoiceCard>

                  <InvoiceCard>
                    <InvoiceSectionTitle
                      icon="fact_check"
                      title="Dispatch Status"
                    />
                    <div className="billing-invoice-lines">
                      {dispatchCheckItems.map((check) => (
                        <InvoiceRow
                          key={check}
                          label={check}
                          value={
                            dispatchChecks.includes(check)
                              ? "Verified"
                              : "Pending"
                          }
                        />
                      ))}
                    </div>
                  </InvoiceCard>
                </aside>
              </div>
              <footer className="billing-invoice-footer">
                <span>REN RENTAL · Thank you for choosing us.</span>
                <nav
                  aria-label="Ren Rental contact links"
                  className="billing-invoice-social-links"
                >
                  {invoiceSocialLinks.map(({ label, href, icon }) => (
                    <a
                      aria-label={label}
                      className="billing-invoice-social-link"
                      href={href}
                      key={label}
                      rel={href.startsWith("http") ? "noreferrer" : undefined}
                      target={href.startsWith("http") ? "_blank" : undefined}
                      title={label}
                    >
                      <span className="material-symbols-outlined">{icon}</span>
                      <span>{label}</span>
                    </a>
                  ))}
                </nav>
              </footer>
            </article>
          </div>
        </div>
      )}
    </div>
  );
}
