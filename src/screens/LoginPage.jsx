"use client";
import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, CarFront, Check, KeyRound, LockKeyhole, Settings, ShieldCheck, Sparkles, UserRound } from 'lucide-react';
import { write } from '../store';

const roles = [
  { name: "Customer", description: "Find rides and manage your trips.", icon: UserRound },
  { name: "Owner", description: "List vehicles and review requests.", icon: KeyRound },
  { name: "Admin", description: "Manage listings and the marketplace.", icon: Settings },
];

export function Login({ setRole }) {
  const [selected, setSelected] = useState("Customer");
  const [lockedRole, setLockedRole] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const requestedRole = params.get("role");
    if (roles.some((role) => role.name === requestedRole) && params.has("next")) {
      setSelected(requestedRole);
      setLockedRole(requestedRole);
    }
  }, []);

  const enter = (event) => {
    event.preventDefault();
    const nextErrors = {};
    const trimmedEmail = email.trim();
    if (!trimmedEmail) nextErrors.email = "Email address is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      nextErrors.email = "Enter a valid email address.";
    }
    if (!password.trim()) nextErrors.password = "Password is required.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    const activeRole = lockedRole || selected;
    write("role", activeRole);
    setRole(activeRole);
    const params = new URLSearchParams(window.location.search);
    const requestedNext = params.get("next");
    const safeNext = requestedNext?.startsWith("/") && !requestedNext.startsWith("//")
      ? requestedNext
      : `/${activeRole.toLowerCase()}/dashboard`;
    window.location.href = safeNext;
  };

  return (
    <main className="min-h-[calc(100vh-72px)] bg-slate-50 px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto grid max-w-6xl overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-2xl shadow-slate-900/[0.08] md:grid-cols-[.9fr_1.1fr]">
        <section className="relative hidden min-h-[680px] flex-col justify-between overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-violet-950 p-10 text-white md:flex lg:p-12">
          <div className="absolute -right-28 top-20 h-96 w-96 rounded-full border border-white/10" />
          <div className="absolute -right-12 top-36 h-64 w-64 rounded-full border border-white/10" />
          <div className="relative z-10">
            <a className="inline-flex items-center gap-2 text-lg font-extrabold tracking-tight" href="/">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-500"><CarFront size={22} /></span>
              RentWheels
            </a>
            <div className="mt-24 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-indigo-100 ring-1 ring-inset ring-white/15">
              <Sparkles size={13} /> Your journey, your way
            </div>
            <h1 className="mt-5 max-w-md text-4xl font-black leading-[1.04] tracking-[-0.04em] lg:text-5xl">Good to have you along for the ride.</h1>
            <p className="mt-5 max-w-sm text-sm leading-6 text-white/65">Choose a demo role and step into the RentWheels marketplace.</p>
          </div>
          <div className="relative z-10 grid gap-3 rounded-2xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur">
            {[
              "Browse rides across the city",
              "Manage your listings and requests",
              "Explore the admin workspace",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3 text-xs font-medium text-white/75">
                <span className="grid h-6 w-6 place-items-center rounded-full bg-emerald-300/15 text-emerald-200"><Check size={13} /></span>
                {item}
              </div>
            ))}
          </div>
        </section>

        <section className="p-6 sm:p-9 lg:p-12">
          <a className="mb-8 inline-flex items-center gap-2 text-xs font-semibold text-slate-500 transition hover:text-indigo-700" href="/">
            <ArrowLeft size={15} /> Back to marketplace
          </a>
          <div className="mb-7">
            <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-indigo-600">WELCOME TO RENTWHEELS</div>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-950">Sign in to continue</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">{lockedRole ? `Sign in as ${lockedRole} to continue where you left off.` : "Choose the role you want to explore, then enter any demo email and password."}</p>
          </div>

          <form onSubmit={enter} noValidate className="space-y-6">
            {lockedRole ? (
              <div className="flex items-center gap-3 rounded-2xl border border-indigo-100 bg-indigo-50/70 p-4">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-600 text-white">
                  {lockedRole === "Owner" ? <KeyRound size={19} /> : lockedRole === "Customer" ? <UserRound size={19} /> : <Settings size={19} />}
                </span>
                <span>
                  <small className="block text-[10px] font-bold uppercase tracking-wider text-indigo-500">Signing in as</small>
                  <b className="mt-0.5 block text-sm text-slate-900">{lockedRole}</b>
                </span>
              </div>
            ) : <fieldset>
              <legend className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">Choose a role</legend>
              <div className="grid gap-2.5">
                {roles.map(({ name, description, icon: Icon }) => (
                  <button
                    key={name}
                    type="button"
                    aria-pressed={selected === name}
                    onClick={() => setSelected(name)}
                    className={`flex w-full items-center gap-3 rounded-2xl border p-3.5 text-left transition ${selected === name ? "border-indigo-400 bg-indigo-50/70 ring-4 ring-indigo-50" : "border-slate-200 hover:border-indigo-200 hover:bg-slate-50"}`}
                  >
                    <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${selected === name ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20" : "bg-slate-100 text-slate-500"}`}><Icon size={19} /></span>
                    <span className="min-w-0 flex-1">
                      <b className="block text-sm font-bold text-slate-900">{name}</b>
                      <small className="mt-0.5 block text-xs text-slate-500">{description}</small>
                    </span>
                    <span className={`grid h-5 w-5 place-items-center rounded-full border ${selected === name ? "border-indigo-600 bg-indigo-600 text-white" : "border-slate-300"}`}>
                      {selected === name && <Check size={12} />}
                    </span>
                  </button>
                ))}
              </div>
            </fieldset>}

            <div className="space-y-4">
              <label className="block text-xs font-semibold text-slate-700">
                Email address
                <input
                  className="mt-2 min-h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm font-normal text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? "login-email-error" : undefined}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    setErrors((current) => ({ ...current, email: "" }));
                  }}
                />
                {errors.email && <small id="login-email-error" className="mt-1 block text-xs font-medium text-rose-600">{errors.email}</small>}
              </label>
              <label className="block text-xs font-semibold text-slate-700">
                Password
                <input
                  className="mt-2 min-h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm font-normal text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                  type="password"
                  autoComplete="current-password"
                  placeholder="Enter any demo password"
                  value={password}
                  aria-invalid={Boolean(errors.password)}
                  aria-describedby={errors.password ? "login-password-error" : undefined}
                  onChange={(event) => {
                    setPassword(event.target.value);
                    setErrors((current) => ({ ...current, password: "" }));
                  }}
                />
                {errors.password && <small id="login-password-error" className="mt-1 block text-xs font-medium text-rose-600">{errors.password}</small>}
              </label>
            </div>

            <button className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 text-sm font-bold text-white shadow-lg shadow-indigo-600/20 transition hover:-translate-y-0.5 hover:bg-indigo-700" type="submit">
              Log in as {lockedRole || selected} <ArrowRight size={17} />
            </button>
          </form>

          <div className="mt-5 flex items-start gap-2.5 rounded-xl bg-slate-50 p-3.5 text-xs leading-5 text-slate-500">
            <ShieldCheck className="mt-0.5 shrink-0 text-indigo-500" size={16} />
            <span><b className="text-slate-700">Demo sign-in only.</b> Any valid email and non-empty password work. Credentials are not sent to a server.</span>
          </div>
          <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-slate-400"><LockKeyhole size={12} /> Local demo session</div>
        </section>
      </div>
    </main>
  );
}
