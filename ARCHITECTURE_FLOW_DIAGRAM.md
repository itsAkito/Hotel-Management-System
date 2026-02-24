# Architecture & Flow Diagram

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER BROWSER                             │
└─────────────────────────────────────────────────────────────────┘
                              │
                    ┌─────────▼──────────┐
                    │   /login           │
                    │  (Role Selection)  │
                    └─────────┬──────────┘
                              │
                   ┌──────────┴──────────┐
                   │                     │
        ┌──────────▼──────────┐ ┌──────────▼──────────┐
        │  Admin Sign-in       │ │  User Sign-in      │
        │  /sign-in?role=admin │ │  /sign-in?role=user│
        └──────────┬──────────┘ └──────────┬──────────┘
                   │                       │
                   │ (Clerk Auth)          │
                   │                       │
        ┌──────────▼──────────┐ ┌──────────▼──────────┐
        │ /api/user-register   │ │ /api/user-register  │
        │ (role: admin)        │ │ (role: user)        │
        └──────────┬──────────┘ └──────────┬──────────┘
                   │                       │
                   │ (Database Insert)     │
                   │                       │
        ┌──────────▼────────────────────────▼──────────┐
        │        PostgreSQL Database                    │
        │  ┌──────────────────────────────────────┐   │
        │  │ User Table (id, email, role, ...)    │   │
        │  │ Hotel Table (id, title, location...) │   │
        │  │ Booking Table (id, status, ...)      │   │
        │  │ Room Table (id, title, hotelId, ...) │   │
        │  └──────────────────────────────────────┘   │
        └────────────────┬──────────────────────────────┘
                         │
        ┌────────────────▼──────────────────────┐
        │      Next.js Server                    │
        │                                        │
        │ Middleware (Route Protection)          │
        │   - Check auth                         │
        │   - Verify role                        │
        │   - Redirect unauthorized users        │
        └────────────┬───────────────────────────┘
                     │
        ┌────────────▼──────────────────────┐
        │    Navbar Component                │
        │  (Role-based rendering)            │
        │                                    │
        │  Admin sees: My Hotels, Dashboard │
        │  User sees: Search, My Bookings   │
        └────────────┬──────────────────────┘
                     │
        ┌────────────┴──────────────────────┐
        │                                    │
    ┌───▼────────────┐           ┌──────────▼────────┐
    │  ADMIN ROUTES  │           │   USER ROUTES     │
    │                │           │                   │
    │ /my-hotels     │           │ /search           │
    │ /admin-hotels  │           │ /book-stay        │
    │ /management-   │           │ /my-bookings      │
    │   dashboard    │           │                   │
    │ /addhotel      │           │ (API calls)       │
    │ /reservation-  │           │ - Get hotels      │
    │   management   │           │ - Create booking  │
    │                │           │ - Get my bookings │
    │ (Features)     │           │                   │
    │ - Search       │           │ (Limited Access)  │
    │ - Filter       │           │                   │
    │ - Export       │           └───────────────────┘
    │ - Manage       │
    │ - Statistics   │
    └────────────────┘
```

## Data Flow - User Sign Up

```
User clicks "Login as User"
        ▼
Route: /login → /sign-up?role=user
        ▼
User enters email and password
        ▼
Clerk validates credentials
        ▼
User object created in Clerk
        ▼
useUser() hook triggers
        ▼
User.id and email extracted
        ▼
POST /api/user-register {
  userId: string,
  email: string,
  role: "user"
}
        ▼
Database Insert: User { id, email, role: "user" }
        ▼
User redirected to home page
        ▼
Navbar checks role via /api/user-role
        ▼
Shows User-specific navigation
```

## Data Flow - Admin Login

```
User clicks "Login as Admin"
        ▼
Route: /login → /sign-in?role=admin
        ▼
Admin enters credentials
        ▼
Clerk validates and creates user
        ▼
Navbar fetches role from /api/user-role
        ▼
Role = "admin"
        ▼
