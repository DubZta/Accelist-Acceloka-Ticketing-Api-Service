# Acceloka Ticketing API Service

A backend API service for online ticket booking operations built with ASP.NET 10, following the **MARVEL Pattern** architecture as required by **Accelist Exam 1 - 2026**.

## Exam Requirements Compliance

This project implements **ALL** requirements from Exam 1 2026:

| Requirement | Status | Implementation |
|-------------|--------|----------------|
| **MARVEL Pattern** | ✅ | MediatR + FluentValidation |
| **RFC 7807 Error Handling** | ✅ | ProblemDetailsException middleware |
| **HTTP Response Codes** | ✅ | Correct status codes (200, 201, 400, 404) |
| **Serilog File Sink** | ✅ | Log level: Information, File: `Log-{YYYYMMDD}.txt`, Folder: `/logs` |
| **Async/Await** | ✅ | All database operations are async |
| **C# Coding Conventions** | ✅ | PascalCase, camelCase, braces, LINQ method syntax |
| **Accelist Coding Conventions** | ✅ | Braces for all control structures, LINQ method syntax |

### Bonus Points Implemented
- **Pagination** on GET available tickets (10 items per page)
- **Transaction Support** for booking tickets (all-or-nothing)

---

## Architecture

This project follows the **MARVEL Pattern** with the following structure:
```
Accelist-Acceloka-Ticketing-Api-Service/
├── Application/              # MediatR handlers, DTOs, Validators
│   ├── Commands/            # Command handlers
│   ├── Queries/             # Query handlers
│   ├── DTOs/                # Data Transfer Objects
│   └── Validators/          # FluentValidation validators
├── Common/                  # Shared utilities
│   ├── Exceptions/          # ProblemDetailsException
│   └── Middleware/          # ProblemDetailsMiddleware
├── Controllers/             # API endpoints
├── Domain/                  # Domain entities
│   ├── Ticket.cs
│   └── BookedTicket.cs
├── Infrastructure/          # Data access layer
│   └── Data/
│       ├── DbContext/       # AccelokaDbContext
│       └── Repositories/    # Repository implementations
├── Migrations/              # EF Core migrations
├── logs/                    # Runtime log files (excluded from git)
├── appsettings.json         # Configuration
└── Program.cs              # Application entry point
```

## Technologies

| Technology | Purpose | Version |
|------------|---------|---------|
| **.NET 10.0** | Runtime framework | 10.0 |
| **ASP.NET Core Web API** | Web framework | 10.0 |
| **Entity Framework Core** | ORM | 10.0 |
| **MediatR** | CQRS pattern | Latest |
| **FluentValidation** | Validation | Latest |
| **Serilog** | Logging | Latest |
| **SQL Server LocalDB** | Database | 2022 |

---

## Prerequisites

- **.NET 10 SDK**
- **Visual Studio 2022**
- **SQL Server LocalDB** (comes with Visual Studio 2022) or **SQL Server Express**
- **Git**
- **Postman**

---

## Step-by-Step Setup Guide

### Step 1: Clone the Repository and Navigate to project directory

```bash
git clone https://github.com/DubZta/Accelist-Acceloka-Ticketing-Api-Service
cd Accelist-Acceloka-Ticketing-Api-Service
```
---

### Step 2: Verify Project Structure

```bash
dir
```

**Expected Output:**
```
Migrations/
appsettings.json
Program.cs
Accelist-Acceloka-Ticketing-Api-Service.csproj
...
```
---

### Step 3: Restore NuGet Packages

```bash
dotnet restore
```

---

### Step 4: Update Database Connection (if needed)

Edit `appsettings.json` and verify the connection string:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=AccelokaDb;Trusted_Connection=True;MultipleActiveResultSets=true"
  }
}
```

**Alternative:** If using SQL Server Express:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost\\SQLEXPRESS;Database=AccelokaDb;Trusted_Connection=True;MultipleActiveResultSets=true"
  }
}
```
---

### Step 5: Create Database

#### **Step 5.1: Apply EF Core Migrations**

```bash
dotnet ef database update
```

**Expected Output:**
```
Build started...
Build succeeded.
Applying migration '20260211093927_InitialCreate'.
Done.
```

**This creates:**
- Database: `AccelokaDb`
- Tables: `tiket`, `Bookedtiket`

#### **Step 5.2: Verify Database in SQL Server Object Explorer**

**In Visual Studio:**
```
View → SQL Server Object Explorer
```

**Navigate to:**
```
SQL Server
 └── (localdb)\MSSQLLocalDB
     └── Databases
         └── AccelokaDb
            └── Tables
                ├── dbo.tiket
                └── dbo.Bookedtiket
```

**Success confirmed** when both tables are visible.

#### **Step 5.3: Insert Initial Data**

