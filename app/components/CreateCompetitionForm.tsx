'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createCompetition } from '../actions';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function CreateCompetitionForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    const formData = new FormData(event.currentTarget);
    
    // Set default date if empty
    if (!formData.get('date')) {
        formData.set('date', new Date().toISOString().split('T')[0]);
    }

    const res = await createCompetition(formData);
    
    if (res.success && res.competitionId) {
      router.push(`/competition/${res.competitionId}`);
    } else {
      alert('Failed to create competition');
      setIsLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-8 py-4 bg-orange-600 hover:bg-orange-700 text-white text-xl font-bold rounded-full shadow-lg transform transition-all hover:scale-105 active:scale-95"
      >
        New Competition
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
              <h2 className="text-2xl font-bold text-white mb-6">Create Competition</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm text-zinc-400 mb-1">Competition Name</label>
                  <input
                    name="name"
                    required
                    placeholder="e.g. Inter College Tournament"
                    className="w-full bg-zinc-800 border-zinc-700 text-white rounded-lg p-3 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-zinc-400 mb-1">Place</label>
                    <input
                      name="place"
                      required
                      placeholder="Ground Name"
                      className="w-full bg-zinc-800 border-zinc-700 text-white rounded-lg p-3 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-zinc-400 mb-1">Date</label>
                    <input
                      name="date"
                      type="date"
                      required
                      defaultValue={new Date().toISOString().split('T')[0]}
                      className="w-full bg-zinc-800 border-zinc-700 text-white rounded-lg p-3 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
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
                    {isLoading ? <Loader2 className="animate-spin" /> : 'Create'}
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
