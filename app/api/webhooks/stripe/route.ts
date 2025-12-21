import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-11-20',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature || !webhookSecret) {
      return NextResponse.json(
        { error: 'Missing signature or webhook secret' },
        { status: 400 }
      );
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (error: any) {
      console.error('Webhook signature verification failed:', error.message);
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    const prismadb = (await import('@/lib/prismadb')).default;

    // Handle different event types
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        
        // Update booking status to confirmed
        await prismadb.booking.update({
          where: { paymentIntent: paymentIntent.id },
          data: {
            paymentStatus: true,
            status: 'confirmed',
          },
        });

        console.log('Payment succeeded:', paymentIntent.id);
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        
        // Update booking status to failed
        await prismadb.booking.update({
          where: { paymentIntent: paymentIntent.id },
          data: {
            paymentStatus: false,
            status: 'failed',
          },
        });

        console.log('Payment failed:', paymentIntent.id);
        break;
      }

      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge;
        
        if (charge.payment_intent) {
          // Update booking status to cancelled
          await prismadb.booking.update({
            where: { paymentIntent: charge.payment_intent.toString() },
            data: {
              paymentStatus: false,
              status: 'cancelled',
            },
          });

          console.log('Booking refunded:', charge.payment_intent);
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
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
