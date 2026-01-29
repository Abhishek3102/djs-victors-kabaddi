'use server';

import dbConnect from '@/lib/db';
import { Match, Competition } from '@/lib/models';
import { revalidatePath } from 'next/cache';

// --- Competition Actions ---

export async function createCompetition(formData: FormData) {
    try {
        await dbConnect();

        const name = formData.get('name') as string;
        const place = formData.get('place') as string;
        const date = formData.get('date') as string;

        const newComp = await Competition.create({
            name,
            place,
            date,
            matches: [],
        });

        return { success: true, competitionId: newComp._id.toString() };
    } catch (error) {
        console.error('Error creating competition:', error);
        return { success: false, error: 'Failed to create competition' };
    }
}

export async function getCompetition(id: string) {
    try {
        await dbConnect();
        const comp = await Competition.findById(id).populate('matches').lean();
        if (!comp) return null;
        return JSON.parse(JSON.stringify(comp));
    } catch (error) {
        console.error("Error fetching competition:", error);
        return null;
    }
}

// --- Match Actions ---

export async function createMatch(competitionId: string, formData: FormData) {
    try {
        await dbConnect();

        const teamAName = formData.get('teamAName') as string;
        const teamBName = formData.get('teamBName') as string;

        const newMatch = await Match.create({
            competitionId,
            teamAName,
            teamBName,
            scores: {
                teamA: 0,
                teamB: 0,
                history: [],
            },
            isActive: true,
        });

        // Add match to competition
        await Competition.findByIdAndUpdate(competitionId, {
            $push: { matches: newMatch._id }
        });

        revalidatePath(`/competition/${competitionId}`);
        return { success: true, matchId: newMatch._id.toString() };
    } catch (error) {
        console.error('Error creating match:', error);
        return { success: false, error: 'Failed to create match' };
    }
}

export async function updateScore(matchId: string, team: 'A' | 'B', newScore: number) {
    try {
        await dbConnect();

        const match = await Match.findById(matchId);
        if (!match) {
            throw new Error('Match not found');
        }

        const previousScore = team === 'A' ? match.scores.teamA : match.scores.teamB;
        const pointsDiff = newScore - previousScore;

        // Only update if score changed
        if (pointsDiff !== 0) {
            if (team === 'A') {
                match.scores.teamA = newScore;
            } else {
                match.scores.teamB = newScore;
            }

            match.scores.history.push({
                team,
                points: pointsDiff,
                timestamp: new Date(),
            });

            await match.save();
            revalidatePath(`/match/${matchId}`);
        }

        return { success: true };
    } catch (error) {
        console.error('Error updating score:', error);
        return { success: false, error: 'Failed to update score' };
    }
}

export async function finishMatch(matchId: string) {
    try {
        await dbConnect();
        await Match.findByIdAndUpdate(matchId, { isActive: false });
        revalidatePath(`/match/${matchId}`);
        return { success: true };
    } catch (e) {
        console.error("Error finishing match:", e);
        return { success: false, error: "Failed to finish match" };
    }
}

export async function getMatch(matchId: string) {
    try {
        await dbConnect();
        // Populate competition info for display if needed
        const match = await Match.findById(matchId).populate('competitionId').lean();
        if (!match) return null;

        return JSON.parse(JSON.stringify(match));
    } catch (error) {
        console.error("Error fetching match:", error);
        return null;
    }
}
