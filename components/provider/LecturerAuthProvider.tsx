/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useConvex } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function LecturerAuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const router = useRouter();
  const convex = useConvex();

  useEffect(() => {
    const checkLecturer = async () => {
      try {
        const userId = localStorage.getItem("userId");

        if (!userId) {
          router.push("/login");
          return;
        }

        const user = await convex.query(api.users.getUserRole, { 
          id: userId as any 
        });

        if (user && user.role === "lecturer") {
          setIsAuthorized(true);
        } else {
          router.push("/login");
        }
      } catch (error) {
        console.error("Auth Error:", error);
        router.push("/login");
      } finally {
        setIsLoading(false);
      }
    };

    checkLecturer();
  }, [router, convex]);

  if (isLoading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-emerald-600 mb-4" size={40} />
        <p className="text-sm font-black text-slate-600 uppercase tracking-widest">
          Verifying Access...
        </p>
      </div>
    );
  }

  return isAuthorized ? <>{children}</> : null;
}