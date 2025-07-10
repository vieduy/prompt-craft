import {
  ArrowRight,
  Book,
  BrainCircuit,
  Lightbulb,
  Rocket,
  Zap,
  Brain,
  Play,
  Sparkles,
  CheckCircle,
  Target,
  Star,
  Users,
  Folder,
  Trophy,
  Medal,
  BarChart3,
  TrendingUp,
  Timer,
  Award,
  Clock
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { UserButton } from "@stackframe/react";
import { useEffect, useState } from "react";
import { Category } from "types";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useCategories } from "@/hooks/useData";
import { useAuthOptimization } from "@/hooks/useAuthOptimization";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useTranslation } from "react-i18next";

const iconMapping: { [key: string]: React.ElementType } = {
  Rocket: Rocket,
  Book: Book,
  BrainCircuit: BrainCircuit,
  Zap: Zap,
  Lightbulb: Lightbulb,
  Default: BrainCircuit,
};

const App = () => {
  const navigate = useNavigate();
  const user = useAuthOptimization();
  const { data: categories, isLoading: loading } = useCategories();
  const [animatedText, setAnimatedText] = useState("");
  const fullText = "Transform AI from intimidating to empowering";
  const { t } = useTranslation();

  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      if (i < fullText.length) {
        setAnimatedText(fullText.slice(0, i + 1));
        i++;
      } else {
        clearInterval(timer);
      }
    }, 50);

    return () => clearInterval(timer);
  }, []);

  const handleGetStarted = () => {
    if (user) {
      navigate("/dashboard");
    } else {
      navigate("/auth/sign-up");
    }
  };

  const handleTryDemo = () => {
    navigate("/practice-playground");
  };

  const handleCategoryClick = (categoryId: number, categoryName: string) => {
    navigate(`/CategoryPage?id=${categoryId}&name=${encodeURIComponent(categoryName)}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="flex items-center justify-between p-6 max-w-7xl mx-auto">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            PromptCraft
          </span>
        </div>

        <div className="flex items-center space-x-6">
          <button 
            className="text-gray-600 hover:text-blue-600 transition-colors"
            onClick={() => {
              document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            {t("features")}
          </button>
          <button className="text-gray-600 hover:text-blue-600 transition-colors" onClick={() => navigate("/lessons")}>{t("lessons")}</button>
          <button className="text-gray-600 hover:text-blue-600 transition-colors" onClick={() => navigate("/practice-playground")}>{t("practice")}</button>
          {user && (
            <button className="text-gray-600 hover:text-blue-600 transition-colors" onClick={() => navigate("/dashboard")}>{t("dashboard")}</button>
          )}

          {user ? (
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">{t("welcome_back", { name: user.displayName || user.primaryEmail })}</span>
              <LanguageSwitcher />
              <UserButton />
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <LanguageSwitcher />
              <Button variant="ghost" onClick={() => navigate("/auth/sign-in")}>{t("sign_in")}</Button>
              <Button onClick={() => navigate("/auth/sign-up")}>{t("get_started")}</Button>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <span className="inline-block bg-blue-100 text-blue-700 rounded px-2 py-1 text-xs font-semibold mr-2 align-middle">
                <Sparkles className="w-3 h-3 mr-1 inline" />
                {t("perfect_for_non_tech_professionals")}
              </span>

              <h1 className="text-5xl font-bold leading-tight">
                {t("master_ai_skills")},
                <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {t("no_tech_background_required")}
                </span>
              </h1>

              <p className="text-xl text-gray-600 leading-relaxed">
                <span className="text-blue-600 font-medium min-h-[1.5rem] inline-block">
                  {animatedText}
                  <span className="animate-pulse">|</span>
                </span>
                <br />
                {t("learn_prompting_master_ai_tools_apply_real_business_scenarios")}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                onClick={handleGetStarted}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white group"
              >
                {user ? t("go_to_dashboard") : t("start_your_ai_journey")}
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>

              <Button
                size="lg"
                variant="outline"
                onClick={handleTryDemo}
                className="group"
              >
                <Play className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                {t("try_interactive_demo")}
              </Button>
            </div>

            <div className="flex items-center space-x-8 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>{t("no_coding_required")}</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>{t("real_workplace_scenarios")}</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>{t("ai_powered_feedback")}</span>
              </div>
            </div>
          </div>

          {/* Interactive Preview */}
          <div className="relative">
            <div className="bg-white rounded-2xl shadow-2xl p-6 transform hover:scale-105 transition-transform duration-300">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">{t("interactive_lesson_preview")}</h3>
                  <span className="inline-block bg-purple-100 text-purple-700 rounded px-2 py-1 text-xs font-semibold">{t("live_demo")}</span>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <p className="text-sm text-gray-600">{t("try_writing_a_prompt_for")}:</p>
                  <p className="font-medium">"{t("create_a_professional_email_to_reschedule_a_meeting")}"</p>

                  <div className="bg-white border rounded-lg p-3 min-h-[100px] text-sm text-gray-500 italic">
                    {t("click_try_demo_to_start_practicing")}
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse delay-100"></div>
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse delay-200"></div>
                    </div>
                    <span className="text-xs text-gray-400">{t("ai_scoring_ready")}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 bg-blue-500 text-white p-3 rounded-full animate-bounce">
              <Target className="w-5 h-5" />
            </div>
            <div className="absolute -bottom-4 -left-4 bg-purple-500 text-white p-3 rounded-full animate-pulse">
              <Zap className="w-5 h-5" />
            </div>
          </div>
        </div>
      </section>

      <section id="featured-lessons" className="py-20 md:py-32 bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-6 py-12">
          {/* Header */}
          <div className="text-center space-y-6 mb-16">
            <span className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 rounded-full px-4 py-2 text-sm font-semibold">
              <Target className="w-4 h-4" />
              {t("your_learning_journey")}
            </span>
            
            <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {t("master_prompting_skills")}
              </span>
              <br />
              {t("from_beginner_to_expert")}
            </h2>
            
            <p className="max-w-3xl mx-auto text-xl text-gray-600 leading-relaxed">
              {t("follow_our_structured_learning_path_designed_by_ai_experts")}
            </p>
          </div>

          {/* Learning Journey Path */}
          <div className="relative">
            {/* Journey Line */}
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-blue-200 via-purple-200 to-green-200 transform -translate-y-1/2 hidden lg:block"></div>
            
            {/* Journey Steps */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 relative">
              {loading ? (
                Array.from({ length: 4 }).map((_, index) => (
                  <Card key={index} className="rounded-xl border bg-card text-card-foreground shadow group hover:shadow-lg transition-shadow">
                    <CardHeader className="text-center">
                      <div className="h-16 w-16 bg-gray-700 rounded-full animate-pulse mx-auto mb-4"></div>
                      <div className="h-6 w-3/4 bg-gray-700 rounded animate-pulse mx-auto mb-2"></div>
                      <div className="h-4 w-full bg-gray-700 rounded animate-pulse"></div>
                    </CardHeader>
                    <CardContent className="text-center">
                      <div className="h-4 w-full bg-gray-700 rounded animate-pulse mb-2"></div>
                      <div className="h-4 w-2/3 bg-gray-700 rounded animate-pulse mx-auto"></div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                categories?.slice(0, 4).map((category, index) => {
                  const Icon = iconMapping[category.icon] || iconMapping.Default;
                  const isEven = index % 2 === 0;
                  const stepColors = [
                    { bg: 'from-blue-500 to-blue-600', ring: 'ring-blue-200', text: 'text-blue-600', badge: 'bg-blue-50 text-blue-700' },
                    { bg: 'from-purple-500 to-purple-600', ring: 'ring-purple-200', text: 'text-purple-600', badge: 'bg-purple-50 text-purple-700' },
                    { bg: 'from-indigo-500 to-indigo-600', ring: 'ring-indigo-200', text: 'text-indigo-600', badge: 'bg-indigo-50 text-indigo-700' },
                    { bg: 'from-green-500 to-green-600', ring: 'ring-green-200', text: 'text-green-600', badge: 'bg-green-50 text-green-700' }
                  ];
                  const stepLabels = ['Foundation', 'Practice', 'Advanced', 'Expert'];
                  const stepDescriptions = [
                    'Start with prompting basics and core concepts',
                    'Apply skills through guided exercises',
                    'Master complex techniques and strategies', 
                    'Become a prompting expert in your field'
                  ];
                  
                  return (
                    <div key={category.id} className={`relative ${isEven ? 'lg:mt-0' : 'lg:mt-16'}`}>
                      {/* Step Number Circle */}
                      <div className={`absolute -top-8 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-gradient-to-br ${stepColors[index]?.bg} rounded-full flex items-center justify-center shadow-lg ring-4 ${stepColors[index]?.ring} bg-white z-10`}>
                        <span className="text-white font-bold text-lg">{index + 1}</span>
                      </div>
                      
                      <Card className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-white border-2 border-gray-100 hover:border-purple-200 pt-12">
                        <CardHeader className="text-center space-y-4">
                          {/* Step Badge */}
                          <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${stepColors[index]?.badge}`}>
                            {t("step")} {index + 1}: {stepLabels[index]}
                          </div>
                          
                          {/* Icon */}
                          <div className={`w-16 h-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl flex items-center justify-center mx-auto transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6`}>
                            <Icon className={`w-8 h-8 ${stepColors[index]?.text}`} />
                          </div>
                          
                          {/* Title */}
                          <CardTitle className="text-xl font-bold text-gray-900">{category.name}</CardTitle>
                          
                          {/* Step Description */}
                          <p className="text-sm text-gray-500 font-medium">{stepDescriptions[index]}</p>
                          
                          {/* Category Description */}
                          <CardDescription className="text-gray-600 leading-relaxed">{category.description}</CardDescription>
                        </CardHeader>
                        
                        <CardContent className="space-y-4">
                          {/* Progress Indicators */}
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <div className="flex items-center gap-1">
                              <Book className="w-3 h-3" />
                              <span>{category.total_lessons} {t("lessons")}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Target className="w-3 h-3" />
                              <span>{t("practice_included")}</span>
                            </div>
                          </div>
                          
                          {/* Skills You'll Gain */}
                          <div className="space-y-2">
                            <p className="text-xs font-medium text-gray-700">{t("skills_youll_gain")}:</p>
                            <div className="flex flex-wrap gap-1">
                              {[
                                ['Basic Prompts', 'AI Fundamentals', 'Clear Instructions'],
                                ['Prompt Engineering', 'Context Building', 'Iteration Skills'],
                                ['Complex Reasoning', 'Advanced Techniques', 'Optimization'],
                                ['Expert Strategies', 'Business Application', 'Leadership']
                              ][index]?.map((skill, skillIndex) => (
                                <span key={skillIndex} className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                          
                          {/* Action Button */}
                          <Button 
                            className={`w-full bg-gradient-to-r ${stepColors[index]?.bg} hover:scale-105 text-white group transition-all duration-300`}
                            onClick={() => handleCategoryClick(category.id, category.name)}
                          >
                            {t("start_learning")}
                            <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                          </Button>
                        </CardContent>
                        
                        {/* Connecting Arrow */}
                        {index < 3 && (
                          <div className="absolute -right-4 top-1/2 transform -translate-y-1/2 hidden lg:block">
                            <div className="w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center border-2 border-gray-200">
                              <ArrowRight className="w-4 h-4 text-gray-400" />
                            </div>
                          </div>
                        )}
                      </Card>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Learning Outcomes */}
          <div className="mt-20 bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mx-auto">
                  <Brain className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">{t("build_core_skills")}</h3>
                <p className="text-gray-600">{t("master_the_fundamentals_of_ai_prompting_with_hands_on_practice_and_real_world_examples")}</p>
              </div>
              
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center mx-auto">
                  <Trophy className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">{t("practice_compete")}</h3>
                <p className="text-gray-600">{t("apply_your_skills_in_challenges_compete_with_peers_and_track_your_progress_on_leaderboards")}</p>
              </div>
              
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center mx-auto">
                  <Rocket className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">{t("advance_your_career")}</h3>
                <p className="text-gray-600">{t("use_ai_tools_effectively_in_your_job_increase_productivity_and_become_the_go_to_ai_expert_in_your_field")}</p>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center mt-12">
            <Button
              size="lg"
              onClick={() => navigate("/lessons")}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg group"
            >
              {user ? t("explore_lessons") : t("start_your_learning_journey")}
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <p className="text-gray-500 text-sm mt-3">{t("join_5000_plus_professionals_already_advancing_their_careers_with_ai")}</p>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-32 bg-gradient-to-br from-white via-purple-50 to-blue-50">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-6">
                <span className="inline-flex items-center gap-2 border border-purple-400 text-purple-600 rounded-full px-4 py-2 text-sm font-semibold bg-purple-50">
                  <Trophy className="w-4 h-4" />
                  {t("practice_playground")}
                </span>
                
                <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900">
                  <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                    {t("unlock_your_potential")}
                  </span>
                  <br />
                  {t("with_hands_on_ai_practice")}
                </h2>
                
                <p className="text-xl text-gray-700 leading-relaxed">
                  {t("master_prompting_through_real_challenges_compete_on_leaderboards_and_build_a_portfolio_of_your_best_work")} 
                  {t("practice_makes_perfect")} — {t("and_our_ai_powered_feedback_makes_it_fun")}
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-gray-700">
                  <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-full">
                    <Target className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="font-medium">{t("real_world_prompting_challenges")}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
                    <Trophy className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="font-medium">{t("compete_on_skill_leaderboards")}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <div className="flex items-center justify-center w-8 h-8 bg-purple-100 rounded-full">
                    <Award className="w-4 h-4 text-purple-600" />
                  </div>
                  <span className="font-medium">{t("build_your_prompting_portfolio")}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white group"
                  onClick={() => navigate('/practice-playground')}
                >
                  <Play className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                  {t("start_practicing_now")}
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-purple-200 text-purple-700 hover:bg-purple-50"
                  onClick={() => navigate('/practice-playground?tab=leaderboards')}
                >
                  {user ? t("view_leaderboard") : t("learn_first")}
                </Button>
              </div>
            </div>

            {/* Right Content - Interactive Playground Preview */}
            <div className="relative">
              {/* Main Practice Card */}
              <div className="bg-white rounded-2xl shadow-2xl p-6 border border-purple-100">
                <div className="space-y-6">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                        <Brain className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">{t("practice_challenge")}</h3>
                        <p className="text-sm text-gray-500">{t("marketing_email_generator")}</p>
                      </div>
                    </div>
                    <Badge>
                      <Timer className="w-3 h-3 mr-1" />
                      {t("live")}
                    </Badge>
                  </div>

                  {/* Challenge Preview */}
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <p className="text-sm font-medium text-gray-700">{t("challenge_brief")}:</p>
                    <p className="text-sm text-gray-600">
                      "{t("create_a_compelling_email_campaign_for_a_new_productivity_app_launch_targeting_remote_workers")}"
                    </p>
                    
                    <div className="bg-white border-2 border-dashed border-gray-200 rounded-lg p-3 min-h-[80px] flex items-center justify-center">
                      <span className="text-gray-400 text-sm italic">{t("your_prompt_goes_here")}</span>
                    </div>
                  </div>

                  {/* Mini Leaderboard */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                        <BarChart3 className="w-4 h-4 text-purple-600" />
                        {t("top_performers")}
                      </h4>
                      <span className="text-xs text-purple-600 font-medium">{t("live_rankings")}</span>
                    </div>
                    
                    <div className="space-y-2">
                      {[
                        { name: "Alex Chen", score: 94, rank: 1, trend: "up" },
                        { name: "Sarah Kim", score: 91, rank: 2, trend: "up" },
                        { name: "Mike Jones", score: 88, rank: 3, trend: "down" }
                      ].map((user, index) => (
                        <div key={user.name} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                              index === 0 ? 'bg-yellow-100 text-yellow-700' :
                              index === 1 ? 'bg-gray-100 text-gray-700' :
                              'bg-orange-100 text-orange-700'
                            }`}>
                              {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                            </div>
                            <span className="text-sm font-medium text-gray-900">{user.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-gray-900">{user.score}</span>
                            <TrendingUp className={`w-3 h-3 ${user.trend === 'up' ? 'text-green-500' : 'text-red-500'}`} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Button */}
                  <Button 
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                    onClick={() => navigate('/practice-playground')}
                  >
                    {t("join_challenge")}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-6 -right-6 bg-gradient-to-br from-yellow-400 to-orange-500 text-white p-4 rounded-2xl shadow-lg transform rotate-12 animate-bounce">
                <Trophy className="w-6 h-6" />
              </div>
              
              <div className="absolute -bottom-6 -left-6 bg-gradient-to-br from-green-400 to-blue-500 text-white p-4 rounded-2xl shadow-lg transform -rotate-12 animate-pulse">
                <Medal className="w-6 h-6" />
              </div>

              {/* Stats Floating Cards */}
              <div className="absolute top-4 -left-8 bg-white rounded-lg shadow-lg p-3 border border-gray-100">
                <div className="text-center">
                  <div className="text-lg font-bold text-purple-600">2.5K+</div>
                  <div className="text-xs text-gray-500">{t("active_players")}</div>
                </div>
              </div>
              
              <div className="absolute bottom-16 -right-8 bg-white rounded-lg shadow-lg p-3 border border-gray-100">
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-600">150+</div>
                  <div className="text-xs text-gray-500">{t("challenges")}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-20 md:py-32 bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-6">
          {/* Enhanced Header */}
          <div className="text-center space-y-6 mb-16">
            <span className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 rounded-full px-6 py-3 text-sm font-semibold border border-blue-200">
              <Sparkles className="w-4 h-4" />
              {t("designed_for_real_professionals")}
            </span>
            
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {t("why_promptcraft_works")}
              </span>
              <br />
              <span className="text-gray-800">{t("for_non_tech_professionals")}</span>
            </h2>
            
            <p className="max-w-3xl mx-auto text-xl text-gray-600 leading-relaxed">
              {t("weve_designed_every_aspect_of_promptcraft_specifically_for_business_professionals_who_want_practical_ai_skills_without_the_technical_jargon")}
            </p>
          </div>

          {/* Main Features Grid */}
          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            {/* Feature 1: Learn by Doing */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
              <Card className="relative bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                <CardHeader className="text-center space-y-6 pb-8">
                  <div className="relative">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <Brain className="w-10 h-10 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-bold text-gray-900 mb-3">{t("learn_by_doing")}</CardTitle>
                    <CardDescription className="text-gray-600 text-base leading-relaxed">
                      {t("no_boring_theory_or_technical_jargon_jump_straight_into_practical_exercises_with_real_business_scenarios_youll_actually_use_at_work")}
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm text-gray-700">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>{t("real_workplace_scenarios")}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-700">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span>{t("hands_on_practice_exercises")}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-700">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>{t("immediate_application")}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Feature 2: AI-Powered Feedback */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
              <Card className="relative bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-blue-500"></div>
                <CardHeader className="text-center space-y-6 pb-8">
                  <div className="relative">
                    <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <Target className="w-10 h-10 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                      <Zap className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-bold text-gray-900 mb-3">{t("ai_powered_feedback")}</CardTitle>
                    <CardDescription className="text-gray-600 text-base leading-relaxed">
                      {t("get_instant_personalized_feedback_on_your_prompts_learn_exactly_what_works_what_doesnt_and_how_to_improve_step_by_step")}
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm text-gray-700">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>{t("instant_scoring_analysis")}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-700">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>{t("personalized_improvement_tips")}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-700">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span>{t("detailed_explanations")}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Feature 3: Progressive Learning */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
              <Card className="relative bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500"></div>
                <CardHeader className="text-center space-y-6 pb-8">
                  <div className="relative">
                    <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <Rocket className="w-10 h-10 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                      <TrendingUp className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-bold text-gray-900 mb-3">{t("progressive_learning")}</CardTitle>
                    <CardDescription className="text-gray-600 text-base leading-relaxed">
                      {t("start_with_basics_and_gradually_master_advanced_techniques_at_your_own_pace_build_confidence_as_you_progress_through_structured_levels")}
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm text-gray-700">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span>{t("structured_learning_path")}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-700">
                      <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                      <span>{t("self_paced_progression")}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-700">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span>{t("confidence_building")}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Additional Benefits Section */}
          <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{t("what_makes_us_different")}</h3>
              <p className="text-gray-600 max-w-2xl mx-auto">
                {t("unlike_traditional_tech_courses_we_focus_on_practical_business_applications_that_you_can_use_immediately_in_your_career")}
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="font-semibold text-gray-900">{t("no_tech_background_required")}</h4>
                <p className="text-sm text-gray-600">{t("designed_for_business_professionals_not_developers")}</p>
              </div>
              
              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto">
                  <Clock className="w-6 h-6 text-green-600" />
                </div>
                <h4 className="font-semibold text-gray-900">{t("learn_at_your_own_pace")}</h4>
                <p className="text-sm text-gray-600">{t("flexible_learning_that_fits_your_busy_schedule")}</p>
              </div>
              
              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto">
                  <Trophy className="w-6 h-6 text-purple-600" />
                </div>
                <h4 className="font-semibold text-gray-900">{t("proven_results")}</h4>
                <p className="text-sm text-gray-600">{t("join_5000_plus_professionals_whove_transformed_their_work")}</p>
              </div>
              
              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto">
                  <Award className="w-6 h-6 text-orange-600" />
                </div>
                <h4 className="font-semibold text-gray-900">{t("career_impact")}</h4>
                <p className="text-sm text-gray-600">{t("skills_that_directly_improve_your_job_performance")}</p>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center mt-12">
            <Button
              size="lg"
              onClick={() => navigate("/lessons")}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg group shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              {user ? t("start_practicing") : t("start_learning_today")}
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <p className="text-gray-500 text-sm mt-4">{t("join_professionals_already_mastering_ai_in_their_careers")}</p>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-white via-blue-50 to-purple-50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          {/* Enhanced Header */}
          <div className="text-center space-y-6 mb-16">
            <span className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 rounded-full px-6 py-3 text-sm font-semibold border border-blue-200 animate-pulse">
              <Star className="w-4 h-4" />
              {t("success_stories")}
            </span>
            
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {t("join_professionals")}
              </span>
              <br />
              <span className="text-gray-800">{t("already_mastering_ai")}</span>
            </h2>
            
            <p className="max-w-3xl mx-auto text-xl text-gray-600 leading-relaxed">
              {t("see_how_promptcraft_transformed_their_work_and_careers_real_stories_from_real_professionals")}
            </p>
          </div>

          {/* Enhanced Testimonials Grid */}
          <div className="grid md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
              <Card className="relative bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                <CardContent className="p-8">
                  {/* Animated Stars */}
                  <div className="flex items-center space-x-1 mb-6">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className="w-5 h-5 fill-yellow-400 text-yellow-400 animate-pulse" 
                        style={{ animationDelay: `${i * 100}ms` }}
                      />
                    ))}
                  </div>
                  
                  {/* Quote Icon */}
                  <div className="absolute top-6 right-6 w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center opacity-20 group-hover:opacity-40 transition-opacity">
                    <span className="text-2xl">"</span>
                  </div>
                  
                  <p className="text-gray-700 mb-6 leading-relaxed text-lg relative z-10">
                    "{t("i_went_from_being_intimidated_by_ai_to_using_it_daily_for_client_communications_the_practical_approach_made_all_the_difference")}"
                  </p>
                  
                  {/* Enhanced Profile */}
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <Avatar className="w-12 h-12 ring-2 ring-blue-200 group-hover:ring-purple-300 transition-all duration-300">
                        <AvatarImage src="https://images.unsplash.com/photo-1494790108755-2616b612b495?w=150" />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white">SC</AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{t("sarah_chen")}</p>
                      <p className="text-sm text-gray-500">{t("marketing_manager")}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-xs text-green-600 font-medium">{t("40_percent_productivity_increase")}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Testimonial 2 */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
              <Card className="relative bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-blue-500"></div>
                <CardContent className="p-8">
                  {/* Animated Stars */}
                  <div className="flex items-center space-x-1 mb-6">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className="w-5 h-5 fill-yellow-400 text-yellow-400 animate-pulse" 
                        style={{ animationDelay: `${i * 150}ms` }}
                      />
                    ))}
                  </div>
                  
                  {/* Quote Icon */}
                  <div className="absolute top-6 right-6 w-12 h-12 bg-gradient-to-br from-green-100 to-blue-100 rounded-full flex items-center justify-center opacity-20 group-hover:opacity-40 transition-opacity">
                    <span className="text-2xl">"</span>
                  </div>
                  
                  <p className="text-gray-700 mb-6 leading-relaxed text-lg relative z-10">
                    "{t("the_ai_feedback_system_helped_me_understand_exactly_what_makes_a_good_prompt_my_productivity_increased_by_40_percent")}"
                  </p>
                  
                  {/* Enhanced Profile */}
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <Avatar className="w-12 h-12 ring-2 ring-green-200 group-hover:ring-blue-300 transition-all duration-300">
                        <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150" />
                        <AvatarFallback className="bg-gradient-to-br from-green-500 to-blue-500 text-white">MR</AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-500 rounded-full border-2 border-white animate-pulse"></div>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{t("mike_rodriguez")}</p>
                      <p className="text-sm text-gray-500">{t("sales_director")}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                        <span className="text-xs text-blue-600 font-medium">{t("ai_expert_in_team")}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Testimonial 3 */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
              <Card className="relative bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500"></div>
                <CardContent className="p-8">
                  {/* Animated Stars */}
                  <div className="flex items-center space-x-1 mb-6">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className="w-5 h-5 fill-yellow-400 text-yellow-400 animate-pulse" 
                        style={{ animationDelay: `${i * 200}ms` }}
                      />
                    ))}
                  </div>
                  
                  {/* Quote Icon */}
                  <div className="absolute top-6 right-6 w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center opacity-20 group-hover:opacity-40 transition-opacity">
                    <span className="text-2xl">"</span>
                  </div>
                  
                  <p className="text-gray-700 mb-6 leading-relaxed text-lg relative z-10">
                    "{t("finally_an_ai_course_that_speaks_my_language_no_technical_jargon_just_practical_skills_i_use_every_day")}"
                  </p>
                  
                  {/* Enhanced Profile */}
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <Avatar className="w-12 h-12 ring-2 ring-purple-200 group-hover:ring-pink-300 transition-all duration-300">
                        <AvatarImage src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150" />
                        <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">JW</AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-pink-500 rounded-full border-2 border-white animate-pulse"></div>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{t("jennifer_wang")}</p>
                      <p className="text-sm text-gray-500">{t("operations_lead")}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <div className="w-2 h-2 bg-pink-500 rounded-full animate-pulse"></div>
                        <span className="text-xs text-pink-600 font-medium">{t("daily_ai_user")}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Floating Stats */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">{t("5000_plus_learners")}</div>
              <div className="text-sm text-gray-600">{t("active_learners")}</div>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">{t("94_percent_success_rate")}</div>
              <div className="text-sm text-gray-600">{t("success_rate")}</div>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Star className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">{t("4_9_average_rating")}</div>
              <div className="text-sm text-gray-600">{t("average_rating")}</div>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Rocket className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">{t("40_percent_productivity_boost")}</div>
              <div className="text-sm text-gray-600">{t("productivity_boost")}</div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center mt-12">
            <Button
              size="lg"
              onClick={handleGetStarted}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg group shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            >
              {user ? t("continue_your_journey") : t("join_them_today")}
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <p className="text-gray-500 text-sm mt-4 animate-pulse">{t("start_your_ai_transformation_journey_today")}</p>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-6 text-center space-y-8">
          <h2 className="text-4xl font-bold">
            {t("ready_to_start_your_ai_journey")}
          </h2>
          <p className="text-xl text-blue-100">
            {t("choose_your_path_and_begin_transforming_your_work_with_ai_today")}
          </p>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {/* Quick Start Option */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Play className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{t("try_free_demo")}</h3>
              <p className="text-blue-100 text-sm mb-4">{t("experience_the_platform_with_no_commitment")}</p>
              <Button
                size="sm"
                variant="outline"
                onClick={handleTryDemo}
                className="w-full border-white text-white hover:bg-white hover:text-blue-600 bg-white/20"
              >
                {t("start_demo")}
              </Button>
            </div>

            {/* Full Access Option */}
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 border border-white/30 hover:bg-white/30 transition-all duration-300">
              <div className="w-12 h-12 bg-white/30 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Rocket className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{t("full_access")}</h3>
              <p className="text-blue-100 text-sm mb-4">{t("unlock_all_lessons_and_practice_challenges")}</p>
              <Button
                size="sm"
                variant="outline"
                onClick={handleGetStarted}
                className="w-full border-white text-white hover:bg-white hover:text-blue-600 bg-white/20"
              >
                {user ? t("go_to_dashboard") : t("get_started_free")}
              </Button>
            </div>

            {/* Learn More Option */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Book className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{t("browse_lessons")}</h3>
              <p className="text-blue-100 text-sm mb-4">{t("explore_our_structured_learning_path")}</p>
              <Button
                size="sm"
                variant="outline"
                onClick={() => navigate("/lessons")}
                className="w-full border-white text-white hover:bg-white hover:text-blue-600 bg-white/20"
              >
                {t("view_lessons")}
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-center space-x-8 text-blue-100 pt-4">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5" />
              <span>{t("5000_plus_learners")}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="w-5 h-5" />
              <span>{t("4_9_average_rating")}</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5" />
              <span>{t("no_risk_start_free")}</span>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">PromptCraft</span>
              </div>
              <p className="text-gray-400">
                {t("empowering_non_tech_professionals_with_practical_ai_skills")}
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">{t("learn")}</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">{t("prompting_basics")}</a></li>
                <li><a href="#" className="hover:text-white transition-colors">{t("ai_tools")}</a></li>
                <li><a href="#" className="hover:text-white transition-colors">{t("business_applications")}</a></li>
                <li><a href="#" className="hover:text-white transition-colors">{t("practice_playground")}</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">{t("support")}</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">{t("help_center")}</a></li>
                <li><a href="#" className="hover:text-white transition-colors">{t("community")}</a></li>
                <li><a href="mailto:hoangduy.cqb.2k@gmail.com" className="hover:text-white transition-colors">{t("gmail")}</a></li>
                <li><a href="tel:+84914542457" className="hover:text-white transition-colors">{t("phone")}</a></li>
                <li><a href="https://linkedin.com/in/duy-hoang-vien/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">{t("linkedin")}</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">{t("company")}</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="https://linkedin.com/company/vng-coporation/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">{t("about")}</a></li>
                <li><a href="#" className="hover:text-white transition-colors">{t("privacy")}</a></li>
                <li><a href="#" className="hover:text-white transition-colors">{t("terms")}</a></li>
                <li><a href="#" className="hover:text-white transition-colors">{t("blog")}</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 PromptCraft. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;




