// INTEGRATION GUIDE: Add these to your Navbar.tsx

// Step 1: Import Link and useRouter at the top of your Navbar.tsx
import Link from "next/link";
import { useRouter } from "next/navigation";

// Step 2: Add these new menu items to your navigation (example for DropdownMenu)

export const managementMenuItems = [
  {
    label: "Management Dashboard",
    href: "/management-dashboard",
    icon: "📊",
    description: "View all bookings and manage reservations",
  },
  {
    label: "Check-In / Check-Out",
    href: "/management-dashboard?tab=check-in-out",
    icon: "🔑",
    description: "Manage guest arrivals and departures",
  },
  {
    label: "Room Assignments",
    href: "/management-dashboard?tab=room-assignment",
    icon: "🚪",
    description: "Assign and manage room allocations",
  },
  {
    label: "Billing & Invoices",
    href: "/management-dashboard?tab=billing",
    icon: "💳",
    description: "Create and track invoices",
  },
  {
    label: "Guest Services",
    href: "/management-dashboard?tab=services",
    icon: "🔧",
    description: "Manage maintenance and service requests",
  },
];

// Step 3: Add this component to your Navbar dropdown
export function ManagementMenuDropdown() {
  const router = useRouter();

  return (
    <div className="space-y-2">
      {managementMenuItems.map((item) => (
        <Link key={item.href} href={item.href}>
          <div className="px-4 py-2 hover:bg-gray-100 rounded cursor-pointer">
            <div className="flex items-center gap-2">
              <span>{item.icon}</span>
              <div>
                <p className="font-semibold text-sm">{item.label}</p>
                <p className="text-xs text-gray-600">{item.description}</p>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

// Step 4: In your Navbar menu, add this section:
/*
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="ghost">
      📋 Management
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent align="end" className="w-72">
    <ManagementMenuDropdown />
  </DropdownMenuContent>
</DropdownMenu>
*/

// Step 5: If you want to add a quick action button:
export function QuickManagementButton() {
  return (
    <Link href="/management-dashboard">
      <Button className="gap-2">
        <span>📋</span>
        Management
      </Button>
    </Link>
  );
}

// Step 6: For a specific booking, you can add this helper:
export function BookingManagementLink({
  bookingId,
  hotelId,
  children,
}: {
  bookingId: string;
  hotelId: number;
  children?: React.ReactNode;
}) {
  return (
    <Link href={`/reservation-management?bookingId=${bookingId}&hotelId=${hotelId}`}>
      <Button variant="outline">
        {children || "Manage Booking"}
      </Button>
    </Link>
  );
}
