import BaseObject from "../BaseObject";
import BaseScene from "../../scenes/BaseScene";
import { EnvironmentDto } from "../../dtos/Environment.dto";
import { GameScoreDto } from "./dtos/GameScore.dto";
import { GameSnapshotDto } from "./dtos/GameSnapshot.dto";

export default class GameScoreManager extends BaseObject {
    private currentGameScore: GameScoreDto;

    static readonly SCORE_COMBO_MAXIMUM_ELAPSED = 500;
    static readonly SCORE_BASE_POINTS = 10;
    static readonly SCORE_COMBO_MULTIPLIER_VALUE = 2;
    static readonly SCORE_STREAK_MAX_VALUE = 10;
    static readonly INTERPOLATION_MULTIPLIER_START_VALUE = 10;
    static readonly INTERPOLATION_MULTIPLIER_FRACTION = 0.33;
    static readonly INTERPOLATION_MULTIPLIER_EXPONENT_FACTOR = 0.5;

    constructor(name: string, scene: BaseScene, options: any, envs: EnvironmentDto) {
        super(name, scene, options, envs);
    }

    startNewGame() {
        this.currentGameScore = {
            snapshots: [],
            score: 0,
            latestGainedScore: 0,
            highestGainedScore: 0,
            currentStreakLength: 0,
            longestStreak: 0,
            swipeCount: 0,
            comboCount: 0,
            streakCount: 0,
            hasCombo: false,
        };
    }

    finishGame() {
        console.log("Gamescore", this.currentGameScore);
    }

    getCurrentGameScore(): GameScoreDto {
        return this.currentGameScore;
    }

    addGameSnapshot(snapshot: GameSnapshotDto) {
        this.currentGameScore.snapshots.push(snapshot);

        const hasStreak = snapshot.triesBeforeCorrect === 0;
        const hasCombo = snapshot.elapsedInMillies <= GameScoreManager.SCORE_COMBO_MAXIMUM_ELAPSED;
        let score = GameScoreManager.SCORE_BASE_POINTS;

        if (hasCombo) {
            score *= GameScoreManager.SCORE_COMBO_MULTIPLIER_VALUE;
        }

        if (hasStreak) {
            this.currentGameScore.currentStreakLength += 1;
            score *= Math.min(this.currentGameScore.currentStreakLength, GameScoreManager.SCORE_STREAK_MAX_VALUE);
        } else {
            this.currentGameScore.currentStreakLength = 0;
        }

        const multiplier = GameScoreManager.INTERPOLATION_MULTIPLIER_START_VALUE * Math.pow(GameScoreManager.INTERPOLATION_MULTIPLIER_FRACTION, GameScoreManager.INTERPOLATION_MULTIPLIER_EXPONENT_FACTOR * snapshot.elapsedInMillies / 1000);
        console.log("Multiplier", multiplier, GameScoreManager.INTERPOLATION_MULTIPLIER_START_VALUE, snapshot.elapsedInMillies)

        score *= Math.max(multiplier, 1);

        this.currentGameScore.latestGainedScore = score;
        this.currentGameScore.score += score;
        this.currentGameScore.swipeCount += 1;

        this.currentGameScore.highestGainedScore = Math.max(this.currentGameScore.highestGainedScore, this.currentGameScore.latestGainedScore);
        this.currentGameScore.longestStreak = Math.max(this.currentGameScore.longestStreak, this.currentGameScore.currentStreakLength);

        if (hasCombo) {
            this.currentGameScore.comboCount += 1;
        }

        if (hasStreak && this.currentGameScore.currentStreakLength === 2) {
            this.currentGameScore.streakCount += 1;
        }
    }
}