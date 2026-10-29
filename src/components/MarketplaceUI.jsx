"use client";
import { useState } from 'react';
import { ArrowRight, CarFront, ChevronDown, LogOut, Menu, X } from 'lucide-react';
import { write } from '../store';
import { imageFallback, money } from '../utils';
function Image({ src, alt, className = "" }) {
  const source = src || imageFallback;
  const [failedSource, setFailedSource] = useState(null);
  const url = failedSource === source ? imageFallback : source;
  return (
    <img
      className={`block max-w-full ${className}`}
      src={url}
      alt={alt}
      onError={() => {
        if (url !== imageFallback) setFailedSource(source);
      }}
    />
  );
}
function Badge({ children, tone = "" }) {
  const tones = {
    available: "bg-emerald-50 text-emerald-700 ring-emerald-600/15",
    warning: "bg-amber-50 text-amber-700 ring-amber-600/15",
    error: "bg-rose-50 text-rose-700 ring-rose-600/15",
  };
  return <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${tones[tone] || "bg-slate-100 text-slate-600 ring-slate-500/10"}`}>{children}</span>;
}
function Price({ value, suffix = "/ day" }) {
  return (
    <span className="inline-flex items-baseline gap-1 whitespace-nowrap text-xl font-bold tracking-tight text-slate-950">
      {money(value)}
      <small className="text-xs font-medium tracking-normal text-slate-500">{suffix}</small>
    </span>
  );
}
function Header({ role, path = "/", query = "" }) {
  const [open, setOpen] = useState(false),
    [mobile, setMobile] = useState(false);
  const currentCategory = new URLSearchParams(query).get("category");
  const isActiveLink = (href) => {
    const [hrefPath, hrefQuery = ""] = href.split("?");
    if (hrefPath === "/vehicles") {
      const targetCategory = new URLSearchParams(hrefQuery).get("category");
      const isVehicleRoute = path === "/vehicles" || path.startsWith("/vehicles/");
      return isVehicleRoute && (targetCategory ? currentCategory === targetCategory : !currentCategory);
    }
    return path === hrefPath;
  };
  const navItems = role === "Admin"
    ? [["Admin dashboard", "/admin/dashboard"]]
    : role === "Customer"
      ? [["Browse vehicles", "/vehicles"], ["Cars", "/vehicles?category=Cars%20%26%20SUVs"], ["Bikes", "/vehicles?category=Bikes%20%26%20Scooters"], ["Mini buses", "/vehicles?category=Mini%20Buses"], ["Customer dashboard", "/customer/dashboard"]]
      : role === "Owner"
        ? [["Owner dashboard", "/owner/dashboard"], ["List your vehicle", "/list-vehicle"]]
        : [["Home", "/"], ["Browse vehicles", "/vehicles"], ["Cars", "/vehicles?category=Cars%20%26%20SUVs"], ["Bikes", "/vehicles?category=Bikes%20%26%20Scooters"], ["Mini buses", "/vehicles?category=Mini%20Buses"], ["List your vehicle", "/list-vehicle"]];
  const goRole = (r) => {
    write("role", r);
    setOpen(false);
    setMobile(false);
    window.location.href = `/${r.toLowerCase()}/dashboard`;
  };
  const logout = () => {
    write("role", null);
    window.location.href = "/";
  };
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 shadow-sm shadow-slate-900/[0.03] backdrop-blur-xl">
      <div className="relative mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-5 px-4 sm:px-6">
        <a className="flex shrink-0 items-center text-xl font-extrabold tracking-tight text-slate-950" href="/">
          <span className="mr-2.5 grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 text-white shadow-md shadow-indigo-700/20">
            <CarFront size={22} />
          </span>
          Rent<span>Wheels</span>
        </a>
        <nav className={`${mobile ? "absolute left-4 right-4 top-[calc(100%+8px)] flex flex-col rounded-2xl border border-slate-200 bg-white p-3 shadow-xl lg:static lg:flex-row lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none" : "hidden lg:flex"} items-center gap-1 lg:ml-auto lg:gap-5`}>
          {navItems.map(([label, href]) => {
            const active = isActiveLink(href);
            return <a key={label} aria-current={active ? "page" : undefined} className={`w-full rounded-xl px-3 py-2.5 text-sm font-medium transition lg:w-auto lg:px-2 lg:py-2 ${active ? "bg-indigo-50 font-semibold text-indigo-700" : "text-slate-600 hover:bg-indigo-50 hover:text-indigo-700"}`} href={href} onClick={() => { setMobile(false); setOpen(false); }}>{label}</a>;
          })}
        </nav>
        <div className="flex items-center gap-2">
          {role ? <div className="relative">
            <button
              type="button"
              aria-expanded={open}
              className="inline-flex min-h-10 min-w-[10.5rem] items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white px-3.5 text-sm font-semibold text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50"
              onClick={() => setOpen((current) => !current)}
            >
              {`Demo ${role}`}
              <ChevronDown size={15} />
            </button>
            {open && (
              <div className="absolute right-0 top-[calc(100%+10px)] z-40 min-w-[13rem] rounded-2xl border border-slate-200 bg-white p-2 shadow-xl shadow-slate-900/10">
                <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">Choose a demo role</div>
                {["Customer", "Owner", "Admin"].map((r) => (
                  <button className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm font-medium text-slate-700 transition hover:bg-indigo-50 hover:text-indigo-700" key={r} aria-pressed={role === r} onClick={() => goRole(r)}>
                    {r}
                    <ArrowRight size={14} />
                  </button>
                ))}
                {role && <button className="mt-1 flex w-full items-center gap-2 rounded-xl border-t border-slate-100 px-3 py-3 text-left text-sm font-semibold text-rose-600 transition hover:bg-rose-50" onClick={logout}>
                  <LogOut size={15} /> Log out
                </button>}
              </div>
            )}
          </div> : <a className="inline-flex min-h-10 items-center justify-center rounded-xl bg-indigo-600 px-4 text-sm font-semibold text-white shadow-md shadow-indigo-600/15 transition hover:bg-indigo-700" href="/login">Log in</a>}
          <button
            className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-700 lg:hidden"
            aria-label="Toggle navigation"
            onClick={() => setMobile(!mobile)}
          >
            {mobile ? <X /> : <Menu />}
          </button>
        </div>
      </div>
    </header>
  );
}
function Footer({ role }) {
  const showExplore = !role || role === "Customer";
  const showOwners = !role || role === "Owner";
  const showAdmin = role === "Admin";
  return (
    <footer className="bg-slate-950 text-slate-300">
      <div className={`mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:grid-cols-2 sm:px-6 ${role ? "lg:grid-cols-[1.6fr_1fr_1.1fr]" : "lg:grid-cols-[1.6fr_1fr_1fr_1.1fr]"}`}>
        <div className="flex flex-col items-start gap-3">
          <a className="flex items-center text-lg font-extrabold tracking-tight text-white" href="/">
            <span className="mr-2.5 grid h-9 w-9 place-items-center rounded-xl bg-indigo-600 text-white">
              <CarFront size={22} />
            </span>
            Rent<span>Wheels</span>
          </a>
          <p className="max-w-xs text-sm leading-6 text-slate-400">Find the right ride for wherever the road takes you.</p>
          <small className="text-xs text-slate-500">Demo marketplace for portfolio use.</small>
        </div>
        {showExplore && <div className="flex flex-col items-start gap-3 text-sm">
          <b className="mb-1 text-sm text-white">Explore</b>
          <a className="text-slate-400 transition hover:text-white" href="/vehicles">Browse vehicles</a>
          <a className="text-slate-400 transition hover:text-white" href="/vehicles?category=Cars%20%26%20SUVs">Cars & SUVs</a>
          <a className="text-slate-400 transition hover:text-white" href="/vehicles?category=Bikes%20%26%20Scooters">
            Bikes & scooters
          </a>
          {role === "Customer" && <a className="text-slate-400 transition hover:text-white" href="/customer/dashboard">Customer dashboard</a>}
        </div>}
        {showOwners && <div className="flex flex-col items-start gap-3 text-sm">
          <b className="mb-1 text-sm text-white">For owners</b>
          <a className="text-slate-400 transition hover:text-white" href="/list-vehicle">List a vehicle</a>
          <a className="text-slate-400 transition hover:text-white" href="/owner/dashboard">Owner dashboard</a>
        </div>}
        {showAdmin && <div className="flex flex-col items-start gap-3 text-sm">
          <b className="mb-1 text-sm text-white">Administration</b>
          <a className="text-slate-400 transition hover:text-white" href="/admin/dashboard">Admin dashboard</a>
        </div>}
        <div className="flex flex-col items-start gap-3 text-sm">
          <b className="mb-1 text-sm text-white">Contact</b>
          <span className="text-slate-400">Demo contact</span>
          <span className="text-slate-400">namaste@rentwheels.demo</span>
        </div>
      </div>
      <div className="mx-auto max-w-7xl border-t border-white/10 px-4 py-5 text-xs text-slate-500 sm:px-6">
        &copy; 2026 RentWheels. Portfolio demonstration only.
      </div>
    </footer>
  );
}
function PageHead({ eyebrow, title, description, action }) {
  return (
    <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
      <div>
        {eyebrow && <div className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-indigo-600">{eyebrow}</div>}
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">{title}</h1>
        {description && <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">{description}</p>}
      </div>
      {action}
    </div>
  );
}
function Empty({ title, desc, action }) {
  return (
    <div className="flex min-h-72 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
      <span className="mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-indigo-50 text-indigo-600">
        <CarFront size={25} />
      </span>
      <h3 className="text-lg font-bold text-slate-900">{title}</h3>
      <p className="mb-5 mt-1 max-w-md text-sm leading-6 text-slate-500">{desc}</p>
      {action && <div>{action}</div>}
    </div>
  );
}
function Stat({ icon: Icon, label, value, sub }) {
  return (
    <div className="grid grid-cols-[44px_1fr] gap-x-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <span className="row-span-3 grid h-11 w-11 place-items-center rounded-xl bg-indigo-50 text-indigo-600">
        <Icon size={20} />
      </span>
      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{label}</span>
      <strong className="text-2xl font-extrabold tracking-tight text-slate-950">{value}</strong>
      <small className="text-xs text-slate-500">{sub}</small>
    </div>
  );
}
export { Image, Badge, Price, Header, Footer, PageHead, Empty, Stat };
