import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

type Reminder = {
  id: string;
  title: string;
  description: string;
  category: string;
  time: string;
  completed: boolean;
};

const categories = [
  { value: 'work', label: 'Работа', color: 'bg-purple-100 text-purple-700' },
  { value: 'personal', label: 'Личное', color: 'bg-blue-100 text-blue-700' },
  { value: 'shopping', label: 'Покупки', color: 'bg-pink-100 text-pink-700' },
  { value: 'health', label: 'Здоровье', color: 'bg-green-100 text-green-700' },
];

export default function Reminders() {
  const [reminders, setReminders] = useState<Reminder[]>([
    {
      id: '1',
      title: 'Встреча с командой',
      description: 'Обсудить квартальные результаты',
      category: 'work',
      time: '14:00',
      completed: false,
    },
    {
      id: '2',
      title: 'Купить продукты',
      description: 'Молоко, хлеб, яйца',
      category: 'shopping',
      time: '18:00',
      completed: false,
    },
  ]);

  const [newReminder, setNewReminder] = useState({
    title: '',
    description: '',
    category: 'personal',
    time: '',
  });

  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const addReminder = () => {
    if (!newReminder.title.trim()) {
      toast.error('Введите название напоминания');
      return;
    }

    const reminder: Reminder = {
      id: Date.now().toString(),
      ...newReminder,
      completed: false,
    };

    setReminders([...reminders, reminder]);
    setNewReminder({ title: '', description: '', category: 'personal', time: '' });
    setIsDialogOpen(false);
    toast.success('Напоминание создано!');
  };

  const toggleComplete = (id: string) => {
    setReminders(
      reminders.map((r) =>
        r.id === id ? { ...r, completed: !r.completed } : r
      )
    );
  };

  const deleteReminder = (id: string) => {
    setReminders(reminders.filter((r) => r.id !== id));
    toast.success('Напоминание удалено');
  };

  const filteredReminders = reminders.filter(
    (r) => filterCategory === 'all' || r.category === filterCategory
  );

  const getCategoryColor = (category: string) => {
    return categories.find((c) => c.value === category)?.color || 'bg-gray-100 text-gray-700';
  };

  const getCategoryLabel = (category: string) => {
    return categories.find((c) => c.value === category)?.label || category;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3 justify-center animate-slide-up">
        <Button
          variant={filterCategory === 'all' ? 'default' : 'outline'}
          onClick={() => setFilterCategory('all')}
          className="rounded-full"
        >
          Все
        </Button>
        {categories.map((cat) => (
          <Button
            key={cat.value}
            variant={filterCategory === cat.value ? 'default' : 'outline'}
            onClick={() => setFilterCategory(cat.value)}
            className="rounded-full"
          >
            {cat.label}
          </Button>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button
            size="lg"
            className="w-full max-w-md mx-auto flex gap-2 shadow-lg hover:shadow-xl transition-all animate-scale-in rounded-2xl"
          >
            <Icon name="Plus" size={20} />
            Добавить напоминание
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">Новое напоминание</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Название</label>
              <Input
                placeholder="Встреча, покупки..."
                value={newReminder.title}
                onChange={(e) =>
                  setNewReminder({ ...newReminder, title: e.target.value })
                }
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Описание</label>
              <Textarea
                placeholder="Дополнительная информация..."
                value={newReminder.description}
                onChange={(e) =>
                  setNewReminder({ ...newReminder, description: e.target.value })
                }
                className="rounded-xl resize-none"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Категория</label>
                <Select
                  value={newReminder.category}
                  onValueChange={(value) =>
                    setNewReminder({ ...newReminder, category: value })
                  }
                >
                  <SelectTrigger className="rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Время</label>
                <Input
                  type="time"
                  value={newReminder.time}
                  onChange={(e) =>
                    setNewReminder({ ...newReminder, time: e.target.value })
                  }
                  className="rounded-xl"
                />
              </div>
            </div>
            <Button onClick={addReminder} className="w-full rounded-xl" size="lg">
              Создать
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="space-y-3">
        {filteredReminders.length === 0 ? (
          <Card className="border-2 border-dashed rounded-3xl animate-fade-in">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                <Icon name="Inbox" size={32} className="text-muted-foreground" />
              </div>
              <p className="text-muted-foreground text-lg">
                {filterCategory === 'all'
                  ? 'Нет напоминаний'
                  : `Нет напоминаний в категории "${getCategoryLabel(filterCategory)}"`}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredReminders.map((reminder, index) => (
            <Card
              key={reminder.id}
              className="overflow-hidden hover:shadow-md transition-all rounded-3xl animate-fade-in border-2"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <button
                    onClick={() => toggleComplete(reminder.id)}
                    className="mt-1 flex-shrink-0"
                  >
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                        reminder.completed
                          ? 'bg-primary border-primary'
                          : 'border-muted-foreground/30 hover:border-primary'
                      }`}
                    >
                      {reminder.completed && (
                        <Icon name="Check" size={14} className="text-white" />
                      )}
                    </div>
                  </button>

                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <h3
                        className={`font-semibold text-lg transition-all ${
                          reminder.completed
                            ? 'line-through text-muted-foreground'
                            : 'text-foreground'
                        }`}
                      >
                        {reminder.title}
                      </h3>
                      <button
                        onClick={() => deleteReminder(reminder.id)}
                        className="text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Icon name="Trash2" size={18} />
                      </button>
                    </div>

                    {reminder.description && (
                      <p className="text-muted-foreground text-sm">
                        {reminder.description}
                      </p>
                    )}

                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge className={`${getCategoryColor(reminder.category)} rounded-full`}>
                        {getCategoryLabel(reminder.category)}
                      </Badge>
                      {reminder.time && (
                        <Badge variant="outline" className="rounded-full">
                          <Icon name="Clock" size={12} className="mr-1" />
                          {reminder.time}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <div className="text-center text-sm text-muted-foreground pt-4">
        Всего: {filteredReminders.length} • Выполнено:{' '}
        {filteredReminders.filter((r) => r.completed).length}
      </div>
    </div>
  );
}
