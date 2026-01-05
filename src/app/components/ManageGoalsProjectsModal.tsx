import { useState } from 'react';
import { X, Edit2, Trash2, Plus, Target, TrendingUp, FolderOpen, ChevronDown, ChevronRight, AlertTriangle } from 'lucide-react';
import { Goal, KeyResult, Project, Task } from './KanbanBoard';

interface ManageGoalsProjectsModalProps {
  isOpen: boolean;
  onClose: () => void;
  goals: Goal[];
  keyResults: KeyResult[];
  projects: Project[];
  tasks: Task[];
  onUpdateGoal: (id: string, name: string) => void;
  onDeleteGoal: (id: string) => void;
  onUpdateKeyResult: (id: string, name: string) => void;
  onDeleteKeyResult: (id: string) => void;
  onUpdateProject: (id: string, name: string) => void;
  onDeleteProject: (id: string) => void;
  onCreateNew: () => void;
  onAddKeyResult: (name: string, goalId: string) => void;
  onAddProject: (name: string) => void;
}

type TabType = 'hierarchy' | 'projects';

interface DeleteConfirmation {
  type: 'goal' | 'keyResult' | 'project';
  id: string;
  name: string;
  affectedCount: number;
}

export function ManageGoalsProjectsModal({
  isOpen,
  onClose,
  goals,
  keyResults,
  projects,
  tasks,
  onUpdateGoal,
  onDeleteGoal,
  onUpdateKeyResult,
  onDeleteKeyResult,
  onUpdateProject,
  onDeleteProject,
  onCreateNew,
  onAddKeyResult,
  onAddProject
}: ManageGoalsProjectsModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('hierarchy');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [expandedGoals, setExpandedGoals] = useState<Set<string>>(new Set(goals.map(g => g.id)));
  const [deleteConfirmation, setDeleteConfirmation] = useState<DeleteConfirmation | null>(null);
  const [addingKeyResultForGoal, setAddingKeyResultForGoal] = useState<string | null>(null);
  const [newKeyResultName, setNewKeyResultName] = useState('');
  const [addingProject, setAddingProject] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');

  if (!isOpen) return null;

  const startEdit = (id: string, currentName: string) => {
    setEditingId(id);
    setEditingName(currentName);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingName('');
  };

  const saveEdit = (type: 'goal' | 'keyResult' | 'project', id: string) => {
    if (!editingName.trim()) return;
    
    if (type === 'goal') {
      onUpdateGoal(id, editingName);
    } else if (type === 'keyResult') {
      onUpdateKeyResult(id, editingName);
    } else {
      onUpdateProject(id, editingName);
    }
    
    cancelEdit();
  };

  const toggleGoalExpand = (goalId: string) => {
    const newExpanded = new Set(expandedGoals);
    if (newExpanded.has(goalId)) {
      newExpanded.delete(goalId);
    } else {
      newExpanded.add(goalId);
    }
    setExpandedGoals(newExpanded);
  };

  const getTaskCount = (parentId: string, parentType: 'keyResult' | 'project') => {
    return tasks.filter(t => t.parentId === parentId && t.parentType === parentType && t.status !== 'archived').length;
  };

  const handleDeleteRequest = (type: 'goal' | 'keyResult' | 'project', id: string, name: string) => {
    let affectedCount = 0;
    
    if (type === 'goal') {
      // Count key results and their tasks
      const goalKeyResults = keyResults.filter(kr => kr.goalId === id);
      affectedCount = goalKeyResults.length;
      goalKeyResults.forEach(kr => {
        affectedCount += getTaskCount(kr.id, 'keyResult');
      });
    } else if (type === 'keyResult') {
      // Count tasks
      affectedCount = getTaskCount(id, 'keyResult');
    } else if (type === 'project') {
      // Count tasks
      affectedCount = getTaskCount(id, 'project');
    }
    
    setDeleteConfirmation({ type, id, name, affectedCount });
  };

  const confirmDelete = () => {
    if (!deleteConfirmation) return;
    
    const { type, id } = deleteConfirmation;
    
    if (type === 'goal') {
      onDeleteGoal(id);
    } else if (type === 'keyResult') {
      onDeleteKeyResult(id);
    } else {
      onDeleteProject(id);
    }
    
    setDeleteConfirmation(null);
  };

  const cancelDelete = () => {
    setDeleteConfirmation(null);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-[#dbe4ed]">
            <div>
              <h2 className="text-[24px] font-bold text-[#01416d]">Manage Goals, Key Results & Projects</h2>
              <p className="text-[#575756] text-[14px] mt-1">View, edit, and organize your hierarchy</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-[#575756]" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 px-6 pt-4 border-b border-[#dbe4ed]">
            <button
              onClick={() => setActiveTab('hierarchy')}
              className={`px-4 py-2 rounded-t-lg transition-all flex items-center gap-2 ${
                activeTab === 'hierarchy'
                  ? 'bg-gradient-to-r from-[#0083BD] to-[#149BD7] text-white'
                  : 'bg-gray-100 text-[#575756] hover:bg-gray-200'
              }`}
            >
              <Target className="w-4 h-4" />
              Goals & Key Results ({goals.length} / {keyResults.length})
            </button>
            <button
              onClick={() => setActiveTab('projects')}
              className={`px-4 py-2 rounded-t-lg transition-all flex items-center gap-2 ${
                activeTab === 'projects'
                  ? 'bg-gradient-to-r from-[#0083BD] to-[#149BD7] text-white'
                  : 'bg-gray-100 text-[#575756] hover:bg-gray-200'
              }`}
            >
              <FolderOpen className="w-4 h-4" />
              Projects ({projects.length})
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Hierarchy Tab (Goals & Key Results) */}
            {activeTab === 'hierarchy' && (
              <div className="space-y-3">
                {goals.length === 0 ? (
                  <div className="text-center py-12 text-[#9ca3af]">
                    <Target className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No goals yet</p>
                  </div>
                ) : (
                  goals.map(goal => {
                    const goalKeyResults = keyResults.filter(kr => kr.goalId === goal.id);
                    const isExpanded = expandedGoals.has(goal.id);
                    
                    return (
                      <div key={goal.id} className="border border-blue-200 rounded-xl overflow-hidden">
                        {/* Goal Row */}
                        <div className="bg-gradient-to-r from-blue-50 to-blue-50/50 p-4 flex items-center justify-between group hover:shadow-md transition-all">
                          <div className="flex items-center gap-3 flex-1">
                            {/* Expand/Collapse Button */}
                            <button
                              onClick={() => toggleGoalExpand(goal.id)}
                              className="p-1 hover:bg-blue-100 rounded transition-colors"
                            >
                              {isExpanded ? (
                                <ChevronDown className="w-5 h-5 text-[#0083BD]" />
                              ) : (
                                <ChevronRight className="w-5 h-5 text-[#0083BD]" />
                              )}
                            </button>
                            <Target className="w-5 h-5 text-[#0083BD] flex-shrink-0" />
                            {editingId === goal.id ? (
                              <input
                                type="text"
                                value={editingName}
                                onChange={(e) => setEditingName(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') saveEdit('goal', goal.id);
                                  if (e.key === 'Escape') cancelEdit();
                                }}
                                className="flex-1 px-3 py-2 border border-[#0083BD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0083BD]"
                                autoFocus
                              />
                            ) : (
                              <div className="flex-1">
                                <p className="font-semibold text-[#01416d]">{goal.name}</p>
                                <p className="text-sm text-[#575756]">
                                  {goalKeyResults.length} Key {goalKeyResults.length === 1 ? 'Result' : 'Results'}
                                </p>
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            {editingId === goal.id ? (
                              <>
                                <button
                                  onClick={() => saveEdit('goal', goal.id)}
                                  className="px-4 py-2 bg-[#0083BD] text-white rounded-lg hover:bg-[#01416d] transition-colors text-sm"
                                >
                                  Save
                                </button>
                                <button
                                  onClick={cancelEdit}
                                  className="px-4 py-2 bg-gray-200 text-[#575756] rounded-lg hover:bg-gray-300 transition-colors text-sm"
                                >
                                  Cancel
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() => startEdit(goal.id, goal.name)}
                                  className="p-2 hover:bg-blue-100 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                  title="Edit Goal"
                                >
                                  <Edit2 className="w-4 h-4 text-[#0083BD]" />
                                </button>
                                <button
                                  onClick={() => handleDeleteRequest('goal', goal.id, goal.name)}
                                  className="p-2 hover:bg-red-100 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                  title="Delete Goal"
                                >
                                  <Trash2 className="w-4 h-4 text-red-600" />
                                </button>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Key Results (Expanded) */}
                        {isExpanded && goalKeyResults.length > 0 && (
                          <div className="bg-white border-t border-blue-200">
                            {goalKeyResults.map((kr, index) => {
                              const taskCount = getTaskCount(kr.id, 'keyResult');
                              
                              return (
                                <div
                                  key={kr.id}
                                  className={`pl-12 pr-4 py-3 flex items-center justify-between group hover:bg-purple-50 transition-all ${
                                    index !== goalKeyResults.length - 1 ? 'border-b border-gray-100' : ''
                                  }`}
                                >
                                  <div className="flex items-center gap-3 flex-1">
                                    <TrendingUp className="w-4 h-4 text-purple-600 flex-shrink-0" />
                                    {editingId === kr.id ? (
                                      <input
                                        type="text"
                                        value={editingName}
                                        onChange={(e) => setEditingName(e.target.value)}
                                        onKeyDown={(e) => {
                                          if (e.key === 'Enter') saveEdit('keyResult', kr.id);
                                          if (e.key === 'Escape') cancelEdit();
                                        }}
                                        className="flex-1 px-3 py-2 border border-purple-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                                        autoFocus
                                      />
                                    ) : (
                                      <div className="flex-1">
                                        <p className="text-[#01416d] font-medium">{kr.name}</p>
                                        <p className="text-xs text-[#575756]">
                                          {taskCount} {taskCount === 1 ? 'task' : 'tasks'}
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-2">
                                    {editingId === kr.id ? (
                                      <>
                                        <button
                                          onClick={() => saveEdit('keyResult', kr.id)}
                                          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
                                        >
                                          Save
                                        </button>
                                        <button
                                          onClick={cancelEdit}
                                          className="px-4 py-2 bg-gray-200 text-[#575756] rounded-lg hover:bg-gray-300 transition-colors text-sm"
                                        >
                                          Cancel
                                        </button>
                                      </>
                                    ) : (
                                      <>
                                        <button
                                          onClick={() => startEdit(kr.id, kr.name)}
                                          className="p-2 hover:bg-purple-100 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                          title="Edit Key Result"
                                        >
                                          <Edit2 className="w-4 h-4 text-purple-600" />
                                        </button>
                                        <button
                                          onClick={() => handleDeleteRequest('keyResult', kr.id, kr.name)}
                                          className="p-2 hover:bg-red-100 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                          title="Delete Key Result"
                                        >
                                          <Trash2 className="w-4 h-4 text-red-600" />
                                        </button>
                                      </>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {/* Add Key Result */}
                        {isExpanded && (
                          <div className="bg-white border-t border-blue-200 px-12 py-3">
                            {addingKeyResultForGoal === goal.id ? (
                              <div className="flex items-center gap-3">
                                <input
                                  type="text"
                                  value={newKeyResultName}
                                  onChange={(e) => setNewKeyResultName(e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter' && newKeyResultName.trim()) {
                                      onAddKeyResult(newKeyResultName, goal.id);
                                      setAddingKeyResultForGoal(null);
                                      setNewKeyResultName('');
                                    }
                                    if (e.key === 'Escape') {
                                      setAddingKeyResultForGoal(null);
                                      setNewKeyResultName('');
                                    }
                                  }}
                                  placeholder="Enter key result name..."
                                  className="flex-1 px-3 py-2 border border-[#0083BD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0083BD]"
                                  autoFocus
                                />
                                <button
                                  onClick={() => {
                                    if (newKeyResultName.trim()) {
                                      onAddKeyResult(newKeyResultName, goal.id);
                                      setAddingKeyResultForGoal(null);
                                      setNewKeyResultName('');
                                    }
                                  }}
                                  disabled={!newKeyResultName.trim()}
                                  className="px-4 py-2 bg-[#0083BD] text-white rounded-lg hover:bg-[#01416d] transition-colors text-sm disabled:opacity-50"
                                >
                                  Add
                                </button>
                                <button
                                  onClick={() => {
                                    setAddingKeyResultForGoal(null);
                                    setNewKeyResultName('');
                                  }}
                                  className="px-4 py-2 bg-gray-200 text-[#575756] rounded-lg hover:bg-gray-300 transition-colors text-sm"
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => setAddingKeyResultForGoal(goal.id)}
                                className="text-[#0083BD] hover:text-[#01416d] flex items-center gap-2 text-sm font-medium"
                              >
                                <Plus className="w-4 h-4" />
                                Add Key Result
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* Projects Tab */}
            {activeTab === 'projects' && (
              <div className="space-y-2">
                {projects.length === 0 ? (
                  <div className="text-center py-12 text-[#9ca3af]">
                    <FolderOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No projects yet</p>
                  </div>
                ) : (
                  projects.map(project => {
                    const taskCount = getTaskCount(project.id, 'project');
                    
                    return (
                      <div
                        key={project.id}
                        className="bg-gradient-to-r from-gray-50 to-gray-50/50 border border-gray-200 rounded-xl p-4 flex items-center justify-between group hover:shadow-md transition-all"
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <FolderOpen className="w-5 h-5 text-[#0083BD] flex-shrink-0" />
                          {editingId === project.id ? (
                            <input
                              type="text"
                              value={editingName}
                              onChange={(e) => setEditingName(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') saveEdit('project', project.id);
                                if (e.key === 'Escape') cancelEdit();
                              }}
                              className="flex-1 px-3 py-2 border border-[#0083BD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0083BD]"
                              autoFocus
                            />
                          ) : (
                            <div className="flex-1">
                              <p className="font-semibold text-[#01416d]">{project.name}</p>
                              <p className="text-sm text-[#575756]">
                                {taskCount} {taskCount === 1 ? 'task' : 'tasks'}
                              </p>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {editingId === project.id ? (
                            <>
                              <button
                                onClick={() => saveEdit('project', project.id)}
                                className="px-4 py-2 bg-[#0083BD] text-white rounded-lg hover:bg-[#01416d] transition-colors text-sm"
                              >
                                Save
                              </button>
                              <button
                                onClick={cancelEdit}
                                className="px-4 py-2 bg-gray-200 text-[#575756] rounded-lg hover:bg-gray-300 transition-colors text-sm"
                              >
                                Cancel
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => startEdit(project.id, project.name)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                title="Edit Project"
                              >
                                <Edit2 className="w-4 h-4 text-[#0083BD]" />
                              </button>
                              <button
                                onClick={() => handleDeleteRequest('project', project.id, project.name)}
                                className="p-2 hover:bg-red-100 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                title="Delete Project"
                              >
                                <Trash2 className="w-4 h-4 text-red-600" />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
                {/* Add Project */}
                {addingProject ? (
                  <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between group hover:shadow-md transition-all">
                    <div className="flex items-center gap-3 flex-1">
                      <FolderOpen className="w-5 h-5 text-[#0083BD] flex-shrink-0" />
                      <input
                        type="text"
                        value={newProjectName}
                        onChange={(e) => setNewProjectName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            onAddProject(newProjectName);
                            setAddingProject(false);
                            setNewProjectName('');
                          }
                          if (e.key === 'Escape') {
                            setAddingProject(false);
                            setNewProjectName('');
                          }
                        }}
                        className="flex-1 px-3 py-2 border border-[#0083BD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0083BD]"
                        autoFocus
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          onAddProject(newProjectName);
                          setAddingProject(false);
                          setNewProjectName('');
                        }}
                        className="px-4 py-2 bg-[#0083BD] text-white rounded-lg hover:bg-[#01416d] transition-colors text-sm"
                      >
                        Add
                      </button>
                      <button
                        onClick={() => {
                          setAddingProject(false);
                          setNewProjectName('');
                        }}
                        className="px-4 py-2 bg-gray-200 text-[#575756] rounded-lg hover:bg-gray-300 transition-colors text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setAddingProject(true)}
                    className="bg-gradient-to-r from-[#0083BD] to-[#149BD7] text-white px-6 py-3 rounded-xl flex items-center gap-2 hover:shadow-lg transition-all"
                  >
                    <Plus className="w-5 h-5" />
                    New Project
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-[#dbe4ed] flex items-center justify-between">
            <button
              onClick={onCreateNew}
              className="bg-gradient-to-r from-[#0083BD] to-[#149BD7] text-white px-6 py-3 rounded-xl flex items-center gap-2 hover:shadow-lg transition-all"
            >
              <Plus className="w-5 h-5" />
              New Goal
            </button>
            <button
              onClick={onClose}
              className="px-6 py-3 bg-gray-200 text-[#575756] rounded-xl hover:bg-gray-300 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmation && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="font-bold text-[#01416d]">Confirm Deletion</h3>
                  <p className="text-sm text-[#575756]">This action cannot be undone</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <p className="text-[#01416d] mb-4">
                Are you sure you want to delete{' '}
                <span className="font-semibold">"{deleteConfirmation.name}"</span>?
              </p>
              
              {deleteConfirmation.type === 'goal' && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 space-y-2">
                  <p className="text-sm text-red-800 font-medium">
                    This will permanently delete:
                  </p>
                  <ul className="text-sm text-red-700 space-y-1 ml-4">
                    <li>• The goal "{deleteConfirmation.name}"</li>
                    <li>• All {keyResults.filter(kr => kr.goalId === deleteConfirmation.id).length} key result(s) under this goal</li>
                    {deleteConfirmation.affectedCount > 0 && (
                      <li>• All associated tasks will be archived ({deleteConfirmation.affectedCount} total items affected)</li>
                    )}
                  </ul>
                </div>
              )}

              {deleteConfirmation.type === 'keyResult' && deleteConfirmation.affectedCount > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <p className="text-sm text-amber-800">
                    This key result has <strong>{deleteConfirmation.affectedCount}</strong>{' '}
                    {deleteConfirmation.affectedCount === 1 ? 'task' : 'tasks'} that will be archived.
                  </p>
                </div>
              )}

              {deleteConfirmation.type === 'project' && deleteConfirmation.affectedCount > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <p className="text-sm text-amber-800">
                    This project has <strong>{deleteConfirmation.affectedCount}</strong>{' '}
                    {deleteConfirmation.affectedCount === 1 ? 'task' : 'tasks'} that will be archived.
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-200 flex items-center justify-end gap-3">
              <button
                onClick={cancelDelete}
                className="px-6 py-3 bg-gray-200 text-[#575756] rounded-xl hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}