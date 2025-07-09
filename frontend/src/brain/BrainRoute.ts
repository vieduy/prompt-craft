import {
  CheckHealthData,
  EnrollInRoadmapData,
  ExerciseSubmission,
  GetAllRoadmapsData,
  GetCategoriesData,
  GetChallengeLeaderboardData,
  GetDashboardDataData,
  GetLessonWithContentData,
  GetLessonsByCategoryData,
  GetMyRoadmapData,
  GetPersonalizedRecommendationsData,
  GetPortfolioData,
  GetPracticeChallengesData,
  GetPracticeSessionsData,
  GetPracticeStatsData,
  GetRoadmapDetailsData,
  GetUserAchievementsData,
  GetUserChallengeAnalyticsData,
  GetUserStatsData,
  GetUserSubmissionsData,
  LessonProgress,
  PromptPlaygroundRequest,
  PromptSubmission,
  RunPromptPlaygroundData,
  SaveToPortfolioData,
  SaveToPortfolioRequest,
  SubmitExerciseData,
  SubmitPromptData,
  ToggleBookmarkData,
  TrackEngagementData,
  UpdateLessonProgressData,
  UserEngagement,
} from "./data-contracts";

export namespace Brain {
  /**
   * @description Check health of application. Returns 200 when OK, 500 when not.
   * @name check_health
   * @summary Check Health
   * @request GET:/_healthz
   */
  export namespace check_health {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = CheckHealthData;
  }

  /**
   * @description Get all lesson categories with user progress
   * @tags dbtn/module:lessons, dbtn/hasAuth
   * @name get_categories
   * @summary Get Categories
   * @request GET:/routes/lessons/categories
   */
  export namespace get_categories {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetCategoriesData;
  }

  /**
   * @description Get lessons for a specific category with user progress
   * @tags dbtn/module:lessons, dbtn/hasAuth
   * @name get_lessons_by_category
   * @summary Get Lessons By Category
   * @request GET:/routes/lessons/categories/{category_id}/lessons
   */
  export namespace get_lessons_by_category {
    export type RequestParams = {
      /** Category Id */
      categoryId: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetLessonsByCategoryData;
  }

  /**
   * @description Get personalized lesson recommendations based on user progress and engagement
   * @tags dbtn/module:lessons, dbtn/hasAuth
   * @name get_personalized_recommendations
   * @summary Get Personalized Recommendations
   * @request GET:/routes/lessons/recommendations
   */
  export namespace get_personalized_recommendations {
    export type RequestParams = {};
    export type RequestQuery = {
      /**
       * Limit
       * @default 6
       */
      limit?: number;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetPersonalizedRecommendationsData;
  }

  /**
   * @description Get all achievements with user's earned status
   * @tags dbtn/module:lessons, dbtn/hasAuth
   * @name get_user_achievements
   * @summary Get User Achievements
   * @request GET:/routes/lessons/achievements
   */
  export namespace get_user_achievements {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetUserAchievementsData;
  }

  /**
   * @description Get user learning statistics
   * @tags dbtn/module:lessons, dbtn/hasAuth
   * @name get_user_stats
   * @summary Get User Stats
   * @request GET:/routes/lessons/stats
   */
  export namespace get_user_stats {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetUserStatsData;
  }

  /**
   * @description Track user engagement with lessons
   * @tags dbtn/module:lessons, dbtn/hasAuth
   * @name track_engagement
   * @summary Track Engagement
   * @request POST:/routes/lessons/engagement
   */
  export namespace track_engagement {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = UserEngagement;
    export type RequestHeaders = {};
    export type ResponseBody = TrackEngagementData;
  }

  /**
   * @description Update user's lesson progress
   * @tags dbtn/module:lessons, dbtn/hasAuth
   * @name update_lesson_progress
   * @summary Update Lesson Progress
   * @request POST:/routes/lessons/progress
   */
  export namespace update_lesson_progress {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = LessonProgress;
    export type RequestHeaders = {};
    export type ResponseBody = UpdateLessonProgressData;
  }

