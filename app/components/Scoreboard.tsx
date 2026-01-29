'use client';

import { useState, useEffect } from 'react';
import { Minus, Plus, RefreshCcw, Trophy, CheckCircle } from 'lucide-react'; 
import { updateScore, finishMatch } from '@/app/actions'; 
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

interface ScoreboardProps {
  matchId: string;
  initialData: {
    competitionId: {
      _id: string; 
      name: string;
      place: string;
      date: string;
    } | null;
    teamAName: string;
    teamBName: string;
    scores: {
      teamA: number;
      teamB: number;
    };
    isActive?: boolean;
  };
}

export default function Scoreboard({ matchId, initialData }: ScoreboardProps) {
  const [scores, setScores] = useState(initialData.scores);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isFinished, setIsFinished] = useState(!initialData.isActive);
  const competition = initialData.competitionId;
  const router = useRouter();

  useEffect(() => {
    setScores(initialData.scores);
    setIsFinished(!initialData.isActive);
  }, [initialData.scores, initialData.isActive]);

  const handleScoreChange = async (team: 'A' | 'B', newScore: number) => {
    if (isFinished) return; 
    
    setScores((prev) => ({
      ...prev,
      [`team${team}`]: newScore,
    }));

    setIsSyncing(true);
    await updateScore(matchId, team, newScore);
    setIsSyncing(false);
  };

  const increment = (team: 'A' | 'B') => {
    const current = team === 'A' ? scores.teamA : scores.teamB;
    handleScoreChange(team, current + 1);
  };

  const decrement = (team: 'A' | 'B') => {
    const current = team === 'A' ? scores.teamA : scores.teamB;
    if (current > 0) {
      handleScoreChange(team, current - 1);
    }
  };

  const handleFinish = async () => {
    if (confirm("Are you sure you want to finish this match? Scores will be locked.")) {
        setIsSyncing(true);
        await finishMatch(matchId);
        setIsFinished(true);
        setIsSyncing(false);
         if (competition?._id) {
             router.push(`/competition/${competition._id}`);
         }
    }
  };

  return (
    <div className="relative h-screen flex flex-col items-center p-2 overflow-hidden text-white font-sans bg-gradient-to-br from-black via-zinc-900 to-orange-950/40 selection:bg-orange-500/30">
      
      {/* Top Section: Compact Header - Designed for small screens */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex-none z-10 text-center w-full max-w-4xl border-b border-white/5 pb-2 mb-1 pt-2"
      >
        <div className="flex flex-col items-center gap-0.5">
            <span className="text-[10px] font-bold tracking-[0.15em] text-orange-500/80 uppercase">Competition Detail</span>
            <h1 className="text-sm md:text-xl font-black uppercase tracking-tight text-white/90 leading-tight line-clamp-1 px-4 max-w-sm mx-auto">
                {competition?.name || 'Tournament'}
            </h1>
            <div className="flex items-center justify-center gap-2 text-zinc-500 text-[10px] md:text-xs font-medium mt-0.5">
                <span>{competition?.place || 'Venue'}</span>
                <span className="text-zinc-700">•</span>
                <span>
                    {competition?.date ? new Date(competition.date).toLocaleDateString(undefined, { dateStyle: 'medium' }) : 'Date N/A'}
                </span>
            </div>
        </div>
      </motion.div>

      {/* Middle Section: Scores - Flex Grow to take available space */}
      <div className="flex-1 w-full max-w-5xl flex items-center justify-between gap-1 md:gap-4 px-1 min-h-0">
        
        {/* Team A Card */}
        <div className="flex-1 flex flex-col items-center justify-center h-full">
            <h2 className="text-lg md:text-3xl font-black mb-1 text-center text-blue-400 drop-shadow-md break-words w-full line-clamp-2 px-1 leading-none h-12 flex items-center justify-center">
                {initialData.teamAName}
            </h2>
             <div className="flex-1 w-full flex items-center justify-center bg-gradient-to-b from-blue-900/10 to-blue-950/30 border border-blue-500/10 rounded-2xl relative overflow-hidden">
                <span className="text-6xl md:text-8xl font-black tabular-nums tracking-tighter scale-125 md:scale-100">
                    {scores.teamA}
                </span>
            </div>
        </div>

        {/* VS Divider */}
        <div className="flex flex-col items-center gap-1 opacity-20 px-1">
            <div className="w-[1px] h-8 md:h-16 bg-gradient-to-b from-transparent via-white to-transparent" />
            <span className="text-[10px] md:text-sm font-black tracking-widest text-white/50">VS</span>
            <div className="w-[1px] h-8 md:h-16 bg-gradient-to-b from-transparent via-white to-transparent" />
        </div>

        {/* Team B Card */}
        <div className="flex-1 flex flex-col items-center justify-center h-full">
            <h2 className="text-lg md:text-3xl font-black mb-1 text-center text-red-500 drop-shadow-md break-words w-full line-clamp-2 px-1 leading-none h-12 flex items-center justify-center">
                {initialData.teamBName}
            </h2>
            <div className="flex-1 w-full flex items-center justify-center bg-gradient-to-b from-red-900/10 to-red-950/30 border border-red-500/10 rounded-2xl relative overflow-hidden">
                <span className="text-6xl md:text-8xl font-black tabular-nums tracking-tighter scale-125 md:scale-100">
                    {scores.teamB}
                </span>
            </div>
        </div>
      </div>

      {/* Bottom Section: Controls & Finish - Compact */}
      {!isFinished ? (
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="flex-none z-10 w-full max-w-md grid grid-cols-2 gap-3 mt-3 px-1"
          >
             {/* Team A Controls */}
             <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-center gap-2">
                    <button 
                        onClick={() => decrement('A')}
                        className="w-12 h-12 md:w-14 md:h-14 flex-none flex items-center justify-center bg-zinc-800/80 hover:bg-zinc-700/80 text-zinc-400 hover:text-white transition-all rounded-xl active:scale-95 border border-white/5"
                    >
                        <Minus size={20} />
                    </button>
                    <button 
                         onClick={() => increment('A')}
                         className="flex-1 h-12 md:h-14 flex items-center justify-center bg-blue-600 hover:bg-blue-500 active:bg-blue-700 active:scale-95 transition-all rounded-xl shadow-lg shadow-blue-900/30 border border-t-white/10"
                    >
                        <Plus size={28} />
                    </button>
                </div>
                <button
                    onClick={() => handleScoreChange('A', scores.teamA + 2)}
                    className="w-full py-2.5 bg-blue-900/20 hover:bg-blue-800/40 border border-blue-500/20 rounded-lg text-blue-300/80 text-[10px] md:text-xs font-bold tracking-wide uppercase transition-all active:scale-95 active:bg-blue-900/60"
                >
                    SUPER TACKLE (+2)
                </button>
             </div>

             {/* Team B Controls */}
             <div className="flex flex-col gap-1.5">
                 <div className="flex items-center justify-center gap-2 flex-row-reverse">
                     <button 
                        onClick={() => decrement('B')}
                        className="w-12 h-12 md:w-14 md:h-14 flex-none flex items-center justify-center bg-zinc-800/80 hover:bg-zinc-700/80 text-zinc-400 hover:text-white transition-all rounded-xl active:scale-95 border border-white/5"
                    >
                        <Minus size={20} />
                    </button>
                    <button 
                         onClick={() => increment('B')}
                         className="flex-1 h-12 md:h-14 flex items-center justify-center bg-red-600 hover:bg-red-500 active:bg-red-700 active:scale-95 transition-all rounded-xl shadow-lg shadow-red-900/30 border border-t-white/10"
                    >
                        <Plus size={28} />
                    </button>
                </div>
                 <button
                    onClick={() => handleScoreChange('B', scores.teamB + 2)}
                    className="w-full py-2.5 bg-red-900/20 hover:bg-red-800/40 border border-red-500/20 rounded-lg text-red-300/80 text-[10px] md:text-xs font-bold tracking-wide uppercase transition-all active:scale-95 active:bg-red-900/60"
                >
                    SUPER TACKLE (+2)
                </button>
             </div>
          </motion.div>
      ) : (
          <div className="flex-none w-full flex justify-center items-center h-32 text-center">
              <div className="bg-zinc-900/80 border border-zinc-800 p-6 rounded-2xl backdrop-blur-md">
                 <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                 <h3 className="text-xl font-bold text-white">Match Finished</h3>
                 <p className="text-zinc-400 text-sm">Final Score: {scores.teamA} - {scores.teamB}</p>
              </div>
          </div>
      )}

      {/* Footer Area: Sync & Finish Button */}
      { !isFinished && (
        <div className="mt-3 flex-none w-full max-w-md flex items-center justify-between px-1 pb-4">
            <div className="flex items-center gap-2 text-[10px] font-medium text-zinc-500 bg-black/20 px-3 py-1.5 rounded-full border border-white/5">
                {isSyncing ? <RefreshCcw className="animate-spin w-3 h-3" /> : <div className="w-1.5 h-1.5 bg-green-500 rounded-full shadow-[0_0_5px_rgb(34,197,94)]" />}
                {isSyncing ? 'SAVING...' : 'LIVE SYNC'}
            </div>

            <button
                onClick={handleFinish}
                className="flex items-center gap-2 bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white px-5 py-2 rounded-lg text-[10px] font-bold tracking-wider border border-white/5 transition-all active:scale-95"
            >
                <CheckCircle size={14} />
                FINISH MATCH
            </button>
        </div>
      )}

    </div>
  );
}
