'use client'

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Toast from "./components/Toast";
import { useToastStore } from "./store/useToastStore";
import { useAuthStore } from "./store/useAuthStore";
import { useEffect } from "react";
import { setupAxiosInterceptors } from "@/utilities/axiosInterceptor";
import { useRouter } from "next/navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { toast: { message, type, open }, toggleToast } = useToastStore(state => state);
  const { logout } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    setupAxiosInterceptors(router);
  }, [logout, toggleToast, router]);

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {open && (
          <Toast message={message} type={type} />
        )}
        {children}
      </body>
    </html>
  );
}
