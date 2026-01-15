import { NextRequest, NextResponse } from "next/server";
import { prismadb } from "@/lib/prismadb";

// GET all invoices for a hotel
export async function GET(req: NextRequest) {
  try {
    const hotelId = req.nextUrl.searchParams.get("hotelId");
    const bookingId = req.nextUrl.searchParams.get("bookingId");
    const status = req.nextUrl.searchParams.get("status");

    const where: any = {};

    if (hotelId) {
      where.hotelId = parseInt(hotelId);
    }

    if (bookingId) {
      where.bookingId = bookingId;
    }

    if (status) {
      where.status = status;
    }

    const invoices = await prismadb.invoice.findMany({
      where,
      include: {
        booking: {
          include: {
            guestProfile: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(invoices);
  } catch (error: any) {
    console.error("[INVOICE-GET]", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Create or update invoice
export async function POST(req: NextRequest) {
  try {
    const {
      bookingId,
      hotelId,
      invoiceNumber,
      roomCharges,
      breakfastCharges,
      serviceCharges,
      taxAmount,
      discountAmount,
      paymentMethod,
      paymentDate,
      paidAmount,
      status,
      notes,
    } = await req.json();

    if (!bookingId || !hotelId || !invoiceNumber) {
      return NextResponse.json(
        { error: "Booking ID, Hotel ID, and invoice number are required" },
        { status: 400 }
      );
    }

    const totalAmount =
      (roomCharges || 0) +
      (breakfastCharges || 0) +
      (serviceCharges || 0) +
      (taxAmount || 0) -
      (discountAmount || 0);

    const balanceDue = totalAmount - (paidAmount || 0);

    const existingInvoice = await prismadb.invoice.findUnique({
      where: { invoiceNumber },
    });

    let invoice;

    if (existingInvoice) {
      invoice = await prismadb.invoice.update({
        where: { invoiceNumber },
        data: {
          roomCharges: roomCharges || 0,
          breakfastCharges: breakfastCharges || 0,
          serviceCharges: serviceCharges || 0,
          taxAmount: taxAmount || 0,
          discountAmount: discountAmount || 0,
          totalAmount,
          paymentMethod,
          paymentDate: paymentDate ? new Date(paymentDate) : null,
          paidAmount: paidAmount || 0,
          balanceDue,
          status: status || "pending",
          notes,
        },
      });
    } else {
      invoice = await prismadb.invoice.create({
        data: {
          bookingId,
          hotelId,
          invoiceNumber,
          roomCharges: roomCharges || 0,
          breakfastCharges: breakfastCharges || 0,
          serviceCharges: serviceCharges || 0,
          taxAmount: taxAmount || 0,
          discountAmount: discountAmount || 0,
          totalAmount,
          paymentMethod: paymentMethod || null,
          paymentDate: paymentDate ? new Date(paymentDate) : null,
          paidAmount: paidAmount || 0,
          balanceDue,
          status: status || "pending",
          notes: notes || null,
        },
      });
    }

    return NextResponse.json(invoice, { status: 201 });
  } catch (error: any) {
    console.error("[INVOICE-POST]", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
