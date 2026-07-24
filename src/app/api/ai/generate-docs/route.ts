import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { geminiModel } from "@/lib/gemini";
import { buildProjectContext } from "@/lib/project-context";

const GENERATABLE_SECTIONS: Record<string, string> = {
  overview: `"description" (2-3 sentences), "problem" (what problem it solves), "solution" (how it solves it) — all as plain text strings`,
  features: `"features" as an array of objects like {"title": "...", "description": "..."} — infer 3-5 plausible features from the tech stack and description`,
  setup: `"installation" (step-by-step install instructions as markdown), "envVariables" (likely env vars needed as markdown), "apiNotes" (brief notes, or empty string if not applicable)`,
  devNotes: `"challenges" (plausible challenges based on the tech stack), "learnings" (plausible key learnings), "futureImprovements" (plausible next steps)`,
  interviewNotes: `"hrExplanation" (a simple non-technical explanation), "technicalExplanation" (a technical explanation for an interviewer), "explanation30s" (a 30-second elevator pitch), "explanation2m" (a 2-minute detailed explanation)`,
};

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { projectId, sections } = await req.json();
  if (!projectId || !sections?.length) {
    return NextResponse.json({ error: "projectId and sections are required" }, { status: 400 });
  }

  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project || project.userId !== session.user.id) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  const context = buildProjectContext(project);
  const instructions = sections
    .filter((s: string) => GENERATABLE_SECTIONS[s])
    .map((s: string) => `- For "${s}": generate ${GENERATABLE_SECTIONS[s]}`)
    .join("\n");

  const prompt = `You are helping fill in missing documentation for a developer's project based on what's already known about it.

EXISTING PROJECT INFORMATION:
${context || "(very limited information available — infer reasonably from the project name and tech stack)"}

Generate content for the following missing sections:
${instructions}

Respond with ONLY a valid JSON object, no markdown code fences, no preamble. The top-level keys should be section names ("overview", "features", "setup", "devNotes", "interviewNotes" — only include the ones requested above), and their values should be objects containing the fields described. IMPORTANT: every field value must be a plain string, never an array — if you have multiple points, join them into one string using markdown line breaks (\n) and "- " bullets, except for "features" and "commonQuestions" which should remain arrays of objects as specified.`;

  const result = await geminiModel.generateContent(prompt);
  let text = result.response.text().trim();

  // Strip markdown code fences if Gemini adds them despite instructions
  text = text.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```\s*$/i, "");

  let generated;
  try {
    generated = JSON.parse(text);
  } catch {
    return NextResponse.json({ error: "AI response could not be parsed. Please try again." }, { status: 502 });
  }

  // Normalize: some fields must be plain strings (Text columns), but Gemini
  // sometimes returns them as arrays of bullet points. Flatten any array
  // values in known string fields into a markdown bullet-point string.
  const STRING_FIELDS = new Set([
    "description", "problem", "solution",
    "installation", "envVariables", "apiNotes",
    "challenges", "learnings", "futureImprovements",
    "hrExplanation", "technicalExplanation", "explanation30s", "explanation2m",
  ]);

  for (const sectionKey of Object.keys(generated)) {
    const section = generated[sectionKey];
    if (section && typeof section === "object") {
      for (const fieldKey of Object.keys(section)) {
        if (STRING_FIELDS.has(fieldKey) && Array.isArray(section[fieldKey])) {
          section[fieldKey] = section[fieldKey].map((item: string) => `- ${item}`).join("\n");
        }
      }
    }
  }

  return NextResponse.json({ generated });
}