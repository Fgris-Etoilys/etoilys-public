export type ArticleAuthorId = keyof typeof ARTICLE_AUTHORS;

export interface ArticleAuthor {
  id: ArticleAuthorId;
  name: string;
  initials: string;
  bio: string;
  imageSrc: string;
  imageAlt: string;
  structuredDataId: string;
}

export const ARTICLE_AUTHORS = {
  'florian-grisorio': {
    id: 'florian-grisorio',
    name: 'Florian Grisorio',
    initials: 'FG',
    bio: 'Président d’Etoilys, organisme accrédité par le Cofrac pour le classement des meublés de tourisme. Il supervise la veille réglementaire et la rédaction des contenus publiés sur le site.',
    imageSrc: '/images/authors/florian-grisorio.jpg',
    imageAlt: 'Florian Grisorio',
    structuredDataId: '#person-florian-grisorio',
  },
} as const satisfies Record<
  string,
  {
    id: string;
    name: string;
    initials: string;
    bio: string;
    imageSrc: string;
    imageAlt: string;
    structuredDataId: string;
  }
>;

export function getArticleAuthor(authorId: ArticleAuthorId): ArticleAuthor {
  return ARTICLE_AUTHORS[authorId];
}
