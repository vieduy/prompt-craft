import React, { useState, useEffect } from "react";
import brain from "brain";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Trophy, Users, Crown, Medal, Award, Target, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import type { LeaderboardEntry, PracticeChallenge } from "types";

interface LeaderboardHubProps {
  challenges: PracticeChallenge[];
  initialChallengeId?: string;
  onTryChallenge?: (challengeId: string) => void;
}

const LeaderboardHub: React.FC<LeaderboardHubProps> = ({ challenges, initialChallengeId, onTryChallenge }) => {
  const [selectedChallengeId, setSelectedChallengeId] = useState<string>(initialChallengeId || "");
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState<PracticeChallenge | null>(null);

  useEffect(() => {
    if (initialChallengeId && !selectedChallengeId) {
      setSelectedChallengeId(initialChallengeId);
    }
  }, [initialChallengeId, selectedChallengeId]);

  useEffect(() => {
    if (selectedChallengeId && challenges.length > 0) {
      const challenge = challenges.find(c => c.id.toString() === selectedChallengeId);
      setSelectedChallenge(challenge || null);
      loadLeaderboard(parseInt(selectedChallengeId));
    }
  }, [selectedChallengeId, challenges]);

  const loadLeaderboard = async (challengeId: number) => {
    setIsLoading(true);
    try {
      const response = await brain.get_challenge_leaderboard({
        challengeId,
        limit: 20,
      });
      const data = await response.json();
      setLeaderboard(data);
    } catch (error) {
      console.error("Failed to load leaderboard:", error);
      toast.error("Could not load leaderboard.");
    } finally {
      setIsLoading(false);
    }
  };

  const getTrophyIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Crown className="h-5 w-5 text-yellow-500 fill-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400 fill-gray-400" />;
      case 3:
        return <Award className="h-5 w-5 text-orange-500 fill-orange-500" />;
      default:
        return <Trophy className="h-5 w-5 text-gray-300" />;
    }
  };

  const getPositionColor = (position: number) => {
    switch (position) {
      case 1:
        return "bg-gradient-to-r from-yellow-100 to-yellow-200 border-yellow-300";
      case 2:
        return "bg-gradient-to-r from-gray-100 to-gray-200 border-gray-300";
      case 3:
        return "bg-gradient-to-r from-orange-100 to-orange-200 border-orange-300";
      default:
        return "bg-white/80 border-gray-200";
    }
  };

  const getScoreColor = (score: number, maxScore: number = 100) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 90) return "text-green-600";
    if (percentage >= 80) return "text-blue-600";
    if (percentage >= 70) return "text-yellow-600";
    if (percentage >= 60) return "text-orange-600";
    return "text-red-600";
  };

  return (
    <div className="space-y-6">
      {/* Challenge Selector */}
      <Card className="bg-white/60 backdrop-blur-sm border-gray-200/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-600" />
            Select Challenge
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedChallengeId} onValueChange={setSelectedChallengeId}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choose a challenge to view leaderboard" />
            </SelectTrigger>
            <SelectContent>
              {challenges.map((challenge) => (
                <SelectItem key={challenge.id} value={challenge.id.toString()}>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{challenge.title}</span>
                    <span className="text-xs text-gray-500">({challenge.difficulty_level})</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Leaderboard Display */}
      {selectedChallenge && (
        <Card className="bg-white/60 backdrop-blur-sm border-gray-200/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  Leaderboard: {selectedChallenge.title}
                </CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  Top performers for this challenge
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">
                  {leaderboard.length}
                </div>
                <div className="text-xs text-gray-500">Participants</div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center gap-4 p-3">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-4 flex-1" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                ))}
              </div>
            ) : leaderboard.length > 0 ? (
              <div className="space-y-3">
                {leaderboard.map((entry, index) => (
                  <div
                    key={`${entry.user_id}-${entry.challenge_id}`}
                    className={`flex items-center justify-between p-4 rounded-lg border transition-all duration-200 hover:shadow-md ${getPositionColor(entry.rank_position)}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-gray-600 min-w-[2rem]">
                          #{entry.rank_position}
                        </span>
                        {getTrophyIcon(entry.rank_position)}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">
                          {entry.user_name || `User ${entry.user_id.substring(0, 8)}`}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(entry.achieved_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${getScoreColor(entry.score, selectedChallenge.max_score)}`}>
                        {entry.score}
                      </div>
                      <div className="text-xs text-gray-500">
                        / {selectedChallenge.max_score} pts
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Users className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-semibold mb-2">No Scores Yet</h3>
                <p className="text-gray-600 mb-4">
                  Be the first to set a score for this challenge!
                </p>
                <Button 
                  onClick={() => {
                    if (onTryChallenge && selectedChallengeId) {
                      onTryChallenge(selectedChallengeId);
                    } else {
                      toast.info("Switch to the Practice tab to attempt this challenge!");
                    }
                  }}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                >
                  <Target className="h-4 w-4 mr-2" />
                  Try This Challenge
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Challenge Stats */}
      {selectedChallenge && leaderboard.length > 0 && (
        <Card className="bg-white/60 backdrop-blur-sm border-gray-200/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              Challenge Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {leaderboard.length}
                </div>
                <div className="text-sm text-gray-600">Participants</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {Math.round(leaderboard.reduce((sum, entry) => sum + entry.score, 0) / leaderboard.length)}
                </div>
                <div className="text-sm text-gray-600">Avg Score</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">
                  {leaderboard[0]?.score || 0}
                </div>
                <div className="text-sm text-gray-600">Top Score</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {selectedChallenge.difficulty_level}
                </div>
                <div className="text-sm text-gray-600">Difficulty</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {!selectedChallengeId && (
        <Card className="bg-white/60 backdrop-blur-sm border-gray-200/50">
          <CardContent className="text-center py-12">
            <Trophy className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-semibold mb-2">Select a Challenge</h3>
            <p className="text-gray-600 mb-4">
              Choose a challenge from the dropdown above to view its leaderboard and see how you rank against other learners.
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <Users className="h-4 w-4" />
              <span>Compete with learners worldwide</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LeaderboardHub; 