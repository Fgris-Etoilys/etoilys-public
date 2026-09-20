import { Star } from 'lucide-react';

interface ClassificationHeroNoteProps {
  lead: string;
  title: string;
  caption: string;
}

export default function ClassificationHeroNote({
  lead,
  title,
  caption,
}: ClassificationHeroNoteProps) {
  return (
    <div className="classification-hero-note">
      <div className="classification-hero-note-stars" aria-hidden="true">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star key={star} size={18} strokeWidth={1.4} />
        ))}
      </div>
      <p className="classification-hero-note-copy">
        {lead}
        <br />
        <strong>{title}</strong>
      </p>
      <p className="classification-hero-note-caption">{caption}</p>
    </div>
  );
}
