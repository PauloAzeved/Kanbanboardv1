import { useState, useEffect, useCallback } from 'react';
import { Header } from './Header';
import { KanbanColumn } from './KanbanColumn';
import { CreateGoalProjectModal } from './CreateGoalProjectModal';
import { CreateTaskModal } from './CreateTaskModal';
import { EditTaskModal } from './EditTaskModal';
import { ManageGoalsProjectsModal } from './ManageGoalsProjectsModal';
import { GoalProjectSelector } from './GoalProjectSelector';
import { TaskPreviewModal } from './TaskPreviewModal';
import { Plus, Archive as ArchiveIcon, List, LayoutDashboard, Trash2, Save, Check, X } from 'lucide-react';
import svgPaths from "../../imports/svg-baf0okhfln";
import imgImageCfc from "../../assets/cfcLogo.png";
import { format } from 'date-fns';
import { seedData } from '../../utils/seedData';

export type Importance = 'high' | 'medium' | 'low' | 'none';
export type TaskStatus = 'backlog' | 'todo' | 'in-progress' | 'done' | 'archived';

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  importance: Importance;
  status: TaskStatus;
  parentId: string | null; // ID of Key Result or Project
  parentType: 'keyResult' | 'project' | null;
  completedAt?: string; // When moved to done
  wontDo?: boolean; // If marked as won't do
}

export interface Goal {
  id: string;
  name: string;
  createdAt: string;
}

export interface KeyResult {
  id: string;
  name: string;
  goalId: string; // Parent Goal ID
  createdAt: string;
}

export interface Project {
  id: string;
  name: string;
  createdAt: string;
}

const DAYS_UNTIL_ARCHIVE = 2;

