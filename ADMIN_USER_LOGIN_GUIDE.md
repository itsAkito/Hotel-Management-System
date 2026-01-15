# Admin & User Login System Implementation Guide

## Overview
This implementation provides a complete role-based authentication system with separate admin and user login flows, featuring enhanced admin dashboard with interactive search functionality and restricted user access.

## Features Implemented

### 1. Separate Admin & User Login System
- **Login Page** (`/app/login/page.tsx`)
  - Guest/User Login button (blue)
  - Admin Login button (purple)
  - Sign-up options for both roles
  - Professional UI with role selection

### 2. Role-Based Authorization
- **User Model** (Prisma)
  - Added `User` model with role field ("user" | "admin")
  - Email and timestamp tracking
  
- **API Endpoints**
  - `/api/user-role` - Fetch user's role
  - `/api/user-register` - Register new user with role

### 3. Enhanced Navigation Bar
- Dynamic navigation based on user role
- Admin sees: My Hotels, Analytics, Reservations
- Users see: Destinations, My Bookings
- Dropdown menu for dashboard quick access

### 4. Admin Dashboard (Management Dashboard)
**Advanced Features:**
- **Multi-Hotel Management**
  - View all owned hotels with locations
  - Quick hotel selection cards
  - City and country information

- **Interactive Search & Filtering**
  - Search by guest name, email, or booking ID
  - Date range filtering (check-in/check-out)
  - Price range filtering with sliders
  - Payment status filter (Paid/Pending)
  - Sort options (Latest, Price High-Low, Guest Name)
  - Reset all filters button

- **Real-time Statistics**
  - Total bookings count
  - Active check-ins
  - Pending payments
  - Rooms assigned
  - Total revenue calculation

- **Booking Management**
  - View detailed booking information
  - Status badges (Confirmed, Pending, Completed, Cancelled)
  - Payment status indicators
  - Quick action buttons for:
    - Guest Profile Management
    - Check-in/Check-out
    - Room Assignment
    - Billing
    - Service Requests
  - Export data as CSV

- **Visual Improvements**
  - Gradient background
  - Color-coded status badges
  - Statistics cards with gradients
  - Responsive grid layout
  - Icons for better UX

### 5. Admin Hotel Management Page (`/admin-hotels`)
- View all hotels with locations
- Filter by city and country
- Sort by name, date, rooms, or location
- Add new hotels with location details
- Edit existing hotels
- Delete hotels
- Amenity badges (WiFi, Pool, Gym, Spa, Bar)
- Room count statistics
- Creation date tracking

### 6. Role-Based Route Protection
- **Middleware** (`middleware.ts`)
  - Protects admin-only routes
  - Redirects unauthorized users
  - Allows public routes

- **Role Protected Component** (`components/RoleProtected.tsx`)
  - Wraps pages requiring specific roles
  - Shows access denied message for unauthorized users
  - Loading state handling

### 7. User Restrictions
- Users can only access:
  - Home page
  - Search for hotels
  - Book hotels
  - View their bookings
  - Edit profile

- Users CANNOT access:
  - Admin dashboard
  - Hotel management
  - Booking management (as admin)
  - Analytics and reservations

## File Changes Summary

### New Files Created
1. `/app/login/page.tsx` - Separate login page
2. `/app/admin-hotels/page.tsx` - Admin hotel management
3. `/components/RoleProtected.tsx` - Role protection component
4. `/middleware.ts` - Route protection middleware
5. `/app/api/user-role/route.ts` - User role API
6. `/app/api/user-register/route.ts` - User registration API

### Modified Files
1. `prisma/schema.prisma` - Added User model
2. `components/layout/Navbar.tsx` - Added role-based navigation
3. `app/management-dashboard/page.tsx` - Enhanced with search, filters, and statistics

## Setup Instructions

### 1. Database Migration
```bash
npx prisma migrate dev --name add_user_model
```

### 2. Update Environment Variables
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_key
CLERK_SECRET_KEY=your_key
DATABASE_URL=your_db_url
```

### 3. Update Sign-in/Sign-up Pages
Replace Clerk's default sign-in/sign-up with custom pages that:
- Accept role parameter from URL
- Register user with selected role
- Call `/api/user-register` endpoint

### Custom Sign-in Page Example
Create `/app/(clerk)/sign-in/[[...sign-in]]/page.tsx`:
```tsx
"use client";
import { SignIn } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";

