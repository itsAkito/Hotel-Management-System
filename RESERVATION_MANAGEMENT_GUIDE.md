# Hotel Management System - Advanced Features Implementation

## Overview
This document outlines the comprehensive reservation management, check-in/check-out, room assignment, billing, and guest services features added to your Hotel Management System.

## Features Implemented

### 1. **Guest Profile Management**
- Store comprehensive guest information including:
  - Personal details (name, email, phone, address)
  - Guest count and special requests
  - ID/Passport information for security and compliance
  - Location details (city, state, zip, country)

**API Endpoint:** `POST/GET /api/guest-profile`

### 2. **Check-In & Check-Out Management**
- Track check-in and check-out times
- Manage key issuance and returns
- Record staff responsible for check-in/check-out
- Add notes for housekeeping or maintenance issues
- Streamline the guest arrival and departure process

**API Endpoint:** `POST/GET /api/check-in-out`

### 3. **Room Assignment**
- Assign specific rooms to bookings
- Track floor numbers for easy guest navigation
- Record which staff member made the assignment
- Flag rooms needing maintenance
- Add maintenance notes and requirements

**API Endpoint:** `POST/GET /api/room-assignment`

### 4. **Billing & Invoice Management**
- Create detailed invoices with itemized charges:
  - Room charges
  - Breakfast/meal charges
  - Service charges (room service, laundry, etc.)
  - Tax calculation
  - Discounts
- Track payment methods and payment status
- Monitor partial and full payments
- Calculate balance due automatically

**API Endpoint:** `POST/GET /api/billing`

### 5. **Guest Services & Maintenance Requests**
- Create and track service requests for:
  - Room service
  - Maintenance
  - Housekeeping
  - Laundry
  - Front desk issues
  - Concierge services
- Set priority levels (low, normal, high, urgent)
- Assign tasks to staff members
- Track request status (pending, in-progress, completed, cancelled)
- Record resolutions and completion details

**API Endpoint:** `POST/GET/PUT /api/service-requests`

## Database Schema

### New Models Added

#### GuestProfile
```prisma
- id: String (UUID)
- bookingId: String (Foreign Key)
- guestFirstName: String
- guestLastName: String
- guestEmail: String
- guestPhone: String
- guestAddress: String
- guestCity: String
- guestState: String
- guestZip: String
- guestCountry: String
- numberOfGuests: Int
- specialRequests: String
- idType: String (Passport, Driver License, etc.)
- idNumber: String
```

#### CheckInCheckOut
```prisma
- id: String (UUID)
- bookingId: String (Foreign Key)
- checkInTime: DateTime
- checkOutTime: DateTime
- checkInBy: String (Staff ID)
- checkOutBy: String (Staff ID)
- keyIssued: Boolean
- keyReturned: Boolean
- notes: String
```

#### RoomAssignment
```prisma
- id: String (UUID)
- bookingId: String (Foreign Key)
- roomNumber: String
- floorNumber: Int
- assignmentDate: DateTime
- assignedBy: String (Staff ID)
- maintenanceNeeded: Boolean
- maintenanceNotes: String
```

#### Invoice
```prisma
- id: String (UUID)
- bookingId: String (Foreign Key)
- hotelId: Int (Foreign Key)
- invoiceNumber: String (Unique)
- invoiceDate: DateTime
- dueDate: DateTime
- roomCharges: Int
- breakfastCharges: Int
- serviceCharges: Int
- taxAmount: Int
- discountAmount: Int
- totalAmount: Int
- paymentMethod: String
- paymentDate: DateTime
- paidAmount: Int
- balanceDue: Int
- status: String (pending, partial, paid)
- notes: String
```

#### ServiceRequest
```prisma
- id: String (UUID)
- bookingId: String (Foreign Key)
- hotelId: Int (Foreign Key)
- serviceType: String
- description: String
- priority: String (low, normal, high, urgent)
- requestedAt: DateTime
- completedAt: DateTime
- assignedTo: String (Staff ID)
- status: String (pending, in-progress, completed, cancelled)
- resolution: String
```

## UI Components Created

