/** Category */
export interface Category {
  /** Id */
  id: number;
  /** Name */
  name: string;
  /** Description */
  description: string;
  /** Icon */
  icon: string;
  /** Color */
  color: string;
  /** Difficulty Level */
  difficulty_level: string;
  /** Order Index */
  order_index: number;
  /**
   * Lesson Count
   * @default 0
   */
  lesson_count?: number | null;
  /**
   * Completed Lessons
   * @default 0
   */
  completed_lessons?: number | null;
  /**
   * Progress Percentage
   * @default 0
   */
  progress_percentage?: number | null;
}

/** DashboardData */
export interface DashboardData {
  stats: DashboardStats;
  /** Recent Activity */
  recent_activity: RecentActivity[];
  /** Quick Actions */
  quick_actions: QuickAction[];
  /** Achievements */
  achievements: AppApisDashboardAchievement[];
  /** Recommended Lessons */
  recommended_lessons: RecommendedLesson[];
  /** Progress Overview */
  progress_overview: ProgressOverview[];
  learning_streak: LearningStreak;
}

/** DashboardStats */
export interface DashboardStats {
  /** Lessons Completed */
  lessons_completed: number;
  /** Lessons In Progress */
  lessons_in_progress: number;
  /** Total Lessons */
  total_lessons: number;
  /** Categories Explored */
  categories_explored: number;
  /** Total Categories */
  total_categories: number;
  /** Practice Sessions */
  practice_sessions: number;
  /** Average Practice Score */
  average_practice_score: number;
  /** Achievements Earned */
  achievements_earned: number;
  /** Total Achievements */
  total_achievements: number;
  /** Current Learning Streak */
  current_learning_streak: number;
  /** Total Study Time Minutes */
  total_study_time_minutes: number;
  /** Bookmarked Lessons */
  bookmarked_lessons: number;
}

/** ExerciseSubmission */
export interface ExerciseSubmission {
  /** Lesson Id */
  lesson_id: number;
  /** Lesson Content Id */
  lesson_content_id: number;
  /** Submitted Prompt */
  submitted_prompt: string;
}

/** HTTPValidationError */
export interface HTTPValidationError {
  /** Detail */
  detail?: ValidationError[];
}

/** HealthResponse */
export interface HealthResponse {
  /** Status */
  status: string;
}

/** LeaderboardEntry */
export interface LeaderboardEntry {
  /** User Id */
  user_id: string;
  /** Challenge Id */
  challenge_id: number;
  /** Challenge Title */
  challenge_title: string;
  /** Score */
  score: number;
  /** Rank Position */
  rank_position: number;
  /** Achieved At */
  achieved_at: string;
  /** User Name */
  user_name?: string | null;
}

/** LearningStreak */
export interface LearningStreak {
  /** Current Streak */
  current_streak: number;
  /** Longest Streak */
  longest_streak: number;
  /** Streak Goal */
  streak_goal: number;
  /** Last Activity Date */
  last_activity_date?: string | null;
  /** Is Today Completed */
  is_today_completed: boolean;
  /** Days This Week */
  days_this_week: boolean[];
}

/** Lesson */
export interface Lesson {
  /** Id */
  id: number;
  /** Title */
  title: string;
  /** Description */
  description: string;
  /** Category Id */
  category_id: number;
  /** Difficulty Level */
  difficulty_level: string;
  /** Estimated Duration */
  estimated_duration: number;
  /** Preview Content */
  preview_content: string;
  /** Learning Objectives */
  learning_objectives: string[];
  /** Workplace Scenario */
  workplace_scenario: string;
  /** Order Index */
  order_index: number;
  /**
   * Is Bookmarked
   * @default false
   */
  is_bookmarked?: boolean | null;
  /**
   * Progress Status
   * @default "not_started"
   */
  progress_status?: string | null;
  /**
   * Progress Percentage
   * @default 0
   */
  progress_percentage?: number | null;
}

/** LessonContentSection */
export interface LessonContentSection {
  /** Id */
  id: number;
  /** Section Type */
  section_type: string;
  /** Order Index */
  order_index: number;
  /** Title */
  title?: string | null;
  /** Content */
  content?: string | Record<string, any> | null;
  /**
   * Is Completed
   * @default false
   */
  is_completed?: boolean;
}

/** LessonProgress */
export interface LessonProgress {
  /** Lesson Id */
  lesson_id: number;
  /** Status */
  status: string;
  /** Progress Percentage */
  progress_percentage: number;
}

