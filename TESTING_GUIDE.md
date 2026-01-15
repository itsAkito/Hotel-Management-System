# Testing Guide - Admin & User Login System

## Pre-Testing Checklist

- [ ] Database migration completed (`npx prisma migrate dev --name add_user_model`)
- [ ] Clerk keys configured in `.env.local`
- [ ] Development server running (`npm run dev`)
- [ ] Clear browser cache and cookies
- [ ] Browser console open for debugging

---

## 1. Login Page Test

### Test Case 1.1: Login Page Loads
**Steps:**
1. Navigate to `http://localhost:3000/login`
2. Observe two buttons appear

**Expected Result:**
- ✅ "Login as Guest" button visible (blue)
- ✅ "Login as Admin" button visible (purple)
- ✅ Sign-up options for both roles visible
- ✅ "Back to Home" link visible

### Test Case 1.2: User Login Path
**Steps:**
1. Click "Login as Guest" button
2. Complete sign-up process

**Expected Result:**
- ✅ Redirected to `/sign-up?role=user`
- ✅ Sign-up form displays "Guest Sign Up"
- ✅ After completion, redirected to home

### Test Case 1.3: Admin Login Path
**Steps:**
1. Click "Login as Admin" button
2. Complete sign-up process

**Expected Result:**
- ✅ Redirected to `/sign-up?role=admin`
- ✅ Sign-up form displays "Admin Sign Up"
- ✅ After completion, redirected to home

---

## 2. User Registration & Role Assignment Test

### Test Case 2.1: User Role Stored in Database
**Steps:**
1. Sign up as guest with email: `user@test.com`
2. Open browser DevTools → Network tab
3. Check request to `/api/user-register`
4. Verify database entry

**Expected Result:**
- ✅ POST request to `/api/user-register` successful
- ✅ Request body contains `role: "user"`
- ✅ Response status: 201
- ✅ Database User table has entry with role: "user"

### Test Case 2.2: Admin Role Stored in Database
**Steps:**
1. Sign up as admin with email: `admin@test.com`
2. Check `/api/user-register` request
3. Verify database entry

**Expected Result:**
- ✅ Request body contains `role: "admin"`
- ✅ Database User table has entry with role: "admin"
- ✅ Both records created with correct roles

---

## 3. Navbar Navigation Test

### Test Case 3.1: User Navbar Display
**Steps:**
1. Sign in as user
2. Observe navbar elements

**Expected Result:**
- ✅ Navigation shows: Home, Destinations, My Bookings
- ✅ "Book Now" button visible
- ✅ Dashboard dropdown shows "My Bookings"
- ✅ No "My Hotels" or "Analytics" links
- ✅ Sign Out button visible

### Test Case 3.2: Admin Navbar Display
**Steps:**
1. Sign in as admin
2. Observe navbar elements

**Expected Result:**
- ✅ Navigation shows: Home (no Destinations)
- ✅ "My Hotels" button visible (purple)
- ✅ Dashboard dropdown shows:
  - Bookings
  - Analytics
  - Reservations
- ✅ "Book Now" button NOT visible
- ✅ Sign Out button visible

### Test Case 3.3: Navbar Updates After Login
**Steps:**
1. Open navbar while logged out
2. Sign in as user
3. Observe navbar change

**Expected Result:**
- ✅ Navbar updates without page reload
- ✅ Sign In/Sign Up buttons disappear
- ✅ User-specific buttons appear
- ✅ Role-based navigation loads

---

## 4. Route Protection Test

### Test Case 4.1: User Cannot Access Admin Routes
**Steps:**
1. Sign in as user
2. Try to access `/my-hotels` directly
3. Try to access `/management-dashboard` directly

**Expected Result:**
- ✅ Redirected to `/my-bookings`
- ✅ No error shown to user
- ✅ Access denied silently handled

### Test Case 4.2: Admin Can Access Admin Routes
**Steps:**
1. Sign in as admin
2. Navigate to `/my-hotels`
3. Navigate to `/management-dashboard`

**Expected Result:**
- ✅ Pages load successfully
- ✅ Can view all hotels
- ✅ Can see dashboard

### Test Case 4.3: Public Routes Accessible to All
**Steps:**
1. Navigate to `/` (not signed in)
2. Navigate to `/search` (not signed in)
3. Navigate to `/hotel/[id]` (not signed in)

**Expected Result:**
- ✅ All pages load without authentication
- ✅ No redirect to login
- ✅ Can view public content

