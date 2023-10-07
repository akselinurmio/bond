import { z } from "zod";

const Configuration = z.object({
  images: z.object({
    base_url: z.string(),
    secure_base_url: z.string(),
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

const baseUrl = "https://api.themoviedb.org";

function getHeaders() {
  if (!process.env.TMDB_API_TOKEN) throw new Error("Missing TMDB API token");

  return new Headers({
    Authorization: `Bearer ${process.env.TMDB_API_TOKEN}`,
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

  const response = await fetch(url, { headers: getHeaders() });

  if (!response.ok)
    throw new Error(`Actor fetch failed: ${await response.text()}`);

  return Person.parse(await response.json());
}
