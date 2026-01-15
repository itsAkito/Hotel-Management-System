"use client";

import { SignIn, useUser } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
  const searchParams = useSearchParams();
  const role = searchParams.get("role") || "user";
  const { user } = useUser();
  const [isRegistering, setIsRegistering] = useState(false);

  useEffect(() => {
    if (user?.id && user?.emailAddresses?.[0]?.emailAddress && !isRegistering) {
      registerUser();
    }
  }, [user]);

  const registerUser = async () => {
    if (!user?.id || !user?.emailAddresses?.[0]?.emailAddress) return;
    
    setIsRegistering(true);
    try {
      await fetch("/api/user-register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          email: user.emailAddresses[0].emailAddress,
          role: role,
        }),
      });
    } catch (error) {
      console.error("Registration error:", error);
    }
    setIsRegistering(false);
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="w-full max-w-md px-4">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {role === "admin" ? "Admin Login" : "Guest Login"}
          </h2>
          <p className="text-gray-600">Sign in to your {role} account</p>
        </div>
        <SignIn
          appearance={{
            elements: {
              rootBox: "w-full",
              card: "shadow-lg border-0 rounded-lg",
            },
          }}
        />
      </div>
    </div>
  );
}