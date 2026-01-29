
import CreateCompetitionForm from './components/CreateCompetitionForm';
import dbConnect from '@/lib/db';
import { Competition } from '@/lib/models';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

async function getRecentCompetitions() {
    try {
        await dbConnect();
        // Use a much simpler lean query to debug
        const competitions = await Competition.find({})
            .sort({ createdAt: -1 })
            .limit(5)
            .lean();
            
        // Log to see what we are getting
        console.log("Competitions found:", competitions);
        
        return JSON.parse(JSON.stringify(competitions));
    } catch (e) {
        console.error("Failed to fetch competitions:", e);
        return [];
    }
}

export default async function Home() {
  const recentCompetitions = await getRecentCompetitions();

  return (
    <main className="min-h-screen bg-black flex flex-col items-center justify-center p-4 relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-orange-600/20 rounded-full blur-[100px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-[100px]" />
        </div>

      <div className="z-10 text-center space-y-8 w-full max-w-4xl">
        <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-600 tracking-tight">
          KABADDI<br/>SCOREBOARD
        </h1>
        <p className="text-zinc-400 text-lg md:text-xl max-w-md mx-auto">
          Professional match scoring made simple. No more paper sheets.
        </p>
        
        <div className="flex justify-center">
            <CreateCompetitionForm />
        </div>

        {recentCompetitions.length > 0 && (
            <div className="mt-16 text-left">
                <h2 className="text-2xl font-bold text-white mb-6 border-b border-zinc-800 pb-2">Recent Competitions</h2>
                <div className="space-y-3">
                    {recentCompetitions.map((comp: any) => (
                        <Link 
                            href={`/competition/${comp._id}`} 
                            key={comp._id}
                            className="block p-4 bg-zinc-900/50 border border-zinc-800 hover:border-orange-500/50 rounded-xl transition-all group"
                        >
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="font-bold text-white group-hover:text-orange-400 transition-colors">{comp.name}</h3>
                                    <p className="text-sm text-zinc-500">{comp.place} • {new Date(comp.date).toLocaleDateString()}</p>
                                </div>
                                <ArrowRight className="text-zinc-600 group-hover:text-white transition-colors" />
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        )}
      </div>
    </main>
  );
}
