import React, { useState, useEffect } from "react";
import brain from "brain";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Trophy, Users, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import type { LeaderboardEntry } from "types";

interface LeaderboardPreviewProps {
  challengeId: number;
  onViewFull: () => void;
}

const LeaderboardPreview: React.FC<LeaderboardPreviewProps> = ({
  challengeId,
  onViewFull,
}) => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      if (!challengeId) return;
      setIsLoading(true);
      try {
        const response = await brain.get_challenge_leaderboard({
          challengeId,
          limit: 5,
        });
        const data = await response.json();
        setLeaderboard(data);
      } catch (error) {
        console.error("Failed to load leaderboard preview:", error);
        toast.error("Could not load leaderboard preview.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboard();
  }, [challengeId]);

  const getTrophyColor = (index: number) => {
    switch (index) {
      case 0:
        return "text-yellow-500";
      case 1:
        return "text-gray-500";
      case 2:
        return "text-orange-500";
      default:
        return "text-transparent";
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-gray-400" />
            Leaderboard
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/60 backdrop-blur-sm border-gray-200/50">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          Top Performers
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={onViewFull}>
          View All
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </CardHeader>
      <CardContent>
        {leaderboard.length > 0 ? (
          <div className="space-y-2">
            {leaderboard.map((entry, index) => (
              <div
                key={entry.user_id}
                className="flex items-center justify-between p-2 bg-white/50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 text-center font-bold text-gray-600">
                    {index + 1}
                  </span>
                  <Trophy className={`h-5 w-5 ${getTrophyColor(index)}`} />
                  <span className="font-medium">
                    {entry.user_name || `User ${entry.user_id.substring(0, 6)}`}
                  </span>
                </div>
                <span className="font-bold text-lg text-gray-800">
                  {entry.score}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <Users className="h-10 w-10 mx-auto mb-2 text-gray-400" />
            <h3 className="font-semibold">No Scores Yet</h3>
            <p className="text-sm text-gray-600">
              Be the first to set a score for this challenge!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LeaderboardPreview;
