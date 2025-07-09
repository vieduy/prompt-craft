import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, CheckCircle, XCircle, Award } from "lucide-react";
import type { PracticeSession, PracticeChallenge } from "types";

interface FeedbackCardProps {
  session: PracticeSession;
  challenge: PracticeChallenge;
}

const FeedbackCard: React.FC<FeedbackCardProps> = ({ session, challenge }) => {
  const getScoreColor = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 50) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <Card className="bg-white/60 backdrop-blur-sm border-gray-200/50 shadow-lg mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-2xl font-bold">
          <Award className="h-8 w-8 text-yellow-500" />
          <span>Analysis & Feedback</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-8 p-6">
        {/* Overall Score */}
        <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-gray-200/80">
          <div
            className={`text-6xl font-bold mb-2 bg-gradient-to-r ${getScoreColor(
              session.total_score,
              challenge.max_score
            )} bg-clip-text text-transparent`}
          >
            {session.total_score}
            <span className="text-3xl text-gray-400">
              /{challenge.max_score}
            </span>
          </div>
          <p className="text-gray-600 font-medium mb-4">Total Score</p>
          <Progress
            value={(session.total_score / challenge.max_score) * 100}
            className="w-full max-w-md mx-auto h-3"
          />
        </div>

        {/* Scoring Breakdown */}
        {session.scoring_breakdown && (
          <div>
            <h3 className="text-xl font-semibold mb-4">Detailed Breakdown</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(session.scoring_breakdown).map(
                ([key, value]) => {
                  const criterion = challenge.scoring_criteria[key];
                  const { score, feedback } = value;
                  const maxScore = criterion?.max_score || 25;
                  const percentage = (score / maxScore) * 100;
                  return (
                    <div
                      key={key}
                      className="p-4 bg-white/70 rounded-lg border border-gray-200/50 space-y-2"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-semibold capitalize text-gray-800">
                          {key.replace(/_/g, " ")}
                        </span>
                        <Badge
                          className={`text-base ${getScoreColor(
                            score,
                            maxScore
                          )} bg-opacity-10`}
                        >
                          {score}/{maxScore}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{feedback}</p>
                    </div>
                  );
                }
              )}
            </div>
          </div>
        )}

        {/* Overall Feedback */}
        {session.feedback && (
          <div>
            <h3 className="text-xl font-semibold mb-4">Overall Feedback</h3>
            <div className="p-4 bg-blue-500/5 rounded-lg border border-blue-200/50 text-gray-700">
              <p>{session.feedback}</p>
            </div>
          </div>
        )}

        {/* Improvement Suggestions */}
        {session.improvement_suggestions &&
          session.improvement_suggestions.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold mb-4">
                Improvement Suggestions
              </h3>
              <ul className="space-y-3">
                {session.improvement_suggestions.map((suggestion, index) => (
                  <li key={index} className="flex items-start gap-3 text-sm">
                    <Lightbulb className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-800">{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
      </CardContent>
    </Card>
  );
};

export default FeedbackCard;
