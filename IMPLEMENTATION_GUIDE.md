# Implementation Guide - Hotel Management System Features

## 🚀 Quick Start

### Step 1: Update Prisma Schema
Your Prisma schema has been automatically updated with new models:
- `GuestProfile` - Guest information
- `CheckInCheckOut` - Check-in/check-out tracking
- `RoomAssignment` - Room assignment management
- `Invoice` - Billing and invoicing
- `ServiceRequest` - Guest services and maintenance

### Step 2: Run Database Migration
```bash
npx prisma migrate dev --name add_reservation_management_features
```

### Step 3: Verify Files Are Created
The following files have been created:

**API Routes:**
- `app/api/check-in-out/route.ts` - Check-in/check-out management
- `app/api/room-assignment/route.ts` - Room assignment
- `app/api/guest-profile/route.ts` - Guest profiles
- `app/api/billing/route.ts` - Billing and invoices
- `app/api/service-requests/route.ts` - Guest services

**Components:**
- `components/hotel/CheckInCheckOutManager.tsx`
- `components/hotel/RoomAssignmentManager.tsx`
- `components/hotel/GuestProfileManager.tsx`
- `components/hotel/BillingManager.tsx`
- `components/hotel/GuestServicesManager.tsx`
- `components/hotel/BookingDetailsPopup.tsx`

**Pages:**
- `app/reservation-management/page.tsx` - Main reservation management dashboard
- `app/management-dashboard/page.tsx` - Staff dashboard with all bookings

### Step 4: Start Your Server
```bash
npm run dev
```

## 📖 How to Use

### For Hotel Staff

#### Access Management Dashboard
Visit: `http://localhost:3000/management-dashboard`

This dashboard shows:
- All hotels you manage
- Current bookings status
- Quick statistics
- Direct links to manage each booking

#### Manage a Specific Reservation
Click "Manage Reservation" or visit:
```
http://localhost:3000/reservation-management?bookingId=<booking-id>&hotelId=<hotel-id>
```

#### Using Each Feature

**1. Guest Profile (👤)**
- Fill in complete guest information
- Store ID/Passport details
- Record special requests
- Update address information

**2. Check-In/Check-Out (🔑)**
- Record check-in date and time
- Issue keys and confirm receipt
- Record check-out time
- Flag any issues
- Add staff notes

**3. Room Assignment (🚪)**
- Assign specific room number
- Set floor level for navigation
- Flag maintenance needs
- Record which staff assigned the room

**4. Billing (💳)**
- Create itemized invoices
- Track room charges, meals, services
- Calculate taxes and discounts
- Record payment method and amount
- Monitor payment status

**5. Guest Services (🔧)**
- Submit service requests for:
  - Room service
  - Maintenance
  - Housekeeping
  - Laundry
  - Front desk assistance
  - Concierge
- Set priority (low/normal/high/urgent)
- Assign to staff members
- Track status and completion

## 🔌 API Usage

### Get Guest Profile
```bash
curl http://localhost:3000/api/guest-profile?bookingId=<booking-id>
```

### Create/Update Guest Profile
```bash
curl -X POST http://localhost:3000/api/guest-profile \
  -H "Content-Type: application/json" \
  -d '{
    "bookingId": "uuid",
    "guestFirstName": "John",
    "guestLastName": "Doe",
    "guestEmail": "john@example.com",
    "guestPhone": "123-456-7890"
  }'
```

### Record Check-In
```bash
curl -X POST http://localhost:3000/api/check-in-out \
  -H "Content-Type: application/json" \
  -d '{
    "bookingId": "uuid",
    "checkInTime": "2024-01-15T14:30:00Z",
    "checkInBy": "staff123",
    "keyIssued": true
  }'
```

### Assign Room
```bash
curl -X POST http://localhost:3000/api/room-assignment \
  -H "Content-Type: application/json" \
  -d '{
    "bookingId": "uuid",
    "roomNumber": "301",
    "floorNumber": 3,
    "assignedBy": "staff123"
  }'
```

