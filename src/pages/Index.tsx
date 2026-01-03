import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import Reminders from '@/components/Reminders';
import WorkoutPlan from '@/components/WorkoutPlan';

export default function Index() {
  const [activeTab, setActiveTab] = useState('reminders');

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <header className="text-center space-y-2 animate-fade-in pt-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-purple-400 rounded-2xl flex items-center justify-center shadow-lg">
              <Icon name={activeTab === 'reminders' ? 'Bell' : 'Dumbbell'} size={24} className="text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
            {activeTab === 'reminders' ? 'Напоминания' : 'Тренировки'}
          </h1>
          <p className="text-muted-foreground text-lg">
            {activeTab === 'reminders' 
              ? 'Организуйте свои задачи просто и эффективно'
              : 'Отслеживайте прогресс и достигайте целей'}
          </p>
        </header>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 rounded-2xl p-1 animate-slide-up">
            <TabsTrigger value="reminders" className="rounded-xl data-[state=active]:shadow-md">
              <Icon name="Bell" size={18} className="mr-2" />
              Напоминания
            </TabsTrigger>
            <TabsTrigger value="workouts" className="rounded-xl data-[state=active]:shadow-md">
              <Icon name="Dumbbell" size={18} className="mr-2" />
              Тренировки
            </TabsTrigger>
          </TabsList>

          <TabsContent value="reminders" className="mt-6">
            <Reminders />
          </TabsContent>

          <TabsContent value="workouts" className="mt-6">
            <WorkoutPlan />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
