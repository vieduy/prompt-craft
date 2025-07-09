import { useQuery, useQueryClient } from "@tanstack/react-query";
import brain from "brain";
import { Category, Lesson, LessonWithContent } from "types";

// Hook for fetching categories with caching
export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await brain.get_categories();
      return response.json();
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook for fetching lessons by category with caching
export const useLessonsByCategory = (categoryId: number) => {
  return useQuery({
    queryKey: ["lessons", categoryId],
    queryFn: async () => {
      const response = await brain.get_lessons_by_category({ categoryId });
      return response.json();
    },
    enabled: !!categoryId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook for fetching lesson with content with caching
export const useLessonWithContent = (lessonId: number) => {
  return useQuery({
    queryKey: ["lesson", lessonId],
    queryFn: async () => {
      const response = await brain.get_lesson_with_content({ lessonId });
      return response.json();
    },
    enabled: !!lessonId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook for fetching dashboard data with caching
export const useDashboardData = () => {
  return useQuery({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const response = await brain.get_dashboard_data();
      return response.json();
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Hook for fetching user roadmap with caching
export const useMyRoadmap = () => {
  return useQuery({
    queryKey: ["roadmap"],
    queryFn: async () => {
      const response = await brain.get_my_roadmap();
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Prefetch functions for better UX
export const usePrefetchData = () => {
  const queryClient = useQueryClient();

  const prefetchCategories = () => {
    queryClient.prefetchQuery({
      queryKey: ["categories"],
      queryFn: async () => {
        const response = await brain.get_categories();
        return response.json();
      },
      staleTime: 10 * 60 * 1000,
    });
  };

  const prefetchLessonsByCategory = (categoryId: number) => {
    queryClient.prefetchQuery({
      queryKey: ["lessons", categoryId],
      queryFn: async () => {
        const response = await brain.get_lessons_by_category({ categoryId });
        return response.json();
      },
      staleTime: 5 * 60 * 1000,
    });
  };

  const prefetchLessonWithContent = (lessonId: number) => {
    queryClient.prefetchQuery({
      queryKey: ["lesson", lessonId],
      queryFn: async () => {
        const response = await brain.get_lesson_with_content({ lessonId });
        return response.json();
      },
      staleTime: 5 * 60 * 1000,
    });
  };

  return {
    prefetchCategories,
    prefetchLessonsByCategory,
    prefetchLessonWithContent,
  };
}; 