import { bondActorTmdbIds } from "app/constants";
import { addVoteForBond } from "app/services/votes";
import { locale } from "app/utils/locale";
import { NextRequest } from "next/server";
import { zfd } from "zod-form-data";

const schema = zfd.formData({
  id: zfd.numeric().refine((id) => bondActorTmdbIds.includes(id)),
});

export async function POST(request: NextRequest) {
  let id: number;

  try {
    ({ id } = schema.parse(await request.formData()));
  } catch (e) {
    return Response.json(
      {
        error: locale() === "fi" ? "Epäkelpo ID." : "Invalid ID.",
      },
      { status: 400 },
    );
  }

  try {
    const votes = await addVoteForBond(id);

    return Response.json({ votes });
  } catch (e) {
    return Response.json(
      {
        error:
          locale() === "fi"
            ? "Tuntematon virhe tapahtui, yritä myöhemmin uudelleen."
            : "Unknown error occurred, please try again later.",
      },
      { status: 500 },
    );
  }
}
