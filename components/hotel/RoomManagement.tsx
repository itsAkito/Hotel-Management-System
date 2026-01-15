'use client';

import { Room } from "@/app/generated/prisma";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Plus } from "lucide-react";

interface RoomManagementProps {
  hotelId: number;
  rooms: Room[];
  onRoomsChange?: (rooms: Room[]) => void;
}

const roomSchema = z.object({
  title: z.string().min(2, "Room title is required"),
  description: z.string().optional(),
  bedCount: z.number().min(1, "Must have at least 1 bed"),
  guestCount: z.number().min(1, "Must accommodate at least 1 guest"),
  bathroomCount: z.number().min(1, "Must have at least 1 bathroom"),
  kingBed: z.number().min(0).default(0),
  queenBed: z.number().min(0).default(0),
  roomPrice: z.number().min(1, "Room price is required"),
  breakfastPrice: z.number().min(0).default(0),
  roomService: z.boolean().default(false),
  TV: z.boolean().default(false),
  balcony: z.boolean().default(false),
  freeWifi: z.boolean().default(false),
  oceanView: z.boolean().default(false),
  forestView: z.boolean().default(false),
  mountainView: z.boolean().default(false),
  airCondition: z.boolean().default(false),
  soundProofed: z.boolean().default(false),
  available: z.boolean().default(true),
});

type RoomFormData = z.infer<typeof roomSchema>;

export default function RoomManagement({ hotelId, rooms, onRoomsChange }: RoomManagementProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [roomsList, setRoomsList] = useState<Room[]>(rooms);

  const form = useForm<RoomFormData>({
    resolver: zodResolver(roomSchema),
    defaultValues: {
      title: "",
      bedCount: 1,
      guestCount: 1,
      bathroomCount: 1,
      kingBed: 0,
      queenBed: 0,
      roomPrice: 100,
      breakfastPrice: 0,
      roomService: false,
      TV: false,
      balcony: false,
      freeWifi: false,
      oceanView: false,
      forestView: false,
      mountainView: false,
      airCondition: false,
      soundProofed: false,
      available: true,
    },
  });

  const onSubmit = async (data: RoomFormData) => {
    try {
      const endpoint = editingRoom 
        ? `/api/hotel/${hotelId}/rooms/${editingRoom.id}`
        : `/api/hotel/${hotelId}/rooms`;
      
      const method = editingRoom ? 'PUT' : 'POST';
      
      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        
        if (editingRoom) {
          setRoomsList(roomsList.map(r => r.id === editingRoom.id ? result : r));
        } else {
          setRoomsList([...roomsList, result]);
        }
        
        form.reset();
        setShowForm(false);
        setEditingRoom(null);
        onRoomsChange?.(editingRoom ? roomsList.map(r => r.id === editingRoom.id ? result : r) : [...roomsList, result]);
        alert(editingRoom ? 'Room updated!' : 'Room created!');
      } else {
        alert('Failed to save room');
      }
    } catch (error) {
      console.error('Error saving room:', error);
      alert('Error saving room');
    }
  };

  const handleDeleteRoom = async (roomId: number) => {
    if (!confirm('Are you sure you want to delete this room?')) return;

    try {
      const response = await fetch(`/api/hotel/${hotelId}/rooms/${roomId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        const updatedRooms = roomsList.filter(r => r.id !== roomId);
        setRoomsList(updatedRooms);
        onRoomsChange?.(updatedRooms);
        alert('Room deleted!');
      } else {
        alert('Failed to delete room');
      }
    } catch (error) {
      console.error('Error deleting room:', error);
      alert('Error deleting room');
    }
  };

  const handleEditRoom = (room: Room) => {
    setEditingRoom(room);
    form.reset({
      title: room.title,
      description: room.description || "",
      bedCount: room.bedCount,
      guestCount: room.guestCount,
      bathroomCount: room.bathroomCount,
      kingBed: room.kingBed,
      queenBed: room.queenBed,
      roomPrice: room.roomPrice,
      breakfastPrice: room.breakfastPrice,
      roomService: room.roomService,
      TV: room.TV,
      balcony: room.balcony,
      freeWifi: room.freeWifi,
      oceanView: room.oceanView,
      forestView: room.forestView,
      mountainView: room.mountainView,
      airCondition: room.airCondition,
      soundProofed: room.soundProofed,
      available: room.available,
    });
    setShowForm(true);
  };

  const handleCancel = () => {
    form.reset();
    setShowForm(false);
    setEditingRoom(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Rooms</h2>
        {!showForm && (
          <Button onClick={() => setShowForm(true)} className="gap-2">
            <Plus size={18} /> Add Room
          </Button>
        )}
      </div>

      {/* Room Form */}
      {showForm && (
        <Card className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <h3 className="text-xl font-semibold">{editingRoom ? 'Edit Room' : 'Add New Room'}</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Room Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Deluxe Suite" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="roomPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price per Night ($)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="150" 
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Describe the room..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <FormField
                  control={form.control}
                  name="bedCount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total Beds</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="kingBed"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>King Beds</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="queenBed"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Queen Beds</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="guestCount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Max Guests</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="bathroomCount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bathrooms</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="breakfastPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Breakfast Price ($)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="0" 
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="available"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2 mt-8">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="!mt-0">Available</FormLabel>
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-3">
                <label className="text-lg font-semibold">Room Amenities</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {['roomService', 'TV', 'balcony', 'freeWifi', 'oceanView', 'forestView', 'mountainView', 'airCondition', 'soundProofed'].map((amenity) => (
                    <FormField
                      key={amenity}
                      control={form.control}
                      name={amenity as any}
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel className="capitalize text-sm !mt-0">
                            {amenity.replace(/([A-Z])/g, ' $1').trim()}
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="flex-1">{editingRoom ? 'Update Room' : 'Create Room'}</Button>
                <Button type="button" variant="outline" onClick={handleCancel}>Cancel</Button>
              </div>
            </form>
          </Form>
        </Card>
      )}

      {/* Rooms List */}
      <div className="space-y-4">
        {roomsList.length === 0 ? (
          <Card className="p-6">
            <p className="text-center text-gray-500">No rooms yet. Create your first room!</p>
          </Card>
        ) : (
          roomsList.map((room) => (
            <Card key={room.id} className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{room.title}</h3>
                  {room.description && <p className="text-sm text-gray-600">{room.description}</p>}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2 text-sm">
                    <span className="text-blue-600">💰 ${room.roomPrice}/night</span>
                    <span>🛏️ {room.bedCount} beds</span>
                    <span>👥 {room.guestCount} guests</span>
                    <span>🚿 {room.bathroomCount} baths</span>
                  </div>
                  {(room.kingBed > 0 || room.queenBed > 0) && (
                    <div className="text-sm text-gray-600 mt-1">
                      {room.kingBed > 0 && `${room.kingBed} King Bed${room.kingBed > 1 ? 's' : ''}`}
                      {room.kingBed > 0 && room.queenBed > 0 && ', '}
                      {room.queenBed > 0 && `${room.queenBed} Queen Bed${room.queenBed > 1 ? 's' : ''}`}
                    </div>
                  )}
                  {room.available && (
                    <span className="inline-block mt-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded">Available</span>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditRoom(room)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteRoom(room.id)}
                  >
                    <X size={16} />
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
