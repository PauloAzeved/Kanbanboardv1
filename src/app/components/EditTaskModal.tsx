import { useState } from 'react';
import { X, TrendingUp, FolderOpen, Flag, ChevronRight } from 'lucide-react';
import { Goal, KeyResult, Project, Task, Importance } from './KanbanBoard';

interface EditTaskModalProps {
  onClose: () => void;
  onSave: (updates: Partial<Task>) => void;
  task: Task;
  goals: Goal[];
  keyResults: KeyResult[];
  projects: Project[];
}

export function EditTaskModal({ onClose, onSave, task, goals, keyResults, projects }: EditTaskModalProps) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [dueDate, setDueDate] = useState(task.dueDate);
  const [importance, setImportance] = useState<Importance>(task.importance);
  const [parentType, setParentType] = useState<'keyResult' | 'project' | null>(task.parentType);
  const [parentId, setParentId] = useState<string | null>(task.parentId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onSave({
        title: title.trim(),
        description: description.trim(),
        dueDate,
        importance,
        parentId,
        parentType
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 relative my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-[#9ca3af] hover:text-[#01416d] transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Header */}
        <h2 className="text-[22px] font-bold text-[#01416d] mb-6">
          Edit Task
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-[#01416d] font-medium mb-2">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title..."
              className="w-full px-4 py-3 border border-[rgba(219,228,237,0.4)] rounded-xl focus:outline-none focus:border-[#0083BD] focus:ring-2 focus:ring-[rgba(0,131,189,0.1)] transition-all"
              autoFocus
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-[#01416d] font-medium mb-2">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter task description..."
              className="w-full px-4 py-3 border border-[rgba(219,228,237,0.4)] rounded-xl focus:outline-none focus:border-[#0083BD] focus:ring-2 focus:ring-[rgba(0,131,189,0.1)] transition-all resize-none"
              rows={3}
            />
          </div>

          {/* Due Date */}
          <div>
            <label htmlFor="dueDate" className="block text-[#01416d] font-medium mb-2">
              Due Date
            </label>
            <input
              id="dueDate"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-4 py-3 border border-[rgba(219,228,237,0.4)] rounded-xl focus:outline-none focus:border-[#0083BD] focus:ring-2 focus:ring-[rgba(0,131,189,0.1)] transition-all"
            />
          </div>

          {/* Importance */}
          <div>
            <label className="block text-[#01416d] font-medium mb-3">
              Importance
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { value: 'high', label: 'High', color: 'red' },
                { value: 'medium', label: 'Medium', color: 'orange' },
                { value: 'low', label: 'Low', color: 'blue' },
                { value: 'none', label: '-', color: 'gray' }
              ].map(option => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setImportance(option.value as Importance)}
                  className={`flex items-center justify-center gap-1 px-3 py-2 rounded-lg border-2 transition-all ${
                    importance === option.value
                      ? `border-${option.color}-600 bg-${option.color}-50 text-${option.color}-700`
                      : 'border-[rgba(219,228,237,0.4)] text-[#575756] hover:border-gray-400'
                  }`}
                >
                  <Flag className="w-4 h-4" />
                  <span className="text-sm">{option.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Parent Type Selection */}
          <div>
            <label className="block text-[#01416d] font-medium mb-3">
              Associate with (Optional)
            </label>
            <div className="grid grid-cols-3 gap-2 mb-3">
              <button
                type="button"
                onClick={() => {
                  setParentType(null);
                  setParentId(null);
                }}
                className={`px-3 py-2 rounded-lg border-2 transition-all text-sm ${
                  parentType === null
                    ? 'border-[#0083BD] bg-[rgba(0,131,189,0.1)] text-[#0083BD]'
                    : 'border-[rgba(219,228,237,0.4)] text-[#575756] hover:border-gray-400'
                }`}
              >
                None
              </button>
              <button
                type="button"
                onClick={() => {
                  setParentType('keyResult');
                  setParentId(null);
                }}
                className={`flex items-center justify-center gap-1 px-3 py-2 rounded-lg border-2 transition-all text-sm ${
                  parentType === 'keyResult'
                    ? 'border-[#0083BD] bg-[rgba(0,131,189,0.1)] text-[#0083BD]'
                    : 'border-[rgba(219,228,237,0.4)] text-[#575756] hover:border-gray-400'
                }`}
              >
                <TrendingUp className="w-4 h-4" />
                Key Result
              </button>
              <button
                type="button"
                onClick={() => {
                  setParentType('project');
                  setParentId(null);
                }}
                className={`flex items-center justify-center gap-1 px-3 py-2 rounded-lg border-2 transition-all text-sm ${
                  parentType === 'project'
                    ? 'border-[#0083BD] bg-[rgba(0,131,189,0.1)] text-[#0083BD]'
                    : 'border-[rgba(219,228,237,0.4)] text-[#575756] hover:border-gray-400'
                }`}
              >
                <FolderOpen className="w-4 h-4" />
                Project
              </button>
            </div>

            {/* Key Result Selection with Tree Structure */}
            {parentType === 'keyResult' && (
              <div className="border border-[rgba(219,228,237,0.4)] rounded-xl p-2 max-h-60 overflow-y-auto">
                {goals.length === 0 ? (
                  <p className="text-sm text-[#9ca3af] p-3">
                    No goals or key results available. Create them first!
                  </p>
                ) : (
                  <div className="space-y-1">
                    {goals.map(goal => {
                      const goalKeyResults = keyResults.filter(kr => kr.goalId === goal.id);
                      return (
                        <div key={goal.id}>
                          {/* Goal Header */}
                          <div className="flex items-center gap-2 px-3 py-2 text-[#01416d] font-medium text-sm bg-[rgba(0,131,189,0.05)] rounded-lg">
                            <ChevronRight className="w-4 h-4" />
                            {goal.name}
                          </div>
                          
                          {/* Key Results under this Goal */}
                          {goalKeyResults.length > 0 ? (
                            <div className="ml-6 mt-1 space-y-1">
                              {goalKeyResults.map(kr => (
                                <button
                                  key={kr.id}
                                  type="button"
                                  onClick={() => setParentId(kr.id)}
                                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all flex items-center gap-2 ${
                                    parentId === kr.id
                                      ? 'bg-[#0083BD] text-white'
                                      : 'hover:bg-gray-50 text-[#575756]'
                                  }`}
                                >
                                  <TrendingUp className="w-4 h-4" />
                                  {kr.name}
                                </button>
                              ))}
                            </div>
                          ) : (
                            <div className="ml-6 mt-1 text-xs text-[#9ca3af] px-3 py-2">
                              No key results for this goal
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Project Selection */}
            {parentType === 'project' && (
              <select
                value={parentId || ''}
                onChange={(e) => setParentId(e.target.value || null)}
                className="w-full px-4 py-3 border border-[rgba(219,228,237,0.4)] rounded-xl focus:outline-none focus:border-[#0083BD] focus:ring-2 focus:ring-[rgba(0,131,189,0.1)] transition-all"
              >
                <option value="">Select a project...</option>
                {projects.map(project => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            )}

            {parentType === 'project' && projects.length === 0 && (
              <p className="text-sm text-[#9ca3af] mt-2">
                No projects available. Create one first!
              </p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-[rgba(219,228,237,0.4)] text-[#575756] rounded-xl hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!title.trim()}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-[#0083BD] to-[#149BD7] text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}