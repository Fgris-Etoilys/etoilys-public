import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

export function renderLocalMarkdownLinks(text: string): ReactNode {
  const linkPattern = /\[([^\]]+)\]\((\/[^)]+)\)/g;
  const parts: ReactNode[] = [];
  let lastIndex = 0;
  let match = linkPattern.exec(text);

  while (match !== null) {
    const [rawMatch, label, href] = match;

    if (label === undefined || href === undefined) {
      match = linkPattern.exec(text);
      continue;
    }

    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    parts.push(
      <Link
        key={`${href}-${match.index}`}
        to={href}
        className="font-medium text-primary-300 underline underline-offset-4 hover:text-primary-400"
      >
        {label}
      </Link>
    );

    lastIndex = match.index + rawMatch.length;
    match = linkPattern.exec(text);
  }

  if (parts.length === 0) {
    return text;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return <>{parts}</>;
}
