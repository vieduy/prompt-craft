import React, { useEffect, useState } from "react";
import brain from "brain";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  ArrowRight, 
  BookOpen, 
  Target, 
  Trophy, 
  Flame, 
  Sparkles, 
  Brain, 
  Award, 
  Calendar,
  TrendingUp,
  GraduationCap,
  Zap,
  Mail,
  Eye,
  Bookmark,
  Crown,
  PenTool,
  Presentation,
  FileText,
  Headphones,
  BarChart,
  Share2,
  Search,
  Clock
} from "lucide-react";
import { useUserGuardContext } from "app/auth";
import type { DashboardData, UserRoadmapProgress } from "types";
import { toast } from "sonner";
import MyRoadmapWidget from "components/MyRoadmapWidget";
import {
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from "recharts";

const Dashboard = () => {
  const { user } = useUserGuardContext();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [roadmapProgress, setRoadmapProgress] = useState<UserRoadmapProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Suppress Recharts defaultProps warning
  useEffect(() => {
    const originalWarn = console.warn;
    console.warn = (...args) => {
      if (args[0] && typeof args[0] === 'string' && args[0].includes('defaultProps')) {
        return; // Suppress defaultProps warnings
      }
      originalWarn.apply(console, args);
    };

    return () => {
      console.warn = originalWarn;
    };
  }, []);

  // Helper functions
  const getActionIcon = (actionType: string) => {
    switch (actionType) {
      case "lesson":
        return <BookOpen className="w-5 h-5 text-blue-500" />;
      case "practice":
        return <Target className="w-5 h-5 text-green-500" />;
      case "roadmap":
        return <Trophy className="w-5 h-5 text-yellow-500" />;
      default:
        return <Sparkles className="w-5 h-5 text-purple-500" />;
    }
  };

  const getActivityIcon = (activityType: string) => {
    switch (activityType) {
      case "lesson_completed":
        return <BookOpen className="w-4 h-4 text-blue-500" />;
      case "practice_completed":
        return <Target className="w-4 h-4 text-green-500" />;
      case "achievement_earned":
        return <Trophy className="w-4 h-4 text-yellow-500" />;
      default:
        return <Sparkles className="w-4 h-4 text-purple-500" />;
    }
  };

  const getAchievementIcon = (iconName: string) => {
    switch (iconName) {
      case "GraduationCap":
        return <GraduationCap className="w-6 h-6" />;
      case "Zap":
        return <Zap className="w-6 h-6" />;
      case "Award":
        return <Award className="w-6 h-6" />;
      case "Mail":
        return <Mail className="w-6 h-6" />;
      case "Calendar":
        return <Calendar className="w-6 h-6" />;
      case "Eye":
        return <Eye className="w-6 h-6" />;
      case "Bookmark":
        return <Bookmark className="w-6 h-6" />;
      case "Crown":
        return <Crown className="w-6 h-6" />;
      default:
        return <Award className="w-6 h-6" />;
    }
  };

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case "PenTool":
        return <PenTool className="w-4 h-4" />;
      case "Mail":
        return <Mail className="w-4 h-4" />;
      case "Presentation":
        return <Presentation className="w-4 h-4" />;
      case "FileText":
        return <FileText className="w-4 h-4" />;
      case "Headphones":
        return <Headphones className="w-4 h-4" />;
      case "BarChart":
        return <BarChart className="w-4 h-4" />;
      case "Share2":
        return <Share2 className="w-4 h-4" />;
      case "Calendar":
        return <Calendar className="w-4 h-4" />;
      case "Search":
        return <Search className="w-4 h-4" />;
      default:
        return <BookOpen className="w-4 h-4" />;
    }
  };

  const onAction = (action: any) => {
    // Handle action clicks
    console.log("Action clicked:", action);
    // You can add navigation logic here
  };

  // Styling variables
  const color = "text-blue-500";
  const trend = "12% increase";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dataRes, roadmapRes] = await Promise.all([
          brain.get_dashboard_data(),
          brain.get_my_roadmap(),
        ]);

        setDashboardData(await dataRes.json());
        setRoadmapProgress(await roadmapRes.json());

      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
        toast.error("Could not load your dashboard.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <header className="mb-10">
            <h1 className="text-4xl md:text-5xl font-bold">
              Welcome back,{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {user.displayName || "Learner"}
              </span>
              !
            </h1>
            <p className="text-lg text-gray-600 mt-2">
              Let's continue your journey to mastering AI.
            </p>
            <p className="text-muted-foreground">
              Loading your dashboard...
            </p>
          </header>

          {/* Loading Spinner */}
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading your learning dashboard...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-50 to-gray-200">
        <Card className="p-8 text-center">
          <CardTitle>Oops! Something went wrong.</CardTitle>
          <CardContent>
            <p className="my-4 text-gray-600">
              We couldn't fetch your dashboard data.
            </p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const {
    stats,
    recent_activity,
    quick_actions,
    achievements,
    progress_overview,
    learning_streak,
    recommended_lessons,
  } = dashboardData;

  // Add safety checks for arrays
  const safeQuickActions = quick_actions || [];
  const safeRecentActivity = recent_activity || [];
  const safeAchievements = achievements || [];
  const safeRecommendedLessons = recommended_lessons || [];
  const safeChartData = progress_overview || [];

  // Separate earned and upcoming achievements
  const earnedAchievements = safeAchievements.filter(a => a.is_earned);
  const upcomingAchievements = safeAchievements.filter(a => !a.is_earned);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 sm:p-6 lg:p-8">
      <main className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-10">
          <h1 className="text-4xl md:text-5xl font-bold">
            Welcome back,{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {user.displayName || "Learner"}
            </span>
            !
          </h1>
          <p className="text-lg text-gray-600 mt-2">
            Let's continue your journey to mastering AI.
          </p>
          <p className="text-muted-foreground">
            Here's a snapshot of your learning journey and progress.
          </p>
        </header>

        {roadmapProgress && (
          <MyRoadmapWidget roadmapProgress={roadmapProgress} />
        )}

        {/* Stats Row */}
        <section className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">
                Lessons Completed
              </CardTitle>
              <BookOpen className={`h-5 w-5 ${color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.lessons_completed}</div>
              {trend && (
                <p className="text-xs text-gray-500 mt-1 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                  {trend}
                </p>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">
                Practice Score
              </CardTitle>
              <Target className={`h-5 w-5 ${color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.average_practice_score.toFixed(1)}%</div>
              {trend && (
                <p className="text-xs text-gray-500 mt-1 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                  {trend}
                </p>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">
                Achievements
              </CardTitle>
              <Trophy className={`h-5 w-5 ${color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{earnedAchievements.length}/{safeAchievements.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">
                Current Streak
              </CardTitle>
              <Flame className={`h-5 w-5 ${color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{learning_streak.current_streak} Days</div>
            </CardContent>
          </Card>
        </section>

        {/* Recommended For You Section */}
        <section className="mb-8">
          <Card className="overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <Sparkles className="w-6 h-6 text-purple-500" />
                    Recommended For You
                  </CardTitle>
                  <CardDescription className="text-base mt-1">
                    Personalized lessons based on your learning journey
                  </CardDescription>
                </div>
                <div className="hidden sm:block">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>AI-powered recommendations</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {safeRecommendedLessons.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
                  {safeRecommendedLessons.map((lesson) => (
                    <Link to={`/LessonPage?id=${lesson.id}`} key={lesson.id}>
                      <div className="group relative bg-white rounded-xl border border-gray-200 p-6 hover:border-purple-300 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                        {/* Difficulty Badge */}
                        <div className="absolute top-4 right-4">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            lesson.difficulty_level === 'beginner' 
                              ? 'bg-green-100 text-green-700' 
                              : lesson.difficulty_level === 'intermediate'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {lesson.difficulty_level}
                          </span>
                        </div>

                        {/* Category */}
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                          <span className="text-sm font-medium text-purple-600">
                            {lesson.category_name}
                          </span>
                        </div>

                        {/* Title */}
                        <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                          {lesson.title}
                        </h3>

                        {/* Description */}
                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                          {lesson.description}
                        </p>

                        {/* Reason */}
                        <div className="bg-blue-50 rounded-lg p-3 mb-4">
                          <p className="text-xs text-blue-700 font-medium">
                            💡 {lesson.reason}
                          </p>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {lesson.estimated_duration} min
                            </span>
                            <span className="flex items-center gap-1">
                              <Target className="w-3 h-3" />
                              {lesson.learning_objectives?.length || 0} objectives
                            </span>
                          </div>
                          <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-purple-500 group-hover:translate-x-1 transition-all" />
                        </div>

                        {/* Hover Effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-blue-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No recommendations yet</h3>
                  <p className="text-gray-500 mb-4">
                    Complete a few lessons to get personalized recommendations
                  </p>
                  <Button variant="outline" asChild>
                    <Link to="/lessons">Browse All Lessons</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </section>

        {/* Main Grid */}
        <section className="grid lg:grid-cols-3 gap-6">
          {/* Left/Main Column */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-purple-500" />
                  <span>Quick Actions</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="grid sm:grid-cols-2 gap-4">
                {safeQuickActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={() => onAction(action)}
                    className="group p-4 rounded-lg bg-white/50 hover:bg-white text-left transition-all duration-300 flex items-start gap-4 transform hover:-translate-y-1"
                  >
                    <div className="p-2 bg-white rounded-full">
                      {getActionIcon(action.action_type)}
                    </div>
                    <div>
                      <p className="font-semibold">{action.title}</p>
                      <p className="text-sm text-gray-600">{action.description}</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400 ml-auto group-hover:text-purple-500 transition-colors" />
                  </button>
                ))}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-6 h-6 text-blue-500" />
                  <span>Skill Mastery</span>
                </CardTitle>
                <CardDescription>
                  Your progress across different learning categories
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {safeChartData
                    .filter(category => category.total_lessons > 0)
                    .sort((a, b) => b.progress_percentage - a.progress_percentage)
                    .map((category) => (
                      <div key={category.category_id} className="space-y-3">
                        {/* Category Header */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div 
                              className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
                              style={{ backgroundColor: category.category_color || '#3B82F6' }}
                            >
                              {getCategoryIcon(category.category_icon)}
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">
                                {category.category_name}
                              </h4>
                              <p className="text-sm text-gray-500">
                                {category.completed_lessons} of {category.total_lessons} lessons completed
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-gray-900">
                              {Math.round(category.progress_percentage)}%
                            </div>
                            <div className="text-xs text-gray-500">
                              {category.in_progress_lessons > 0 && `${category.in_progress_lessons} in progress`}
                            </div>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>Progress</span>
                            <span>{category.completed_lessons}/{category.total_lessons}</span>
                          </div>
                          <div className="relative">
                            <div className="w-full bg-gray-200 rounded-full h-3">
                              <div 
                                className="h-3 rounded-full transition-all duration-500 ease-out"
                                style={{ 
                                  width: `${category.progress_percentage}%`,
                                  backgroundColor: category.category_color || '#3B82F6'
                                }}
                              />
                            </div>
                            {/* Progress indicator dots */}
                            <div className="absolute top-0 left-0 w-full h-3 flex justify-between px-1">
                              {Array.from({ length: category.total_lessons }, (_, i) => (
                                <div
                                  key={i}
                                  className={`w-1.5 h-1.5 rounded-full mt-1 ${
                                    i < category.completed_lessons 
                                      ? 'bg-white' 
                                      : i < category.completed_lessons + category.in_progress_lessons
                                      ? 'bg-yellow-400'
                                      : 'bg-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Next Lesson */}
                        {category.next_lesson_title && (
                          <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                                <span className="text-sm font-medium text-blue-700">
                                  Next: {category.next_lesson_title}
                                </span>
                              </div>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="text-xs h-7 px-3"
                                asChild
                              >
                                <Link to={`/LessonPage?id=${category.next_lesson_id}`}>
                                  Continue
                                </Link>
                              </Button>
                            </div>
                          </div>
                        )}

                        {/* Completion Status */}
                        {category.progress_percentage === 100 && (
                          <div className="bg-green-50 rounded-lg p-3 border border-green-100">
                            <div className="flex items-center gap-2">
                              <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              </div>
                              <span className="text-sm font-medium text-green-700">
                                Category completed! 🎉
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}

                  {/* Empty State */}
                  {safeChartData.filter(category => category.total_lessons > 0).length === 0 && (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Brain className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No skills to track yet</h3>
                      <p className="text-gray-500 mb-4">
                        Start your first lesson to begin tracking your skill mastery
                      </p>
                      <Button asChild>
                        <Link to="/lessons">Start Learning</Link>
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-6 h-6 text-yellow-500" />
                  <span>Achievements</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm font-semibold mb-2">
                  Unlocked ({earnedAchievements.length})
                </p>
                <div className="flex flex-wrap gap-4 mb-6">
                  {earnedAchievements.length > 0 ? (
                    earnedAchievements.map((a) => (
                      <div
                        key={a.id}
                        className="group relative flex flex-col items-center"
                      >
                        <div className="p-3 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full text-white">
                          {getAchievementIcon(a.icon)}
                        </div>
                        <div className="absolute top-full mt-2 w-max px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity z-10">
                          <div className="font-semibold">{a.name}</div>
                          <div className="text-gray-300">{a.reward_points} pts</div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">No achievements unlocked yet. Keep learning!</p>
                  )}
                </div>
                <p className="text-sm font-semibold mb-2">
                  Upcoming ({upcomingAchievements.length})
                </p>
                <div className="space-y-4">
                  {upcomingAchievements.length > 0 ? (
                    upcomingAchievements.slice(0, 3).map((a) => (
                      <div key={a.id}>
                        <div className="flex justify-between items-center text-sm mb-1">
                          <span className="font-medium text-gray-700">{a.name}</span>
                          <span className="text-gray-500">
                            {a.progress_current || 0}/{a.progress_target || 1}
                          </span>
                        </div>
                        <Progress
                          value={
                            a.progress_target ? ((a.progress_current || 0) / a.progress_target) * 100 : 0
                          }
                          className="h-2"
                        />
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">No upcoming achievements available.</p>
                  )}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-6 h-6 text-gray-500" />
                  <span>Recent Activity</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-64">
                  <ul className="space-y-4">
                    {safeRecentActivity.map((activity) => (
                      <li key={activity.id} className="flex items-start gap-4">
                        <div className="p-2 bg-white rounded-full">
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
          </div>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;
