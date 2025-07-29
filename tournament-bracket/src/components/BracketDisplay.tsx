import React from 'react';
import { Trophy, Users, Medal, CheckCircle } from 'lucide-react';
import { Tournament, Match, Team } from '../types/tournament';

interface BracketDisplayProps {
  tournament: Tournament;
  isCompactView?: boolean;
}

interface MatchComponentProps {
  match: Match;
  isCompact?: boolean;
}

const MatchComponent: React.FC<MatchComponentProps> = ({ match, isCompact = false }) => {
  const getTeamDisplay = (team: Team | null, isWinner: boolean) => {
    if (!team) {
      return (
        <div className={`${isCompact ? 'p-1' : 'p-2'} bg-gray-100 border border-gray-200 rounded text-center text-gray-400 text-sm`}>
          TBD
        </div>
      );
    }

    return (
      <div className={`
        ${isCompact ? 'p-1' : 'p-2'} border rounded flex items-center gap-2 text-sm
        ${isWinner ? 'bg-green-100 border-green-300 text-green-800 font-semibold' : 'bg-white border-gray-200'}
        ${match.completed && !isWinner ? 'opacity-60' : ''}
      `}>
        <img 
          src={team.image} 
          alt={team.name}
          className={`${isCompact ? 'w-6 h-6' : 'w-8 h-8'} rounded object-cover flex-shrink-0`}
        />
        <div className="flex-1 min-w-0">
          <div className={`truncate ${isCompact ? 'text-xs' : 'text-sm'}`}>
            {team.name}
          </div>
          {!isCompact && (
            <div className="text-xs text-gray-500">
              Seed #{team.seed}
            </div>
          )}
        </div>
        {isWinner && match.completed && (
          <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
        )}
      </div>
    );
  };

  const isTeam1Winner = match.winner?.id === match.team1?.id;
  const isTeam2Winner = match.winner?.id === match.team2?.id;

  return (
    <div className={`bg-white border border-gray-200 rounded-lg ${isCompact ? 'p-2' : 'p-3'} shadow-sm`}>
      <div className="space-y-1">
        {getTeamDisplay(match.team1, isTeam1Winner)}
        {getTeamDisplay(match.team2, isTeam2Winner)}
      </div>
      {!isCompact && (
        <div className="mt-2 text-center">
          <span className={`text-xs px-2 py-1 rounded ${
            match.completed ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
          }`}>
            {match.completed ? 'Complete' : 'Pending'}
          </span>
        </div>
      )}
    </div>
  );
};

const BracketDisplay: React.FC<BracketDisplayProps> = ({ tournament, isCompactView = false }) => {
  const getRoundWidth = (roundNumber: number) => {
    // Adjust width based on number of matches in round
    const matchCount = tournament.rounds.find(r => r.roundNumber === roundNumber)?.matches.length || 1;
    return matchCount > 16 ? 'w-64' : matchCount > 8 ? 'w-56' : matchCount > 4 ? 'w-48' : 'w-40';
  };

  if (tournament.rounds.length === 0) {
    return (
      <div className="w-full max-w-6xl mx-auto p-6">
        <div className="text-center py-12">
          <Users className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            No Tournament Data
          </h3>
          <p className="text-gray-500">
            Tournament bracket will appear here once teams are assigned.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-6">
      <div className="mb-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Trophy className="h-6 w-6 text-yellow-500" />
          <h2 className="text-2xl font-bold text-gray-800">Tournament Bracket</h2>
        </div>
        {tournament.isComplete && tournament.winner && (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg max-w-md mx-auto">
            <div className="flex items-center justify-center gap-3">
              <Medal className="h-8 w-8 text-yellow-600" />
              <div>
                <p className="text-sm font-medium text-yellow-800">Tournament Champion</p>
                <p className="text-lg font-bold text-yellow-900">{tournament.winner.name}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Horizontal Scrollable Bracket */}
      <div className="overflow-x-auto pb-4">
        <div className="flex gap-6 min-w-max">
          {tournament.rounds.map((round) => (
            <div key={round.roundNumber} className={`flex-shrink-0 ${getRoundWidth(round.roundNumber)}`}>
              <div className="mb-4 text-center">
                <h3 className="text-lg font-semibold text-gray-800 mb-1">
                  {round.name}
                </h3>
                <p className="text-sm text-gray-600">
                  {round.matches.filter(m => m.completed).length} / {round.matches.length} complete
                </p>
              </div>
              
              <div className="space-y-4">
                {round.matches.map((match, index) => {
                  // Calculate spacing for visual connection between rounds
                  const spacing = Math.pow(2, round.roundNumber - 1) - 1;
                  const marginTop = index === 0 ? 0 : spacing * 2;
                  
                  return (
                    <div 
                      key={match.id}
                      style={{ marginTop: index === 0 ? 0 : `${spacing * 1.5}rem` }}
                    >
                      <MatchComponent match={match} isCompact={isCompactView} />
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tournament Statistics */}
      <div className="mt-8 bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Tournament Progress</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {tournament.teams.length}
            </div>
            <div className="text-sm text-gray-600">Total Teams</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {tournament.rounds.reduce((acc, round) => 
                acc + round.matches.filter(m => m.completed).length, 0
              )}
            </div>
            <div className="text-sm text-gray-600">Completed Matches</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {tournament.rounds.reduce((acc, round) => acc + round.matches.length, 0)}
            </div>
            <div className="text-sm text-gray-600">Total Matches</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {tournament.rounds.length}
            </div>
            <div className="text-sm text-gray-600">Rounds</div>
          </div>
        </div>
      </div>

      {/* Mobile view toggle */}
      <div className="mt-4 text-center md:hidden">
        <p className="text-sm text-gray-500">
          Scroll horizontally to view the complete bracket
        </p>
      </div>
    </div>
  );
};

export default BracketDisplay;