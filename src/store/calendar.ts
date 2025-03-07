import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ViewType = 'month' | 'week' | 'day';

export interface Assignee {
  id: string;
  name: string;
  avatar?: string;
}

export interface Event {
  id: string;
  title: string;
  description?: string;
  start: Date;
  end: Date;
  color?: string;
  assignees: Assignee[];
  tags: string[];
}

interface CalendarState {
  events: Event[];
  view: ViewType;
  assignees: Assignee[];
  tags: { name: string; color: string }[];
  addEvent: (event: Omit<Event, 'id'>) => void;
  updateEvent: (id: string, event: Partial<Event>) => void;
  deleteEvent: (id: string) => void;
  setView: (view: ViewType) => void;
  addAssignee: (assignee: Omit<Assignee, 'id'>) => void;
  addTag: (name: string, color: string) => void;
}

const DEFAULT_ASSIGNEES: Assignee[] = [
  { id: '1', name: 'John Doe', avatar: 'https://i.pravatar.cc/150?u=john' },
  { id: '2', name: 'Jane Smith', avatar: 'https://i.pravatar.cc/150?u=jane' },
];

const DEFAULT_TAGS = [
  { name: 'Important', color: 'bg-red-100 text-red-700' },
  { name: 'Meeting', color: 'bg-blue-100 text-blue-700' },
  { name: 'Personal', color: 'bg-green-100 text-green-700' },
  { name: 'Work', color: 'bg-purple-100 text-purple-700' },
];

export const useCalendarStore = create<CalendarState>()(
  persist(
    (set) => ({
      events: [],
      view: 'month',
      assignees: DEFAULT_ASSIGNEES,
      tags: DEFAULT_TAGS,
      addEvent: (event) =>
        set((state) => ({
          events: [...state.events, { ...event, id: crypto.randomUUID() }],
        })),
      updateEvent: (id, event) =>
        set((state) => ({
          events: state.events.map((e) =>
            e.id === id ? { ...e, ...event } : e
          ),
        })),
      deleteEvent: (id) =>
        set((state) => ({
          events: state.events.filter((e) => e.id !== id),
        })),
      setView: (view) => set({ view }),
      addAssignee: (assignee) =>
        set((state) => ({
          assignees: [...state.assignees, { ...assignee, id: crypto.randomUUID() }],
        })),
      addTag: (name, color) =>
        set((state) => ({
          tags: [...state.tags, { name, color }],
        })),
    }),
    {
      name: 'calendar-storage',
    }
  )
);