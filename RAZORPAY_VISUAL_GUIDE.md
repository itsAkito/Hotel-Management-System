# Razorpay Implementation - Visual Guide

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     Hotel Management System                  │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              User Interface Layer                    │   │
│  │  ┌────────────────────────────────────────────────┐  │   │
│  │  │ BookingPayment Component                       │  │   │
│  │  │ - Display booking summary                      │  │   │
│  │  │ - Open Razorpay modal on payment click        │  │   │
│  │  │ - Handle payment response                      │  │   │
│  │  └────────────────────────────────────────────────┘  │   │
│  └──────────────────────────────────────────────────────┘   │
│                          ↓                                    │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              API Routes Layer                        │   │
│  │  ┌────────────────────────────────────────────────┐  │   │
│  │  │ POST /api/bookings                             │  │   │
│  │  │ - Create booking                               │  │   │
│  │  │ - Create Razorpay order                        │  │   │
│  │  │ - Return order ID                              │  │   │
│  │  └────────────────────────────────────────────────┘  │   │
│  │  ┌────────────────────────────────────────────────┐  │   │
│  │  │ POST /api/bookings/[id]/verify-payment        │  │   │
│  │  │ - Verify payment signature                     │  │   │
│  │  │ - Confirm booking                              │  │   │
│  │  │ - Update room status                           │  │   │
│  │  └────────────────────────────────────────────────┘  │   │
│  └──────────────────────────────────────────────────────┘   │
│                          ↓                                    │
│  ┌──────────────────────────────────────────────────────┐   │
│  │           Database Layer (Prisma)                    │   │
│  │  ┌────────────────────────────────────────────────┐  │   │
│  │  │ Booking Model                                  │  │   │
│  │  │ - User info, room, hotel                       │  │   │
│  │  │ - Payment status, intent, amount               │  │   │
│  │  │ - Check-in/out dates                           │  │   │
│  │  └────────────────────────────────────────────────┘  │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
└─────────────────────────────────────────────────────────────┘
                          ↓ ↑
            ┌─────────────────────────────┐
            │    Razorpay Gateway         │
            │  - Order Creation           │
            │  - Payment Processing       │
            │  - Webhook Events           │
            └─────────────────────────────┘
```

---

## Payment Flow Sequence Diagram

```
User          Browser           Backend          Razorpay
 │               │                 │                 │
 │─ Search Hotel─│                 │                 │
 │               │                 │                 │
 │─ View Room ───│                 │                 │
 │               │                 │                 │
 │─ Click Book ──│                 │                 │
 │               │                 │                 │
 │               │─ POST /bookings─→                 │
 │               │                 │                 │
 │               │    ┌─────────────────────────────┐│
 │               │    │ Create Booking              ││
 │               │    │ Create Razorpay Order API   ││
 │               │    └─────────────────────────────┘│
 │               │                 │                 │
 │               │                 │─ API Call ─────→
 │               │                 │← Order Created ─
 │               │                 │                 │
 │               │←─ Return Order ─│                 │
 │               │  ID             │                 │
 │               │                 │                 │
 │ ─ Payment ────│                 │                 │
 │   Click       │                 │                 │
 │               │                 │                 │
 │               │   [Razorpay Modal Opens]        │
 │               │                ↓                  │
 │               │         ┌───────────────┐        │
 │               │    ┌────│ Card Details  │────┐   │
 │               │    │    │ CVV, Expiry   │    │   │
 │               │    │    └───────────────┘    │   │
 │               │    │                         │   │
 │               │    └─────→ Razorpay Modal ←──┘   │
 │               │            (Payment Page)        │
 │               │                 ↓                │
 │               │         ┌──────────────────┐    │
 │ ─ Submit ─────│────────→│ User Enters Data │    │
 │               │         └──────────────────┘    │
 │               │                 │                │
 │               │                 │─ Process ─────→
 │               │                 │  Payment      │
 │               │                 │                │
 │               │                 │← Response ────│
 │               │←─ Payment Result─│ (Signature)  │
 │               │                 │                │
 │               │─ Verify ────────→                │
 │               │  Payment        │                │
 │               │                 │                │
 │               │    ┌─────────────────────┐      │
 │               │    │ Verify Signature    │      │
 │               │    │ Update Booking      │      │
 │               │    │ Update Room Status  │      │
 │               │    └─────────────────────┘      │
 │               │                 │                │
 │               │←─ Success ──────│                │
 │               │                 │                │
 │←─ Confirm ────│                 │                │
 │  Page         │                 │                │
 │               │                 │ ─ Webhook ───→
 │               │                 │   (Optional)  │
 │               │                 │                │
