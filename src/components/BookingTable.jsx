"use client";
import { Check } from 'lucide-react';
import { Badge } from './MarketplaceUI';
import { money } from '../utils';
export default function BookingTable({ bookings, onCancel, onAccept }) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full min-w-[680px] border-collapse text-left text-sm">
        <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500">
          <tr className="border-b border-slate-200">
            <th className="px-4 py-3 text-[11px]">Vehicle</th>
            <th className="px-4 py-3 text-[11px]">Dates</th>
            <th className="px-4 py-3 text-[11px]">Total</th>
            <th className="px-4 py-3 text-[11px]">Status</th>
            <th className="px-4 py-3 text-[11px]">Action</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((b) => (
            <tr className="border-b border-slate-100 transition hover:bg-slate-50/80" key={b.id}>
              <td className="px-4 py-4 align-middle text-sm font-semibold text-slate-800">
                {b.vehicle}
                <small className="mt-1 block text-xs font-normal text-slate-500">
                  {b.id} · {b.customer || "Demo customer"}
                </small>
              </td>
              <td className="px-4 py-4 align-middle text-sm text-slate-600">
                {b.pickup}
                <small className="mt-1 block text-xs text-slate-500">to {b.returnDate}</small>
              </td>
              <td className="px-4 py-4 align-middle text-sm font-semibold text-slate-800">{money(b.total)}</td>
              <td className="px-4 py-4 align-middle">
                <Badge
                  tone={
                    b.status === "Confirmed" || b.status === "Completed"
                      ? "available"
                      : b.status === "Cancelled"
                        ? "error"
                        : "warning"
                  }
                >
                  {b.status}
                </Badge>
              </td>
              <td className="px-4 py-4 align-middle">
                <div className="flex items-center gap-3">
                  {onAccept && b.status === "Pending" && (
                    <button className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-semibold text-indigo-700 transition hover:bg-indigo-50" onClick={() => onAccept(b)}>
                      <Check size={14} />
                      Confirm
                    </button>
                  )}
                  {onCancel && ["Pending", "Confirmed"].includes(b.status) && (
                    <button
                      className="rounded-lg px-2 py-1.5 text-xs font-semibold text-rose-600 transition hover:bg-rose-50"
                      onClick={() => onCancel(b)}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