---

## 5. Admin Dashboard Features Test

### Test Case 5.1: Dashboard Loads
**Steps:**
1. Sign in as admin
2. Click "Dashboard" in navbar
3. Observe loading state
4. Wait for data to load

**Expected Result:**
- ✅ "Loading..." message appears briefly
- ✅ Hotels dropdown loads
- ✅ Statistics cards appear
- ✅ Bookings list displays

### Test Case 5.2: Hotel Selection
**Steps:**
1. From dashboard, click on different hotels
2. Observe bookings list change

**Expected Result:**
- ✅ Selected hotel highlighted with blue ring
- ✅ Bookings list updates
- ✅ Statistics recalculate
- ✅ Quick filters still work

### Test Case 5.3: Quick Filters
**Steps:**
1. From dashboard, test each quick filter button
2. Click "All", then "Active", then "Pending", then "Completed"

**Expected Result:**
- ✅ Active button highlighted
- ✅ Bookings list filters accordingly
- ✅ Statistics update
- ✅ No page reload needed

### Test Case 5.4: Advanced Search Button
**Steps:**
1. Click "Advanced Search" button
2. Observe filter panel

**Expected Result:**
- ✅ Filter panel expands
- ✅ Shows: Search box, Date filters, Price filters, Payment filter, Sort dropdown
- ✅ Click again to collapse

---

## 6. Search Functionality Test

### Test Case 6.1: Search by Guest Name
**Steps:**
1. Open Advanced Search
2. Type guest name in search box
3. Type partial name

**Expected Result:**
- ✅ Real-time filtering as you type
- ✅ Only bookings matching name appear
- ✅ Partial matches work
- ✅ Case-insensitive search

### Test Case 6.2: Search by Email
**Steps:**
1. Open Advanced Search
2. Type guest email in search box

**Expected Result:**
- ✅ Filters by email address
- ✅ Partial email matches work

### Test Case 6.3: Search by Booking ID
**Steps:**
1. Open Advanced Search
2. Type booking ID in search box

**Expected Result:**
- ✅ Finds booking by ID
- ✅ Partial ID matches work

---

## 7. Filter Functionality Test

### Test Case 7.1: Date Range Filter
**Steps:**
1. Open Advanced Search
2. Set "Check-In From" to a recent date
3. Set "Check-Out To" to a future date

**Expected Result:**
- ✅ Bookings outside date range disappear
- ✅ Only bookings in range show
- ✅ Statistics update

### Test Case 7.2: Price Range Filter
**Steps:**
1. Open Advanced Search
2. Adjust "Min Price" slider to $500
3. Adjust "Max Price" slider to $2000

**Expected Result:**
- ✅ Only bookings between $500-$2000 show
- ✅ Slider labels update
- ✅ Works in combination with other filters

### Test Case 7.3: Payment Status Filter
**Steps:**
1. Open Advanced Search
2. Select "Paid" from dropdown
3. Select "Pending" from dropdown

**Expected Result:**
- ✅ Shows only paid bookings
- ✅ Shows only unpaid bookings
- ✅ Statistics update accordingly

### Test Case 7.4: Combined Filters
**Steps:**
1. Set search term: "John"
2. Set date range: Jan 13 - Jan 20
3. Set price range: $100 - $500
4. Select payment: "Pending"

**Expected Result:**
- ✅ All filters apply simultaneously
- ✅ Only matching bookings display
- ✅ Statistics show filtered count

---

## 8. Sort Functionality Test

### Test Case 8.1: Sort by Latest
**Steps:**
1. Select "Sort By: Latest First"
2. Observe booking order

**Expected Result:**
- ✅ Most recent bookings appear first
- ✅ Sorted by check-in date descending

### Test Case 8.2: Sort by Price High-Low
**Steps:**
1. Select "Sort By: Highest Price"
2. Verify order

**Expected Result:**
- ✅ Highest price bookings appear first
- ✅ Correct descending order

### Test Case 8.3: Sort by Price Low-High
**Steps:**
1. Select "Sort By: Lowest Price"
2. Verify order

**Expected Result:**
- ✅ Lowest price bookings appear first
- ✅ Correct ascending order

### Test Case 8.4: Sort by Name
**Steps:**
1. Select "Sort By: Guest Name"
2. Verify alphabetical order

**Expected Result:**
- ✅ Alphabetically sorted by guest name
- ✅ A-Z order maintained

---

