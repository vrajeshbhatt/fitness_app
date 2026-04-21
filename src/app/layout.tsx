import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Link from "next/link";
import { Home, Dumbbell, LayoutDashboard } from "lucide-react";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Calisthenics AI",
  description: "Your intelligent calisthenics fitness tracker",
};

function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 safe-area-bottom">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto">
        <Link href="/" className="flex flex-col items-center justify-center w-16 py-2 text-slate-400 hover:text-white transition-colors">
          <Home size={22} />
          <span className="text-xs mt-1">Home</span>
        </Link>
        <Link href="/log" className="flex flex-col items-center justify-center w-16 py-2 text-slate-400 hover:text-white transition-colors">
          <Dumbbell size={22} />
          <span className="text-xs mt-1">Log</span>
        </Link>
        <Link href="/dashboard" className="flex flex-col items-center justify-center w-16 py-2 text-slate-400 hover:text-white transition-colors">
          <LayoutDashboard size={22} />
          <span className="text-xs mt-1">Dashboard</span>
        </Link>
      </div>
    </nav>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-950 text-white min-h-screen pb-20`}
      >
        {children}
        <BottomNav />
      </body>
    </html>
  );
}
