import {
  CheckHealthData,
  EnrollInRoadmapData,
  EnrollInRoadmapError,
  EnrollInRoadmapParams,
  ExerciseSubmission,
  GetAllRoadmapsData,
  GetCategoriesData,
  GetChallengeLeaderboardData,
  GetChallengeLeaderboardError,
  GetChallengeLeaderboardParams,
  GetDashboardDataData,
  GetLessonWithContentData,
  GetLessonWithContentError,
  GetLessonWithContentParams,
  GetLessonsByCategoryData,
  GetLessonsByCategoryError,
  GetLessonsByCategoryParams,
  GetMyRoadmapData,
  GetPersonalizedRecommendationsData,
  GetPersonalizedRecommendationsError,
  GetPersonalizedRecommendationsParams,
  GetPortfolioData,
  GetPracticeChallengesData,
  GetPracticeChallengesError,
  GetPracticeChallengesParams,
  GetPracticeSessionsData,
  GetPracticeSessionsError,
  GetPracticeSessionsParams,
  GetPracticeStatsData,
  GetRoadmapDetailsData,
  GetRoadmapDetailsError,
  GetRoadmapDetailsParams,
  GetUserAchievementsData,
  GetUserChallengeAnalyticsData,
  GetUserChallengeAnalyticsError,
  GetUserChallengeAnalyticsParams,
  GetUserStatsData,
  GetUserSubmissionsData,
  GetUserSubmissionsError,
  GetUserSubmissionsParams,
  LessonProgress,
  PromptPlaygroundRequest,
  PromptSubmission,
  RunPromptPlaygroundData,
  RunPromptPlaygroundError,
  SaveToPortfolioData,
  SaveToPortfolioError,
  SaveToPortfolioRequest,
  SubmitExerciseData,
  SubmitExerciseError,
  SubmitPromptData,
  SubmitPromptError,
  ToggleBookmarkData,
  ToggleBookmarkError,
  ToggleBookmarkParams,
  TrackEngagementData,
  TrackEngagementError,
  UpdateLessonProgressData,
  UpdateLessonProgressError,
  UserEngagement,
} from "./data-contracts";
import { ContentType, HttpClient, RequestParams } from "./http-client";

