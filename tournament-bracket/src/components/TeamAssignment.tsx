import React, { useState, useCallback } from 'react';
import { Shuffle, Move, ArrowRight } from 'lucide-react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Team } from '../types/tournament';

interface TeamAssignmentProps {
  teams: Team[];
  onAssignmentComplete: (assignedTeams: Team[], method: 'random' | 'manual') => void;
}

interface DragItem {
  type: string;
  team: Team;
  fromIndex: number;
}

const DraggableTeam: React.FC<{
  team: Team;
  index: number;
  onMove: (fromIndex: number, toIndex: number) => void;
}> = ({ team, index, onMove }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'team',
    item: { type: 'team', team, fromIndex: index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ isOver }, drop] = useDrop({
    accept: 'team',
    drop: (item: DragItem) => {
      if (item.fromIndex !== index) {
        onMove(item.fromIndex, index);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return (
    <div
      ref={(node) => drag(drop(node))}
      className={`
        relative cursor-move transition-all duration-200
        ${isDragging ? 'opacity-50 scale-95' : 'opacity-100 scale-100'}
        ${isOver ? 'ring-2 ring-blue-400' : ''}
      `}
    >
      <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200 hover:border-gray-300">
        <img
          src={team.image}
          alt={team.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="absolute bottom-1 left-1 bg-black bg-opacity-60 text-white text-xs px-1 rounded">
        #{team.seed}
      </div>
    </div>
  );
};

const TeamAssignment: React.FC<TeamAssignmentProps> = ({ teams, onAssignmentComplete }) => {
  const [assignmentMethod, setAssignmentMethod] = useState<'random' | 'manual' | null>(null);
  const [manualTeams, setManualTeams] = useState<Team[]>(teams);

  const handleRandomAssignment = useCallback(() => {
    setAssignmentMethod('random');
  }, []);

  const handleManualAssignment = useCallback(() => {
    setAssignmentMethod('manual');
    setManualTeams([...teams]);
  }, [teams]);

  const moveTeam = useCallback((fromIndex: number, toIndex: number) => {
    const newTeams = [...manualTeams];
    const [movedTeam] = newTeams.splice(fromIndex, 1);
    newTeams.splice(toIndex, 0, movedTeam);
    
    // Update seeds based on new positions
    const updatedTeams = newTeams.map((team, index) => ({
      ...team,
      seed: index + 1
    }));
    
    setManualTeams(updatedTeams);
  }, [manualTeams]);

  const confirmAssignment = useCallback(() => {
    if (assignmentMethod) {
      onAssignmentComplete(
        assignmentMethod === 'random' ? teams : manualTeams,
        assignmentMethod
      );
    }
  }, [assignmentMethod, teams, manualTeams, onAssignmentComplete]);

  const resetAssignment = useCallback(() => {
    setAssignmentMethod(null);
    setManualTeams([...teams]);
  }, [teams]);

  if (!assignmentMethod) {
    return (
      <div className="w-full max-w-4xl mx-auto p-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Choose Assignment Method
          </h2>
          <p className="text-gray-600">
            How would you like to assign your teams to the tournament bracket?
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="border-2 border-gray-200 rounded-lg p-6 hover:border-blue-300 transition-colors">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Shuffle className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Random Assignment</h3>
              <p className="text-gray-600 mb-4">
                Automatically shuffle and assign teams to bracket positions randomly.
              </p>
              <button
                onClick={handleRandomAssignment}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Use Random Assignment
              </button>
            </div>
          </div>

          <div className="border-2 border-gray-200 rounded-lg p-6 hover:border-green-300 transition-colors">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Move className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Manual Assignment</h3>
              <p className="text-gray-600 mb-4">
                Drag and drop to manually arrange teams in your preferred bracket order.
              </p>
              <button
                onClick={handleManualAssignment}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
              >
                Manual Assignment
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {assignmentMethod === 'random' ? 'Random Assignment' : 'Manual Assignment'}
            </h2>
            <p className="text-gray-600">
              {assignmentMethod === 'random' 
                ? 'Teams will be randomly shuffled when the tournament starts.'
                : 'Drag and drop teams to arrange them in your preferred order.'
              }
            </p>
          </div>
          <button
            onClick={resetAssignment}
            className="text-gray-600 hover:text-gray-800 text-sm font-medium"
          >
            Change Method
          </button>
        </div>
      </div>

      {assignmentMethod === 'random' ? (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-6">
            <Shuffle className="h-12 w-12 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Random Assignment Selected
          </h3>
          <p className="text-gray-600 mb-6">
            When you start the tournament, all teams will be randomly shuffled and assigned to bracket positions.
          </p>
        </div>
      ) : (
        <DndProvider backend={HTML5Backend}>
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Instructions:</strong> Drag and drop images to reorder them. 
              The final order will determine the initial bracket seeding (1st position vs 64th, 2nd vs 63rd, etc.).
            </p>
          </div>
          
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 gap-3">
            {manualTeams.map((team, index) => (
              <DraggableTeam
                key={team.id}
                team={team}
                index={index}
                onMove={moveTeam}
              />
            ))}
          </div>
        </DndProvider>
      )}

      <div className="mt-8 flex justify-center">
        <button
          onClick={confirmAssignment}
          className="flex items-center gap-2 bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors text-lg font-medium"
        >
          Start Tournament
          <ArrowRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default TeamAssignment;