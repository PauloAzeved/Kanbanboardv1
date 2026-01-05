import { Task, Goal, KeyResult, Project, Importance, TaskStatus } from '../app/components/KanbanBoard';

export const seedData = {
  goals: [
    {
      id: 'goal-1',
      name: 'Contribute to User Testing techniques at CFC',
      createdAt: new Date().toISOString()
    },
    {
      id: 'goal-2',
      name: 'Initial Product Development concepts & flows',
      createdAt: new Date().toISOString()
    },
    {
      id: 'goal-3',
      name: 'Bring Product Design into the new Labs team',
      createdAt: new Date().toISOString()
    },
    {
      id: 'goal-4',
      name: 'Understanding of "Products as Code"',
      createdAt: new Date().toISOString()
    }
  ] as Goal[],
  
  keyResults: [
    {
      id: 'kr-1',
      name: 'Document processes and tools for different user testing techniques at CFC.',
      goalId: 'goal-1',
      createdAt: new Date().toISOString()
    },
    {
      id: 'kr-2',
      name: 'Ensure documentation of User Testing techniques is well-documented and accessible to the team at CFC.',
      goalId: 'goal-1',
      createdAt: new Date().toISOString()
    },
    {
      id: 'kr-3',
      name: 'Implement at least two new user testing techniques at CFC within the next quarter.',
      goalId: 'goal-1',
      createdAt: new Date().toISOString()
    },
    // Goal 2 Key Results
    {
      id: 'kr-4',
      name: 'Design intuitive and scalable flows for managing coverages',
      goalId: 'goal-2',
      createdAt: new Date().toISOString()
    },
    {
      id: 'kr-5',
      name: 'Define scalable flows for groupings of coverage',
      goalId: 'goal-2',
      createdAt: new Date().toISOString()
    },
    {
      id: 'kr-6',
      name: 'Define flows for setting limits & deductibles',
      goalId: 'goal-2',
      createdAt: new Date().toISOString()
    },
    {
      id: 'kr-7',
      name: 'Demonstrate ownership in defining the flows',
      goalId: 'goal-2',
      createdAt: new Date().toISOString()
    },
    {
      id: 'kr-8',
      name: 'Provide inputs for Proof of Value across Q1',
      goalId: 'goal-2',
      createdAt: new Date().toISOString()
    },
    // Goal 3 Key Results
    {
      id: 'kr-9',
      name: 'Design intuitive and scalable flows for managing coverages',
      goalId: 'goal-3',
      createdAt: new Date().toISOString()
    },
    {
      id: 'kr-10',
      name: 'Lead a design workshop on a Labs opportunity that leads to quick iteration of a new design artefact.',
      goalId: 'goal-3',
      createdAt: new Date().toISOString()
    },
    {
      id: 'kr-11',
      name: 'Participate in at least 2 proof of concept projects within the Labs concept to validate new design ideas.',
      goalId: 'goal-3',
      createdAt: new Date().toISOString()
    },
    // Goal 4 Key Results
    {
      id: 'kr-12',
      name: 'Discover the problems being solved by the "Products as Code" initiative',
      goalId: 'goal-4',
      createdAt: new Date().toISOString()
    },
    {
      id: 'kr-13',
      name: 'Consider the impact on existing user flows of the "Products as Code" initiative',
      goalId: 'goal-4',
      createdAt: new Date().toISOString()
    },
    {
      id: 'kr-14',
      name: 'Refactor existing user flows in collaboration with business stakeholders for the "Products as Code" initiative',
      goalId: 'goal-4',
      createdAt: new Date().toISOString()
    },
    {
      id: 'kr-15',
      name: 'Surface inputs into the Proof of Value project based on the understanding of "Products as Code"',
      goalId: 'goal-4',
      createdAt: new Date().toISOString()
    }
  ] as KeyResult[],
  
  projects: [] as Project[],
  
  tasks: [
    // Tasks for KR-1: Document processes and tools
    {
      id: 'task-1',
      title: 'Review and validate tools',
      description: 'Review and validate the tools used with the team',
      dueDate: '2026-03-31',
      importance: 'none' as Importance,
      status: 'todo' as TaskStatus,
      parentId: 'kr-1',
      parentType: 'keyResult' as const
    },
    {
      id: 'task-2',
      title: 'Establish final document',
      description: 'Establish final document in the cloud storage with feedback',
      dueDate: '2026-03-31',
      importance: 'none' as Importance,
      status: 'todo' as TaskStatus,
      parentId: 'kr-1',
      parentType: 'keyResult' as const
    },
    {
      id: 'task-3',
      title: 'Create clickable dashboard',
      description: 'Create a user-friendly clickable dashboard with each technique',
      dueDate: '2026-03-31',
      importance: 'none' as Importance,
      status: 'todo' as TaskStatus,
      parentId: 'kr-1',
      parentType: 'keyResult' as const
    },
    {
      id: 'task-4',
      title: 'Research and list tools',
      description: 'Research and list up existing tools/techniques',
      dueDate: '2026-03-31',
      importance: 'none' as Importance,
      status: 'todo' as TaskStatus,
      parentId: 'kr-1',
      parentType: 'keyResult' as const
    },
    
    // Tasks for KR-2: Ensure documentation
    {
      id: 'task-5',
      title: 'Schedule walkthrough',
      description: 'Schedule a walkthrough with the team to introduce the documentation',
      dueDate: '2026-03-31',
      importance: 'none' as Importance,
      status: 'todo' as TaskStatus,
      parentId: 'kr-2',
      parentType: 'keyResult' as const
    },
    {
      id: 'task-6',
      title: 'Organize content',
      description: 'Organize team content into clear sections',
      dueDate: '2026-03-31',
      importance: 'none' as Importance,
      status: 'todo' as TaskStatus,
      parentId: 'kr-2',
      parentType: 'keyResult' as const
    },
    {
      id: 'task-7',
      title: 'Test accessibility',
      description: 'Test the accessibility of resource with different team access',
      dueDate: '2026-03-31',
      importance: 'none' as Importance,
      status: 'todo' as TaskStatus,
      parentId: 'kr-2',
      parentType: 'keyResult' as const
    },
    {
      id: 'task-8',
      title: 'Design accessible documentation',
      description: 'Design accessible documentation with clear layouts, visuals',
      dueDate: '2026-03-31',
      importance: 'none' as Importance,
      status: 'todo' as TaskStatus,
      parentId: 'kr-2',
      parentType: 'keyResult' as const
    },
    
    // Tasks for KR-3: Implement two new techniques
    {
      id: 'task-9',
      title: 'Set up central location',
      description: 'Set up a central location for documentation and links to pilot projects',
      dueDate: '2026-03-31',
      importance: 'none' as Importance,
      status: 'todo' as TaskStatus,
      parentId: 'kr-3',
      parentType: 'keyResult' as const
    },
    {
      id: 'task-10',
      title: 'Identify new techniques',
      description: 'Identify two new techniques based on current CFC projects',
      dueDate: '2026-03-31',
      importance: 'none' as Importance,
      status: 'todo' as TaskStatus,
      parentId: 'kr-3',
      parentType: 'keyResult' as const
    },
    {
      id: 'task-11',
      title: 'Run pilot tests',
      description: 'Run one pilot tests for both techniques and gather feedback',
      dueDate: '2026-03-31',
      importance: 'none' as Importance,
      status: 'todo' as TaskStatus,
      parentId: 'kr-3',
      parentType: 'keyResult' as const
    },
    {
      id: 'task-12',
      title: 'Document methodology',
      description: 'Document the Methodology and lessons learned from pilot',
      dueDate: '2026-03-31',
      importance: 'none' as Importance,
      status: 'todo' as TaskStatus,
      parentId: 'kr-3',
      parentType: 'keyResult' as const
    },
    
    // GOAL 2: Initial Product Development concepts & flows
    // Tasks for KR-4: Design intuitive and scalable flows for managing coverages
    {
      id: 'task-13',
      title: 'Understand user perception',
      description: 'Understand how user perceives different coverages types',
      dueDate: '2026-03-31',
      importance: 'none' as Importance,
      status: 'todo' as TaskStatus,
      parentId: 'kr-4',
      parentType: 'keyResult' as const
    },
    {
      id: 'task-14',
      title: 'Organize workshop',
      description: 'Organize workshop with key stakeholders',
      dueDate: '2026-03-31',
      importance: 'none' as Importance,
      status: 'todo' as TaskStatus,
      parentId: 'kr-4',
      parentType: 'keyResult' as const
    },
    {
      id: 'task-15',
      title: 'Brainstorm concepts',
      description: 'Brainstorm concepts within the team',
      dueDate: '2026-03-31',
      importance: 'none' as Importance,
      status: 'todo' as TaskStatus,
      parentId: 'kr-4',
      parentType: 'keyResult' as const
    },
    
    // Tasks for KR-5: Define scalable flows for groupings of coverage
    {
      id: 'task-16',
      title: 'Define different use cases',
      description: 'Define different use cases',
      dueDate: '2026-03-31',
      importance: 'none' as Importance,
      status: 'todo' as TaskStatus,
      parentId: 'kr-5',
      parentType: 'keyResult' as const
    },
    {
      id: 'task-17',
      title: 'Include flow diagrams',
      description: 'Include flow diagrams with FS team',
      dueDate: '2026-03-31',
      importance: 'none' as Importance,
      status: 'todo' as TaskStatus,
      parentId: 'kr-5',
      parentType: 'keyResult' as const
    },
    {
      id: 'task-18',
      title: 'Define technical constraints',
      description: 'Define technical constraints',
      dueDate: '2026-03-31',
      importance: 'none' as Importance,
      status: 'todo' as TaskStatus,
      parentId: 'kr-5',
      parentType: 'keyResult' as const
    },
    {
      id: 'task-19',
      title: 'Create documentation',
      description: 'Create documentation on the flow',
      dueDate: '2026-03-31',
      importance: 'none' as Importance,
      status: 'todo' as TaskStatus,
      parentId: 'kr-5',
      parentType: 'keyResult' as const
    },
    
    // Tasks for KR-6: Define flows for setting limits & deductibles
    {
      id: 'task-20',
      title: 'Brainstorm use cases for MVP',
      description: 'Brainstorm different use cases for MVP',
      dueDate: '2026-03-31',
      importance: 'none' as Importance,
      status: 'todo' as TaskStatus,
      parentId: 'kr-6',
      parentType: 'keyResult' as const
    },
    {
      id: 'task-21',
      title: 'Create flow diagrams',
      description: 'Create flow diagrams',
      dueDate: '2026-03-31',
      importance: 'none' as Importance,
      status: 'todo' as TaskStatus,
      parentId: 'kr-6',
      parentType: 'keyResult' as const
    },
    
    // Tasks for KR-7: Demonstrate ownership in defining the flows
    {
      id: 'task-22',
      title: 'Address feedback',
      description: 'Address feedback from team on coverage flow',
      dueDate: '2026-03-31',
      importance: 'none' as Importance,
      status: 'todo' as TaskStatus,
      parentId: 'kr-7',
      parentType: 'keyResult' as const
    },
    {
      id: 'task-23',
      title: 'Define detailed flow diagrams',
      description: 'Define detailed flow diagrams for coverage',
      dueDate: '2026-03-31',
      importance: 'none' as Importance,
      status: 'todo' as TaskStatus,
      parentId: 'kr-7',
      parentType: 'keyResult' as const
    },
    
    // Tasks for KR-8: Provide inputs for Proof of Value across Q1
    {
      id: 'task-24',
      title: 'Validate coverage flows',
      description: 'Validate all coverage flows with design team',
      dueDate: '2026-03-31',
      importance: 'none' as Importance,
      status: 'todo' as TaskStatus,
      parentId: 'kr-8',
      parentType: 'keyResult' as const
    },
    {
      id: 'task-25',
      title: 'Ideate flow concepts',
      description: 'Ideate flow concepts for coverage use case',
      dueDate: '2026-03-31',
      importance: 'none' as Importance,
      status: 'todo' as TaskStatus,
      parentId: 'kr-8',
      parentType: 'keyResult' as const
    },
    {
      id: 'task-26',
      title: 'Communicate concepts',
      description: 'Communicate concepts with design team',
      dueDate: '2026-03-31',
      importance: 'none' as Importance,
      status: 'todo' as TaskStatus,
      parentId: 'kr-8',
      parentType: 'keyResult' as const
    },
    
    // GOAL 3: Bring Product Design into the new Labs team
    // Tasks for KR-9: Design intuitive and scalable flows for managing coverages
    {
      id: 'task-27',
      title: 'Join Labs presentation',
      description: 'Join Labs presentation on design platform',
      dueDate: '2026-03-31',
      importance: 'none' as Importance,
      status: 'todo' as TaskStatus,
      parentId: 'kr-9',
      parentType: 'keyResult' as const
    },
    {
      id: 'task-28',
      title: 'Translate ideas',
      description: 'Translate ideas into high-level flows',
      dueDate: '2026-03-31',
      importance: 'none' as Importance,
      status: 'todo' as TaskStatus,
      parentId: 'kr-9',
      parentType: 'keyResult' as const
    },
    {
      id: 'task-29',
      title: 'Analyze requirements',
      description: 'Analyze requirements with the Labs team',
      dueDate: '2026-03-31',
      importance: 'none' as Importance,
      status: 'todo' as TaskStatus,
      parentId: 'kr-9',
      parentType: 'keyResult' as const
    },
    {
      id: 'task-30',
      title: 'Create comprehensive plan',
      description: 'Create comprehensive plan for product platform',
      dueDate: '2026-03-31',
      importance: 'none' as Importance,
      status: 'todo' as TaskStatus,
      parentId: 'kr-9',
      parentType: 'keyResult' as const
    },
    
    // Tasks for KR-10: Lead a design workshop on a Labs opportunity
    {
      id: 'task-31',
      title: 'Identify a Labs opportunity',
      description: 'Identify a Labs opportunity for design workshop',
      dueDate: '2026-03-31',
      importance: 'none' as Importance,
      status: 'todo' as TaskStatus,
      parentId: 'kr-10',
      parentType: 'keyResult' as const
    },
    {
      id: 'task-32',
      title: 'Engage workshop',
      description: 'Engage workshop structured with Labs team',
      dueDate: '2026-03-31',
      importance: 'none' as Importance,
      status: 'todo' as TaskStatus,
      parentId: 'kr-10',
      parentType: 'keyResult' as const
    },
    {
      id: 'task-33',
      title: 'Facilitate workshop',
      description: 'Facilitate the workshop sessions with insights',
      dueDate: '2026-03-31',
      importance: 'none' as Importance,
      status: 'todo' as TaskStatus,
      parentId: 'kr-10',
      parentType: 'keyResult' as const
    },
    {
      id: 'task-34',
      title: 'Covered stakeholder input',
      description: 'Covered stakeholder input across with Labs team',
      dueDate: '2026-03-31',
      importance: 'none' as Importance,
      status: 'todo' as TaskStatus,
      parentId: 'kr-10',
      parentType: 'keyResult' as const
    },
    
    // Tasks for KR-11: Participate in at least 2 proof of concept projects
    {
      id: 'task-35',
      title: 'Validate PoC projects',
      description: 'Validate PoC projects with Labs team',
      dueDate: '2026-03-31',
      importance: 'none' as Importance,
      status: 'todo' as TaskStatus,
      parentId: 'kr-11',
      parentType: 'keyResult' as const
    },
    {
      id: 'task-36',
      title: 'Collaborate with Labs',
      description: 'Collaborate with Labs to integrate design ideas',
      dueDate: '2026-03-31',
      importance: 'none' as Importance,
      status: 'todo' as TaskStatus,
      parentId: 'kr-11',
      parentType: 'keyResult' as const
    },
    {
      id: 'task-37',
      title: 'Provide prototypes',
      description: 'Provide prototypes based on proof of concept',
      dueDate: '2026-03-31',
      importance: 'none' as Importance,
      status: 'todo' as TaskStatus,
      parentId: 'kr-11',
      parentType: 'keyResult' as const
    },
    {
      id: 'task-38',
      title: 'Document learnings',
      description: 'Document learnings and iterations with PoC team',
      dueDate: '2026-03-31',
      importance: 'none' as Importance,
      status: 'todo' as TaskStatus,
      parentId: 'kr-11',
      parentType: 'keyResult' as const
    },
    {
      id: 'task-39',
      title: 'Track design iterations',
      description: 'Track design iterations using Labs projects',
      dueDate: '2026-03-31',
      importance: 'none' as Importance,
      status: 'todo' as TaskStatus,
      parentId: 'kr-11',
      parentType: 'keyResult' as const
    },
    {
      id: 'task-40',
      title: 'Collect feedback',
      description: 'Collect feedback from proof of concept implementation',
      dueDate: '2026-03-31',
      importance: 'none' as Importance,
      status: 'todo' as TaskStatus,
      parentId: 'kr-11',
      parentType: 'keyResult' as const
    },
    {
      id: 'task-41',
      title: 'Prepare presentation',
      description: 'Prepare presentation with reflections on proof concept',
      dueDate: '2026-03-31',
      importance: 'none' as Importance,
      status: 'todo' as TaskStatus,
      parentId: 'kr-11',
      parentType: 'keyResult' as const
    },
    
    // GOAL 4: Understanding of "Products as Code"
    // Tasks for KR-12: Discover the problems being solved
    {
      id: 'task-42',
      title: 'Review documentation',
      description: 'Review documentation about Products as Code',
      dueDate: '2026-03-31',
      importance: 'none' as Importance,
      status: 'todo' as TaskStatus,
      parentId: 'kr-12',
      parentType: 'keyResult' as const
    },
    {
      id: 'task-43',
      title: 'Interview stakeholders',
      description: 'Interview stakeholders on pain points of objectives',
      dueDate: '2026-03-31',
      importance: 'none' as Importance,
      status: 'todo' as TaskStatus,
      parentId: 'kr-12',
      parentType: 'keyResult' as const
    },
    {
      id: 'task-44',
      title: 'Identify challenges',
      description: 'Identify challenges in existing product workflows',
      dueDate: '2026-03-31',
      importance: 'none' as Importance,
      status: 'todo' as TaskStatus,
      parentId: 'kr-12',
      parentType: 'keyResult' as const
    },
    {
      id: 'task-45',
      title: 'Share findings',
      description: 'Share findings with team for alignment',
      dueDate: '2026-03-31',
      importance: 'none' as Importance,
      status: 'todo' as TaskStatus,
      parentId: 'kr-12',
      parentType: 'keyResult' as const
    },
    
    // Tasks for KR-13: Consider the impact on existing user flows
    {
      id: 'task-46',
      title: 'Audit current flows',
      description: 'Audit current user flows impacted by the initiative',
      dueDate: '2026-03-31',
      importance: 'none' as Importance,
      status: 'todo' as TaskStatus,
      parentId: 'kr-13',
      parentType: 'keyResult' as const
    },
    {
      id: 'task-47',
      title: 'Map dependencies',
      description: 'Map dependencies between flows and initiative',
      dueDate: '2026-03-31',
      importance: 'none' as Importance,
      status: 'todo' as TaskStatus,
      parentId: 'kr-13',
      parentType: 'keyResult' as const
    },
    {
      id: 'task-48',
      title: 'Conduct impact analysis',
      description: 'Conduct impact analysis on engineering team',
      dueDate: '2026-03-31',
      importance: 'none' as Importance,
      status: 'todo' as TaskStatus,
      parentId: 'kr-13',
      parentType: 'keyResult' as const
    },
    {
      id: 'task-49',
      title: 'Review analysis',
      description: 'Review analysis with stakeholders for impact',
      dueDate: '2026-03-31',
      importance: 'none' as Importance,
      status: 'todo' as TaskStatus,
      parentId: 'kr-13',
      parentType: 'keyResult' as const
    },
    
    // Tasks for KR-14: Refactor existing user flows
    {
      id: 'task-50',
      title: 'Prioritize flows',
      description: 'Prioritize flows for refactor in collaboration',
      dueDate: '2026-03-31',
      importance: 'none' as Importance,
      status: 'todo' as TaskStatus,
      parentId: 'kr-14',
      parentType: 'keyResult' as const
    },
    {
      id: 'task-51',
      title: 'Redesign flows',
      description: 'Redesign flows to align with Products as Code',
      dueDate: '2026-03-31',
      importance: 'none' as Importance,
      status: 'todo' as TaskStatus,
      parentId: 'kr-14',
      parentType: 'keyResult' as const
    },
    {
      id: 'task-52',
      title: 'Validate updated flows',
      description: 'Validate updated flows with stakeholders',
      dueDate: '2026-03-31',
      importance: 'none' as Importance,
      status: 'todo' as TaskStatus,
      parentId: 'kr-14',
      parentType: 'keyResult' as const
    },
    {
      id: 'task-53',
      title: 'Publish updated documentation',
      description: 'Publish updated documentation for business teams',
      dueDate: '2026-03-31',
      importance: 'none' as Importance,
      status: 'todo' as TaskStatus,
      parentId: 'kr-14',
      parentType: 'keyResult' as const
    },
    
    // Tasks for KR-15: Surface inputs into the Proof of Value project
    {
      id: 'task-54',
      title: 'Identify major insights',
      description: 'Identify major insights from PoV for team of idea',
      dueDate: '2026-03-31',
      importance: 'none' as Importance,
      status: 'todo' as TaskStatus,
      parentId: 'kr-15',
      parentType: 'keyResult' as const
    },
    {
      id: 'task-55',
      title: 'Present insights',
      description: 'Present insights to PoV stakeholders for team',
      dueDate: '2026-03-31',
      importance: 'none' as Importance,
      status: 'todo' as TaskStatus,
      parentId: 'kr-15',
      parentType: 'keyResult' as const
    },
    {
      id: 'task-56',
      title: 'Iterate design inputs',
      description: 'Iterate design inputs based on feedback',
      dueDate: '2026-03-31',
      importance: 'none' as Importance,
      status: 'todo' as TaskStatus,
      parentId: 'kr-15',
      parentType: 'keyResult' as const
    }
  ] as Task[]
};