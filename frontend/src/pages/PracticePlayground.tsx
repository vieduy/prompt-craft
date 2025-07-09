import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserGuardContext } from 'app/auth';
import brain from 'brain';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { toast } from 'sonner';
import { 
  Trophy, 
  Target, 
  Clock, 
  Lightbulb, 
  Send, 
  Book,
  History,
  Save, 
  Star, 
  TrendingUp,
  BookOpen,
  Zap,
  Award,
  Brain,
  Users,
  Timer,
  Sparkles,
  BarChart,
  ChevronRight,
  Plus,
  Filter,
  ArrowLeft,
  MessageSquare,
  RefreshCw
} from 'lucide-react';
import ChallengeBrief from 'components/ChallengeBrief';
import FeedbackCard from 'components/FeedbackCard';
import LeaderboardPreview from 'components/LeaderboardPreview';
import LeaderboardHub from 'components/LeaderboardHub';
import { AIAssistantChat } from 'components/AIAssistantChat';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import type { 
  PracticeChallenge, 
  PracticeSession, 
  PortfolioItem, 
  PracticeStats,
  LeaderboardEntry,
  UserChallengeAnalytics
} from 'types';

const PracticePlayground = () => {
  const navigate = useNavigate();
  const { user } = useUserGuardContext();
  const [challenges, setChallenges] = useState<PracticeChallenge[]>([]);
  const [selectedChallenge, setSelectedChallenge] = useState<PracticeChallenge | null>(null);
  const [userPrompt, setUserPrompt] = useState("");
  const [currentSession, setCurrentSession] = useState<PracticeSession | null>(null);
  const [sessions, setSessions] = useState<PracticeSession[]>([]);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [stats, setStats] = useState<PracticeStats | null>(null);
  const [activeChallengeId, setActiveChallengeId] = useState<number | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [analytics, setAnalytics] = useState<UserChallengeAnalytics | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [activeSubTab, setActiveSubTab] = useState("practice");
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [challengeSelectedFromLeaderboard, setChallengeSelectedFromLeaderboard] = useState(false);
  const [saveForm, setSaveForm] = useState({
    title: "",
    description: "",
    tags: "",
    is_favorite: false,
    is_public: false,
  });
  const [showLeaderboardPreview, setShowLeaderboardPreview] = useState(false);
  const [leaderboardSelectedChallengeId, setLeaderboardSelectedChallengeId] = useState<string>("");
  const [analyticsSelectedChallengeId, setAnalyticsSelectedChallengeId] = useState<number | null>(null);

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (selectedChallenge && selectedChallenge.template_prompt) {
      setUserPrompt(selectedChallenge.template_prompt);
    }
  }, [selectedChallenge]);

  useEffect(() => {
    if (activeChallengeId) {
      loadLeaderboard(activeChallengeId);
      loadAnalytics(activeChallengeId);
    }
  }, [activeChallengeId]);

  useEffect(() => {
    // Clear the leaderboard selection notification after 5 seconds
    if (challengeSelectedFromLeaderboard) {
      const timer = setTimeout(() => {
        setChallengeSelectedFromLeaderboard(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [challengeSelectedFromLeaderboard]);

  useEffect(() => {
    // Auto-select current challenge for analytics when switching to stats tab
    if (selectedChallenge && !analyticsSelectedChallengeId) {
      setAnalyticsSelectedChallengeId(selectedChallenge.id);
      loadAnalytics(selectedChallenge.id);
    }
  }, [selectedChallenge, analyticsSelectedChallengeId]);

  const loadInitialData = async () => {
    try {
      const response = await brain.get_practice_challenges();
      const data = await response.json();
      setChallenges(data);
      
      // Load initial stats
      await loadStats();
    } catch (error) {
      toast.error('Failed to load challenges');
    }

    try {
      const response = await brain.get_practice_sessions({ limit: 20 });
      const data = await response.json();
      setSessions(data);
    } catch (error) {
      console.error('Failed to load sessions:', error);
    }

    try {
      const response = await brain.get_portfolio();
      const data = await response.json();
      setPortfolio(data);
    } catch (error) {
      console.error('Failed to load portfolio:', error);
    }

    try {
      const response = await brain.get_practice_stats();
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const loadLeaderboard = async (challengeId: number) => {
    try {
      const response = await brain.get_challenge_leaderboard({ challengeId });
      const data = await response.json();
      setLeaderboard(data);
    } catch (error) {
      console.error('Failed to load leaderboard:', error);
      toast.error("Could not load leaderboard.");
    }
  };

  const loadAnalytics = async (challengeId: number) => {
    try {
      const response = await brain.get_user_challenge_analytics({ challengeId });
      const data = await response.json();
      setAnalytics(data);
    } catch (error) {
      console.error("Failed to load analytics:", error);
      // Set analytics to null to show loading state instead of error
      setAnalytics(null);
      toast.error("Could not load your analytics for this challenge.");
    }
  };

  const loadStats = async () => {
    try {
      const response = await brain.get_practice_stats();
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const handleChallengeSelect = (challengeId: string) => {
    setActiveChallengeId(Number(challengeId));
    setSelectedChallenge(challenges.find(challenge => challenge.id === Number(challengeId)));
    setCurrentSession(null);
    setStartTime(new Date());
    setShowLeaderboardPreview(true); // Show preview on new selection
    loadLeaderboard(Number(challengeId));
    loadAnalytics(Number(challengeId));
    // This will be handled by the new layout, so we no longer force a tab switch.
  };

  const handleSubmitPrompt = async () => {
    if (!selectedChallenge || !userPrompt.trim()) {
      toast.error("Please select a challenge and enter a prompt");
      return;
    }

    setIsSubmitting(true);
    try {
      const sessionDuration = startTime ? Math.floor((new Date().getTime() - startTime.getTime()) / 1000) : undefined;

      const submission: PromptSubmission = {
        challenge_id: selectedChallenge.id,
        user_prompt: userPrompt,
        session_duration_seconds: sessionDuration,
      };

      const response = await brain.submit_prompt(submission);
      const session = await response.json();

      setCurrentSession(session);
      setSessions((prev) => [session, ...prev]);
      loadStats();
      loadLeaderboard(selectedChallenge.id);
      
      // Add a small delay to ensure backend has processed the submission
      setTimeout(() => {
        console.log('Reloading analytics after submission for challenge:', selectedChallenge.id);
        loadAnalytics(selectedChallenge.id);
      }, 1000);

      toast.success(`Scored ${session.total_score}/${selectedChallenge.max_score}! 🎉`);
    } catch (error) {
      toast.error("Failed to submit prompt. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveToPortfolio = async () => {
    if (!currentSession) return;

    try {
      const tags = saveForm.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
      
      const saveRequest: SaveToPortfolioRequest = {
        session_id: currentSession.id,
        title: saveForm.title,
        description: saveForm.description || undefined,
        tags: tags,
        is_favorite: saveForm.is_favorite,
        is_public: saveForm.is_public,
      };

      const response = await brain.save_to_portfolio(saveRequest);
      const savedItem = await response.json();
      
      setPortfolio((prev) => [savedItem, ...prev]);
      setSaveDialogOpen(false);
      setSaveForm({
        title: "",
        description: "",
        tags: "",
        is_favorite: false,
        is_public: false,
      });
      
      toast.success("Saved to portfolio!");
    } catch (error) {
      toast.error("Failed to save to portfolio");
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner': return 'bg-green-100 text-green-700';
      case 'intermediate': return 'bg-yellow-100 text-yellow-700';
      case 'advanced': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getScenarioIcon = (scenario: string) => {
    switch (scenario.toLowerCase()) {
      case 'email': return <Mail className="h-4 w-4" />;
      case 'presentation': return <Presentation className="h-4 w-4" />;
      case 'report': return <FileText className="h-4 w-4" />;
      default: return <Target className="h-4 w-4" />;
    }
  };

  const StatCard = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string | number }) => (
    <Card className="bg-white/60 backdrop-blur-sm border-gray-200/50">
      <CardContent className="p-4">
        <div className="flex items-center space-x-4">
          <div className="p-2 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg">{icon}</div>
          <div>
            <p className="text-sm text-gray-600">{label}</p>
            <p className="text-xl font-bold">{value}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveSubTab(value);
    
    // Auto-select current challenge when switching to leaderboards
    if (value === "leaderboards" && selectedChallenge) {
      setLeaderboardSelectedChallengeId(selectedChallenge.id.toString());
    }
  };

  const handleTryChallengeFromLeaderboard = (challengeId: string) => {
    // Switch to practice tab
    setActiveSubTab("practice");
    // Select the challenge
    handleChallengeSelect(challengeId);
    // Set the notification state
    setChallengeSelectedFromLeaderboard(true);
    // Show success toast
    toast.success("Challenge selected! Start practicing now.");
    // Scroll to top of practice area
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-8 flex items-center gap-2 text-gray-500 hover:text-gray-800"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Button>
        
        <header className="text-center space-y-4 mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Practice Playground
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-gray-600">
            Hone your prompting skills through interactive challenges, track your progress, and build a portfolio of your best work.
          </p>
        </header>

        <Tabs value={activeSubTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 gap-2 bg-transparent p-0">
            <TabsTrigger value="practice" className="data-[state=active]:bg-white/80 data-[state=active]:shadow-md">Practice</TabsTrigger>
            <TabsTrigger value="portfolio" className="data-[state=active]:bg-white/80 data-[state=active]:shadow-md">My Portfolio</TabsTrigger>
            <TabsTrigger value="leaderboards" className="data-[state=active]:bg-white/80 data-[state=active]:shadow-md">Leaderboards</TabsTrigger>
            <TabsTrigger value="stats" className="data-[state=active]:bg-white/80 data-[state=active]:shadow-md">My Stats</TabsTrigger>
          </TabsList>

          {/* Practice Tab - Will be replaced with two-panel layout in next task */}
          <TabsContent value="practice" className="mt-6">
            {/* Notification banner for challenge selected from leaderboard */}
            {challengeSelectedFromLeaderboard && selectedChallenge && (
              <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  <div>
                    <p className="font-semibold text-blue-800">
                      Challenge selected from leaderboard!
                    </p>
                    <p className="text-sm text-blue-600">
                      You're now practicing: <span className="font-medium">{selectedChallenge.title}</span>
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setChallengeSelectedFromLeaderboard(false)}
                    className="ml-auto text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </Button>
                </div>
              </div>
            )}
            
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Left Panel: Challenge List */}
              <div className="lg:col-span-1">
                <Card className="bg-white/60 backdrop-blur-sm border-gray-200/50 p-4 sticky top-6">
                  <CardHeader className="p-2">
                    <CardTitle>Challenge Library</CardTitle>
                  </CardHeader>
                  <CardContent className="p-2 h-[calc(100vh-12rem)] overflow-y-auto space-y-3">
                    {challenges.map((challenge) => (
                      <Card
                        key={challenge.id}
                        className={`cursor-pointer transition-all duration-200 hover:shadow-md hover:border-blue-400
                          ${selectedChallenge?.id === challenge.id ? 'bg-blue-100/70 border-blue-500' : 'bg-white/50'}
                        `}
                        onClick={() => handleChallengeSelect(challenge.id.toString())}
                      >
                        <CardHeader className="p-3">
                          <div className="flex items-start justify-between">
                            <CardTitle className="text-sm font-semibold">{challenge.title}</CardTitle>
                            <Badge className={`${getDifficultyColor(challenge.difficulty_level)} px-2 py-0.5 text-xs`}>
                              {challenge.difficulty_level}
                            </Badge>
                          </div>
                        </CardHeader>
                      </Card>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Right Panel: Workspace */}
              <div className="lg:col-span-2">
                {selectedChallenge ? (
                  <div className="space-y-6">
                    <ChallengeBrief challenge={selectedChallenge} />
                    
                    {showLeaderboardPreview && (
                      <LeaderboardPreview
                        challengeId={selectedChallenge.id}
                        onViewFull={() => handleTabChange("leaderboards")}
                      />
                    )}

                    <Card className="bg-white/60 backdrop-blur-sm border-gray-200/50">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Brain className="h-5 w-5 text-blue-600" />
                          Your Workspace
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <Label htmlFor="prompt" className="font-semibold">Your Prompt:</Label>
                          <Textarea
                            id="prompt"
                            value={userPrompt}
                            onChange={(e) => setUserPrompt(e.target.value)}
                            placeholder="Craft your prompt here..."
                            rows={8}
                            className="mt-2 bg-white/50"
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            onClick={handleSubmitPrompt} 
                            disabled={isSubmitting || !userPrompt.trim()}
                            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                          >
                            {isSubmitting ? (
                              <Timer className="h-4 w-4 mr-2 animate-spin" />
                            ) : (
                              <Send className="h-4 w-4 mr-2" />
                            )}
                            {isSubmitting ? 'Analyzing...' : 'Submit & Get Feedback'}
                          </Button>
                          {selectedChallenge.template_prompt && (
                            <Button 
                              variant="outline" 
                              onClick={() => setUserPrompt(selectedChallenge.template_prompt || '')}
                            >
                              Reset
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    {currentSession && (
                      <>
                        <FeedbackCard session={currentSession} challenge={selectedChallenge} />
                        <div className="flex justify-center pt-4 mt-6 border-t border-gray-200/50">
                          <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
                            <DialogTrigger asChild>
                              <Button onClick={() => setSaveForm({...saveForm, title: selectedChallenge?.title || 'My Prompt'})}>
                                <Save className="h-4 w-4 mr-2" />
                                Save to Portfolio
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-white">
                              <DialogHeader>
                                <DialogTitle>Save to Portfolio</DialogTitle>
                                <DialogDescription>
                                  Save this prompt and result for future reference.
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <Label htmlFor="save-title">Title</Label>
                                  <Input
                                    id="save-title"
                                    value={saveForm.title}
                                    onChange={(e) => setSaveForm({...saveForm, title: e.target.value})}
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="save-description">Description (optional)</Label>
                                  <Textarea
                                    id="save-description"
                                    value={saveForm.description}
                                    onChange={(e) => setSaveForm({...saveForm, description: e.target.value})}
                                    rows={3}
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="save-tags">Tags (comma-separated)</Label>
                                  <Input
                                    id="save-tags"
                                    value={saveForm.tags}
                                    onChange={(e) => setSaveForm({...saveForm, tags: e.target.value})}
                                  />
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Checkbox
                                    id="save-favorite"
                                    checked={saveForm.is_favorite}
                                    onCheckedChange={(checked) => setSaveForm({...saveForm, is_favorite: checked as boolean})}
                                  />
                                  <Label htmlFor="save-favorite">Mark as favorite</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Checkbox
                                    id="save-public"
                                    checked={saveForm.is_public}
                                    onCheckedChange={(checked) => setSaveForm({...saveForm, is_public: checked as boolean})}
                                  />
                                  <Label htmlFor="save-public">Make public</Label>
                                </div>
                                <Button onClick={handleSaveToPortfolio} className="w-full">
                                  Save to Portfolio
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <Card className="bg-white/60 backdrop-blur-sm border-gray-200/50 h-full">
                    <CardContent className="p-12 text-center flex flex-col justify-center items-center h-full">
                      <Target className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                      <h3 className="text-xl font-semibold mb-2">Select a Challenge</h3>
                      <p className="text-gray-600">Choose a challenge from the library to get started.</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Portfolio Tab */}
          <TabsContent value="portfolio" className="mt-6">
            <Card className="bg-white/60 backdrop-blur-sm border-gray-200/50 p-6">
              <h2 className="text-2xl font-bold mb-4">My Portfolio</h2>
              {portfolio.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-6">
                  {portfolio.map((item) => (
                    <Card key={item.id} className="bg-white/80">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <CardTitle className="flex items-center gap-2 font-bold">
                            {item.is_favorite && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
                            {item.title}
                          </CardTitle>
                          {item.score && (
                            <Badge variant="secondary" className="font-mono">
                              {item.score} pts
                            </Badge>
                          )}
                        </div>
                        {item.description && (
                          <CardDescription className="text-sm">{item.description}</CardDescription>
                        )}
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div>
                            <h5 className="font-medium text-xs mb-1 text-gray-500">PROMPT</h5>
                            <p className="text-sm text-gray-800 bg-gray-500/5 p-3 rounded-md font-mono">
                              {item.prompt_text}
                            </p>
                          </div>
                          {item.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {item.tags.map((tag, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                          <div className="text-xs text-gray-400 pt-2 border-t border-gray-200/50">
                            Saved on {new Date(item.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Save className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-xl font-semibold mb-2">Portfolio is Empty</h3>
                  <p className="text-gray-600">Complete challenges and save your best prompts to see them here.</p>
                </div>
              )}
            </Card>
          </TabsContent>

          {/* Leaderboard Tab */}
          <TabsContent value="leaderboards" className="mt-6">
            <LeaderboardHub 
              challenges={challenges} 
              initialChallengeId={leaderboardSelectedChallengeId}
              onTryChallenge={handleTryChallengeFromLeaderboard}
            />
          </TabsContent>

          {/* Stats Tab */}
          <TabsContent value="stats" className="mt-6">
            <Card className="bg-white/60 backdrop-blur-sm border-gray-200/50 p-6">
              <h2 className="text-2xl font-bold mb-4">My Performance Stats</h2>
              {stats ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <StatCard icon={<Trophy className="text-yellow-500"/>} label="Best Score" value={stats.best_score} />
                  <StatCard icon={<TrendingUp className="text-green-500"/>} label="Avg Score" value={stats.average_score.toFixed(1)} />
                  <StatCard icon={<Zap className="text-blue-500"/>} label="Challenges Done" value={stats.challenges_completed} />
                  <StatCard icon={<Timer className="text-purple-500"/>} label="Practice Time" value={`${stats.total_practice_time_minutes} min`} />
                </div>
              ) : <p>Loading stats...</p>}
              
              <Separator className="my-6" />

              <h3 className="text-xl font-bold mb-4">Challenge-Specific Analytics</h3>
              <div className="mb-6">
                <Label htmlFor="analytics-challenge-select" className="text-sm font-medium text-gray-700 mb-2 block">
                  Select Challenge to View Analytics
                </Label>
                <Select 
                  value={analyticsSelectedChallengeId?.toString() || selectedChallenge?.id.toString() || ""} 
                  onValueChange={(value) => {
                    const challengeId = parseInt(value);
                    setAnalyticsSelectedChallengeId(challengeId);
                    loadAnalytics(challengeId);
                  }}
                >
                  <SelectTrigger className="w-full max-w-md">
                    <SelectValue placeholder="Choose a challenge..." />
                  </SelectTrigger>
                  <SelectContent>
                    {challenges.map((challenge) => (
                      <SelectItem key={challenge.id} value={challenge.id.toString()}>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{challenge.title}</span>
                          <Badge variant="outline" className="text-xs">
                            {challenge.difficulty_level}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {analyticsSelectedChallengeId ? (
                analytics ? (
                  (() => {
                    const selectedChallengeForAnalytics = challenges.find(c => c.id === analyticsSelectedChallengeId);
                    return analytics.attempts > 0 ? (
                      <div>
                        <CardHeader className="p-0 mb-4">
                          <div className="flex items-center justify-between">
                            <CardTitle>Analytics for: <span className="text-blue-600">{selectedChallengeForAnalytics?.title}</span></CardTitle>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                loadAnalytics(analyticsSelectedChallengeId);
                              }}
                              className="text-xs"
                            >
                              <RefreshCw className="h-3 w-3 mr-1" />
                              Refresh
                            </Button>
                          </div>
                        </CardHeader>
                        <div className="grid md:grid-cols-3 gap-4 mb-6">
                          <StatCard icon={<BarChart className="text-gray-500"/>} label="Attempts" value={analytics.attempts} />
                          <StatCard icon={<TrendingUp className="text-green-500"/>} label="Avg Score" value={analytics.average_score.toFixed(1)} />
                          <StatCard icon={<Trophy className="text-yellow-500"/>} label="Best Score" value={analytics.best_score} />
                        </div>
                        
                        <h4 className="font-semibold mb-2">Score History</h4>
                        <div style={{ width: '100%', height: 300 }}>
                          <ResponsiveContainer>
                            <LineChart data={analytics.recent_sessions?.slice().reverse().map((session, index) => ({
                              name: `Attempt ${index + 1}`, 
                              score: session.total_score,
                              date: new Date(session.submitted_at).toLocaleDateString()
                            })) || []}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="name" />
                              <YAxis />
                              <Tooltip />
                              <Legend />
                              <Line type="monotone" dataKey="score" stroke="#8884d8" activeDot={{ r: 8 }} />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <BarChart className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                        <h3 className="text-xl font-semibold mb-2">No Attempts Yet</h3>
                        <p className="text-gray-600 mb-4">
                          You haven't attempted this challenge yet. Give it a try!
                        </p>
                        <div className="flex gap-2 justify-center">
                          <Button 
                            onClick={() => {
                              setActiveSubTab("practice");
                              handleChallengeSelect(analyticsSelectedChallengeId.toString());
                            }}
                            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                          >
                            <Target className="h-4 w-4 mr-2" />
                            Try This Challenge
                          </Button>
                          <Button 
                            variant="outline"
                            onClick={() => {
                              loadAnalytics(analyticsSelectedChallengeId);
                            }}
                            className="text-xs"
                          >
                            <RefreshCw className="h-3 w-3 mr-1" />
                            Refresh Analytics
                          </Button>
                        </div>
                      </div>
                    )
                  })()
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading analytics...</p>
                  </div>
                )
              ) : (
                <div className="text-center py-12">
                  <BarChart className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-xl font-semibold mb-2">Select a Challenge</h3>
                  <p className="text-gray-600">Choose a challenge from the dropdown above to view its analytics.</p>
                </div>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Sheet>
        <SheetTrigger asChild>
          <Button className="fixed bottom-8 right-8 h-16 w-16 rounded-full bg-purple-600 hover:bg-purple-700 text-white shadow-2xl shadow-purple-400/50 transition-all duration-300 hover:scale-110">
            <MessageSquare size={32} />
          </Button>
        </SheetTrigger>
        <SheetContent
          className="w-[340px] sm:w-[400px] rounded-2xl p-0 overflow-x-hidden w-full max-w-full"
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
          <div className="w-full max-w-full overflow-x-hidden">
            <AIAssistantChat />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default PracticePlayground;








