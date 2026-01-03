import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';

type WorkoutStat = {
  day: string;
  completed: number;
  total: number;
};

export default function WorkoutStats() {
  const weekStats: WorkoutStat[] = [
    { day: 'Пн', completed: 8, total: 10 },
    { day: 'Вт', completed: 0, total: 0 },
    { day: 'Ср', completed: 6, total: 9 },
    { day: 'Чт', completed: 0, total: 0 },
    { day: 'Пт', completed: 4, total: 8 },
    { day: 'Сб', completed: 0, total: 0 },
    { day: 'Вс', completed: 0, total: 0 },
  ];

  const totalExercises = weekStats.reduce((acc, stat) => acc + stat.total, 0);
  const completedExercises = weekStats.reduce((acc, stat) => acc + stat.completed, 0);
  const completionRate = totalExercises > 0 ? Math.round((completedExercises / totalExercises) * 100) : 0;

  const activeDays = weekStats.filter((stat) => stat.total > 0).length;
  const totalWeight = 1240;

  return (
    <div className="space-y-6">
      <Card className="rounded-3xl border-2">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Icon name="TrendingUp" size={24} />
            Статистика тренировок
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Прогресс недели</span>
              <span className="text-sm font-bold text-primary">{completionRate}%</span>
            </div>
            <Progress value={completionRate} className="h-3" />
            <p className="text-xs text-muted-foreground">
              {completedExercises} из {totalExercises} упражнений выполнено
            </p>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {weekStats.map((stat) => (
              <div key={stat.day} className="space-y-2">
                <div className="text-xs text-center font-medium text-muted-foreground">{stat.day}</div>
                <div className="relative">
                  <div className="w-full bg-muted rounded-lg overflow-hidden h-20 flex flex-col justify-end">
                    {stat.total > 0 && (
                      <div
                        className="bg-gradient-to-t from-primary to-purple-400 rounded-t-lg transition-all"
                        style={{ height: `${(stat.completed / Math.max(...weekStats.map(s => s.total))) * 100}%` }}
                      />
                    )}
                  </div>
                  {stat.total > 0 && (
                    <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
                      {stat.completed}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-3 gap-3">
        <Card className="rounded-2xl border-2">
          <CardContent className="p-4 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Icon name="Calendar" size={20} className="text-primary" />
            </div>
            <p className="text-2xl font-bold">{activeDays}</p>
            <p className="text-xs text-muted-foreground">Активных дней</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-2">
          <CardContent className="p-4 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
              <Icon name="CheckCircle2" size={20} className="text-green-600" />
            </div>
            <p className="text-2xl font-bold">{completedExercises}</p>
            <p className="text-xs text-muted-foreground">Упражнений</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-2">
          <CardContent className="p-4 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
              <Icon name="Weight" size={20} className="text-orange-600" />
            </div>
            <p className="text-2xl font-bold">{totalWeight}</p>
            <p className="text-xs text-muted-foreground">кг поднято</p>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-3xl border-2 bg-gradient-to-br from-primary/5 to-purple-100/50">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center flex-shrink-0">
              <Icon name="Trophy" size={24} className="text-white" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-lg">Отличная работа!</h3>
              <p className="text-sm text-muted-foreground">
                Вы тренировались {activeDays} {activeDays === 1 ? 'день' : 'дня'} на этой неделе. 
                Продолжайте в том же духе!
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
