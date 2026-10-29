"use client";
import { Fuel, Heart, MapPin, Star, Users } from 'lucide-react';
import { Image, Price } from './MarketplaceUI';
function VehicleCard({ v, favorite, onFavorite }) {
  return (
    <article className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <a className="relative block h-56 overflow-hidden bg-slate-100" href={`/vehicles/${v.id}`}>
        <Image src={v.image} alt={v.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        <span className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/95 px-3 py-1.5 text-xs font-semibold text-emerald-700 shadow-sm">
          <i className="h-1.5 w-1.5 rounded-full bg-emerald-500" />Available
        </span>
      </a>
      <button
        className={`absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full border border-white/80 bg-white/95 text-slate-600 shadow-sm transition hover:scale-105 hover:text-rose-600 ${favorite ? "!text-rose-600" : ""}`}
        aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
        onClick={() => onFavorite(v.id)}
      >
        <Heart size={18} fill={favorite ? "currentColor" : "none"} />
      </button>
      <div className="p-5">
        <div className="mb-2 flex items-center justify-between gap-3 text-xs font-medium text-slate-500">
          <span>{v.category}</span>
          <span className="inline-flex items-center gap-1 font-semibold text-amber-600">
            <Star size={14} fill="currentColor" />
            {v.rating}
          </span>
        </div>
        <a href={`/vehicles/${v.id}`} className="block text-lg font-bold tracking-tight text-slate-900 transition hover:text-indigo-700">
          {v.name}
        </a>
        <div className="mt-2 flex items-center gap-1.5 text-sm text-slate-500">
          <MapPin size={15} className="text-slate-400" />
          {v.location}
        </div>
        <div className="mt-4 flex gap-5 border-b border-slate-100 py-3 text-xs font-medium text-slate-600">
          <span className="inline-flex items-center gap-1.5">
            <Users size={15} className="text-slate-400" />
            {v.seats} seats
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Fuel size={15} className="text-slate-400" />
            {v.fuel}
          </span>
        </div>
        <div className="flex items-center justify-between gap-3 pt-4">
          <Price value={v.price} />
          <a className="inline-flex min-h-10 items-center justify-center rounded-xl border border-slate-200 px-3.5 text-xs font-semibold text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700" href={`/vehicles/${v.id}`}>
            View details
          </a>
        </div>
      </div>
    </article>
  );
}
export default VehicleCard;
