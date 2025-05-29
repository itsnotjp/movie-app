export interface Media {
  media_type: MediaType;

  id: number;
  adult: boolean;

  title: string;
  name: string;
  original_title: string;
  original_name: string;

  overview: string;

  poster_path: string;
  backdrop_path: string;

  original_language: string;
  genre_ids: number[];
  genres: Genres[]; 

  release_date: string;
  first_air_date: string;
  number_of_episodes: number;
  number_of_seasons: number;

  production_companies: ProductionCountries[];


  vote_average: number;
  status: string;
  credits?: Credits;
  videos?: any;
  similar?: any;
  
}

export interface Cast {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

export interface Credits {
  cast: Cast[];
  crew: any[];
}

export interface Genres {
  id: number;
  name: string;
}

export interface ProductionCountries {
  id: number;
  logo_path: string;
  name: string;
  origin_country: string;
}





export interface MediaResponse {
  page: number;
  results: Media[];
  total_pages: number;
  total_results: number;
}

export interface MediaFilter {
  label: string;
  value: CategoryType;
}

export const MOVIE_CATEGORIES = {
  popular: 'Popular',
  top_rated: 'Top Rated',
  upcoming: 'Upcoming',
  now_playing: 'Now Playing',
} as const;
export type MovieCategory = keyof typeof MOVIE_CATEGORIES;

export const TV_CATEGORIES = {
  airing_today: 'Airing Today',
  popular: 'Popular',
  top_rated: 'Top Rated'
} as const;
export type TVCategory = keyof typeof TV_CATEGORIES;


export type MediaType = 'movie' | 'tv' | 'trending';
export type TrendingType = 'movie' | 'tv' | 'all';
export type TimeWindow = 'day' | 'week';
export type CategoryType = MovieCategory | TVCategory ;