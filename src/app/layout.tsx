import "./globals.css";
import Link from "next/link";
import { Home, Calendar, BookOpen, Camera, User } from "lucide-react";
import { Space_Grotesk, Lexend } from "next/font/google";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const lexend = Lexend({
  subsets: ["latin"],
  variable: "--font-lexend",
  display: "swap",
});

function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-surface-container border-t border-outline safe-area-bottom">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto">
        <Link href="/" className="flex flex-col items-center justify-center w-14 py-2 text-on-surface-variant hover:text-primary transition-colors">
          <Home size={20} />
          <span className="text-xs mt-1">Home</span>
        </Link>
        <Link href="/plan" className="flex flex-col items-center justify-center w-14 py-2 text-on-surface-variant hover:text-primary transition-colors">
          <Calendar size={20} />
          <span className="text-xs mt-1">Plan</span>
        </Link>
        <Link href="/exercises" className="flex flex-col items-center justify-center w-14 py-2 text-on-surface-variant hover:text-primary transition-colors">
          <BookOpen size={20} />
          <span className="text-xs mt-1">Exercises</span>
        </Link>
        <Link href="/progress" className="flex flex-col items-center justify-center w-14 py-2 text-on-surface-variant hover:text-primary transition-colors">
          <Camera size={20} />
          <span className="text-xs mt-1">Progress</span>
        </Link>
        <Link href="/profile" className="flex flex-col items-center justify-center w-14 py-2 text-on-surface-variant hover:text-primary transition-colors">
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
    <html lang="en" className={`${spaceGrotesk.variable} ${lexend.variable}`}>
      <body
        className="antialiased min-h-screen pb-20"
      >
        {children}
        <BottomNav />
      </body>
    </html>
  );
}