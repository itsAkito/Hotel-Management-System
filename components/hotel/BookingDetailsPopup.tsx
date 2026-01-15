import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function BookingDetailsPopup({ bookingId, hotelId, userName }: any) {
  const managementUrl = `/reservation-management?bookingId=${bookingId}&hotelId=${hotelId}`;

  return (
    <Card className="p-4">
      <h4 className="font-semibold mb-3">Quick Actions</h4>
      <div className="space-y-2">
        <Link href={managementUrl}>
          <Button className="w-full justify-start" variant="outline">
            <span className="mr-2">⚙️</span>
            Manage Reservation
          </Button>
        </Link>
        <Link href={`${managementUrl}&tab=guest-profile`}>
          <Button className="w-full justify-start" variant="outline">
            <span className="mr-2">👤</span>
            Update Guest Profile
          </Button>
        </Link>
        <Link href={`${managementUrl}&tab=check-in-out`}>
          <Button className="w-full justify-start" variant="outline">
            <span className="mr-2">🔑</span>
            Check-In/Check-Out
          </Button>
        </Link>
        <Link href={`${managementUrl}&tab=room-assignment`}>
          <Button className="w-full justify-start" variant="outline">
            <span className="mr-2">🚪</span>
            Assign Room
          </Button>
        </Link>
        <Link href={`${managementUrl}&tab=billing`}>
          <Button className="w-full justify-start" variant="outline">
            <span className="mr-2">💳</span>
            Create Invoice
          </Button>
        </Link>
        <Link href={`${managementUrl}&tab=services`}>
          <Button className="w-full justify-start" variant="outline">
            <span className="mr-2">🔧</span>
            Guest Services
          </Button>
        </Link>
      </div>
    </Card>
  );
}
