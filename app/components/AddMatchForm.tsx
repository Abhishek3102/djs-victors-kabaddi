'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createMatch } from '../actions';
import { Loader2, Plus } from 'lucide-react';

export default function AddMatchForm({ competitionId }: { competitionId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    const formData = new FormData(event.currentTarget);
    
    const res = await createMatch(competitionId, formData);
    
    setIsLoading(false);
    if (res.success) {
      setIsOpen(false);
      // Optional: Refresh parent data or let server action's revalidatePath handle it, 
      // but revalidatePath only refreshes server components. Client needs to know.
      // For now, revalidatePath works if we are using server components for the list.
    } else {
      alert('Failed to create match');
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl shadow-lg transform transition-all hover:scale-105 active:scale-95"
      >
        <Plus size={20} />
        Add Match
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl w-full max-w-md shadow-2xl"
            >
              <h2 className="text-2xl font-bold text-white mb-6">Add New Match</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                
                <div className="grid grid-cols-2 gap-4">
                   <div>
                    <label className="block text-sm text-blue-400 mb-1 font-semibold">Team A (Blue)</label>
                    <input
                      name="teamAName"
                      required
                      placeholder="Name"
                      className="w-full bg-zinc-800 border-blue-900/50 text-white rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    />
                  </div>
                   <div>
                    <label className="block text-sm text-red-400 mb-1 font-semibold">Team B (Red)</label>
                    <input
                      name="teamBName"
                      required
                      placeholder="Name"
                      className="w-full bg-zinc-800 border-red-900/50 text-white rounded-lg p-3 focus:ring-2 focus:ring-red-500 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="flex-1 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 py-3 bg-white hover:bg-gray-100 text-black rounded-xl font-bold transition-all flex justify-center items-center"
                  >
                    {isLoading ? <Loader2 className="animate-spin" /> : 'Add Match'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
