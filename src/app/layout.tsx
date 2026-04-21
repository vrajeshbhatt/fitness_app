import "./globals.css";
import Link from "next/link";
import { Home, Swords, Calendar, BookOpen, Award, Trophy } from "lucide-react";
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
    <nav className="fixed bottom-0 left-0 right-0 bg-[#0a0a0f]/90 backdrop-blur-xl border-t border-cyan-900/50 safe-area-bottom z-50">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto">
        <Link href="/" className="flex flex-col items-center justify-center w-14 py-2 text-slate-400 hover:text-cyan-400 transition-colors">
          <Home size={20} />
          <span className="text-xs mt-1 font-['Space_Grotesk'] uppercase font-bold tracking-tighter">Home</span>
        </Link>
        <Link href="/quests" className="flex flex-col items-center justify-center w-14 py-2 text-slate-400 hover:text-cyan-400 transition-colors">
          <Swords size={20} />
          <span className="text-xs mt-1 font-['Space_Grotesk'] uppercase font-bold tracking-tighter">Quests</span>
        </Link>
        <Link href="/plan" className="flex flex-col items-center justify-center w-14 py-2 text-slate-400 hover:text-cyan-400 transition-colors">
          <Calendar size={20} />
          <span className="text-xs mt-1 font-['Space_Grotesk'] uppercase font-bold tracking-tighter">Plan</span>
        </Link>
        <Link href="/exercises" className="flex flex-col items-center justify-center w-14 py-2 text-slate-400 hover:text-cyan-400 transition-colors">
          <BookOpen size={20} />
          <span className="text-xs mt-1 font-['Space_Grotesk'] uppercase font-bold tracking-tighter">Exercises</span>
        </Link>
        <Link href="/achievements" className="flex flex-col items-center justify-center w-14 py-2 text-slate-400 hover:text-cyan-400 transition-colors">
          <Award size={20} />
          <span className="text-xs mt-1 font-['Space_Grotesk'] uppercase font-bold tracking-tighter">Badges</span>
        </Link>
        <Link href="/leaderboard" className="flex flex-col items-center justify-center w-14 py-2 text-slate-400 hover:text-cyan-400 transition-colors">
          <Trophy size={20} />
          <span className="text-xs mt-1 font-['Space_Grotesk'] uppercase font-bold tracking-tighter">Ranks</span>
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