"use client";
import { useEffect, useState } from "react";
import { ArrowRight, Plus, X } from "lucide-react";
import { Image } from "./MarketplaceUI";
import { categories as baseCategories } from "../data";
import { compressImage } from "../utils";

const draftKey = "rw_vehicle_form_draft";
const blankForm = () => ({
  name: "",
  make: "",
  model: "",
  category: "Cars & SUVs",
  description: "",
  location: "",
  price: "",
  seats: "5",
  transmission: "Automatic",
  fuel: "Gasoline",
  images: [],
  available: true,
});

export default function VehicleEditor({
  mode = "new",
  vehicle,
  vehicles,
  saveVehicles,
  notify,
  onCancel,
  role,
}) {
  const [form, setForm] = useState(vehicle || blankForm());
  const [errors, setErrors] = useState({});
  const [savedImages, setSavedImages] = useState(
    vehicle?.images || (vehicle?.image ? [vehicle.image] : []),
  );
  const [newImages, setNewImages] = useState([]);
  const [imageError, setImageError] = useState("");
  const [processingImages, setProcessingImages] = useState(false);
  const [draftReady, setDraftReady] = useState(mode !== "new");
  useEffect(() => {
    if (mode !== "new") {
      setDraftReady(true);
      return;
    }
    try {
      const saved = sessionStorage.getItem(draftKey);
      if (saved) {
        const draft = JSON.parse(saved);
        setForm({ ...blankForm(), ...draft.form });
        setSavedImages(draft.savedImages || []);
        setNewImages(draft.newImages || []);
      }
    } catch {
      setImageError("We couldn't restore your saved form draft. Please re-enter the details.");
    } finally {
      setDraftReady(true);
    }
  }, [mode]);
  const update = (key, value) => setForm({ ...form, [key]: value });
  const addImages = async (event) => {
    const files = Array.from(event.target.files || []);
    setImageError("");
    if (savedImages.length + newImages.length + files.length > 6) {
      setImageError("You can add up to 6 photos.");
      event.target.value = "";
      return;
    }
    if (files.some((file) => !file.type.startsWith("image/"))) {
      setImageError("Choose image files only.");
      event.target.value = "";
      return;
    }
    setProcessingImages(true);
    try {
      const compressed = await Promise.all(files.map(compressImage));
      setNewImages((current) => [...current, ...compressed]);
      setErrors((current) => ({ ...current, images: "" }));
    } catch {
      setImageError("One or more photos could not be read. Please try again.");
    } finally {
      setProcessingImages(false);
      event.target.value = "";
    }
  };
  const removeImage = (index, isSaved) => {
    if (isSaved) setSavedImages((items) => items.filter((_, i) => i !== index));
    else setNewImages((items) => items.filter((_, i) => i !== index));
  };
  const save = (e) => {
    e.preventDefault();
    if (!draftReady) return;
    const nextErrors = {};
    if (!form.name.trim()) nextErrors.name = "Vehicle name is required.";
    if (!form.make.trim()) nextErrors.make = "Make is required.";
    if (!form.model.trim()) nextErrors.model = "Model is required.";
    if (!form.location.trim()) nextErrors.location = "Location is required.";
    if (!form.description.trim())
      nextErrors.description = "Add a short description.";
    if (!Number(form.price) || Number(form.price) < 1)
      nextErrors.price = "Enter a positive daily price.";
    if (savedImages.length + newImages.length < 3)
      nextErrors.images = "Upload at least 3 vehicle photos.";
    if (!baseCategories.includes(form.category))
      nextErrors.category = "Choose a category.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    if (mode === "new" && role !== "Owner") {
      try {
        sessionStorage.setItem(
          draftKey,
          JSON.stringify({ form, savedImages, newImages }),
        );
      } catch {
        setImageError("Your draft is too large to save. Remove a photo and try again.");
        return;
      }
      window.location.href = `/login?role=Owner&next=${encodeURIComponent("/list-vehicle")}`;
      return;
    }
    const images = [...savedImages, ...newImages];
    const item = {
      ...form,
      id: vehicle?.id || `v${Date.now()}`,
      price: Number(form.price),
      seats: Number(form.seats) || 2,
      rating: vehicle?.rating || 4.8,
      year: vehicle?.year || new Date().getFullYear(),
      owner: vehicle?.owner || "Demo Owner",
      approval: vehicle?.approval || "Pending",
      features: vehicle?.features || ["Bluetooth", "USB charging"],
      images,
      image: images[0],
    };
    saveVehicles(
      mode === "edit"
        ? vehicles.map((v) => (v.id === item.id ? item : v))
        : [item, ...vehicles],
    );
    notify(
      mode === "edit" ? "Vehicle listing updated." : "Vehicle listing saved.",
    );
    if (mode === "new") {
      sessionStorage.removeItem(draftKey);
      setForm(blankForm());
      setSavedImages([]);
      setNewImages([]);
    }
    if (onCancel) onCancel();
    else window.location.href = "/owner/dashboard";
  };
  const field = (key, label, opts = {}) => {
    const controlClass = "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100";
    return (
    <label className="mb-1 flex min-w-0 flex-col gap-2">
      <span className="text-xs font-semibold text-slate-700">
        {label}
        {opts.required && <em> *</em>}
      </span>
      {opts.select ? (
        <select className={controlClass} value={form[key]} onChange={(e) => update(key, e.target.value)}>
          {opts.options.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
      ) : opts.textarea ? (
        <textarea
          className={controlClass}
          rows="4"
          value={form[key]}
          onChange={(e) => update(key, e.target.value)}
          placeholder={opts.placeholder}
        />
      ) : (
        <input
          className={controlClass}
          type={opts.type || "text"}
          value={form[key]}
          onChange={(e) => update(key, e.target.value)}
          placeholder={opts.placeholder}
          min={opts.type === "number" ? 1 : undefined}
        />
      )}
      {errors[key] && <small className="text-xs font-medium text-rose-600">{errors[key]}</small>}
    </label>
    );
  };
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
      <form className="mx-auto max-w-4xl rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8" onSubmit={save} noValidate>
      {mode === "new" && role !== "Owner" && (
        <div className="mb-6 rounded-xl border border-indigo-100 bg-indigo-50/70 px-4 py-3 text-sm leading-6 text-indigo-900">
          Fill in your vehicle details first. When you select <b>Add vehicle</b>, you’ll sign in as an Owner and your draft will be restored.
        </div>
      )}
      <div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2">
        {field("name", "Vehicle name", {
          required: true,
          placeholder: "e.g. Tesla Model 3",
        })}
        {field("make", "Make", { required: true, placeholder: "e.g. Tesla" })}
        {field("model", "Model", {
          required: true,
          placeholder: "e.g. Model 3",
        })}
        {field("category", "Category", {
          required: true,
          select: true,
          options: baseCategories,
        })}
        {field("location", "Area / city", {
          required: true,
          placeholder: "e.g. Indiranagar, Bengaluru",
        })}
        {field("price", "Daily price (INR)", {
          required: true,
          type: "number",
          placeholder: "2500",
        })}
        {field("seats", "Seats", { type: "number", placeholder: "5" })}
        {field("transmission", "Transmission", {
          select: true,
          options: ["Automatic", "Manual", "N/A"],
        })}
        {field("fuel", "Fuel type", {
          select: true,
          options: ["Gasoline", "Diesel", "Hybrid", "Electric", "N/A"],
        })}
        <div className="flex min-w-0 flex-col gap-2 md:col-span-2">
          <span className="text-xs font-semibold text-slate-700">
            Vehicle photos <em>*</em>
          </span>
          <small className="text-xs leading-5 text-slate-500">
            Upload at least 3 photos (up to 6). Images are resized and saved in
            this browser.
          </small>
          <label className="flex min-h-40 cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-indigo-200 bg-indigo-50/40 px-4 py-6 text-center transition hover:border-indigo-400 hover:bg-indigo-50">
            <input className="sr-only" type="file" accept="image/*" multiple onChange={addImages} />
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-white text-indigo-600 shadow-sm">
              <Plus size={19} />
            </span>
            <b className="text-sm font-semibold text-slate-800">
              {processingImages
                ? "Preparing photos..."
                : "Choose vehicle photos"}
            </b>
            <small className="text-xs text-slate-500">JPG, PNG or WebP · 3 photos minimum</small>
          </label>
          {savedImages.length + newImages.length > 0 && (
            <div className="grid grid-cols-3 gap-3 pt-1 sm:grid-cols-4 lg:grid-cols-6">
              {savedImages.map((src, index) => (
                <div className="group relative aspect-square overflow-hidden rounded-xl bg-slate-100" key={`saved-${index}`}>
                  <Image className="h-full w-full object-cover" src={src} alt={`Vehicle photo ${index + 1}`} />
                  <button
                    className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-slate-950/75 text-white opacity-0 transition group-hover:opacity-100 focus:opacity-100"
                    type="button"
                    aria-label="Remove photo"
                    onClick={() => removeImage(index, true)}
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
              {newImages.map((src, index) => (
                <div className="group relative aspect-square overflow-hidden rounded-xl bg-slate-100" key={`new-${index}`}>
                  <Image
                    className="h-full w-full object-cover"
                    src={src}
                    alt={`Uploaded vehicle photo ${savedImages.length + index + 1}`}
                  />
                  <button
                    className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-slate-950/75 text-white opacity-0 transition group-hover:opacity-100 focus:opacity-100"
                    type="button"
                    aria-label="Remove photo"
                    onClick={() => removeImage(index, false)}
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
          {errors.images && (
            <small className="text-xs font-medium text-rose-600">{errors.images}</small>
          )}
          {imageError && <small className="text-xs font-medium text-rose-600">{imageError}</small>}
        </div>
        <div className="md:col-span-2">
          {field("description", "Description", {
            required: true,
            textarea: true,
            placeholder: "What makes this ride a great fit?",
          })}
        </div>
      </div>
      <label className="mt-5 flex cursor-pointer items-center gap-3 rounded-xl bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700">
        <input
          className="h-4 w-4 accent-indigo-600"
          type="checkbox"
          checked={form.available}
          onChange={(e) => update("available", e.target.checked)}
        />
        Available for bookings
      </label>
      <div className="mt-7 flex flex-col-reverse justify-end gap-3 border-t border-slate-100 pt-5 sm:flex-row">
        <button
          type="button"
          className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-200 px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          onClick={
            onCancel || (() => (window.location.href = "/owner/dashboard"))
          }
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!draftReady || processingImages}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 text-sm font-semibold text-white shadow-md shadow-indigo-600/20 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {mode === "edit" ? "Save changes" : processingImages ? "Preparing photos..." : !draftReady ? "Restoring draft..." : "Add vehicle"}{" "}
          <ArrowRight size={16} />
        </button>
      </div>
      </form>
    </main>
  );
}
