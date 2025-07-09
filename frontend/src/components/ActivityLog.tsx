import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CheckCircle, Star, Target, Trophy, Calendar } from 'lucide-react';
import type { RecentActivity } from 'types';

interface Props {
  activities: RecentActivity[];
}

const ActivityLog = ({ activities }: Props) => {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'lesson_completed':
        return <CheckCircle className="text-green-500" />;
      case 'practice_session':
        return <Target className="text-blue-500" />;
      case 'achievement_earned':
        return <Trophy className="text-yellow-500" />;
      default:
        return <Star className="text-purple-500" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-gray-500" />
          <span>Recent Activity</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-72">
          <ul className="space-y-4">
            {activities.map((activity) => (
              <li key={activity.id} className="flex items-start gap-4">
                <div className="p-2 bg-gray-100 rounded-full">
                  {getActivityIcon(activity.activity_type)}
                </div>
                <div>
                  <p className="font-medium text-sm">{activity.title}</p>
                  <p className="text-xs text-gray-500">{activity.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default ActivityLog;
