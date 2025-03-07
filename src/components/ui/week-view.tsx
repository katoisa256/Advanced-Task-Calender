import { motion } from 'framer-motion';
import { format, addDays, startOfWeek } from 'date-fns';
import { useCalendarStore, type Event } from '../../store/calendar';
import { Plus } from 'lucide-react';

interface WeekViewProps {
  date: Date;
  onAddEvent: (date: Date) => void;
  onEventClick: (event: Event) => void;
}

export function WeekView({ date, onAddEvent, onEventClick }: WeekViewProps) {
  const events = useCalendarStore((state) => state.events);
  const tags = useCalendarStore((state) => state.tags);
  const weekStart = startOfWeek(date);
  
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  return (
    <div className="flex h-[600px] overflow-auto">
      <div className="w-16 flex-none border-r border-gray-200">
        {hours.map((hour) => (
          <div
            key={hour}
            className="relative h-20 border-b border-gray-100 text-xs"
          >
            <span className="absolute -top-2 right-2 text-gray-400">
              {hour.toString().padStart(2, '0')}:00
            </span>
          </div>
        ))}
      </div>
      <div className="flex flex-1">
        {days.map((day) => (
          <div
            key={day.toISOString()}
            className="flex-1 border-r border-gray-200"
          >
            <div className="sticky top-0 z-10 bg-white p-2 text-center">
              <div className="text-sm font-semibold">{format(day, 'EEE')}</div>
              <div className="text-xs text-gray-500">{format(day, 'd')}</div>
            </div>
            {hours.map((hour) => {
              const hourDate = new Date(day.setHours(hour));
              const hourEvents = events.filter(
                (event) =>
                  format(event.start, 'yyyy-MM-dd HH') ===
                  format(hourDate, 'yyyy-MM-dd HH')
              );

              return (
                <div
                  key={hour}
                  className="group relative h-20 border-b border-gray-100"
                >
                  <button
                    onClick={() => onAddEvent(hourDate)}
                    className="absolute right-1 top-1 hidden rounded-full p-1 hover:bg-gray-100 group-hover:block"
                  >
                    <Plus className="h-3 w-3 text-gray-400" />
                  </button>
                  {hourEvents.map((event) => (
                    <motion.div
                      key={event.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => onEventClick(event)}
                      className={`m-1 cursor-pointer rounded p-1 text-xs ${
                        event.tags[0]
                          ? tags.find((t) => t.name === event.tags[0])?.color
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      <div className="font-medium">{event.title}</div>
                      {event.assignees.length > 0 && (
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
                    </motion.div>
                  ))}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}