Navbar displays Admin buttons:
- My Hotels
- Dashboard dropdown
- Analytics link
        ▼
Admin clicks "Dashboard"
        ▼
Route: /management-dashboard
        ▼
Component mounts, fetches:
- GET /api/myhotels
- GET /api/hotel-bookings?hotelId=X
        ▼
Display with search & filters
        ▼
Real-time statistics calculated
```

## Component Hierarchy

```
RootLayout
├── ClerkProvider
├── ThemeProvider
├── Main
│   ├── Navbar (Role-aware)
│   │   ├── Logo
│   │   ├── Nav Links (role-dependent)
│   │   └── Auth Buttons
│   │       ├── SignIn/SignUp (not signed in)
│   │       ├── Dashboard + SignOut (admin)
│   │       └── Book Now + Dashboard + SignOut (user)
│   │
│   ├── Pages (Route-dependent)
│   │   ├── Public Routes
│   │   │   ├── / (Home)
│   │   │   ├── /search
│   │   │   └── /hotel/[id]
│   │   │
│   │   ├── User Routes (Protected)
│   │   │   ├── /book-stay
│   │   │   ├── /my-bookings
│   │   │   └── /booking-confirmation
│   │   │
│   │   └── Admin Routes (Protected)
│   │       ├── /admin-hotels
│   │       ├── /my-hotels
│   │       ├── /management-dashboard
│   │       ├── /addhotel
│   │       └── /reservation-management
│   │
│   └── Footer
```

## Database Schema

```
┌─────────────────────────┐
│ User                    │
├─────────────────────────┤
│ id (PK, Clerk ID)       │
│ email (UNIQUE)          │
│ role (user | admin)     │
│ createdAt               │
│ updatedAt               │
└─────────────────────────┘

┌─────────────────────────────┐      ┌──────────────────────┐
│ Hotel                       │◄─────│ Room                 │
├─────────────────────────────┤      ├──────────────────────┤
│ id (PK)                     │      │ id (PK)              │
│ userId (FK to User)         │      │ hotelId (FK)         │
│ title                       │      │ title                │
│ description                 │      │ roomPrice            │
│ image                       │      │ available            │
│ city                        │      │ createdAt            │
│ state                       │      │ updatedAt            │
│ country                     │      └──────────────────────┘
│ locationDescription         │
│ gym, spa, bar, ...amenities │
│ createdAt                   │
│ updatedAt                   │
└──────────┬──────────────────┘
           │
           ├─────────────────────────┐
           │                         │
    ┌──────▼──────────────┐  ┌──────▼──────────────┐
    │ Booking             │  │ GuestProfile        │
    ├─────────────────────┤  ├─────────────────────┤
    │ id (PK)             │  │ id (PK)             │
    │ hotelId (FK)        │  │ bookingId (FK, UNIQ)│
    │ roomId (FK)         │  │ guestFirstName      │
    │ userId              │  │ guestLastName       │
    │ checkIn             │  │ guestEmail          │
    │ checkOut            │  │ guestPhone          │
    │ totalPrice          │  │ guestAddress        │
    │ paymentStatus       │  │ createdAt           │
    │ status              │  └─────────────────────┘
    │ createdAt           │
    │ updatedAt           │  ┌──────────────────────┐
    └─────────────────────┤  │ CheckInCheckOut      │
                          │  ├──────────────────────┤
                          │  │ id (PK)              │
                          ├─►│ bookingId (FK, UNIQ) │
                          │  │ checkInTime          │
                          │  │ checkOutTime         │
                          │  │ keyIssued            │
                          │  │ createdAt            │
                          │  └──────────────────────┘
```

## API Flow - Admin Dashboard

```
User visits /management-dashboard
        ▼
Component checks auth: useAuth()
        ▼
Fetches user role: GET /api/user-role
        ▼
If role !== "admin": redirect to /
        ▼
GET /api/myhotels
        ▼
Display hotel selection cards
        ▼
User selects hotel
        ▼
