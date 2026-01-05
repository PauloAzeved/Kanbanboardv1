# CFC Kanban Board - Three-Level Hierarchy Task Management

A comprehensive Kanban board application built with React, TypeScript, and Tailwind CSS. Features a unique three-level hierarchy system (Goals → Key Results → Tasks and Projects → Tasks) with drag-and-drop functionality, automatic archiving, and complete data persistence.

## 🎯 Features

### Core Functionality
- **Three-Level Hierarchy**: Goals contain Key Results, Projects stand alone, both can have tasks
- **Kanban Workflow**: Backlog → To Do → In Progress → Done → Archive
- **Drag & Drop**: Intuitive task movement between columns
- **Auto-Archive**: Tasks automatically archive 2 days after completion
- **Won't Do Tracking**: Mark tasks as "won't do" instead of deleting
- **Complete Data Persistence**: All data saved to browser localStorage with auto-save

### Task Management
- Create tasks with title, description, due date, and importance levels (High/Medium/Low/None)
- Assign tasks to Key Results or Projects
- Edit, delete, and move tasks between columns
- Preview tasks with detailed modal view
- Filter by goals, key results, or projects
- Hide won't do tasks in archive view

### Data Management
- **Auto-Save**: Automatic saving to browser localStorage
- **Export/Import**: JSON backup and restore functionality
- **Sample Data**: Load 56 pre-configured CFC tasks for testing
- **Manual Save**: Visible save button with confirmation
- **Data Recovery**: Built-in recovery panel

### Design
- **CFC Style Guide**: Blue colors (#0083BD, #01416d)
- **Montserrat Font**: Professional typography
- **Responsive Design**: Works on desktop and tablet
- **Floating Save Indicator**: Visual confirmation of auto-save

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm, yarn, or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/cfc-kanban-board.git
cd cfc-kanban-board

# Install dependencies
npm install
# or
pnpm install
# or
yarn install
```

### Development

```bash
# Start development server
npm run dev
# or
pnpm dev
# or
yarn dev
```

Open [http://localhost:5173](http://localhost:5173) to view the app.

### Build for Production

```bash
# Build the application
npm run build
# or
pnpm build
# or
yarn build
```

## 📁 Project Structure

```
cfc-kanban-board/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── CreateGoalProjectModal.tsx
│   │   │   ├── CreateTaskModal.tsx
│   │   │   ├── EditTaskModal.tsx
│   │   │   ├── GoalProjectSelector.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── KanbanBoard.tsx
│   │   │   ├── KanbanColumn.tsx
│   │   │   ├── ManageGoalsProjectsModal.tsx
│   │   │   ├── TaskCard.tsx
│   │   │   └── TaskPreviewModal.tsx
│   │   └── App.tsx
│   ├── styles/
│   │   ├── index.css
│   │   ├── tailwind.css
│   │   ├── theme.css
│   │   └── fonts.css
│   └── utils/
│       └── seedData.ts
├── package.json
├── vite.config.ts
└── README.md
```

## 🎨 Technology Stack

- **React 18.3** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Styling
- **Vite** - Build tool
- **react-dnd** - Drag and drop functionality
- **date-fns** - Date formatting
- **lucide-react** - Icons

## 💾 Data Persistence

The application uses browser localStorage for automatic data persistence:

- **Auto-save**: Every change is automatically saved
- **Auto-load**: Data loads automatically on page refresh
- **Export**: Download JSON backup files
- **Import**: Restore from JSON backups
- **Sample Data**: Pre-loaded with 56 CFC user testing tasks

### Data Structure

```typescript
interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  importance: 'high' | 'medium' | 'low' | 'none';
  status: 'backlog' | 'todo' | 'in-progress' | 'done' | 'archived';
  parentId: string | null;
  parentType: 'keyResult' | 'project' | null;
  completedAt?: string;
  wontDo?: boolean;
}
```

## 🔄 Workflow

1. **Create Goals** - Top-level containers
2. **Add Key Results** - Belong to Goals
3. **Create Projects** - Standalone containers
4. **Create Tasks** - Assign to Key Results or Projects
5. **Move Through Workflow**: Backlog → To Do → In Progress → Done → Archive
6. **Mark Won't Do** - Alternative to deletion
7. **Auto-Archive** - Tasks archive 2 days after completion

## 🎯 Key Business Rules

- Tasks can never completely disappear (except permanent deletion from archive)
- All deleted/won't do tasks go to archive
- Tasks automatically archive 2 days after moving to Done
- Won't do tasks skip the 2-day waiting period
- Deleting goals/projects archives their associated tasks

## 📝 License

This project was created for CFC (Canadian Football Congress) task management.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 👨‍💼 Author

Created with Figma Make

---

**Note**: This application stores data in browser localStorage. For production use with multiple users, consider integrating a backend database.
