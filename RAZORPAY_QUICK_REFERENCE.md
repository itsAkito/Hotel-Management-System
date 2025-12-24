# Razorpay Integration - Quick Reference

## Environment Variables

```env
# Required for payment processing
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=sk_test_xxxxxxxxxxxxxxxx
RAZORPAY_WEBHOOK_SECRET=webhook_secret_xxxxx
```

## API Endpoints

### Create Booking & Razorpay Order
```
POST /api/bookings
Content-Type: application/json

{
  "userName": "John Doe",
  "roomId": "1",
  "hotelId": "1",
  "checkIn": "2024-01-15T00:00:00Z",
  "checkOut": "2024-01-17T00:00:00Z",
  "breakfastIncluded": true,
  "currency": "INR",
  "totalPrice": 5000
}

Response:
{
  "booking": { id, userName, ... },
  "razorpayOrderId": "order_xxxxx"
}
```

### Verify Payment
```
POST /api/bookings/[bookingId]/verify-payment
Content-Type: application/json

{
  "razorpay_order_id": "order_xxxxx",
  "razorpay_payment_id": "pay_xxxxx",
  "razorpay_signature": "signature_xxxxx"
}

Response:
{
  "success": true,
  "booking": { ... }
}
```

### Get Razorpay Order
```
GET /api/bookings/[bookingId]/razorpay-order

Response:
{
  "razorpayOrderId": "order_xxxxx"
}
```

## Component Usage

### BookingPayment Component
```tsx
import BookingPayment from '@/components/hotel/BookingPayment';

<BookingPayment
  roomId={1}
  hotelId={1}
  checkIn={new Date('2024-01-15')}
  checkOut={new Date('2024-01-17')}
  breakfastIncluded={true}
  totalPrice={5000}
  currency="INR"
  roomTitle="Deluxe Room"
  hotelTitle="Grand Hotel"
  userName="John Doe"
/>
```

## Test Cards

| Card Number | CVV | Expiry | Result |
|------------|-----|--------|--------|
| 4111 1111 1111 1111 | Any 3 digits | Any future date | ✅ Success |
| 4000 0000 0000 0002 | Any 3 digits | Any future date | ❌ Failure |

## Webhook Events

| Event | When It Occurs | Action |
|-------|---|--------|
| `payment.authorized` | Payment authorized (not captured) | Update booking status |
| `payment.failed` | Payment failed | Mark booking as failed |
| `payment.captured` | Payment successfully captured | Confirm booking |
| `refund.created` | Refund initiated | Cancel booking |

## Payment Modal Configuration

```tsx
const options = {
  key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
  amount: Math.round(totalPrice * 100), // In paise
  currency: currency.toUpperCase(),
  name: hotelTitle,
  description: `Booking for ${roomTitle}`,
  order_id: razorpayOrderId,
  handler: async (response) => {
    // Handle successful payment
  },
  prefill: {
    name: userName,
    email: userEmail,
    contact: userPhone
  },
  theme: {
    color: '#3399cc'
  }
};

const razorpay = new window.Razorpay(options);
razorpay.open();
```

## Security Checklist

- [ ] Never expose `RAZORPAY_KEY_SECRET` in frontend
- [ ] Always verify webhook signatures on backend
- [ ] Always verify payment response signatures
- [ ] Use HTTPS for all payment endpoints
- [ ] Implement rate limiting on payment endpoints
- [ ] Handle timeout scenarios gracefully
- [ ] Log security events for audit trail
- [ ] Keep dependencies updated

## Common Errors & Solutions

### "Razorpay is not defined"
- **Cause:** Script not loaded
- **Solution:** Ensure script is loaded before opening modal

### "Signature verification failed"
- **Cause:** Wrong key secret
- **Solution:** Verify RAZORPAY_KEY_SECRET is correct

### "Payment modal not opening"
- **Cause:** Key ID missing or invalid
- **Solution:** Check NEXT_PUBLIC_RAZORPAY_KEY_ID

### "Webhook not delivering"
- **Cause:** URL not accessible
- **Solution:** Ensure HTTPS and firewall allows traffic

## Useful Links

- Dashboard: https://dashboard.razorpay.com
- API Docs: https://razorpay.com/docs/api/
- Test Credentials: https://razorpay.com/docs/payments/payment-gateway/test-credentials/
- Webhook Events: https://razorpay.com/docs/webhooks/
- Support: https://support.razorpay.com

## Development Commands

```bash
# Start dev server
npm run dev

# Check types
npm run type-check

# Run linter
npm run lint

# Build for production
npm build

# View database
npx prisma studio
```

## Testing Payment Flow

1. Navigate to hotel booking page
2. Select dates and rooms
3. Click "Proceed to Payment"
4. Use test card: `4111 1111 1111 1111`
5. Enter any CVV and future expiry
6. Complete payment
7. Verify booking is confirmed
8. Check logs for webhook events

## Key Differences from Stripe

| Feature | Stripe | Razorpay |
|---------|--------|----------|
| **Modal Type** | Embedded | Popup |
| **Libraries** | SDK packages | Script only |
| **Order Type** | PaymentIntent | Order |
| **Payment Methods** | Limited in India | Full support (UPI, etc.) |
| **Setup Complexity** | Medium | Simple |
| **Cost** | 2% + ₹5 per transaction | 2% + ₹5 per transaction |

## File References

- **Component:** `components/hotel/BookingPayment.tsx`
- **API Routes:** `app/api/bookings/[bookingId]/`
- **Webhook Handler:** `app/api/webhooks/stripe/route.ts`
- **Database Schema:** `prisma/schema.prisma`
- **Setup Guide:** `RAZORPAY_SETUP_GUIDE.md`
- **Migration Guide:** `STRIPE_TO_RAZORPAY_MIGRATION.md`

## Next Steps

1. ✅ Add environment variables to `.env.local`
2. ✅ Test payment flow in development
3. ✅ Deploy to production
4. ✅ Switch to live keys
5. ✅ Monitor webhook logs
6. ✅ Setup payment alerts

---

**Last Updated:** 2024
**Migration Status:** Complete ✅
