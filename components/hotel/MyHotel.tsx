"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Container from "@/components/Container";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Edit,
  Trash2,
  MapPin,
  Users,
  DollarSign,
  MoreVertical,
  Plus,
  Loader,
  CheckCircle,
  Clock,
} from "lucide-react";

interface Hotel {
  id: number;
  title: string;
  description: string;
  image: string;
  country: string;
  state: string;
  city: string;
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
  rooms: any[];
}

export default function MyHotel() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState<number | null>(null);
  const [selectedAmenities, setSelectedAmenities] = useState<Set<number>>(
    new Set()
  );

  useEffect(() => {
    if (!isLoaded) return;

    if (!user) {
      router.push("/sign-in");
      return;
    }

    fetchMyHotels();
  }, [isLoaded, user]);

  const fetchMyHotels = async () => {
    try {
      const response = await fetch("/api/addhotel");
      if (response.ok) {
        const data = await response.json();
        setHotels(data);
      }
    } catch (error) {
      console.error("Error fetching hotels:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (hotelId: number) => {
    setDeleting(hotelId);
    try {
      const response = await fetch(`/api/addhotel/${hotelId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setHotels(hotels.filter((h) => h.id !== hotelId));
        setShowDeleteDialog(null);
      } else {
        alert("Failed to delete hotel");
      }
    } catch (error) {
      console.error("Error deleting hotel:", error);
      alert("Error deleting hotel");
    } finally {
      setDeleting(null);
    }
  };

  const amenityIcons = [
    { key: "gym", icon: "🏋️", label: "Gym" },
    { key: "spa", icon: "🧖", label: "Spa" },
    { key: "bar", icon: "🍹", label: "Bar" },
    { key: "laundry", icon: "🧺", label: "Laundry" },
    { key: "restaurant", icon: "🍽️", label: "Restaurant" },
    { key: "shopping", icon: "🛍️", label: "Shopping" },
    { key: "freeParking", icon: "🅿️", label: "Parking" },
    { key: "bikeRental", icon: "🚲", label: "Bike Rental" },
    { key: "freeWifi", icon: "📶", label: "WiFi" },
    { key: "movieNights", icon: "🎬", label: "Movies" },
    { key: "swimmingPool", icon: "🏊", label: "Pool" },
    { key: "coffeeShop", icon: "☕", label: "Coffee" },
  ] as const;

  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center h-screen bg-white dark:bg-slate-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors py-12">
      <Container>
        {/* Header Section */}
        <div className="mb-12">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-3">
                My Hotels
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                Manage and view all your hotel listings
              </p>
            </div>
            <Button
              onClick={() => router.push("/hotel/new")}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 h-auto"
            >
              <Plus size={20} className="mr-2" />
              Add New Hotel
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">
                Loading your hotels...
              </p>
            </div>
          </div>
        ) : hotels.length === 0 ? (
          <Card className="border-2 border-dashed border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-900">
            <CardContent className="pt-12 text-center">
              <div className="text-5xl mb-4">🏨</div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                No Hotels Yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                You haven't added any hotels yet. Create your first listing to get started!
              </p>
              <Button
                onClick={() => router.push("/hotel/new")}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus size={20} className="mr-2" />
                Create Your First Hotel
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {hotels.map((hotel) => (
              <Card
                key={hotel.id}
                className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              >
                {/* Hotel Image */}
                <div className="relative h-56 w-full bg-gray-200 dark:bg-slate-700 overflow-hidden group">
                  {hotel.image ? (
                    <Image
                      src={hotel.image}
                      alt={hotel.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                      priority={false}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-gray-300 to-gray-400 dark:from-slate-600 dark:to-slate-700">
                      <span className="text-gray-500 dark:text-gray-300 text-center px-4 font-semibold">
                        📷 No Image
                      </span>
                    </div>
                  )}
                  {/* Action Menu */}
                  <div className="absolute top-3 right-3">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-9 w-9 p-0 bg-white dark:bg-slate-700 hover:bg-gray-100 dark:hover:bg-slate-600 rounded-full shadow-md"
                        >
                          <MoreVertical size={18} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => router.push(`/hotel/${hotel.id}`)}
                          className="cursor-pointer"
                        >
                          <Edit size={16} className="mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setShowDeleteDialog(hotel.id)}
                          className="cursor-pointer text-red-600"
                        >
                          <Trash2 size={16} className="mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {/* Hotel Info */}
                <CardHeader className="pb-3">
                  <CardTitle className="text-xl text-gray-900 dark:text-white line-clamp-2">
                    {hotel.title}
                  </CardTitle>
                  <CardDescription className="flex items-center text-gray-600 dark:text-gray-400">
                    <MapPin size={16} className="mr-2 shrink-0" />
                    <span className="line-clamp-1">
                      {hotel.city}, {hotel.state}, {hotel.country}
                    </span>
                  </CardDescription>
                </CardHeader>

                <CardContent className="pb-4">
                  {/* Description */}
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                    {hotel.description}
                  </p>

                  {/* Amenities */}
                  <div className="mb-4">
                    <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase">
                      Amenities
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {amenityIcons.map(({ key, icon }) => (
                        hotel[key as keyof typeof hotel] && (
                          <div
                            key={key}
                            title={key}
                            className="text-lg bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded-md"
                          >
                            {icon}
                          </div>
                        )
                      ))}
                    </div>
                  </div>

                  {/* Rooms Count */}
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <Users size={16} className="mr-2" />
                    <span>
                      {hotel.rooms?.length || 0} room
                      {hotel.rooms?.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                </CardContent>

                {/* Actions */}
                <CardFooter className="gap-2">
                  <Button
                    onClick={() => router.push(`/hotel/${hotel.id}`)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Edit size={16} className="mr-2" />
                    Edit
                  </Button>
                  <Button
                    onClick={() => setShowDeleteDialog(hotel.id)}
                    variant="destructive"
                    className="bg-red-600 hover:bg-red-700"
                  >
                    <Trash2 size={16} />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        <AlertDialog
          open={showDeleteDialog !== null}
          onOpenChange={() => setShowDeleteDialog(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Hotel</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this hotel? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="flex justify-end gap-3 mt-4">
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => showDeleteDialog && handleDelete(showDeleteDialog)}
                disabled={deleting !== null}
                className="bg-red-600 hover:bg-red-700"
              >
                {deleting ? "Deleting..." : "Delete"}
              </AlertDialogAction>
            </div>
          </AlertDialogContent>
        </AlertDialog>
      </Container>
    </div>
  );
}
