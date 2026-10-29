"use client";
import { useMemo, useState } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { categories as baseCategories } from '../data';
import { Empty, PageHead } from '../components/MarketplaceUI';
import VehicleCard from '../components/VehicleCard';
export function Browse({ vehicles, favorites, toggleFavorite, query }) {
  const params = new URLSearchParams(query);
  const [search, setSearch] = useState(params.get("search") || ""),
    [category, setCategory] = useState(params.get("category") || ""),
    [place, setPlace] = useState(params.get("location") || ""),
    [min, setMin] = useState(""),
    [max, setMax] = useState(""),
    [available, setAvailable] = useState(false),
    [sort, setSort] = useState("featured");
  const filtered = useMemo(() => {
    let arr = vehicles.filter(
      (v) => v.approval !== "Pending" && v.approval !== "Rejected",
    ).filter(
      (v) =>
        v.name.toLowerCase().includes(search.toLowerCase()) &&
        (!category || v.category === category) &&
        (!place || v.location.toLowerCase().includes(place.toLowerCase())) &&
        (!min || v.price >= Number(min)) &&
        (!max || v.price <= Number(max)) &&
        (!available || v.available),
    );
    if (sort === "low") arr.sort((a, b) => a.price - b.price);
    if (sort === "high") arr.sort((a, b) => b.price - a.price);
    if (sort === "rating") arr.sort((a, b) => b.rating - a.rating);
    if (sort === "new") arr.sort((a, b) => b.year - a.year);
    return arr;
  }, [vehicles, search, category, place, min, max, available, sort]);
  const clear = () => {
    setSearch("");
    setCategory("");
    setPlace("");
    setMin("");
    setMax("");
    setAvailable(false);
    setSort("featured");
  };
  return (
    <main className="mx-auto min-h-[65vh] max-w-7xl px-4 py-9 sm:px-6 sm:py-14">
      <PageHead
        eyebrow="THE FLEET"
        title="Find your next ride"
        description="Explore the rides. Choose the one that feels right."
      />
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <label className="flex h-12 min-w-[220px] flex-1 items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 text-slate-400 focus-within:border-indigo-400 focus-within:ring-4 focus-within:ring-indigo-100">
          <Search size={17} className="shrink-0" />
          <input
            className="w-full border-0 bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
            placeholder="Search by name or model"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>
        <span className="mr-auto text-xs font-medium text-slate-500 sm:mr-0">{filtered.length} vehicles</span>
        <label className="flex h-12 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-slate-500">
          <SlidersHorizontal size={16} />
          <select className="max-w-[180px] border-0 bg-transparent text-xs font-medium text-slate-700 outline-none" value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="featured">Featured</option>
            <option value="low">Price: low to high</option>
            <option value="high">Price: high to low</option>
            <option value="rating">Top rated</option>
            <option value="new">Newest listings</option>
          </select>
        </label>
      </div>
      <div className="grid items-start gap-6 lg:grid-cols-[250px_minmax(0,1fr)]">
        <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-center justify-between border-b border-slate-100 pb-4">
            <b className="text-sm font-bold text-slate-900">Filters</b>
            <button className="text-xs font-semibold text-indigo-600 hover:text-indigo-800" onClick={clear}>Clear all</button>
          </div>
          <label className="mb-4 flex flex-col gap-2">
            <span className="text-xs font-semibold text-slate-700">Category</span>
            <select
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-800 outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">All categories</option>
              {baseCategories.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </label>
          <label className="mb-4 flex flex-col gap-2">
            <span className="text-xs font-semibold text-slate-700">Location</span>
            <input
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
              value={place}
              onChange={(e) => setPlace(e.target.value)}
              placeholder="City or state"
            />
          </label>
          <div className="mb-4 flex flex-col gap-2">
            <span className="text-xs font-semibold text-slate-700">Price per day</span>
            <div className="flex items-center gap-2">
              <input
                className="min-w-0 w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                type="number"
                min="0"
                placeholder="Min"
                value={min}
                onChange={(e) => setMin(e.target.value)}
              />
              <span>—</span>
              <input
                className="min-w-0 w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                type="number"
                min="0"
                placeholder="Max"
                value={max}
                onChange={(e) => setMax(e.target.value)}
              />
            </div>
          </div>
          <label className="mt-2 flex cursor-pointer items-center gap-3 border-t border-slate-100 pt-4 text-sm font-medium text-slate-700">
            <input
              className="h-4 w-4 accent-indigo-600"
              type="checkbox"
              checked={available}
              onChange={(e) => setAvailable(e.target.checked)}
            />
            Available only
          </label>
        </aside>
        <div>
          {filtered.length ? (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {filtered.map((v) => (
                <VehicleCard
                  key={v.id}
                  v={v}
                  favorite={favorites.includes(v.id)}
                  onFavorite={toggleFavorite}
                />
              ))}
            </div>
          ) : (
            <Empty
              title="No rides found"
              desc="Try adjusting your search or clearing a few filters."
              action={
                <button className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-600/20 transition hover:bg-indigo-700" onClick={clear}>
                  Clear filters
                </button>
              }
            />
          )}
        </div>
      </div>
    </main>
  );
}
