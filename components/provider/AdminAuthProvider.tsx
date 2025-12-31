"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useConvex } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const router = useRouter();
  const convex = useConvex(); // Allows manual query execution

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const userId = localStorage.getItem("userId");

        if (!userId) {
          router.push("/login");
          return;
        }

        // Validate the ID against the actual database
        const user = await convex.query(api.users.getUserRole, { 
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          id: userId as any 
        });

        // Check if user exists and is an admin
        if (user && user.role === "admin") {
          setIsAuthorized(true);
        } else {
          // Not an admin or user doesn't exist
          router.push("/login");
        }
      } catch (error) {
        console.error("Auth Error:", error);
        router.push("/login");
      } finally {
        setIsLoading(false);
      }
    };

    checkAdmin();
  }, [router, convex]);

  if (isLoading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-[#002147] mb-4" size={40} />
        <p className="text-sm font-black text-[#002147] uppercase tracking-widest">
          Verifying Credentials...
        </p>
      </div>
    );
  }

  return isAuthorized ? <>{children}</> : null;
}