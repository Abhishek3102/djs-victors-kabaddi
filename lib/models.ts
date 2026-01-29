
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IScore extends Document {
    teamA: number;
    teamB: number;
    history: { team: 'A' | 'B'; points: number; timestamp: Date }[];
}

export interface ICompetition extends Document {
    name: string;
    place: string;
    date: string;
    matches: mongoose.Types.ObjectId[]; // Reference to matches
    createdAt: Date;
    updatedAt: Date;
}

export interface IMatch extends Document {
    competitionId: mongoose.Types.ObjectId;
    teamAName: string;
    teamBName: string;
    scores: IScore;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

// Subschema for scores
const ScoreSchema = new Schema({
    teamA: { type: Number, default: 0 },
    teamB: { type: Number, default: 0 },
    history: [
        {
            team: { type: String, enum: ['A', 'B'] },
            points: { type: Number },
            timestamp: { type: Date, default: Date.now },
        },
    ],
});

const CompetitionSchema = new Schema<ICompetition>(
    {
        name: { type: String, required: true },
        place: { type: String, required: true },
        date: { type: String, required: true },
        matches: [{ type: Schema.Types.ObjectId, ref: 'Match' }],
    },
    { timestamps: true }
);

const MatchSchema = new Schema<IMatch>(
    {
        competitionId: { type: Schema.Types.ObjectId, ref: 'Competition', required: true },
        teamAName: { type: String, required: true },
        teamBName: { type: String, required: true },
        scores: { type: ScoreSchema, default: {} },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

// Models
const Competition: Model<ICompetition> = mongoose.models.Competition || mongoose.model<ICompetition>('Competition', CompetitionSchema);
const Match: Model<IMatch> = mongoose.models.Match || mongoose.model<IMatch>('Match', MatchSchema);

export { Competition, Match };
export default Match; // Default export for backward compatibility if needed, but prefer named exports
