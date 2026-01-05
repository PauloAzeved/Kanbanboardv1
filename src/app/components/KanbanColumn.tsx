import { useDrop } from 'react-dnd';
import { TaskCard } from './TaskCard';
import { Task, TaskStatus, Goal, KeyResult, Project } from './KanbanBoard';

interface KanbanColumnProps {
  title: string;
  status: TaskStatus;
  tasks: Task[];
  moveTask: (taskId: string, newStatus: TaskStatus) => void;
  goals: Goal[];
  keyResults: KeyResult[];
  projects: Project[];
  onMarkAsWontDo?: (taskId: string) => void;
  onEditTask?: (task: Task) => void;
  onDeleteTask?: (taskId: string) => void;
  onReviveTask?: (taskId: string) => void;
  onRequestPermanentDelete?: (taskId: string) => void;
  onPreviewTask?: (task: Task) => void;
  onArchiveNow?: (taskId: string) => void;
  onMoveToBacklog?: (taskId: string) => void;
  onMoveToToDo?: (taskId: string) => void;
  isArchive?: boolean;
}

export function KanbanColumn({ 
  title, 
  status, 
  tasks, 
  moveTask, 
  goals,
  keyResults,
  projects,
  onMarkAsWontDo,
  onEditTask,
  onDeleteTask,
  onReviveTask,
  onRequestPermanentDelete,
  onPreviewTask,
  onArchiveNow,
  onMoveToBacklog,
  onMoveToToDo,
  isArchive = false
}: KanbanColumnProps) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'TASK',
    drop: (item: { id: string }) => {
      moveTask(item.id, status);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }), [moveTask, status]);

  const getColumnColor = () => {
    switch (status) {
      case 'backlog':
        return 'from-[#8B5CF6] to-[#A78BFA]';
      case 'todo':
        return 'from-[#0083BD] to-[#149BD7]';
      case 'in-progress':
        return 'from-[#FF9500] to-[#FFB84D]';
      case 'done':
        return 'from-[#00A63E] to-[#00C950]';
      case 'archived':
        return 'from-[#6B7280] to-[#9CA3AF]';
      default:
        return 'from-[#0083BD] to-[#149BD7]';
    }
  };

  return (
    <div
      ref={drop}
      className={`bg-white/60 backdrop-blur-sm rounded-2xl p-4 min-h-[500px] transition-all ${
        isOver ? 'ring-2 ring-[#0083BD] bg-white/80' : ''
      } ${isArchive ? 'col-span-full' : ''}`}
    >
      {/* Column Header */}
      <div className={`bg-gradient-to-r ${getColumnColor()} text-white px-4 py-3 rounded-xl mb-4 shadow-md`}>
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">{title}</h3>
          <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
            {tasks.length}
          </span>
        </div>
      </div>

      {/* Tasks */}
      <div className={`space-y-3 ${isArchive ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 space-y-0' : ''}`}>
        {tasks.length === 0 ? (
          <div className="text-center py-8 text-[#9ca3af]">
            <p>No tasks {isArchive ? 'archived' : 'here'} yet</p>
          </div>
        ) : (
          tasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              goals={goals}
              keyResults={keyResults}
              projects={projects}
              onMarkAsWontDo={status === 'done' && onMarkAsWontDo ? onMarkAsWontDo : undefined}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
              onRevive={onReviveTask}
              onRequestPermanentDelete={onRequestPermanentDelete}
              onPreview={onPreviewTask}
              onArchiveNow={onArchiveNow}
              onMoveToBacklog={onMoveToBacklog}
              onMoveToToDo={onMoveToToDo}
            />
          ))
        )}
      </div>
    </div>
  );
}