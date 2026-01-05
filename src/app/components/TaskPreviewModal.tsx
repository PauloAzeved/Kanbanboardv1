import { X, Calendar, Flag, FolderOpen, Target, TrendingUp, Edit2, Trash2, RotateCcw, ArrowRight } from 'lucide-react';
import { Task, Goal, KeyResult, Project } from './KanbanBoard';
import { format } from 'date-fns';

interface TaskPreviewModalProps {
  task: Task;
  goals: Goal[];
  keyResults: KeyResult[];
  projects: Project[];
  onClose: () => void;
  onEdit: () => void;
  onDelete?: () => void;
  onRevive?: () => void;
  onPermanentDelete?: () => void;
  onMove?: (newStatus: 'todo' | 'in-progress' | 'done') => void;
}

export function TaskPreviewModal({
  task,
  goals,
  keyResults,
  projects,
  onClose,
  onEdit,
  onDelete,
  onRevive,
  onPermanentDelete,
  onMove
}: TaskPreviewModalProps) {
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
      parentIcon = <TrendingUp className="w-5 h-5" />;
    }
  } else if (task.parentType === 'project' && task.parentId) {
    const project = projects.find(p => p.id === task.parentId);
    if (project) {
      parentName = project.name;
      parentIcon = <FolderOpen className="w-5 h-5" />;
    }
  }

  const getImportanceColor = () => {
    switch (task.importance) {
      case 'high':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'medium':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'low':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
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
        return 'Not Set';
    }
  };

  const getStatusLabel = () => {
    switch (task.status) {
      case 'todo':
        return 'To Do';
      case 'in-progress':
        return 'In Progress';
      case 'done':
        return 'Done';
      case 'archived':
        return 'Archived';
      default:
        return task.status;
    }
  };

  const getStatusColor = () => {
    switch (task.status) {
      case 'todo':
        return 'bg-gradient-to-r from-[#0083BD] to-[#149BD7]';
      case 'in-progress':
        return 'bg-gradient-to-r from-[#FF9500] to-[#FFB84D]';
      case 'done':
        return 'bg-gradient-to-r from-[#00A63E] to-[#00C950]';
      case 'archived':
        return 'bg-gradient-to-r from-[#6B7280] to-[#9CA3AF]';
      default:
        return 'bg-gradient-to-r from-[#0083BD] to-[#149BD7]';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl z-10">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className={`px-3 py-1 rounded-full text-white text-sm ${getStatusColor()}`}>
                  {getStatusLabel()}
                </span>
                {task.wontDo && (
                  <span className="px-3 py-1 bg-red-100 text-red-700 text-sm rounded-full">
                    Won't Do
                  </span>
                )}
              </div>
              <h2 className={`text-2xl font-bold text-[#01416d] ${task.wontDo ? 'line-through' : ''}`}>
                {task.title}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
            >
              <X className="w-5 h-5 text-[#9ca3af]" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Description */}
          <div>
            <h3 className="text-sm font-semibold text-[#575756] mb-2">Description</h3>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <p className="text-[#01416d] whitespace-pre-wrap">
                {task.description || 'No description provided.'}
              </p>
            </div>
          </div>

          {/* Parent Info */}
          {parentName && (
            <div>
              <h3 className="text-sm font-semibold text-[#575756] mb-2">Associated With</h3>
              <div className="space-y-2">
                {task.parentType === 'keyResult' && parentGoalName && (
                  <div className="flex items-center gap-2 text-[#6B7280]">
                    <Target className="w-4 h-4" />
                    <span>Goal: {parentGoalName}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-[#0083BD]">
                  {parentIcon}
                  <span className="font-medium">
                    {task.parentType === 'keyResult' ? 'Key Result' : 'Project'}: {parentName}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Due Date */}
            <div>
              <h3 className="text-sm font-semibold text-[#575756] mb-2">Due Date</h3>
              <div className="flex items-center gap-2 text-[#01416d]">
                <Calendar className="w-5 h-5 text-[#0083BD]" />
                <span>{task.dueDate ? format(new Date(task.dueDate), 'MMM dd, yyyy') : 'No date set'}</span>
              </div>
            </div>

            {/* Importance */}
            <div>
              <h3 className="text-sm font-semibold text-[#575756] mb-2">Importance</h3>
              <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border ${getImportanceColor()}`}>
                <Flag className="w-4 h-4" />
                <span className="font-medium">{getImportanceLabel()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 rounded-b-2xl">
          {/* Move To Section for Active Tasks */}
          {!isArchived && onMove && (
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-[#575756] mb-3">Move To</h3>
              <div className="flex items-center gap-3 flex-wrap">
                {task.status !== 'todo' && (
                  <button
                    onClick={() => onMove('todo')}
                    className="px-4 py-2 bg-gradient-to-r from-[#0083BD] to-[#149BD7] text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2"
                  >
                    <ArrowRight className="w-4 h-4" />
                    To Do
                  </button>
                )}
                {task.status !== 'in-progress' && (
                  <button
                    onClick={() => onMove('in-progress')}
                    className="px-4 py-2 bg-gradient-to-r from-[#FF9500] to-[#FFB84D] text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2"
                  >
                    <ArrowRight className="w-4 h-4" />
                    In Progress
                  </button>
                )}
                {task.status !== 'done' && (
                  <button
                    onClick={() => onMove('done')}
                    className="px-4 py-2 bg-gradient-to-r from-[#00A63E] to-[#00C950] text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2"
                  >
                    <ArrowRight className="w-4 h-4" />
                    Done
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 flex-wrap">
            {isArchived ? (
              <>
                {/* Archived task actions */}
                <button
                  onClick={onEdit}
                  className="px-6 py-3 bg-white border border-[#0083BD] text-[#0083BD] rounded-xl hover:bg-[#0083BD]/10 transition-colors flex items-center gap-2"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit Task
                </button>
                {onRevive && (
                  <button
                    onClick={onRevive}
                    className="px-6 py-3 bg-gradient-to-r from-[#0083BD] to-[#149BD7] text-white rounded-xl hover:shadow-lg transition-all flex items-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Revive Task
                  </button>
                )}
                {onPermanentDelete && (
                  <button
                    onClick={onPermanentDelete}
                    className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete Permanently
                  </button>
                )}
              </>
            ) : (
              <>
                {/* Active task actions */}
                <button
                  onClick={onEdit}
                  className="px-6 py-3 bg-white border border-[#0083BD] text-[#0083BD] rounded-xl hover:bg-[#0083BD]/10 transition-colors flex items-center gap-2"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit Task
                </button>
                {onDelete && (
                  <button
                    onClick={onDelete}
                    className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete Task
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}