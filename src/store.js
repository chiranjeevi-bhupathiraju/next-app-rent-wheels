import { initialVehicles, categories } from "./data";

const keys = {
  vehicles: "rw_vehicles",
  bookings: "rw_bookings",
  favorites: "rw_favorites",
  role: "rw_role",
  users: "rw_users",
  categories: "rw_categories",
};
export function read(key, fallback) {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(keys[key] || key);
    return raw == null ? fallback : JSON.parse(raw);
  } catch {
    return fallback;
  }
}
export function write(key, value) {
  if (typeof window !== "undefined")
    localStorage.setItem(keys[key] || key, JSON.stringify(value));
}
export function initStore() {
  if (typeof window === "undefined") return;
  if (!localStorage.getItem(keys.vehicles)) write("vehicles", initialVehicles);
  else {
    const legacyRates = { v1: 89, v2: 115, v3: 225, v4: 72, v5: 98, v6: 54, v7: 39, v8: 62, v9: 27, v10: 145, v11: 119, v12: 225 };
    const current = read("vehicles", initialVehicles);
    let migrated = false;
    const updated = current.map((vehicle) => {
      const sample = initialVehicles.find((item) => item.id === vehicle.id);
      if (sample && vehicle.price === legacyRates[vehicle.id]) {
        migrated = true;
        return { ...vehicle, price: sample.price, location: sample.location, image: vehicle.image || sample.image, images: vehicle.images?.length ? vehicle.images : sample.images };
      }
      return vehicle;
    });
    if (migrated) write("vehicles", updated);
  }
  if (!localStorage.getItem(keys.bookings)) write("bookings", []);
  else {
    const legacyRates = { v1: 89, v2: 115, v3: 225, v4: 72, v5: 98, v6: 54, v7: 39, v8: 62, v9: 27, v10: 145, v11: 119, v12: 225 };
    const current = read("bookings", []);
    let migrated = false;
    const updated = current.map((booking) => {
      const sample = initialVehicles.find((vehicle) => vehicle.id === booking.vehicleId);
      const priorRate = legacyRates[booking.vehicleId];
      if (sample && priorRate && booking.days && booking.total === priorRate * booking.days) {
        migrated = true;
        return { ...booking, total: sample.price * booking.days };
      }
      return booking;
    });
    if (migrated) write("bookings", updated);
  }
  if (!localStorage.getItem(keys.favorites)) write("favorites", []);
  if (!localStorage.getItem(keys.categories)) write("categories", categories);
  if (!localStorage.getItem(keys.users))
    write("users", [
      {
        name: "Arjun Mehta",
        email: "arjun@rentwheels.demo",
        role: "Owner",
        status: "Active",
      },
      {
        name: "Priya Nair",
        email: "priya@rentwheels.demo",
        role: "Owner",
        status: "Active",
      },
      {
        name: "Neha Kapoor",
        email: "neha@rentwheels.demo",
        role: "Customer",
        status: "Active",
      },
    ]);
  else {
    const names = { "Alex Morgan": ["Arjun Mehta", "arjun@rentwheels.demo"], "Jordan Lee": ["Priya Nair", "priya@rentwheels.demo"], "Taylor Brooks": ["Neha Kapoor", "neha@rentwheels.demo"] };
    const current = read("users", []);
    let migrated = false;
    const updated = current.map((user) => {
      const replacement = names[user.name];
      if (!replacement) return user;
      migrated = true;
      return { ...user, name: replacement[0], email: replacement[1] };
    });
    if (migrated) write("users", updated);
  }
}
export function resetStore() {
  if (typeof window !== "undefined") {
    Object.values(keys).forEach((k) => localStorage.removeItem(k));
    initStore();
  }
}
