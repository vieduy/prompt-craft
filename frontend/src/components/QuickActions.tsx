import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Play, Sparkles, Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import type { QuickAction } from 'types';

interface Props {
  actions: QuickAction[];
}

const QuickActions = ({ actions }: Props) => {
  const navigate = useNavigate();

  const handleActionClick = (url: string) => {
    navigate(url);
  };

  const getActionIcon = (type: string) => {
    switch (type) {
      case 'continue_lesson':
        return <Play className="text-blue-500" />;
      case 'start_next':
        return <Sparkles className="text-purple-500" />;
      case 'practice_challenge':
        return <Target className="text-green-500" />;
      default:
        return <Sparkles className="text-yellow-500" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-purple-500" />
          <span>Quick Actions</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="grid sm:grid-cols-2 gap-4">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={() => handleActionClick(action.target_url)}
            className="group p-4 rounded-lg bg-gray-50 hover:bg-gray-100 text-left transition-all duration-300 flex items-start gap-4 transform hover:-translate-y-1"
          >
            <div className="p-2 bg-white rounded-full shadow-sm">
              {getActionIcon(action.action_type)}
            </div>
            <div className="flex-grow">
              <p className="font-semibold">{action.title}</p>
              <p className="text-sm text-gray-600">{action.description}</p>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400 ml-auto self-center group-hover:text-purple-500 transition-colors" />
          </button>
        ))}
      </CardContent>
    </Card>
  );
};

export default QuickActions;
