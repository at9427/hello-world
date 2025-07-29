import React from 'react';
import { Crown, ArrowRight, Clock } from 'lucide-react';
import { Match, Team } from '../types/tournament';

interface MatchVotingProps {
  match: Match;
  onSelectWinner: (winnerId: string) => void;
  currentMatchNumber: number;
  totalMatches: number;
  roundName: string;
}

const MatchVoting: React.FC<MatchVotingProps> = ({
  match,
  onSelectWinner,
  currentMatchNumber,
  totalMatches,
  roundName
}) => {
  if (!match.team1 || !match.team2) {
    return (
      <div className="w-full max-w-4xl mx-auto p-6">
        <div className="text-center py-12">
          <Clock className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            Waiting for Previous Matches
          </h3>
          <p className="text-gray-500">
            This match will become available once the previous round is completed.
          </p>
        </div>
      </div>
    );
  }

  const handleTeamClick = (team: Team) => {
    onSelectWinner(team.id);
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Crown className="h-6 w-6 text-yellow-500" />
          <h2 className="text-2xl font-bold text-gray-800">Choose the Winner</h2>
        </div>
        <p className="text-gray-600 mb-2">
          {roundName} • Match {currentMatchNumber} of {totalMatches}
        </p>
        <div className="w-full bg-gray-200 rounded-full h-2 max-w-md mx-auto">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentMatchNumber / totalMatches) * 100}%` }}
          />
        </div>
      </div>

      {/* Match Voting Interface */}
      <div className="grid md:grid-cols-3 gap-8 items-center">
        {/* Team 1 */}
        <div className="text-center">
          <button
            onClick={() => handleTeamClick(match.team1!)}
            className="group relative w-full max-w-sm mx-auto block transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300 rounded-2xl"
          >
            <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden border-4 border-gray-200 group-hover:border-blue-400 transition-colors">
              <img
                src={match.team1!.image}
                alt={match.team1!.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 rounded-2xl transition-all duration-300" />
            <div className="absolute top-4 left-4 bg-black bg-opacity-60 text-white text-sm px-2 py-1 rounded">
              Seed #{match.team1!.seed}
            </div>
          </button>
          <h3 className="text-lg font-semibold text-gray-900 mt-4 px-2 truncate">
            {match.team1!.name}
          </h3>
          <p className="text-sm text-gray-500">Click to select winner</p>
        </div>

        {/* VS Divider */}
        <div className="text-center">
          <div className="flex items-center justify-center">
            <div className="bg-gray-100 rounded-full p-4">
              <span className="text-2xl font-bold text-gray-600">VS</span>
            </div>
          </div>
        </div>

        {/* Team 2 */}
        <div className="text-center">
          <button
            onClick={() => handleTeamClick(match.team2!)}
            className="group relative w-full max-w-sm mx-auto block transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300 rounded-2xl"
          >
            <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden border-4 border-gray-200 group-hover:border-blue-400 transition-colors">
              <img
                src={match.team2!.image}
                alt={match.team2!.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 rounded-2xl transition-all duration-300" />
            <div className="absolute top-4 left-4 bg-black bg-opacity-60 text-white text-sm px-2 py-1 rounded">
              Seed #{match.team2!.seed}
            </div>
          </button>
          <h3 className="text-lg font-semibold text-gray-900 mt-4 px-2 truncate">
            {match.team2!.name}
          </h3>
          <p className="text-sm text-gray-500">Click to select winner</p>
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-12 text-center">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
          <p className="text-sm text-blue-800">
            <strong>Instructions:</strong> Click on the image you think should advance to the next round. 
            Your choice will be final and cannot be undone.
          </p>
        </div>
      </div>

      {/* Mobile-friendly buttons for smaller screens */}
      <div className="mt-8 grid grid-cols-2 gap-4 md:hidden">
        <button
          onClick={() => handleTeamClick(match.team1!)}
          className="flex items-center justify-center gap-2 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Choose Left
          <ArrowRight className="h-4 w-4" />
        </button>
        <button
          onClick={() => handleTeamClick(match.team2!)}
          className="flex items-center justify-center gap-2 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Choose Right
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default MatchVoting;