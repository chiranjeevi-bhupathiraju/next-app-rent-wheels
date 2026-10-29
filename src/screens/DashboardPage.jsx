"use client";
import { useState } from 'react';
import { ArrowRight, CalendarDays, CarFront, Clock3, Heart, Plus, ShieldCheck, LayoutDashboard, ListChecks, CircleDollarSign, LogOut, Pencil, Trash2, CheckCircle2 } from 'lucide-react';
import { Badge, Empty, Image, PageHead, Price, Stat } from '../components/MarketplaceUI';
import VehicleCard from '../components/VehicleCard';
import BookingTable from '../components/BookingTable';
import VehicleEditor from '../components/VehicleEditor';
import { money } from '../utils';
import { write } from '../store';
export function Dashboard({
  type,
  vehicles,
  bookings,
  favorites,
  toggleFavorite,
  saveBookings,
  saveVehicles,
  notify,
}) {
  const [tab, setTab] = useState(type === "Owner" ? "vehicles" : "overview"),
    [editing, setEditing] = useState(null);
  const ownerVehicles = vehicles.filter(
    (v) => v.owner === "Demo Owner" || v.ownerId === "demo-owner",
  );
  const mine = type === "Owner" ? bookings : bookings;
  const cancelBooking = (b) => {
    saveBookings(
      bookings.map((x) => (x.id === b.id ? { ...x, status: "Cancelled" } : x)),
    );
    notify("Booking cancelled.");
  };
  const acceptBooking = (b) => {
    saveBookings(
      bookings.map((x) => (x.id === b.id ? { ...x, status: "Confirmed" } : x)),
    );
    notify("Request confirmed.");
  };
  const deleteVehicle = (v) => {
    if (window.confirm(`Delete ${v.name} from your demo listings?`)) {
      saveVehicles(vehicles.filter((x) => x.id !== v.id));
      notify("Vehicle listing deleted.");
    }
  };
  const toggleAvailability = (vehicle) =>
    saveVehicles(
      vehicles.map((v) =>
        v.id === vehicle.id ? { ...v, available: !v.available } : v,
      ),
    );
  const dashNav =
    type === "Owner"
      ? [
          ["vehicles", "My vehicles", CarFront],
          ["requests", "Booking requests", ListChecks],
          ["history", "Booking history", Clock3],
        ]
      : [
          ["overview", "Overview", LayoutDashboard],
          ["bookings", "My bookings", ListChecks],
          ["favorites", "Favorites", Heart],
        ];
  const shownBookings = type === "Customer" ? mine : mine;
  if (editing)
    return (
      <main className="mx-auto min-h-[65vh] max-w-7xl px-4 py-9 sm:px-6 sm:py-14">
        <PageHead
          eyebrow="OWNER DASHBOARD"
          title={editing === "new" ? "Add a vehicle" : "Edit vehicle listing"}
          description="Share the important details about your ride."
        />
        <div className="mt-6">
          <VehicleEditor
            mode={editing === "new" ? "new" : "edit"}
            vehicle={editing === "new" ? undefined : editing}
            vehicles={vehicles}
            saveVehicles={saveVehicles}
            notify={notify}
            onCancel={() => setEditing(null)}
          />
        </div>
      </main>
    );
  return (
    <main className="mx-auto max-w-7xl px-4 py-9 sm:px-6 sm:py-14">
      <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-indigo-600">{type.toUpperCase()} DEMO DASHBOARD</div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
            {type === "Owner"
              ? "Your rental workspace"
              : "Welcome back, traveler"}
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            {type === "Owner"
              ? "Manage your listings and booking requests."
              : "Keep an eye on your rides and booking requests."}
          </p>
        </div>
        <button
          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50"
          onClick={() => {
            write("role", null);
            window.location.href = "/login";
          }}
        >
          <LogOut size={16} />
          Switch role
        </button>
      </div>
      <div className="grid items-start gap-6 lg:grid-cols-[230px_minmax(0,1fr)]">
        <aside className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-4 flex items-center gap-3 border-b border-slate-100 pb-4">
            <span className="grid h-11 w-11 place-items-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700">{type === "Owner" ? "DO" : "JD"}</span>
            <div>
              <b className="block text-sm font-bold text-slate-900">{type === "Owner" ? "Demo Owner" : "Jamie Demo"}</b>
              <small className="text-xs text-slate-500">{type} account</small>
            </div>
          </div>
          <div className="space-y-1">
            {dashNav.map(([key, label, Icon]) => (
              <button
                key={key}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition ${tab === key ? "bg-indigo-50 text-indigo-700" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}
                onClick={() => setTab(key)}
              >
                <Icon size={17} />
                {label}
                {key === "requests" &&
                  bookings.filter((b) => b.status === "Pending").length > 0 && (
                    <span className="ml-auto grid h-5 min-w-5 place-items-center rounded-full bg-indigo-100 px-1 text-[10px] font-bold text-indigo-700">
                      {bookings.filter((b) => b.status === "Pending").length}
                    </span>
                  )}
              </button>
            ))}
          </div>
          <div className="mt-4 border-t border-slate-100 pt-4">
            <span className="flex items-center gap-2 text-xs text-slate-500">
              <ShieldCheck size={15} className="text-indigo-500" />
              Demo environment
            </span>
            {type === "Customer" && (
              <a className="mt-3 flex items-center justify-between rounded-xl bg-indigo-50 px-3 py-2.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-100" href="/vehicles">
                Browse vehicles <ArrowRight size={14} />
              </a>
            )}
          </div>
        </aside>
        <section className="min-w-0 space-y-5">
          {type === "Customer" && tab === "overview" && (
            <>
              <div className="dash-content-head">
                <div>
                  <h2>Overview</h2>
                  <p>Here’s a snapshot of your activity.</p>
                </div>
                <a href="/vehicles" className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-600/20 transition hover:bg-indigo-700">
                  Find a ride <ArrowRight size={16} />
                </a>
              </div>
              <div className="stats-grid">
                <Stat
                  icon={ListChecks}
                  label="Total bookings"
                  value={shownBookings.length}
                  sub="All time"
                />
                <Stat
                  icon={CalendarDays}
                  label="Upcoming"
                  value={
                    shownBookings.filter(
                      (b) => b.status === "Pending" || b.status === "Confirmed",
                    ).length
                  }
                  sub="Requests & confirmed"
                />
                <Stat
                  icon={CheckCircle2}
                  label="Completed"
                  value={
                    shownBookings.filter((b) => b.status === "Completed").length
                  }
                  sub="Completed bookings"
                />
              </div>
              <div className="table-card">
                <div className="table-head">
                  <div>
                    <h3>Recent booking requests</h3>
                    <p>Your latest activity</p>
                  </div>
                  <button
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 transition hover:text-indigo-800"
                    onClick={() => setTab("bookings")}
                  >
                    View all <ArrowRight size={15} />
                  </button>
                </div>
                {shownBookings.length ? (
                  <BookingTable
                    bookings={shownBookings.slice(0, 5)}
                    onCancel={cancelBooking}
                  />
                ) : (
                  <Empty
                    title="No bookings yet"
                    desc="Your booking requests will show up here."
                    action={
                      <a href="/vehicles" className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-600/20 transition hover:bg-indigo-700">
                        Browse vehicles
                      </a>
                    }
                  />
                )}
              </div>
            </>
          )}
          {type === "Customer" && tab === "bookings" && (
            <>
              <div className="dash-content-head">
                <div>
                  <h2>My bookings</h2>
                  <p>View your booking requests and their status.</p>
                </div>
              </div>
              {shownBookings.length ? (
                <div className="table-card">
                  <BookingTable
                    bookings={shownBookings}
                    onCancel={cancelBooking}
                  />
                </div>
              ) : (
                <Empty
                  title="No bookings yet"
                  desc="Find your next ride to start a booking request."
                  action={
                    <a href="/vehicles" className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-600/20 transition hover:bg-indigo-700">
                      Browse vehicles
                    </a>
                  }
                />
              )}
            </>
          )}
          {type === "Customer" && tab === "favorites" && (
            <>
              <div className="dash-content-head">
                <div>
                  <h2>Favorite vehicles</h2>
                  <p>Your saved rides, all in one place.</p>
                </div>
              </div>
              {favorites.length ? (
                <div className="vehicle-grid browse-grid">
                  {vehicles
                    .filter((v) => favorites.includes(v.id))
                    .map((v) => (
                      <VehicleCard
                        key={v.id}
                        v={v}
                        favorite
                        onFavorite={toggleFavorite}
                      />
                    ))}
                </div>
              ) : (
                <Empty
                  title="No favorites yet"
                  desc="Tap the heart on any ride to save it here."
                  action={
                    <a href="/vehicles" className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-600/20 transition hover:bg-indigo-700">
                      Explore vehicles
                    </a>
                  }
                />
              )}
            </>
          )}
          {type === "Owner" && tab === "vehicles" && (
            <>
              <div className="dash-content-head">
                <div>
                  <h2>My vehicles</h2>
                  <p>Keep your listings up to date.</p>
                </div>
                <button
                  className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-600/20 transition hover:bg-indigo-700"
                  onClick={() => setEditing("new")}
                >
                  <Plus size={17} />
                  Add vehicle
                </button>
              </div>
              <div className="stats-grid compact-stats">
                <Stat
                  icon={CarFront}
                  label="Total listed"
                  value={ownerVehicles.length}
                  sub="Your demo listings"
                />
                <Stat
                  icon={CheckCircle2}
                  label="Available"
                  value={ownerVehicles.filter((v) => v.available).length}
                  sub="Open for requests"
                />
                <Stat
                  icon={ListChecks}
                  label="Pending requests"
                  value={bookings.filter((b) => b.status === "Pending").length}
                  sub="Awaiting response"
                />
                <Stat
                  icon={CircleDollarSign}
                  label="Demo earnings"
                  value={money(
                    bookings
                      .filter((b) => b.status === "Completed")
                      .reduce((s, b) => s + b.total, 0),
                  )}
                  sub="Estimate from demo records"
                />
              </div>
              {ownerVehicles.length ? (
                <div className="table-card">
                  <div className="table-head">
                    <div>
                      <h3>Your listings</h3>
                      <p>{ownerVehicles.length} vehicles</p>
                    </div>
                  </div>
                  <div className="owner-list">
                    {ownerVehicles.map((v) => (
                      <div className="owner-row" key={v.id}>
                        <Image src={v.image} alt="" />
                        <div className="owner-row-title">
                          <b>{v.name}</b>
                          <small>
                            {v.category} · {v.location}
                          </small>
                        </div>
                        <Price value={v.price} />
                        <button
                          className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-300 ${v.available ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}
                          onClick={() => toggleAvailability(v)}
                          aria-label={`Set ${v.name} ${v.available ? "unavailable" : "available"}`}
                        >
                          {v.available ? "Available" : "Unavailable"}
                        </button>
                        <div className="row-actions">
                          <button
                            className="icon-button"
                            aria-label="Edit listing"
                            onClick={() => setEditing(v)}
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            className="icon-button danger-icon"
                            aria-label="Delete listing"
                            onClick={() => deleteVehicle(v)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <Empty
                  title="Your first listing starts here"
                  desc="Add a vehicle to make it available in your demo marketplace."
                  action={
                    <button
                      className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-600/20 transition hover:bg-indigo-700"
                      onClick={() => setEditing("new")}
                    >
                      Add a vehicle <Plus size={16} />
                    </button>
                  }
                />
              )}
            </>
          )}
          {type === "Owner" && tab === "requests" && (
            <>
              <div className="dash-content-head">
                <div>
                  <h2>Booking requests</h2>
                  <p>Review recent requests on your demo listings.</p>
                </div>
              </div>
              {bookings.length ? (
                <div className="table-card">
                  <BookingTable
                    bookings={bookings}
                    onCancel={cancelBooking}
                    onAccept={acceptBooking}
                  />
                </div>
              ) : (
                <Empty
                  title="No booking requests"
                  desc="New requests will appear here."
                />
              )}
            </>
          )}
          {type === "Owner" && tab === "history" && (
            <>
              <div className="dash-content-head">
                <div>
                  <h2>Booking history</h2>
                  <p>Completed and cancelled demo bookings.</p>
                </div>
              </div>
              <div className="table-card">
                <BookingTable
                  bookings={bookings.filter(
                    (b) => b.status === "Completed" || b.status === "Cancelled",
                  )}
                  onCancel={cancelBooking}
                />
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  );
}