**Right-click on `AccelokaDb` → New Query**

**Paste and execute the SQL insert script:**
```sql
-- Insert 150 sample tickets into tiket table
-- (Paste content from InsertDataStuffs.sql here)
```

**Expected Output:**
```
(150 rows affected)
Query executed successfully.
```

---

### Step 6: Build the Project

```bash
dotnet build
```

**Expected Output:**
```
Build succeeded.
    0 Warning(s)
    0 Error(s)
```
---
### Step 7: Run the Application

```bash
dotnet run
```

**Expected Output:**
```
================================================================
               Acceloka API is running successfully              
Test Endpoint: http://localhost:5176/api/v1/get-available-ticket
================================================================
info: Microsoft.Hosting.Lifetime[14]
      Now listening on: http://localhost:5176
info: Microsoft.Hosting.Lifetime[0]
      Application started. Press Ctrl+C to shut down.
```
---
### Step 8: Verify API is Running

Open a new terminal and test the API:

```bash
curl http://localhost:5176/api/v1/get-available-ticket
```

**Expected:** Returns JSON array of available tickets

---

## API Endpoints Documentation

### 1️⃣ GET Available Tickets

**Endpoint:** `GET /api/v1/get-available-ticket`

**Query Parameters:**
| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `namaKategori` | string | Filter by category name | `Bioskop` |
| `kodeTiket` | string | Filter by ticket code | `B001` |
| `namaTiket` | string | Filter by ticket name | `Avengers` |
| `harga` | decimal | Filter by price (≤) | `100000` |
| `tanggalEventMinimal` | datetime | Event date ≥ | `2026-02-15` |
| `tanggalEventMaksimal` | datetime | Event date ≤ | `2026-03-01` |
| `orderBy` | string | Sort column | `price`, `eventDate`, `quota` |
| `orderState` | string | Sort direction | `asc`, `desc` |
| `page` | int | Page number | `1` |
| `pageSize` | int | Items per page | `10` |

---
### 2️⃣ POST Book Ticket

**Endpoint:** `POST /api/v1/book-ticket`

**Request Body:**
```json
{
  "tickets": [
    {
      "kodeTiket": "B001",
      "quantity": 2
    },
    {
      "kodeTiket": "TK001",
      "quantity": 3
    }
  ]
}
```

**Response (201 Created):**
```json
{
  "tickets": [
    {
      "ticketCode": "B001",
      "ticketName": "Avengers: Endgame (Reguler)",
      "price": 50000.00
    },
    {
      "ticketCode": "TK001",
      "ticketName": "Bruno Mars: 24K Magic Tour (CAT 1)",
      "price": 2500000.00
    }
  ],
  "ticketsPerCategories": [
    {
      "categoryName": "Bioskop",
      "summaryPrice": 100000.00,
      "tickets": [
        {
          "ticketCode": "B001",
          "ticketName": "Avengers: Endgame (Reguler)",
          "price": 50000.00
        }
      ]
    },
    {
      "categoryName": "Tiket Konser",
      "summaryPrice": 7500000.00,
      "tickets": [
        {
          "ticketCode": "TK001",
          "ticketName": "Bruno Mars: 24K Magic Tour (CAT 1)",
          "price": 2500000.00
        }
      ]
    }
  ],
  "priceSummary": 7600000.00,
  "totalTickets": 5
}
```

**Validations:**
- ❌ 400 Bad Request: Kode tiket tidak terdaftar
- ❌ 400 Bad Request: Quota tiket sudah habis
- ❌ 400 Bad Request: Quantity melebihi quota
- ❌ 400 Bad Request: Tanggal event ≤ tanggal booking

---

### 3️⃣ GET Booked Ticket Details

**Endpoint:** `GET /api/v1/get-booked-ticket/{bookedTicketId}`

**Response (200 OK):**
```json
{
  "priceSummary": 7600000.00,
  "ticketsPerCategories": [
    {
      "quantityPerCategory": 2,
      "categoryName": "Bioskop",
      "summaryPrice": 100000.00,
      "tickets": [
        {
          "ticketCode": "B001",
          "ticketName": "Avengers: Endgame (Reguler)",
          "eventDate": "15-02-2026 13:00",
          "quantity": 2,
          "price": 50000.00
        }
      ]
    },
    {
      "quantityPerCategory": 3,
      "categoryName": "Tiket Konser",
      "summaryPrice": 7500000.00,
      "tickets": [
        {
          "ticketCode": "TK001",
          "ticketName": "Bruno Mars: 24K Magic Tour (CAT 1)",
          "eventDate": "16-02-2026 19:00",
          "quantity": 3,
          "price": 2500000.00
        }
      ]
    }
  ]
}
```

**Validations:**
- ❌ 404 Not Found: BookedTicketId tidak terdaftar

