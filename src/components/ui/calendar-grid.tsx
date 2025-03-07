import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { useCalendarStore, type Event } from '../../store/calendar';
import { getMonthDays } from '../../lib/utils';
import { Plus } from 'lucide-react';

interface CalendarGridProps {
  year: number;
  month: number;
  onAddEvent: (date: Date) => void;
  onEventClick: (event: Event) => void;
}

export function CalendarGrid({ year, month, onAddEvent, onEventClick }: CalendarGridProps) {
  const events = useCalendarStore((state) => state.events);
  const tags = useCalendarStore((state) => state.tags);
  const days = getMonthDays(year, month);

  return (
    <div className="grid grid-cols-7 gap-px bg-gray-200">
      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
        <div
          key={day}
          className="bg-gray-50 p-2 text-center text-sm font-semibold text-gray-900"
        >
          {day}
        </div>
      ))}
      {days.map(({ date, isCurrentMonth }, index) => {
        const dayEvents = events.filter(
          (event) =>
            format(new Date(event.start), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
        );

        return (
          <motion.div
            key={date.toISOString()}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.01 }}
            className={`min-h-[120px] bg-white p-2 ${
              isCurrentMonth ? '' : 'bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-between">
              <span
                className={`text-sm ${
                  isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
                }`}
              >
                {format(date, 'd')}
              </span>
              <button
                onClick={() => onAddEvent(date)}
                className="rounded-full p-1 hover:bg-gray-100"
              >
                <Plus className="h-4 w-4 text-gray-400" />
              </button>
            </div>
            <div className="mt-2 space-y-1">
              {dayEvents.map((event) => {
                const eventTag = event.tags && event.tags.length > 0 ? tags.find(t => t.name === event.tags[0]) : null;
                const tagColor = eventTag ? eventTag.color : 'bg-blue-100 text-blue-700';

                return (
                  <motion.div
                    key={event.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onEventClick(event)}
                    className="cursor-pointer space-y-1"
                  >
                    <div className={`w-full rounded px-2 py-1 text-left text-xs ${tagColor}`}>
                      <div className="font-medium">{event.title}</div>
                      {event.assignees && event.assignees.length > 0 && (
                        <div className="mt-1 flex -space-x-1">
                          {event.assignees.map((assignee) => (
                            <img
                              key={assignee.id}
                              src={assignee.avatar}
                              alt={assignee.name}
                              className="h-4 w-4 rounded-full ring-2 ring-white"
                              title={assignee.name}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                    {event.tags && event.tags.slice(1).map((tag) => {
                      const tagData = tags.find(t => t.name === tag);
                      return tagData && (
                        <span
                          key={tag}
                          className={`inline-block rounded-full px-2 py-0.5 text-xs ${tagData.color}`}
                        >
                          {tag}
                        </span>
                      );
                    })}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}