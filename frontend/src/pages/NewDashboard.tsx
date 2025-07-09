import React from "react";
import { BookOpen, Trophy, Flame } from "lucide-react";
import { useUser } from "@stackframe/react";
import StatCard from "components/StatCard";
import CinematicLessonCard from "components/CinematicLessonCard";

const NewDashboard = () => {
  const user = useUser();

  const stats = [
    {
      Icon: BookOpen,
      label: "Lessons Completed",
      value: 14,
      color: "#3b82f6",
    },
    { Icon: Trophy, label: "Avg. Practice Score", value: "88%", color: "#f59e0b" },
    { Icon: Flame, label: "Learning Streak", value: "12 Days", color: "#ef4444" },
  ];

  const recommended = [
    {
      imageUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "Advanced Prompting Techniques",
      description: "Master the art of complex instructions.",
      progress: 75,
    },
    {
      imageUrl: "https://images.unsplash.com/photo-1620712943543-2858200f7426?q=80&w=1972&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "Practice: The AI Copywriter",
      description: "Challenge your creative writing skills.",
      actionText: "Start Challenge"
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome back, {user?.fullName || "Learner"}!
          </h1>
          <p className="text-gray-500 mt-1">
            Your journey to AI mastery continues.
          </p>
        </header>

        <section className="mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {stats.map((stat) => (
              <StatCard key={stat.label} {...stat} />
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Recommended For You
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {recommended.map((item) => (
              <CinematicLessonCard key={item.title} {...item} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default NewDashboard;
