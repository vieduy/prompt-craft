import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Rocket, CheckCircle2, XCircle, RefreshCw } from 'lucide-react';
import brain from 'brain';
import type { SubmissionResult } from "types";
import { toast } from 'sonner';

interface Props {
  exercise: {
    id: number;
    lesson_id: number;
    title: string;
    content: {
      scenario: string;
    }
  };
  onExerciseComplete: (exerciseId: number) => void;
}

type SubmissionState = 'idle' | 'submitting' | 'submitted';

type SubmissionResultDisplay = {
  score: number;
  feedback: string;
  is_correct: boolean;
};

const PracticeExercise: React.FC<Props> = ({ exercise, onExerciseComplete }) => {
  const [prompt, setPrompt] = useState('');
  const [submissionState, setSubmissionState] = useState<SubmissionState>('idle');
  const [lastResult, setLastResult] = useState<SubmissionResultDisplay | null>(null);

  const handleSubmit = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt before submitting.');
      return;
    }

    setSubmissionState('submitting');
    try {
      const response = await brain.submit_exercise({
        lesson_id: exercise.lesson_id,
        lesson_content_id: exercise.id,
        submitted_prompt: prompt,
      });
      // console.log(response)
      const result: SubmissionResult = await response.json();
      const is_correct = result.score >= 80;

      setLastResult({ ...result, is_correct });
      setSubmissionState('submitted');

      if (is_correct) {
        toast.success("Excellent! You've mastered this exercise.");
        onExerciseComplete(exercise.id);
      } else {
        toast.warning('Not quite there yet. Review the feedback and try again!');
      }

    } catch (error) {
      console.error("Failed to submit exercise:", error);
      toast.error('There was an error submitting your answer. Please try again.');
      setSubmissionState('idle');
    }
  };

  const handleReset = () => {
    setPrompt('');
    setSubmissionState('idle');
    setLastResult(null);
  }

  const isCompleted = lastResult?.is_correct ?? false;

  return (
    <Card className="bg-white/60 backdrop-blur-sm border-gray-200/50 shadow-lg transition-all duration-500">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-2xl text-purple-800 font-extrabold">
          <div className="flex items-center gap-3">
            <Rocket className="h-6 w-6" />
            {exercise.title}
          </div>
          {isCompleted && <CheckCircle2 className="h-8 w-8 text-green-400" />}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-900 mb-6">{exercise.content.scenario}</p>

        {submissionState === 'submitted' && lastResult && (
          <div className="mt-4 space-y-4">
            <div className={`p-4 rounded-lg ${lastResult.is_correct ? 'bg-green-100' : 'bg-red-100'}`}>
              <h4 className={`font-bold flex items-center gap-2 ${lastResult.is_correct ? 'text-green-800' : 'text-red-800'}`}>
                {lastResult.is_correct ? <CheckCircle2 /> : <XCircle />}
                Score: {lastResult.score} / 100
              </h4>
              <p className={`mt-2 ${lastResult.is_correct ? 'text-green-700' : 'text-red-700'}`}>
                {lastResult.feedback}
              </p>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Craft your prompt here..."
            className="bg-white border-gray-300 text-gray-900 min-h-[150px] text-base"
            disabled={submissionState !== 'idle' || isCompleted}
          />
          {isCompleted ? (
            <div className="text-center p-4 bg-green-100 rounded-lg">
              <p className="text-green-700 font-semibold">Exercise completed successfully!</p>
            </div>
          ) : submissionState === 'submitted' ? (
            <Button
              onClick={handleReset}
              className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 text-white hover:opacity-90 transition-all duration-300 flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={submissionState === 'submitting'}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:opacity-90 transition-all duration-300"
            >
              {submissionState === 'submitting' ? 'Submitting...' : 'Submit for Feedback'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PracticeExercise;


