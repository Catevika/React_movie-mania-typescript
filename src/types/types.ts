export type Genres = {
  id?: number;
  name?: string;
};

export type ProdComp = {
  id?: number;
  logo_path?: string | null;
  name?: string;
  origin_country?: string;
};

export type ProdCountry = {
  iso_3166_1?: string;
  name?: string;
};

export type spokenLanguages = {
  english_name?: string;
  iso_639_1?: string;
  name?: string;
};

export type TMovie = {
  adult?: boolean;
  backdrop_path?: string | null;
  genre_ids?: object;
  id?: number;
  original_language?: string;
  original_title?: string;
  overview?: string | null;
  popularity?: number;
  poster_path?: string | null;
  release_date?: string;
  title?: string;
  video?: boolean;
  vote_average?: number;
  vote_count?: number;
};

export type TMovies = {
  page: number;
  results: TMovie[];
  total_pages: number;
  total_results: number;
};

export type TMovieVideo = {
  key?: string | undefined;
  name?: string;
};

export type TMovieDetails = {
  adult?: boolean;
  backdrop_path?: string;
  belongs_to_collection?: {
    id?: number;
    name?: string;
    poster_path?: string;
    backdrop_path?: string;
  };
  budget?: number;
  genres?: Genres[];
  homepage?: string;
  id?: number;
  imdb_id?: string;
  original_language?: string;
  original_title?: string;
  overview?: string | null;
  popularity?: number;
  poster_path?: string;
  production_companies?: ProdComp[];
  production_countries?: ProdCountry[];
  release_date?: string;
  revenue?: number;
  runtime?: number;
  spoken_languages?: spokenLanguages[];
  status?: string;
  tagline?: string | null;
  title?: string;
  video?: boolean,
  vote_average?: number;
  vote_count?: number;
};


