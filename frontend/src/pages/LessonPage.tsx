import React, { useState, useEffect, useRef, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useUser } from "@stackframe/react";

// UI Components
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

// Icons
import { 
  Loader2, 
  MessageSquare, 
  Target, 
  BookOpen, 
  ArrowLeft, 
  CheckCircle2, 
  ChevronLeft, 
  ChevronRight,
  GraduationCap,
  FileText,
  Code,
  CheckCircle,
  Youtube
} from "lucide-react";

// Third-party libraries
import ReactMarkdown from "react-markdown";
import { Toaster, toast } from "sonner";

// Custom components
import PracticeExercise from "components/PracticeExercise";
import VerticalTimeline from 'components/VerticalTimeline';
import { AIAssistantChat } from 'components/AIAssistantChat';

// Hooks and utilities
import { useLessonWithContent, useLessonsByCategory } from "../hooks/useData";
import brain from "brain";

// Types
import type { LessonWithContent } from "types";

// Constants
const SECTION_ICONS = {
  introduction: GraduationCap,
  workplace_scenario: FileText,
  content_block: BookOpen,
  content: BookOpen,
  example: Code,
  conclusion: CheckCircle,
  practice_exercise: Youtube,
} as const;

// Helper Components
const SectionIcon: React.FC<{ type: string; className?: string }> = ({ type, className = "h-6 w-6 text-blue-600" }) => {
  const IconComponent = SECTION_ICONS[type as keyof typeof SECTION_ICONS] || BookOpen;
  return <IconComponent className={className} />;
};

const ImageComponent: React.FC<{ src?: string; alt?: string; title?: string }> = ({ src, alt, title }) => (
  <div className="flex flex-col items-center my-6">
    <img
      src={src}
      alt={alt || "Image"}
      title={title}
      className="max-w-full h-auto rounded-xl shadow-lg border border-gray-200"
      style={{ maxHeight: '500px' }}
      onError={(e) => {
        const target = e.target as HTMLImageElement;
        target.style.display = 'none';
        const errorDiv = document.createElement('div');
        errorDiv.className = 'flex items-center justify-center p-8 bg-gray-100 rounded-xl border border-gray-200 my-4';
        errorDiv.innerHTML = `
          <div class="text-center text-gray-500">
            <svg class="w-8 h-8 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd" />
            </svg>
            <p class="text-sm">Failed to load image</p>
            <p class="text-xs text-gray-400 mt-1">${src}</p>
          </div>
        `;
        target.parentNode?.insertBefore(errorDiv, target);
      }}
    />
    {(alt || title) && (
      <p className="mt-2 text-sm text-gray-600 italic text-center max-w-md">
        {alt || title}
      </p>
    )}
  </div>
);

// Utility functions
const preprocessMarkdown = (content: string): string => {
  const lines = content.split('\n');
  const processedLines: string[] = [];
  
  for (let i = 0; i < lines.length; i++) {
    const currentLine = lines[i];
    const nextLine = lines[i + 1];
    
    processedLines.push(currentLine);
    
    const isCurrentBlockquote = currentLine.trim().startsWith('>');
    const isNextBlockquote = nextLine && nextLine.trim().startsWith('>');
    
    if (isCurrentBlockquote && isNextBlockquote) {
      continue;
    } else if (nextLine !== undefined) {
      processedLines.push('', '');
    }
  }
  
  return processedLines.join('\n');
};

// Main Components
const LessonHeader: React.FC<{ lesson: LessonWithContent; onBack: () => void }> = ({ lesson, onBack }) => (
  <header className="mb-12">
    <Button
      variant="ghost"
      className="mb-8 text-gray-500 hover:text-gray-800"
      onClick={onBack}
    >
      <ArrowLeft className="w-4 h-4 mr-2" />
      Back to Category
    </Button>
    <div className="text-center">
      <h1 className="text-4xl md:text-5xl font-bold tracking-tighter bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
        {lesson.title}
      </h1>
      <div className="flex flex-wrap items-center justify-center gap-4 mb-2">
        <span className="inline-flex items-center px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-sm font-semibold">
          {lesson.difficulty_level}
        </span>
        <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold">
          {lesson.estimated_duration} min
        </span>
      </div>
      <p className="text-lg text-gray-700 mb-6 max-w-3xl mx-auto">{lesson.description}</p>
    </div>
  </header>
);

