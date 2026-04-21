import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Link from "next/link";
import { Home, Dumbbell, LayoutDashboard, Calendar, BookOpen, Camera, User } from "lucide-react";

function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 safe-area-bottom">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto">
        <Link href="/" className="flex flex-col items-center justify-center w-14 py-2 text-slate-400 hover:text-white transition-colors">
          <Home size={20} />
          <span className="text-xs mt-1">Home</span>
        </Link>
        <Link href="/plan" className="flex flex-col items-center justify-center w-14 py-2 text-slate-400 hover:text-white transition-colors">
          <Calendar size={20} />
          <span className="text-xs mt-1">Plan</span>
        </Link>
        <Link href="/exercises" className="flex flex-col items-center justify-center w-14 py-2 text-slate-400 hover:text-white transition-colors">
          <BookOpen size={20} />
          <span className="text-xs mt-1">Exercises</span>
        </Link>
        <Link href="/progress" className="flex flex-col items-center justify-center w-14 py-2 text-slate-400 hover:text-white transition-colors">
          <Camera size={20} />
          <span className="text-xs mt-1">Progress</span>
        </Link>
        <Link href="/profile" className="flex flex-col items-center justify-center w-14 py-2 text-slate-400 hover:text-white transition-colors">
          <User size={20} />
          <span className="text-xs mt-1">Profile</span>
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