## 9. Statistics Test

### Test Case 9.1: Total Bookings Stat
**Steps:**
1. Count visible bookings manually
2. Check "Total Bookings" card

**Expected Result:**
- ✅ Number matches visible bookings
- ✅ Updates when filters change

### Test Case 9.2: Active Check-Ins Stat
**Steps:**
1. Check bookings with check-in time
2. Verify stat count

**Expected Result:**
- ✅ Count matches bookings with checkInTime set
- ✅ Updates correctly

### Test Case 9.3: Pending Payments Stat
**Steps:**
1. Count bookings with paymentStatus = false
2. Check stat

**Expected Result:**
- ✅ Count accurate
- ✅ Updates with filters

### Test Case 9.4: Total Revenue Stat
**Steps:**
1. Sum visible booking prices
2. Check revenue card

**Expected Result:**
- ✅ Sum matches visible bookings
- ✅ Updates dynamically

---

## 10. Export Data Test

### Test Case 10.1: Export as CSV
**Steps:**
1. Apply some filters
2. Click "Export" button
3. Check downloaded file

**Expected Result:**
- ✅ CSV file downloads
- ✅ Filename format: `bookings-YYYY-MM-DD.csv`
- ✅ Contains correct columns
- ✅ Data matches filtered view
- ✅ Can open in Excel/Sheets

### Test Case 10.2: Export Format
**Steps:**
1. Open downloaded CSV
2. Verify structure

**Expected Result:**
- ✅ Headers: Guest Name, Email, Check-In, Check-Out, Room, Total Price, Status, Payment Status
- ✅ Data properly formatted
- ✅ Dates in readable format
- ✅ No special characters breaking CSV

---

## 11. Admin Hotels Management Test

### Test Case 11.1: Admin Hotels Page Loads
**Steps:**
1. Sign in as admin
2. Click "My Hotels" in navbar
3. Or navigate to `/admin-hotels`

**Expected Result:**
- ✅ Page loads
- ✅ Shows all admin's hotels
- ✅ Statistics cards display
- ✅ Search and filter controls visible

### Test Case 11.2: Hotel Cards Display
**Steps:**
1. View hotels list
2. Check hotel information

**Expected Result:**
- ✅ Hotel image displays
- ✅ Hotel name visible
- ✅ City, state, country shown
- ✅ Location description visible (if set)
- ✅ Amenity icons display
- ✅ Room count shows
- ✅ Creation date displays

### Test Case 11.3: Filter by City
**Steps:**
1. Click "Show Filters"
2. Select a city from dropdown
3. Observe hotel list

**Expected Result:**
- ✅ Only hotels from selected city appear
- ✅ Hotel count updates
- ✅ Works with search

### Test Case 11.4: Filter by Country
**Steps:**
1. Click "Show Filters"
2. Select a country
3. Observe hotel list

**Expected Result:**
- ✅ Only hotels from country appear
- ✅ Works independently and with city filter

### Test Case 11.5: Search Hotels
**Steps:**
1. Type in search box
2. Try searching by name, description, location

**Expected Result:**
- ✅ Real-time search
- ✅ Partial matches work
- ✅ Case-insensitive
- ✅ Searches description and location too

### Test Case 11.6: Add Hotel Button
**Steps:**
1. Click "Add New Hotel" button
2. Verify redirect

**Expected Result:**
- ✅ Redirects to `/addhotel`
- ✅ Hotel form loads
- ✅ Can add location details

### Test Case 11.7: Edit Hotel
**Steps:**
1. Click "Edit" button on hotel card
2. Verify redirect

**Expected Result:**
- ✅ Redirects to `/addhotel?id=HOTELID`
- ✅ Form pre-fills with hotel data
- ✅ Can edit and save

### Test Case 11.8: Delete Hotel
**Steps:**
1. Click "Delete" button on hotel card
2. Confirm deletion

**Expected Result:**
- ✅ Confirmation dialog appears
- ✅ After confirmation, hotel removed
- ✅ List updates
- ✅ Statistics update

---

## 12. Booking Management Test

### Test Case 12.1: View Booking Details
**Steps:**
1. Click booking card in dashboard
2. View all information

**Expected Result:**
- ✅ Guest name displays
- ✅ Email visible
- ✅ Check-in/check-out dates show
- ✅ Room number displays
- ✅ Total price visible
- ✅ Status badge shows
- ✅ Payment status shows
- ✅ Key status shows

