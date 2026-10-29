"use client";
import { useState } from 'react';
import { ArrowRight, CarFront, ShieldCheck, KeyRound, UserRound, Settings } from 'lucide-react';
import { write } from '../store';
export function Login({ setRole }) {
  const [selected, setSelected] = useState("Customer");
  const descriptions = {
    Customer: "Browse vehicles and manage booking requests.",
    Owner: "Add vehicles and manage listing requests.",
    Admin: "Review demo listings, users and bookings.",
  };
  const enter = () => {
    write("role", selected);
    setRole(selected);
    window.location.href = `/${selected.toLowerCase()}/dashboard`;
  };
  return (
    <main className="flex min-h-[75vh] items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-slate-50 px-4 py-12">
      <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-900/[0.08] sm:p-9">
        <span className="mb-5 grid h-14 w-14 place-items-center rounded-2xl bg-indigo-50 text-indigo-600">
          <CarFront size={27} />
        </span>
        <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-indigo-600">WELCOME TO RENTWHEELS</div>
        <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-950 sm:text-3xl">Choose your demo view</h1>
        <p className="mb-6 mt-2 text-sm leading-6 text-slate-500">Switch roles to explore different parts of the marketplace.</p>
        <div className="mb-5 space-y-3">
          {["Customer", "Owner", "Admin"].map((r) => (
            <button
              key={r}
              className={`flex w-full items-center gap-3 rounded-2xl border p-4 text-left transition ${selected === r ? "border-indigo-400 bg-indigo-50/60 ring-4 ring-indigo-50" : "border-slate-200 hover:border-indigo-200 hover:bg-slate-50"}`}
              onClick={() => setSelected(r)}
            >
              <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${selected === r ? "bg-indigo-100 text-indigo-700" : "bg-slate-100 text-slate-500"}`}>
                {r === "Customer" ? (
                  <UserRound />
                ) : r === "Owner" ? (
                  <KeyRound />
                ) : (
                  <Settings />
                )}
              </span>
              <span className="min-w-0 flex-1">
                <b className="block text-sm font-bold text-slate-900">{r}</b>
                <small className="mt-1 block text-xs leading-5 text-slate-500">{descriptions[r]}</small>
              </span>
              <span className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border ${selected === r ? "border-indigo-600" : "border-slate-300"}`}>{selected === r && <span className="h-2.5 w-2.5 rounded-full bg-indigo-600" />}</span>
            </button>
          ))}
        </div>
        <button className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 text-sm font-semibold text-white shadow-md shadow-indigo-600/20 transition hover:bg-indigo-700" onClick={enter}>
          Continue as {selected}
          <ArrowRight size={17} />
        </button>
        <div className="mt-5 flex items-start gap-2 rounded-xl bg-slate-50 p-3 text-xs leading-5 text-slate-500">
          <ShieldCheck className="mt-0.5 shrink-0 text-slate-400" size={16} />
          Demo role switching only. This is not real authentication or security.
        </div>
        <a className="mt-5 inline-flex items-center text-sm font-semibold text-indigo-600 hover:text-indigo-800" href="/">
          ← Back to home
        </a>
      </div>
    </main>
  );
}