  /**
   * @description Toggle bookmark status for a lesson
   * @tags dbtn/module:lessons, dbtn/hasAuth
   * @name toggle_bookmark
   * @summary Toggle Bookmark
   * @request POST:/routes/lessons/bookmark/{lesson_id}
   */
  export namespace toggle_bookmark {
    export type RequestParams = {
      /** Lesson Id */
      lessonId: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ToggleBookmarkData;
  }

  /**
   * @description Get user's analytics for a specific challenge.
   * @tags dbtn/module:practice_playground, dbtn/hasAuth
   * @name get_user_challenge_analytics
   * @summary Get User Challenge Analytics
   * @request GET:/routes/practice/analytics/challenge/{challenge_id}
   */
  export namespace get_user_challenge_analytics {
    export type RequestParams = {
      /** Challenge Id */
      challengeId: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetUserChallengeAnalyticsData;
  }

  /**
   * @description Get comprehensive dashboard data for the user
   * @tags dbtn/module:dashboard, dbtn/hasAuth
   * @name get_dashboard_data
   * @summary Get Dashboard Data
   * @request GET:/routes/dashboard/
   */
  export namespace get_dashboard_data {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetDashboardDataData;
  }

  /**
   * @description Get a lesson with all its content sections and exercises
   * @tags dbtn/module:lesson_content, dbtn/hasAuth
   * @name get_lesson_with_content
   * @summary Get Lesson With Content
   * @request GET:/routes/lesson-content/lessons/{lesson_id}
   */
  export namespace get_lesson_with_content {
    export type RequestParams = {
      /** Lesson Id */
      lessonId: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetLessonWithContentData;
  }

  /**
   * @description Submit a practice exercise and get AI-powered assessment
   * @tags dbtn/module:lesson_content, dbtn/hasAuth
   * @name submit_exercise
   * @summary Submit Exercise
   * @request POST:/routes/lesson-content/exercises/submit
   */
  export namespace submit_exercise {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = ExerciseSubmission;
    export type RequestHeaders = {};
    export type ResponseBody = SubmitExerciseData;
  }

  /**
   * @description Get user's previous submissions for an exercise
   * @tags dbtn/module:lesson_content, dbtn/hasAuth
   * @name get_user_submissions
   * @summary Get User Submissions
   * @request GET:/routes/lesson-content/exercises/{exercise_id}/submissions
   */
  export namespace get_user_submissions {
    export type RequestParams = {
      /** Exercise Id */
      exerciseId: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetUserSubmissionsData;
  }

  /**
   * @description Accepts a user's prompt and streams a response from the AI model. This endpoint is designed for the open-ended prompt playground.
   * @tags stream, dbtn/module:prompt_playground, dbtn/hasAuth
   * @name run_prompt_playground
   * @summary Run Prompt Playground
   * @request POST:/routes/playground
   */
  export namespace run_prompt_playground {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PromptPlaygroundRequest;
    export type RequestHeaders = {};
    export type ResponseBody = RunPromptPlaygroundData;
  }

  /**
   * @description Get practice challenges with optional filtering
   * @tags dbtn/module:practice_playground, dbtn/hasAuth
   * @name get_practice_challenges
   * @summary Get Practice Challenges
   * @request GET:/routes/practice/challenges
   */
  export namespace get_practice_challenges {
    export type RequestParams = {};
    export type RequestQuery = {
      /** Difficulty */
      difficulty?: string | null;
      /** Scenario Type */
      scenario_type?: string | null;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetPracticeChallengesData;
  }

  /**
   * @description Submit a prompt for AI assessment and scoring
   * @tags dbtn/module:practice_playground, dbtn/hasAuth
   * @name submit_prompt
   * @summary Submit Prompt
   * @request POST:/routes/practice/submit
   */
  export namespace submit_prompt {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PromptSubmission;
    export type RequestHeaders = {};
    export type ResponseBody = SubmitPromptData;
  }

