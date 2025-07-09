import React, { useState, useEffect, useRef } from "react";
import {
  useParams,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { useLocation } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  CheckCircle,
  BookOpen,
  ChevronLeft,
  FileText,
  Flag,
  GraduationCap,
  Target,
  Youtube,
  Code,
  Badge,
  Loader2,
  CheckCircle2
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Skeleton } from "@/components/ui/skeleton";
import { useUserGuardContext } from "app/auth";
import type { LessonWithContent } from "types";
import { Toaster, toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import PracticeExercise from "components/PracticeExercise";
import VerticalTimeline from 'components/VerticalTimeline';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { AIAssistantChat } from 'components/AIAssistantChat';
import { MessageSquare } from 'lucide-react';
import { useLessonWithContent } from "../hooks/useData";
import brain from "brain";

const LessonPage = () => {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const lessonId = parseInt(params.get("id") || "0");
  
  const { data: lesson, isLoading, error } = useLessonWithContent(lessonId);
  const navigate = useNavigate();
  const [currentSection, setCurrentSection] = useState<string>('');
  const [completedSections, setCompletedSections] = useState<Set<string>>(new Set());
  
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

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
            
            // Mark as completed when it comes into view
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
      if (ref) observer.observe(ref);
    });

    return () => {
      Object.values(currentRefs).forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, [lesson]);

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

    // Update the lesson data
    Object.assign(lesson, { content_sections: newContentSections });
    setCompletedSections(prev => new Set(prev).add(exerciseId.toString()));
  };

  const getIconForSection = (type: string) => {
    switch (type) {
      case "introduction":
        return <BookOpen className="h-5 w-5" />;
      case "workplace_scenario":
        return <Target className="h-5 w-5" />;
      case "content_block":
        return <FileText className="h-5 w-5" />;
      case "code_block":
        return <Code className="h-5 w-5" />;
      case "video":
        return <Youtube className="h-5 w-5" />;
      case "conclusion":
        return <GraduationCap className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  const renderContent = (item: any) => {
    const commonClasses = "p-6 rounded-2xl mb-8 shadow-lg bg-white/60 backdrop-blur-sm border border-gray-200/50";
    switch (item.section_type) {
      case 'introduction':
      case 'workplace_scenario':
      case 'conclusion':
        return (
          <div className={`${commonClasses} border-l-4 border-blue-400`}>
            <h2 className="text-2xl font-bold text-blue-700 mb-3 flex items-center gap-3">
              {getIconForSection(item.section_type)} {item.title || "Section"}
            </h2>
            <ReactMarkdown className="prose max-w-none prose-p:text-gray-600 prose-h2:text-blue-700 prose-strong:text-purple-600 prose-a:text-blue-600 prose-blockquote:border-l-blue-400 prose-blockquote:bg-blue-50 prose-blockquote:text-gray-600 prose-ul:pl-6 prose-ol:pl-6 prose-li:marker:text-blue-400 prose-li:text-gray-600 prose-li:mb-1 prose-li:mt-1 prose-pre:bg-gray-100 prose-pre:text-sm prose-pre:rounded-lg prose-pre:p-3 prose-code:bg-gray-100 prose-code:text-purple-600 prose-code:rounded px-1 prose-code:before:content-none prose-code:after:content-none prose-table:text-gray-600 prose-th:text-blue-700 prose-td:text-gray-600 prose-hr:border-blue-200">
              {item.content}
            </ReactMarkdown>
          </div>
        );
      case 'content_block':
      case 'content':
      case 'example':
        return (
          <div className={commonClasses}>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
            <ReactMarkdown className="prose max-w-none prose-p:text-gray-600 prose-h2:text-blue-700 prose-strong:text-purple-600 prose-a:text-blue-600 prose-blockquote:border-l-blue-400 prose-blockquote:bg-blue-50 prose-blockquote:text-gray-600 prose-ul:pl-6 prose-ol:pl-6 prose-li:marker:text-blue-400 prose-li:text-gray-600 prose-li:mb-1 prose-li:mt-1 prose-pre:bg-gray-100 prose-pre:text-sm prose-pre:rounded-lg prose-pre:p-3 prose-code:bg-gray-100 prose-code:text-purple-600 prose-code:rounded px-1 prose-code:before:content-none prose-code:after:content-none prose-table:text-gray-600 prose-th:text-blue-700 prose-td:text-gray-600 prose-hr:border-blue-200">
              {item.content}
            </ReactMarkdown>
          </div>
        );
      case 'code_block':
        return (
          <div className={commonClasses}>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
            <pre className="bg-gray-100 text-gray-800 p-4 rounded-xl overflow-x-auto text-base font-mono border border-blue-200">
              <code>{item.content}</code>
            </pre>
          </div>
        );
      case 'practice_exercise':
        if (typeof item.content === 'object' && item.content !== null) {
          return <PracticeExercise exercise={{ ...item, lesson_id: lessonId }} onExerciseComplete={handleExerciseComplete} />;
        }
        return <div className={commonClasses}><p>Invalid practice exercise format.</p></div>;
      default:
        return null;
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900 text-white">
        <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500 text-xl bg-gray-900">
        Failed to load the lesson. Please try again later.
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-gray-900 text-white">
        <h2 className="text-2xl font-bold">Lesson Not Found</h2>
        <p className="text-gray-400 mb-6">
          We couldn't find the lesson you were looking for.
        </p>
        <Button
          onClick={() => navigate('/lessons')}
          className="bg-purple-600 hover:bg-purple-700 text-white"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Lessons
        </Button>
      </div>
    );
  }

  const practiceExercises = lesson.content_sections.filter(s => s.section_type === 'practice_exercise');
  const allPracticeCompleted = practiceExercises.every(e => e.is_completed);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 font-sans">
      <Toaster richColors theme="dark" />
      <div className="max-w-7xl mx-auto p-4 md:p-8 lg:p-12">
        <header className="mb-12">
            <Button
              variant="ghost"
              className="mb-8 text-gray-500 hover:text-gray-800"
              onClick={() => navigate(`/category-page?id=${lesson.category_id}`)}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Category
            </Button>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tighter bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              {lesson.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 mb-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-sm font-semibold">
                {lesson.difficulty_level}
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold">
                {lesson.estimated_duration} min
              </span>
            </div>
            <p className="text-lg text-gray-700 mb-6 max-w-3xl">{lesson.description}</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          <aside className="lg:col-span-1 lg:sticky top-24 self-start">
              <VerticalTimeline
                sections={lesson.content_sections.map(s => ({
                  id: s.id.toString(),
                  title: s.title,
                  icon: getIconForSection(s.section_type)
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
          
          <main className="lg:col-span-3">
            <div className="prose max-w-none text-gray-900">
              {lesson.content_sections.map((section, idx) => {
                let icon = null;
                let headingClass = "mt-10 mb-4 flex items-center gap-2 text-2xl font-bold";
                if (section.section_type === "introduction") {
                  icon = <BookOpen className="w-6 h-6 text-blue-500" />;
                } else if (section.section_type === "example") {
                  icon = <Flag className="w-6 h-6 text-purple-500" />;
                } else {
                  icon = <FileText className="w-6 h-6 text-gray-400" />;
                }

                // Attach id and ref for scroll tracking
                const sectionId = section.id.toString();
                const sectionRef = (el: HTMLElement | null) => {
                  sectionRefs.current[sectionId] = el;
                };

                const topMargin = idx === 0 ? '' : 'mt-10';
                if (section.section_type === "practice_exercise") {
                  return (
                    <section
                      key={section.id}
                      id={sectionId}
                      ref={sectionRef}
                      className={`${topMargin} mb-10 scroll-mt-24`}
                    >
                  
                      <PracticeExercise exercise={{ ...section, lesson_id: lesson.id }} onExerciseComplete={handleExerciseComplete} />
                    </section>
                  );
                }

                // Render numbered list if content matches pattern like '1) ... 2) ...'
                let content = section.content;
                let numberedList = null;
                if (typeof content === 'string' && /\d\)\s/.test(content)) {
                  // Split by number pattern
                  const items = content.split(/(?=\d\)\s)/g).map(s => s.trim()).filter(Boolean);
                  if (items.length > 1) {
                    numberedList = (
                      <ol className="list-decimal pl-6 space-y-1">
                        {items.map((item, idx) => (
                          <li key={idx} className="text-gray-800">{item.replace(/^\d\)\s/, '')}</li>
                        ))}
                      </ol>
                    );
                  }
                }
                return (
                  <section
                    key={section.id}
                    id={sectionId}
                    ref={sectionRef}
                    className={`${topMargin} mb-10 scroll-mt-24`}
                  >
                    <div className={headingClass}>{icon}<span>{section.title}</span></div>
                    {numberedList ? numberedList : <div className="text-gray-800 whitespace-pre-line">{content}</div>}
                  </section>
                );
              })}
            </div>

            <footer className="mt-12">
              <Button
                className="w-full text-lg py-6 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:opacity-50 transition-all"
                disabled={!allPracticeCompleted}
                onClick={async () => {
                  try {
                    await brain.update_lesson_progress({
                      lesson_id: lesson.id,
                      status: 'completed',
                      progress_percentage: 100
                    });
                    toast.success('Lesson marked as complete!');
                    navigate(`/category-page?id=${lesson.category_id}`);
                  } catch (err) {
                    toast.error('Failed to mark lesson as complete.');
                  }
                }}
              >
                <CheckCircle2 className="w-6 h-6 mr-3" />
                Mark Lesson as Complete
              </Button>
            </footer>
          </main>
        </div>
      </div>

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



