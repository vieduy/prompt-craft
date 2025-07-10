import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, CheckCircle, Clock, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import brain from "brain";
import { useUser } from "@stackframe/react";
import { auth } from "app/auth";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Circle } from "lucide-react";
import type { RoadmapDetail } from "types";

interface Roadmap {
  id: number;
  title: string;
  description: string;
  difficulty_level: string;
  estimated_duration_hours: number;
  is_enrolled: boolean;
}

const RoadmapDetail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const user = useUser();
  const roadmapId = searchParams.get("id");
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEnrolling, setIsEnrolling] = useState(false);

  // Update backend profile if user is authenticated
  useEffect(() => {
    // Note: Profile updates are now handled centrally in AppWrapper to prevent excessive API calls
  }, []);

  useEffect(() => {
    if (roadmapId) {
      fetchRoadmapDetails();
    }
  }, [roadmapId]);

  const fetchRoadmapDetails = async () => {
    try {
      const response = await brain.get_roadmap_details({ roadmapId: parseInt(roadmapId) });
      const data = await response.json();
      setRoadmap(data);
    } catch (error) {
      console.error("Failed to fetch roadmap details:", error);
      toast.error("Could not load roadmap details.");
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    if (!roadmapId) return;
    setIsEnrolling(true);
    try {
      await brain.enroll_in_roadmap({ roadmapId: parseInt(roadmapId) });
      toast.success(`Successfully enrolled in "${roadmap?.title}"!`);
      // Here you might redirect to a "My Roadmap" page or update UI state
      // For now, we can just disable the button or show a success state
    } catch (error) {
      console.error("Failed to enroll in roadmap:", error);
      toast.error("Failed to enroll. You may already be enrolled.");
    } finally {
      setIsEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <Skeleton className="h-12 w-1/2 mb-4" />
        <Skeleton className="h-8 w-3/4 mb-8" />
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!roadmap) {
    return (
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold">Roadmap not found</h2>
        <p className="text-gray-600">
          The roadmap you are looking for does not exist.
        </p>
        <Button asChild className="mt-4">
          <Link to="/roadmaps">Back to Roadmaps</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="p-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">
          {roadmap.title}
        </h1>
        <p className="mt-2 text-lg text-gray-600">{roadmap.description}</p>
        <Button
          size="lg"
          className="mt-6 bg-green-600 hover:bg-green-700"
          onClick={handleEnroll}
          disabled={isEnrolling}
        >
          {isEnrolling ? "Enrolling..." : "Enroll in this Roadmap"}
        </Button>
      </header>
      
      <div className="space-y-4">
        {roadmap.items.map((item, index) => (
          <Card key={item.id} className="flex items-center p-4">
            <div className="flex items-center gap-4 w-full">
              <span className="text-3xl font-bold text-gray-300">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="flex-grow">
                <p className="font-semibold">{item.title}</p>
                <p className="text-sm text-gray-500">{item.description}</p>
              </div>
              <Circle className="h-6 w-6 text-gray-400" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RoadmapDetail;

