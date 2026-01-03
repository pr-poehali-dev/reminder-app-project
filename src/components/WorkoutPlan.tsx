import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

type Exercise = {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight?: number;
  completed: boolean;
};

type Workout = {
  id: string;
  day: string;
  exercises: Exercise[];
  completed: boolean;
};

const weekDays = [
  { value: 'monday', label: 'Понедельник' },
  { value: 'tuesday', label: 'Вторник' },
  { value: 'wednesday', label: 'Среда' },
  { value: 'thursday', label: 'Четверг' },
  { value: 'friday', label: 'Пятница' },
  { value: 'saturday', label: 'Суббота' },
  { value: 'sunday', label: 'Воскресенье' },
];

export default function WorkoutPlan() {
  const [workouts, setWorkouts] = useState<Workout[]>([
    {
      id: '1',
      day: 'monday',
      exercises: [
        { id: '1-1', name: 'Жим лёжа', sets: 4, reps: 10, weight: 60, completed: false },
        { id: '1-2', name: 'Разводка гантелей', sets: 3, reps: 12, weight: 15, completed: false },
        { id: '1-3', name: 'Отжимания', sets: 3, reps: 15, completed: false },
      ],
      completed: false,
    },
    {
      id: '2',
      day: 'wednesday',
      exercises: [
        { id: '2-1', name: 'Приседания', sets: 4, reps: 12, weight: 80, completed: false },
        { id: '2-2', name: 'Выпады', sets: 3, reps: 10, completed: false },
        { id: '2-3', name: 'Планка', sets: 3, reps: 60, completed: false },
      ],
      completed: false,
    },
  ]);

  const [newExercise, setNewExercise] = useState({
    name: '',
    sets: 3,
    reps: 10,
    weight: 0,
    day: 'monday',
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const addExercise = () => {
    if (!newExercise.name.trim()) {
      toast.error('Введите название упражнения');
      return;
    }

    const workoutIndex = workouts.findIndex((w) => w.day === newExercise.day);

    if (workoutIndex >= 0) {
      const updatedWorkouts = [...workouts];
      const exercise: Exercise = {
        id: `${Date.now()}`,
        name: newExercise.name,
        sets: newExercise.sets,
        reps: newExercise.reps,
        weight: newExercise.weight || undefined,
        completed: false,
      };
      updatedWorkouts[workoutIndex].exercises.push(exercise);
      setWorkouts(updatedWorkouts);
    } else {
      const newWorkout: Workout = {
        id: Date.now().toString(),
        day: newExercise.day,
        exercises: [
          {
            id: `${Date.now()}`,
            name: newExercise.name,
            sets: newExercise.sets,
            reps: newExercise.reps,
            weight: newExercise.weight || undefined,
            completed: false,
          },
        ],
        completed: false,
      };
      setWorkouts([...workouts, newWorkout]);
    }

    setNewExercise({ name: '', sets: 3, reps: 10, weight: 0, day: 'monday' });
    setIsDialogOpen(false);
    toast.success('Упражнение добавлено!');
  };

  const toggleExercise = (workoutId: string, exerciseId: string) => {
    setWorkouts(
      workouts.map((w) =>
        w.id === workoutId
          ? {
              ...w,
              exercises: w.exercises.map((e) =>
                e.id === exerciseId ? { ...e, completed: !e.completed } : e
              ),
            }
          : w
      )
    );
  };

  const deleteExercise = (workoutId: string, exerciseId: string) => {
    setWorkouts(
      workouts.map((w) =>
        w.id === workoutId
          ? { ...w, exercises: w.exercises.filter((e) => e.id !== exerciseId) }
          : w
      ).filter((w) => w.exercises.length > 0)
    );
    toast.success('Упражнение удалено');
  };

  const getDayLabel = (day: string) => {
    return weekDays.find((d) => d.value === day)?.label || day;
  };

  const sortedWorkouts = [...workouts].sort((a, b) => {
    const orderMap = weekDays.reduce((acc, day, idx) => ({ ...acc, [day.value]: idx }), {} as Record<string, number>);
    return orderMap[a.day] - orderMap[b.day];
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">План тренировок</h2>
          <p className="text-muted-foreground">Отслеживайте свои упражнения</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-2xl shadow-lg">
              <Icon name="Plus" size={18} className="mr-2" />
              Добавить упражнение
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md rounded-3xl">
            <DialogHeader>
              <DialogTitle className="text-2xl">Новое упражнение</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">День недели</label>
                <Select
                  value={newExercise.day}
                  onValueChange={(value) => setNewExercise({ ...newExercise, day: value })}
                >
                  <SelectTrigger className="rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {weekDays.map((day) => (
                      <SelectItem key={day.value} value={day.value}>
                        {day.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Название</label>
                <Input
                  placeholder="Жим лёжа, приседания..."
                  value={newExercise.name}
                  onChange={(e) => setNewExercise({ ...newExercise, name: e.target.value })}
                  className="rounded-xl"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Подходы</label>
                  <Input
                    type="number"
                    min="1"
                    value={newExercise.sets}
                    onChange={(e) => setNewExercise({ ...newExercise, sets: parseInt(e.target.value) || 3 })}
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Повторы</label>
                  <Input
                    type="number"
                    min="1"
                    value={newExercise.reps}
                    onChange={(e) => setNewExercise({ ...newExercise, reps: parseInt(e.target.value) || 10 })}
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Вес, кг</label>
                  <Input
                    type="number"
                    min="0"
                    value={newExercise.weight}
                    onChange={(e) => setNewExercise({ ...newExercise, weight: parseInt(e.target.value) || 0 })}
                    className="rounded-xl"
                  />
                </div>
              </div>
              <Button onClick={addExercise} className="w-full rounded-xl" size="lg">
                Добавить
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {sortedWorkouts.length === 0 ? (
          <Card className="border-2 border-dashed rounded-3xl">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                <Icon name="Dumbbell" size={32} className="text-muted-foreground" />
              </div>
              <p className="text-muted-foreground text-lg">План тренировок пуст</p>
            </CardContent>
          </Card>
        ) : (
          sortedWorkouts.map((workout, wIndex) => (
            <Card key={workout.id} className="rounded-3xl border-2 animate-fade-in" style={{ animationDelay: `${wIndex * 0.1}s` }}>
              <CardContent className="p-5 space-y-3">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Icon name="Calendar" size={20} className="text-primary" />
                  </div>
                  <h3 className="text-xl font-bold">{getDayLabel(workout.day)}</h3>
                  <Badge variant="outline" className="ml-auto">
                    {workout.exercises.filter((e) => e.completed).length} / {workout.exercises.length}
                  </Badge>
                </div>

                <div className="space-y-2">
                  {workout.exercises.map((exercise) => (
                    <div
                      key={exercise.id}
                      className="flex items-center gap-3 p-3 rounded-2xl bg-muted/30 hover:bg-muted/50 transition-colors"
                    >
                      <button onClick={() => toggleExercise(workout.id, exercise.id)}>
                        <div
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                            exercise.completed
                              ? 'bg-primary border-primary'
                              : 'border-muted-foreground/30 hover:border-primary'
                          }`}
                        >
                          {exercise.completed && <Icon name="Check" size={14} className="text-white" />}
                        </div>
                      </button>

                      <div className="flex-1">
                        <p
                          className={`font-medium ${
                            exercise.completed ? 'line-through text-muted-foreground' : ''
                          }`}
                        >
                          {exercise.name}
                        </p>
                        <div className="flex gap-3 text-sm text-muted-foreground">
                          <span>{exercise.sets} × {exercise.reps}</span>
                          {exercise.weight && <span>• {exercise.weight} кг</span>}
                        </div>
                      </div>

                      <button
                        onClick={() => deleteExercise(workout.id, exercise.id)}
                        className="text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Icon name="Trash2" size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
