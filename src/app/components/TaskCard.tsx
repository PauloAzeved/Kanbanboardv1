import { useState } from 'react';
import { useDrag } from 'react-dnd';
import { Calendar, Flag, FolderOpen, Target, TrendingUp, X, MoreVertical, Edit2, Trash2, RotateCcw, CheckCircle, Archive } from 'lucide-react';
import { Task, Goal, KeyResult, Project } from './KanbanBoard';
import { format } from 'date-fns';

interface TaskCardProps {
  task: Task;
  goals: Goal[];
  keyResults: KeyResult[];
  projects: Project[];
  onMarkAsWontDo?: (taskId: string) => void;
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
  onRevive?: (taskId: string) => void;
  onRequestPermanentDelete?: (taskId: string) => void;
  onPreview?: (task: Task) => void;
  onArchiveNow?: (taskId: string) => void;
  onMoveToBacklog?: (taskId: string) => void;
  onMoveToToDo?: (taskId: string) => void;
}

export function TaskCard({ task, goals, keyResults, projects, onMarkAsWontDo, onEdit, onDelete, onRevive, onRequestPermanentDelete, onPreview, onArchiveNow, onMoveToBacklog, onMoveToToDo }: TaskCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'TASK',
    item: { id: task.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }), [task.id]);

  const isArchived = task.status === 'archived';

  // Find parent (either KeyResult or Project)
  let parentName = '';
  let parentGoalName = '';
  let parentIcon = null;

  if (task.parentType === 'keyResult' && task.parentId) {
    const keyResult = keyResults.find(kr => kr.id === task.parentId);
    if (keyResult) {
      parentName = keyResult.name;
      const goal = goals.find(g => g.id === keyResult.goalId);
      if (goal) {
        parentGoalName = goal.name;
      }
      parentIcon = <TrendingUp className="w-4 h-4" />;
    }
  } else if (task.parentType === 'project' && task.parentId) {
    const project = projects.find(p => p.id === task.parentId);
    if (project) {
      parentName = project.name;
      parentIcon = <FolderOpen className="w-4 h-4" />;
    }
  }

  const getImportanceColor = () => {
    switch (task.importance) {
      case 'high':
        return 'text-red-600 bg-red-50';
      case 'medium':
        return 'text-orange-600 bg-orange-50';
      case 'low':
        return 'text-blue-600 bg-blue-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getImportanceLabel = () => {
    switch (task.importance) {
      case 'high':
        return 'High';
      case 'medium':
        return 'Medium';
      case 'low':
        return 'Low';
      default:
        return '-';
    }
  };

  const getDaysInDone = () => {
    if (!task.completedAt) return null;
    const now = new Date();
    const completed = new Date(task.completedAt);
    const days = Math.floor((now.getTime() - completed.getTime()) / (1000 * 60 * 60 * 24));
    return days;
  };

  const daysInDone = getDaysInDone();

  // Check if task is completed (done or archived but not won't do)
  const isCompleted = (task.status === 'done' || (task.status === 'archived' && !task.wontDo)) && task.completedAt;

  return (
    <div
      ref={drag}
      onClick={() => onPreview && onPreview(task)}
      className={`bg-white rounded-xl p-4 shadow-[0px_3px_20px_0px_rgba(11,76,105,0.1)] cursor-pointer transition-all hover:shadow-lg relative ${
        isDragging ? 'opacity-50' : ''
      } ${
        task.wontDo 
          ? 'opacity-60 border-2 border-red-300' 
          : isCompleted
          ? 'border-2 border-[#00A63E]'
          : 'border border-[rgba(219,228,237,0.4)]'
      }`}
    >
      {/* Completed Checkmark Badge */}
      {isCompleted && (
        <div className="absolute -top-2 -right-2 bg-[#00A63E] rounded-full p-1.5 shadow-lg z-10">
          <svg 
            className="w-4 h-4 text-white" 
            fill="currentColor" 
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              fillRule="evenodd" 
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
              clipRule="evenodd"
            />
          </svg>
        </div>
      )}

      {/* Header with 3-dot menu */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <p className={`text-[#01416d] font-medium ${task.wontDo ? 'line-through' : ''}`}>
            {task.title}
          </p>
          {task.wontDo && (
            <span className="inline-block mt-2 px-2 py-1 bg-red-100 text-red-700 text-xs rounded">
              Won't Do
            </span>
          )}
        </div>

        {/* 3-dot menu */}
        <div className="relative ml-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <MoreVertical className="w-4 h-4 text-[#9ca3af]" />
          </button>

          {showMenu && (
            <>
              {/* Backdrop to close menu */}
              <div 
                className="fixed inset-0 z-10" 
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(false);
                }}
              />
              
              {/* Dropdown menu */}
              <div className="absolute right-0 top-full mt-1 bg-white border border-[rgba(219,228,237,0.4)] rounded-lg shadow-lg z-20 min-w-[140px]">
                {onEdit && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowMenu(false);
                      onEdit(task);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm text-[#01416d]"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit Task
                  </button>
                )}
                {/* Hide regular Delete option for archived tasks */}
                {onDelete && !isArchived && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowMenu(false);
                      onDelete(task.id);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-red-50 transition-colors flex items-center gap-2 text-sm text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete Task
                  </button>
                )}
                {onRevive && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowMenu(false);
                      onRevive(task.id);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm text-[#01416d]"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Revive Task
                  </button>
                )}
                {onRequestPermanentDelete && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowMenu(false);
                      onRequestPermanentDelete(task.id);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-red-50 transition-colors flex items-center gap-2 text-sm text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                    Permanently Delete Task
                  </button>
                )}
                {onPreview && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowMenu(false);
                      onPreview(task);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm text-[#01416d]"
                  >
                    <MoreVertical className="w-4 h-4" />
                    Preview Task
                  </button>
                )}
                {onArchiveNow && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowMenu(false);
                      onArchiveNow(task.id);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm text-[#01416d]"
                  >
                    <Archive className="w-4 h-4" />
                    Archive Now
                  </button>
                )}
                {onMoveToBacklog && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowMenu(false);
                      onMoveToBacklog(task.id);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm text-[#01416d]"
                  >
                    <Archive className="w-4 h-4" />
                    Move to Backlog
                  </button>
                )}
                {onMoveToToDo && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowMenu(false);
                      onMoveToToDo(task.id);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm text-[#01416d]"
                  >
                    <Archive className="w-4 h-4" />
                    Move to To-Do
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Parent (Goal > Key Result or Project) */}
      {parentName && (
        <div className="mb-2">
          {/* Show Goal name if this is a Key Result */}
          {task.parentType === 'keyResult' && parentGoalName && (
            <div className="flex items-center gap-2 text-[#6B7280] text-xs mb-1">
              <Target className="w-3 h-3" />
              <span>{parentGoalName}</span>
            </div>
          )}
          {/* Show parent (Key Result or Project) */}
          <div className="flex items-center gap-2 text-[#0083BD] text-sm">
            {parentIcon}
            <span className="font-medium">{parentName}</span>
          </div>
        </div>
      )}

      {/* Due Date and Importance */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2 text-[#575756] text-sm">
          <Calendar className="w-4 h-4" />
          <span>{task.dueDate ? format(new Date(task.dueDate), 'MMM dd, yyyy') : 'No date'}</span>
        </div>

        <div className={`flex items-center gap-1 px-2 py-1 rounded text-xs ${getImportanceColor()}`}>
          <Flag className="w-3 h-3" />
          <span>{getImportanceLabel()}</span>
        </div>
      </div>

      {/* Days in Done status */}
      {task.status === 'done' && daysInDone !== null && !task.wontDo && (
        <div className="mt-2 text-xs text-[#9ca3af]">
          In Done for {daysInDone} day{daysInDone !== 1 ? 's' : ''}
          {daysInDone >= 2 && ' (will archive soon)'}
        </div>
      )}

      {/* Won't Do Button */}
      {task.status === 'done' && !task.wontDo && onMarkAsWontDo && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onMarkAsWontDo(task.id);
          }}
          className="mt-3 w-full flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm"
        >
          <X className="w-4 h-4" />
          Mark as Won't Do
        </button>
      )}

      {/* Revive Task Button (for archived tasks) */}
      {isArchived && onRevive && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRevive(task.id);
          }}
          className="mt-3 w-full flex items-center justify-center gap-2 px-3 py-2 bg-gradient-to-r from-[#0083BD] to-[#149BD7] text-white rounded-lg hover:shadow-lg transition-all text-sm"
        >
          <RotateCcw className="w-4 h-4" />
          Revive Task
        </button>
      )}
    </div>
  );
}