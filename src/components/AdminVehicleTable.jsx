"use client";
import { Check, XCircle } from 'lucide-react';
import { Badge } from './MarketplaceUI';
import { money } from '../utils';
export default function AdminVehicleTable({ vehicles, moderate }) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full min-w-[760px] border-collapse text-left text-sm">
        <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500">
          <tr className="border-b border-slate-200">
            <th className="px-4 py-3 text-[11px]">Vehicle</th>
            <th className="px-4 py-3 text-[11px]">Owner</th>
            <th className="px-4 py-3 text-[11px]">Category</th>
            <th className="px-4 py-3 text-[11px]">Daily rate</th>
            <th className="px-4 py-3 text-[11px]">Status</th>
            <th className="px-4 py-3 text-[11px]">Action</th>
          </tr>
        </thead>
        <tbody>
          {vehicles.map((v) => (
            <tr className="border-b border-slate-100 transition hover:bg-slate-50/80" key={v.id}>
              <td className="px-4 py-4 align-middle text-sm font-semibold text-slate-800">
                {v.name}
                <small className="mt-1 block text-xs font-normal text-slate-500">{v.location}</small>
              </td>
              <td className="px-4 py-4 align-middle text-sm text-slate-600">{v.owner || "Demo Owner"}</td>
              <td className="px-4 py-4 align-middle text-sm text-slate-600">{v.category}</td>
              <td className="px-4 py-4 align-middle text-sm font-semibold text-slate-800">{money(v.price)}</td>
              <td className="px-4 py-4 align-middle">
                <Badge
                  tone={
                    v.approval === "Approved"
                      ? "available"
                      : v.approval === "Rejected"
                        ? "error"
                        : "warning"
                  }
                >
                  {v.approval || "Approved"}
                </Badge>
              </td>
              <td className="px-4 py-4 align-middle">
                {v.approval === "Pending" ? (
                  <div className="flex items-center gap-2">
                    <button
                      className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-semibold text-indigo-700 transition hover:bg-indigo-50"
                      onClick={() => moderate(v.id, "Approved")}
                    >
                      <Check size={14} />
                      Approve
                    </button>
                    <button
                      className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-semibold text-rose-600 transition hover:bg-rose-50"
                      onClick={() => moderate(v.id, "Rejected")}
                    >
                      <XCircle size={14} />
                      Reject
                    </button>
                  </div>
                ) : (
                  <span className="text-xs font-medium text-slate-400">Reviewed</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
