"use client";

import * as Toast from "@radix-ui/react-toast";
import { useState } from "react";

export default function HotelToast({ message }: { message: string }) {
  const [open, setOpen] = useState(true);

  return (
    <Toast.Provider>
      <Toast.Root
        open={open}
        onOpenChange={setOpen}
        className="bg-green-600 text-white p-4 rounded shadow-lg"
      >
        <Toast.Title className="font-bold">Success</Toast.Title>
        <Toast.Description>{message}</Toast.Description>
      </Toast.Root>
      <Toast.Viewport className="fixed bottom-4 right-4" />
    </Toast.Provider>
  );
}