const LessonNavigation: React.FC<{ previousLesson: any; nextLesson: any; onNavigate: (lessonId: number) => void }> = ({ previousLesson, nextLesson, onNavigate }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t border-gray-200">
    {/* Previous Lesson */}
    <div className="flex">
      {previousLesson ? (
        <Button
          variant="outline"
          className="flex-1 h-auto p-6 text-left border-2 border-blue-200 hover:border-blue-400 hover:bg-blue-50 transition-all group"
          onClick={() => onNavigate(previousLesson.id)}
        >
          <div className="flex items-center gap-4 w-full">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                <ChevronLeft className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-500 mb-1">Previous Lesson</p>
              <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-700 transition-colors">
                {previousLesson.title}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {previousLesson.estimated_duration} min • {previousLesson.difficulty_level}
              </p>
            </div>
          </div>
        </Button>
      ) : (
        <div className="flex-1 h-auto p-6 text-left border-2 border-gray-100 bg-gray-50 rounded-lg opacity-50">
          <div className="flex items-center gap-4 w-full">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                <ChevronLeft className="w-6 h-6 text-gray-400" />
              </div>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-400 mb-1">Previous Lesson</p>
              <h3 className="text-lg font-semibold text-gray-400">
                This is the first lesson
              </h3>
            </div>
          </div>
        </div>
      )}
    </div>

    {/* Next Lesson */}
    <div className="flex">
      {nextLesson ? (
        <Button
          variant="outline"
          className="flex-1 h-auto p-6 text-right border-2 border-purple-200 hover:border-purple-400 hover:bg-purple-50 transition-all group"
          onClick={() => onNavigate(nextLesson.id)}
        >
          <div className="flex items-center gap-4 w-full">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-500 mb-1">Next Lesson</p>
              <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 group-hover:text-purple-700 transition-colors">
                {nextLesson.title}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {nextLesson.estimated_duration} min • {nextLesson.difficulty_level}
              </p>
            </div>
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                <ChevronRight className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </Button>
      ) : (
        <div className="flex-1 h-auto p-6 text-right border-2 border-gray-100 bg-gray-50 rounded-lg opacity-50">
          <div className="flex items-center gap-4 w-full">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-400 mb-1">Next Lesson</p>
              <h3 className="text-lg font-semibold text-gray-400">
                This is the last lesson
              </h3>
            </div>
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                <ChevronRight className="w-6 h-6 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
);

const LessonFooter: React.FC<{ 
  lesson: LessonWithContent; 
  allPracticeCompleted: boolean; 
  onComplete: () => void; 
  previousLesson: any; 
  nextLesson: any; 
  onNavigate: (lessonId: number) => void; 
}> = ({ lesson, allPracticeCompleted, onComplete, previousLesson, nextLesson, onNavigate }) => (
  <footer className="mt-12 space-y-6">
    <Button
      className="w-full text-lg py-6 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:opacity-50 transition-all"
      disabled={!allPracticeCompleted}
      onClick={onComplete}
    >
      <CheckCircle2 className="w-6 h-6 mr-3" />
      Mark Lesson as Complete
    </Button>

    <LessonNavigation 
      previousLesson={previousLesson}
      nextLesson={nextLesson}
      onNavigate={onNavigate}
    />
  </footer>
);

// Main Component
const LessonPage: React.FC = () => {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const lessonId = parseInt(params.get("id") || "0");
  const user = useUser();
  
  const { data: lesson, isLoading, error } = useLessonWithContent(lessonId);
  const { data: categoryLessons } = useLessonsByCategory(lesson?.category_id || 0);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  // State
  const [currentSection, setCurrentSection] = useState<string>('');
  const [completedSections, setCompletedSections] = useState<Set<string>>(new Set());
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  // Memoized values
  const { previousLesson, nextLesson } = useMemo(() => {
    if (!categoryLessons || !lesson) {
      return { previousLesson: null, nextLesson: null };
    }

    const sortedLessons = [...categoryLessons].sort((a, b) => {
      if (a.order_index === b.order_index) {
        return a.id - b.id;
      }
      return a.order_index - b.order_index;
    });

    const currentIndex = sortedLessons.findIndex(l => l.id === lesson.id);
    
    if (currentIndex === -1) {
      return { previousLesson: null, nextLesson: null };
    }

    return {
      previousLesson: currentIndex > 0 ? sortedLessons[currentIndex - 1] : null,
      nextLesson: currentIndex < sortedLessons.length - 1 ? sortedLessons[currentIndex + 1] : null
    };
  }, [categoryLessons, lesson]);

  const allPracticeCompleted = useMemo(() => {
    if (!lesson) return false;
    const practiceExercises = lesson.content_sections.filter(s => s.section_type === 'practice_exercise');
    return practiceExercises.every(e => e.is_completed);
  }, [lesson]);

  // Effects
  useEffect(() => {
    if (lesson) {
      const initialCompleted = new Set<string>();
      lesson.content_sections.forEach((item: any) => {
        if (item.is_completed) {
          initialCompleted.add(item.id.toString());
        }
      });
      setCompletedSections(initialCompleted);
      if (lesson.content_sections.length > 0) {
        setCurrentSection(lesson.content_sections[0].id.toString());
      }
    }
  }, [lesson]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setCurrentSection(entry.target.id);
            setCompletedSections(prev => new Set(prev).add(entry.target.id));
          }
        });
      },
      {
        rootMargin: '-50% 0px -50% 0px',
        threshold: 0,
      }
    );

    const currentRefs = sectionRefs.current;
    Object.values(currentRefs).forEach((ref) => {
      if (ref && ref instanceof HTMLElement) observer.observe(ref);
    });

    return () => {
      Object.values(currentRefs).forEach((ref) => {
        if (ref && ref instanceof HTMLElement) observer.unobserve(ref);
      });
    };
  }, [lesson]);

  // Event handlers
  const handleSectionClick = (sectionId: string) => {
    sectionRefs.current[sectionId]?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  const handleExerciseComplete = (exerciseId: number) => {
    if (!lesson) return;
    
    const newContentSections = lesson.content_sections.map(section => {
      if (section.id === exerciseId) {
        return { ...section, is_completed: true };
      }
      return section;
    });

    Object.assign(lesson, { content_sections: newContentSections });
    setCompletedSections(prev => new Set(prev).add(exerciseId.toString()));
  };

  const handleLessonComplete = async () => {
    if (!lesson) return;
    
    try {
      await brain.update_lesson_progress({
        lesson_id: lesson.id,
        status: 'completed',
        progress_percentage: 100
      });
      
      queryClient.invalidateQueries({ queryKey: ["lessons", lesson.category_id] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      
      toast.success('Lesson marked as complete!');
      navigate(`/category-page?id=${lesson.category_id}`);
    } catch (err) {
      toast.error('Failed to mark lesson as complete.');
    }
  };

  const handleNavigate = (lessonId: number) => {
    navigate(`/LessonPage?id=${lessonId}`);
  };

  const handleBack = () => {
    navigate(`/category-page?id=${lesson?.category_id}`);
  };

  // Content rendering function
  const renderContent = (item: any) => {
    const commonClasses = "p-6 rounded-2xl mb-8 shadow-lg bg-white/60 backdrop-blur-sm border border-gray-200/50";
    
    // Handle new content format with type and examples/key_points
    if (typeof item.content === 'object' && item.content !== null && item.content.type === 'text') {
      return (
        <div className={`${commonClasses} border-l-4 border-blue-400`}>
          <h2 className="text-2xl font-bold text-blue-700 mb-4 flex items-center gap-3">
            <SectionIcon type={item.section_type} /> {item.title || "Section"}
          </h2>
          
          {/* Main content - Clean Markdown Rendering */}
          <div className="mb-6">
            <ReactMarkdown 
              className="prose prose-lg max-w-none 
                prose-headings:text-blue-800 prose-headings:font-bold prose-headings:mb-4 prose-headings:mt-6
                prose-h3:text-xl prose-h3:text-blue-800 prose-h3:font-semibold prose-h3:mb-3 prose-h3:mt-5
                prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4 prose-p:mt-0
                prose-strong:text-blue-800 prose-strong:font-semibold 
                prose-em:text-gray-600 prose-em:italic
                prose-a:text-blue-600 prose-a:hover:text-blue-800 prose-a:underline
                prose-blockquote:border-l-4 prose-blockquote:border-blue-400 prose-blockquote:bg-blue-50 prose-blockquote:text-gray-700 prose-blockquote:pl-4 prose-blockquote:py-3 prose-blockquote:my-4 prose-blockquote:italic
                prose-ul:my-4 prose-ul:list-disc prose-ul:pl-6 prose-ul:space-y-2
                prose-ol:my-4 prose-ol:list-decimal prose-ol:pl-6 prose-ol:space-y-2
                prose-li:text-gray-700 prose-li:my-1 prose-li:leading-relaxed prose-li:marker:text-blue-500
                prose-code:bg-blue-50 prose-code:text-blue-800 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm prose-code:font-mono
                prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:p-4 prose-pre:rounded-lg prose-pre:overflow-x-auto
                prose-hr:border-blue-200 prose-hr:my-6"
              components={{
                h3: ({children}) => (
                  <h3 className="text-xl font-semibold text-blue-800 mb-3 mt-6 border-b border-blue-200 pb-2">
                    {children}
                  </h3>
                ),
                p: ({children}) => (
                  <p className="text-gray-700 leading-relaxed mb-4">
                    {children}
                  </p>
                ),
                ul: ({children}) => (
                  <ul className="list-disc pl-6 my-4 space-y-2 text-gray-700">
                    {children}
                  </ul>
                ),
                ol: ({children}) => (
                  <ol className="list-decimal pl-6 my-4 space-y-2 text-gray-700">
                    {children}
                  </ol>
                ),
                li: ({children}) => (
                  <li className="text-gray-700 leading-relaxed marker:text-blue-500">
                    {children}
                  </li>
                ),
                blockquote: ({children}) => (
                  <blockquote className="border-l-4 border-blue-400 bg-blue-50 pl-4 py-3 my-4 italic text-gray-700 rounded-r-lg">
                    {children}
                  </blockquote>
                ),
                strong: ({children}) => (
                  <strong className="font-semibold text-blue-800">
                    {children}
                  </strong>
                ),
                em: ({children}) => (
                  <em className="italic text-gray-600">
                    {children}
                  </em>
                ),
                img: ({src, alt, title}) => (
                  <ImageComponent src={src} alt={alt} title={title} />
                )
              }}
            >
              {preprocessMarkdown(item.content.content)}
            </ReactMarkdown>
          </div>
          
          {/* Key points section */}
          {item.content.key_points && item.content.key_points.length > 0 && (
            <div className="mt-6 p-5 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-600" />
                Key Takeaways
              </h3>
              <ul className="space-y-3">
                {item.content.key_points.map((point: string, index: number) => (
                  <li key={index} className="flex items-start gap-3 text-gray-700">
                    <div className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium mt-0.5">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <ReactMarkdown 
                        className="prose prose-sm max-w-none prose-p:text-gray-700 prose-p:m-0 prose-strong:text-blue-700 prose-em:text-gray-600 prose-code:bg-blue-100 prose-code:text-blue-800 prose-code:px-1 prose-code:rounded prose-code:text-sm"
                      >
                        {point}
                      </ReactMarkdown>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Examples section */}
          {item.content.examples && item.content.examples.length > 0 && (
            <div className="mt-6 p-5 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200">
              <h3 className="text-lg font-semibold text-green-800 mb-4 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-green-600" />
                Examples
              </h3>
              <div className="space-y-4">
                {item.content.examples.map((example: string, index: number) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-medium mt-0.5">
                      {index + 1}
                    </div>
                    <div className="flex-1 p-3 bg-white rounded-lg border border-green-100">
                      <ReactMarkdown 
                        className="prose prose-sm max-w-none prose-p:text-gray-700 prose-p:m-0 prose-strong:text-green-700 prose-em:text-gray-600 prose-code:bg-green-100 prose-code:text-green-800 prose-code:px-1 prose-code:rounded prose-code:text-sm"
                      >
                        {example}
                      </ReactMarkdown>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    }
    
    // Handle content that should be rendered as markdown (string content)
    if (typeof item.content === 'string' && item.content.length > 0) {
      return (
        <div className={`${commonClasses} border-l-4 border-blue-400`}>
          <h2 className="text-2xl font-bold text-blue-700 mb-4 flex items-center gap-3">
            <SectionIcon type={item.section_type} /> {item.title || "Section"}
          </h2>
          <div className="mb-6">
            <ReactMarkdown 
              className="prose prose-lg max-w-none 
                prose-headings:text-blue-800 
                prose-p:text-gray-700 
                prose-strong:text-blue-800 
                prose-em:text-gray-600
                prose-a:text-blue-600 
                prose-blockquote:border-l-4 prose-blockquote:border-blue-400 prose-blockquote:bg-blue-50
                prose-ul:list-disc prose-ul:pl-6
                prose-ol:list-decimal prose-ol:pl-6
                prose-code:bg-blue-50 prose-code:text-blue-800 prose-code:px-2 prose-code:py-1 prose-code:rounded
                prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:p-4 prose-pre:rounded-lg"
              components={{
                img: ({src, alt, title}) => (
                  <ImageComponent src={src} alt={alt} title={title} />
                )
              }}
            >
              {preprocessMarkdown(item.content)}
            </ReactMarkdown>
          </div>
        </div>
      );
    }

    // Handle practice exercises
    if (item.section_type === 'practice_exercise') {
      return (
        <div className={`${commonClasses} border-l-4 border-green-400`}>
          <h2 className="text-2xl font-bold text-green-700 mb-4 flex items-center gap-3">
            <SectionIcon type={item.section_type} className="h-6 w-6 text-green-600" /> 
            {item.title || "Practice Exercise"}
          </h2>
          <PracticeExercise
            exercise={item}
            onComplete={() => handleExerciseComplete(item.id)}
          />
        </div>
      );
    }

    // Default fallback
    return (
      <div className={`${commonClasses} border-l-4 border-gray-400`}>
        <h2 className="text-2xl font-bold text-gray-700 mb-4 flex items-center gap-3">
          <SectionIcon type={item.section_type} className="h-6 w-6 text-gray-600" /> 
          {item.title || "Section"}
        </h2>
        <p className="text-gray-600">Content not available for this section.</p>
      </div>
    );
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900 text-white">
        <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
      </div>
    );
  }

  // Error state
  if (error || !lesson) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Lesson Not Found</h2>
          <p className="text-gray-600 mb-6">The lesson you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate('/lessons')}>Back to Lessons</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 font-sans">
      <Toaster richColors theme="dark" />
      <div className="max-w-7xl mx-auto p-4 md:p-8 lg:p-12">
        <LessonHeader lesson={lesson} onBack={handleBack} />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Sidebar */}
          <aside className="lg:col-span-1 lg:sticky top-24 self-start">
            <VerticalTimeline
              sections={lesson.content_sections
                .filter(s => s.section_type !== 'image')
                .map(s => ({
                  id: s.id.toString(),
                  title: s.title,
                  icon: <SectionIcon type={s.section_type} />
                }))}
              completedSections={completedSections}
              currentSection={currentSection}
              onSectionClick={handleSectionClick}
            />
            <div className="mt-8 mb-12">
              <p className="text-sm text-gray-600 mb-2">Lesson Progress</p>
              <Progress value={lesson.progress_percentage} className="w-full bg-gray-200 h-2 [&>*]:bg-purple-500" />
              <p className="text-xs text-right mt-1 text-gray-500">{lesson.progress_percentage}% complete</p>
            </div>
          </aside>
          
          {/* Main Content */}
          <main className="lg:col-span-3">
            <div className="prose max-w-none text-gray-900">
              {lesson.content_sections.map((section, idx) => {
                const sectionId = section.id.toString();
                const sectionRef = (el: HTMLElement | null) => {
                  sectionRefs.current[sectionId] = el;
                };

                const topMargin = idx === 0 ? '' : 'mt-10';
                
                return (
                  <section
                    key={section.id}
                    id={sectionId}
                    ref={sectionRef}
                    className={`${topMargin} mb-10 scroll-mt-24`}
                  >
                    {renderContent(section)}
                  </section>
                );
              })}
            </div>

            <LessonFooter 
              lesson={lesson}
              allPracticeCompleted={allPracticeCompleted}
              onComplete={handleLessonComplete}
              previousLesson={previousLesson}
              nextLesson={nextLesson}
              onNavigate={handleNavigate}
            />
          </main>
        </div>
      </div>

      {/* AI Assistant Chat */}
      <Sheet>
        <SheetTrigger asChild>
          <Button className="fixed bottom-8 right-8 h-16 w-16 rounded-full bg-purple-600 hover:bg-purple-700 text-white shadow-2xl shadow-purple-400/50 transition-all duration-300 hover:scale-110">
            <MessageSquare size={32} />
          </Button>
        </SheetTrigger>
        <SheetContent
          className="w-[340px] sm:w-[400px] rounded-2xl p-0"
          style={{
            position: 'fixed',
            right: '1.5rem',
            bottom: '2rem',
            left: 'auto',
            top: 'auto',
            height: 'auto',
            maxHeight: 'none',
            borderRadius: '1rem',
            boxShadow: '0 8px 32px rgba(80, 36, 180, 0.18)'
          }}
        >
          <AIAssistantChat />
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default LessonPage;



