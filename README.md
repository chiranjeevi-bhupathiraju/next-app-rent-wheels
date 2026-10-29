# RentWheels

RentWheels is a frontend vehicle rental marketplace demo. Browse vehicles, submit booking requests, and explore customer, owner, and admin views. The app uses sample listings in INR and stores demo data in your browser; it does not use a backend or provide real authentication or payments.

## Features

- Browse and search vehicle listings by location, category, price, and availability
- View vehicle details and save favorite vehicles
- Submit and manage demo booking requests
- Create, edit, and delete owner vehicle listings
- Upload at least three vehicle photos for new or edited listings
- Review listings, bookings, and demo users in the admin view
- Responsive layouts styled with Tailwind CSS

## Tech stack

- Next.js App Router
- React 19
- Tailwind CSS
- React Hook Form and Zod
- Lucide React icons

## Prerequisites

- Node.js 20.9 or later
- npm

## Getting started

1. Clone the repository and move into the project directory:

   ```bash
   git clone https://github.com/chiranjeevi-bhupathiraju/next-app-rent-wheels.git
   cd next-app-rent-wheels
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. Browse vehicles from the home page or open **Explore vehicles**.
2. Search and filter by location, category, price, or availability.
3. Open a listing to view its details, save it as a favorite, or submit a demo booking request.
4. Use **Demo account** in the header or visit `/login` to switch between Customer, Owner, and Admin views.
5. In the Owner view, manage listings and booking requests from `/owner/dashboard`.
6. In the Admin view, review listings, bookings, and demo user statuses.

Changes are saved in browser `localStorage` and are cleared if the app's demo data is reset or browser storage is removed. The role selector is for demonstration only. Booking requests do not create real reservations or process payments.

## Available scripts

### `npm run dev`

Starts the Next.js development server with live reloading.

### `npm run build`

Creates an optimized production build.

### `npm start`

Starts the production server. Run `npm run build` first.

## Project structure

```text
app/
  [[...slug]]/page.jsx   Route entry point for marketplace pages
  globals.css            Global styles and Tailwind directives
  layout.jsx             Root app layout
src/
  components/            Vehicle cards, editors, tables, and shared UI
  screens/               Home, browse, login, dashboard, admin, and detail views
  data.js                Seeded demo listings and marketplace data
  Marketplace.jsx        Marketplace state and page composition
  store.js               Browser localStorage helpers
  utils.js               Formatting and date utilities
```
