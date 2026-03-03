# 🎫 Accelist Acceloka - Ticketing Platform

A complete SaaS ticketing solution built with **ASP.NET 10** (Backend) and **Next.js 16** (Frontend), developed for **Accelist Exam 2 — 2026**.

---

## 📚 Documentation Portal

Choose which component you want to set up:

### 🔵 **Backend Setup**

**ASP.NET 10 API Service** — Book, retrieve, edit, and revoke tickets via RESTful APIs.

👉 **[Read Backend Setup Guide](./Backend_Guide.md)**

**Includes:**

- Installation & prerequisites
- Database migration guide
- Running the API server
- All 5 API endpoints
- Testing instructions

---

### 🟢 **Frontend Setup**

**Next.js 16 React App** — Product-first ticketing UI with shopping cart, booking management, and animations.

👉 **[Read Frontend Setup Guide](./Frontend_Guide.md)**

**Includes:**

- Installation & prerequisites
- Development server setup
- Project structure & components
- UI features (Aurora, animations, cart)
- Build & deployment

---

## 🚀 Quick Start (Full Stack)

### Prerequisites

- **.NET 10** SDK ([Download](https://dotnet.microsoft.com/download))
- **Node.js** ≥ 18 & **npm** ≥ 9 ([Download](https://nodejs.org))
- **SQL Server** or compatible database

### Step 1: Start the Backend

```bash
cd Accelist-Acceloka-Ticketing-Api-Service
dotnet run --launch-profile "http"
```

The API will start at `http://localhost:5176`

### Step 2: Start the Frontend

```bash
cd Accelist-Acceloka-Ticketing-Api-Service/acceloka-ui
npm install
npm run dev
```

The UI will start at `http://localhost:3000`

---

## 🏗️ Project Structure

```
exam_ui/
├── README.md (YOU ARE HERE)                        📖 Main entry point
├── Backend_Guide.md                                👈 Backend setup guide
├── Frontend_Guide.md                               👈 Frontend setup guide
│
├── Accelist-Acceloka-Ticketing-Api-Service/       [Backend Source]
│   ├── Program.cs
│   ├── Accelist-Acceloka-Ticketing-Api-Service.csproj
│   ├── Controllers/
│   ├── Application/
│   │   ├── Commands/
│   │   ├── Queries/
│   │   ├── DTOs/
│   │   └── Validators/
│   ├── Domain/
│   ├── Infrastructure/
│   └── acceloka-ui/                                [Frontend Source]
│       ├── package.json
│       ├── next.config.ts
│       ├── src/
│       │   ├── app/
│       │   ├── components/
│       │   ├── context/
│       │   └── lib/
│       └── public/
│
└── exam_ui.sln                                     [Solution file]
```

---

## 📌 Key Features

| Feature               | Backend                                    | Frontend                    |
| --------------------- | ------------------------------------------ | --------------------------- |
| **Available Tickets** | ✅ GET with filters                        | ✅ ProductSection           |
| **Search & Filter**   | ✅ Query params                            | ✅ SearchForm + URL sync    |
| **Book Tickets**      | ✅ POST /book-ticket                       | ✅ CartDrawer + checkout    |
| **Get Booking**       | ✅ GET /get-booked-ticket/{id}             | ✅ BookingsPanel search     |
| **Edit Quantity**     | ✅ PUT /edit-booked-ticket/{id}            | ✅ Inline editor            |
| **Revoke Tickets**    | ✅ DELETE /revoke-ticket/{id}/{code}/{qty} | ✅ Revoke with confirmation |
| **Error Handling**    | ✅ RFC 7807                                | ✅ problem.detail display   |

---

## 🧪 Testing the Full Flow

1. **Access Homepage**: [http://localhost:3000](http://localhost:3000)
2. **Browse Tickets**: Filter by category, date, and price
3. **Add to Cart**: Click "Add to Cart" on any ticket
4. **Checkout**: Open cart drawer and checkout all items at once
5. **Verify Booking**: Go to "My Booking" and search by Booking Reference ID
6. **Edit Quantity**: Increase/decrease items from the booking panel
7. **Revoke**: Remove items or entire booking
8. **Error Handling**: Try invalid inputs to see RFC 7807 error messages

---

## 📖 Exam Compliance

Both components are built to strictly satisfy **Accelist Exam 2 — 2026** requirements:

- ✅ All 5 API operations fully functional
- ✅ `EventDate` treated as opaque string (`dd-MM-yyyy HH:mm`)
- ✅ RFC 7807 error handling throughout
- ✅ Complex UI with animations & modern design
- ✅ No secrets or build artifacts in repo
- ✅ Clean, maintainable, well-documented code

---

## 🔗 API Endpoints

All endpoints run on `http://localhost:5176/api/v1/`

| Method   | Endpoint                           | Description                            |
| -------- | ---------------------------------- | -------------------------------------- |
| `GET`    | `/get-available-ticket`            | List tickets with pagination & filters |
| `POST`   | `/book-ticket`                     | Book one or more tickets               |
| `GET`    | `/get-booked-ticket/{id}`          | Get booking details by ID              |
| `PUT`    | `/edit-booked-ticket/{id}`         | Update quantity of booked ticket       |
| `DELETE` | `/revoke-ticket/{id}/{code}/{qty}` | Revoke ticket quantity                 |
| `GET`    | `/list-booked-ticket-ids`          | List all booking reference IDs         |

---

## 📞 Quick Links

- 📖 **Backend Setup**: [Backend_Guide.md](./Backend_Guide.md) — MARVEL Pattern, RFC 7807, Exam 1 2026
- 🎨 **Frontend Setup**: [Frontend_Guide.md](./Frontend_Guide.md) — Next.js 16, Animations, Exam 2 2026
- 📂 **Backend Source**: [Accelist-Acceloka-Ticketing-Api-Service/](./Accelist-Acceloka-Ticketing-Api-Service/)
- 📂 **Frontend Source**: [Accelist-Acceloka-Ticketing-Api-Service/acceloka-ui/](./Accelist-Acceloka-Ticketing-Api-Service/acceloka-ui/)

---

## 📄 License

Developed for **Accelist Exam 1 & 2 — 2026** as part of the internship competency examination.

---
