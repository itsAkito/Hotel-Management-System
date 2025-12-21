-- CreateTable "Hotel"
CREATE TABLE "Hotel" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "image" TEXT,
    "country" TEXT,
    "state" TEXT,
    "city" TEXT,
    "locationDescription" TEXT,
    "gym" BOOLEAN NOT NULL DEFAULT false,
    "spa" BOOLEAN NOT NULL DEFAULT false,
    "bar" BOOLEAN NOT NULL DEFAULT false,
    "laundry" BOOLEAN NOT NULL DEFAULT false,
    "restaurant" BOOLEAN NOT NULL DEFAULT false,
    "shopping" BOOLEAN NOT NULL DEFAULT false,
    "freeParking" BOOLEAN NOT NULL DEFAULT false,
    "bikeRental" BOOLEAN NOT NULL DEFAULT false,
    "freeWifi" BOOLEAN NOT NULL DEFAULT false,
    "movieNights" BOOLEAN NOT NULL DEFAULT false,
    "swimmingPool" BOOLEAN NOT NULL DEFAULT false,
    "coffeeShop" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Hotel_pkey" PRIMARY KEY ("id")
);

-- CreateTable "Room"
CREATE TABLE "Room" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "bedCount" INTEGER NOT NULL DEFAULT 0,
    "guestCount" INTEGER NOT NULL DEFAULT 0,
    "bathroomCount" INTEGER NOT NULL DEFAULT 0,
    "kingBed" INTEGER NOT NULL DEFAULT 0,
    "queenBed" INTEGER NOT NULL DEFAULT 0,
    "breakfastPrice" INTEGER NOT NULL DEFAULT 0,
    "roomPrice" INTEGER NOT NULL,
    "roomService" BOOLEAN NOT NULL DEFAULT false,
    "TV" BOOLEAN NOT NULL DEFAULT false,
    "balcony" BOOLEAN NOT NULL DEFAULT false,
    "freeWifi" BOOLEAN NOT NULL DEFAULT false,
    "oceanView" BOOLEAN NOT NULL DEFAULT false,
    "forestView" BOOLEAN NOT NULL DEFAULT false,
    "mountainView" BOOLEAN NOT NULL DEFAULT false,
    "airCondition" BOOLEAN NOT NULL DEFAULT false,
    "soundProofed" BOOLEAN NOT NULL DEFAULT false,
    "image" TEXT,
    "available" BOOLEAN NOT NULL DEFAULT true,
    "hotelId" INTEGER,

    CONSTRAINT "Room_pkey" PRIMARY KEY ("id")
);

-- CreateTable "Booking"
CREATE TABLE "Booking" (
    "id" TEXT NOT NULL,
    "userName" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "hotelOwnerId" TEXT NOT NULL,
    "checkIn" TIMESTAMP(3),
    "checkOut" TIMESTAMP(3),
    "breakfastIncluded" BOOLEAN NOT NULL,
    "currency" TEXT NOT NULL,
    "totalPrice" INTEGER NOT NULL,
    "paymentStatus" BOOLEAN NOT NULL DEFAULT false,
    "paymentIntent" TEXT NOT NULL,
    "bookedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "hotelId" INTEGER,
    "roomId" INTEGER,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Room_hotelId_idx" ON "Room"("hotelId");

-- CreateIndex
CREATE UNIQUE INDEX "Booking_paymentIntent_key" ON "Booking"("paymentIntent");

-- CreateIndex
CREATE INDEX "Booking_hotelId_idx" ON "Booking"("hotelId");

-- CreateIndex
CREATE INDEX "Booking_roomId_idx" ON "Booking"("roomId");

-- AddForeignKey
ALTER TABLE "Room" ADD CONSTRAINT "Room_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "Hotel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "Hotel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