GET /api/hotel-bookings?hotelId=123
        ▼
Display bookings list
        ▼
User applies filters/search
        ▼
Frontend filtering & sorting
        ▼
Real-time statistics calculation
        ▼
User exports data
        ▼
Convert to CSV format
        ▼
Download file
```

## Role-Based Rendering Logic

```
Component Mounts
        ▼
Check isSignedIn (useAuth)
        ▼
If not signed in:
    Show: Sign In / Sign Up buttons
        ▼
If signed in:
    Fetch user role: GET /api/user-role
        ▼
    ┌─────────────────────────────────────┐
    │ If role === "admin"                 │
    ├─────────────────────────────────────┤
    │ ✅ Show: My Hotels button           │
    │ ✅ Show: Bookings link              │
    │ ✅ Show: Analytics link             │
    │ ✅ Allow access: /my-hotels         │
    │ ✅ Allow access: /management-dash   │
    │ ✅ Show: Dashboard dropdown         │
    └─────────────────────────────────────┘
            │
            ├─────────────────────────────────────┐
            │ If role === "user"                  │
            ├─────────────────────────────────────┤
            │ ✅ Show: Destinations               │
            │ ✅ Show: My Bookings                │
            │ ✅ Show: Book Now button            │
            │ ✅ Allow access: /search            │
            │ ✅ Allow access: /my-bookings       │
            │ ❌ Block access: /my-hotels         │
            │ ❌ Block access: /management-dash   │
            │ ❌ Hide Admin features              │
            └─────────────────────────────────────┘
```

## Search & Filter Engine

```
User inputs search query
        ▼
applyFilters(hotelList) function runs
        ▼
┌─────────────────────────────────────────┐
│ Step 1: Search Filter                   │
│ Match: name | email | description | id  │
│ Method: toLowerCase().includes()        │
└────────────┬────────────────────────────┘
             ▼
┌─────────────────────────────────────────┐
│ Step 2: Date Range Filter               │
│ If fromDate set: checkIn >= fromDate    │
│ If toDate set: checkOut <= toDate       │
└────────────┬────────────────────────────┘
             ▼
┌─────────────────────────────────────────┐
│ Step 3: Price Range Filter              │
│ Filter: totalPrice >= min && <= max     │
└────────────┬────────────────────────────┘
             ▼
┌─────────────────────────────────────────┐
│ Step 4: Payment Status Filter           │
│ If "paid": paymentStatus === true       │
│ If "pending": paymentStatus === false   │
└────────────┬────────────────────────────┘
             ▼
┌─────────────────────────────────────────┐
│ Step 5: Sort                            │
│ - By Date (latest first)                │
│ - By Price (high to low)                │
│ - By Name (alphabetical)                │
└────────────┬────────────────────────────┘
             ▼
setFilteredBookings(result)
        ▼
Re-render with filtered data
```

## Security Flow

```
User makes API request
        ▼
Middleware intercepts
        ▼
Check if user signed in with Clerk
        ▼
If not: Redirect to /login
        ▼
If yes: Get userId from JWT
        ▼
For protected routes:
    Query database for user role
        ▼
    If role matches route requirements:
        ✅ Allow access
        ▼
    Else:
        ❌ Redirect to fallback page
```

## Status Updates

```
Booking Status Flow:
pending → confirmed → checked-in → checked-out (completed)

Color Indicators:
- pending: 🟨 Yellow
- confirmed/checked-in: 🟩 Green
- completed/checked-out: 🟦 Blue
- cancelled: 🟥 Red

Payment Status:
- Unpaid: ⏳ Pending
- Paid: ✅ Paid
```

## Error Handling

```
User Action
        ▼
Try {
    API Call
        ▼
    Success: Update state
        ▼
    Error: Log to console
} Catch {
    Show alert/toast
    Retry option
}
        ▼
Display feedback to user
```

---

**Last Updated**: January 13, 2026  
**Diagram Version**: 1.0 
**Architecture Type**: Client-Server with Role-Based Access Control
