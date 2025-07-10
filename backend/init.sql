-- Prompt Craft Database Schema
-- This file initializes all tables needed for the prompt-craft application

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Categories table
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    icon VARCHAR(100),
    color VARCHAR(50),
    difficulty_level VARCHAR(50),
    order_index INTEGER DEFAULT 0,
    lesson_count INTEGER DEFAULT 0,
    completed_lessons INTEGER DEFAULT 0,
    progress_percentage DECIMAL(5,2) DEFAULT 0.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Users table to store profile information from Stack Auth
CREATE TABLE users (
    id VARCHAR(255) PRIMARY KEY, -- This will be the user.sub from JWT
    name VARCHAR(255),
    email VARCHAR(255),
    picture_url TEXT,
    first_seen_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_seen_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Lessons table
CREATE TABLE lessons (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
    difficulty_level VARCHAR(50),
    estimated_duration INTEGER, -- in minutes
    preview_content TEXT,
    learning_objectives JSONB,
    workplace_scenario TEXT,
    order_index INTEGER NOT NULL DEFAULT 0,
    is_published BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Roadmaps table
CREATE TABLE roadmaps (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    target_audience VARCHAR(255),
    icon VARCHAR(100),
    estimated_duration_weeks INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Roadmap items table
CREATE TABLE roadmap_items (
    id SERIAL PRIMARY KEY,
    roadmap_id INTEGER REFERENCES roadmaps(id) ON DELETE CASCADE,
    item_type VARCHAR(50) NOT NULL, -- 'lesson', 'category', etc.
    item_id INTEGER NOT NULL,
    order_index INTEGER NOT NULL DEFAULT 0,
    title VARCHAR(255),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Achievements table
CREATE TABLE achievements (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    icon VARCHAR(100),
    reward_points INTEGER DEFAULT 0,
    criteria JSONB, -- Store achievement criteria
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- User progress table
CREATE TABLE user_progress (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    lesson_id INTEGER REFERENCES lessons(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'not_started', -- 'not_started', 'in_progress', 'completed'
    progress_percentage INTEGER DEFAULT 0,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    last_accessed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, lesson_id)
);

-- User roadmaps table
CREATE TABLE user_roadmaps (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    roadmap_id INTEGER REFERENCES roadmaps(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'in_progress', -- 'in_progress', 'completed', 'paused'
    started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE,
    current_item_id INTEGER REFERENCES roadmap_items(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, roadmap_id)
);

-- User achievements table
CREATE TABLE user_achievements (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    achievement_id INTEGER REFERENCES achievements(id) ON DELETE CASCADE,
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, achievement_id)
);

-- User bookmarks table
CREATE TABLE user_bookmarks (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    lesson_id INTEGER REFERENCES lessons(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, lesson_id)
);

-- User engagement table
CREATE TABLE user_engagement (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    lesson_id INTEGER REFERENCES lessons(id) ON DELETE CASCADE,
    action VARCHAR(100) NOT NULL, -- 'view', 'start', 'complete', 'preview', etc.
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Practice challenges table
CREATE TABLE practice_challenges (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    scenario_type VARCHAR(100), -- 'email', 'content_creation', 'analysis', etc.
    difficulty_level VARCHAR(50),
    context TEXT NOT NULL, -- The context/scenario for the challenge
    target_outcome TEXT NOT NULL, -- What the prompt should achieve
    template_prompt TEXT, -- Optional template prompt
    scoring_criteria JSONB NOT NULL, -- JSON object with scoring criteria
    max_score INTEGER DEFAULT 100,
    time_limit_minutes INTEGER,
    prompt_text TEXT, -- Legacy field for backward compatibility
    category VARCHAR(100),
    tags TEXT[],
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Practice sessions table
CREATE TABLE practice_sessions (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    challenge_id INTEGER REFERENCES practice_challenges(id) ON DELETE CASCADE,
    user_prompt TEXT NOT NULL, -- The user's submitted prompt
    feedback TEXT, -- AI feedback/assessment
    total_score INTEGER, -- Total score for the submission
    scoring_breakdown JSONB, -- Detailed scoring breakdown
    improvement_suggestions JSONB, -- List of improvement suggestions
    session_duration_seconds INTEGER, -- Time spent on the session
    -- Legacy fields for backward compatibility
    prompt_text TEXT,
    ai_response TEXT,
    score INTEGER,
    practice_time_minutes INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Practice stats table
CREATE TABLE practice_stats (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL UNIQUE,
    total_sessions INTEGER DEFAULT 0,
    average_score DECIMAL(5,2) DEFAULT 0.0,
    best_score INTEGER DEFAULT 0,
    total_practice_time_minutes INTEGER DEFAULT 0,
    current_streak_days INTEGER DEFAULT 0,
    challenges_completed INTEGER DEFAULT 0,
    prompts_saved INTEGER DEFAULT 0,
    last_practice_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Portfolio items table
CREATE TABLE portfolio_items (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    prompt_text TEXT NOT NULL,
    ai_response TEXT,
    score INTEGER,
    tags TEXT[],
    is_favorite BOOLEAN DEFAULT false,
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Prompt portfolio table (for saving practice prompts)
CREATE TABLE prompt_portfolio (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    session_id INTEGER REFERENCES practice_sessions(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    prompt_text TEXT NOT NULL,
    ai_response TEXT,
    score INTEGER,
    tags TEXT[],
    is_favorite BOOLEAN DEFAULT false,
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Learning streaks table
CREATE TABLE learning_streaks (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL UNIQUE,
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    streak_goal INTEGER DEFAULT 7,
    last_activity_date DATE,
    days_this_week BOOLEAN[7] DEFAULT ARRAY[false, false, false, false, false, false, false],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Leaderboard entries table
CREATE TABLE leaderboard_entries (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    challenge_id INTEGER REFERENCES practice_challenges(id) ON DELETE CASCADE,
    session_id INTEGER REFERENCES practice_sessions(id) ON DELETE CASCADE,
    score INTEGER,
    achieved_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Lesson content table
CREATE TABLE lesson_content (
    id SERIAL PRIMARY KEY,
    lesson_id INTEGER REFERENCES lessons(id) ON DELETE CASCADE,
    section_type VARCHAR(50) NOT NULL, -- 'introduction', 'content', 'practice_exercise', 'summary', etc.
    order_index INTEGER NOT NULL DEFAULT 0,
    title VARCHAR(255),
    content JSONB, -- Store structured content as JSON
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- User progress content table (tracks progress on individual lesson content sections)
CREATE TABLE user_progress_content (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    lesson_content_id INTEGER REFERENCES lesson_content(id) ON DELETE CASCADE,
    is_completed BOOLEAN DEFAULT false,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, lesson_content_id)
);

-- Submissions table (for practice exercise submissions)
CREATE TABLE submissions (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    lesson_id INTEGER REFERENCES lessons(id) ON DELETE CASCADE,
    lesson_content_id INTEGER REFERENCES lesson_content(id) ON DELETE CASCADE,
    submitted_prompt TEXT NOT NULL,
    score INTEGER,
    feedback TEXT,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_lessons_category_id ON lessons(category_id);
CREATE INDEX idx_lessons_order_index ON lessons(order_index);
CREATE INDEX idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX idx_user_progress_lesson_id ON user_progress(lesson_id);
CREATE INDEX idx_user_progress_status ON user_progress(status);
CREATE INDEX idx_user_engagement_user_id ON user_engagement(user_id);
CREATE INDEX idx_user_engagement_lesson_id ON user_engagement(lesson_id);
CREATE INDEX idx_practice_sessions_user_id ON practice_sessions(user_id);
CREATE INDEX idx_practice_sessions_challenge_id ON practice_sessions(challenge_id);
CREATE INDEX idx_portfolio_items_user_id ON portfolio_items(user_id);
CREATE INDEX idx_users_id ON users(id);
CREATE INDEX idx_leaderboard_entries_user_id ON leaderboard_entries(user_id);
CREATE INDEX idx_leaderboard_entries_challenge_id ON leaderboard_entries(challenge_id);
CREATE INDEX idx_leaderboard_entries_score ON leaderboard_entries(score DESC);

-- Indexes for new tables
CREATE INDEX idx_lesson_content_lesson_id ON lesson_content(lesson_id);
CREATE INDEX idx_lesson_content_order_index ON lesson_content(order_index);
CREATE INDEX idx_user_progress_content_user_id ON user_progress_content(user_id);
CREATE INDEX idx_user_progress_content_lesson_content_id ON user_progress_content(lesson_content_id);
CREATE INDEX idx_submissions_user_id ON submissions(user_id);
CREATE INDEX idx_submissions_lesson_id ON submissions(lesson_id);
CREATE INDEX idx_submissions_lesson_content_id ON submissions(lesson_content_id);
CREATE INDEX idx_prompt_portfolio_user_id ON prompt_portfolio(user_id);
CREATE INDEX idx_prompt_portfolio_session_id ON prompt_portfolio(session_id);

-- Insert sample data for categories
INSERT INTO categories (name, description, icon, color, difficulty_level, order_index) VALUES
('Prompt Engineering Fundamentals', 'Learn the basics of crafting effective prompts', '🎯', '#3B82F6', 'beginner', 1),
('Advanced Techniques', 'Master advanced prompt engineering strategies', '🚀', '#10B981', 'intermediate', 2),
('Real-world Applications', 'Apply prompt engineering to practical scenarios', '💼', '#F59E0B', 'advanced', 3),
('AI Model Understanding', 'Deep dive into how different AI models work', '🧠', '#8B5CF6', 'intermediate', 4),
('Ethics and Best Practices', 'Learn responsible AI usage and ethical considerations', '⚖️', '#EF4444', 'beginner', 5);

-- Insert sample achievements
INSERT INTO achievements (name, description, icon, reward_points) VALUES
('First Steps', 'Complete your first lesson', '🎉', 10),
('Quick Learner', 'Complete 5 lessons', '⚡', 25),
('Preview Master', 'Preview 10 lessons', '👁️', 15),
('Bookworm', 'Bookmark 15 lessons', '📚', 20),
('AI Apprentice', 'Complete 10 lessons', '🎓', 50),
('AI Master', 'Explore 5 categories', '👑', 100),
('Practice Champion', 'Complete 20 practice sessions', '🏆', 75),
('Streak Master', 'Maintain a 7-day learning streak', '🔥', 30);

-- Insert sample lessons
INSERT INTO lessons (title, description, category_id, difficulty_level, estimated_duration, preview_content, learning_objectives, workplace_scenario, order_index, is_published) VALUES
('Introduction to Prompts', 'Learn what prompts are and why they matter', 1, 'beginner', 15, 'Discover the fundamental concepts of prompt engineering...', '["Understand what prompts are", "Learn why prompt engineering matters", "Identify basic prompt components"]', 'You are a marketing assistant who needs to write compelling product descriptions...', 1, true),
('Writing Clear Instructions', 'Master the art of writing clear, specific instructions', 1, 'beginner', 20, 'Learn how to write instructions that AI can understand...', '["Write clear and specific instructions", "Avoid ambiguous language", "Use proper formatting"]', 'You need to create a customer service response template...', 2, true),
('Context and Examples', 'Learn how to provide context and examples in prompts', 2, 'intermediate', 25, 'Discover how context and examples improve AI responses...', '["Provide relevant context", "Use examples effectively", "Structure prompts with context"]', 'You are creating a training manual for new employees...', 1, true),
('Advanced Prompt Patterns', 'Explore advanced patterns for complex tasks', 2, 'intermediate', 30, 'Learn sophisticated prompt patterns for complex scenarios...', '["Use chain-of-thought prompting", "Implement few-shot learning", "Apply role-based prompting"]', 'You need to analyze customer feedback and generate insights...', 2, true),
('Real-world Prompt Engineering', 'Apply your skills to real business scenarios', 3, 'advanced', 35, 'Put your prompt engineering skills to work in real scenarios...', '["Apply prompts to business problems", "Optimize for specific outcomes", "Measure prompt effectiveness"]', 'You are a business analyst creating reports for stakeholders...', 1, true);

-- Insert sample roadmaps
INSERT INTO roadmaps (title, description, target_audience, icon, estimated_duration_weeks) VALUES
('Prompt Engineering Mastery', 'Complete journey from beginner to advanced prompt engineer', 'Beginners to Intermediate', '🎯', 8),
('Business Applications', 'Learn to apply prompt engineering in business contexts', 'Business Professionals', '💼', 6),
('AI Model Specialist', 'Deep dive into working with different AI models', 'Technical Users', '🧠', 10);

-- Insert sample roadmap items
INSERT INTO roadmap_items (roadmap_id, item_type, item_id, order_index, title, description) VALUES
(1, 'lesson', 1, 1, 'Introduction to Prompts', 'Start with the basics'),
(1, 'lesson', 2, 2, 'Writing Clear Instructions', 'Learn fundamental techniques'),
(1, 'lesson', 3, 3, 'Context and Examples', 'Build on your foundation'),
(1, 'lesson', 4, 4, 'Advanced Prompt Patterns', 'Master advanced techniques'),
(1, 'lesson', 5, 5, 'Real-world Prompt Engineering', 'Apply your skills');

-- Insert sample practice challenges
INSERT INTO practice_challenges (title, description, scenario_type, difficulty_level, context, target_outcome, template_prompt, scoring_criteria, max_score, time_limit_minutes, prompt_text, category, tags) VALUES
('Email Writing', 'Write a professional email prompt', 'email', 'beginner', 
 'You are a marketing assistant who needs to write compelling product descriptions for your company website. The products range from tech gadgets to home appliances.', 
 'Create a prompt that generates professional, persuasive product descriptions that convert browsers into buyers',
 'Write a product description for [PRODUCT_NAME] that highlights its key features and benefits...',
 '{"clarity": {"max_score": 25, "description": "How clear and specific are the instructions?"}, "relevance": {"max_score": 25, "description": "How well does it address the marketing context?"}, "structure": {"max_score": 25, "description": "Is the prompt well-structured and easy to follow?"}, "effectiveness": {"max_score": 25, "description": "How likely is this prompt to produce the desired outcome?"}}',
 100, 15, 'Write a prompt that helps create professional business emails', 'Communication', ARRAY['email', 'business', 'professional']),

('Content Creation', 'Create engaging social media content', 'content_creation', 'intermediate', 
 'You are a social media manager for a tech startup. You need to create engaging posts that showcase your product features while building community engagement.',
 'Generate a prompt that creates viral-worthy social media content that balances product promotion with authentic engagement',
 'Create a social media post about [TOPIC] that will engage our tech-savvy audience...',
 '{"creativity": {"max_score": 30, "description": "How creative and engaging is the prompt approach?"}, "audience_targeting": {"max_score": 25, "description": "How well does it target the specific audience?"}, "call_to_action": {"max_score": 25, "description": "Does it include effective engagement mechanisms?"}, "brand_alignment": {"max_score": 20, "description": "How well does it align with brand voice?"}}',
 100, 20, 'Write a prompt for generating engaging social media posts', 'Marketing', ARRAY['social media', 'content', 'marketing']),

('Data Analysis', 'Analyze customer feedback', 'analysis', 'advanced', 
 'You are a business analyst at a SaaS company. You have access to hundreds of customer feedback responses and need to extract actionable insights to improve the product.',
 'Create a comprehensive prompt that analyzes customer feedback to identify trends, sentiment, and specific improvement opportunities',
 'Analyze the following customer feedback data and provide insights on [ANALYSIS_FOCUS]...',
 '{"analytical_depth": {"max_score": 30, "description": "How thorough and detailed is the analysis approach?"}, "actionability": {"max_score": 25, "description": "How actionable are the insights it will generate?"}, "methodology": {"max_score": 25, "description": "Does it use sound analytical methods?"}, "presentation": {"max_score": 20, "description": "How well-structured is the output format?"}}',
 100, 30, 'Create a prompt to analyze customer feedback and extract insights', 'Analytics', ARRAY['analysis', 'feedback', 'insights']);

-- Insert sample leaderboard entries
INSERT INTO leaderboard_entries (user_id, challenge_id, session_id, score, achieved_at) VALUES
('user-001', 1, 1, 95, CURRENT_TIMESTAMP - INTERVAL '2 days'),
('user-002', 1, 2, 88, CURRENT_TIMESTAMP - INTERVAL '1 day'),
('user-003', 1, 3, 92, CURRENT_TIMESTAMP - INTERVAL '12 hours'),
('user-004', 1, 4, 85, CURRENT_TIMESTAMP - INTERVAL '6 hours'),
('user-005', 1, 5, 90, CURRENT_TIMESTAMP - INTERVAL '3 hours'),
('user-001', 2, 6, 87, CURRENT_TIMESTAMP - INTERVAL '1 day'),
('user-002', 2, 7, 93, CURRENT_TIMESTAMP - INTERVAL '8 hours'),
('user-003', 2, 8, 89, CURRENT_TIMESTAMP - INTERVAL '4 hours'),
('user-004', 2, 9, 91, CURRENT_TIMESTAMP - INTERVAL '2 hours'),
('user-005', 2, 10, 86, CURRENT_TIMESTAMP - INTERVAL '1 hour'),
('user-001', 3, 11, 94, CURRENT_TIMESTAMP - INTERVAL '3 days'),
('user-002', 3, 12, 89, CURRENT_TIMESTAMP - INTERVAL '2 days'),
('user-003', 3, 13, 78, CURRENT_TIMESTAMP - INTERVAL '4 hours'),
('user-004', 3, 14, 84, CURRENT_TIMESTAMP - INTERVAL '2 hours'),
('user-005', 3, 15, 89, CURRENT_TIMESTAMP - INTERVAL '1 hour');

-- Insert sample lesson content
INSERT INTO lesson_content (lesson_id, section_type, order_index, title, content) VALUES
-- Lesson 1: Introduction to Prompts
(1, 'introduction', 1, 'What Are Prompts?', '{"type": "text", "content": "A prompt is the input you give to an AI model to get a specific output. Think of it as giving instructions to a very capable assistant who can help you with various tasks.", "key_points": ["Prompts are instructions for AI models", "Quality of prompts affects quality of outputs", "Prompts can be simple or complex"]}'),
(1, 'content', 2, 'Why Prompt Engineering Matters', '{"type": "text", "content": "Good prompt engineering can mean the difference between getting exactly what you need and getting something completely off-target. In business contexts, this translates directly to productivity and results.", "examples": ["Poor prompt: Write something about our product", "Good prompt: Write a compelling 100-word product description highlighting the energy efficiency and modern design of our smart thermostat for eco-conscious homeowners"]}'),
(1, 'practice_exercise', 3, 'Your First Prompt', '{"type": "exercise", "scenario": "You work for a coffee shop and need to write a social media post about your new seasonal drink.", "task": "Write a prompt that would generate an engaging social media post about the new autumn spice latte.", "guidelines": ["Be specific about the tone", "Include the target audience", "Mention key details about the drink"]}'),
(1, 'summary', 4, 'Key Takeaways', '{"type": "summary", "points": ["Prompts are instructions that guide AI output", "Specificity leads to better results", "Context helps AI understand your needs", "Practice makes perfect"]}'),

-- Lesson 2: Writing Clear Instructions  
(2, 'introduction', 1, 'The Power of Clarity', '{"type": "text", "content": "Clear instructions are the foundation of effective prompt engineering. Ambiguous prompts lead to unpredictable results, while clear prompts consistently deliver what you need.", "analogy": "Think of prompts like giving directions to a friend - the clearer you are, the more likely they are to arrive at the right destination."}'),
(2, 'content', 2, 'Elements of Clear Instructions', '{"type": "text", "content": "Clear instructions should specify: WHO (the role/persona), WHAT (the task), HOW (the style/format), and FOR WHOM (the audience).", "framework": {"who": "Define the AI role or persona", "what": "Specify the exact task", "how": "Describe the style and format", "for_whom": "Identify the target audience"}}'),
(2, 'practice_exercise', 3, 'Improve This Prompt', '{"type": "exercise", "scenario": "A colleague gives you this vague prompt: Make it sound better", "task": "Rewrite this as a clear, specific prompt for improving a customer service email response.", "original_prompt": "Make it sound better", "context": "The email is responding to a customer complaint about a delayed shipment"}'),
(2, 'summary', 4, 'Clarity Checklist', '{"type": "checklist", "items": ["Did I specify the role/persona?", "Is the task clearly defined?", "Have I mentioned the desired format?", "Is the target audience clear?", "Would someone else understand this prompt?"]}');

-- Add some achievements criteria data
UPDATE achievements SET criteria = '{"type": "lessons_completed", "target": 1}' WHERE id = 1;
UPDATE achievements SET criteria = '{"type": "lessons_completed", "target": 5}' WHERE id = 2;
UPDATE achievements SET criteria = '{"type": "lesson_previews", "target": 10}' WHERE id = 3;
UPDATE achievements SET criteria = '{"type": "bookmarks", "target": 15}' WHERE id = 4;
UPDATE achievements SET criteria = '{"type": "lessons_completed", "target": 10}' WHERE id = 5;
UPDATE achievements SET criteria = '{"type": "categories_explored", "target": 5}' WHERE id = 6;
UPDATE achievements SET criteria = '{"type": "practice_sessions", "target": 20}' WHERE id = 7;
UPDATE achievements SET criteria = '{"type": "learning_streak", "target": 7}' WHERE id = 8;

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at columns
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_lessons_updated_at BEFORE UPDATE ON lessons FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_roadmaps_updated_at BEFORE UPDATE ON roadmaps FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_progress_updated_at BEFORE UPDATE ON user_progress FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_roadmaps_updated_at BEFORE UPDATE ON user_roadmaps FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_practice_stats_updated_at BEFORE UPDATE ON practice_stats FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_portfolio_items_updated_at BEFORE UPDATE ON portfolio_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_learning_streaks_updated_at BEFORE UPDATE ON learning_streaks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column(); 