// src/app/(auth)/layout.tsx

import { AuthProvider } from "@/context/auth-context";
import type { Metadata } from "next";
import React from "react"; 

export const metadata: Metadata = {
  title: "Giriş Yap - DreamForge",
  description: "DreamForge'a giriş yapın veya yeni bir hesap oluşturun.",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
        {children}
      </div>
    </AuthProvider>
  );
}