"use client";
import { useEffect, useState } from 'react';
import { ArrowRight, CalendarDays, Check, ChevronRight, Fuel, MapPin, Star, Users, Zap, ShieldCheck } from 'lucide-react';
import { Badge, Empty, Image, Price } from '../components/MarketplaceUI';
import { money, today } from '../utils';
import { write } from '../store';
export function Details({ id, vehicles, bookings, saveBookings, notify, role }) {
  const controlClass = "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100";
  const v = vehicles.find((x) => x.id === id);
  const bookingDraftKey = `rw_booking_draft_${id}`;
  const [activeImage, setActiveImage] = useState({ vehicleId: null, index: 0 });
  const [errors, setErrors] = useState({});
  const [pickup, setPickup] = useState(""),
    [returnDate, setReturnDate] = useState(""),
    [name, setName] = useState(""),
    [phone, setPhone] = useState(""),
    [notes, setNotes] = useState("");
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(bookingDraftKey);
      if (saved) {
        const draft = JSON.parse(saved);
        setPickup(draft.pickup || "");
        setReturnDate(draft.returnDate || "");
        setName(draft.name || "");
        setPhone(draft.phone || "");
        setNotes(draft.notes || "");
      }
    } catch {
      sessionStorage.removeItem(bookingDraftKey);
    }
  }, [bookingDraftKey]);
  const days =
      pickup && returnDate
        ? Math.ceil((new Date(returnDate) - new Date(pickup)) / 86400000)
      : 0,
    total = days > 0 ? days * (v?.price || 0) : 0;
  const goToCustomerLogin = () => {
    const next = `/vehicles/${encodeURIComponent(id)}`;
    try {
      sessionStorage.setItem(
        bookingDraftKey,
        JSON.stringify({ pickup, returnDate, name, phone, notes }),
      );
    } catch {
      notify("Your booking details could not be saved. Please try again.");
      return;
    }
    if (role) {
      write("role", "Customer");
      window.location.href = next;
    } else {
      window.location.href = `/login?role=Customer&next=${encodeURIComponent(next)}`;
    }
  };
  if (!v)
    return (
      <main className="mx-auto min-h-[65vh] max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
        <Empty
          title="Ride not found"
          desc="This vehicle may have been removed."
          action={
            <a href="/vehicles" className="inline-flex min-h-11 items-center justify-center rounded-xl bg-indigo-600 px-5 text-sm font-semibold text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-700">
              Browse rides
            </a>
          }
        />
      </main>
    );
  const isAvailable = v.available !== false;
  const images = v.images?.length ? v.images : [v.image];
  const selectedImageIndex = activeImage.vehicleId === v.id
    ? Math.min(activeImage.index, images.length - 1)
    : 0;
  const selectedImage = images[selectedImageIndex];
  const submit = (e) => {
    e.preventDefault();
    if (!isAvailable) {
      notify("This vehicle is currently unavailable for booking.");
      return;
    }
    const nextErrors = {};
    const todayDate = new Date(`${today}T00:00:00`);
    const pickupDate = pickup ? new Date(`${pickup}T00:00:00`) : null;
    const returnDateValue = returnDate ? new Date(`${returnDate}T00:00:00`) : null;
    if (!pickup) nextErrors.pickup = "Choose a pickup date.";
    else if (pickupDate < todayDate) nextErrors.pickup = "Pickup date cannot be in the past.";
    if (!returnDate) nextErrors.returnDate = "Choose a return date.";
    else if (pickupDate && returnDateValue <= pickupDate) nextErrors.returnDate = "Return date must be after pickup.";
    if (!name.trim()) nextErrors.name = "Your name is required.";
    const trimmedPhone = phone.trim();
    const phoneDigits = trimmedPhone.replace(/\D/g, "");
    if (!trimmedPhone) nextErrors.phone = "Your phone number is required.";
    else if (!/^[+\d\s()-]+$/.test(trimmedPhone) || phoneDigits.length < 10 || phoneDigits.length > 15) {
      nextErrors.phone = "Enter a valid phone number with 10 to 15 digits.";
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    if (role !== "Customer") {
      goToCustomerLogin();
      return;
    }
    const b = {
      id: `BK-${Date.now().toString().slice(-6)}`,
      vehicleId: v.id,
      vehicle: v.name,
      customer: name.trim(),
      phone: trimmedPhone,
      pickup,
      returnDate,
      days,
      total,
      status: "Pending",
      notes,
      createdAt: new Date().toISOString(),
    };
    saveBookings([b, ...bookings]);
    sessionStorage.removeItem(bookingDraftKey);
    notify("Booking request sent!");
    setPickup("");
    setReturnDate("");
    setName("");
    setPhone("");
    setNotes("");
    setErrors({});
  };
  return (
    <main className="mx-auto min-h-[65vh] max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="mb-6 flex flex-wrap items-center gap-2 text-xs font-medium text-slate-400">
        <a className="transition hover:text-indigo-700" href="/">Home</a>
        <ChevronRight size={14} />
        <a className="transition hover:text-indigo-700" href="/vehicles">Vehicles</a>
        <ChevronRight size={14} />
        <span>{v.name}</span>
      </div>
      <div className="mb-7 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <Badge>{v.category}</Badge>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">{v.name}</h1>
          <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-500">
            <span className="inline-flex items-center gap-1.5">
              <MapPin size={16} className="text-slate-400" />
              {v.location}
            </span>
            <span className="inline-flex items-center gap-1.5 text-amber-600">
              <Star size={16} fill="currentColor" />
              {v.rating} <small>(sample rating)</small>
            </span>
          </div>
        </div>
        <Price value={v.price} />
      </div>
      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1.65fr)_minmax(320px,0.85fr)]">
        <div className="min-w-0">
          <div className="h-[260px] overflow-hidden rounded-3xl bg-slate-100 sm:h-[420px]">
            <Image className="h-full w-full object-cover" src={selectedImage} alt={`${v.name} vehicle photo`} />
          </div>
          {images.length > 1 && <div className="mt-3 flex gap-3 overflow-x-auto pb-1" aria-label="Vehicle photos">
            {images.map((src, index) => <button type="button" key={`${v.id}-photo-${index}`} className={`h-16 w-24 shrink-0 overflow-hidden rounded-xl border-2 bg-slate-100 transition sm:h-20 sm:w-28 ${selectedImageIndex === index ? "border-indigo-500" : "border-transparent hover:border-slate-300"}`} onClick={() => setActiveImage({ vehicleId: v.id, index })} aria-label={`Show vehicle photo ${index + 1}`} aria-pressed={selectedImageIndex === index}><Image className="h-full w-full object-cover" src={src} alt=""/></button>)}
          </div>}
          <div className="mt-5 grid grid-cols-2 gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:grid-cols-4 sm:p-5">
            {[
              [Users, `${v.seats} seats`],
              [Fuel, v.fuel],
              [Zap, v.transmission],
              [CalendarDays, `Model year ${v.year}`],
            ].map(([Icon, text]) => (
              <span className="flex items-center gap-2 text-xs font-semibold text-slate-700 sm:text-sm" key={text}>
                <Icon className="shrink-0 text-indigo-600" size={18} />
                {text}
              </span>
            ))}
          </div>
          <div className="border-b border-slate-100 py-6">
            <h2 className="text-lg font-bold text-slate-900">About this ride</h2>
            <p className="mt-2 text-sm leading-7 text-slate-600">{v.description}</p>
          </div>
          <div className="border-b border-slate-100 py-6">
            <h2 className="text-lg font-bold text-slate-900">Features</h2>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {v.features.map((f) => (
                <span className="inline-flex items-center gap-2 text-sm text-slate-600" key={f}>
                  <Check className="text-emerald-600" size={16} />
                  {f}
                </span>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-4 border-b border-slate-100 py-6">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700">
              {v.owner
                ?.split(" ")
                .map((n) => n[0])
                .join("")}
            </span>
            <div className="min-w-0 flex-1">
              <small className="text-[10px] font-bold uppercase tracking-wider text-slate-400">LISTED BY</small>
              <h3 className="mt-0.5 font-bold text-slate-900">{v.owner || "RentWheels owner"}</h3>
              <p className="text-xs text-slate-500">Demo vehicle owner</p>
            </div>
            <Badge tone={isAvailable ? "available" : "warning"}>
              {isAvailable ? "Available" : "Unavailable"}
            </Badge>
          </div>
          <div className="py-6">
            <h2 className="text-lg font-bold text-slate-900">Rental notes</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Booking requests are for demonstration only. Confirm the details
              with the owner before making travel plans.
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Please return the vehicle in the same condition it was received.
            </p>
          </div>
        </div>
        <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-lg shadow-slate-900/[0.06] sm:p-6 lg:sticky lg:top-24">
          <div className="mb-5 flex items-start justify-between border-b border-slate-100 pb-5">
            <div>
              <Price value={v.price} />
              <span className="mt-1 flex items-center gap-1 text-xs font-semibold text-amber-600">
                <Star size={14} fill="currentColor" />
                {v.rating} sample rating
              </span>
            </div>
            <small className="pt-1 text-xs text-slate-500">per day</small>
          </div>
          <form onSubmit={submit} noValidate className="space-y-4">
            {!isAvailable && (
              <p className="rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-3 text-sm font-medium text-amber-800" role="status">
                This vehicle is currently unavailable for booking.
              </p>
            )}
            <div className="grid grid-cols-2 gap-3">
              <label className="flex min-w-0 flex-col gap-2">
                <span className="text-xs font-semibold text-slate-700">Pickup date</span>
                <input
                  className={controlClass}
                  required
                  type="date"
                  min={today}
                  value={pickup}
                  aria-invalid={Boolean(errors.pickup)}
                  aria-describedby={errors.pickup ? "pickup-error" : undefined}
                  onChange={(e) => {
                    setPickup(e.target.value);
                    setErrors((current) => ({ ...current, pickup: "", returnDate: "" }));
                  }}
                />
                {errors.pickup && <small id="pickup-error" className="text-xs font-medium text-rose-600">{errors.pickup}</small>}
              </label>
              <label className="flex min-w-0 flex-col gap-2">
                <span className="text-xs font-semibold text-slate-700">Return date</span>
                <input
                  className={controlClass}
                  required
                  type="date"
                  min={pickup || today}
                  value={returnDate}
                  aria-invalid={Boolean(errors.returnDate)}
                  aria-describedby={errors.returnDate ? "return-date-error" : undefined}
                  onChange={(e) => {
                    setReturnDate(e.target.value);
                    setErrors((current) => ({ ...current, returnDate: "" }));
                  }}
                />
                {errors.returnDate && <small id="return-date-error" className="text-xs font-medium text-rose-600">{errors.returnDate}</small>}
              </label>
            </div>
            <label className="flex flex-col gap-2">
              <span className="text-xs font-semibold text-slate-700">Your name</span>
              <input
                className={controlClass}
                required
                placeholder="e.g. Jamie Rivera"
                value={name}
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? "name-error" : undefined}
                onChange={(e) => {
                  setName(e.target.value);
                  setErrors((current) => ({ ...current, name: "" }));
                }}
              />
              {errors.name && <small id="name-error" className="text-xs font-medium text-rose-600">{errors.name}</small>}
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-xs font-semibold text-slate-700">Phone number</span>
              <input
                className={controlClass}
                required
                type="tel"
                placeholder="(555) 000-0000"
                value={phone}
                aria-invalid={Boolean(errors.phone)}
                aria-describedby={errors.phone ? "phone-error" : undefined}
                onChange={(e) => {
                  setPhone(e.target.value);
                  setErrors((current) => ({ ...current, phone: "" }));
                }}
              />
              {errors.phone && <small id="phone-error" className="text-xs font-medium text-rose-600">{errors.phone}</small>}
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-xs font-semibold text-slate-700">
                Notes <small>Optional</small>
              </span>
              <textarea
                className={controlClass}
                rows="3"
                placeholder="Anything the owner should know?"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </label>
            <div className="flex items-center justify-between border-t border-slate-100 pt-4 text-sm">
              <span className="text-xs text-slate-500">
                {days > 0
                  ? `${money(v.price)} × ${days} day${days > 1 ? "s" : ""}`
                  : "Select dates to see estimate"}
              </span>
              <b className="text-base font-bold text-slate-900">{money(total)}</b>
            </div>
            <button
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 text-sm font-semibold text-white shadow-md shadow-indigo-600/20 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
              type="submit"
              disabled={!isAvailable}
            >
              {isAvailable ? "Request booking" : "Unavailable"} {isAvailable && <ArrowRight size={17} />}
            </button>
            <div className="flex items-center justify-center gap-2 text-center text-[11px] text-slate-500">
              <ShieldCheck size={15} />
              This is a demo request. No payment is collected.
            </div>
          </form>
        </aside>
      </div>
    </main>
  );
}