```

---

## File Structure

```
my-next-app/
│
├── components/
│   └── hotel/
│       └── BookingPayment.tsx          ✅ Updated
│           ├── Load Razorpay script
│           ├── Initialize payment
│           ├── Open modal
│           └── Handle response
│
├── app/
│   └── api/
│       ├── bookings/
│       │   ├── route.ts                 ✅ Updated
│       │   │   └── POST: Create order
│       │   │
│       │   └── [bookingId]/
│       │       ├── razorpay-order/
│       │       │   └── route.ts         ✨ New
│       │       │       └── GET: Get order
│       │       │
│       │       └── verify-payment/
│       │           └── route.ts         ✨ New
│       │               └── POST: Verify
│       │
│       └── webhooks/
│           └── stripe/
│               └── route.ts             ✅ Updated
│                   └── POST: Handle events
│
├── prisma/
│   └── schema.prisma                    ✓ Unchanged
│       └── Booking model (compatible)
│
├── lib/
│   └── prismadb.ts                      ✓ Unchanged
│
├── .env.example                         ✨ New
│
├── README.md                            ✅ Updated
│
├── RAZORPAY_SETUP_GUIDE.md              ✨ New
├── RAZORPAY_QUICK_REFERENCE.md          ✨ New
├── STRIPE_TO_RAZORPAY_MIGRATION.md      ✨ New
├── RAZORPAY_IMPLEMENTATION_CHECKLIST.md ✨ New
├── RAZORPAY_MIGRATION_SUMMARY.md        ✨ New
│
└── package.json                         ✅ Updated
    ├── Removed: @stripe/stripe-js
    ├── Removed: @stripe/react-stripe-js
    └── Removed: stripe
```

---

## Component Communication

```
┌──────────────────────────────────────────────────┐
│         Hotel Booking Page                       │
├──────────────────────────────────────────────────┤
│                                                  │
│  ┌──────────────────────────────────────────┐  │
│  │ BookingPayment Component                 │  │
│  │                                          │  │
│  │  ┌─────────────────────────────────┐   │  │
│  │  │ useState hooks:                 │   │  │
│  │  │ - loading: boolean              │   │  │
│  │  │ - error: string | null          │   │  │
│  │  │ - bookingId: string | null      │   │  │
│  │  │ - orderCreated: boolean         │   │  │
│  │  └─────────────────────────────────┘   │  │
│  │                                          │  │
│  │  ┌─────────────────────────────────┐   │  │
│  │  │ useEffect hooks:                │   │  │
│  │  │ - Load Razorpay script          │   │  │
│  │  │ - Initialize payment (create)   │   │  │
│  │  └─────────────────────────────────┘   │  │
│  │                                          │  │
│  │  ┌─────────────────────────────────┐   │  │
│  │  │ Event handlers:                 │   │  │
│  │  │ - handlePayment()               │   │  │
│  │  │  ├── Fetch order                │   │  │
│  │  │  ├── Open Razorpay modal        │   │  │
│  │  │  ├── Set handler callback       │   │  │
│  │  │  └── Verify signature           │   │  │
│  │  └─────────────────────────────────┘   │  │
│  │                                          │  │
│  │  ┌─────────────────────────────────┐   │  │
│  │  │ Render:                         │   │  │
│  │  │ - Booking summary card          │   │  │
│  │  │ - Error display (if error)      │   │  │
│  │  │ - Payment button                │   │  │
│  │  │ - Loading indicator             │   │  │
│  │  └─────────────────────────────────┘   │  │
│  └──────────────────────────────────────────┘  │
│                                                  │
└──────────────────────────────────────────────────┘
        ↓              ↓              ↓
   API Routes    Razorpay API    Database
```

---

## Environment Variables Setup

```
Development Environment (.env.local)
├── NEXT_PUBLIC_RAZORPAY_KEY_ID
│   └── rzp_test_xxxxxxxxxxxxxxxx (Public, frontend)
├── RAZORPAY_KEY_SECRET
│   └── sk_test_xxxxxxxxxxxxxxxx (Secret, backend only)
└── RAZORPAY_WEBHOOK_SECRET
    └── webhook_secret_xxxxx (Secret, webhook verification)

Production Environment (.env.production)
├── NEXT_PUBLIC_RAZORPAY_KEY_ID
│   └── rzp_live_xxxxxxxxxxxxxxxx (Public, frontend)
├── RAZORPAY_KEY_SECRET
│   └── sk_live_xxxxxxxxxxxxxxxx (Secret, backend only)
└── RAZORPAY_WEBHOOK_SECRET
    └── webhook_secret_xxxxx (Secret, webhook verification)
```

---

## Webhook Event Handling

```
┌────────────────────────────────────────┐
│     Razorpay Webhook                   │
├────────────────────────────────────────┤
│                                        │
│  Event Types:                          │
│                                        │
│  ┌──────────────────────────────────┐ │
│  │ payment.authorized               │ │
│  │ → Update booking status          │ │
│  │ → Mark as pending confirmation   │ │
│  └──────────────────────────────────┘ │
│                                        │
│  ┌──────────────────────────────────┐ │
│  │ payment.failed                   │ │
│  │ → Mark booking as failed         │ │
│  │ → Keep room available            │ │
│  └──────────────────────────────────┘ │
│                                        │
│  ┌──────────────────────────────────┐ │
│  │ payment.captured                 │ │
│  │ → Confirm booking                │ │
│  │ → Mark room as booked            │ │
│  └──────────────────────────────────┘ │
│                                        │
│  ┌──────────────────────────────────┐ │
│  │ refund.created                   │ │
│  │ → Cancel booking                 │ │
│  │ → Release room                   │ │
│  └──────────────────────────────────┘ │
│                                        │
└────────────────────────────────────────┘
           ↓
    POST /api/webhooks/stripe
           ↓
    Verify HMAC SHA256 Signature
           ↓
    ┌──────────────────┐
    │ Verify Success?  │
    └─────┬────────────┘
          ├─ Yes: Process event
          │       ↓
          │       Update database
          │       Return 200 OK
          │
          └─ No: Return 400 Error
