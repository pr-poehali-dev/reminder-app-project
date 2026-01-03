import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import Reminders from '@/components/Reminders';
import WorkoutPlan from '@/components/WorkoutPlan';
import WorkoutStats from '@/components/WorkoutStats';
import CalendarView from '@/components/CalendarView';

export default function Index() {
  const [activeTab, setActiveTab] = useState('calendar');

  const getHeaderContent = () => {
    switch (activeTab) {
      case 'calendar':
        return {
          icon: 'Calendar',
          title: 'Календарь',
          subtitle: 'Планируйте задачи и тренировки',
        };
      case 'reminders':
        return {
          icon: 'Bell',
          title: 'Напоминания',
          subtitle: 'Организуйте свои задачи просто и эффективно',
        };
      case 'workouts':
        return {
          icon: 'Dumbbell',
          title: 'Тренировки',
          subtitle: 'Отслеживайте прогресс и достигайте целей',
        };
      case 'stats':
        return {
          icon: 'TrendingUp',
          title: 'Статистика',
          subtitle: 'Анализируйте свои результаты',
        };
      default:
        return {
          icon: 'Calendar',
          title: 'Календарь',
          subtitle: 'Планируйте задачи и тренировки',
        };
    }
  };

  const header = getHeaderContent();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <header className="text-center space-y-2 animate-fade-in pt-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-purple-400 rounded-2xl flex items-center justify-center shadow-lg">
              <Icon name={header.icon as any} size={24} className="text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
            {header.title}
          </h1>
          <p className="text-muted-foreground text-lg">{header.subtitle}</p>
        </header>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-4 rounded-2xl p-1 animate-slide-up">
            <TabsTrigger value="calendar" className="rounded-xl data-[state=active]:shadow-md">
              <Icon name="Calendar" size={18} className="mr-2" />
              <span className="hidden sm:inline">Календарь</span>
            </TabsTrigger>
            <TabsTrigger value="reminders" className="rounded-xl data-[state=active]:shadow-md">
              <Icon name="Bell" size={18} className="mr-2" />
              <span className="hidden sm:inline">Задачи</span>
            </TabsTrigger>
            <TabsTrigger value="workouts" className="rounded-xl data-[state=active]:shadow-md">
              <Icon name="Dumbbell" size={18} className="mr-2" />
              <span className="hidden sm:inline">План</span>
            </TabsTrigger>
            <TabsTrigger value="stats" className="rounded-xl data-[state=active]:shadow-md">
              <Icon name="TrendingUp" size={18} className="mr-2" />
              <span className="hidden sm:inline">Статистика</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="calendar" className="mt-6">
            <CalendarView />
          </TabsContent>

          <TabsContent value="reminders" className="mt-6">
            <Reminders />
          </TabsContent>

          <TabsContent value="workouts" className="mt-6">
            <WorkoutPlan />
          </TabsContent>

          <TabsContent value="stats" className="mt-6">
            <WorkoutStats />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
