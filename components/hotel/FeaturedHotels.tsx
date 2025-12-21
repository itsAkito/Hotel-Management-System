// "use client";

// import { useState, useEffect } from "react";
// import Image from "next/image";
// import { useRouter } from "next/navigation";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { ChevronLeft, ChevronRight, MapPin, Heart, Star } from "lucide-react";

// interface Hotel {
//   id: number;
//   title: string;
//   description: string;
//   image: string;
//   country: string;
//   state: string;
//   city: string;
//   gym: boolean;
//   spa: boolean;
//   bar: boolean;
//   laundry: boolean;
//   restaurant: boolean;
//   shopping: boolean;
//   freeParking: boolean;
//   bikeRental: boolean;
//   freeWifi: boolean;
//   movieNights: boolean;
//   swimmingPool: boolean;
//   coffeeShop: boolean;
// }

// interface FeaturedHotelsProps {
//   limit?: number;
//   showTitle?: boolean;
// }

// export default function FeaturedHotels({
//   limit = 6,
//   showTitle = true,
// }: FeaturedHotelsProps) {
//   const router = useRouter();
//   const [hotels, setHotels] = useState<Hotel[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [currentImageIndex, setCurrentImageIndex] = useState<{
//     [key: number]: number;
//   }>({});

//   useEffect(() => {
//     fetchHotels();
//   }, []);

//   const fetchHotels = async () => {
//     try {
//       const response = await fetch("/api/addhotel");
//       if (response.ok) {
//         const data = await response.json();
//         setHotels(data.slice(0, limit));
//         // Initialize image indices
//         const indices: { [key: number]: number } = {};
//         data.slice(0, limit).forEach((hotel: Hotel) => {
//           indices[hotel.id] = 0;
//         });
//         setCurrentImageIndex(indices);
//       }
//     } catch (error) {
//       console.error("Error fetching hotels:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const nextImage = (hotelId: number, e: React.MouseEvent) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setCurrentImageIndex((prev) => ({
//       ...prev,
//       [hotelId]: (prev[hotelId] || 0 + 1) % 3,
//     }));
//   };

//   const prevImage = (hotelId: number, e: React.MouseEvent) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setCurrentImageIndex((prev) => ({
//       ...prev,
//       [hotelId]: (prev[hotelId] || 0) === 0 ? 2 : (prev[hotelId] || 0) - 1,
//     }));
//   };

//   const amenityIcons = [
//     { key: "gym", icon: "🏋️", label: "Gym" },
//     { key: "spa", icon: "🧖", label: "Spa" },
//     { key: "bar", icon: "🍹", label: "Bar" },
//     { key: "restaurant", icon: "🍽️", label: "Restaurant" },
//     { key: "swimmingPool", icon: "🏊", label: "Pool" },
//     { key: "freeWifi", icon: "📶", label: "WiFi" },
//     { key: "freeParking", icon: "🅿️", label: "Parking" },
//     { key: "bikeRental", icon: "🚲", label: "Bike Rental" },
//   ] as const;

//   const fallbackImages = [
//     "/Image/roomImg1.png",
//     "/Image/roomImg2.png",
//     "/Image/roomImg3.png",
//   ];

//   const getHotelImages = (hotel: Hotel) => {
//     if (hotel.image && hotel.image.startsWith("http")) {
//       return [hotel.image, hotel.image, hotel.image];
//     }
//     return fallbackImages;
//   };

//   if (loading) {
//     return (
//       <div className="py-12">
//         <div className="space-y-4 rounded-2xl">
//           {[1, 2, 3].map((i) => (
//             <div
//               key={i}
//               className="h-64 bg-gradient-to-r from-gray-300 to-gray-200 dark:from-slate-600 dark:to-slate-700 rounded-full animate-pulse"
//             />
//           ))}
//         </div>
//       </div>
//     );
//   }

//   return (
//     <section className="py-12">
//       {showTitle && (
//         <div className="mb-10">
//           <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-3">
//             Featured Hotels
//           </h2>
//           <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl">
//             Discover our handpicked selection of premium hotels and accommodations
//           </p>
//         </div>
//       )}

