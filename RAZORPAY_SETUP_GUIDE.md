# Razorpay Setup Guide

## Overview

This guide will help you set up Razorpay payment integration for the Hotel Management System. Razorpay provides a comprehensive payment solution supporting multiple payment methods including credit/debit cards, net banking, digital wallets, and UPI.

## Prerequisites

- Active Razorpay account (https://razorpay.com)
- Node.js 18+ environment
- API knowledge of REST endpoints

---

## Step-by-Step Setup

### 1. Create Razorpay Account

1. Go to [Razorpay Dashboard](https://dashboard.razorpay.com)
2. Sign up for a new account
3. Complete KYC verification (required for live payments)
4. Verify your email and phone number

### 2. Get API Keys

#### Retrieve Your Keys

1. Log in to Razorpay Dashboard
2. Navigate to **Settings → API Keys**
3. You'll see two keys:
   - **Key ID** (Public key) - Use in frontend
   - **Key Secret** (Private key) - Keep secure in backend

#### Key Format

```
Key ID:     rzp_test_xxxxxxxxxxxxxxxx (Test mode)
Key Secret: (Your secret key)
```

### 3. Configure Environment Variables

Create `.env.local` file in your project root:

```env
# Razorpay Payment Gateway
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_secret_key_here
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret_here
```

### 4. Setup Webhooks

Webhooks allow Razorpay to notify your server about payment events in real-time.

#### Steps to Configure

1. Go to **Settings → Webhooks**
2. Click **Add New Webhook Endpoint**
3. Enter webhook URL: `https://yourdomain.com/api/webhooks/stripe`
4. Select events to listen for:
   - `payment.authorized`
   - `payment.failed`
   - `payment.captured`
   - `refund.created`
5. Click **Create Webhook**
6. Copy the **Webhook Secret** (starts with `whsec_`)
7. Add to `.env.local` as `RAZORPAY_WEBHOOK_SECRET`

#### Webhook Events Explained

| Event | Description |
|-------|-------------|
| `payment.authorized` | Payment has been authorized (not yet captured) |
| `payment.failed` | Payment attempt failed |
| `payment.captured` | Payment has been captured/completed |
| `refund.created` | Refund has been initiated |

### 5. Test Credentials

For development and testing, Razorpay provides test mode credentials:

```
Key ID:     rzp_test_[automatically generated]
Key Secret: sk_test_[automatically generated]
```

#### Test Payment Details

Use these credentials for testing payments:

**Successful Transactions:**
- Card Number: `4111 1111 1111 1111`
- CVV: Any 3 digits
- Expiry: Any future date

**Failed Transactions:**
- Card Number: `4000 0000 0000 0002`
- CVV: Any 3 digits
- Expiry: Any future date

### 6. Integration Verification

#### Test Payment Flow

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to a hotel booking page
3. Complete the booking form
4. Click "Proceed to Payment"
5. Use test card details to complete payment
6. Verify booking is confirmed in database

#### Check Logs

Monitor your webhooks and payment events:

1. Go to Razorpay Dashboard
2. Navigate to **Payments** to see transaction history
3. Go to **Webhooks** to see webhook delivery status
4. Check server logs for webhook processing

---

## Payment Flow Diagram

```
┌─────────────────┐
│   User Browser  │
└────────┬────────┘
         │
         ├── 1. Select booking dates and room
         │
         ▼
┌─────────────────────────────┐
│ Frontend (BookingPayment)   │
└────────┬────────────────────┘
         │
         ├── 2. Create booking (POST /api/bookings)
         │
         ▼
┌──────────────────────────────┐
│ Backend - Create Order       │
│ (Razorpay API Call)          │
└────────┬─────────────────────┘
         │
         ├── 3. Receive Order ID
         │
         ▼
┌──────────────────────────────┐
│ Razorpay Checkout Modal      │
│ (Payment Gateway)            │
└────────┬─────────────────────┘
         │
         ├── 4. User enters payment details
         │
         ▼
┌──────────────────────────────┐
│ Razorpay Processes Payment   │
└────────┬─────────────────────┘
         │
         ├── 5. Payment response (signed)
         │
         ▼
┌──────────────────────────────┐
│ Frontend Verifies Signature  │
│ (POST /api/bookings/verify)  │
└────────┬─────────────────────┘
         │
         ├── 6. Backend verifies signature
         │
         ▼
┌──────────────────────────────┐
│ Database Update              │
│ (Payment confirmed)          │
└──────────────────────────────┘
         │
         ├── (Optional) Webhook confirmation
         │
         ▼
┌──────────────────────────────┐
│ User Redirected to           │
│ Confirmation Page            │
└──────────────────────────────┘
```

---

## Production Checklist

### Before Going Live

- [ ] Switch to Live API Keys (prefix: `rzp_live_`)
- [ ] Test complete payment flow in production
- [ ] Setup SSL/TLS certificate on domain
- [ ] Configure production webhook URL
- [ ] Update `.env.local` with live keys
- [ ] Test refund functionality
- [ ] Monitor webhook delivery logs
- [ ] Setup payment alerts/notifications
- [ ] Test error scenarios

### Live API Keys

Once your account is fully verified:

1. Go to **Settings → API Keys**
2. Switch to **Live Mode** (toggle at top)
3. Copy your Live Keys:
   - Key ID: `rzp_live_xxxxxxxxxxxxxxxx`
   - Key Secret: (Your live secret)
4. Update `.env.local` or `.env.production`

---

## Available Payment Methods

Razorpay supports multiple payment methods based on your account configuration:

### Card Payments
- Visa, Mastercard, American Express
- Domestic and international cards
- 3D Secure for enhanced security

### Net Banking
- All major Indian banks
- ICICI, HDFC, AXIS, SBI, and 50+ more
- Direct bank transfers

### Digital Wallets
- Apple Pay
- Google Pay
- Samsung Pay
- PhonePe
- PayTM
- Amazon Pay
- Airtel Pay

### Emerging Payment Methods
- UPI (Unified Payments Interface)
- EMI options (EMI, BNow, LazyPay, Zestmoney)
- Cryptocurrency (if enabled)

---

## Troubleshooting

### Issue: "Razorpay key ID is invalid"

**Solution:**
- Verify `NEXT_PUBLIC_RAZORPAY_KEY_ID` is correctly set
- Check it's not expired or revoked
- Ensure using test keys for development

### Issue: "Signature verification failed"

**Solution:**
- Verify `RAZORPAY_KEY_SECRET` is correct
- Check webhook secret matches in dashboard
- Ensure using same keys for verification

### Issue: "Webhook not delivering"

**Solution:**
- Verify webhook URL is publicly accessible
- Check firewall/security group allows HTTPS
- Review webhook delivery logs in dashboard
- Ensure endpoint returns 200 status

### Issue: "Payment modal not opening"

**Solution:**
- Verify Razorpay script is loaded: `<script src="https://checkout.razorpay.com/v1/checkout.js"></script>`
- Check browser console for errors
- Verify `NEXT_PUBLIC_RAZORPAY_KEY_ID` is in browser environment
- Clear browser cache

---

## API Endpoints

### POST /api/bookings
Create booking and Razorpay order

**Request:**
```json
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
```

**Response:**
```json
{
  "booking": { ... },
  "razorpayOrderId": "order_xxxxx"
}
```

### GET /api/bookings/[bookingId]/razorpay-order
Retrieve Razorpay order ID for payment

**Response:**
```json
{
  "razorpayOrderId": "order_xxxxx"
}
```

### POST /api/bookings/[bookingId]/verify-payment
Verify payment signature and confirm booking

**Request:**
```json
{
  "razorpay_order_id": "order_xxxxx",
  "razorpay_payment_id": "pay_xxxxx",
  "razorpay_signature": "signature_xxxxx"
}
```

**Response:**
```json
{
  "success": true,
  "booking": { ... }
}
```

---

## Support Resources

- **Official Docs:** https://razorpay.com/docs
- **API Reference:** https://razorpay.com/docs/api/
- **Testing Guide:** https://razorpay.com/docs/payments/payment-gateway/test-credentials/
- **Webhook Events:** https://razorpay.com/docs/webhooks/
- **Support Email:** support@razorpay.com
- **Support Portal:** https://support.razorpay.com

---

## Security Best Practices

1. **Keep Keys Secure**
   - Never commit keys to version control
   - Use `.env.local` for local development
   - Use secure secrets management in production

2. **Verify Signatures**
   - Always verify webhook signatures
   - Always verify payment response signatures
   - Use correct key secret for verification

3. **Use HTTPS**
   - Only access Razorpay on secure connections
   - Ensure webhook endpoints use HTTPS

4. **Error Handling**
   - Don't expose sensitive error details to clients
   - Log errors securely for debugging
   - Handle timeout scenarios gracefully

5. **Rate Limiting**
   - Implement rate limiting on payment endpoints
   - Prevent payment duplication
   - Handle concurrent requests safely

---

## FAQ

**Q: Can I test with live payments?**
A: No, test mode is isolated from live mode. Use test credentials for testing.

**Q: How long does payment settlement take?**
A: Typically 2-3 business days depending on your bank.

**Q: What happens if a webhook fails?**
A: Razorpay retries webhooks with exponential backoff. You can manually check payment status via API.

**Q: Can I offer EMI options?**
A: Yes, enable EMI in your Razorpay dashboard under **Settings → Payment Methods**.

**Q: How do I handle refunds?**
A: Refunds are processed via API or dashboard. Configure refund settings in dashboard.