export function KanbanBoard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [keyResults, setKeyResults] = useState<KeyResult[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedParent, setSelectedParent] = useState<string | null>(null);
  const [selectedParentType, setSelectedParentType] = useState<'goal' | 'project' | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);
  const [showEditTaskModal, setShowEditTaskModal] = useState(false);
  const [showManageModal, setShowManageModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [activeTab, setActiveTab] = useState<'kanban' | 'backlog' | 'archive'>('kanban');
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [previewTask, setPreviewTask] = useState<Task | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [hideWontDos, setHideWontDos] = useState(false);
  const [hideGoalTasks, setHideGoalTasks] = useState(false);
  const [hideProjectTasks, setHideProjectTasks] = useState(false);
  const [hiddenGoalIds, setHiddenGoalIds] = useState<Set<string>>(new Set());
  const [hiddenProjectIds, setHiddenProjectIds] = useState<Set<string>>(new Set());
  const [showRecoveryPanel, setShowRecoveryPanel] = useState(false);
  const [recoveryData, setRecoveryData] = useState<{tasks: number, goals: number, keyResults: number, projects: number} | null>(null);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [showSaveConfirmation, setShowSaveConfirmation] = useState(false);

  // Load data from localStorage
  useEffect(() => {
    const storedTasks = localStorage.getItem('kanban-tasks');
    const storedGoals = localStorage.getItem('kanban-goals');
    const storedKeyResults = localStorage.getItem('kanban-key-results');
    const storedProjects = localStorage.getItem('kanban-projects');
    const storedLastSaved = localStorage.getItem('kanban-last-saved');
    
    if (storedTasks) setTasks(JSON.parse(storedTasks));
    if (storedGoals) setGoals(JSON.parse(storedGoals));
    if (storedKeyResults) setKeyResults(JSON.parse(storedKeyResults));
    if (storedProjects) setProjects(JSON.parse(storedProjects));
    if (storedLastSaved) setLastSaved(new Date(storedLastSaved));
  }, []);

  // Save to localStorage and check for archiving
  useEffect(() => {
    localStorage.setItem('kanban-tasks', JSON.stringify(tasks));
    localStorage.setItem('kanban-last-saved', new Date().toISOString());
    
    // Check for tasks that need to be archived
    const now = new Date();
    const updatedTasks = tasks.map(task => {
      if (task.status === 'done' && task.completedAt && !task.wontDo) {
        const completedDate = new Date(task.completedAt);
        const daysSinceCompletion = (now.getTime() - completedDate.getTime()) / (1000 * 60 * 60 * 24);
        
        if (daysSinceCompletion >= DAYS_UNTIL_ARCHIVE) {
          return { ...task, status: 'archived' as TaskStatus };
        }
      }
      return task;
    });
    
    if (JSON.stringify(updatedTasks) !== JSON.stringify(tasks)) {
      setTasks(updatedTasks);
    }
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('kanban-goals', JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem('kanban-key-results', JSON.stringify(keyResults));
  }, [keyResults]);

  useEffect(() => {
    localStorage.setItem('kanban-projects', JSON.stringify(projects));
  }, [projects]);

  const addGoal = (name: string) => {
    const newGoal: Goal = {
      id: Date.now().toString(),
      name,
      createdAt: new Date().toISOString()
    };
    setGoals([...goals, newGoal]);
  };

  const addKeyResult = (name: string, goalId: string) => {
    const newKeyResult: KeyResult = {
      id: Date.now().toString(),
      name,
      goalId,
      createdAt: new Date().toISOString()
    };
    setKeyResults([...keyResults, newKeyResult]);
  };

  const addProject = (name: string) => {
    const newProject: Project = {
      id: Date.now().toString(),
      name,
      createdAt: new Date().toISOString()
    };
    setProjects([...projects, newProject]);
  };

  const addTask = (task: Omit<Task, 'id' | 'status'>, goToToDo?: boolean) => {
    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
      status: goToToDo ? 'todo' : 'backlog'
    };
    setTasks([...tasks, newTask]);
  };

  const moveTask = useCallback((taskId: string, newStatus: TaskStatus) => {
    setTasks(prevTasks => prevTasks.map(task => {
      if (task.id === taskId) {
        const updates: Partial<Task> = { status: newStatus };
        if (newStatus === 'done' && task.status !== 'done') {
          updates.completedAt = new Date().toISOString();
        }
        return { ...task, ...updates };
      }
      return task;
    }));
  }, []);

  const markAsWontDo = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, wontDo: true, status: 'archived' } : task
    ));
  };

  const archiveNow = (taskId: string) => {
    // Manually archive a Done task (preserves completedAt for green styling)
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, status: 'archived' } : task
    ));
  };

  const moveToBacklog = (taskId: string) => {
    // Move task from ToDo to Backlog
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, status: 'backlog' } : task
    ));
  };

  const moveToToDo = (taskId: string) => {
    // Move task from Backlog to ToDo
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, status: 'todo' } : task
    ));
  };

  const deleteTask = (taskId: string) => {
    // Move to archive with wontDo flag (same as Won't Do action)
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, status: 'archived', wontDo: true } : task
    ));
  };

  const reviveTask = (taskId: string) => {
    // Send back to to-do and clear archive-related metadata
    setTasks(tasks.map(task => 
      task.id === taskId ? { 
        ...task, 
        status: 'todo',
        wontDo: false,
        completedAt: undefined
      } : task
    ));
  };

  const requestPermanentDelete = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      setTaskToDelete(task);
      setShowDeleteConfirmation(true);
    }
  };

  const confirmPermanentDelete = () => {
    if (taskToDelete) {
      // Permanently delete the task from the array
      setTasks(tasks.filter(task => task.id !== taskToDelete.id));
      setTaskToDelete(null);
      setShowDeleteConfirmation(false);
    }
  };

  const cancelPermanentDelete = () => {
    setTaskToDelete(null);
    setShowDeleteConfirmation(false);
  };

  const editTask = (taskId: string, updates: Partial<Task>) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, ...updates } : task
    ));
  };

  const updateGoal = (id: string, name: string) => {
    setGoals(goals.map(goal => 
      goal.id === id ? { ...goal, name } : goal
    ));
  };

  const deleteGoal = (id: string) => {
    // Delete goal and all its key results
    setGoals(goals.filter(goal => goal.id !== id));
    setKeyResults(keyResults.filter(kr => kr.goalId !== id));
    // Archive tasks that belong to deleted key results
    const deletedKeyResults = keyResults.filter(kr => kr.goalId === id).map(kr => kr.id);
    setTasks(tasks.map(task => 
      deletedKeyResults.includes(task.parentId || '') 
        ? { ...task, status: 'archived' as TaskStatus, wontDo: true } 
        : task
    ));
  };

  const updateKeyResult = (id: string, name: string) => {
    setKeyResults(keyResults.map(kr => 
      kr.id === id ? { ...kr, name } : kr
    ));
  };

  const deleteKeyResult = (id: string) => {
    setKeyResults(keyResults.filter(kr => kr.id !== id));
    // Archive tasks that belong to this key result
    setTasks(tasks.map(task => 
      task.parentId === id 
        ? { ...task, status: 'archived' as TaskStatus, wontDo: true } 
        : task
    ));
  };

  const updateProject = (id: string, name: string) => {
    setProjects(projects.map(project => 
      project.id === id ? { ...project, name } : project
    ));
  };

  const deleteProject = (id: string) => {
    setProjects(projects.filter(project => project.id !== id));
    // Archive tasks that belong to this project
    setTasks(tasks.map(task => 
      task.parentId === id 
        ? { ...task, status: 'archived' as TaskStatus, wontDo: true } 
        : task
    ));
  };

  // Emergency recovery function
  const checkRecovery = () => {
    const storedTasks = localStorage.getItem('kanban-tasks');
    const storedGoals = localStorage.getItem('kanban-goals');
    const storedKeyResults = localStorage.getItem('kanban-key-results');
    const storedProjects = localStorage.getItem('kanban-projects');

    const data = {
      tasks: storedTasks ? JSON.parse(storedTasks).length : 0,
      goals: storedGoals ? JSON.parse(storedGoals).length : 0,
      keyResults: storedKeyResults ? JSON.parse(storedKeyResults).length : 0,
      projects: storedProjects ? JSON.parse(storedProjects).length : 0
    };

    setRecoveryData(data);
    setShowRecoveryPanel(true);

    // Also reload the data
    if (storedTasks) setTasks(JSON.parse(storedTasks));
    if (storedGoals) setGoals(JSON.parse(storedGoals));
    if (storedKeyResults) setKeyResults(JSON.parse(storedKeyResults));
    if (storedProjects) setProjects(JSON.parse(storedProjects));
  };

  const openEditModal = (task: Task) => {
    setEditingTask(task);
    setShowEditTaskModal(true);
  };

  const openPreviewModal = (task: Task) => {
    setPreviewTask(task);
    setShowPreviewModal(true);
  };

  const closePreviewModal = () => {
    setPreviewTask(null);
    setShowPreviewModal(false);
  };

  const handlePreviewEdit = () => {
    if (previewTask) {
      setShowPreviewModal(false);
      openEditModal(previewTask);
    }
  };

  const handlePreviewDelete = () => {
    if (previewTask) {
      deleteTask(previewTask.id);
      closePreviewModal();
    }
  };

  const handlePreviewRevive = () => {
    if (previewTask) {
      reviveTask(previewTask.id);
      closePreviewModal();
    }
  };

  const handlePreviewPermanentDelete = () => {
    if (previewTask) {
      setShowPreviewModal(false);
      requestPermanentDelete(previewTask.id);
    }
  };

  const handlePreviewMove = (newStatus: 'todo' | 'in-progress' | 'done') => {
    if (previewTask) {
      moveTask(previewTask.id, newStatus);
      closePreviewModal();
    }
  };

  // Export all data to JSON file
  const exportData = () => {
    const data = {
      tasks,
      goals,
      keyResults,
      projects,
      exportDate: new Date().toISOString(),
      version: '1.0'
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `kanban-backup-${format(new Date(), 'yyyy-MM-dd-HHmmss')}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Import data from JSON file
  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content);
        
        // Validate the data structure - check if at least one property exists
        const hasValidData = 
          (data.tasks && Array.isArray(data.tasks)) ||
          (data.goals && Array.isArray(data.goals)) ||
          (data.keyResults && Array.isArray(data.keyResults)) ||
          (data.projects && Array.isArray(data.projects));
        
        if (hasValidData) {
          // Import each type of data if it exists
          if (data.tasks && Array.isArray(data.tasks)) {
            setTasks(data.tasks);
          }
          if (data.goals && Array.isArray(data.goals)) {
            setGoals(data.goals);
          }
          if (data.keyResults && Array.isArray(data.keyResults)) {
            setKeyResults(data.keyResults);
          }
          if (data.projects && Array.isArray(data.projects)) {
            setProjects(data.projects);
          }
          
          // Show success message with what was imported
          const imported = [];
          if (data.tasks?.length > 0) imported.push(`${data.tasks.length} tasks`);
          if (data.goals?.length > 0) imported.push(`${data.goals.length} goals`);
          if (data.keyResults?.length > 0) imported.push(`${data.keyResults.length} key results`);
          if (data.projects?.length > 0) imported.push(`${data.projects.length} projects`);
          
          alert(`Data imported successfully!\n\nImported: ${imported.join(', ') || 'No data found in file'}`);
        } else {
          alert('Invalid backup file format. The file must contain at least one of: tasks, goals, keyResults, or projects as arrays.');
        }
      } catch (error) {
        console.error('Import error:', error);
        alert(`Error reading backup file: ${error instanceof Error ? error.message : 'Unknown error'}\n\nPlease make sure it's a valid JSON file.`);
      }
    };
    reader.readAsText(file);
    
    // Reset the input so the same file can be selected again
    event.target.value = '';
  };

  // Load sample data from seed
  const loadSampleData = () => {
    const confirmed = confirm('This will REPLACE all your existing data with the sample CFC User Testing data. This action cannot be undone (unless you have a backup). Continue?');
    if (confirmed) {
      setGoals(seedData.goals);
      setKeyResults(seedData.keyResults);
      setProjects(seedData.projects);
      setTasks(seedData.tasks);
      alert('Sample data loaded successfully! Check your Kanban Board.');
    }
  };

  // Manual save function (reinforces localStorage save with visual feedback)
  const handleManualSave = () => {
    // localStorage is already being saved automatically in useEffect
    // This just provides visual confirmation
    const timestamp = new Date().toISOString();
    localStorage.setItem('kanban-last-saved', timestamp);
    setLastSaved(new Date(timestamp));
    
    // Show temporary success message
    setShowSaveConfirmation(true);
    setTimeout(() => {
      setShowSaveConfirmation(false);
    }, 3000);
    
    alert(`✅ Data saved successfully!\n\nSaved: ${tasks.length} tasks, ${goals.length} goals, ${keyResults.length} key results, ${projects.length} projects\n\nYour data is automatically saved to your browser and will persist when you refresh the page.`);
  };

  // Filter tasks based on selected goal/project
  let filteredTasks = tasks;
  
  if (selectedParent && selectedParentType) {
    if (selectedParentType === 'goal') {
      // Filter by all key results under this goal
      const goalKeyResultIds = keyResults
        .filter(kr => kr.goalId === selectedParent)
        .map(kr => kr.id);
      filteredTasks = tasks.filter(t => 
        t.parentId && goalKeyResultIds.includes(t.parentId)
      );
    } else if (selectedParentType === 'project') {
      // Filter by project
      filteredTasks = tasks.filter(t => t.parentId === selectedParent);
    }
  }

  // Apply checkbox-based filters for hidden goals
  if (hiddenGoalIds.size > 0) {
    // Get key results from hidden goals
    const hiddenGoalKeyResultIds = keyResults
      .filter(kr => hiddenGoalIds.has(kr.goalId))
      .map(kr => kr.id);
    // Filter out tasks belonging to hidden goals
    filteredTasks = filteredTasks.filter(t => 
      !t.parentId || !hiddenGoalKeyResultIds.includes(t.parentId)
    );
  }

  // Apply checkbox-based filters for hidden projects
  if (hiddenProjectIds.size > 0) {
    filteredTasks = filteredTasks.filter(t => 
      !t.parentId || !hiddenProjectIds.has(t.parentId)
    );
  }

  // Apply hide filters
  if (hideGoalTasks) {
    // Hide tasks that belong to key results (goal-based tasks)
    const allKeyResultIds = keyResults.map(kr => kr.id);
    filteredTasks = filteredTasks.filter(t => 
      !t.parentId || !allKeyResultIds.includes(t.parentId)
    );
  }

  if (hideProjectTasks) {
    // Hide tasks that belong to projects
    const allProjectIds = projects.map(p => p.id);
    filteredTasks = filteredTasks.filter(t => 
      !t.parentId || !allProjectIds.includes(t.parentId)
    );
  }
  
  const todoTasks = filteredTasks.filter(t => t.status === 'todo');
  const inProgressTasks = filteredTasks.filter(t => t.status === 'in-progress');
  const doneTasks = filteredTasks.filter(t => t.status === 'done');
  const backlogTasks = filteredTasks.filter(t => t.status === 'backlog');
  const archivedTasks = filteredTasks.filter(t => t.status === 'archived');
  
  // Apply "Hide Won't Dos" filter when in archive view
  const displayedArchivedTasks = hideWontDos 
    ? archivedTasks.filter(t => !t.wontDo)
    : archivedTasks;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e8f4f8] to-[#d4e9f0]">
      {/* Background decorative elements similar to Figma design */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute blur-3xl filter left-[40%] opacity-30 rounded-full size-[600px] top-[-100px]" 
             style={{ background: 'radial-gradient(circle, rgba(20,155,215,0.4) 0%, rgba(20,155,215,0.2) 50%, transparent 100%)' }} />
        <div className="absolute blur-3xl filter left-[-200px] opacity-20 rounded-full size-[500px] top-[400px]"
             style={{ background: 'radial-gradient(circle, rgba(1,65,109,0.3) 0%, transparent 70%)' }} />
      </div>

      <div className="relative">
        <Header 
          logoSrc={imgImageCfc} 
          svgPaths={svgPaths}
          onCreateGoalProject={() => setShowCreateModal(true)}
          onManageGoalsProjects={() => setShowManageModal(true)}
          onExportData={exportData}
          onImportData={importData}
          onLoadSampleData={loadSampleData}
          onSave={handleManualSave}
        />
        
        <div className="max-w-[1400px] mx-auto px-6 py-8">
          {/* Tabs Navigation */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-6 border-b border-white/40">
              <button
                onClick={() => setActiveTab('kanban')}
                className={`flex items-center gap-2 px-6 py-3 border-b-2 transition-all ${
                  activeTab === 'kanban'
                    ? 'border-[#0083BD] text-[#01416d]'
                    : 'border-transparent text-[#575756] hover:text-[#01416d]'
                }`}
              >
                <LayoutDashboard className="w-5 h-5" />
                <span className="font-medium">Kanban Board</span>
              </button>
              <button
                onClick={() => setActiveTab('backlog')}
                className={`flex items-center gap-2 px-6 py-3 border-b-2 transition-all ${
                  activeTab === 'backlog'
                    ? 'border-[#0083BD] text-[#01416d]'
                    : 'border-transparent text-[#575756] hover:text-[#01416d]'
                }`}
              >
                <List className="w-5 h-5" />
                <span className="font-medium">Backlog</span>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  activeTab === 'backlog'
                    ? 'bg-[#0083BD] text-white'
                    : 'bg-white/80 text-[#575756]'
                }`}>
                  {backlogTasks.length}
                </span>
              </button>
              <button
                onClick={() => setActiveTab('archive')}
                className={`flex items-center gap-2 px-6 py-3 border-b-2 transition-all ${
                  activeTab === 'archive'
                    ? 'border-[#0083BD] text-[#01416d]'
                    : 'border-transparent text-[#575756] hover:text-[#01416d]'
                }`}
              >
                <ArchiveIcon className="w-5 h-5" />
                <span className="font-medium">archived</span>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  activeTab === 'archive'
                    ? 'bg-[#0083BD] text-white'
                    : 'bg-white/80 text-[#575756]'
                }`}>
                  {archivedTasks.length}
                </span>
              </button>
            </div>

            {/* Filters and Controls */}
            <div className="flex items-center justify-between gap-4 flex-wrap">
              {/* Left side: Filter by */}
              <div className="flex items-center gap-4 flex-wrap">
                <GoalProjectSelector
                  goals={goals}
                  keyResults={keyResults}
                  projects={projects}
                  selectedParent={selectedParent}
                  onSelectParent={setSelectedParent}
                  selectedParentType={selectedParentType}
                  onSelectParentType={setSelectedParentType}
                  hideGoalTasks={hideGoalTasks}
                  onHideGoalTasks={setHideGoalTasks}
                  hideProjectTasks={hideProjectTasks}
                  onHideProjectTasks={setHideProjectTasks}
                  hiddenGoalIds={hiddenGoalIds}
                  onHiddenGoalIdsChange={setHiddenGoalIds}
                  hiddenProjectIds={hiddenProjectIds}
                  onHiddenProjectIdsChange={setHiddenProjectIds}
                />

                {/* Hide Won't Dos Filter - Only shown when in Archive tab */}
                {activeTab === 'archive' && (
                  <label className="flex items-center gap-2 px-4 py-3 bg-white/80 border border-[rgba(219,228,237,0.4)] rounded-xl cursor-pointer hover:bg-white transition-all h-[48px]">
                    <input
                      type="checkbox"
                      checked={hideWontDos}
                      onChange={(e) => setHideWontDos(e.target.checked)}
                      className="w-5 h-5 text-[#0083BD] bg-white border-gray-300 rounded focus:ring-[#0083BD] focus:ring-2 cursor-pointer"
                    />
                    <span className="text-[#01416d] font-medium">Hide "Won't Dos"</span>
                  </label>
                )}
              </div>
              
              {/* Right side: Create Task */}
              <button
                onClick={() => setShowCreateTaskModal(true)}
                className="bg-gradient-to-r from-[#0083BD] to-[#149BD7] text-white px-6 py-3 rounded-xl flex items-center gap-2 hover:shadow-lg transition-all h-[48px]"
              >
                <Plus className="w-5 h-5" />
                Create Task
              </button>
            </div>
          </div>

          {/* Content Based on Active Tab */}
          {activeTab === 'backlog' ? (
            <div className="grid grid-cols-1 gap-4">
              <KanbanColumn
                title="Backlog"
                status="backlog"
                tasks={backlogTasks}
                moveTask={moveTask}
                goals={goals}
                keyResults={keyResults}
                projects={projects}
                onEditTask={openEditModal}
                onDeleteTask={deleteTask}
                onPreviewTask={openPreviewModal}
                onMoveToToDo={moveToToDo}
              />
            </div>
          ) : activeTab === 'archive' ? (
            <div className="grid grid-cols-1 gap-4">
              <KanbanColumn
                title="Archive"
                status="archived"
                tasks={displayedArchivedTasks}
                moveTask={moveTask}
                goals={goals}
                keyResults={keyResults}
                projects={projects}
                isArchive
                onEditTask={openEditModal}
                onDeleteTask={deleteTask}
                onReviveTask={reviveTask}
                onRequestPermanentDelete={requestPermanentDelete}
                onPreviewTask={openPreviewModal}
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <KanbanColumn
                title="To Do"
                status="todo"
                tasks={todoTasks}
                moveTask={moveTask}
                goals={goals}
                keyResults={keyResults}
                projects={projects}
                onEditTask={openEditModal}
                onDeleteTask={deleteTask}
                onPreviewTask={openPreviewModal}
                onMoveToBacklog={moveToBacklog}
              />
              <KanbanColumn
                title="In Progress"
                status="in-progress"
                tasks={inProgressTasks}
                moveTask={moveTask}
                goals={goals}
                keyResults={keyResults}
                projects={projects}
                onEditTask={openEditModal}
                onDeleteTask={deleteTask}
                onPreviewTask={openPreviewModal}
              />
              <KanbanColumn
                title="Done"
                status="done"
                tasks={doneTasks}
                moveTask={moveTask}
                goals={goals}
                keyResults={keyResults}
                projects={projects}
                onMarkAsWontDo={markAsWontDo}
                onArchiveNow={archiveNow}
                onEditTask={openEditModal}
                onDeleteTask={deleteTask}
                onPreviewTask={openPreviewModal}
              />
            </div>
          )}

          {/* Bottom Create Task Button */}
          <div className="mt-6 flex justify-start">
            <button
              onClick={() => setShowCreateTaskModal(true)}
              className="bg-gradient-to-r from-[#0083BD] to-[#149BD7] text-white px-6 py-3 rounded-xl flex items-center gap-2 hover:shadow-lg transition-all h-[48px]"
            >
              <Plus className="w-5 h-5" />
              Create Task
            </button>
          </div>
        </div>
      </div>

      {/* Floating Save Status Indicator */}
      {showSaveConfirmation && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="bg-white/95 backdrop-blur-sm border border-[#dbe4ed] shadow-xl rounded-full px-6 py-3 flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <Check className="w-4 h-4 text-green-600" />
              <span className="text-sm text-[#01416d] font-medium">Auto-saved to browser</span>
            </div>
            <div className="h-4 w-px bg-[#dbe4ed]"></div>
            <div className="text-xs text-[#575756]">
              {tasks.length} task{tasks.length !== 1 ? 's' : ''}
            </div>
            <button
              onClick={() => setShowSaveConfirmation(false)}
              className="ml-2 text-[#9ca3af] hover:text-[#01416d] transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Modals */}
      {showCreateModal && (
        <CreateGoalProjectModal
          onClose={() => setShowCreateModal(false)}
          onAddGoal={addGoal}
        />
      )}

      {showCreateTaskModal && (
        <CreateTaskModal
          onClose={() => setShowCreateTaskModal(false)}
          onAdd={addTask}
          goals={goals}
          keyResults={keyResults}
          projects={projects}
        />
      )}

      {showEditTaskModal && editingTask && (
        <EditTaskModal
          onClose={() => {
            setShowEditTaskModal(false);
            setEditingTask(null);
          }}
          onSave={(updates) => {
            editTask(editingTask.id, updates);
            setShowEditTaskModal(false);
            setEditingTask(null);
          }}
          task={editingTask}
          goals={goals}
          keyResults={keyResults}
          projects={projects}
        />
      )}

      {showManageModal && (
        <ManageGoalsProjectsModal
          isOpen={showManageModal}
          onClose={() => setShowManageModal(false)}
          goals={goals}
          keyResults={keyResults}
          projects={projects}
          tasks={tasks}
          onUpdateGoal={updateGoal}
          onDeleteGoal={deleteGoal}
          onUpdateKeyResult={updateKeyResult}
          onDeleteKeyResult={deleteKeyResult}
          onUpdateProject={updateProject}
          onDeleteProject={deleteProject}
          onAddKeyResult={addKeyResult}
          onAddProject={addProject}
          onCreateNew={() => {
            setShowManageModal(false);
            setShowCreateModal(true);
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirmation && taskToDelete && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Trash2 className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="font-bold text-[#01416d]">Permanently Delete Task</h3>
                  <p className="text-sm text-[#575756]">This action cannot be undone</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <p className="text-[#01416d] mb-4">
                Are you sure you want to permanently delete this task?
              </p>
              
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
                <p className="text-sm font-medium text-[#01416d] mb-1">{taskToDelete.description}</p>
                {taskToDelete.dueDate && (
                  <p className="text-xs text-[#575756]">
                    Due: {format(new Date(taskToDelete.dueDate), 'MMM dd, yyyy')}
                  </p>
                )}
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-800 font-medium">
                  ⚠️ Warning: This task will be completely removed from the system and cannot be recovered.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-200 flex items-center justify-end gap-3">
              <button
                onClick={cancelPermanentDelete}
                className="px-6 py-3 bg-gray-200 text-[#575756] rounded-xl hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmPermanentDelete}
                className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete Forever
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Task Preview Modal */}
      {showPreviewModal && previewTask && (
        <TaskPreviewModal
          task={previewTask}
          goals={goals}
          keyResults={keyResults}
          projects={projects}
          onClose={closePreviewModal}
          onEdit={handlePreviewEdit}
          onDelete={handlePreviewDelete}
          onRevive={handlePreviewRevive}
          onPermanentDelete={handlePreviewPermanentDelete}
          onMove={handlePreviewMove}
        />
      )}

      {/* Recovery Panel Modal */}
      {showRecoveryPanel && recoveryData && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[70] p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-2xl font-bold text-[#01416d]">🔍 Recovery Report</h3>
              <p className="text-sm text-[#575756] mt-1">Here's what we found in localStorage</p>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-[#01416d]">Tasks Found:</span>
                  <span className="text-3xl font-bold text-[#0083BD]">{recoveryData.tasks}</span>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-center">
                  <p className="text-sm text-[#575756]">Goals</p>
                  <p className="text-xl font-bold text-[#01416d]">{recoveryData.goals}</p>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-center">
                  <p className="text-sm text-[#575756]">Key Results</p>
                  <p className="text-xl font-bold text-[#01416d]">{recoveryData.keyResults}</p>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-center">
                  <p className="text-sm text-[#575756]">Projects</p>
                  <p className="text-xl font-bold text-[#01416d]">{recoveryData.projects}</p>
                </div>
              </div>

              {recoveryData.tasks > 0 ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-green-800 font-medium">
                    ✅ Great news! Your {recoveryData.tasks} task{recoveryData.tasks !== 1 ? 's' : ''} {recoveryData.tasks !== 1 ? 'have' : 'has'} been restored!
                  </p>
                </div>
              ) : (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-yellow-800 font-medium">
                    ⚠️ No tasks found in localStorage. Your data may have been cleared.
                  </p>
                  <p className="text-sm text-yellow-700 mt-2">
                    If you have a backup file, use the "Import from JSON" button in the header to restore your data.
                  </p>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => {
                  setShowRecoveryPanel(false);
                  setRecoveryData(null);
                }}
                className="px-6 py-3 bg-[#0083BD] text-white rounded-xl hover:bg-[#01416d] transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
