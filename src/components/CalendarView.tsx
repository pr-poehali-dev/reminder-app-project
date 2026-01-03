import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

type CalendarEvent = {
  id: string;
  title: string;
  type: 'reminder' | 'workout';
  date: Date;
  completed: boolean;
};

export default function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const events: CalendarEvent[] = [
    {
      id: '1',
      title: 'Встреча с командой',
      type: 'reminder',
      date: new Date(2026, 0, 4),
      completed: false,
    },
    {
      id: '2',
      title: 'Жим лёжа',
      type: 'workout',
      date: new Date(2026, 0, 6),
      completed: false,
    },
    {
      id: '3',
      title: 'Купить продукты',
      type: 'reminder',
      date: new Date(2026, 0, 5),
      completed: true,
    },
  ];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek };
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    setSelectedDate(null);
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    setSelectedDate(null);
  };

  const isSameDay = (date1: Date, date2: Date) => {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  };

  const getEventsForDate = (day: number) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    return events.filter((event) => isSameDay(event.date, date));
  };

  const getSelectedDateEvents = () => {
    if (!selectedDate) return [];
    return events.filter((event) => isSameDay(event.date, selectedDate));
  };

  const monthNames = [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь',
  ];

  const weekDays = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];

  const today = new Date();

  return (
    <div className="space-y-6">
      <Card className="rounded-3xl border-2">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" onClick={previousMonth} className="rounded-xl">
                <Icon name="ChevronLeft" size={18} />
              </Button>
              <Button variant="outline" size="icon" onClick={nextMonth} className="rounded-xl">
                <Icon name="ChevronRight" size={18} />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2 mb-2">
            {weekDays.map((day) => (
              <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: startingDayOfWeek === 0 ? 6 : startingDayOfWeek - 1 }).map((_, i) => (
              <div key={`empty-${i}`} className="aspect-square" />
            ))}

            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
              const dayEvents = getEventsForDate(day);
              const isToday = isSameDay(date, today);
              const isSelected = selectedDate && isSameDay(date, selectedDate);

              return (
                <button
                  key={day}
                  onClick={() => setSelectedDate(date)}
                  className={`aspect-square rounded-xl p-2 text-sm font-medium transition-all hover:bg-accent relative ${
                    isToday ? 'bg-primary/10 border-2 border-primary' : ''
                  } ${isSelected ? 'bg-primary text-primary-foreground hover:bg-primary' : ''}`}
                >
                  <div className="flex flex-col items-center justify-center h-full">
                    <span>{day}</span>
                    {dayEvents.length > 0 && (
                      <div className="flex gap-0.5 mt-1">
                        {dayEvents.slice(0, 2).map((event) => (
                          <div
                            key={event.id}
                            className={`w-1.5 h-1.5 rounded-full ${
                              event.type === 'reminder'
                                ? isSelected
                                  ? 'bg-primary-foreground'
                                  : 'bg-purple-500'
                                : isSelected
                                ? 'bg-primary-foreground'
                                : 'bg-green-500'
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {selectedDate && (
        <Card className="rounded-3xl border-2 animate-fade-in">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Icon name="Calendar" size={20} />
              {selectedDate.toLocaleDateString('ru-RU', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {getSelectedDateEvents().length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Icon name="Inbox" size={32} className="mx-auto mb-2 opacity-50" />
                <p>Нет задач на этот день</p>
              </div>
            ) : (
              <div className="space-y-3">
                {getSelectedDateEvents().map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center gap-3 p-3 rounded-2xl bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                        event.type === 'reminder' ? 'bg-purple-100' : 'bg-green-100'
                      }`}
                    >
                      <Icon
                        name={event.type === 'reminder' ? 'Bell' : 'Dumbbell'}
                        size={16}
                        className={event.type === 'reminder' ? 'text-purple-600' : 'text-green-600'}
                      />
                    </div>
                    <div className="flex-1">
                      <p className={`font-medium ${event.completed ? 'line-through text-muted-foreground' : ''}`}>
                        {event.title}
                      </p>
                      <Badge variant="outline" className="text-xs mt-1">
                        {event.type === 'reminder' ? 'Напоминание' : 'Тренировка'}
                      </Badge>
                    </div>
                    {event.completed && (
                      <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                        <Icon name="Check" size={14} className="text-white" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-2 gap-3">
        <Card className="rounded-2xl border-2">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
              <Icon name="Bell" size={20} className="text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{events.filter((e) => e.type === 'reminder').length}</p>
              <p className="text-sm text-muted-foreground">Напоминаний</p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-2">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
              <Icon name="Dumbbell" size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{events.filter((e) => e.type === 'workout').length}</p>
              <p className="text-sm text-muted-foreground">Тренировок</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
