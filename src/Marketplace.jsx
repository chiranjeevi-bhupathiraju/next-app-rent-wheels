"use client";
import { useEffect, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { initialVehicles } from './data';
import { initStore, read, write } from './store';
import { Header, Footer } from './components/MarketplaceUI';
import { Home as HomePage } from './screens/HomePage';
import { Browse as BrowsePage } from './screens/BrowsePage';
import { Details as VehicleDetailPage } from './screens/VehicleDetailPage';
import { Login as LoginPage } from './screens/LoginPage';
import VehicleEditor from './components/VehicleEditor';
import { Dashboard as DashboardPage } from './screens/DashboardPage';
import { Admin as AdminPage } from './screens/AdminPage';
export default function Marketplace({ path, query }) {
  const [role, setRole] = useState(null),
    [roleReady, setRoleReady] = useState(false),
    [vehicles, setVehicles] = useState(initialVehicles),
    [bookings, setBookings] = useState([]),
    [favorites, setFavorites] = useState([]),
    [users, setUsers] = useState([]),
    [toast, setToast] = useState("");
  const segment = path.split("/").filter(Boolean);
  const refresh = () => {
    setVehicles(read("vehicles", initialVehicles));
    setBookings(read("bookings", []));
    setFavorites(read("favorites", []));
    setUsers(read("users", []));
  };
  useEffect(() => {
    initStore();
    refresh();
    const savedRole = read("role", null);
    setRole(["Customer", "Owner", "Admin"].includes(savedRole) ? savedRole : null);
    setRoleReady(true);
  }, []);
  const roleRoots = ["customer", "owner", "admin"];
  const allowedRoute = role
    ? segment[0] === "login" || (
        role === "Admin"
          ? segment[0] === "admin"
          : role === "Customer"
            ? ["customer", "vehicles"].includes(segment[0])
            : ["owner", "list-vehicle"].includes(segment[0])
      )
    : segment[0] === "login" || !roleRoots.includes(segment[0]);
  const roleHome = role === "Admin"
    ? "/admin/dashboard"
    : role === "Customer"
      ? "/vehicles"
      : "/owner/dashboard";
  useEffect(() => {
    if (roleReady && !allowedRoute) {
      window.location.replace(role ? roleHome : "/login");
    }
  }, [roleReady, allowedRoute, role, roleHome]);
  const notify = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2800);
  };
  const toggleFavorite = (id) => {
    const next = favorites.includes(id)
      ? favorites.filter((x) => x !== id)
      : [...favorites, id];
    setFavorites(next);
    write("favorites", next);
  };
  const saveVehicles = (next) => {
    setVehicles(next);
    write("vehicles", next);
  };
  const saveBookings = (next) => {
    setBookings(next);
    write("bookings", next);
  };
  if (!roleReady || !allowedRoute) {
    return (
      <main className="grid min-h-[70vh] place-items-center px-4 text-sm font-medium text-slate-500">
        Loading your workspace…
      </main>
    );
  }
  return (
    <>
      <Header role={role} setRole={setRole} path={path} query={query} />
      {segment[0] === "vehicles" && segment[1] ? (
        <VehicleDetailPage
          id={segment[1]}
          vehicles={vehicles}
          bookings={bookings}
          saveBookings={saveBookings}
          notify={notify}
        />
      ) : segment[0] === "vehicles" ? (
        <BrowsePage
          vehicles={vehicles}
          favorites={favorites}
          toggleFavorite={toggleFavorite}
          query={query}
        />
      ) : segment[0] === "login" ? (
        <LoginPage setRole={setRole} />
      ) : segment[0] === "list-vehicle" ? (
        <VehicleEditor
          mode="new"
          vehicles={vehicles}
          saveVehicles={saveVehicles}
          notify={notify}
        />
      ) : segment[0] === "customer" ? (
        <DashboardPage
          type="Customer"
          vehicles={vehicles}
          bookings={bookings}
          favorites={favorites}
          toggleFavorite={toggleFavorite}
          saveBookings={saveBookings}
          saveVehicles={saveVehicles}
          notify={notify}
        />
      ) : segment[0] === "owner" ? (
        <DashboardPage
          type="Owner"
          vehicles={vehicles}
          bookings={bookings}
          favorites={favorites}
          toggleFavorite={toggleFavorite}
          saveBookings={saveBookings}
          saveVehicles={saveVehicles}
          notify={notify}
        />
      ) : segment[0] === "admin" ? (
        <AdminPage
          vehicles={vehicles}
          bookings={bookings}
          saveVehicles={saveVehicles}
          users={users}
          setUsers={setUsers}
          saveBookings={saveBookings}
          notify={notify}
        />
      ) : (
        <HomePage
          vehicles={vehicles}
          favorites={favorites}
          toggleFavorite={toggleFavorite}
        />
      )}
      <Footer role={role} />
      {toast && (
        <div className="fixed bottom-4 left-1/2 z-[80] flex w-[calc(100%-2rem)] -translate-x-1/2 items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-xs text-white shadow-xl sm:bottom-6 sm:w-auto">
          <CheckCircle2 className="text-emerald-400" size={18} />
          {toast}
        </div>
      )}
    </>
  );
}