  /**
   * @description Get user's practice sessions
   * @tags dbtn/module:practice_playground, dbtn/hasAuth
   * @name get_practice_sessions
   * @summary Get Practice Sessions
   * @request GET:/routes/practice/sessions
   */
  export namespace get_practice_sessions {
    export type RequestParams = {};
    export type RequestQuery = {
      /**
       * Limit
       * @default 20
       */
      limit?: number;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetPracticeSessionsData;
  }

  /**
   * @description Get user's prompt portfolio
   * @tags dbtn/module:practice_playground, dbtn/hasAuth
   * @name get_portfolio
   * @summary Get Portfolio
   * @request GET:/routes/practice/portfolio
   */
  export namespace get_portfolio {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetPortfolioData;
  }

  /**
   * @description Save a practice session to user's portfolio
   * @tags dbtn/module:practice_playground, dbtn/hasAuth
   * @name save_to_portfolio
   * @summary Save To Portfolio
   * @request POST:/routes/practice/portfolio
   */
  export namespace save_to_portfolio {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = SaveToPortfolioRequest;
    export type RequestHeaders = {};
    export type ResponseBody = SaveToPortfolioData;
  }

  /**
   * @description Get user's practice statistics
   * @tags dbtn/module:practice_playground, dbtn/hasAuth
   * @name get_practice_stats
   * @summary Get Practice Stats
   * @request GET:/routes/practice/stats
   */
  export namespace get_practice_stats {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetPracticeStatsData;
  }

  /**
   * @description Get leaderboard for a specific challenge
   * @tags dbtn/module:practice_playground, dbtn/hasAuth
   * @name get_challenge_leaderboard
   * @summary Get Challenge Leaderboard
   * @request GET:/routes/practice/leaderboard/{challenge_id}
   */
  export namespace get_challenge_leaderboard {
    export type RequestParams = {
      /** Challenge Id */
      challengeId: number;
    };
    export type RequestQuery = {
      /**
       * Limit
       * @default 10
       */
      limit?: number;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetChallengeLeaderboardData;
  }

  /**
   * @description Retrieves a list of all available learning roadmaps.
   * @tags dbtn/module:roadmaps, dbtn/hasAuth
   * @name get_all_roadmaps
   * @summary Get All Roadmaps
   * @request GET:/routes/roadmaps/
   */
  export namespace get_all_roadmaps {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetAllRoadmapsData;
  }

  /**
   * @description Gets the active roadmap, progress, and current item for the authenticated user.
   * @tags dbtn/module:roadmaps, dbtn/hasAuth
   * @name get_my_roadmap
   * @summary Get My Roadmap
   * @request GET:/routes/roadmaps/my-roadmap
   */
  export namespace get_my_roadmap {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetMyRoadmapData;
  }

  /**
   * @description Retrieves the details and items for a specific roadmap.
   * @tags dbtn/module:roadmaps, dbtn/hasAuth
   * @name get_roadmap_details
   * @summary Get Roadmap Details
   * @request GET:/routes/roadmaps/{roadmap_id}
   */
  export namespace get_roadmap_details {
    export type RequestParams = {
      /** Roadmap Id */
      roadmapId: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetRoadmapDetailsData;
  }

  /**
   * @description Enrolls the authenticated user in a specific roadmap.
   * @tags dbtn/module:roadmaps, dbtn/hasAuth
   * @name enroll_in_roadmap
   * @summary Enroll In Roadmap
   * @request POST:/routes/roadmaps/{roadmap_id}/enroll
   */
  export namespace enroll_in_roadmap {
    export type RequestParams = {
      /** Roadmap Id */
      roadmapId: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = EnrollInRoadmapData;
  }
}
