import { Star } from 'lucide-react';

interface ClassificationHeroNoteProps {
  title: string;
  description: string;
}

export default function ClassificationHeroNote({
  title,
  description,
}: ClassificationHeroNoteProps) {
  return (
    <div className="classification-hero-note">
      <div className="classification-hero-note-stars" aria-hidden="true">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star key={star} size={18} strokeWidth={1.4} />
        ))}
      </div>
      <p className="classification-hero-note-title">{title}</p>
      <p className="classification-hero-note-description">{description}</p>
    </div>
  );
}
