import { v4 as uuidv4 } from 'uuid';
import { Team, Match, Round, Tournament, TOURNAMENT_SIZE, getRoundName } from '../types/tournament';

export const createTeamFromImage = (file: File, index: number): Promise<Team> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const team: Team = {
        id: uuidv4(),
        name: file.name.replace(/\.[^/.]+$/, '') || `Team ${index + 1}`,
        image: e.target?.result as string,
        seed: index + 1
      };
      resolve(team);
    };
    reader.readAsDataURL(file);
  });
};

export const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const generateBracket = (teams: Team[]): Tournament => {
  if (teams.length !== TOURNAMENT_SIZE) {
    throw new Error(`Tournament requires exactly ${TOURNAMENT_SIZE} teams`);
  }

  const tournament: Tournament = {
    id: uuidv4(),
    name: 'Image Tournament',
    teams,
    rounds: [],
    currentMatch: null,
    winner: null,
    isComplete: false
  };

  // Calculate number of rounds (log2 of 64 = 6 rounds)
  const totalRounds = Math.log2(TOURNAMENT_SIZE);
  
  // Generate all rounds
  for (let roundNum = 1; roundNum <= totalRounds; roundNum++) {
    const matchesInRound = TOURNAMENT_SIZE / Math.pow(2, roundNum);
    const matches: Match[] = [];

    for (let matchPos = 0; matchPos < matchesInRound; matchPos++) {
      const match: Match = {
        id: uuidv4(),
        team1: null,
        team2: null,
        winner: null,
        round: roundNum,
        position: matchPos,
        completed: false
      };

      // For first round, assign teams
      if (roundNum === 1) {
        match.team1 = teams[matchPos * 2];
        match.team2 = teams[matchPos * 2 + 1];
      }

      matches.push(match);
    }

    const round: Round = {
      roundNumber: roundNum,
      matches,
      name: getRoundName(roundNum, totalRounds)
    };

    tournament.rounds.push(round);
  }

  // Set first match as current
  if (tournament.rounds[0]?.matches[0]) {
    tournament.currentMatch = tournament.rounds[0].matches[0];
  }

  return tournament;
};

export const advanceTournament = (tournament: Tournament, matchId: string, winnerId: string): Tournament => {
  const updatedTournament = JSON.parse(JSON.stringify(tournament)) as Tournament;
  
  // Find and update the completed match
  let completedMatch: Match | null = null;
  for (const round of updatedTournament.rounds) {
    const match = round.matches.find(m => m.id === matchId);
    if (match) {
      match.completed = true;
      match.winner = match.team1?.id === winnerId ? match.team1 : match.team2;
      completedMatch = match;
      break;
    }
  }

  if (!completedMatch) {
    throw new Error('Match not found');
  }

  // Advance winner to next round
  const nextRoundNumber = completedMatch.round + 1;
  const nextRound = updatedTournament.rounds.find(r => r.roundNumber === nextRoundNumber);
  
  if (nextRound) {
    const nextMatchPosition = Math.floor(completedMatch.position / 2);
    const nextMatch = nextRound.matches[nextMatchPosition];
    
    if (nextMatch) {
      if (completedMatch.position % 2 === 0) {
        nextMatch.team1 = completedMatch.winner;
      } else {
        nextMatch.team2 = completedMatch.winner;
      }
    }
  } else {
    // Tournament is complete
    updatedTournament.winner = completedMatch.winner;
    updatedTournament.isComplete = true;
    updatedTournament.currentMatch = null;
    return updatedTournament;
  }

  // Find next uncompleted match
  for (const round of updatedTournament.rounds) {
    for (const match of round.matches) {
      if (!match.completed && match.team1 && match.team2) {
        updatedTournament.currentMatch = match;
        return updatedTournament;
      }
    }
  }

  // If no more matches are ready, find the first incomplete match in the earliest round
  for (const round of updatedTournament.rounds) {
    for (const match of round.matches) {
      if (!match.completed) {
        updatedTournament.currentMatch = match;
        return updatedTournament;
      }
    }
  }

  return updatedTournament;
};

export const getNextAvailableMatch = (tournament: Tournament): Match | null => {
  for (const round of tournament.rounds) {
    for (const match of round.matches) {
      if (!match.completed && match.team1 && match.team2) {
        return match;
      }
    }
  }
  return null;
};