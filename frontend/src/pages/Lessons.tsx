import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { 
  ChevronRight, 
  Book, 
  Clock, 
  ArrowLeft, 
  BookOpen, 
  Star, 
  Users, 
  Zap, 
  Award,
  Rocket,
  BrainCircuit,
  Lightbulb,
  PenTool,
  Mail,
  Presentation,
  FileText,
  Headphones,
  BarChart,
  Share2,
  Calendar,
  Search,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useUser } from "@stackframe/react";
import brain from "brain";
import { auth } from "app/auth";
import { useCategories, usePrefetchData } from "../hooks/useData";
import { Progress } from "@/components/ui/progress";

const iconMapping: { [key: string]: React.ElementType } = {
  Rocket: Rocket,
  Book: Book,
  BrainCircuit: BrainCircuit,
  Zap: Zap,
  Lightbulb: Lightbulb,
  PenTool: PenTool,
  Mail: Mail,
  Presentation: Presentation,
  FileText: FileText,
  Headphones: Headphones,
  BarChart: BarChart,
  Share2: Share2,
  Calendar: Calendar,
  Search: Search,
  Default: BrainCircuit,
};

const Lessons = () => {
  const navigate = useNavigate();
  const { data: categories, isLoading, error } = useCategories();
  const { prefetchLessonsByCategory } = usePrefetchData();
  const user = useUser();
  const [categoryId, setCategoryId] = useState<number | null>(null);

  const handleCategoryClick = (categoryId: number, categoryName: string) => {
    navigate(`/category-page?id=${categoryId}&name=${encodeURIComponent(categoryName)}`);
  };

  const handleCategoryHover = (categoryId: number) => {
    // Prefetch lessons data when user hovers over a category
    prefetchLessonsByCategory(categoryId);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner':
        return 'bg-green-100 text-green-700';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-700';
      case 'advanced':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-8 flex items-center gap-2 text-gray-500 hover:text-gray-800"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
          
          <div className="text-center space-y-4 mb-12">
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent sm:text-5xl md:text-6xl">
              All Learning Paths
            </h1>
            <p className="max-w-2xl mx-auto text-lg text-gray-600">
              Explore all available categories and start your AI learning journey.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="rounded-xl border bg-card text-card-foreground shadow group hover:shadow-lg transition-shadow">
                <CardHeader className="text-left">
                  <div className="h-8 w-1/2 bg-gray-700 rounded animate-pulse mb-2"></div>
                  <div className="h-4 w-3/4 bg-gray-700 rounded animate-pulse"></div>
                </CardHeader>
                <CardContent className="text-left">
                  <div className="h-4 w-full bg-gray-700 rounded animate-pulse mb-2"></div>
                  <div className="h-4 w-5/6 bg-gray-700 rounded animate-pulse"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Categories</h2>
          <p className="text-gray-600 mb-6">Failed to load categories. Please try again later.</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-8 flex items-center gap-2 text-gray-500 hover:text-gray-800"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Button>
        
        <header className="text-center space-y-4 mb-12">
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent sm:text-5xl md:text-6xl">
            All Learning Paths
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-gray-600">
            Explore all available categories and start your AI learning journey.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories?.map((category) => {
            const Icon = iconMapping[category.icon] || iconMapping.Default;
            const progressPercentage = category.progress_percentage || 0;
            const completedLessons = category.completed_lessons || 0;
            const totalLessons = category.lesson_count || 0;

            return (
              <Card 
                key={category.id} 
                className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-white/60 backdrop-blur-sm border-gray-200/50 cursor-pointer"
                onClick={() => handleCategoryClick(category.id, category.name)}
                onMouseEnter={() => handleCategoryHover(category.id)}
              >
                <CardHeader className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                      <Icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(category.difficulty_level)}`}>
                      {category.difficulty_level}
                    </span>
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900 mb-2">{category.name}</CardTitle>
                  <CardContent className="p-0">
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{category.description}</p>
                    
                    {/* Progress Section */}
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Progress</span>
                        <span>{completedLessons}/{totalLessons} lessons</span>
                      </div>
                      <Progress value={progressPercentage} className="h-2" />
                      <div className="text-xs text-gray-500 text-right">
                        {Math.round(progressPercentage)}% complete
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">{totalLessons} Lessons</span>
                      <Button variant="ghost" size="sm" className="group-hover:text-blue-600">
                        Start Learning <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </div>
                  </CardContent>
                </CardHeader>
              </Card>
            );
          })}
        </div>

        {categories?.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No categories available</h3>
            <p className="text-gray-500">
              Check back later for new learning paths.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Lessons;



