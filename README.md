# 🏨 Hotel Management System

A full-featured hotel booking platform built with **Next.js 16**, **Prisma**, **PostgreSQL**, **Clerk**, and **Stripe**.

## Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL (Neon recommended)
- Clerk account
- Stripe account

### Installation

```bash
# Install dependencies
npm install

# Create .env.local with your config (see Configuration)
# npx prisma migrate dev

# Start dev server
npm run dev
```

Server: `http://localhost:3000`

## Configuration

Create `.env.local`:

```env
# Database
DATABASE_URL=postgresql://...

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...
CLERK_SECRET_KEY=...

# Uploadthing
UPLOADTHING_SECRET=...
UPLOADTHING_APP_ID=...
UPLOADTHING_TOKEN=...

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=...
STRIPE_SECRET_KEY=...
STRIPE_WEBHOOK_SECRET=...
```

## Features

- User authentication (Clerk)
- Hotel/room management
- Hotel search & filtering
- Booking system
- Payment processing (Stripe)
- Image uploads (Uploadthing)
- Responsive design (Tailwind)

## Tech Stack

- **Next.js 16** - Framework
- **Prisma** - ORM
- **PostgreSQL** - Database
- **Clerk** - Authentication
- **Stripe** - Payments
- **Uploadthing** - File uploads
- **Tailwind CSS** - Styling
- **Shadcn UI** - Components

## Development

```bash
npm run dev      # Dev server
npm run build    # Build
npm start        # Production
npm run lint     # Linting
```

## Project Structure

```
app/              # Pages & API routes
components/       # Reusable components
lib/              # Utilities
prisma/           # Database schema
public/           # Static files
```

---

**Status**: ✅ Production Ready
