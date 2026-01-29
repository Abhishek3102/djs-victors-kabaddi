import dbConnect from '@/lib/db';
import { Competition } from '@/lib/models';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, History, Calendar, MapPin } from 'lucide-react';

export const dynamic = 'force-dynamic';

// Re-implementing fetch here to ensure we get a longer list if needed, 
// or we could import from actions, but for a full page list we might want more than 5.
async function getAllCompetitions() {
    try {
        await dbConnect();
        const competitions = await Competition.find({})
            .sort({ createdAt: -1 })
            .lean(); // Fetch all, or maybe limit to 50
        return JSON.parse(JSON.stringify(competitions));
    } catch (e) {
        console.error("Failed to fetch competitions:", e);
        return [];
    }
}

export default async function CompetitionsPage() {
  const competitions = await getAllCompetitions();

  return (
    <main className="min-h-screen bg-black text-white p-4 md:p-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col gap-4">
            <Link 
                href="/" 
                className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors self-start px-3 py-2 rounded-lg hover:bg-zinc-900"
            >
                <ArrowLeft size={20} />
                <span className="font-bold">Back to Home</span>
            </Link>
            
            <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">
                Past Competitions
            </h1>
            <p className="text-zinc-400">
                Archive of all tournaments and match records.
            </p>
        </div>

        {/* List Section */}
        <div className="grid gap-4">
            {competitions.length > 0 ? (
                competitions.map((comp: any) => (
                    <Link 
                        href={`/competition/${comp._id}`} 
                        key={comp._id}
                        className="group block p-6 bg-zinc-900/50 border border-zinc-800 hover:border-orange-500/50 hover:bg-zinc-900/80 rounded-2xl transition-all shadow-lg hover:shadow-orange-900/10"
                    >
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div className="space-y-2">
                                <h2 className="text-xl md:text-2xl font-bold text-white group-hover:text-orange-400 transition-colors">
                                    {comp.name}
                                </h2>
                                <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-400">
                                    <div className="flex items-center gap-1.5">
                                        <MapPin size={16} className="text-zinc-500" />
                                        {comp.place}
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Calendar size={16} className="text-zinc-500" />
                                        {new Date(comp.date).toLocaleDateString(undefined, { dateStyle: 'long' })}
                                    </div>
                                </div>
                            </div>
                            
                            <div className="self-end md:self-center bg-orange-500/10 text-orange-500 p-3 rounded-full group-hover:bg-orange-500 group-hover:text-black transition-all">
                                <ArrowRight size={24} />
                            </div>
                        </div>
                    </Link>
                ))
            ) : (
                <div className="text-center py-20 bg-zinc-900/30 rounded-3xl border border-zinc-800 border-dashed">
                    <History className="mx-auto w-12 h-12 text-zinc-700 mb-4" />
                    <p className="text-zinc-500 text-lg">No competitions found.</p>
                </div>
            )}
        </div>

      </div>
    </main>
  );
}