/** LessonWithContent */
export interface LessonWithContent {
  /** Id */
  id: number;
  /** Title */
  title: string;
  /** Description */
  description: string;
  /** Category Id */
  category_id: number;
  /** Difficulty Level */
  difficulty_level: string;
  /** Estimated Duration */
  estimated_duration: number;
  /** Learning Objectives */
  learning_objectives: string[];
  /** Workplace Scenario */
  workplace_scenario: string;
  /** Progress Status */
  progress_status: string;
  /** Progress Percentage */
  progress_percentage: number;
  /** Content Sections */
  content_sections: LessonContentSection[];
}

/** PortfolioItem */
export interface PortfolioItem {
  /** Id */
  id: number;
  /** Title */
  title: string;
  /** Description */
  description?: string | null;
  /** Prompt Text */
  prompt_text: string;
  /** Ai Response */
  ai_response?: string | null;
  /** Score */
  score?: number | null;
  /** Tags */
  tags: string[];
  /** Is Favorite */
  is_favorite: boolean;
  /** Is Public */
  is_public: boolean;
  /** Created At */
  created_at: string;
}

/** PracticeChallenge */
export interface PracticeChallenge {
  /** Id */
  id: number;
  /** Title */
  title: string;
  /** Description */
  description: string;
  /** Scenario Type */
  scenario_type: string;
  /** Difficulty Level */
  difficulty_level: string;
  /** Context */
  context: string;
  /** Target Outcome */
  target_outcome: string;
  /** Template Prompt */
  template_prompt?: string | null;
  /** Scoring Criteria */
  scoring_criteria: Record<string, any>;
  /** Max Score */
  max_score: number;
  /** Time Limit Minutes */
  time_limit_minutes?: number | null;
}

/** PracticeStats */
export interface PracticeStats {
  /** Total Sessions */
  total_sessions: number;
  /** Average Score */
  average_score: number;
  /** Best Score */
  best_score: number;
  /** Total Practice Time Minutes */
  total_practice_time_minutes: number;
  /** Current Streak Days */
  current_streak_days: number;
  /** Challenges Completed */
  challenges_completed: number;
  /** Prompts Saved */
  prompts_saved: number;
  /** Last Practice Date */
  last_practice_date?: string | null;
}

/** ProgressOverview */
export interface ProgressOverview {
  /** Category Id */
  category_id: number;
  /** Category Name */
  category_name: string;
  /** Category Color */
  category_color: string;
  /** Category Icon */
  category_icon: string;
  /** Total Lessons */
  total_lessons: number;
  /** Completed Lessons */
  completed_lessons: number;
  /** In Progress Lessons */
  in_progress_lessons: number;
  /** Progress Percentage */
  progress_percentage: number;
  /** Next Lesson Id */
  next_lesson_id?: number | null;
  /** Next Lesson Title */
  next_lesson_title?: string | null;
}

/** PromptPlaygroundRequest */
export interface PromptPlaygroundRequest {
  /** Prompt */
  prompt: string;
}

/** PromptSubmission */
export interface PromptSubmission {
  /** Challenge Id */
  challenge_id: number;
  /** User Prompt */
  user_prompt: string;
  /** Session Duration Seconds */
  session_duration_seconds?: number | null;
}

/** QuickAction */
export interface QuickAction {
  /** Action Type */
  action_type: string;
  /** Title */
  title: string;
  /** Description */
  description: string;
  /** Target Url */
  target_url: string;
  /** Progress Percentage */
  progress_percentage?: number | null;
  /** Estimated Time */
  estimated_time?: number | null;
}

/** RecentActivity */
export interface RecentActivity {
  /** Id */
  id: number;
  /** Activity Type */
  activity_type: string;
  /** Title */
  title: string;
  /** Description */
  description: string;
  /** Timestamp */
  timestamp: string;
  /** Metadata */
  metadata?: Record<string, any> | null;
}

/** RecommendedLesson */
export interface RecommendedLesson {
  /** Id */
  id: number;
  /** Title */
  title: string;
  /** Description */
  description: string;
  /** Category Name */
  category_name: string;
  /** Difficulty Level */
  difficulty_level: string;
  /** Estimated Duration */
  estimated_duration: number;
  /** Reason */
  reason: string;
  /** Learning Objectives */
  learning_objectives: string[];
  /** Progress Status */
  progress_status: string;
}

/** Roadmap */
export interface Roadmap {
  /** Id */
  id: number;
  /** Title */
  title: string;
  /** Description */
  description?: string | null;
  /** Target Audience */
  target_audience?: string | null;
  /** Icon */
  icon?: string | null;
  /** Estimated Duration Weeks */
  estimated_duration_weeks?: number | null;
}

