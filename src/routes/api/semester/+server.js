import { json } from "@sveltejs/kit";
import { writeSemesterCookie } from "$lib/data/semesters.js";

export async function POST({ request, cookies, url }) {
  const body = await request.json();
  const semester = writeSemesterCookie(cookies, body.semester, url);

  return json({ semester });
}
