import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Award, Trophy } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { AppApisDashboardAchievement as Achievement } from 'types';


interface Props {
  achievements: Achievement[];
}

const TrophyCase = ({ achievements }: Props) => {
  const earned = achievements.filter((a) => a.is_earned);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-500" />
          <span>Trophy Case</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {earned.length > 0 ? (
          <TooltipProvider>
            <div className="flex flex-wrap gap-4">
              {earned.map((a) => (
                <Tooltip key={a.id}>
                  <TooltipTrigger asChild>
                    <div className="p-3 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full text-white cursor-pointer">
                      <Award className="w-6 h-6" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="font-bold">{a.name}</p>
                    <p className="text-sm text-gray-500">{a.description}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          </TooltipProvider>
        ) : (
          <p className="text-sm text-gray-500">
            Your earned trophies will appear here. Keep learning to collect them!
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default TrophyCase;
