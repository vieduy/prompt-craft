import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PlayCircle } from 'lucide-react';
import type { Lesson } from 'types';

interface Props {
  lesson: Lesson;
}

const CinematicLessonCard = ({ lesson }: Props) => {
  return (
    <div className="relative rounded-xl overflow-hidden group">
      <img
        src={lesson.thumbnail_url || 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f'}
        alt={lesson.title}
        className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
      <div className="absolute bottom-0 left-0 p-4 text-white">
        <h3 className="text-lg font-bold">{lesson.title}</h3>
        <p className="text-sm opacity-80">{lesson.category}</p>
      </div>
      <Link to={`/lessons/${lesson.id}`} className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <Button size="icon" variant="secondary" className="rounded-full h-14 w-14">
          <PlayCircle className="h-8 w-8" />
        </Button>
      </Link>
    </div>
  );
};

export default CinematicLessonCard;
