
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import brain from 'brain';

const PlaygroundPage = () => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim() || isLoading) return;

    setIsLoading(true);
    setResponse('');
    
    try {
      const stream = brain.run_prompt_playground({ prompt });
      
      for await (const chunk of stream) {
        setResponse(prev => prev + chunk);
      }
      
    } catch (error) {
      console.error('Error during generation:', error);
      setResponse('An error occurred while generating the response. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Prompt Playground
          </h1>
          <p className="text-lg text-gray-600 mt-2">
            Experiment with your own prompts and see the AI's response in real-time.
          </p>
        </header>

        <Card className="shadow-2xl shadow-purple-200/50 border-gray-200/50">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-800">Your Prompt</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., Explain the theory of relativity in simple terms..."
              className="min-h-[150px] text-base border-gray-300 focus:ring-purple-500 focus:border-purple-500"
              disabled={isLoading}
            />
            <Button
              onClick={handleGenerate}
              disabled={isLoading || !prompt.trim()}
              className="mt-4 w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 text-lg transition-all duration-300"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Generate
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {response && (
          <Card className="mt-8 shadow-2xl shadow-blue-200/50 border-gray-200/50">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-800">AI Response</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none prose-p:text-gray-700 prose-li:text-gray-700">
                <ReactMarkdown>{response}</ReactMarkdown>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default PlaygroundPage;
