export const Genres = {
  horror: 'horror',
  adventure: 'adventure',
  political: 'political',
  fantasy: 'fantasy',
} as const;

export type Genres = (typeof Genres)[keyof typeof Genres];
