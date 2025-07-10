import React from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen, BarChart, Star } from "lucide-react";
import { Toaster, toast } from "sonner";
import { useLessonsByCategory, useCategories, usePrefetchData } from "../hooks/useData";
import { useUser } from "@stackframe/react";
import { auth } from "app/auth";

const CategoryPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const user = useUser();
  const categoryId = searchParams.get("id");
  const categoryNameFromUrl = searchParams.get("name");
  
  const { data: lessons, isLoading: lessonsLoading, error: lessonsError } = useLessonsByCategory(
    categoryId ? parseInt(categoryId) : 0
  );
  const { data: categories } = useCategories();
  const { prefetchLessonWithContent } = usePrefetchData();
  
  // Find category name from cached categories if not provided in URL
  const category = categories?.find(cat => cat.id === parseInt(categoryId || "0"));
  const categoryName = categoryNameFromUrl || category?.name || "Category";

  // Update backend profile if user is authenticated
  React.useEffect(() => {
    // Note: Profile updates are now handled centrally in AppWrapper to prevent excessive API calls
  }, []);

  const handleLessonClick = (lessonId: number) => {
    navigate(`/LessonPage?id=${lessonId}`);
  };

  const handleLessonHover = (lessonId: number) => {
    // Prefetch lesson content when user hovers over a lesson
    prefetchLessonWithContent(lessonId);
  };

  const DifficultyStars = ({ level }: { level: string }) => {
    const starCount =
      level === "beginner" ? 1 : level === "intermediate" ? 2 : 3;
    return (
      <div className="flex items-center gap-1">
        {Array.from({ length: 3 }).map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < starCount ? "text-yellow-400 fill-yellow-400" : "text-gray-600"
            }`}
          />
        ))}
      </div>
    );
  };

  if (!categoryId) {
    toast.error("Category ID is missing.");
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Category ID Missing</h2>
          <Button onClick={() => navigate('/lessons')}>Back to Lessons</Button>
        </div>
      </div>
    );
  }

  if (lessonsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <Toaster richColors theme="dark" />
          <Button
            variant="ghost"
            onClick={() => navigate('/lessons')}
            className="mb-8 flex items-center gap-2 text-gray-400 hover:text-white"
          >
            <ArrowLeft className="h-5 w-5" />
            Back
          </Button>

          <header className="text-center space-y-4 mb-12">
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent sm:text-5xl md:text-6xl">
              {categoryName}
            </h1>
            <p className="max-w-2xl mx-auto text-lg text-gray-600">
              Explore the lessons in this category and expand your AI skills.
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <Card
                key={i}
                className="bg-gray-800/50 border-gray-700 backdrop-blur-sm animate-pulse"
              >
                <CardHeader>
                  <div className="h-6 bg-gray-700 rounded w-3/4"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-4 bg-gray-700 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-700 rounded w-5/6"></div>
                  <div className="mt-4 h-8 bg-gray-700 rounded w-1/2"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (lessonsError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Lessons</h2>
          <p className="text-gray-600 mb-6">Failed to load lessons. Please try again later.</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <Toaster richColors theme="dark" />
        <Button
          variant="ghost"
          onClick={() => navigate('/lessons')}
          className="mb-8 flex items-center gap-2 text-gray-400 hover:text-white"
        >
          <ArrowLeft className="h-5 w-5" />
          Back
        </Button>

        <header className="text-center space-y-4 mb-12">
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent sm:text-5xl md:text-6xl">
            {categoryName}
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-gray-600">
            Explore the lessons in this category and expand your AI skills.
          </p>
        </header>

        {lessons && lessons.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {lessons.map((lesson) => (
              <Card
                key={lesson.id}
                onClick={() => handleLessonClick(lesson.id)}
                onMouseEnter={() => handleLessonHover(lesson.id)}
                className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-white/60 backdrop-blur-sm border-gray-200/50 cursor-pointer flex flex-col justify-between"
              >
                <CardHeader className="p-6">
                  <div className="flex justify-between items-start">
                    <BookOpen className="h-8 w-8 text-purple-400" />
                    <DifficultyStars level={lesson.difficulty_level} />
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900 pt-4">
                    {lesson.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 pt-0 flex-grow">
                  <p className="text-gray-600 line-clamp-3">
                    {lesson.preview_content}
                  </p>
                </CardContent>
                <div className="p-6 pt-0">
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <BarChart className="h-4 w-4" />
                      <span>{lesson.estimated_duration} min</span>
                    </div>
                    <div className={`font-semibold ${lesson.progress_status === "completed" ? "text-green-500" : "text-gray-500"}`}>
                      {lesson.progress_status === "not_started"
                        ? "Not Started"
                        : lesson.progress_status === "in_progress"
                        ? `${lesson.progress_percentage}%`
                        : "Completed"}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {lessons && lessons.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No lessons available</h3>
            <p className="text-gray-500">
              This category doesn't have any lessons yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
