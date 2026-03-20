import { z } from "zod";

const Configuration = z.object({
  images: z.object({
    base_url: z.httpUrl(),
    secure_base_url: z.httpUrl(),
    backdrop_sizes: z.string().array(),
    logo_sizes: z.string().array(),
    poster_sizes: z.string().array(),
    profile_sizes: z.string().array(),
    still_sizes: z.string().array(),
  }),
});
export type Configuration = z.infer<typeof Configuration>;

const Person = z.object({
  adult: z.boolean(),
  also_known_as: z.string().array(),
  biography: z.string().nullable(),
  birthday: z.string().nullable(),
  deathday: z.string().nullable(),
  gender: z.number().int(),
  homepage: z.string().nullable(),
  id: z.number().int(),
  imdb_id: z.string().nullable(),
  known_for_department: z.string().nullable(),
  name: z.string(),
  place_of_birth: z.string().nullable(),
  popularity: z.number().nullable(),
  profile_path: z.string().nullable(),
});
export type Person = z.infer<typeof Person>;

const MovieCreditCastEntry = z.object({
  id: z.number().int(),
  title: z.string(),
  original_title: z.string(),
  character: z.string(),
  release_date: z.string(),
  poster_path: z.string().nullable(),
  vote_average: z.number(),
});
export type MovieCreditCastEntry = z.infer<typeof MovieCreditCastEntry>;

const MovieCredits = z.object({
  id: z.number().int(),
  cast: MovieCreditCastEntry.array(),
});
export type MovieCredits = z.infer<typeof MovieCredits>;

const MovieListItem = z.object({
  id: z.number().int(),
  media_type: z.string().optional(),
  title: z.string(),
  original_title: z.string(),
  overview: z.string(),
  release_date: z.string().nullable().optional(),
  poster_path: z.string().nullable(),
});
export type MovieListItem = z.infer<typeof MovieListItem>;

const MovieList = z.object({
  id: z.union([z.string(), z.number().int()]).transform(String),
  items: MovieListItem.array(),
  item_count: z.number().int(),
  name: z.string(),
  page: z.number().int().optional(),
  total_pages: z.number().int().optional(),
});
export type MovieList = z.infer<typeof MovieList>;

const baseUrl = "https://api.themoviedb.org";

function getHeaders() {
  if (!import.meta.env.TMDB_API_TOKEN)
    throw new Error("Missing TMDB API token");

  return new Headers({
    Authorization: `Bearer ${import.meta.env.TMDB_API_TOKEN}`,
    Accept: "application/json",
  });
}

export async function getConfiguration(): Promise<Configuration> {
  const response = await fetch(`${baseUrl}/3/configuration`, {
    headers: getHeaders(),
  });

  if (!response.ok)
    throw new Error(`Configuration fetch failed: ${await response.text()}`);

  return Configuration.parse(await response.json());
}

export async function getPerson(id: number, language: string): Promise<Person> {
  const url = `${baseUrl}/3/person/${id}?language=${language}`;

  const response = await fetch(url, {
    headers: getHeaders(),
  });

  if (!response.ok)
    throw new Error(`Actor fetch failed: ${await response.text()}`);

  return Person.parse(await response.json());
}

const PersonImages = z.object({
  profiles: z.array(
    z.object({
      file_path: z.string(),
      width: z.number().int(),
      height: z.number().int(),
    }),
  ),
});
export type PersonImages = z.infer<typeof PersonImages>;

export async function getPersonImages(id: number): Promise<PersonImages> {
  const url = `${baseUrl}/3/person/${id}/images`;
  const response = await fetch(url, { headers: getHeaders() });
  if (!response.ok)
    throw new Error(`Person images fetch failed: ${await response.text()}`);
  return PersonImages.parse(await response.json());
}

export async function getPersonMovieCredits(
  id: number,
  language: string,
): Promise<MovieCredits> {
  const url = `${baseUrl}/3/person/${id}/movie_credits?language=${language}`;

  const response = await fetch(url, {
    headers: getHeaders(),
  });

  if (!response.ok)
    throw new Error(`Movie credits fetch failed: ${await response.text()}`);

  return MovieCredits.parse(await response.json());
}

async function getMovieListPage(
  listId: number,
  language: string,
  page: number,
): Promise<MovieList> {
  const params = new URLSearchParams({
    language,
    page: String(page),
  });
  const url = `${baseUrl}/3/list/${listId}?${params.toString()}`;

  const response = await fetch(url, {
    headers: getHeaders(),
  });

  if (!response.ok)
    throw new Error(`Movie list fetch failed: ${await response.text()}`);

  return MovieList.parse(await response.json());
}

export async function getMovieList(
  listId: number,
  language: string,
): Promise<MovieList> {
  const firstPage = await getMovieListPage(listId, language, 1);
  const totalPages = firstPage.total_pages ?? 1;

  if (totalPages <= 1) {
    return firstPage;
  }

  const remainingPages = await Promise.all(
    Array.from({ length: totalPages - 1 }, (_, index) =>
      getMovieListPage(listId, language, index + 2),
    ),
  );

  return {
    ...firstPage,
    items: [
      ...firstPage.items,
      ...remainingPages.flatMap((page) => page.items),
    ],
  };
}
