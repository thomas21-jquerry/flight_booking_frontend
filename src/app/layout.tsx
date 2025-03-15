import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Flight Booking App",
  description: "Book your flights easily and securely",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <nav className="bg-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between h-16">
              <div className="flex">
                <Link href="/" className="flex items-center">
                  <span className="text-xl font-bold">Flight Booking</span>
                </Link>
              </div>
              <div className="flex items-center space-x-4">
                <Link href="/flights" className="text-gray-700 hover:text-gray-900">
                  Flights
                </Link>
                <Link href="/tickets" className="text-gray-700 hover:text-gray-900">
                  My Tickets
                </Link>
                <Link href="/auth/login" className="text-gray-700 hover:text-gray-900">
                  Login
                </Link>
                <Link href="/auth/register" className="text-gray-700 hover:text-gray-900">
                  Register
                </Link>
              </div>
            </div>
          </div>
        </nav>
        <main className="max-w-7xl mx-auto px-4 py-6">
          {children}
        </main>
      </body>
    </html>
  );
}
