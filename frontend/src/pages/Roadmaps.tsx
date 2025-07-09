import React, { useEffect, useState } from "react";
import brain from "brain";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import type { Roadmap } from "types";

const RoadmapsPage = () => {
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRoadmaps = async () => {
      try {
        const response = await brain.get_all_roadmaps();
        const data = await response.json();
        setRoadmaps(data);
      } catch (error) {
        console.error("Failed to fetch roadmaps:", error);
        toast.error("Could not load Learning Roadmaps.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoadmaps();
  }, []);

  return (
    <div className="p-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">
          Learning Roadmaps
        </h1>
        <p className="mt-2 text-lg text-gray-600">
          Follow a structured path to master new AI skills.
        </p>
      </header>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-64 w-full rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {roadmaps.map((roadmap) => (
            <Link to={`/roadmaps/${roadmap.id}`} key={roadmap.id}>
              <Card className="h-full transform hover:-translate-y-2 transition-transform duration-300 ease-in-out shadow-lg hover:shadow-2xl rounded-xl overflow-hidden">
                <CardHeader className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white p-6">
                  <CardTitle>{roadmap.title}</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <p className="text-gray-700 mb-4">{roadmap.description}</p>
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>{roadmap.target_audience}</span>
                    <span>{roadmap.estimated_duration_weeks} weeks</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default RoadmapsPage;
