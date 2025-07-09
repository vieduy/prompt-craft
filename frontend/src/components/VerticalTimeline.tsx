import React from 'react';
import { CheckCircle, RadioButton } from 'lucide-react';
import { cn } from '@/lib/utils';

type Section = {
  id: string;
  title: string;
  icon: React.ReactNode;
};

interface VerticalTimelineProps {
  sections: Section[];
  completedSections: Set<string>;
  currentSection: string;
  onSectionClick: (sectionId: string) => void;
}

const VerticalTimeline: React.FC<VerticalTimelineProps> = ({
  sections,
  completedSections,
  currentSection,
  onSectionClick,
}) => {
  return (
    <div className="relative">
      <ul className="space-y-8">
        {sections.map(section => {
          const isCompleted = completedSections.has(section.id);
          const isCurrent = currentSection === section.id;

          return (
            <li key={section.id} className="relative">
              <button
                onClick={() => onSectionClick(section.id)}
                className="w-full flex items-center gap-4 text-left"
              >
                <div className="relative z-10 flex-shrink-0">
                  <div
                    className={cn(
                      'w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300',
                      isCompleted
                        ? 'bg-green-500'
                        : isCurrent
                        ? 'bg-blue-500 ring-4 ring-blue-200'
                        : 'bg-gray-300',
                    )}
                  >
                    {isCompleted ? (
                      <CheckCircle className="w-6 h-6 text-white" />
                    ) : (
                      <div className="text-white">{section.icon}</div>
                    )}
                  </div>
                </div>
                <div className="flex-grow">
                  <h4
                    className={cn(
                      'font-semibold transition-colors duration-300',
                      isCurrent ? 'text-blue-600' : 'text-gray-700',
                    )}
                  >
                    {section.title}
                  </h4>
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default VerticalTimeline;
