import React from 'react';
import { motion } from 'framer-motion';
import { format, addMonths, subMonths, addWeeks, subWeeks, addDays, subDays } from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { CalendarGrid } from './components/ui/calendar-grid';
import { WeekView } from './components/ui/week-view';
import { DayView } from './components/ui/day-view';
import { EventDialog } from './components/ui/event-dialog';
import { useCalendarStore, type Event, type ViewType } from './store/calendar';

function App() {
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const [isEventDialogOpen, setIsEventDialogOpen] = React.useState(false);
  const [selectedEvent, setSelectedEvent] = React.useState<Event | undefined>();
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>();
  
  const { view, setView, addEvent, updateEvent, deleteEvent } = useCalendarStore();

  const handlePrevious = () => {
    setCurrentDate((date) => {
      switch (view) {
        case 'month':
          return subMonths(date, 1);
        case 'week':
          return subWeeks(date, 1);
        case 'day':
          return subDays(date, 1);
        default:
          return date;
      }
    });
  };

  const handleNext = () => {
    setCurrentDate((date) => {
      switch (view) {
        case 'month':
          return addMonths(date, 1);
        case 'week':
          return addWeeks(date, 1);
        case 'day':
          return addDays(date, 1);
        default:
          return date;
      }
    });
  };

  const handleAddEvent = (date: Date) => {
    setSelectedDate(date);
    setSelectedEvent(undefined);
    setIsEventDialogOpen(true);
  };

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setIsEventDialogOpen(true);
  };

  const handleSaveEvent = (eventData: Omit<Event, 'id'>) => {
    if (selectedEvent) {
      updateEvent(selectedEvent.id, eventData);
    } else {
      addEvent(eventData);
    }
    setIsEventDialogOpen(false);
  };

  const handleDeleteEvent = (id: string) => {
    deleteEvent(id);
    setIsEventDialogOpen(false);
  };

  const renderView = () => {
    switch (view) {
      case 'month':
        return (
          <CalendarGrid
            year={currentDate.getFullYear()}
            month={currentDate.getMonth()}
            onAddEvent={handleAddEvent}
            onEventClick={handleEventClick}
          />
        );
      case 'week':
        return (
          <WeekView
            date={currentDate}
            onAddEvent={handleAddEvent}
            onEventClick={handleEventClick}
          />
        );
      case 'day':
        return (
          <DayView
            date={currentDate}
            onAddEvent={handleAddEvent}
            onEventClick={handleEventClick}
          />
        );
    }
  };

  const viewOptions: { value: ViewType; label: string }[] = [
    { value: 'month', label: 'Month' },
    { value: 'week', label: 'Week' },
    { value: 'day', label: 'Day' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-6xl rounded-xl bg-white p-8 shadow-xl"
      >
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <CalendarIcon className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">Calendar</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex rounded-lg bg-gray-100 p-1">
              {viewOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setView(option.value)}
                  className={`rounded-md px-3 py-1 text-sm font-medium transition-colors ${
                    view === option.value
                      ? 'bg-white text-blue-600 shadow'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
            <button
              onClick={handlePrevious}
              className="rounded-full p-2 hover:bg-gray-100"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <h2 className="text-xl font-semibold text-gray-700">
              {format(currentDate, view === 'month' ? 'MMMM yyyy' : 'MMM d, yyyy')}
            </h2>
            <button
              onClick={handleNext}
              className="rounded-full p-2 hover:bg-gray-100"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {renderView()}

        <EventDialog
          event={selectedEvent}
          selectedDate={selectedDate}
          isOpen={isEventDialogOpen}
          onClose={() => setIsEventDialogOpen(false)}
          onSave={handleSaveEvent}
          onDelete={handleDeleteEvent}
        />
      </motion.div>
    </div>
  );
}

export default App;