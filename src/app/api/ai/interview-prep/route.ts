import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { geminiModel } from "@/lib/gemini";
import { buildProjectContext } from "@/lib/project-context";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { projectId } = await req.json();
  if (!projectId) {
    return NextResponse.json({ error: "projectId is required" }, { status: 400 });
  }

  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project || project.userId !== session.user.id) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  const context = buildProjectContext(project);

  const prompt = `You are helping a developer prepare to confidently explain this project in a job interview.

PROJECT INFORMATION:
${context || "(limited information available — infer reasonably from the project name and tech stack)"}

Generate the following, tailored specifically for interview prep:
1. "hrExplanation" — a simple, non-technical explanation a recruiter or HR person would understand (2-3 sentences)
2. "technicalExplanation" — a technical explanation suitable for a technical interviewer, mentioning architecture/tech choices and WHY they were made (3-5 sentences)
3. "explanation30s" — a tight 30-second elevator pitch (2-3 sentences)
4. "explanation2m" — a detailed 2-minute walkthrough covering problem, solution, tech decisions, and a challenge overcome (a longer paragraph)
5. "commonQuestions" — an array of 5 objects, each {"q": "...", "a": "..."}, covering the kinds of questions an interviewer would realistically ask about this specific project (e.g. "Why did you choose X over Y?", "How would you scale this?", "What was the hardest bug you fixed?")

Respond with ONLY a valid JSON object with exactly these 5 keys, no markdown code fences, no preamble. All string fields must be plain strings, never arrays.`;

  const result = await geminiModel.generateContent(prompt);
  let text = result.response.text().trim();
  text = text.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```\s*$/i, "");

  let generated;
  try {
    generated = JSON.parse(text);
  } catch {
    return NextResponse.json({ error: "AI response could not be parsed. Please try again." }, { status: 502 });
  }

  return NextResponse.json({ generated });
}