//       {hotels.length === 0 ? (
//         <Card className="border-2 border-dashed border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-900">
//           <CardContent className="pt-12 text-center">
//             <div className="text-5xl mb-4">🏨</div>
//             <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
//               No Hotels Available
//             </h3>
//             <p className="text-gray-600 dark:text-gray-400">
//               Check back soon for amazing hotel deals!
//             </p>
//           </CardContent>
//         </Card>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//           {hotels.map((hotel) => {
//             const images = getHotelImages(hotel);
//             const activeImageIndex = currentImageIndex[hotel.id] || 0;

//             return (
//               <Card
//                 key={hotel.id}
//                 className="overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 cursor-pointer group"
//                 onClick={() => router.push(`/hotel/${hotel.id}`)}
//               >
//                 {/* Image Carousel */}
//                 <div className="relative h-64 w-full bg-gray-200 dark:bg-slate-700 overflow-hidden rounded-2xl">
//                   {/* Main Image */}
//                   <Image
//                     src={images[activeImageIndex]}
//                     alt={hotel.title}
//                     fill
//                     className="rounded object-cover group-hover:scale-110 transition-transform duration-300"
//                   />

//                   {/* Image Navigation Buttons */}
//                   <div className="absolute inset-0 flex items-center justify-between px-3 opacity-0 group-hover:opacity-100 transition-opacity">
//                     <Button
//                       size="sm"
//                       variant="ghost"
//                       onClick={(e) => prevImage(hotel.id, e)}
//                       className="h-10 w-10 p-0 bg-white/80 hover:bg-white dark:bg-slate-700/80 dark:hover:bg-slate-700 rounded-full"
//                     >
//                       <ChevronLeft size={20} />
//                     </Button>
//                     <Button
//                       size="sm"
//                       variant="ghost"
//                       onClick={(e) => nextImage(hotel.id, e)}
//                       className="h-10 w-10 p-0 bg-white/80 hover:bg-white dark:bg-slate-700/80 dark:hover:bg-slate-700 rounded-full"
//                     >
//                       <ChevronRight size={20} />
//                     </Button>
//                   </div>

//                   {/* Image Indicators */}
//                   <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-2">
//                     {images.map((_, index) => (
//                       <div
//                         key={index}
//                         className={`h-2 w-2 rounded-full transition-all ${
//                           index === activeImageIndex
//                             ? "bg-white w-6"
//                             : "bg-white/50"
//                         }`}
//                       />
//                     ))}
//                   </div>

//                   {/* Star Rating Badge */}
//                   <div className="absolute top-3 right-3 bg-white dark:bg-slate-800 px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
//                     <Star size={16} className="fill-yellow-400 text-yellow-400" />
//                     <span className="text-sm font-bold text-gray-900 dark:text-white">
//                       4.5
//                     </span>
//                   </div>

//                   {/* Favorite Button */}
//                   <button
//                     onClick={(e) => {
//                       e.preventDefault();
//                       e.stopPropagation();
//                     }}
//                     className="absolute top-3 left-3 h-10 w-10 rounded-full bg-white/80 hover:bg-white dark:bg-slate-700/80 dark:hover:bg-slate-700 flex items-center justify-center transition-colors"
//                   >
//                     <Heart size={20} className="text-red-500" />
//                   </button>
//                 </div>

//                 {/* Hotel Info */}
//                 <CardHeader className="pb-3">
//                   <CardTitle className="text-xl text-gray-900 dark:text-white line-clamp-2">
//                     {hotel.title}
//                   </CardTitle>
//                   <CardDescription className="flex items-center text-gray-600 dark:text-gray-400">
//                     <MapPin size={16} className="mr-2 flex-shrink-0" />
//                     <span className="line-clamp-1">
//                       {hotel.city}, {hotel.state}
//                     </span>
//                   </CardDescription>
//                 </CardHeader>

//                 <CardContent className="pb-4">
//                   {/* Description */}
//                   <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
//                     {hotel.description}
//                   </p>