### 1. **CheckInCheckOutManager.tsx**
- Form to manage check-in and check-out times
- Key issuance/return tracking
- Staff assignment fields
- Notes for housekeeping

### 2. **RoomAssignmentManager.tsx**
- Room number assignment
- Floor level tracking
- Maintenance flag and notes
- Staff assignment

### 3. **GuestProfileManager.tsx**
- Comprehensive guest information form
- Address and contact details
- ID verification fields
- Special requests section

### 4. **BillingManager.tsx**
- Itemized charge breakdown
- Automatic total and balance calculation
- Payment method selection
- Invoice number generation
- Payment status tracking

### 5. **GuestServicesManager.tsx**
- Service request creation with priority levels
- Real-time request list display
- Status tracking (pending → in-progress → completed)
- Color-coded priority and status badges
- Staff assignment
- Resolution tracking

### 6. **ReservationManagementPage.tsx**
- Integrated dashboard combining all features
- Tabbed interface for easy navigation
- Quick booking information overview
- Seamless switching between different management functions

## API Routes

### Guest Profile
```
GET /api/guest-profile?bookingId=<id>
POST /api/guest-profile
```

### Check-In/Check-Out
```
GET /api/check-in-out?hotelId=<id>
POST /api/check-in-out
```

### Room Assignment
```
GET /api/room-assignment?hotelId=<id>
POST /api/room-assignment
```

### Billing/Invoices
```
GET /api/billing?hotelId=<id>&status=<status>&bookingId=<id>
POST /api/billing
```

### Guest Services
```
GET /api/service-requests?hotelId=<id>&status=<status>&priority=<priority>
POST /api/service-requests
PUT /api/service-requests
```

## How to Use

### 1. Running the Application
```bash
npm run dev
```

### 2. Creating Database Migration
First, update your Prisma schema (already done), then run:
```bash
npx prisma migrate dev --name add_reservation_features
```

### 3. Accessing Reservation Management
Navigate to: `/reservation-management?bookingId=<booking-id>&hotelId=<hotel-id>`

Example: `/reservation-management?bookingId=123e4567-e89b-12d3-a456-426614174000&hotelId=1`

### 4. Using Each Feature

**Guest Profile:**
- Fill in guest details when they check in
- Store ID information for compliance
- Note any special requests

**Check-In/Check-Out:**
- Record exact check-in times
- Issue keys and track returns
- Add any special instructions

**Room Assignment:**
- Assign room numbers immediately after check-in
- Flag maintenance issues
- Ensure housekeeping is prepared

**Billing:**
- Create invoices with itemized charges
- Track partial payments
- Generate reports for accounting

**Guest Services:**
- Respond to guest requests immediately
- Assign to appropriate staff
- Mark completion when resolved

## Integration Points

You can integrate this with your existing:
- **Booking System:** Link reservations to the management dashboard
- **User Dashboard:** Add management option in guest account
- **Hotel Staff Dashboard:** Create staff-only views
- **Reporting:** Generate reports from collected data
- **Notifications:** Alert staff of high-priority requests

## Security Considerations

- Ensure API routes are protected with authentication
- Validate all staff IDs against your staff management system
- Encrypt sensitive guest information (ID numbers)
- Audit all billing transactions
- Log all service request changes

## Future Enhancements

1. Real-time notifications for service requests
2. SMS alerts for guests
3. Mobile app integration
4. Advanced analytics and reporting
5. Integration with housekeeping management system
6. Guest satisfaction surveys
7. Automated billing based on services used
8. Payment gateway integration for immediate invoicing

## File Structure

```
components/hotel/
├── CheckInCheckOutManager.tsx
├── RoomAssignmentManager.tsx
├── GuestProfileManager.tsx
├── BillingManager.tsx
└── GuestServicesManager.tsx

app/api/
├── check-in-out/route.ts
├── room-assignment/route.ts
├── guest-profile/route.ts
├── billing/route.ts
└── service-requests/route.ts

app/
└── reservation-management/page.tsx

prisma/
└── schema.prisma (updated)
```

## Support

For any issues or questions about the implementation:
1. Check the console for error messages
2. Verify all database migrations have run
3. Ensure bookingId and hotelId parameters are correct
4. Check that required fields are filled in forms