/** RoadmapDetail */
export interface RoadmapDetail {
  /** Id */
  id: number;
  /** Title */
  title: string;
  /** Description */
  description?: string | null;
  /** Target Audience */
  target_audience?: string | null;
  /** Icon */
  icon?: string | null;
  /** Estimated Duration Weeks */
  estimated_duration_weeks?: number | null;
  /** Items */
  items: RoadmapItem[];
}

/** RoadmapItem */
export interface RoadmapItem {
  /** Id */
  id: number;
  /** Roadmap Id */
  roadmap_id: number;
  /** Item Type */
  item_type: string;
  /** Item Id */
  item_id: number;
  /** Order Index */
  order_index: number;
  /** Title */
  title?: string | null;
  /** Description */
  description?: string | null;
}

/** SaveToPortfolioRequest */
export interface SaveToPortfolioRequest {
  /** Session Id */
  session_id: number;
  /** Title */
  title: string;
  /** Description */
  description?: string | null;
  /**
   * Tags
   * @default []
   */
  tags?: string[];
  /**
   * Is Favorite
   * @default false
   */
  is_favorite?: boolean;
  /**
   * Is Public
   * @default false
   */
  is_public?: boolean;
}

/** SubmissionResult */
export interface SubmissionResult {
  /** Id */
  id: number;
  /** Score */
  score: number;
  /** Feedback */
  feedback: string;
}

/** UserChallengeAnalytics */
export interface UserChallengeAnalytics {
  /** Challenge Id */
  challenge_id: number;
  /** User Id */
  user_id: string;
  /** Attempts */
  attempts: number;
  /** Average Score */
  average_score: number;
  /** Best Score */
  best_score: number;
  /** First Attempt Date */
  first_attempt_date?: string | null;
  /** Last Attempt Date */
  last_attempt_date?: string | null;
  /** Recent Sessions */
  recent_sessions: AppApisAnalyticsPracticeSession[];
}

/** UserChallengeStats */
export interface UserChallengeStats {
  /** Average Score */
  average_score: number;
  /** Best Score */
  best_score: number;
  /** Attempts */
  attempts: number;
  /** Recent Sessions */
  recent_sessions: AppApisAnalyticsPracticeSession[];
}

/** UserEngagement */
export interface UserEngagement {
  /** Lesson Id */
  lesson_id: number;
  /** Action */
  action: string;
  /** Metadata */
  metadata?: Record<string, any> | null;
}

/** UserRoadmapProgress */
export interface UserRoadmapProgress {
  roadmap: Roadmap;
  /** Total Items */
  total_items: number;
  /** Completed Items */
  completed_items: number;
  current_item?: RoadmapItem | null;
}

/** UserStats */
export interface UserStats {
  /** Total Lessons Completed */
  total_lessons_completed: number;
  /** Total Categories Explored */
  total_categories_explored: number;
  /** Current Streak */
  current_streak: number;
  /** Total Points */
  total_points: number;
  /** Achievements Earned */
  achievements_earned: number;
  /** Bookmarked Lessons */
  bookmarked_lessons: number;
}

/** ValidationError */
export interface ValidationError {
  /** Location */
  loc: (string | number)[];
  /** Message */
  msg: string;
  /** Error Type */
  type: string;
}

/** PracticeSession */
export interface AppApisAnalyticsPracticeSession {
  /** Id */
  id: number;
  /** Challenge Id */
  challenge_id: number;
  /** User Prompt */
  user_prompt: string;
  /** Ai Response */
  ai_response?: string | null;
  /** Total Score */
  total_score: number;
  /** Max Score */
  max_score: number;
  /** Scoring Details */
  scoring_details: Record<string, any>;
  /** Submitted At */
  submitted_at: string;
}

/** Achievement */
export interface AppApisDashboardAchievement {
  /** Id */
  id: number;
  /** Name */
  name: string;
  /** Description */
  description: string;
  /** Icon */
  icon: string;
  /** Reward Points */
  reward_points: number;
  /** Is Earned */
  is_earned: boolean;
  /** Earned At */
  earned_at?: string | null;
  /** Progress Current */
  progress_current?: number | null;
  /** Progress Target */
  progress_target?: number | null;
}

/** Achievement */
export interface AppApisLessonsAchievement {
  /** Id */
  id: number;
  /** Name */
  name: string;
  /** Description */
  description: string;
  /** Icon */
  icon: string;
  /** Reward Points */
  reward_points: number;
  /**
   * Is Earned
   * @default false
   */
  is_earned?: boolean | null;
  /** Earned At */
  earned_at?: string | null;
}

