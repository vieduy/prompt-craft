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
  Folder
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useUser, UserButton } from "@stackframe/react";
import brain from "brain";
import { useEffect, useState } from "react";
import { Category } from "types";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
  const user = useUser();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [animatedText, setAnimatedText] = useState("");
  const fullText = "Transform AI from intimidating to empowering";

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

    const fetchCategories = async () => {
      try {
        const response = await brain.get_categories();
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
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
          <button className="text-gray-600 hover:text-blue-600 transition-colors">Features</button>
          <button className="text-gray-600 hover:text-blue-600 transition-colors" onClick={() => navigate("/lessons")}>Lessons</button>
          <button className="text-gray-600 hover:text-blue-600 transition-colors" onClick={() => navigate("/practice-playground")}>Practice</button>
          <button className="text-gray-600 hover:text-blue-600 transition-colors" onClick={() => navigate("/playgroundpage")}>Playground</button>
          {user && (
            <button className="text-gray-600 hover:text-blue-600 transition-colors" onClick={() => navigate("/dashboard")}>Dashboard</button>
          )}

          {user ? (
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome back, {user.displayName || user.primaryEmail}!</span>
              <UserButton />
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => navigate("/auth/sign-in")}>Sign In</Button>
              <Button onClick={() => navigate("/auth/sign-up")}>Get Started</Button>
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
                Perfect for Non-Tech Professionals
              </span>

              <h1 className="text-5xl font-bold leading-tight">
                Master AI Skills,
                <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  No Tech Background Required
                </span>
              </h1>

              <p className="text-xl text-gray-600 leading-relaxed">
                <span className="text-blue-600 font-medium min-h-[1.5rem] inline-block">
                  {animatedText}
                  <span className="animate-pulse">|</span>
                </span>
                <br />
                Learn prompting, master AI tools, and apply them to real business scenarios through interactive lessons and practice.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                onClick={handleGetStarted}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white group"
              >
                {user ? "Continue Learning" : "Start Your AI Journey"}
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>

              <Button
                size="lg"
                variant="outline"
                onClick={handleTryDemo}
                className="group"
              >
                <Play className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                Try Interactive Demo
              </Button>
            </div>

            <div className="flex items-center space-x-8 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>No coding required</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Real workplace scenarios</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>AI-powered feedback</span>
              </div>
            </div>
          </div>

          {/* Interactive Preview */}
          <div className="relative">
            <div className="bg-white rounded-2xl shadow-2xl p-6 transform hover:scale-105 transition-transform duration-300">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">Interactive Lesson Preview</h3>
                  <span className="inline-block bg-purple-100 text-purple-700 rounded px-2 py-1 text-xs font-semibold">Live Demo</span>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <p className="text-sm text-gray-600">Try writing a prompt for:</p>
                  <p className="font-medium">"Create a professional email to reschedule a meeting"</p>

                  <div className="bg-white border rounded-lg p-3 min-h-[100px] text-sm text-gray-500 italic">
                    Click "Try Demo" to start practicing...
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse delay-100"></div>
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse delay-200"></div>
                    </div>
                    <span className="text-xs text-gray-400">AI scoring: Ready</span>
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

      <section id="featured-lessons" className="py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <h2 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent sm:text-5xl md:text-6xl mb-4 text-center">
            Explore Our Learning Paths
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-gray-600 mb-6 text-center whitespace-nowrap">
            From fundamentals to advanced techniques, find the right course to elevate your AI skills.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {loading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <Card key={index} className="rounded-xl border bg-card text-card-foreground shadow group hover:shadow-lg transition-shadow">
                  <CardHeader className="text-left">
                    <div className="h-8 w-1/2 bg-gray-700 rounded animate-pulse mb-2"></div>
                    <div className="h-4 w-3/4 bg-gray-700 rounded animate-pulse"></div>
                  </CardHeader>
                  <CardContent className="text-left">
                    <div className="h-4 w-full bg-gray-700 rounded animate-pulse mb-2"></div>
                    <div className="h-4 w-5/6 bg-gray-700 rounded animate-pulse"></div>
                  </CardContent>
                </Card>
              ))
            ) : (
              categories.map((category) => {
                const Icon = iconMapping[category.icon] || iconMapping.Default;
                return (
                  <Card 
                    key={category.id} 
                    className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-white/60 backdrop-blur-sm border-gray-200/50"
                  >
                    <CardHeader className="p-6">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110">
                        <Icon className="w-6 h-6 text-blue-600" />
                      </div>
                      <CardTitle className="text-xl font-bold text-gray-900">{category.name}</CardTitle>
                      <CardDescription className="text-gray-600 h-12">{category.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6 pt-0">
                      <div className="flex justify-between items-center text-sm text-gray-500">
                        <span>{category.total_lessons} Lessons</span>
                        <Button variant="ghost" size="sm" className="group-hover:text-blue-600" onClick={() => handleCategoryClick(category.id, category.name)}>
                          Start Learning <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-32 bg-gradient-to-br from-white via-purple-50 to-blue-50">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="inline-block border border-purple-400 text-purple-400 rounded px-2 py-1 text-xs font-semibold">For Professionals, by Professionals</span>
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tighter text-purple-700 mb-4">
                Unlock Your Potential with Practical AI Skills
              </h2>
              <p className="text-lg md:text-xl text-blue-800 font-medium mb-6">
                Our platform is designed to bridge the gap between complex AI concepts and real-world application. Learn not just the "how," but the "why," with engaging, scenario-based lessons.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 text-white" onClick={handleGetStarted}>
                  {user ? "Go to Dashboard" : "Get Started Now"}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button size="lg" variant="outline" className="border-gray-600 text-gray-300" onClick={() => navigate('/practice-playground')}>
                  Try Sandbox
                </Button>
              </div>
            </div>
            <div className="relative h-full min-h-[300px] rounded-2xl bg-gray-800/50 p-8 border border-gray-700/50 flex flex-col justify-center items-center text-center">
              <div className="absolute top-0 left-0 w-full h-full bg-grid-purple-500/[0.05] [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
              <BrainCircuit className="w-16 h-16 text-purple-400 mb-4" />
              <h3 className="text-2xl font-bold text-white">The PromptCraft Method</h3>
              <p className="text-gray-400 mt-2">Learn by doing in an interactive environment that adapts to you.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl font-bold">Why PromptCraft Works for Non-Tech Professionals</h2>
          <p className="text-xl text-gray-600">Designed specifically for business professionals who want practical AI skills</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="group hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Brain className="w-6 h-6 text-blue-600" />
              </div>
              <CardTitle>Learn by Doing</CardTitle>
              <CardDescription>
                No boring theory. Jump straight into practical exercises with real business scenarios.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="group hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Target className="w-6 h-6 text-green-600" />
              </div>
              <CardTitle>AI-Powered Feedback</CardTitle>
              <CardDescription>
                Get instant, personalized feedback on your prompts and learn exactly how to improve.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="group hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6 text-purple-600" />
              </div>
              <CardTitle>Progressive Learning</CardTitle>
              <CardDescription>
                Start with basics and gradually master advanced techniques at your own pace.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold">Join Professionals Already Mastering AI</h2>
            <p className="text-xl text-gray-600">See how PromptCraft transformed their work</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  "I went from being intimidated by AI to using it daily for client communications. The practical approach made all the difference."
                </p>
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src="https://images.unsplash.com/photo-1494790108755-2616b612b495?w=150" />
                    <AvatarFallback>SC</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">Sarah Chen</p>
                    <p className="text-sm text-gray-500">Marketing Manager</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  "The AI feedback system helped me understand exactly what makes a good prompt. My productivity increased by 40%."
                </p>
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150" />
                    <AvatarFallback>MR</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">Mike Rodriguez</p>
                    <p className="text-sm text-gray-500">Sales Director</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  "Finally, an AI course that speaks my language. No technical jargon, just practical skills I use every day."
                </p>
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150" />
                    <AvatarFallback>JW</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">Jennifer Wang</p>
                    <p className="text-sm text-gray-500">Operations Lead</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-6 text-center space-y-8">
          <h2 className="text-4xl font-bold">
            Ready to Transform Your Relationship with AI?
          </h2>
          <p className="text-xl text-blue-100">
            Join thousands of professionals who've already unlocked their AI potential
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={handleGetStarted}
              className="bg-white text-blue-600 hover:bg-gray-100"
            >
              {user ? "Continue Your Journey" : "Start Learning Today"}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>

            <Button
              size="lg"
              variant="outline"
              onClick={handleTryDemo}
              className="border-white text-white hover:bg-white hover:text-blue-600"
            >
              Try Free Demo
            </Button>
          </div>

          <div className="flex items-center justify-center space-x-8 text-blue-100">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5" />
              <span>5,000+ learners</span>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="w-5 h-5" />
              <span>4.9/5 rating</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5" />
              <span>No risk, start free</span>
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
                Empowering non-tech professionals with practical AI skills
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Learn</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Prompting Basics</a></li>
                <li><a href="#" className="hover:text-white transition-colors">AI Tools</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Business Applications</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Practice Playground</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Feedback</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 PromptCraft. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;




