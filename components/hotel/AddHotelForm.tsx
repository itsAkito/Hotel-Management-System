'use client';
import { Hotel, Room } from "@/app/generated/prisma";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Checkbox } from "../ui/checkbox";
import HotelImageUploader from "../HotelImageUploader";
import LocationSelector from "../location/LocationSelector";
import { useState } from "react";

export type HotelWithRooms = Hotel & {
  rooms: Room[];
};

interface AddFormProps {
  hotel: HotelWithRooms | null;
}

const formSchema = z.object({
  title: z.string()
    .min(3, { message: "Title must be at least 3 characters long" })
    .max(100, { message: "Title must be at most 100 characters long" }),

  description: z.string()
    .min(10, { message: "Description must be at least 10 characters long" })
    .max(500, { message: "Description must be at most 500 characters long" }),

  image: z.string().url({ message: "Image must be a valid URL" }),

  country: z.string().min(2, { message: "Country is required" }),
  state: z.string().min(2, { message: "State is required" }),
  city: z.string().min(2, { message: "City is required" }),
  locationDescription: z.string().optional(),

  gym: z.boolean().optional().default(false),
  spa: z.boolean().optional().default(false),
  bar: z.boolean().optional().default(false),
  laundry: z.boolean().optional().default(false),
  restaurant: z.boolean().optional().default(false),
  shopping: z.boolean().optional().default(false),
  freeParking: z.boolean().optional().default(false),
  bikeRental: z.boolean().optional().default(false),
  freeWifi: z.boolean().optional().default(false),
  movieNights: z.boolean().optional().default(false),
  swimmingPool: z.boolean().optional().default(false),
  coffeeShop: z.boolean().optional().default(false),
});

type FormData = z.infer<typeof formSchema>;

const AddHotelForm = ({ hotel }: AddFormProps) => {
  const [imageUrl, setImageUrl] = useState(hotel?.image ?? "");
  
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

  const onSubmit = async (data: FormData) => {
    try {
      const response = await fetch(`/api/${hotel ? `hotel/${hotel.id}` : 'addhotel'}`, {
        method: hotel ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, image: imageUrl || data.image }),
      });
      
      if (response.ok) {
        alert(hotel ? 'Hotel updated!' : 'Hotel created!');
      } else {
        alert('Failed to save hotel');
      }
    } catch (error) {
      console.error('Error saving hotel:', error);
      alert('Error saving hotel');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hotel Title</FormLabel>
              <FormDescription>
                Enter the name of your hotel.
              </FormDescription>
              <FormControl>
                <Input placeholder="Beach Hotel" {...field} />
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
              <FormLabel>Description</FormLabel>
              <FormDescription>
                Describe your hotel in detail.
              </FormDescription>
              <FormControl>
                <Textarea placeholder="A beautiful beachfront hotel..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <label className="text-sm font-medium">Hotel Image</label>
          <HotelImageUploader onUploadAction={(url) => {
            setImageUrl(url);
            form.setValue('image', url);
          }} />
          {imageUrl && (
            <div className="mt-2 relative w-full h-48">
              <img 
                src={imageUrl} 
                alt="Hotel preview"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          )}
        </div>

        <LocationSelector 
          onLocationChange={(location) => {
            form.setValue('country', location.country);
            form.setValue('state', location.state);
            form.setValue('city', location.city);
          }}
          defaultCountry={hotel?.country}
          defaultState={hotel?.state}
          defaultCity={hotel?.city}
        />

        <FormField
          control={form.control}
          name="locationDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location Description</FormLabel>
              <FormDescription>
                Describe the location and nearby attractions.
              </FormDescription>
              <FormControl>
                <Textarea placeholder="Located near the beach..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <label className="text-lg font-semibold">Hotel Amenities</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {['gym', 'spa', 'bar', 'laundry', 'restaurant', 'shopping', 'freeParking', 'bikeRental', 'freeWifi', 'movieNights', 'swimmingPool', 'coffeeShop'].map((amenity) => (
              <FormField
                key={amenity}
                control={form.control}
                name={amenity as any}
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="capitalize text-sm">
                      {amenity.replace(/([A-Z])/g, ' $1').trim()}
                    </FormLabel>
                  </FormItem>
                )}
              />
            ))}
          </div>
        </div>

        <Button type="submit" className="w-full">{hotel ? 'Update Hotel' : 'Create Hotel'}</Button>
      </form>
    </Form>
  );
};

export default AddHotelForm;