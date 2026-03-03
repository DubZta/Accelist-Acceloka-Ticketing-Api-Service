import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Inter } from "next/font/google";
import "./globals.css";
import GlobalReset from "../components/GlobalReset";
import { Suspense } from "react";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
});

// Assuming 'Inter' is also intended to be used, or 'plusJakartaSans' should be kept.
// Based on the snippet, 'inter.className' is used in the body, so 'Inter' needs to be defined.
const inter = Inter({ subsets: ["latin"] });


export const metadata: Metadata = {
  title: "Acceloka",
  description: "Search events, compare options, and book in minutes.",
};

import { CartProvider } from "../context/CartContext";
import CartDrawer from "../components/CartDrawer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </head>
      <body
        className={`${inter.className} bg-slate-50 antialiased relative`}
      >
        <Suspense fallback={null}>
          <GlobalReset />
        </Suspense>
        <CartProvider>
          {children}
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