/** PracticeSession */
export interface AppApisPracticePlaygroundPracticeSession {
  /** Id */
  id: number;
  /** Challenge Id */
  challenge_id: number;
  /** Challenge Title */
  challenge_title: string;
  /** User Prompt */
  user_prompt: string;
  /** Feedback */
  feedback: string;
  /** Total Score */
  total_score: number;
  /** Max Score */
  max_score: number;
  /** Scoring Breakdown */
  scoring_breakdown: Record<string, any>;
  /** Improvement Suggestions */
  improvement_suggestions: string[];
  /** Submitted At */
  submitted_at: string;
}

export type CheckHealthData = HealthResponse;

/** Response Get Categories */
export type GetCategoriesData = Category[];

export interface GetLessonsByCategoryParams {
  /** Category Id */
  categoryId: number;
}

/** Response Get Lessons By Category */
export type GetLessonsByCategoryData = Lesson[];

export type GetLessonsByCategoryError = HTTPValidationError;

export interface GetPersonalizedRecommendationsParams {
  /**
   * Limit
   * @default 6
   */
  limit?: number;
}

/** Response Get Personalized Recommendations */
export type GetPersonalizedRecommendationsData = Lesson[];

export type GetPersonalizedRecommendationsError = HTTPValidationError;

/** Response Get User Achievements */
export type GetUserAchievementsData = AppApisLessonsAchievement[];

export type GetUserStatsData = UserStats;

export type TrackEngagementData = any;

export type TrackEngagementError = HTTPValidationError;

export type UpdateLessonProgressData = any;

export type UpdateLessonProgressError = HTTPValidationError;

export interface ToggleBookmarkParams {
  /** Lesson Id */
  lessonId: number;
}

export type ToggleBookmarkData = any;

export type ToggleBookmarkError = HTTPValidationError;

export interface GetUserChallengeAnalyticsParams {
  /** Challenge Id */
  challengeId: number;
}

export type GetUserChallengeAnalyticsData = UserChallengeAnalytics;

export type GetUserChallengeAnalyticsError = HTTPValidationError;

export type GetDashboardDataData = DashboardData;

export interface GetLessonWithContentParams {
  /** Lesson Id */
  lessonId: number;
}

export type GetLessonWithContentData = LessonWithContent;

export type GetLessonWithContentError = HTTPValidationError;

export type SubmitExerciseData = SubmissionResult;

export type SubmitExerciseError = HTTPValidationError;

export interface GetUserSubmissionsParams {
  /** Exercise Id */
  exerciseId: number;
}

/** Response Get User Submissions */
export type GetUserSubmissionsData = SubmissionResult[];

export type GetUserSubmissionsError = HTTPValidationError;

export type RunPromptPlaygroundData = any;

export type RunPromptPlaygroundError = HTTPValidationError;

export interface GetPracticeChallengesParams {
  /** Difficulty */
  difficulty?: string | null;
  /** Scenario Type */
  scenario_type?: string | null;
}

/** Response Get Practice Challenges */
export type GetPracticeChallengesData = PracticeChallenge[];

export type GetPracticeChallengesError = HTTPValidationError;

export type SubmitPromptData = AppApisPracticePlaygroundPracticeSession;

export type SubmitPromptError = HTTPValidationError;

export interface GetPracticeSessionsParams {
  /**
   * Limit
   * @default 20
   */
  limit?: number;
}

/** Response Get Practice Sessions */
export type GetPracticeSessionsData = AppApisPracticePlaygroundPracticeSession[];

export type GetPracticeSessionsError = HTTPValidationError;

/** Response Get Portfolio */
export type GetPortfolioData = PortfolioItem[];

export type SaveToPortfolioData = PortfolioItem;

export type SaveToPortfolioError = HTTPValidationError;

export type GetPracticeStatsData = PracticeStats;

export interface GetChallengeLeaderboardParams {
  /**
   * Limit
   * @default 10
   */
  limit?: number;
  /** Challenge Id */
  challengeId: number;
}

/** Response Get Challenge Leaderboard */
export type GetChallengeLeaderboardData = LeaderboardEntry[];

export type GetChallengeLeaderboardError = HTTPValidationError;

/** Response Get All Roadmaps */
export type GetAllRoadmapsData = Roadmap[];

/** Response Get My Roadmap */
export type GetMyRoadmapData = UserRoadmapProgress | null;

export interface GetRoadmapDetailsParams {
  /** Roadmap Id */
  roadmapId: number;
}

export type GetRoadmapDetailsData = RoadmapDetail;

export type GetRoadmapDetailsError = HTTPValidationError;

export interface EnrollInRoadmapParams {
  /** Roadmap Id */
  roadmapId: number;
}

export type EnrollInRoadmapData = any;

export type EnrollInRoadmapError = HTTPValidationError;
