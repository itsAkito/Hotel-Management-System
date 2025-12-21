# 🏨 Hotel Management System - Complete Documentation

A full-featured hotel management and booking system built with **Next.js 16**, **Prisma ORM**, **PostgreSQL (Neon)**, **Clerk Authentication**, and **Stripe Payments**.

---

## 📋 Table of Contents

1. [Quick Start](#quick-start)
2. [System Architecture](#system-architecture)
3. [Features Overview](#features-overview)
4. [Installation & Setup](#installation--setup)
5. [Project Structure](#project-structure)
6. [API Routes Documentation](#api-routes-documentation)
7. [Database Schema](#database-schema)
8. [Authentication (Clerk)](#authentication-clerk)
9. [Payment Integration (Stripe)](#payment-integration-stripe)
10. [Components Guide](#components-guide)
11. [State Management](#state-management)
12. [Environment Configuration](#environment-configuration)
13. [Error Resolution](#error-resolution)
14. [Troubleshooting](#troubleshooting)

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm/yarn
- PostgreSQL database (Neon recommended)
- Clerk account (https://clerk.com)
- Stripe account (https://stripe.com)

### Installation

```bash
# Navigate to project directory
cd my-next-app

# Install dependencies
npm install

# Setup environment variables (see Environment Configuration section)
# Create .env.local file with all required keys

# Run database migrations
npx prisma migrate dev

# Start development server
npm run dev
```

The application will be available at `http://localhost:3000`

### Build & Deploy

```bash
# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint

# Seed database with sample data
npm run seed
```

---

## 🏗️ System Architecture

### Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 16 (React 19) |
| **Backend** | Next.js API Routes |
| **Database** | PostgreSQL (Neon) + Prisma ORM |
| **Authentication** | Clerk |
| **Payments** | Stripe |
| **UI Components** | Shadcn UI + Tailwind CSS |
| **State Management** | Zustand |
| **Form Management** | React Hook Form + Zod validation |
| **File Storage** | UploadThing |
| **Themes** | Dark/Light mode support |

### Data Flow

```
User Browser
    ↓
Next.js Pages/Components
    ↓
API Routes
    ↓
Prisma Client
    ↓
PostgreSQL Database
```

---

## ✨ Features Overview

### 1. **Hotel Management**
- ✅ Create, read, update, delete hotels
- ✅ Multi-image uploads for hotels
- ✅ Amenity selection (12 different amenities)
- ✅ Location management (Country → State → City cascading)
- ✅ Hotel owner dashboard

### 2. **Room Management**
- ✅ Add rooms to hotels with custom configurations
- ✅ Room pricing and descriptions
- ✅ Bed types (King, Queen, Twin, Single)
- ✅ Room features (TV, WiFi, Balcony, etc.)
- ✅ Room availability tracking

### 3. **Booking System**
- ✅ Search hotels by location and date
- ✅ View room availability
- ✅ Create bookings with date overlap validation
- ✅ Breakfast inclusion option
- ✅ User booking history
- ✅ Hotel owner view of all bookings for their properties

### 4. **Payment Processing**
- ✅ Stripe payment integration
- ✅ Payment intent creation and management
- ✅ Webhook handling for payment events
- ✅ Refund processing
- ✅ Payment status tracking

### 5. **User Authentication**
- ✅ Sign up and sign in via Clerk
- ✅ Social login support
- ✅ Protected routes and API endpoints
- ✅ User context available throughout application

### 6. **UI/UX Features**
- ✅ Dark/Light theme support
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Amenity icons and filters
- ✅ Advanced date range picker with calendar
- ✅ Loading states and error handling
- ✅ Toast notifications for user feedback

---

## 📦 Installation & Setup

### Step 1: Clone & Install

```bash
git clone <your-repo-url>
cd my-next-app
npm install
```

### Step 2: Create `.env.local` File

```env
# DATABASE
DATABASE_URL="postgresql://user:password@host/database?schema=public"

# CLERK AUTHENTICATION
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_key_here
CLERK_SECRET_KEY=your_secret_here
CLERK_WEBHOOK_SECRET=your_webhook_secret_here

# STRIPE PAYMENTS
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx

# FILE UPLOADS (UploadThing)
UPLOADTHING_TOKEN=your_token_here

# APPLICATION
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Step 3: Database Setup

```bash
# Run migrations
npx prisma migrate dev

# (Optional) Seed database with sample data
npm run seed

# View data in Prisma Studio
npx prisma studio
```

### Step 4: Setup Clerk

1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Create a new application
3. Copy your API keys to `.env.local`
4. Configure sign-in/sign-up URLs:
   - Sign-in URL: `http://localhost:3000/sign-in`
   - Sign-up URL: `http://localhost:3000/sign-up`

### Step 5: Setup Stripe

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Get your API keys from Developers → API Keys
3. Copy keys to `.env.local`
4. Setup webhooks:
   - Go to Developers → Webhooks
   - Add endpoint: `https://yourdomain.com/api/webhooks/stripe`
   - Select events: `payment_intent.succeeded`, `payment_intent.payment_failed`, `charge.refunded`

### Step 6: Start Development

```bash
npm run dev
```

Visit `http://localhost:3000` in your browser.

---

## 📁 Project Structure

```
my-next-app/
├── app/                          # Next.js app directory
│   ├── api/                      # API routes
│   │   ├── addhotel/            # Hotel management endpoints
│   │   ├── bookings/            # Booking endpoints
│   │   ├── hotel-bookings/      # Hotel owner bookings view
│   │   ├── webhooks/            # Stripe webhooks
│   │   └── uploadthing/         # File upload handler
│   ├── (clerk)/                 # Clerk auth pages
│   │   ├── sign-in/
│   │   └── sign-up/
│   ├── hotel/                   # Hotel pages
│   │   └── [hotelId]/          # Hotel details page
│   ├── my-hotels/              # User's hotels management
│   ├── my-bookings/            # User's bookings history
│   ├── search/                 # Hotel search page
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Home page
│   └── globals.css             # Global styles
│
├── components/                  # React components
│   ├── hotel/                  # Hotel-specific components
│   │   ├── AddHotelForm.tsx
│   │   ├── BookingCard.tsx
│   │   ├── BookingPayment.tsx
│   │   ├── FeaturedHotels.tsx
│   │   ├── HotelFormSection.tsx
│   │   ├── MyBooking.tsx
│   │   ├── MyHotel.tsx
│   │   └── RoomManagement.tsx
│   ├── location/               # Location selector
│   │   └── LocationSelector.tsx
│   ├── layout/                 # Layout components
│   │   ├── Navbar.tsx
│   │   └── Navmenu.tsx
│   ├── ui/                     # Shadcn UI components
│   │   ├── alert-dialog.tsx
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── checkbox.tsx
│   │   ├── date-range-picker.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── form.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── popover.tsx
│   │   ├── select.tsx
│   │   ├── textarea.tsx
│   │   └── uploadthing.ts
│   ├── Container.tsx
│   ├── DateRangePickerTutorial.tsx
│   ├── FeaturedHotelsSection.tsx
│   ├── HotelImageUploader.tsx
│   ├── HotelToast.tsx
│   ├── SearchInput.tsx
│   ├── theme-provider.tsx
│   └── theme-toggle.tsx
│
├── lib/                        # Utility functions
│   ├── store.ts               # Zustand state management
│   ├── dateUtils.ts           # Date manipulation utilities
│   ├── prismadb.ts            # Prisma client instance
│   └── utils.ts               # General utilities
│
├── prisma/                     # Database schema & migrations
│   ├── schema.prisma          # Database schema
│   └── migrations/            # Migration history
│
├── public/                     # Static files
│   └── Image/                 # Hotel images
│
├── scripts/                    # Build scripts
│   ├── seed.js                # Database seeding
│   └── seed.ts                # TypeScript seed script
│
└── Configuration files
    ├── next.config.ts
    ├── tsconfig.json
    ├── tailwind.config.js
    ├── postcss.config.mjs
    ├── eslint.config.mjs
    ├── components.json        # Shadcn config
    └── package.json
```

---

## 🔌 API Routes Documentation

### Hotel Management Routes

#### Create/List Hotels
```
POST   /api/addhotel              - Create new hotel
GET    /api/addhotel              - Get all user's hotels
```

#### Hotel Details
```
GET    /api/addhotel/[hotelId]    - Get hotel details
PUT    /api/addhotel/[hotelId]    - Update hotel
DELETE /api/addhotel/[hotelId]    - Delete hotel
```

### Booking Routes

#### Create/List Bookings
```
POST   /api/bookings              - Create new booking
GET    /api/bookings              - Get user's bookings
```

#### Booking Details
```
GET    /api/bookings/[bookingId]  - Get booking details
PUT    /api/bookings/[bookingId]  - Update booking
DELETE /api/bookings/[bookingId]  - Cancel booking
```

#### Hotel Owner Bookings
```
GET    /api/hotel-bookings        - Get all bookings for owner's hotels
```

### Authentication

All API routes require Clerk authentication. Include the user context in request headers (automatically handled by Clerk middleware).

### API Request/Response Examples

**Create Hotel**
```bash
POST /api/addhotel
Content-Type: application/json

{
  "title": "Grand Hotel",
  "description": "Luxury 5-star hotel",
  "image": "https://example.com/image.jpg",
  "country": "USA",
  "state": "California",
  "city": "Los Angeles",
  "locationDescription": "Downtown LA",
  "gym": true,
  "spa": true,
  "bar": true,
  "laundry": true,
  "restaurant": true,
  "shopping": true,
  "freeParking": true,
  "bikeRental": true,
  "freeWifi": true,
  "movieNights": false,
  "swimmingPool": true,
  "coffeeShop": true
}
```

**Create Booking**
```bash
POST /api/bookings
Content-Type: application/json

{
  "userName": "John Doe",
  "roomId": 1,
  "hotelId": 1,
  "checkIn": "2025-12-15T14:00:00Z",
  "checkOut": "2025-12-20T10:00:00Z",
  "breakfastIncluded": true,
  "currency": "USD",
  "totalPrice": 2500,
  "paymentIntent": "pi_1234567890"
}
```

---

## 🗄️ Database Schema

### Hotel Table
```prisma
model Hotel {
  id              String   @id @default(cuid())
  userId          String   // Clerk user ID
  title           String
  description     String
  image           String?
  country         String
  state           String
  city            String
  locationDesc    String?
  gym             Boolean  @default(false)
  spa             Boolean  @default(false)
  bar             Boolean  @default(false)
  laundry         Boolean  @default(false)
  restaurant      Boolean  @default(false)
  shopping        Boolean  @default(false)
  freeParking     Boolean  @default(false)
  bikeRental      Boolean  @default(false)
  freeWifi        Boolean  @default(false)
  movieNights     Boolean  @default(false)
  swimmingPool    Boolean  @default(false)
  coffeeShop      Boolean  @default(false)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  rooms           Room[]
  bookings        Booking[]
}
```

### Room Table
```prisma
model Room {
  id              String   @id @default(cuid())
  hotelId         String
  title           String
  description     String
  bedType         String   // King, Queen, Twin, Single
  price           Int      // Price in cents
  image           String?
  tv              Boolean  @default(false)
  wifi            Boolean  @default(false)
  balcony         Boolean  @default(false)
  jacuzzi         Boolean  @default(false)
  coffeeShop      Boolean  @default(false)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  hotel           Hotel    @relation(fields: [hotelId], references: [id], onDelete: Cascade)
  bookings        Booking[]
}
```

### Booking Table
```prisma
model Booking {
  id              String   @id @default(cuid())
  userId          String   // Clerk user ID
  userName        String
  roomId          String
  hotelId         String
  hotelOwnerId    String   // Hotel owner's Clerk ID
  checkIn         DateTime
  checkOut        DateTime
  breakfastIncluded Boolean @default(false)
  currency        String
  totalPrice      Int      // Price in cents
  paymentStatus   Boolean  @default(false)
  paymentIntent   String?
  status          String   @default("pending")
  bookedAt        DateTime @default(now())
  updatedAt       DateTime @updatedAt
  hotel           Hotel    @relation(fields: [hotelId], references: [id], onDelete: Cascade)
  room            Room     @relation(fields: [roomId], references: [id], onDelete: Cascade)
}
```

---

## 🔐 Authentication (Clerk)

### Setup

1. Create account at [clerk.com](https://clerk.com)
2. Create a new application
3. Get API keys and add to `.env.local`:
   ```env
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_key
   CLERK_SECRET_KEY=your_secret
   ```

### Configuration

The app includes Clerk middleware that:
- Protects API routes
- Protects specific page routes
- Allows public access to `/`, `/sign-in`, `/sign-up`

### Usage in Components

```typescript
import { useAuth, useUser } from "@clerk/nextjs";

export function MyComponent() {
  const { userId, isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  
  if (!isLoaded) return <div>Loading...</div>;
  if (!isSignedIn) return <div>Not signed in</div>;
  
  return (
    <div>
      Welcome, {user?.firstName}!
      <p>User ID: {userId}</p>
    </div>
  );
}
```

### Usage in API Routes

```typescript
import { auth } from "@clerk/nextjs/server";

export async function POST(request: Request) {
  const { userId } = await auth();
  
  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }
  
  // Your logic here
}
```

---

## 💳 Payment Integration (Stripe)

### Setup Steps

#### 1. Get Stripe Keys

1. Go to [stripe.com/dashboard](https://dashboard.stripe.com)
2. Navigate to **Developers → API Keys**
3. Copy:
   - **Publishable Key** (starts with `pk_`)
   - **Secret Key** (starts with `sk_`)

#### 2. Setup Webhooks

1. Go to **Developers → Webhooks**
2. Click **Add endpoint**
3. URL: `https://yourdomain.com/api/webhooks/stripe`
4. Select events:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `charge.refunded`
5. Copy **Signing Secret** (starts with `whsec_`)

#### 3. Configure Environment Variables

```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
```

#### 4. Local Testing with Stripe CLI

```bash
# Install Stripe CLI
# https://stripe.com/docs/stripe-cli

# Login to Stripe
stripe login

# Forward webhooks to local endpoint
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Trigger test events
stripe trigger payment_intent.succeeded
```

### Payment Flow

1. User selects booking dates and room
2. Frontend creates Stripe payment element
3. User enters payment information
4. Frontend calls `POST /api/bookings` with payment intent
5. Backend verifies payment with Stripe
6. Booking is created if payment succeeds
7. Webhook handler updates payment status

### Available Payment Methods

- Credit/Debit Cards (Visa, Mastercard, American Express)
- Digital Wallets (Apple Pay, Google Pay)
- Bank Transfers (ACH, SEPA)

---

## 🧩 Components Guide

### Hotel Components

#### AddHotelForm.tsx
Creates a form for adding/editing hotels with validation.

#### RoomManagement.tsx
Manages rooms within a hotel - add, edit, delete rooms.

**Features:**
- Room form with validation
- Room card display
- Bed type selection
- Room features checkboxes

#### BookingCard.tsx
Displays a single booking with details and actions.

#### BookingPayment.tsx
Handles Stripe payment integration for bookings.

### Location Component

#### LocationSelector.tsx
Cascading location selector (Country → State → City).

**Available Locations:**
- USA (50 states)
- UK (England, Scotland, Wales, Northern Ireland)
- Canada (10 provinces, 3 territories)
- Australia (8 states/territories)

### UI Components

All components from Shadcn UI:
- Button, Card, Checkbox, Select, Input, Textarea
- DateRangePicker, Popover, DropdownMenu, AlertDialog

---

## 🎯 State Management (Zustand)

### Store Location: `lib/store.ts`

#### Search Store
```typescript
const { 
  filters,           // Current filters
  setSearchQuery,    // Update search query
  setLocation,       // Update location
  setDateRange,      // Update date range
  setGuests,         // Update guest count
  setRooms,          // Update room count
  clearFilters       // Reset all filters
} = useSearchStore();
```

#### Bookings Store
```typescript
const {
  bookings,          // Array of user's bookings
  setBookings,       // Set all bookings
  addBooking,        // Add new booking
  removeBooking,     // Remove booking
  updateBooking      // Update existing booking
} = useBookingStore();
```

#### Hotels Store
```typescript
const {
  hotels,            // Array of user's hotels
  setHotels,         // Set all hotels
  addHotel,          // Add new hotel
  removeHotel,       // Remove hotel
  updateHotel        // Update existing hotel
} = useHotelStore();
```

---

## 🔧 Environment Configuration

Create a `.env.local` file in the project root with all required keys:

```env
# DATABASE CONNECTION (Neon PostgreSQL)
DATABASE_URL="postgresql://user:password@host/database?schema=public"

# CLERK AUTHENTICATION
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
CLERK_SECRET_KEY=sk_test_xxxxx
CLERK_WEBHOOK_SECRET=whsec_xxxxx

# STRIPE PAYMENT
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx

# FILE UPLOADS (UploadThing)
UPLOADTHING_TOKEN=zt_xxxxx

# APPLICATION SETTINGS
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

---

## ⚠️ Error Resolution

### "Lock file error at .next/dev/lock"

**Cause:** Another instance of `next dev` is already running

**Solution:**
```bash
# Kill all Node processes (Windows PowerShell)
Get-Process node | Stop-Process -Force

# Or kill specific process
taskkill /F /IM node.exe

# Delete lock file manually
Remove-Item ".\.next\dev\lock" -Force

# Restart dev server
npm run dev
```

### "Cannot find module" errors

**Solution:**
```bash
# Clear node_modules and reinstall
rm -r node_modules package-lock.json
npm install

# Clear Next.js cache
rm -r .next
npm run dev
```

### Prisma Errors

**Solution:**
```bash
# Reset database (WARNING: Deletes all data)
npx prisma migrate reset

# Or run migrations
npx prisma migrate dev

# View data
npx prisma studio
```

### Clerk Authentication Errors

**Check:**
1. Verify `.env.local` has correct Clerk keys
2. Go to Clerk Dashboard → Instances → Settings
3. Update authorized URLs correctly

### Stripe Payment Errors

**Check:**
1. Verify Stripe keys are in `.env.local`
2. Test keys should start with `pk_test_` and `sk_test_`
3. Check webhook is properly configured

---

## 🐛 Troubleshooting

### Application Won't Start

1. Check Node.js version: `node --version` (18+ required)
2. Install dependencies: `npm install`
3. Verify `.env.local` exists with all required keys
4. Clear cache: `rm -r .next node_modules && npm install && npm run dev`

### Database Connection Issues

1. Verify DATABASE_URL format
2. Test connection: `npx prisma studio`
3. Reset if needed: `npx prisma migrate reset`

### Page Loads Blank

1. Check browser console for errors (F12)
2. Check terminal output for build errors
3. Clear browser cache and hard refresh (Ctrl+Shift+R)

### Images Not Loading

1. Verify image URLs are accessible
2. Check public folder for images
3. Use Next.js Image component with proper configuration

### Theme Not Changing

1. Clear browser storage (DevTools → Application → Clear storage)
2. Verify `next-themes` is installed
3. Check theme provider in `layout.tsx`

---

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Shadcn UI Components](https://ui.shadcn.com)
- [Clerk Documentation](https://clerk.com/docs)
- [Stripe Documentation](https://stripe.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [React Hook Form](https://react-hook-form.com)
- [Zod Validation](https://zod.dev)
- [Zustand State Management](https://github.com/pmndrs/zustand)

---

## ✅ Version Information

- **Next.js**: 16.0.7
- **React**: 19.2.0
- **Node.js**: 18+ required
- **TypeScript**: 5.0+
- **Prisma**: 4.16.1
- **Tailwind CSS**: 4.1.17

---

**Last Updated:** December 9, 2025  
**Status:** ✅ Complete and Production Ready
