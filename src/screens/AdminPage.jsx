"use client";
import { useState } from 'react';
import { ArrowRight, ArrowUpRight, Activity, CarFront, Clock3, Users, ShieldCheck, LayoutDashboard, ListChecks, Settings, LogOut, RotateCcw, Sparkles } from 'lucide-react';
import { Badge, Empty, PageHead, Stat } from '../components/MarketplaceUI';
import BookingTable from '../components/BookingTable';
import AdminVehicleTable from '../components/AdminVehicleTable';
import { write, resetStore } from '../store';
export function Admin({
  vehicles,
  bookings,
  saveVehicles,
  users,
  setUsers,
  saveBookings,
  notify,
}) {
  const [tab, setTab] = useState("overview"),
    [status, setStatus] = useState("All");
  const setUserStatus = (idx, newStatus) => {
    const next = users.map((u, i) =>
      i === idx ? { ...u, status: newStatus } : u,
    );
    setUsers(next);
    write("users", next);
    notify(`Demo user ${newStatus.toLowerCase()}.`);
  };
  const moderate = (id, approval) => {
    saveVehicles(vehicles.map((v) => (v.id === id ? { ...v, approval } : v)));
    notify(`Listing ${approval.toLowerCase()}.`);
  };
  const nav = [
    ["overview", "Overview", LayoutDashboard],
    ["users", "Users", Users],
    ["vehicles", "Vehicles", CarFront],
    ["bookings", "Bookings", ListChecks],
    ["settings", "Demo settings", Settings],
  ];
  return (
    <main className="mx-auto max-w-7xl px-4 py-9 sm:px-6 sm:py-14">
      <section className="relative mb-8 overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-950 via-indigo-950 to-violet-950 text-white shadow-2xl shadow-indigo-950/20">
        <div className="absolute -right-20 -top-40 h-96 w-96 rounded-full border border-white/10" />
        <div className="absolute right-10 -top-28 h-72 w-72 rounded-full border border-white/10" />
        <div className="relative grid gap-8 p-6 sm:p-9 lg:grid-cols-[1fr_360px] lg:items-end lg:p-12">
          <div className="max-w-2xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-violet-300/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-violet-200 ring-1 ring-inset ring-violet-200/20">
              <Sparkles size={13} /> Admin control room
            </div>
            <h1 className="max-w-xl text-3xl font-black leading-[1.06] tracking-[-0.04em] sm:text-5xl">Keep every ride moving.</h1>
            <p className="mt-4 max-w-lg text-sm leading-6 text-white/65 sm:text-base">A clear view of the marketplace, the people in it, and the listings that need your attention.</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <button className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-white px-5 text-sm font-bold text-indigo-950 shadow-lg transition hover:-translate-y-0.5 hover:bg-indigo-50" onClick={() => setTab("vehicles")}>
                <CarFront size={17} /> Review listings <ArrowUpRight size={16} />
              </button>
              <button className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-5 text-sm font-semibold text-white transition hover:bg-white/10" onClick={() => setTab("bookings")}>
                <ListChecks size={16} /> View bookings
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-2">
            {[
              ["Vehicles", vehicles.length, CarFront],
              ["People", users.length, Users],
              ["Requests", bookings.length, ListChecks],
              ["Need review", vehicles.filter((v) => v.approval === "Pending").length, Clock3],
            ].map(([label, value, Icon]) => (
              <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.07] p-4 backdrop-blur-sm">
                <div className="flex items-center justify-between text-white/55"><span className="text-xs font-medium">{label}</span><Icon size={15} /></div>
                <div className="mt-3 text-2xl font-extrabold tracking-tight text-white">{value}</div>
                <div className="mt-1 flex items-center gap-1 text-[10px] text-emerald-200"><Activity size={11} /> Local demo data</div>
              </div>
            ))}
          </div>
        </div>
        <button
          aria-label="Log out"
          title="Log out"
          className="absolute right-5 top-5 inline-flex h-9 items-center gap-2 rounded-full border border-white/15 bg-black/10 px-3 text-[11px] font-semibold text-white/75 transition hover:bg-white/10 hover:text-white sm:right-8 sm:top-7"
          onClick={() => {
            write("role", null);
            window.location.href = "/";
          }}
        >
          <LogOut size={14} /> Log out
        </button>
      </section>
      <div className="grid items-start gap-6 lg:grid-cols-[230px_minmax(0,1fr)]">
        <aside className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-4 flex items-center gap-3 border-b border-slate-100 pb-4">
            <span className="grid h-11 w-11 place-items-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700">AD</span>
            <div>
              <b className="block text-sm font-bold text-slate-900">Demo Admin</b>
              <small className="text-xs text-slate-500">Administrator</small>
            </div>
          </div>
          <div className="space-y-1">
            {nav.map(([key, label, Icon]) => (
              <button
                key={key}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition ${tab === key ? "bg-indigo-50 text-indigo-700" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}
                onClick={() => setTab(key)}
              >
                <Icon size={17} />
                {label}
              </button>
            ))}
          </div>
          <div className="mt-4 border-t border-slate-100 pt-4">
            <span className="flex items-center gap-2 text-xs text-slate-500">
              <ShieldCheck className="text-indigo-500" size={15} />
              Local demo data
            </span>
          </div>
        </aside>
        <section className="min-w-0 space-y-5">
          {tab === "overview" && (
            <>
              <div className="dash-content-head">
                <div>
                  <h2>Overview</h2>
                  <p>Quick look at the RentWheels demo marketplace.</p>
                </div>
              </div>
              <div className="stats-grid">
                <Stat
                  icon={Users}
                  label="Demo users"
                  value={users.length}
                  sub="Seeded local accounts"
                />
                <Stat
                  icon={CarFront}
                  label="Total vehicles"
                  value={vehicles.length}
                  sub="Marketplace listings"
                />
                <Stat
                  icon={ListChecks}
                  label="Booking requests"
                  value={bookings.length}
                  sub="Local demo records"
                />
                <Stat
                  icon={Clock3}
                  label="Pending approvals"
                  value={
                    vehicles.filter((v) => v.approval === "Pending").length
                  }
                  sub="Vehicle listings"
                />
              </div>
              <div className="table-card">
                <div className="table-head">
                  <div>
                    <h3>Recently added vehicles</h3>
                    <p>Review marketplace listings</p>
                  </div>
                  <button
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 transition hover:text-indigo-800"
                    onClick={() => setTab("vehicles")}
                  >
                    Manage listings <ArrowRight size={15} />
                  </button>
                </div>
                <AdminVehicleTable
                  vehicles={vehicles.slice(0, 5)}
                  moderate={moderate}
                />
              </div>
            </>
          )}
          {tab === "users" && (
            <>
              <div className="dash-content-head">
                <div>
                  <h2>Demo users</h2>
                  <p>Manage the sample account statuses.</p>
                </div>
              </div>
              <div className="table-card">
                <div className="table-scroll">
                  <table>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((u, i) => (
                        <tr key={u.email}>
                          <td>
                            <b>{u.name}</b>
                          </td>
                          <td>{u.email}</td>
                          <td>{u.role}</td>
                          <td>
                            <Badge
                              tone={
                                u.status === "Active" ? "available" : "error"
                              }
                            >
                              {u.status}
                            </Badge>
                          </td>
                          <td>
                            <button
                              className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-semibold text-indigo-700 transition hover:bg-indigo-50"
                              onClick={() =>
                                setUserStatus(
                                  i,
                                  u.status === "Active"
                                    ? "Suspended"
                                    : "Active",
                                )
                              }
                            >
                              {u.status === "Active" ? "Suspend" : "Activate"}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
          {tab === "vehicles" && (
            <>
              <div className="dash-content-head">
                <div>
                  <h2>Vehicle listings</h2>
                  <p>Review and moderate demo listings.</p>
                </div>
              </div>
              <div className="table-card">
                <AdminVehicleTable vehicles={vehicles} moderate={moderate} />
              </div>
            </>
          )}
          {tab === "bookings" && (
            <>
              <div className="dash-content-head">
                <div>
                  <h2>Booking records</h2>
                  <p>Filter booking requests by current status.</p>
                </div>
                <select
                  className="admin-filter"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  {[
                    "All",
                    "Pending",
                    "Confirmed",
                    "Completed",
                    "Cancelled",
                  ].map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div className="table-card">
                <BookingTable
                  bookings={bookings.filter(
                    (b) => status === "All" || b.status === status,
                  )}
                />
              </div>
            </>
          )}
          {tab === "settings" && (
            <>
              <div className="dash-content-head">
                <div>
                  <h2>Demo settings</h2>
                  <p>Restore the original portfolio sample data.</p>
                </div>
              </div>
              <div className="reset-card">
                <span className="reset-icon">
                  <RotateCcw />
                </span>
                <div>
                  <h3>Reset demo data</h3>
                  <p>
                    Restores the original vehicle list, users, and empty
                    bookings and favorites. This cannot be undone.
                  </p>
                </div>
                <button
                  className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  onClick={() => {
                    if (
                      window.confirm(
                        "Reset all RentWheels demo data to the original sample?",
                      )
                    ) {
                      resetStore();
                      location.reload();
                    }
                  }}
                >
                  Reset data
                </button>
              </div>
              <div className="demo-disclaimer">
                <ShieldCheck size={16} />
                This demo stores data only in your browser. No real accounts or
                bookings are created.
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  );
}
