import type { Metadata } from "next";
import { Geist, Geist_Mono, Poppins, Nunito } from "next/font/google";
import "./globals.css";
import { ConvexClientProvider } from "@/components/provider/ConvexClientProvider";

// --- FONTS ---
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ['300', '400', '500', '600', '700', '800']
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ['300', '400', '500', '600', '700', '800']
});

// --- METADATA ---
export const metadata: Metadata = {
  title: 'Intelligent LMS - University of Ibadan',
  description: 'Context-aware academic support using retrieval-augmented techniques',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${poppins.variable} ${nunito.variable} min-h-screen bg-gray-50 text-gray-900 antialiased`}
      >
        <ConvexClientProvider>
          {children}
        </ConvexClientProvider>
      </body>
    </html>
  );
}