//                   {/* Amenities Grid */}
//                   <div className="grid grid-cols-4 gap-2 mb-4">
//                     {amenityIcons
//                       .filter(({ key }) => hotel[key as keyof typeof hotel])
//                       .slice(0, 4)
//                       .map(({ key, icon, label }) => (
//                         <div
//                           key={key}
//                           title={label}
//                           className="text-2xl bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg text-center hover:scale-110 transition-transform"
//                         >
//                           {icon}
//                         </div>
//                       ))}
//                   </div>

//                   {/* Price Range */}
//                   <div className="flex items-center justify-between py-3 border-t border-gray-200 dark:border-slate-700">
//                     <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
//                       Starting from
//                     </span>
//                     <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
//                       $89/night
//                     </span>
//                   </div>
//                 </CardContent>

//                 {/* View Details Button */}
//                 <div className="px-6 pb-6">
//                   <Button
//                     onClick={() => router.push(`/hotel/${hotel.id}`)}
//                     className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-2"
//                   >
//                     View Details
//                   </Button>
//                 </div>
//               </Card>
//             );
//           })}
//         </div>
//       )}
//     </section>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Container from "@/components/Container";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  ChevronLeft, 
  ChevronRight, 
  MapPin, 
  Heart, 
  Star, 
  Wifi, 
  Waves, 
  Dumbbell, 
  Wine, 
  Sparkles,
  ArrowRight
} from "lucide-react";

// --- TYPES ---
interface Room {
  id: number;
  roomPrice: number;
  breakfastPrice: number;
}

interface FeaturedHotel {
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
  swimmingPool: boolean;
  freeWifi: boolean;
  rooms: Room[];
}

// --- CONFIGURATION ---
const MY_CUSTOM_IMAGES = [
  "/Image/roomImg1.png",
  "/Image/roomImg2.png",
  "/Image/roomImg3.png",
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1000&auto=format&fit=crop",
];

