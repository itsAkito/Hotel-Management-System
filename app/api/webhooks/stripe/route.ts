import { NextRequest, NextResponse } from 'next/server';
import prismadb from '@/lib/prismadb';
import crypto from 'crypto';

const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || '';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('x-razorpay-signature');

    if (!signature || !webhookSecret) {
      return NextResponse.json(
        { error: 'Missing signature or webhook secret' },
        { status: 400 }
      );
    }

    // Verify Razorpay signature
    const hash = crypto
      .createHmac('sha256', webhookSecret)
      .update(body)
      .digest('hex');

    if (hash !== signature) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    const event = JSON.parse(body);

    // Handle different Razorpay event types
    switch (event.event) {
      case 'payment.authorized': {
        const paymentData = event.payload.payment.entity;
        
        // Find booking by razorpay order ID
        const booking = await prismadb.booking.findFirst({
          where: {
            paymentIntent: paymentData.order_id,
          },
        });

        if (booking) {
          await prismadb.booking.update({
            where: { id: booking.id },
            data: {
              paymentStatus: true,
              status: 'confirmed',
              paymentIntent: paymentData.id,
            },
          });
          console.log('Payment authorized:', paymentData.id);
        }
        break;
      }

      case 'payment.failed': {
        const paymentData = event.payload.payment.entity;
        
        // Find booking by razorpay order ID
        const booking = await prismadb.booking.findFirst({
          where: {
            paymentIntent: paymentData.order_id,
          },
        });

        if (booking) {
          await prismadb.booking.update({
            where: { id: booking.id },
            data: {
              paymentStatus: false,
              status: 'failed',
            },
          });
          console.log('Payment failed:', paymentData.id);
        }
        break;
      }

      case 'payment.captured': {
        const paymentData = event.payload.payment.entity;
        
        // Find booking by razorpay payment ID
        const booking = await prismadb.booking.findFirst({
          where: {
            paymentIntent: paymentData.id,
          },
        });

        if (booking) {
          await prismadb.booking.update({
            where: { id: booking.id },
            data: {
              paymentStatus: true,
              status: 'confirmed',
            },
          });
          console.log('Payment captured:', paymentData.id);
        }
        break;
      }

      case 'refund.created': {
        const refundData = event.payload.refund.entity;
        
        // Find booking by payment ID
        const booking = await prismadb.booking.findFirst({
          where: {
            paymentIntent: refundData.payment_id,
          },
        });

        if (booking) {
          await prismadb.booking.update({
            where: { id: booking.id },
            data: {
              paymentStatus: false,
              status: 'cancelled',
            },
          });
          console.log('Booking refunded:', refundData.payment_id);
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.event}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
