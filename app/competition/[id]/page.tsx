
import { getCompetition } from '@/app/actions';
import AddMatchForm from '@/app/components/AddMatchForm';
import { notFound } from 'next/navigation';
import Link from 'next/link';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function CompetitionPage({ params }: PageProps) {
  const { id } = await params;
  const competition = await getCompetition(id);

  if (!competition) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-12 relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
             <div className="absolute top-[-20%] right-[-20%] w-[60%] h-[60%] bg-orange-600/10 rounded-full blur-[120px]" />
        </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 border-b border-white/10 pb-8">
            <div>
                <h1 className="text-4xl font-black mb-2 text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-400">
                    {competition.name}
                </h1>
                <div className="flex items-center gap-4 text-zinc-400">
                    <span>📍 {competition.place}</span>
                    <span>📅 {new Date(competition.date).toLocaleDateString()}</span>
                </div>
            </div>
            <AddMatchForm competitionId={id} />
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {competition.matches.length === 0 ? (
                <div className="col-span-full text-center py-20 text-zinc-600 border border-zinc-900 rounded-3xl bg-zinc-900/30 border-dashed">
                    <p className="text-xl">No matches added yet.</p>
                    <p className="text-sm">Click "Add Match" to start.</p>
                </div>
            ) : (
                competition.matches.map((match: any) => (
                    <Link 
                        href={`/match/${match._id}`} 
                        key={match._id}
                        className="group block bg-zinc-900/50 border border-zinc-800 hover:border-orange-500/50 rounded-2xl p-6 transition-all hover:bg-zinc-800/80"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <span className={`text-xs font-bold px-3 py-1 rounded-full ${match.isActive ? 'bg-green-500/20 text-green-400' : 'bg-zinc-800 text-zinc-500'}`}>
                                {match.isActive ? 'LIVE' : 'ENDED'}
                            </span>
                             <span className="text-xs text-zinc-500">
                                Match ID: {match._id.toString().slice(-4)}
                            </span>
                        </div>

                        <div className="flex justify-between items-center text-center">
                            <div>
                                <h3 className="text-xl font-bold text-blue-400 mb-1">{match.teamAName}</h3>
                                <p className="text-4xl font-black">{match.scores.teamA}</p>
                            </div>
                            <div className="text-zinc-600 font-bold">vs</div>
                             <div>
                                <h3 className="text-xl font-bold text-red-400 mb-1">{match.teamBName}</h3>
                                <p className="text-4xl font-black">{match.scores.teamB}</p>
                            </div>
                        </div>
                    </Link>
                ))
            )}
        </div>
      </div>
    </div>
  );
}
