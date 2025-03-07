import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Tag, User } from 'lucide-react';
import type { Event, Assignee } from '../../store/calendar';
import { useCalendarStore } from '../../store/calendar';

interface EventDialogProps {
  event?: Event;
  selectedDate?: Date;
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: Omit<Event, 'id'>) => void;
  onDelete?: (id: string) => void;
}

export function EventDialog({
  event,
  selectedDate,
  isOpen,
  onClose,
  onSave,
  onDelete,
}: EventDialogProps) {
  const [title, setTitle] = React.useState(event?.title || '');
  const [description, setDescription] = React.useState(event?.description || '');
  const [start, setStart] = React.useState(event?.start || selectedDate || new Date());
  const [end, setEnd] = React.useState(event?.end || selectedDate || new Date());
  const [selectedAssignees, setSelectedAssignees] = React.useState<Assignee[]>(
    event?.assignees || []
  );
  const [selectedTags, setSelectedTags] = React.useState<string[]>(
    event?.tags || []
  );

  const { assignees, tags } = useCalendarStore();

  React.useEffect(() => {
    if (event) {
      setTitle(event.title);
      setDescription(event.description || '');
      setStart(event.start);
      setEnd(event.end);
      setSelectedAssignees(event.assignees);
      setSelectedTags(event.tags);
    } else if (selectedDate) {
      setStart(selectedDate);
      setEnd(selectedDate);
    }
  }, [event, selectedDate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      title,
      description,
      start,
      end,
      assignees: selectedAssignees,
      tags: selectedTags,
    });
    onClose();
  };

  const toggleAssignee = (assignee: Assignee) => {
    setSelectedAssignees((current) =>
      current.find((a) => a.id === assignee.id)
        ? current.filter((a) => a.id !== assignee.id)
        : [...current, assignee]
    );
  };

  const toggleTag = (tagName: string) => {
    setSelectedTags((current) =>
      current.includes(tagName)
        ? current.filter((t) => t !== tagName)
        : [...current, tagName]
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                {event ? 'Edit Event' : 'New Event'}
              </h2>
              <button
                onClick={onClose}
                className="rounded-full p-2 hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Start
                  </label>
                  <input
                    type="datetime-local"
                    value={format(start)}
                    onChange={(e) => setStart(new Date(e.target.value))}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    End
                  </label>
                  <input
                    type="datetime-local"
                    value={format(end)}
                    onChange={(e) => setEnd(new Date(e.target.value))}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Assignees
                  </div>
                </label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {assignees.map((assignee) => (
                    <button
                      key={assignee.id}
                      type="button"
                      onClick={() => toggleAssignee(assignee)}
                      className={`flex items-center gap-2 rounded-full px-3 py-1 text-sm ${
                        selectedAssignees.find((a) => a.id === assignee.id)
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {assignee.avatar && (
                        <img
                          src={assignee.avatar}
                          alt={assignee.name}
                          className="h-5 w-5 rounded-full"
                        />
                      )}
                      {assignee.name}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4" />
                    Tags
                  </div>
                </label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <button
                      key={tag.name}
                      type="button"
                      onClick={() => toggleTag(tag.name)}
                      className={`rounded-full px-3 py-1 text-sm ${
                        selectedTags.includes(tag.name)
                          ? tag.color
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {tag.name}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                {event && (
                  <button
                    type="button"
                    onClick={() => onDelete?.(event.id)}
                    className="rounded-md bg-red-50 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-100"
                  >
                    Delete
                  </button>
                )}
                <button
                  type="submit"
                  className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                  {event ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function format(date: Date): string {
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);
}