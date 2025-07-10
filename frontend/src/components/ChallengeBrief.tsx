import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Lightbulb, Target, ClipboardList } from "lucide-react";
import type { PracticeChallenge } from "types";

interface ChallengeBriefProps {
  challenge: PracticeChallenge;
}

const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-600 bg-green-100/50';
      case 'intermediate': return 'text-yellow-600 bg-yellow-100/50';
      case 'advanced': return 'text-red-600 bg-red-100/50';
      default: return 'text-gray-600 bg-gray-100/50';
    }
};

const ChallengeBrief: React.FC<ChallengeBriefProps> = ({ challenge }) => {
  return (
    <Card className="w-full bg-white/60 backdrop-blur-sm border-2 border-purple-200/50 shadow-lg shadow-purple-100/50 mb-6">
      <CardHeader className="p-6">
        <div className="flex justify-between items-start">
            <CardTitle className="text-2xl font-bold text-gray-900">{challenge.title}</CardTitle>
            <Badge className={`${getDifficultyColor(challenge.difficulty_level)} px-3 py-1 text-sm`}>
                {challenge.difficulty_level}
            </Badge>
        </div>
        <CardDescription className="text-gray-600 mt-2">{challenge.description}</CardDescription>
      </CardHeader>
      <CardContent className="p-6 pt-0 space-y-6">
        <div className="p-4 bg-blue-500/5 rounded-lg border border-blue-200/50">
            <h3 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                <Target className="h-5 w-5" />
                The Scenario
            </h3>
            <p className="text-gray-700">{challenge.context}</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="p-4 bg-green-500/5 rounded-lg border border-green-200/50">
                <h3 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                    <ClipboardList className="h-5 w-5" />
                    Your Mission
                </h3>
                <p className="text-gray-700">{challenge.target_outcome}</p>
            </div>
            <div className="p-4 bg-yellow-500/5 rounded-lg border border-yellow-200/50">
                <h3 className="font-semibold text-yellow-800 mb-2 flex items-center gap-2">
                    <Lightbulb className="h-5 w-5" />
                    Example Output
                </h3>
                <p className="text-gray-700 italic">"{challenge.example_output}"</p>
            </div>
        </div>
        
        <Separator />
        
        <div>
            <h4 className="font-semibold mb-2 text-gray-800">Scoring Keys:</h4>
            <div className="flex flex-wrap gap-2">
              {Object.entries(challenge.scoring_criteria).map(([criterion, criterionData]) => {
                const data = criterionData as { max_score: number; description: string };
                return (
                  <Badge key={criterion} variant="secondary" className="px-2 py-1" title={data.description}>
                    {criterion.replace(/_/g, ' ')}: <span className="font-mono ml-1.5">{data.max_score} pts</span>
                  </Badge>
                );
              })}
            </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChallengeBrief;
