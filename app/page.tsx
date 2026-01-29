
import CreateCompetitionForm from './components/CreateCompetitionForm';
import { History } from 'lucide-react'; 
import Link from 'next/link';

// Using server component default export
export default function Home() {

  return (
    <main className="min-h-screen bg-black flex flex-col items-center justify-center p-4 relative overflow-hidden">
        {/* Background Video */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
            <video 
                autoPlay 
                loop 
                muted 
                playsInline
                className="w-full h-full object-cover opacity-60"
            >
                <source src="/raid.mp4" type="video/mp4" />
            </video>
            {/* Overlay Gradient to make text pop */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/90" />
        </div>

      <div className="z-10 text-center space-y-8 w-full max-w-4xl relative">
        <h1 className="text-5xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-600 tracking-tighter drop-shadow-2xl">
          KABADDI<br/>SCOREBOARD
        </h1>
        <p className="text-zinc-200 text-lg md:text-2xl max-w-lg mx-auto font-medium drop-shadow-md">
          Professional match scoring made simple. No more paper sheets.
        </p>
        
        {/* Buttons Area */}
        <div className="flex flex-col md:flex-row gap-4 justify-center items-center mt-8">
            <CreateCompetitionForm />
            
            <Link
                href="/competitions"
                className="px-8 py-4 bg-zinc-800/80 hover:bg-zinc-700/90 text-white text-xl font-bold rounded-full shadow-lg backdrop-blur-sm border border-white/10 flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
            >
                <History size={24} />
                Past Competitions
            </Link>
        </div>
      </div>
    </main>
  );
}
