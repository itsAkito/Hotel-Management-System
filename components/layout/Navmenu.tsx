
"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, Hotel, BookOpenCheck, ChevronDown, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { SignOutButton } from "@clerk/nextjs";


export function NavMenu() {
    const router = useRouter()
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="text-white hover:bg-blue-700 dark:hover:bg-slate-700 font-semibold"
        >
          <span>Menu</span>
          <ChevronDown className="ml-1 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuLabel className="font-bold text-gray-700 dark:text-gray-200">Hotel Management</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          onClick={() => router.push('/hotel/new')}
          className="cursor-pointer py-2 pl-8"
        >
          <Plus size={16} className="mr-3 h-4 w-4 text-blue-600 dark:text-blue-400" /> 
          <span className="font-medium">Add New Hotel</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          onClick={() => router.push('/my-hotels')}
          className="cursor-pointer py-2 pl-8"
        >
          <Hotel size={16} className="mr-3 h-4 w-4 text-emerald-600 dark:text-emerald-400" /> 
          <span className="font-medium">My Hotels</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          onClick={() => router.push('/my-bookings')}
          className="cursor-pointer py-2 pl-8"
        >
          <BookOpenCheck size={16} className="mr-3 h-4 w-4 text-orange-600 dark:text-orange-400" /> 
          <span className="font-medium">My Bookings</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        
        <DropdownMenuLabel className="font-bold text-gray-700 dark:text-gray-200">Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuItem asChild className="cursor-pointer text-red-600 dark:text-red-400 py-2 pl-8">
          <SignOutButton>
            <div className="flex items-center gap-2 cursor-pointer">
              <LogOut size={16} className="h-4 w-4" />
              <span className="font-medium">Sign Out</span>
            </div>
          </SignOutButton>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}