import React, { useState, useCallback, useEffect } from 'react';
import { Trophy, Eye, ArrowLeft, RotateCcw } from 'lucide-react';
import ImageUpload from './components/ImageUpload';
import TeamAssignment from './components/TeamAssignment';
import MatchVoting from './components/MatchVoting';
import BracketDisplay from './components/BracketDisplay';
import { TournamentState, Team, Tournament, TOURNAMENT_SIZE } from './types/tournament';
import { createTeamFromImage, shuffleArray, generateBracket, advanceTournament, getNextAvailableMatch } from './utils/tournamentUtils';

const App: React.FC = () => {
  const [state, setState] = useState<TournamentState>({
    phase: 'setup',
    tournament: null,
    uploadedImages: [],
    assignmentMethod: null
  });

  const [showBracket, setShowBracket] = useState(false);

  // Handle image upload
  const handleImagesSelected = useCallback((files: File[]) => {
    setState(prev => ({
      ...prev,
      uploadedImages: files
    }));
  }, []);

  // Handle team assignment and tournament start
  const handleAssignmentComplete = useCallback(async (teams: Team[], method: 'random' | 'manual') => {
    try {
      // If random assignment, shuffle the teams
      const finalTeams = method === 'random' ? shuffleArray([...teams]) : teams;
      
      // Update seeds based on final order
      const seededTeams = finalTeams.map((team, index) => ({
        ...team,
        seed: index + 1
      }));

      // Generate tournament bracket
      const tournament = generateBracket(seededTeams);

      setState(prev => ({
        ...prev,
        phase: 'tournament',
        tournament,
        assignmentMethod: method
      }));
    } catch (error) {
      console.error('Error creating tournament:', error);
      alert('Error creating tournament. Please try again.');
    }
  }, []);

  // Handle match winner selection
  const handleMatchWinner = useCallback((winnerId: string) => {
    if (!state.tournament?.currentMatch) return;

    try {
      const updatedTournament = advanceTournament(state.tournament, state.tournament.currentMatch.id, winnerId);
      
      setState(prev => ({
        ...prev,
        tournament: updatedTournament,
        phase: updatedTournament.isComplete ? 'complete' : 'tournament'
      }));
    } catch (error) {
      console.error('Error advancing tournament:', error);
      alert('Error advancing tournament. Please try again.');
    }
  }, [state.tournament]);

  // Convert uploaded images to teams
  const convertImagesToTeams = useCallback(async (): Promise<Team[]> => {
    const teams: Team[] = [];
    for (let i = 0; i < state.uploadedImages.length; i++) {
      const team = await createTeamFromImage(state.uploadedImages[i], i);
      teams.push(team);
    }
    return teams;
  }, [state.uploadedImages]);

  // Handle proceeding from setup to assignment
  const handleProceedToAssignment = useCallback(async () => {
    if (state.uploadedImages.length === TOURNAMENT_SIZE) {
      setState(prev => ({
        ...prev,
        phase: 'team-assignment'
      }));
    }
  }, [state.uploadedImages.length]);

  // Reset tournament
  const handleReset = useCallback(() => {
    setState({
      phase: 'setup',
      tournament: null,
      uploadedImages: [],
      assignmentMethod: null
    });
    setShowBracket(false);
  }, []);

  // Get current match info for progress tracking
  const getCurrentMatchInfo = useCallback(() => {
    if (!state.tournament) return { currentMatchNumber: 0, totalMatches: 0, roundName: '' };

    const allMatches = state.tournament.rounds.flatMap(r => r.matches);
    const completedMatches = allMatches.filter(m => m.completed).length;
    const currentMatch = state.tournament.currentMatch;
    const currentRound = state.tournament.rounds.find(r => 
      r.matches.some(m => m.id === currentMatch?.id)
    );

    return {
      currentMatchNumber: completedMatches + 1,
      totalMatches: allMatches.length,
      roundName: currentRound?.name || ''
    };
  }, [state.tournament]);

  // Setup phase
  if (state.phase === 'setup') {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center gap-3">
              <Trophy className="h-8 w-8 text-yellow-500" />
              <h1 className="text-2xl font-bold text-gray-900">Image Tournament Bracket</h1>
            </div>
          </div>
        </header>

        <main className="py-8">
          <ImageUpload 
            onImagesSelected={handleImagesSelected}
            uploadedImages={state.uploadedImages}
          />
          
          {state.uploadedImages.length === TOURNAMENT_SIZE && (
            <div className="flex justify-center mt-8">
              <button
                onClick={handleProceedToAssignment}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors text-lg font-medium"
              >
                Proceed to Team Assignment
              </button>
            </div>
          )}
        </main>
      </div>
    );
  }

  // Team assignment phase
  if (state.phase === 'team-assignment') {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Trophy className="h-8 w-8 text-yellow-500" />
                <h1 className="text-2xl font-bold text-gray-900">Image Tournament Bracket</h1>
              </div>
              <button
                onClick={handleReset}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Upload
              </button>
            </div>
          </div>
        </header>

        <main className="py-8">
          <TeamAssignment
            teams={state.uploadedImages.map((file, index) => ({
              id: `temp-${index}`,
              name: file.name.replace(/\.[^/.]+$/, '') || `Team ${index + 1}`,
              image: URL.createObjectURL(file),
              seed: index + 1
            }))}
            onAssignmentComplete={async (teams, method) => {
              const actualTeams = await convertImagesToTeams();
              // Apply the same order from the assignment
              const orderedTeams = teams.map(assignedTeam => {
                const actualTeam = actualTeams.find(t => 
                  t.name === assignedTeam.name || 
                  t.image === assignedTeam.image
                );
                return actualTeam || assignedTeam;
              });
              handleAssignmentComplete(orderedTeams, method);
            }}
          />
        </main>
      </div>
    );
  }

  // Tournament and Complete phases
  const matchInfo = getCurrentMatchInfo();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Trophy className="h-8 w-8 text-yellow-500" />
              <h1 className="text-2xl font-bold text-gray-900">Image Tournament Bracket</h1>
              {state.phase === 'complete' && (
                <span className="bg-green-100 text-green-800 text-sm font-medium px-2 py-1 rounded-full">
                  Complete
                </span>
              )}
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowBracket(!showBracket)}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
              >
                <Eye className="h-4 w-4" />
                {showBracket ? 'Hide Bracket' : 'View Bracket'}
              </button>
              <button
                onClick={handleReset}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
              >
                <RotateCcw className="h-4 w-4" />
                New Tournament
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="py-8">
        {showBracket ? (
          <BracketDisplay tournament={state.tournament!} />
        ) : (
          <>
            {state.phase === 'tournament' && state.tournament?.currentMatch && (
              <MatchVoting
                match={state.tournament.currentMatch}
                onSelectWinner={handleMatchWinner}
                currentMatchNumber={matchInfo.currentMatchNumber}
                totalMatches={matchInfo.totalMatches}
                roundName={matchInfo.roundName}
              />
            )}

            {state.phase === 'complete' && (
              <div className="w-full max-w-4xl mx-auto p-6 text-center">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8">
                  <Trophy className="mx-auto h-16 w-16 text-yellow-500 mb-4" />
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    Tournament Complete!
                  </h2>
                  {state.tournament?.winner && (
                    <div className="mt-6">
                      <p className="text-lg text-gray-700 mb-4">Tournament Champion:</p>
                      <div className="flex items-center justify-center gap-4">
                        <img
                          src={state.tournament.winner.image}
                          alt={state.tournament.winner.name}
                          className="w-24 h-24 rounded-lg object-cover border-4 border-yellow-300"
                        />
                        <div>
                          <h3 className="text-2xl font-bold text-yellow-900">
                            {state.tournament.winner.name}
                          </h3>
                          <p className="text-yellow-700">
                            Seed #{state.tournament.winner.seed}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="mt-8 flex gap-4 justify-center">
                    <button
                      onClick={() => setShowBracket(true)}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      View Final Bracket
                    </button>
                    <button
                      onClick={handleReset}
                      className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      Start New Tournament
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default App;
