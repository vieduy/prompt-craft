import React from "react";
import type { UserRoadmapProgress } from "types";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BookOpen } from "lucide-react";

interface Props {
  roadmapProgress: UserRoadmapProgress;
}

const MyRoadmapWidget = ({ roadmapProgress }: Props) => {
  const { roadmap, completed_items, total_items, current_item } = roadmapProgress;
  const progressPercentage = total_items > 0 ? (completed_items / total_items) * 100 : 0;

  const getNextStepLink = () => {
    if (!current_item) return "/roadmaps";
    if (current_item.item_type === 'lesson') {
      return `/lessons/${current_item.item_id}`;
    }
    if (current_item.item_type === 'challenge') {
      return `/practice/challenge/${current_item.item_id}`;
    }
    return "/roadmaps";
  };
  
  return (
    <Card className="bg-gradient-to-br from-purple-50 to-indigo-100 shadow-lg">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm font-medium text-purple-700">YOUR LEARNING ROADMAP</p>
            <CardTitle className="text-2xl text-gray-800">{roadmap.title}</CardTitle>
          </div>
          <BookOpen className="h-8 w-8 text-purple-400" />
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 mb-4">
          You are on your way to mastering {roadmap.title}! Keep up the great work.
        </p>

        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Progress</span>
            <span>{`${completed_items} / ${total_items} steps`}</span>
          </div>
          <Progress value={progressPercentage} className="w-full" />
        </div>

        {current_item ? (
          <div className="mt-6 bg-white p-4 rounded-lg">
            <h4 className="font-bold text-gray-800">Your Next Step:</h4>
            <p className="text-gray-600">{current_item.title}</p>
            <Button asChild className="mt-3 w-full">
              <Link to={getNextStepLink()}>
                {current_item.item_type === 'lesson' ? 'Start Lesson' : 'Start Challenge'}
              </Link>
            </Button>
          </div>
        ) : (
           <div className="mt-6 text-center">
             <p className="font-semibold text-lg text-green-600">🎉 Roadmap Completed! 🎉</p>
             <p>You have earned a new badge for your collection.</p>
           </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MyRoadmapWidget;
