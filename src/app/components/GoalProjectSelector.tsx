import { Target, FolderOpen, ChevronDown, X } from 'lucide-react';
import { Goal, KeyResult, Project } from './KanbanBoard';
import { useState } from 'react';

interface GoalProjectSelectorProps {
  goals: Goal[];
  keyResults: KeyResult[];
  projects: Project[];
  selectedParent: string | null;
  onSelectParent: (id: string | null) => void;
  selectedParentType: 'goal' | 'project' | null;
  onSelectParentType: (type: 'goal' | 'project' | null) => void;
  hideGoalTasks: boolean;
  onHideGoalTasks: (hide: boolean) => void;
  hideProjectTasks: boolean;
  onHideProjectTasks: (hide: boolean) => void;
  hiddenGoalIds: Set<string>;
  onHiddenGoalIdsChange: (ids: Set<string>) => void;
  hiddenProjectIds: Set<string>;
  onHiddenProjectIdsChange: (ids: Set<string>) => void;
}

export function GoalProjectSelector({ 
  goals, 
  keyResults, 
  projects, 
  selectedParent, 
  onSelectParent,
  selectedParentType,
  onSelectParentType,
  hideGoalTasks,
  onHideGoalTasks,
  hideProjectTasks,
  onHideProjectTasks,
  hiddenGoalIds,
  onHiddenGoalIdsChange,
  hiddenProjectIds,
  onHiddenProjectIdsChange
}: GoalProjectSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleGoal = (goalId: string) => {
    const newHidden = new Set(hiddenGoalIds);
    if (newHidden.has(goalId)) {
      newHidden.delete(goalId);
    } else {
      newHidden.add(goalId);
    }
    onHiddenGoalIdsChange(newHidden);
  };

  const toggleProject = (projectId: string) => {
    const newHidden = new Set(hiddenProjectIds);
    if (newHidden.has(projectId)) {
      newHidden.delete(projectId);
    } else {
      newHidden.add(projectId);
    }
    onHiddenProjectIdsChange(newHidden);
  };

  const selectAll = () => {
    onHiddenGoalIdsChange(new Set());
    onHiddenProjectIdsChange(new Set());
  };

  const deselectAll = () => {
    onHiddenGoalIdsChange(new Set(goals.map(g => g.id)));
    onHiddenProjectIdsChange(new Set(projects.map(p => p.id)));
  };

  const visibleCount = goals.length - hiddenGoalIds.size + projects.length - hiddenProjectIds.size;
  const totalCount = goals.length + projects.length;

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-[#575756] text-sm font-medium">Filter by:</span>
      
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 bg-white/80 border border-[rgba(219,228,237,0.4)] text-[#01416d] px-4 py-3 rounded-xl cursor-pointer hover:border-[#0083BD] transition-colors h-[48px]"
        >
          <span>{visibleCount === totalCount ? 'All' : `${visibleCount} of ${totalCount}`} items</span>
          <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 z-10" 
              onClick={() => setIsOpen(false)}
            />
            
            {/* Dropdown */}
            <div className="absolute top-full left-0 mt-2 bg-white border border-[rgba(219,228,237,0.4)] rounded-xl shadow-lg z-20 min-w-[320px] max-h-[500px] overflow-y-auto">
              {/* Quick Actions */}
              <div className="p-4 border-b border-[rgba(219,228,237,0.4)] flex gap-2">
                <button
                  onClick={selectAll}
                  className="flex-1 px-3 py-2 bg-[#0083BD] text-white rounded-lg text-sm hover:bg-[#01416d] transition-colors"
                >
                  Select All
                </button>
                <button
                  onClick={deselectAll}
                  className="flex-1 px-3 py-2 bg-gray-100 text-[#575756] rounded-lg text-sm hover:bg-gray-200 transition-colors"
                >
                  Deselect All
                </button>
              </div>

              {/* Goals */}
              {goals.length > 0 && (
                <div className="py-2">
                  <div className="px-4 py-2 text-xs font-semibold text-[#9ca3af] uppercase">
                    Goals
                  </div>
                  {goals.map(goal => (
                    <label
                      key={goal.id}
                      className="flex items-center gap-3 px-4 py-2 hover:bg-[rgba(0,131,189,0.05)] transition-colors cursor-pointer"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        type="checkbox"
                        checked={!hiddenGoalIds.has(goal.id)}
                        onChange={() => toggleGoal(goal.id)}
                        className="w-4 h-4 text-[#0083BD] bg-white border-gray-300 rounded focus:ring-[#0083BD] focus:ring-2 cursor-pointer"
                      />
                      <Target className="w-4 h-4 text-[#0083BD]" />
                      <span className="text-sm text-[#01416d]">{goal.name}</span>
                    </label>
                  ))}
                </div>
              )}

              {/* Projects */}
              {projects.length > 0 && (
                <>
                  {goals.length > 0 && <div className="border-t border-[rgba(219,228,237,0.4)] my-1" />}
                  <div className="py-2">
                    <div className="px-4 py-2 text-xs font-semibold text-[#9ca3af] uppercase">
                      Projects
                    </div>
                    {projects.map(project => (
                      <label
                        key={project.id}
                        className="flex items-center gap-3 px-4 py-2 hover:bg-[rgba(0,131,189,0.05)] transition-colors cursor-pointer"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          type="checkbox"
                          checked={!hiddenProjectIds.has(project.id)}
                          onChange={() => toggleProject(project.id)}
                          className="w-4 h-4 text-[#0083BD] bg-white border-gray-300 rounded focus:ring-[#0083BD] focus:ring-2 cursor-pointer"
                        />
                        <FolderOpen className="w-4 h-4 text-[#0083BD]" />
                        <span className="text-sm text-[#01416d]">{project.name}</span>
                      </label>
                    ))}
                  </div>
                </>
              )}

              {goals.length === 0 && projects.length === 0 && (
                <div className="px-4 py-3 text-sm text-[#9ca3af] text-center">
                  No goals or projects yet
                </div>
              )}

              {/* Divider before hide options */}
              <div className="border-t border-[rgba(219,228,237,0.4)] my-1" />

              {/* Hide Options */}
              <div className="px-4 py-3 space-y-2">
                <div className="text-xs font-semibold text-[#9ca3af] uppercase mb-2">
                  Hide Options
                </div>
                
                <label 
                  className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  <input
                    type="checkbox"
                    checked={hideGoalTasks}
                    onChange={(e) => {
                      onHideGoalTasks(e.target.checked);
                    }}
                    className="w-4 h-4 text-[#0083BD] bg-white border-gray-300 rounded focus:ring-[#0083BD] focus:ring-2 cursor-pointer"
                  />
                  <span className="text-[#01416d] text-sm">Hide Goal tasks</span>
                </label>

                <label 
                  className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  <input
                    type="checkbox"
                    checked={hideProjectTasks}
                    onChange={(e) => {
                      onHideProjectTasks(e.target.checked);
                    }}
                    className="w-4 h-4 text-[#0083BD] bg-white border-gray-300 rounded focus:ring-[#0083BD] focus:ring-2 cursor-pointer"
                  />
                  <span className="text-[#01416d] text-sm">Hide Project tasks</span>
                </label>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}