### Test Case 12.2: Manage Reservation
**Steps:**
1. Click "Manage" button
2. Verify redirect

**Expected Result:**
- ✅ Redirects to reservation management page
- ✅ All booking details load
- ✅ Can make changes

### Test Case 12.3: Quick Action Buttons
**Steps:**
1. View booking card
2. Click each quick action button

**Expected Result:**
- ✅ Profile button works
- ✅ Check-In/Out button works
- ✅ Room assignment button works
- ✅ Billing button works
- ✅ Services button works

---

## 13. Reset Filters Test

### Test Case 13.1: Reset All Filters
**Steps:**
1. Apply multiple filters
2. Click "Reset All Filters" button

**Expected Result:**
- ✅ All filters cleared
- ✅ Search box empty
- ✅ Date filters reset
- ✅ Price range reset
- ✅ Payment filter set to "All"
- ✅ Sort reset to "Latest"
- ✅ All bookings display again

---

## 14. Error Handling Test

### Test Case 14.1: Network Error
**Steps:**
1. Disable internet (DevTools → Offline)
2. Try to load dashboard
3. Try to apply filters

**Expected Result:**
- ✅ Error handled gracefully
- ✅ No crash/white screen
- ✅ User sees message (if implemented)
- ✅ Can try again

### Test Case 14.2: Invalid Role
**Steps:**
1. Manually set user role to invalid value in DB
2. Reload page

**Expected Result:**
- ✅ User redirected appropriately
- ✅ No access to protected routes
- ✅ Friendly error handling

---

## 15. Performance Test

### Test Case 15.1: Dashboard Load Time
**Steps:**
1. Open DevTools → Performance
2. Navigate to dashboard
3. Record load metrics

**Expected Result:**
- ✅ Dashboard loads in < 2 seconds
- ✅ Statistics appear immediately
- ✅ Smooth interactions

### Test Case 15.2: Filter Performance
**Steps:**
1. Dashboard with 100+ bookings
2. Apply filters and sort
3. Observe responsiveness

**Expected Result:**
- ✅ Filters apply instantly
- ✅ No noticeable lag
- ✅ UI remains responsive

### Test Case 15.3: Search Performance
**Steps:**
1. Type in search box
2. Observe real-time updates

**Expected Result:**
- ✅ Immediate filtering feedback
- ✅ No typing delay
- ✅ Smooth user experience

---

## 16. Browser Compatibility Test

Test on these browsers:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Chrome
- [ ] Mobile Safari

**Expected Result:**
- ✅ All features work on all browsers
- ✅ Responsive design works
- ✅ No console errors

---

## 17. Responsive Design Test

### Test Case 17.1: Mobile View (< 768px)
**Steps:**
1. Open DevTools → Mobile view
2. Navigate through all pages
3. Test all interactions

**Expected Result:**
- ✅ Layout stacks correctly
- ✅ Text readable
- ✅ Buttons clickable
- ✅ Search and filters work
- ✅ No horizontal scroll

### Test Case 17.2: Tablet View (768px - 1024px)
**Steps:**
1. Test at 768px and 1024px
2. Verify layout adjustments

**Expected Result:**
- ✅ 2-column layout on hotels grid
- ✅ 2-column filters layout
- ✅ All content visible
- ✅ No overflow issues

### Test Case 17.3: Desktop View (> 1024px)
**Steps:**
1. Test on full desktop
2. Verify maximum layout

**Expected Result:**
- ✅ 3-column hotel grid
- ✅ Full filter display
- ✅ All information visible
- ✅ Properly aligned

---

## Test Execution Checklist

- [ ] All 17 test categories completed
- [ ] All test cases passed
- [ ] No console errors
- [ ] No network errors
- [ ] Database entries correct
- [ ] Role-based access working
- [ ] Search and filters accurate
- [ ] Export data valid
- [ ] Mobile responsive
- [ ] Performance acceptable

---

## Bug Report Template

If you find issues during testing, use this template:

```
**Title**: [Brief description]

**Test Case**: [Number and name]

**Steps to Reproduce**:
1. 
2. 
3. 

**Expected Result**:
[What should happen]

**Actual Result**:
[What actually happened]

**Environment**:
- Browser: 
- OS: 
- Screen Size: 

**Screenshots**:
[Attach if applicable]

**Error Log**:
[Console errors if any]
```

---

**Last Updated**: January 13, 2026  
**Test Coverage**: Comprehensive  
**Status**: Ready for QA
