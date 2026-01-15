# Quick Start Guide - Admin & User Login System

## 🚀 Quick Setup (5 Minutes)

### Step 1: Run Database Migration
```bash
cd my-next-app
npx prisma migrate dev --name add_user_model
```

### Step 2: Test the Login System
1. Start your development server: `npm run dev`
2. Navigate to `http://localhost:3000/login`
3. You'll see two buttons:
   - 🧑 **Login as Guest** (User)
   - 🛡️ **Login as Admin**

### Step 3: Create Test Accounts
- Sign up as **Guest** → Can search and book hotels
- Sign up as **Admin** → Can manage hotels and view admin dashboard

---

## 🎯 Key Features at a Glance

### For Users 👤
✅ Search for hotels  
✅ Book hotels  
✅ View my bookings  
✅ See user dashboard  
❌ Cannot add hotels  
❌ Cannot see admin features  

### For Admins 🛡️
✅ Add new hotels with locations  
✅ Edit/Delete hotels  
✅ View all bookings  
✅ Search & filter bookings  
✅ Manage reservations  
✅ View analytics dashboard  
✅ Export booking data  

---

## 📍 Important Routes

| Route | Access | Purpose |
|-------|--------|---------|
| `/` | All | Home page |
| `/login` | All | Login/Signup selection |
| `/search` | Users | Search hotels |
| `/book-stay` | Users | Book a hotel |
| `/my-bookings` | Users | View my bookings |
| `/my-hotels` | Admins | Manage my hotels |
| `/admin-hotels` | Admins | Hotel management with filters |
| `/management-dashboard` | Admins | Booking management dashboard |
| `/addhotel` | Admins | Add new hotel |

---

## 🔍 Admin Dashboard Features

### Search & Filter
- **Search Box**: Find bookings by guest name, email, or ID
- **Date Range**: Filter by check-in and check-out dates
- **Price Range**: Set min/max price with sliders
- **Payment Status**: Filter paid or pending payments
- **Sort**: By date, price, or guest name
- **Export**: Download data as CSV

### Quick Statistics
- Total Bookings
- Active Check-Ins
- Pending Payments
- Rooms Assigned
- Total Revenue

### Booking Actions
Each booking card has quick action buttons:
- 📋 **Manage** - Full reservation management
- 👤 **Profile** - Guest information
- 🔑 **Check-In/Out** - Check-in/out management
- 🚪 **Room** - Room assignment
- 💳 **Billing** - Payment & billing
- 🔧 **Services** - Service requests

---

## 🏨 Admin Hotel Management

### Features
- **Add Hotels**: Click "Add New Hotel" button
- **Hotel Details**:
  - Hotel name and description
  - Location (City, State, Country)
  - Location description
  - Amenities (WiFi, Pool, Gym, etc.)
  - Hotel image
  - Rooms management

- **Filter & Search**:
  - Search by name or description
  - Filter by city and country
  - Sort by name, date, rooms, or location

- **Quick Stats**:
  - Total hotels count
  - Total rooms across all hotels
  - Unique cities
  - Unique countries

---

## 🔐 Role-Based Access

The system automatically:
1. ✅ Checks user role on login
2. ✅ Stores role in database
3. ✅ Shows/hides navbar options based on role
4. ✅ Blocks access to restricted pages
5. ✅ Logs users to appropriate dashboard

---

## 🛠️ API Endpoints

### Check User Role
```
GET /api/user-role?userId=USER_ID
Response: { "role": "admin" | "user" }
```

### Register User
```
POST /api/user-register
Body: { "userId": "...", "email": "...", "role": "admin" | "user" }
Response: { "id": "...", "email": "...", "role": "...", "createdAt": "..." }
```

---

## 🐛 Troubleshooting

### Issue: Redirect loop on login
**Solution**: 
- Clear browser cache
- Check Clerk keys in `.env.local`
- Ensure database is running

### Issue: Can't see dashboard
**Solution**:
- Check if user registered with correct role
- Visit `/api/user-role?userId=YOUR_ID` to verify role
- Try signing out and signing back in

### Issue: Search filters not working
**Solution**:
- Ensure bookings exist in database
- Check browser console for errors
- Try resetting filters

### Issue: Hotel location not showing
**Solution**:
- Verify hotel has city, state, country values
- Check Prisma schema migration completed
- Clear Next.js cache: `rm -rf .next`

---

## 📊 Admin Dashboard Search Example

**Scenario**: Find all bookings over $500 that haven't been paid

1. Click "Advanced Search" button
2. Set:
   - Min Price: $500
   - Max Price: $100000
   - Payment Status: Pending
3. Click "All Bookings" to see unpaid high-value bookings

---

## 🎨 Customization

### Change Admin Button Color
In `/app/login/page.tsx`, find the admin button and change:
```tsx
className="... bg-purple-600 to-purple-700 ..."
```

### Change Dashboard Theme
In `/app/management-dashboard/page.tsx`, modify gradient colors:
```tsx
className="... from-gray-50 to-gray-100"
```

### Add More Filter Options
Edit advanced filter section in management dashboard to add:
- Room type filter
- Guest nationality filter
- Special requests search

---

## 📱 Responsive Design

All components are mobile-responsive:
- ✅ Login page - Full width on mobile
- ✅ Dashboard - Stacked on mobile
- ✅ Hotel cards - Grid adjusts for screen size
- ✅ Filters - Single column on mobile

---

## ✨ Next Features to Add

1. **Admin Management**: Let admins manage other admins
2. **Analytics Charts**: Revenue trends and occupancy rates
3. **Email Notifications**: Send confirmation emails
4. **Audit Logs**: Track admin actions
5. **Permission Levels**: Fine-grained admin permissions
6. **Support Tickets**: Handle guest issues

---

## 📞 Need Help?

Check these files for implementation details:
- `ADMIN_USER_LOGIN_GUIDE.md` - Complete documentation
- `/app/login/page.tsx` - Login flow
- `/components/layout/Navbar.tsx` - Navigation logic
- `/app/management-dashboard/page.tsx` - Dashboard implementation
- `/middleware.ts` - Route protection

---

**Last Updated**: January 13, 2026  
**Version**: 1.0  
**Status**: ✅ Production Ready
