import { GameSnapshotDto } from "./GameSnapshot.dto";

export interface GameScoreDto {
    snapshots: GameSnapshotDto[];

    score: number;
    latestGainedScore: number;
    highestGainedScore: number;
    
    currentStreakLength: number;
    longestStreak: number;
    
    swipeCount: number;
    comboCount: number;
    streakCount: number;
    
    hasCombo: boolean;
}