export class Brain<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * @description Check health of application. Returns 200 when OK, 500 when not.
   *
   * @name check_health
   * @summary Check Health
   * @request GET:/_healthz
   */
  check_health = (params: RequestParams = {}) =>
    this.request<CheckHealthData, any>({
      path: `/_healthz`,
      method: "GET",
      ...params,
    });

  /**
   * @description Get all lesson categories with user progress
   *
   * @tags dbtn/module:lessons, dbtn/hasAuth
   * @name get_categories
   * @summary Get Categories
   * @request GET:/routes/lessons/categories
   */
  get_categories = (params: RequestParams = {}) =>
    this.request<GetCategoriesData, any>({
      path: `/routes/lessons/categories`,
      method: "GET",
      ...params,
    });

  /**
   * @description Get lessons for a specific category with user progress
   *
   * @tags dbtn/module:lessons, dbtn/hasAuth
   * @name get_lessons_by_category
   * @summary Get Lessons By Category
   * @request GET:/routes/lessons/categories/{category_id}/lessons
   */
  get_lessons_by_category = ({ categoryId, ...query }: GetLessonsByCategoryParams, params: RequestParams = {}) =>
    this.request<GetLessonsByCategoryData, GetLessonsByCategoryError>({
      path: `/routes/lessons/categories/${categoryId}/lessons`,
      method: "GET",
      ...params,
    });

  /**
   * @description Get personalized lesson recommendations based on user progress and engagement
   *
   * @tags dbtn/module:lessons, dbtn/hasAuth
   * @name get_personalized_recommendations
   * @summary Get Personalized Recommendations
   * @request GET:/routes/lessons/recommendations
   */
  get_personalized_recommendations = (query: GetPersonalizedRecommendationsParams, params: RequestParams = {}) =>
    this.request<GetPersonalizedRecommendationsData, GetPersonalizedRecommendationsError>({
      path: `/routes/lessons/recommendations`,
      method: "GET",
      query: query,
      ...params,
    });

  /**
   * @description Get all achievements with user's earned status
   *
   * @tags dbtn/module:lessons, dbtn/hasAuth
   * @name get_user_achievements
   * @summary Get User Achievements
   * @request GET:/routes/lessons/achievements
   */
  get_user_achievements = (params: RequestParams = {}) =>
    this.request<GetUserAchievementsData, any>({
      path: `/routes/lessons/achievements`,
      method: "GET",
      ...params,
    });

  /**
   * @description Get user learning statistics
   *
   * @tags dbtn/module:lessons, dbtn/hasAuth
   * @name get_user_stats
   * @summary Get User Stats
   * @request GET:/routes/lessons/stats
   */
  get_user_stats = (params: RequestParams = {}) =>
    this.request<GetUserStatsData, any>({
      path: `/routes/lessons/stats`,
      method: "GET",
      ...params,
    });

  /**
   * @description Track user engagement with lessons
   *
   * @tags dbtn/module:lessons, dbtn/hasAuth
   * @name track_engagement
   * @summary Track Engagement
   * @request POST:/routes/lessons/engagement
   */
  track_engagement = (data: UserEngagement, params: RequestParams = {}) =>
    this.request<TrackEngagementData, TrackEngagementError>({
      path: `/routes/lessons/engagement`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });

  /**
   * @description Update user's lesson progress
   *
   * @tags dbtn/module:lessons, dbtn/hasAuth
   * @name update_lesson_progress
   * @summary Update Lesson Progress
   * @request POST:/routes/lessons/progress
   */
  update_lesson_progress = (data: LessonProgress, params: RequestParams = {}) =>
    this.request<UpdateLessonProgressData, UpdateLessonProgressError>({
      path: `/routes/lessons/progress`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });

  /**
   * @description Toggle bookmark status for a lesson
   *
   * @tags dbtn/module:lessons, dbtn/hasAuth
   * @name toggle_bookmark
   * @summary Toggle Bookmark
   * @request POST:/routes/lessons/bookmark/{lesson_id}
   */
  toggle_bookmark = ({ lessonId, ...query }: ToggleBookmarkParams, params: RequestParams = {}) =>
    this.request<ToggleBookmarkData, ToggleBookmarkError>({
      path: `/routes/lessons/bookmark/${lessonId}`,
      method: "POST",
      ...params,
    });

  /**
   * @description Get user's analytics for a specific challenge.
   *
   * @tags dbtn/module:practice_playground, dbtn/hasAuth
   * @name get_user_challenge_analytics
   * @summary Get User Challenge Analytics
   * @request GET:/routes/practice/analytics/challenge/{challenge_id}
   */
  get_user_challenge_analytics = (
    { challengeId, ...query }: GetUserChallengeAnalyticsParams,
    params: RequestParams = {},
  ) =>
    this.request<GetUserChallengeAnalyticsData, GetUserChallengeAnalyticsError>({
      path: `/routes/practice/analytics/challenge/${challengeId}`,
      method: "GET",
      ...params,
    });

  /**
   * @description Get comprehensive dashboard data for the user
   *
   * @tags dbtn/module:dashboard, dbtn/hasAuth
   * @name get_dashboard_data
   * @summary Get Dashboard Data
   * @request GET:/routes/dashboard/
   */
  get_dashboard_data = (params: RequestParams = {}) =>
    this.request<GetDashboardDataData, any>({
      path: `/routes/dashboard/`,
      method: "GET",
      ...params,
    });

  /**
   * @description Get a lesson with all its content sections and exercises
   *
   * @tags dbtn/module:lesson_content, dbtn/hasAuth
   * @name get_lesson_with_content
   * @summary Get Lesson With Content
   * @request GET:/routes/lesson-content/lessons/{lesson_id}
   */
  get_lesson_with_content = ({ lessonId, ...query }: GetLessonWithContentParams, params: RequestParams = {}) =>
    this.request<GetLessonWithContentData, GetLessonWithContentError>({
      path: `/routes/lesson-content/lessons/${lessonId}`,
      method: "GET",
      ...params,
    });

  /**
   * @description Submit a practice exercise and get AI-powered assessment
   *
   * @tags dbtn/module:lesson_content, dbtn/hasAuth
   * @name submit_exercise
   * @summary Submit Exercise
   * @request POST:/routes/lesson-content/exercises/submit
   */
  submit_exercise = (data: ExerciseSubmission, params: RequestParams = {}) =>
    this.request<SubmitExerciseData, SubmitExerciseError>({
      path: `/routes/lesson-content/exercises/submit`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });

  /**
   * @description Get user's previous submissions for an exercise
   *
   * @tags dbtn/module:lesson_content, dbtn/hasAuth
   * @name get_user_submissions
   * @summary Get User Submissions
   * @request GET:/routes/lesson-content/exercises/{exercise_id}/submissions
   */
  get_user_submissions = ({ exerciseId, ...query }: GetUserSubmissionsParams, params: RequestParams = {}) =>
    this.request<GetUserSubmissionsData, GetUserSubmissionsError>({
      path: `/routes/lesson-content/exercises/${exerciseId}/submissions`,
      method: "GET",
      ...params,
    });

  /**
   * @description Accepts a user's prompt and streams a response from the AI model. This endpoint is designed for the open-ended prompt playground.
   *
   * @tags stream, dbtn/module:prompt_playground, dbtn/hasAuth
   * @name run_prompt_playground
   * @summary Run Prompt Playground
   * @request POST:/routes/playground
   */
  run_prompt_playground = (data: PromptPlaygroundRequest, params: RequestParams = {}) =>
    this.requestStream<RunPromptPlaygroundData, RunPromptPlaygroundError>({
      path: `/routes/playground`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });

  /**
   * @description Get practice challenges with optional filtering
   *
   * @tags dbtn/module:practice_playground, dbtn/hasAuth
   * @name get_practice_challenges
   * @summary Get Practice Challenges
   * @request GET:/routes/practice/challenges
   */
  get_practice_challenges = (query: GetPracticeChallengesParams, params: RequestParams = {}) =>
    this.request<GetPracticeChallengesData, GetPracticeChallengesError>({
      path: `/routes/practice/challenges`,
      method: "GET",
      query: query,
      ...params,
    });

  /**
   * @description Submit a prompt for AI assessment and scoring
   *
   * @tags dbtn/module:practice_playground, dbtn/hasAuth
   * @name submit_prompt
   * @summary Submit Prompt
   * @request POST:/routes/practice/submit
   */
  submit_prompt = (data: PromptSubmission, params: RequestParams = {}) =>
    this.request<SubmitPromptData, SubmitPromptError>({
      path: `/routes/practice/submit`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });

  /**
   * @description Get user's practice sessions
   *
   * @tags dbtn/module:practice_playground, dbtn/hasAuth
   * @name get_practice_sessions
   * @summary Get Practice Sessions
   * @request GET:/routes/practice/sessions
   */
  get_practice_sessions = (query: GetPracticeSessionsParams, params: RequestParams = {}) =>
    this.request<GetPracticeSessionsData, GetPracticeSessionsError>({
      path: `/routes/practice/sessions`,
      method: "GET",
      query: query,
      ...params,
    });

  /**
   * @description Get user's prompt portfolio
   *
   * @tags dbtn/module:practice_playground, dbtn/hasAuth
   * @name get_portfolio
   * @summary Get Portfolio
   * @request GET:/routes/practice/portfolio
   */
  get_portfolio = (params: RequestParams = {}) =>
    this.request<GetPortfolioData, any>({
      path: `/routes/practice/portfolio`,
      method: "GET",
      ...params,
    });

  /**
   * @description Save a practice session to user's portfolio
   *
   * @tags dbtn/module:practice_playground, dbtn/hasAuth
   * @name save_to_portfolio
   * @summary Save To Portfolio
   * @request POST:/routes/practice/portfolio
   */
  save_to_portfolio = (data: SaveToPortfolioRequest, params: RequestParams = {}) =>
    this.request<SaveToPortfolioData, SaveToPortfolioError>({
      path: `/routes/practice/portfolio`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });

  /**
   * @description Get user's practice statistics
   *
   * @tags dbtn/module:practice_playground, dbtn/hasAuth
   * @name get_practice_stats
   * @summary Get Practice Stats
   * @request GET:/routes/practice/stats
   */
  get_practice_stats = (params: RequestParams = {}) =>
    this.request<GetPracticeStatsData, any>({
      path: `/routes/practice/stats`,
      method: "GET",
      ...params,
    });

  /**
   * @description Get leaderboard for a specific challenge
   *
   * @tags dbtn/module:practice_playground, dbtn/hasAuth
   * @name get_challenge_leaderboard
   * @summary Get Challenge Leaderboard
   * @request GET:/routes/practice/leaderboard/{challenge_id}
   */
  get_challenge_leaderboard = ({ challengeId, ...query }: GetChallengeLeaderboardParams, params: RequestParams = {}) =>
    this.request<GetChallengeLeaderboardData, GetChallengeLeaderboardError>({
      path: `/routes/practice/leaderboard/${challengeId}`,
      method: "GET",
      query: query,
      ...params,
    });

  /**
   * @description Retrieves a list of all available learning roadmaps.
   *
   * @tags dbtn/module:roadmaps, dbtn/hasAuth
   * @name get_all_roadmaps
   * @summary Get All Roadmaps
   * @request GET:/routes/roadmaps/
   */
  get_all_roadmaps = (params: RequestParams = {}) =>
    this.request<GetAllRoadmapsData, any>({
      path: `/routes/roadmaps/`,
      method: "GET",
      ...params,
    });

  /**
   * @description Gets the active roadmap, progress, and current item for the authenticated user.
   *
   * @tags dbtn/module:roadmaps, dbtn/hasAuth
   * @name get_my_roadmap
   * @summary Get My Roadmap
   * @request GET:/routes/roadmaps/my-roadmap
   */
  get_my_roadmap = (params: RequestParams = {}) =>
    this.request<GetMyRoadmapData, any>({
      path: `/routes/roadmaps/my-roadmap`,
      method: "GET",
      ...params,
    });

  /**
   * @description Retrieves the details and items for a specific roadmap.
   *
   * @tags dbtn/module:roadmaps, dbtn/hasAuth
   * @name get_roadmap_details
   * @summary Get Roadmap Details
   * @request GET:/routes/roadmaps/{roadmap_id}
   */
  get_roadmap_details = ({ roadmapId, ...query }: GetRoadmapDetailsParams, params: RequestParams = {}) =>
    this.request<GetRoadmapDetailsData, GetRoadmapDetailsError>({
      path: `/routes/roadmaps/${roadmapId}`,
      method: "GET",
      ...params,
    });

  /**
   * @description Enrolls the authenticated user in a specific roadmap.
   *
   * @tags dbtn/module:roadmaps, dbtn/hasAuth
   * @name enroll_in_roadmap
   * @summary Enroll In Roadmap
   * @request POST:/routes/roadmaps/{roadmap_id}/enroll
   */
  enroll_in_roadmap = ({ roadmapId, ...query }: EnrollInRoadmapParams, params: RequestParams = {}) =>
    this.request<EnrollInRoadmapData, EnrollInRoadmapError>({
      path: `/routes/roadmaps/${roadmapId}/enroll`,
      method: "POST",
      ...params,
    });
}
