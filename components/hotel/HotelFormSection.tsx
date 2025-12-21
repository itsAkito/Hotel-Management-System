'use client';

import { useForm } from "react-hook-form";
import { string, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "next/navigation";
import HotelImageUploader from "../HotelImageUploader";
import RoomManagement from "./RoomManagement";

export type HotelWithRooms = {
  id: number;
  userId: string;
  title: string;
  description: string | null;
  image: string | null;
  country: string | null;
  state: string | null;
  city: string | null;
  locationDescription: string | null;
  gym: boolean;
  spa: boolean;
  bar: boolean;
  laundry: boolean;
  restaurant: boolean;
  shopping: boolean;
  freeParking: boolean;
  bikeRental: boolean;
  freeWifi: boolean;
  movieNights: boolean;
  swimmingPool: boolean;
  coffeeShop: boolean;
  createdAt: Date;
  updatedAt: Date;
  rooms: any[];
};

interface HotelFormSectionProps {
  hotel: HotelWithRooms | null;
}

const formSchema = z.object({
  title: z.string()
    .min(3, { message: "Title must be at least 3 characters long" })
    .max(100, { message: "Title must be at most 100 characters long" }),

  description: z.string()
    .min(10, { message: "Description must be at least 10 characters long" })
    .max(500, { message: "Description must be at most 500 characters long" }),

  image: z.union([z.string().url(), z.literal("")]).optional(),

  country: z.string()
    .min(2, { message: "Country is required" }),

  state: z.string()
    .min(2, { message: "State is required" }),

  city: z.string()
    .min(2, { message: "City is required" }),

  locationDescription: z.union([z.string().max(300), z.literal("")]).optional(),

  gym: z.boolean(),
  spa: z.boolean(),
  bar: z.boolean(),
  laundry: z.boolean(),
  restaurant: z.boolean(),
  shopping: z.boolean(),
  freeParking: z.boolean(),
  bikeRental: z.boolean(),
  freeWifi: z.boolean(),
  movieNights: z.boolean(),
  swimmingPool: z.boolean(),
  coffeeShop: z.boolean(),
}).transform((data) => ({
  ...data,
  gym: Boolean(data.gym),
  spa: Boolean(data.spa),
  bar: Boolean(data.bar),
  laundry: Boolean(data.laundry),
  restaurant: Boolean(data.restaurant),
  shopping: Boolean(data.shopping),
  freeParking: Boolean(data.freeParking),
  bikeRental: Boolean(data.bikeRental),
  freeWifi: Boolean(data.freeWifi),
  movieNights: Boolean(data.movieNights),
  swimmingPool: Boolean(data.swimmingPool),
  coffeeShop: Boolean(data.coffeeShop),
}));

type FormData = z.infer<typeof formSchema>;

const amenities = [
  { id: "gym", label: "Gym", description: "Fitness center" },
  { id: "spa", label: "Spa", description: "Spa services" },
  { id: "bar", label: "Bar", description: "Bar service" },
  { id: "laundry", label: "Laundry", description: "Laundry service" },
  { id: "restaurant", label: "Restaurant", description: "On-site restaurant" },
  { id: "shopping", label: "Shopping", description: "Shopping facilities" },
  { id: "freeParking", label: "Free Parking", description: "Complimentary parking" },
  { id: "bikeRental", label: "Bike Rental", description: "Bike rental service" },
  { id: "freeWifi", label: "Free WiFi", description: "WiFi access" },
  { id: "movieNights", label: "Movie Nights", description: "Movie screening events" },
  { id: "swimmingPool", label: "Swimming Pool", description: "Pool facilities" },
  { id: "coffeeShop", label: "Coffee Shop", description: "On-site coffee shop" },
];

const HotelFormSection = ({ hotel }: HotelFormSectionProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: hotel?.title ?? "",
      description: hotel?.description ?? "",
      image: hotel?.image ?? "",
      country: hotel?.country ?? "",
      state: hotel?.state ?? "",
      city: hotel?.city ?? "",
      locationDescription: hotel?.locationDescription ?? "",
      gym: hotel?.gym ?? false,
      spa: hotel?.spa ?? false,
      bar: hotel?.bar ?? false,
      laundry: hotel?.laundry ?? false,
      restaurant: hotel?.restaurant ?? false,
      shopping: hotel?.shopping ?? false,
      freeParking: hotel?.freeParking ?? false,
      bikeRental: hotel?.bikeRental ?? false,
      freeWifi: hotel?.freeWifi ?? false,
      movieNights: hotel?.movieNights ?? false,
      swimmingPool: hotel?.swimmingPool ?? false,
      coffeeShop: hotel?.coffeeShop ?? false,
    },
  });

  async function onSubmit(data: FormData) {
    try {
      setIsLoading(true);
      setError(null);

      const url = hotel ? `/api/addhotel/${hotel.id}` : "/api/addhotel";
      const method = hotel ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save hotel");
      }

      const result = await response.json();
      router.push(`/hotel/${result.id}`);
      router.refresh();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
      console.error("Form submission error:", err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6 min-h-screen bg-white dark:bg-slate-950 transition-colors">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 text-gray-900 dark:text-white">
          {hotel ? "Edit Hotel" : "Add New Hotel"}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {hotel
            ? "Update your hotel information"
            : "Create a new hotel listing"}
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
          <p className="text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Basic Information Section */}
          <div className="space-y-6 pb-8 border-b border-gray-200 dark:border-slate-700">
            <div>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Basic Information</h2>
            </div>

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hotel Name *</FormLabel>
                  <FormDescription>
                    Enter the name of your hotel (3-100 characters)
                  </FormDescription>
                  <FormControl>
                    <Input
                      placeholder="e.g., Beachfront Paradise Hotel"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description *</FormLabel>
                  <FormDescription>
                    Describe your hotel (10-500 characters)
                  </FormDescription>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your hotel, its features, and what makes it special..."
                      {...field}
                      disabled={isLoading}
                      rows={5}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <HotelImageUploader onUploadAction={(url: string) => field.onChange(url)} />
              )}
            />
          </div>

          {/* Location Section */}
          <div className="space-y-6 pb-8 border-b border-gray-200 dark:border-slate-700">
            <div>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Location</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., USA"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State/Province *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., California"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Los Angeles"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="locationDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location Description</FormLabel>
                  <FormDescription>
                    Describe the location, landmarks, or nearby attractions (optional)
                  </FormDescription>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., Located near downtown, walking distance to the beach..."
                      {...field}
                      disabled={isLoading}
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Amenities Section */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Amenities</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Select all the amenities available at your hotel
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {amenities.map((amenity) => (
                <FormField
                  key={amenity.id}
                  control={form.control}
                  name={amenity.id as keyof FormData}
                  render={({ field }) => (
                    <FormItem className="flex items-start space-x-3 space-y-0 rounded-md border border-gray-200 dark:border-slate-700 p-4 bg-gray-50 dark:bg-slate-800">
                      <FormControl>
                        <Checkbox
                          checked={field.value as boolean}
                          onCheckedChange={field.onChange}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-base font-medium cursor-pointer text-gray-900 dark:text-white">
                          {amenity.label}
                        </FormLabel>
                        <FormDescription className="text-gray-600 dark:text-gray-400">
                          {amenity.description}
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              disabled={isLoading}
              className="px-8 bg-blue-600 hover:bg-blue-700 text-white"
              size="lg"
            >
              {isLoading ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  {hotel ? "Updating..." : "Creating..."}
                </>
              ) : (
                hotel ? "Update Hotel" : "Create Hotel"
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isLoading}
              size="lg"
              className="dark:bg-slate-800 dark:border-slate-700 dark:text-white dark:hover:bg-slate-700"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Form>

      {/* Room Management Section - Only show if hotel exists */}
      {hotel && (
        <div className="mt-12 pt-12 border-t">
          <RoomManagement 
            hotelId={hotel.id} 
            rooms={hotel.rooms || []}
          />
        </div>
      )}
    </div >
  );
};

export default HotelFormSection;
