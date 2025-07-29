export interface Team {
  id: string;
  name: string;
  image: string; // Base64 or URL
  seed?: number;
}

export interface Match {
  id: string;
  team1: Team | null;
  team2: Team | null;
  winner: Team | null;
  round: number;
  position: number;
  completed: boolean;
}

export interface Round {
  roundNumber: number;
  matches: Match[];
  name: string; // e.g., "Round 1", "Quarter Finals", "Semi Finals", "Final"
}

export interface Tournament {
  id: string;
  name: string;
  teams: Team[];
  rounds: Round[];
  currentMatch: Match | null;
  winner: Team | null;
  isComplete: boolean;
}

export interface TournamentState {
  phase: 'setup' | 'team-assignment' | 'tournament' | 'complete';
  tournament: Tournament | null;
  uploadedImages: File[];
  assignmentMethod: 'random' | 'manual' | null;
}

export const TOURNAMENT_SIZE = 64;

export const getRoundName = (roundNumber: number, totalRounds: number): string => {
  const roundsFromEnd = totalRounds - roundNumber + 1;
  
  switch (roundsFromEnd) {
    case 1:
      return 'Final';
    case 2:
      return 'Semi Finals';
    case 3:
      return 'Quarter Finals';
    case 4:
      return 'Round of 16';
    case 5:
      return 'Round of 32';
    case 6:
      return 'Round of 64';
    default:
      return `Round ${roundNumber}`;
  }
};