```

---

## Data Flow

```
1. User Action
   └─ Book hotel and dates

2. Frontend Processing
   ├─ Create booking (POST /api/bookings)
   ├─ Receive Razorpay Order ID
   ├─ Load Razorpay Script
   └─ Open Payment Modal

3. Payment Processing
   ├─ User enters card details
   ├─ Razorpay processes payment
   ├─ Return payment response with signature
   └─ Frontend verifies signature

4. Backend Verification
   ├─ Verify HMAC SHA256 signature
   ├─ Confirm payment validity
   ├─ Update booking status
   ├─ Update room availability
   └─ Return confirmation

5. User Notification
   ├─ Display confirmation page
   ├─ Show booking details
   ├─ Provide booking ID
   └─ Offer print/download option

6. Admin Processing (Optional)
   ├─ Webhook notification
   ├─ Update analytics
   ├─ Send confirmation email
   └─ Generate invoice
```

---

## Status Transitions

```
User Creates Booking
        ↓
   PENDING (Awaiting Payment)
        ↓
User Clicks "Pay"
        ↓
   Razorpay Modal Opens
        ↓
    ┌───┴───┐
    │       │
Success   Failure
    │       │
    ↓       ↓
CONFIRMED  FAILED
    │       │
Mark room   Keep room
as booked   available
```

---

## Error Handling Flow

```
┌────────────────────────────┐
│  Payment Process Started   │
└───────────┬────────────────┘
            ↓
        Try Block
            ↓
    ┌───────┴────────┐
    │                │
Success          Error
    │                │
    ↓                ↓
Return         Catch Block
Success        ↓
Response    Log Error
    │        ↓
    │    Return Error
    │    Response
    │        │
    └────┬───┘
         ↓
    Display to User
    or Log
```

---

## Database Schema (Booking Model)

```
┌──────────────────────────────────────────┐
│         Booking Model                    │
├──────────────────────────────────────────┤
│                                          │
│ id: String (cuid)          [Primary Key]│
│ userName: String           [Required]    │
│ userId: String             [Required]    │
│ hotelOwnerId: String       [Required]    │
│ roomId: Int                [Required]    │
│ hotelId: Int               [Required]    │
│ checkIn: DateTime          [Required]    │
│ checkOut: DateTime         [Required]    │
│ breakfastIncluded: Boolean [Optional]    │
│ currency: String           [Required]    │
│ totalPrice: Int            [Required]    │
│ paymentIntent: String ─────┐             │
│   (Razorpay Order/Payment) │ [Key Info] │
│ status: String             └─[pending]   │
│   (pending/confirmed)                    │
│ paymentStatus: Boolean     [false/true]  │
│ bookedAt: DateTime         [Default Now] │
│                                          │
│ Relationships:                           │
│ - hotel: Hotel (Foreign Key)             │
│ - room: Room (Foreign Key)               │
│                                          │
└──────────────────────────────────────────┘
```

---

## Security Architecture

```
┌─────────────────────────────────┐
│  Frontend (Public)              │
├─────────────────────────────────┤
│ • Razorpay Key ID visible       │
│ • Razorpay modal opened         │
│ • Payment response received     │
│ • Signature passed to backend   │
└──────────────┬──────────────────┘
               ↓
┌─────────────────────────────────┐
│  Backend (Secure)               │
├─────────────────────────────────┤
│ • Secret Key hidden             │
│ • Signature verification        │
│ • Database updates              │
│ • Webhook processing            │
│ • Audit logging                 │
└─────────────────────────────────┘
               ↑
┌─────────────────────────────────┐
│  Razorpay Gateway               │
├─────────────────────────────────┤
│ • Payment processing            │
│ • Signature generation          │
│ • Event webhooks                │
│ • Settlement                    │
└─────────────────────────────────┘
```

---

## Integration Points

```
Hotel Management System
    ├── Clerk (Authentication)
    ├── PostgreSQL (Database)
    ├── Prisma (ORM)
    ├── Razorpay ◄──────── (Payment)
    │   ├── Order API
    │   ├── Payment Processing
    │   └── Webhooks
    ├── UploadThing (Images)
    ├── Tailwind (Styling)
    └── Next.js (Framework)
```

---

This visual guide provides a comprehensive overview of the Razorpay integration architecture. Each diagram represents different aspects of the system integration.
