"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";

interface RoleProtectedProps {
  children: React.ReactNode;
  requiredRole: "user" | "admin" | "any";
  fallbackUrl?: string;
}

export function RoleProtected({
  children,
  requiredRole,
  fallbackUrl = "/",
}: RoleProtectedProps) {
  const { isSignedIn, userId, isLoaded } = useAuth();
  const router = useRouter();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn) {
      router.push("/login");
      return;
    }

    fetchUserRole();
  }, [isSignedIn, userId, isLoaded]);

  const fetchUserRole = async () => {
    try {
      const response = await fetch(`/api/user-role?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        setUserRole(data.role);

        if (requiredRole !== "any" && data.role !== requiredRole) {
          router.push(fallbackUrl);
        }
      } else {
        router.push(fallbackUrl);
      }
    } catch (error) {
      console.error("Error fetching user role:", error);
      router.push(fallbackUrl);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isLoaded || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8">
          <p className="text-gray-600">Loading...</p>
        </Card>
      </div>
    );
  }

  if (!isSignedIn) {
    return null;
  }

  if (requiredRole !== "any" && userRole !== requiredRole) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="p-8 max-w-md text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-6">
            You don't have permission to access this page. This page is restricted to{" "}
            <span className="font-semibold">{requiredRole}s</span>.
          </p>
          <button
            onClick={() => router.push("/")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go Back Home
          </button>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