export default function FeaturedHotelsSection() {
  const router = useRouter();
  const [hotels, setHotels] = useState<FeaturedHotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState<{ [key: number]: number }>({});
  const [favorites, setFavorites] = useState<number[]>([]);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await fetch("/api/addhotel");
        if (response.ok) {
          const data = await response.json();
          const limited = data.slice(0, 8);
          setHotels(limited);
          const indices: { [key: number]: number } = {};
          limited.forEach((hotel: FeaturedHotel) => { indices[hotel.id] = 0; });
          setCurrentImageIndex(indices);
        }
      } catch (error) {
        console.error("Error fetching hotels:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHotels();
  }, []);

  const getMinPrice = (rooms: Room[]) => {
    if (!rooms || rooms.length === 0) return 0;
    return Math.min(...rooms.map((room) => room.roomPrice));
  };

  const getGalleryForHotel = (hotel: FeaturedHotel) => {
    const images = [];
    if (hotel.image) images.push(hotel.image);
    return [...images, ...MY_CUSTOM_IMAGES];
  };

  const rotateImage = (hotelId: number, direction: "next" | "prev", galleryLength: number) => {
    setCurrentImageIndex((prev) => {
      const current = prev[hotelId] || 0;
      const next = direction === "next" 
        ? (current + 1) % galleryLength 
        : (current - 1 + galleryLength) % galleryLength;
      return { ...prev, [hotelId]: next };
    });
  };

  const toggleFavorite = (hotelId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) =>
      prev.includes(hotelId) ? prev.filter((id) => id !== hotelId) : [...prev, hotelId]
    );
  };

  if (loading) {
    return (
      <section className="py-24 bg-linear-to-b from-slate-50 via-blue-50/30 to-slate-50 dark:from-slate-950 dark:via-slate-900/50 dark:to-slate-950">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-96 bg-linear-to-br from-slate-200 to-slate-300 dark:from-slate-800 dark:to-slate-700 rounded-3xl animate-pulse shadow-lg" />
            ))}
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section className="relative py-24 bg-linear-to-b from-white via-blue-50/20 to-white dark:from-slate-950 dark:via-slate-900/30 dark:to-slate-950 overflow-hidden">
      {/* Animated Background Gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200/20 dark:bg-blue-900/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200/20 dark:bg-purple-900/10 rounded-full blur-3xl animate-pulse" />
      </div>

      <Container>
        {/* Section Header - Enhanced */}
        <div className="mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100/60 dark:bg-blue-900/20 rounded-full border border-blue-200/50 dark:border-blue-800/30">
            <span className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full animate-pulse" />
            <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">Featured Collection</span>
          </div>

          <div className="space-y-3 max-w-3xl">
            <h2 className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-linear-to-r from-slate-900 via-blue-800 to-slate-900 dark:from-white dark:via-blue-300 dark:to-white leading-tight tracking-tight">
              Discover Your Perfect Stay
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 font-light max-w-2xl leading-relaxed">
              Hand-picked luxury hotels and accommodations curated for unforgettable experiences. From beachfront resorts to mountain retreats.
            </p>
          </div>
        </div>

        {hotels.length === 0 ? (
          <div className="py-32 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 dark:bg-blue-900/20 rounded-full mb-6">
              <span className="text-4xl">🏨</span>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              No Hotels Available Yet
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-8">
              Check back soon for amazing properties.
            </p>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8">
              Explore More
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {hotels.map((hotel) => {
              const gallery = getGalleryForHotel(hotel);
              const imageIndex = currentImageIndex[hotel.id] || 0;
              const currentImageUrl = gallery[imageIndex];
              const minPrice = getMinPrice(hotel.rooms);

              return (
                <div
                  key={hotel.id}
                  className="group h-full cursor-pointer"
                  onClick={() => router.push(`/hotel/${hotel.id}`)}
                >
                  <div className="relative h-full rounded-2xl overflow-hidden bg-white dark:bg-slate-900/50 shadow-lg shadow-blue-500/5 dark:shadow-blue-900/10 hover:shadow-2xl hover:shadow-blue-500/15 dark:hover:shadow-blue-900/20 transition-all duration-500 backdrop-blur-xl border border-slate-100/50 dark:border-slate-800/50 flex flex-col">
                    
                    {/* --- IMAGE CAROUSEL AREA --- */}
                    <div className="relative h-72 w-full overflow-hidden bg-slate-200 dark:bg-slate-800">
                      {/* Main Image */}
                      <Image
                        src={currentImageUrl}
                        alt={hotel.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      
                      {/* Premium Gradient Overlay */}
                      <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent opacity-40 group-hover:opacity-50 transition-opacity" />

                      {/* Top-Left Badge - Star Rating */}
                      <div className="absolute top-4 left-4 z-10">
                        <div className="flex items-center gap-2 px-3 py-2 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-full shadow-lg border border-white/20 dark:border-slate-700/50">
                          <div className="flex items-center gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} size={14} className="fill-yellow-400 text-yellow-400" />
                            ))}
                          </div>
                          <span className="text-sm font-bold text-slate-900 dark:text-white">4.8</span>
                        </div>
                      </div>

                      {/* Top-Right Button - Favorite */}
                      <button
                        onClick={(e) => toggleFavorite(hotel.id, e)}
                        className="absolute top-4 right-4 z-10 p-2.5 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md hover:bg-white dark:hover:bg-slate-800 rounded-full shadow-lg border border-white/20 dark:border-slate-700/50 transition-all hover:scale-110 active:scale-95"
                      >
                        <Heart
                          size={20}
                          className={`transition-all ${favorites.includes(hotel.id) ? "fill-red-500 text-red-500" : "text-slate-600 dark:text-slate-300"}`}
                        />
                      </button>

                      {/* Navigation Arrows - Premium Styling */}
                      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                        <button
                          className="p-2.5 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md hover:bg-white dark:hover:bg-slate-800 text-slate-900 dark:text-white shadow-lg hover:scale-110 transition-all active:scale-95 border border-white/20 dark:border-slate-700/50"
                          onClick={(e) => {
                            e.stopPropagation();
                            rotateImage(hotel.id, "prev", gallery.length);
                          }}
                        >
                          <ChevronLeft size={20} />
                        </button>
                        <button
                          className="p-2.5 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md hover:bg-white dark:hover:bg-slate-800 text-slate-900 dark:text-white shadow-lg hover:scale-110 transition-all active:scale-95 border border-white/20 dark:border-slate-700/50"
                          onClick={(e) => {
                            e.stopPropagation();
                            rotateImage(hotel.id, "next", gallery.length);
                          }}
                        >
                          <ChevronRight size={20} />
                        </button>
                      </div>

                      {/* Image Indicator Dots */}
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                        {gallery.slice(0, 5).map((_, idx) => (
                          <button
                            key={idx}
                            onClick={(e) => {
                              e.stopPropagation();
                              setCurrentImageIndex((prev) => ({
                                ...prev,
                                [hotel.id]: idx,
                              }));
                            }}
                            className={`rounded-full transition-all duration-300 backdrop-blur-sm ${
                              idx === imageIndex 
                                ? "w-8 h-2 bg-white shadow-lg" 
                                : "w-2 h-2 bg-white/50 hover:bg-white/75"
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    {/* --- CONTENT AREA --- */}
                    <CardContent className="flex flex-col grow p-6 gap-4">
                      {/* Hotel Name & Location */}
                      <div className="space-y-2">
                        <h3 className="font-bold text-xl text-slate-900 dark:text-white line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-tight">
                          {hotel.title}
                        </h3>
                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 text-sm font-medium">
                          <MapPin size={16} className="shrink-0 text-blue-600 dark:text-blue-400" />
                          <span className="line-clamp-1">{hotel.city}, {hotel.state}</span>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                        {hotel.description}
                      </p>

                      {/* Amenities Section - Modern Icons */}
                      <div className="flex items-center gap-2.5 pt-2">
                        {hotel.freeWifi && (
                          <div className="p-2 bg-linear-to-br from-blue-100 to-blue-50 dark:from-blue-900/30 dark:to-blue-900/10 rounded-lg text-blue-600 dark:text-blue-400 tooltip" title="Free WiFi">
                            <Wifi size={16} />
                          </div>
                        )}
                        {hotel.swimmingPool && (
                          <div className="p-2 bg-linear-to-br from-cyan-100 to-cyan-50 dark:from-cyan-900/30 dark:to-cyan-900/10 rounded-lg text-cyan-600 dark:text-cyan-400 tooltip" title="Swimming Pool">
                            <Waves size={16} />
                          </div>
                        )}
                        {hotel.gym && (
                          <div className="p-2 bg-linear-to-br from-orange-100 to-orange-50 dark:from-orange-900/30 dark:to-orange-900/10 rounded-lg text-orange-600 dark:text-orange-400 tooltip" title="Gym">
                            <Dumbbell size={16} />
                          </div>
                        )}
                        {hotel.bar && (
                          <div className="p-2 bg-linear-to-br from-purple-100 to-purple-50 dark:from-purple-900/30 dark:to-purple-900/10 rounded-lg text-purple-600 dark:text-purple-400 tooltip" title="Bar">
                            <Wine size={16} />
                          </div>
                        )}
                        {hotel.spa && (
                          <div className="p-2 bg-linear-to-br from-pink-100 to-pink-50 dark:from-pink-900/30 dark:to-pink-900/10 rounded-lg text-pink-600 dark:text-pink-400 tooltip" title="Spa">
                            <Sparkles size={16} />
                          </div>
                        )}
                      </div>

                      {/* Price & CTA Section */}
                      <div className="mt-auto pt-5 border-t border-slate-200/50 dark:border-slate-700/50 flex items-center justify-between">
                        <div className="space-y-0.5">
                          <p className="text-xs uppercase tracking-widest font-semibold text-slate-500 dark:text-slate-400">
                            From
                          </p>
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-2xl font-bold text-slate-900 dark:text-white">
                              ${minPrice}
                            </span>
                            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">/night</span>
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/hotel/${hotel.id}`);
                          }}
                          className="p-3 bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-full shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all hover:scale-110 active:scale-95 group/btn flex items-center justify-center"
                        >
                          <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    </CardContent>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Bottom CTA Section */}
        {hotels.length > 0 && (
          <div className="mt-16 text-center">
            <Button
              onClick={() => router.push("/my-hotels")}
              className="bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-3 rounded-full text-lg font-semibold shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all hover:scale-105 active:scale-95"
            >
              View All Properties
              <ArrowRight size={20} className="ml-2" />
            </Button>
          </div>
        )}
      </Container>
    </section>
  );
}