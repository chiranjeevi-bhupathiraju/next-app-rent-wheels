# RentWheels (next-app-rent-wheels)

RentWheels is a frontend-only vehicle rental marketplace portfolio project built with the Next.js App Router, JavaScript, Tailwind CSS, and Lucide React. The app uses seeded Indian vehicle listings priced in INR and browser `localStorage`; it does not use a backend or real authentication.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Demo views

- Use **Demo account** in the header or visit `/login` to switch between Customer, Owner, and Admin views.
- Browse vehicles, search and filter, favorite listings, and submit booking requests.
- Owners can add, edit, and delete demo listings from `/owner/dashboard`.
- New and edited listings require at least three uploaded vehicle photos. Images are resized and saved in local browser storage.
- Admins can manage seeded user statuses, review pending listings, filter bookings, and reset demo data.

Data is stored in this browser only. The role selector is for demonstration and does not provide authentication or security. Booking totals are estimates; no payments or real bookings are processed. Vehicle and testimonial content is sample portfolio data.