export default function SignInPage() {
  const searchParams = useSearchParams();
  const role = searchParams.get("role") || "user";
  
  return (
    <div className="min-h-screen flex items-center justify-center">
      <SignIn />
    </div>
  );
}
```

### Custom Sign-up Page Example
Create `/app/(clerk)/sign-up/[[...sign-up]]/page.tsx`:
```tsx
"use client";
import { SignUp, useUser } from "@clerk/nextjs";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function SignUpPage() {
  const searchParams = useSearchParams();
  const role = searchParams.get("role") || "user";
  const { user } = useUser();

  useEffect(() => {
    if (user?.id && user?.emailAddresses?.[0]?.emailAddress) {
      registerUser(user.id, user.emailAddresses[0].emailAddress, role);
    }
  }, [user]);

  const registerUser = async (userId: string, email: string, role: string) => {
    try {
      await fetch("/api/user-register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, email, role }),
      });
    } catch (error) {
      console.error("Registration error:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <SignUp />
    </div>
  );
}
```

## API Response Examples

### Get User Role
**Request:** `GET /api/user-role?userId=user_123`

**Response:**
```json
{
  "role": "admin"
}
```

### Register User
**Request:** `POST /api/user-register`
```json
{
  "userId": "user_123",
  "email": "admin@example.com",
  "role": "admin"
}
```

**Response:**
```json
{
  "id": "user_123",
  "email": "admin@example.com",
  "role": "admin",
  "createdAt": "2024-01-13T10:30:00Z"
}
```

## User Flow Diagram

### Admin Flow
1. Visit `/login`
2. Click "Login as Admin"
3. Sign in/Sign up with admin role
4. User registered in DB with role "admin"
5. Redirected to admin dashboard
6. Can access: Hotels, Bookings, Analytics
7. Navbar shows: My Hotels, Dashboard dropdown

### User Flow
1. Visit `/login`
2. Click "Login as Guest"
3. Sign in/Sign up with user role
4. User registered in DB with role "user"
5. Redirected to home page
6. Can access: Search, Book, My Bookings
7. Navbar shows: Destinations, My Bookings, Book Now

## Dashboard Features

### Admin Dashboard (`/management-dashboard`)
- **Search**: Guest name, email, booking ID
- **Filters**: Date range, price range, payment status
- **Sorting**: Latest, Price (High-Low), Guest Name
- **Statistics**: Live revenue, check-ins, payments
- **Actions**: Manage reservations, profiles, billing, services
- **Export**: Download booking data as CSV

### Statistics Calculation
```typescript
const stats = {
  total: filteredBookings.length,
  activeCheckIns: filteredBookings.filter(b => b.checkIn_checkout?.checkInTime).length,
  pendingPayments: filteredBookings.filter(b => !b.paymentStatus).length,
  roomsAssigned: filteredBookings.filter(b => b.roomAssignment?.roomNumber).length,
  totalRevenue: filteredBookings.reduce((sum, b) => sum + b.totalPrice, 0)
}
```

## Security Considerations

1. **Clerk Authentication**
   - Uses Clerk for secure user management
   - JWT tokens for API security

2. **Role Verification**
   - Always verify role on backend for sensitive operations
   - Frontend role display only for UX

3. **Route Protection**
   - Middleware blocks unauthorized route access
   - Component-level protection with RoleProtected wrapper

4. **Database Security**
   - User roles stored in database
   - Email uniqueness enforced

## Next Steps (Optional)

1. **Email Notifications**: Send confirmation emails with role
2. **Role Switching**: Allow admins to manage other admins
3. **Analytics Dashboard**: Add revenue charts and trends
4. **Audit Logs**: Track admin actions
5. **Two-Factor Authentication**: Enhanced security for admins
6. **Permission Levels**: Fine-grained admin permissions

## Troubleshooting

### Users redirected to wrong page
- Check `/api/user-role` returns correct role
- Verify database User records were created

### Admin can't see bookings
- Ensure hotel exists in database
- Check hotelId matches in bookings table

### Search not working
- Clear browser cache
- Verify searchQuery state updates
- Check API response data structure

### Role not persisting
- Verify `/api/user-register` is called after sign-up
- Check Clerk user creation completes before registration API call
- Add error logging in sign-up flow

## Testing Checklist

- [ ] Login page displays both options
- [ ] Admin login creates admin user
- [ ] User login creates user role
- [ ] Navbar updates based on role
- [ ] Admin can access dashboard
- [ ] User cannot access admin routes
- [ ] Search filters work correctly
- [ ] Statistics update in real-time
- [ ] Export CSV downloads correctly
- [ ] Date/price filters apply properly
- [ ] Sort options work
- [ ] Hotel management page loads with locations
- [ ] Can add/edit/delete hotels as admin