---

### 4️⃣ PUT Edit Booked Ticket

**Endpoint:** `PUT /api/v1/edit-booked-ticket/{bookedTicketId}`

**Request Body:**
```json
{
  "tickets": [
    {
      "ticketCode": "B001",
      "newQuantity": 5
    }
  ]
}
```

**Response (200 OK):**
```json
[
  {
    "ticketCode": "B001",
    "ticketName": "Avengers: Endgame (Reguler)",
    "categoryName": "Bioskop",
    "quantityLeft": 5
  }
]
```

**Validations:**
- ❌ 404 Not Found: BookedTicketId tidak terdaftar
- ❌ 404 Not Found: Kode tiket tidak terdaftar di booking
- ❌ 400 Bad Request: Quantity > sisa quota
- ❌ 400 Bad Request: Quantity < 1

---

### 5️⃣ DELETE Revoke Ticket

**Endpoint:** `DELETE /api/v1/revoke-ticket/{bookedTicketId}/{kodeTicket}/{qty}`

**Response (200 OK):**
```json
[
  {
    "ticketCode": "B001",
    "ticketName": "Avengers: Endgame (Reguler)",
    "categoryName": "Bioskop",
    "quantityLeft": 3
  }
]
```

**Validations:**
- ❌ 404 Not Found: BookedTicketId tidak terdaftar
- ❌ 404 Not Found: Kode tiket tidak terdaftar
- ❌ 400 Bad Request: Qty > jumlah tiket yang di-book
- ❌ 400 Bad Request: Qty ≤ 0

---

## Database Schema

### `tiket` Table
| Column | Type | Description |
|--------|------|-------------|
| `KodeTiket` | string (PK) | Ticket code (e.g., B001, TK001) |
| `NamaTiket` | string | Ticket name |
| `Kategori` | string | Category (Bioskop, Tiket Konser, etc.) |
| `Harga` | decimal | Price |
| `Quota` | int | Available quantity |
| `EventDate` | datetime | Event date and time |

### `Bookedtiket` Table
| Column | Type | Description |
|--------|------|-------------|
| `BookedTicketId` | string (PK) | Booking ID (GUID) |
| `KodeTiket` | string (PK, FK) | Ticket code |
| `Qty` | int | Quantity booked |
| `BookingDate` | datetime | Booking timestamp |

---

## Logging Configuration

### Serilog Setup
- **Log Level:** Information
- **File Name:** `Log-{YYYYMMDD}.txt` (e.g., `Log-20260212.txt`)
- **Location:** `/logs` folder (created automatically at runtime)
- **Format:** `{Timestamp} [{Level}] {Message}`

### Example Log Entry
```
2026-02-12 15:09:13.379 +07:00 [INF] Now listening on: http://localhost:5176
2026-02-12 15:09:13.397 +07:00 [INF] Application started. Press Ctrl+C to shut down.
2026-02-12 15:10:25.123 +07:00 [INF] HTTP GET /api/v1/get-available-ticket responded 200 in 45.678 ms
```

---

## Error Handling (RFC 7807)

All errors follow the **RFC 7807** standard format:

```json
{
  "type": "https://tools.ietf.org/html/rfc9110#section-15.5.1",
  "title": "Bad Request",
  "status": 400,
  "detail": "Quantity harus lebih besar dari 0",
  "instance": "/api/v1/book-ticket"
}
```

### Common Error Scenarios
| HTTP Status | Scenario | Example Detail |
|-------------|----------|----------------|
| **400 Bad Request** | Invalid input | "Quantity harus lebih besar dari 0" |
| **404 Not Found** | Resource not found | "Booking dengan ID XYZ tidak ditemukan" |
| **500 Internal Server Error** | Unexpected error | "An unexpected error occurred" |
---

## Coding Conventions

### C# Conventions
- **PascalCase**: Class names, properties, methods
  ```csharp
  public class BookTicketCommandHandler { }
  public string TicketCode { get; set; }
  public async Task Handle() { }
  ```

- **camelCase**: Local variables, parameters
  ```csharp
  var bookedTicketId = Guid.NewGuid().ToString();
  public async Task Handle(BookTicketCommand request) { }
  ```

- **Braces**: Always use `{}` for control structures
  ```csharp
  if (condition)
  {
      // Code here
  }
  ```

- **LINQ**: Method syntax (lambda expressions)
  ```csharp
  var result = tickets.Where(t => t.Quota > 0)
                      .OrderBy(t => t.Price)
                      .ToList();
  ```

### Async/Await
- All database operations use `async/await`
  ```csharp
  var ticket = await _repository.GetTicketAsync(id);
  ```
---

## License
This project is developed for **Accelist Exam 1 - 2026** as part of the internship competency examination.