### Create Invoice
```bash
curl -X POST http://localhost:3000/api/billing \
  -H "Content-Type: application/json" \
  -d '{
    "bookingId": "uuid",
    "hotelId": 1,
    "invoiceNumber": "INV-2024-001",
    "roomCharges": 10000,
    "taxAmount": 1000,
    "paymentMethod": "card"
  }'
```

### Create Service Request
```bash
curl -X POST http://localhost:3000/api/service-requests \
  -H "Content-Type: application/json" \
  -d '{
    "bookingId": "uuid",
    "hotelId": 1,
    "serviceType": "maintenance",
    "description": "AC not working",
    "priority": "high",
    "assignedTo": "staff456"
  }'
```

## 🎯 Next Steps

### 1. Integrate with Your Booking System
Add links from booking confirmation page to management dashboard:

```tsx
<Link href={`/reservation-management?bookingId=${booking.id}&hotelId=${hotel.id}`}>
  <Button>Manage This Booking</Button>
</Link>
```

### 2. Add Staff Dashboard
Create a staff-only view showing:
- Assigned service requests
- Check-in list for the day
- Room assignments needed
- Pending payments

### 3. Connect to Existing Systems
- Link room availability with room assignment
- Sync invoices with your accounting system
- Connect service requests to housekeeping workflow

### 4. Add Email Notifications
Send emails when:
- Guest profile is updated
- Room is assigned
- Service request is completed
- Invoice is generated

### 5. Generate Reports
Create reports for:
- Daily check-ins/check-outs
- Pending payments
- Service request completion times
- Guest satisfaction metrics

## 🔒 Security Notes

⚠️ **Important:** Add authentication middleware to all API routes

```tsx
// Example: Add this to your API routes
import { auth } from '@clerk/nextjs';

export async function POST(req: NextRequest) {
  const { userId } = auth();
  
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  // ... rest of your code
}
```

## 📊 Database Relationships

```
Hotel (1) ─────→ (Many) Booking
Booking (1) ─────→ (1) GuestProfile
Booking (1) ─────→ (1) CheckInCheckOut
Booking (1) ─────→ (1) RoomAssignment
Booking (1) ─────→ (Many) Invoice
Booking (1) ─────→ (Many) ServiceRequest
Hotel (1) ─────→ (Many) Invoice
Hotel (1) ─────→ (Many) ServiceRequest
Room (1) ─────→ (Many) Booking
```

## 🆘 Troubleshooting

**Issue:** Database migration fails
```bash
# Reset database (dev only!)
npx prisma migrate reset
npm run dev
```

**Issue:** Components not loading
- Verify all files are in correct directories
- Check import paths
- Run `npm install` to ensure dependencies

**Issue:** API returns 401 Unauthorized
- Add authentication check (see Security Notes)
- Verify user is logged in
- Check API route permissions

**Issue:** Data not showing up
- Ensure Prisma client is regenerated: `npx prisma generate`
- Check database connection
- Verify booking ID and hotel ID are correct

## 📝 Checklists

### Setup Checklist
- [ ] Database migration completed
- [ ] All files created successfully
- [ ] Server running without errors
- [ ] Can access `/management-dashboard`
- [ ] Can access `/reservation-management`

### Feature Checklist
- [ ] Guest profile form works
- [ ] Check-in/check-out recording works
- [ ] Room assignment works
- [ ] Invoice creation works
- [ ] Service requests creation works
- [ ] Service request status updates work

### Integration Checklist
- [ ] Links added to booking confirmation
- [ ] Staff can access management pages
- [ ] API endpoints return correct data
- [ ] Error handling works properly
- [ ] Authentication is enabled

## 📚 Documentation

Full documentation is available in: `RESERVATION_MANAGEMENT_GUIDE.md`

This includes:
- Complete feature descriptions
- Database schema details
- API reference
- Component documentation
- Security considerations
- Future enhancement ideas
