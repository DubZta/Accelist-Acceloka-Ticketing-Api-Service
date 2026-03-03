# Acceloka UI — Frontend Ticketing Platform

A product-first SaaS ticketing homepage built with **Next.js 16**, **TypeScript**, and **Tailwind CSS**, integrated with the [Accelist Acceloka Ticketing API Service](https://github.com/DubZta/Accelist-Acceloka-Ticketing-Api-Service) backend.

Developed as part of **Accelist Exam 2 — 2026**.

---

## 📋 Exam Requirements Compliance

| Requirement | Status | Implementation |
|-------------|--------|----------------|
| **Display Available Tickets** | ✅ | `ProductSection.tsx` — Server-side fetch with filters, pagination, and category-based display |
| **Search & Filter** | ✅ | `SearchForm.tsx` — Keyword, category, date range, max price, ticket code, order by |
| **Book Ticket (POST)** | ✅ | `CartDrawer.tsx` — Multi-ticket cart with single-transaction booking |
| **Get Booked Ticket (GET)** | ✅ | `my-booking/page.tsx` — Full booking details by Booking Reference |
| **Edit Booked Ticket (PUT)** | ✅ | `my-booking/page.tsx` — Inline quantity editor with live refresh |
| **Revoke Ticket (DELETE)** | ✅ | `my-booking/page.tsx` — Partial or full revocation with confirmation |
| **EventDate kept as string** | ✅ | `eventDate` field is always rendered as-is (`dd-MM-yyyy HH:mm`) — never parsed |
| **RFC 7807 Error Display** | ✅ | All API error responses show `problem.detail` in the UI |

---

## 🚀 Tech Stack

| Technology | Purpose |
|------------|---------|
| **Next.js 16** | Fullstack React framework (App Router) |
| **TypeScript** | Type-safe development |
| **Tailwind CSS v4** | Utility-first styling |
| **Framer Motion** | Entrance animations on Hero & About page |
| **motion** | AnimatedList component for booking results |
| **dayjs** | Date formatting utilities (non-EventDate fields) |

---

## 📁 Project Structure

```
acceloka-ui/
├── public/                    # Static assets (logo, images)
├── src/
│   ├── app/
│   │   ├── about/page.tsx     # About page with Aurora background & Framer Motion
│   │   ├── book/[kodeTiket]/  # Individual ticket booking page
│   │   ├── my-booking/        # Booking management portal (GET, PUT, DELETE)
│   │   ├── layout.tsx         # Root layout with CartProvider & GlobalReset
│   │   └── page.tsx           # Homepage (Hero + Stats + ProductSection)
│   ├── components/
│   │   ├── ui/
│   │   │   ├── aurora-background.tsx  # Reusable animated aurora effect
│   │   │   ├── animated-list.tsx      # Scroll-triggered animated list
│   │   │   └── spotlight-card.tsx     # Neon spotlight hover effect for cards
│   │   ├── CartDrawer.tsx     # Floating shopping cart with checkout
│   │   ├── Hero.tsx           # Landing hero section with Aurora + animations
│   │   ├── Navbar.tsx         # Fixed top navigation bar
│   │   ├── Footer.tsx         # Site footer
│   │   ├── ProductSection.tsx # Server component: fetches & displays tickets
│   │   ├── SearchForm.tsx     # Client component: search filters & URL sync
│   │   ├── TicketCard.tsx     # Individual ticket card with Spotlight effect
│   │   ├── Stats.tsx          # Platform statistics bar
│   │   └── GlobalReset.tsx    # Clears URL params on browser refresh
│   └── context/
│       └── CartContext.tsx    # Global cart state (localStorage-backed)
```

---

## ⚙️ Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9
- The **Acceloka API backend** running at `http://localhost:5176`

---

## 🛠️ Installation & Setup

### Step 1: Clone and Navigate

```bash
git clone https://github.com/DubZta/Accelist-Acceloka-Ticketing-Api-Service
cd Accelist-Acceloka-Ticketing-Api-Service/acceloka-ui
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Start the Backend

Make sure the .NET API is running before starting the frontend:

```bash
cd ..
dotnet run
```

The API must be available at: `http://localhost:5176`

### Step 4: Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Build & Lint

```bash
# Check for TypeScript & ESLint errors
npm run lint

# Create a production build (must succeed with 0 errors)
npm run build
```

---

## 🌐 API Endpoints Used

All requests target the local backend at `http://localhost:5176`.

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/get-available-ticket` | Fetch paginated, filtered ticket list |
| `POST` | `/api/v1/book-ticket` | Book one or more tickets in a single transaction |
| `GET` | `/api/v1/get-booked-ticket/{id}` | Retrieve full booking details by Booking Reference |
| `PUT` | `/api/v1/edit-booked-ticket/{id}` | Edit quantity of a booked ticket |
| `DELETE` | `/api/v1/revoke-ticket/{id}/{code}/{qty}` | Revoke a quantity of a booked ticket |
| `GET` | `/api/v1/list-booked-ticket-ids` | List all distinct Booking Reference IDs |

---

## 🎨 Key UI Features

- **Aurora Background** — Animated flowing light effect on Hero, About, and My Booking pages.
- **Spotlight Cards** — Neon cursor-tracking glow effect on every ticket card.
- **Shopping Cart** — Multi-ticket selection with a floating drawer, grouped by category.
- **AnimatedList** — Smooth scroll-triggered animations for booking results.
- **Glassmorphism** — Frosted-glass search cards and ticket result containers.
- **Responsive Pagination** — Full server-side pagination on the event grid.

---

## 📌 Important Technical Notes

### EventDate Rule
The `eventDate` field from the API (`dd-MM-yyyy HH:mm` format) is **always displayed as a raw string**. It is **never** parsed with `new Date()` or `dayjs()` to avoid breaking the exam compliance requirement.

### Cart Persistence
The shopping cart is backed by **localStorage** under the key `acceloka_cart`. It persists across page refreshes and is only cleared on a successful booking.

### URL-driven Search State
All search parameters (keyword, category, date, maxDate, maxPrice, ticketCode, page, orderBy, orderState) are serialized into the URL query string. This makes searches shareable, bookmarkable, and SSR-friendly.

---

## 🏗️ Exam Alignment Summary

This UI is built specifically to satisfy **Accelist Exam 2 — 2026** requirements:

- ✅ All 4 core API operations (Book, Get, Edit, Revoke) are accessible from the UI
- ✅ `EventDate` is treated as an opaque string — never re-parsed
- ✅ RFC 7807 error `problem.detail` messages are surfaced in the UI
- ✅ No secrets (`.env`, `.env.local`) are committed to the repository
- ✅ No build artifacts (`.next/`, `node_modules/`) are committed
- ✅ Production build passes with 0 errors

---

## 📄 License

Developed for **Accelist Exam 2 — 2026** as part of the internship competency examination.
