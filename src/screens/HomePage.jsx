"use client";
import { useState } from 'react';
import { ArrowRight, CalendarDays, CarFront, Check, ChevronRight, MapPin, Search, Star, Bike, BusFront, Truck, Sparkles, ListChecks, CircleDollarSign, LayoutDashboard, KeyRound } from 'lucide-react';
import { categories as baseCategories, testimonials } from '../data';
import { Image } from '../components/MarketplaceUI';
import VehicleCard from '../components/VehicleCard';
import { today } from '../utils';
export function Home({ vehicles, favorites, toggleFavorite }) {
  const [locationName, setLocationName] = useState(""),
    [category, setCategory] = useState(""),
    [pickup, setPickup] = useState(""),
    [returnDate, setReturnDate] = useState("");
  const submit = (e) => {
    e.preventDefault();
    const q = new URLSearchParams();
    if (locationName) q.set("location", locationName);
    if (category) q.set("category", category);
    if (pickup) q.set("pickup", pickup);
    if (returnDate) q.set("return", returnDate);
    window.location.href = `/vehicles?${q.toString()}`;
  };
  return (
    <main>
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-indigo-50/30 px-4 pb-24 pt-12 sm:px-6 sm:pb-28 sm:pt-20">
        <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[.9fr_1.1fr] lg:gap-16">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 text-[10px] font-bold uppercase tracking-[0.16em] text-indigo-700 shadow-sm ring-1 ring-indigo-100">
              <span className="h-2 w-2 rounded-full bg-emerald-500" /> THE ROAD IS YOURS
            </div>
            <h1 className="mt-6 text-5xl font-extrabold leading-[1.02] tracking-[-0.055em] text-slate-950 sm:text-6xl lg:text-7xl">
              Find your
              <br />
              <span className="text-indigo-600">perfect ride.</span>
            </h1>
            <p className="mt-5 max-w-lg text-base leading-7 text-slate-600">
              From city drives to weekend escapes, choose the ride that gets you
              there.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:-translate-y-0.5 hover:bg-indigo-700" href="/vehicles">
                Explore vehicles <ArrowRight size={17} />
              </a>
              <a className="inline-flex min-h-12 items-center justify-center rounded-xl bg-white px-5 text-sm font-semibold text-indigo-700 ring-1 ring-indigo-100 transition hover:bg-indigo-50" href="/list-vehicle">
                List your vehicle
              </a>
            </div>
            <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-xs font-medium text-slate-500">
              <span className="inline-flex items-center gap-1.5">
                <Check className="text-emerald-600" size={14} />
                Simple booking requests
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Check className="text-emerald-600" size={14} />A ride for every plan
              </span>
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-2">
              <span className="mr-1 w-full text-[11px] font-medium text-slate-400 sm:w-auto">Popular pick-up cities</span>
              {["Bengaluru", "Mumbai", "Pune", "Goa"].map((city) => (
                <a className="rounded-full border border-indigo-100 bg-white px-3 py-1.5 text-xs font-medium text-indigo-700 transition hover:border-indigo-300 hover:bg-indigo-50" key={city} href={`/vehicles?location=${encodeURIComponent(city)}`}>
                  {city}
                </a>
              ))}
            </div>
          </div>
          <div className="group relative h-[280px] overflow-hidden rounded-3xl border-[5px] border-white bg-slate-200 shadow-2xl shadow-slate-900/20 sm:h-[390px] lg:h-[460px]">
            <Image
              className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
              src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=90"
              alt="Blue sports car on a scenic road"
            />
            <div className="absolute bottom-5 left-3 z-10 flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-3 shadow-xl sm:bottom-7 sm:left-[-18px] sm:p-4">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-amber-50 text-amber-500">
                <Star size={17} fill="currentColor" />
              </span>
              <div className="grid gap-0.5">
                <b className="text-xs font-bold text-slate-900">Find your next favorite</b>
                <small className="text-[10px] text-slate-500">Browse rides near you</small>
              </div>
              <ChevronRight size={18} />
            </div>
            <div className="absolute bottom-5 right-5 z-10 grid text-right text-white drop-shadow sm:bottom-7 sm:right-7">
              <b className="text-3xl font-extrabold">12+</b>
              <span className="text-xs text-white/85">rides to explore</span>
            </div>
          </div>
        </div>
      </section>
      <section className="relative z-10 mx-auto -mt-12 max-w-7xl px-4 sm:px-6">
        <form className="grid gap-2 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl shadow-slate-900/10 sm:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr_1fr_auto] lg:items-center" onSubmit={submit}>
          <label className="grid gap-1 rounded-xl px-3 py-2.5">
            <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-slate-500">
              <MapPin className="text-indigo-600" size={15} />
              Location
            </span>
            <input
              className="min-w-0 border-0 bg-transparent text-sm font-medium text-slate-800 outline-none placeholder:text-slate-400"
              value={locationName}
              onChange={(e) => setLocationName(e.target.value)}
              placeholder="City, neighbourhood or airport"
            />
          </label>
          <label className="grid gap-1 rounded-xl px-3 py-2.5">
            <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-slate-500">
              <CarFront className="text-indigo-600" size={15} />
              Vehicle type
            </span>
            <select
              className="min-w-0 border-0 bg-transparent text-sm font-medium text-slate-800 outline-none"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">All vehicles</option>
              {baseCategories.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </label>
          <label className="grid gap-1 rounded-xl px-3 py-2.5">
            <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-slate-500">
              <CalendarDays className="text-indigo-600" size={15} />
              Pickup date
            </span>
            <input
              className="min-w-0 border-0 bg-transparent text-sm font-medium text-slate-800 outline-none"
              type="date"
              min={today}
              value={pickup}
              onChange={(e) => setPickup(e.target.value)}
            />
          </label>
          <label className="grid gap-1 rounded-xl px-3 py-2.5">
            <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-slate-500">
              <CalendarDays className="text-indigo-600" size={15} />
              Return date
            </span>
            <input
              className="min-w-0 border-0 bg-transparent text-sm font-medium text-slate-800 outline-none"
              type="date"
              min={pickup || today}
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
            />
          </label>
          <button className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 text-sm font-semibold text-white transition hover:bg-indigo-700">
            <Search size={17} /> Search rides
          </button>
        </form>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-indigo-600">PICK YOUR RIDE</div>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-950">Find the right fit</h2>
            <p>Whatever the journey, there’s a ride for it.</p>
          </div>
          <a className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-800" href="/vehicles">
            Explore all <ArrowRight size={16} />
          </a>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {[
            {
              name: "Cars & SUVs",
              desc: "Everyday drives & escapes",
              icon: CarFront,
              tag: "01",
            },
            {
              name: "Bikes & Scooters",
              desc: "A little more freedom",
              icon: Bike,
              tag: "02",
            },
            {
              name: "Mini Buses",
              desc: "Bring everyone along",
              icon: BusFront,
              tag: "03",
            },
            {
              name: "Vans",
              desc: "Room for the big plans",
              icon: Truck,
              tag: "04",
            },
          ].map((c) => (
            <a
              className="group relative flex min-h-40 flex-col items-start rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg sm:p-5"
              key={c.name}
              href={`/vehicles?category=${encodeURIComponent(c.name)}`}
            >
              <span className="absolute right-4 top-4 text-[10px] font-bold text-slate-300">{c.tag}</span>
              <span className="mb-4 grid h-11 w-11 place-items-center rounded-xl bg-indigo-50 text-indigo-600">
                <c.icon size={24} />
              </span>
              <b className="text-sm font-bold text-slate-900">{c.name}</b>
              <small className="mt-1 text-xs text-slate-500">{c.desc}</small>
              <span className="absolute bottom-4 right-4 text-slate-400 transition group-hover:translate-x-1 group-hover:text-indigo-600">
                <ArrowRight size={17} />
              </span>
            </a>
          ))}
        </div>
      </section>
      <section className="bg-slate-50 px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-indigo-600">HANDPICKED FOR YOU</div>
              <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-950">Popular rides</h2>
              <p>Standout rides, ready for your next plan.</p>
            </div>
            <a className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-800" href="/vehicles">
              Browse all vehicles <ArrowRight size={16} />
            </a>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {vehicles.slice(0, 3).map((v) => (
              <VehicleCard
                key={v.id}
                v={v}
                favorite={favorites.includes(v.id)}
                onFavorite={toggleFavorite}
              />
            ))}
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="mb-10 text-center">
          <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-indigo-600">THREE SIMPLE STEPS</div>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-950">Your next ride, made simple</h2>
          <p>Everything you need to get moving.</p>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {[
            {
              n: "01",
              icon: Search,
              title: "Find your ride",
              text: "Search by location and explore rides that fit your plans.",
            },
            {
              n: "02",
              icon: CarFront,
              title: "Choose your favorite",
              text: "Compare details, features and daily rates.",
            },
            {
              n: "03",
              icon: KeyRound,
              title: "Request your booking",
              text: "Send a request and keep your plans moving.",
            },
          ].map((s) => (
            <div className="relative rounded-2xl border border-slate-200 bg-white p-6" key={s.n}>
              <span className="absolute right-5 top-5 text-xs font-bold text-slate-300">{s.n}</span>
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-indigo-50 text-indigo-600">
                <s.icon size={22} />
              </span>
              <h3 className="mt-5 font-bold text-slate-900">{s.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">{s.text}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="bg-gradient-to-r from-slate-950 via-indigo-950 to-indigo-900 px-4 py-10 text-white sm:px-6">
        <div className="mx-auto flex max-w-7xl flex-col items-start gap-5 sm:flex-row sm:items-center">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white/10 text-indigo-200">
            <Sparkles size={23} />
          </span>
          <div className="flex-1">
            <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-indigo-200">YOUR VEHICLE, YOUR WAY</div>
            <h2 className="mt-1 text-2xl font-bold tracking-tight">Have a ride to share?</h2>
            <p className="mt-1 text-sm text-indigo-100/80">
              Create a listing, set your daily rate and manage requests in one
              place.
            </p>
          </div>
          <a href="/list-vehicle" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-white px-5 text-sm font-semibold text-indigo-800 transition hover:bg-indigo-50">
            Become an owner <ArrowRight size={17} />
          </a>
        </div>
      </section>
      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[.85fr_1.15fr] lg:items-center">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-indigo-600">WHY RENTWHEELS</div>
          <h2 className="mt-2 text-3xl font-extrabold leading-tight tracking-tight text-slate-950 sm:text-4xl">
            Made for the way
            <br />
            you want to move.
          </h2>
          <p className="mt-4 max-w-md text-sm leading-7 text-slate-500">
            A straightforward way to discover a ride, compare the details and
            plan your next trip.
          </p>
          <a className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-800" href="/vehicles">
            Find your ride <ArrowRight size={16} />
          </a>
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          {[
            {
              icon: CarFront,
              title: "A ride for every plan",
              text: "Browse cars, bikes, vans and mini buses.",
            },
            {
              icon: ListChecks,
              title: "Simple booking requests",
              text: "Send your dates and keep track of requests.",
            },
            {
              icon: CircleDollarSign,
              title: "Clear daily rates",
              text: "Compare prices before you make a plan.",
            },
            {
              icon: LayoutDashboard,
              title: "Tools for owners",
              text: "Manage vehicle listings in one dashboard.",
            },
          ].map((b) => (
            <div className="flex gap-3" key={b.title}>
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-indigo-50 text-indigo-600">
                <b.icon size={20} />
              </span>
              <div>
                <h3 className="text-sm font-bold text-slate-900">{b.title}</h3>
                <p className="mt-1 text-xs leading-5 text-slate-500">{b.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className="bg-slate-50 px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-indigo-600">A FEW KIND WORDS</div>
              <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-950">Made for good journeys</h2>
              <p className="mt-2 text-sm text-slate-500">Sample testimonials for this portfolio demonstration.</p>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {testimonials.map((t) => (
              <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm" key={t.name}>
                <div className="text-sm tracking-widest text-amber-500">★★★★★</div>
                <p className="my-4 min-h-16 text-sm leading-6 text-slate-600">“{t.quote}”</p>
                <div className="flex items-center gap-3 border-t border-slate-100 pt-4">
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700">{t.name[0]}</span>
                  <div>
                    <b className="block text-xs font-bold text-slate-900">{t.name}</b>
                    <small className="text-[10px] text-slate-500">{t.role} · Sample testimonial</small>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
