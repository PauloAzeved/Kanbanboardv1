import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { KanbanBoard } from './components/KanbanBoard';

export default function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <KanbanBoard />
    </DndProvider>
  );
}