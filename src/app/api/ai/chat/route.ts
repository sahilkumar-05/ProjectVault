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

  const { projectId, message } = await req.json();

  if (!projectId || !message) {
    return NextResponse.json({ error: "projectId and message are required" }, { status: 400 });
  }

  // Fetch ONLY this project — enforces isolation at the query level
  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project || project.userId !== session.user.id) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  // Fetch chat history scoped to THIS project only
  const history = await prisma.chatHistory.findMany({
    where: { projectId },
    orderBy: { createdAt: "asc" },
    take: 20, // last 20 messages for context window control
  });

  const context = buildProjectContext(project);

  const systemPrompt = `You are a project-specific assistant for a developer memory tool called ProjectVault.
You must ONLY answer using the information provided below about this specific project. 
Do not use any external knowledge about other projects. If the answer isn't in the provided information, say so honestly and suggest the user add that information to the relevant section.

PROJECT INFORMATION:
${context}`;

  const conversationHistory = history.map((h) => ({
    role: h.role === "user" ? "user" : "model",
    parts: [{ text: h.content }],
  }));

  const chat = geminiModel.startChat({
    history: [
      { role: "user", parts: [{ text: systemPrompt }] },
      { role: "model", parts: [{ text: "Understood. I'll answer questions about this project only, using the information provided." }] },
      ...conversationHistory,
    ],
  });

  const result = await chat.sendMessage(message);
  const responseText = result.response.text();

  // Save both messages to history
  await prisma.chatHistory.createMany({
    data: [
      { projectId, role: "user", content: message },
      { projectId, role: "assistant", content: responseText },
    ],
  });

  return NextResponse.json({ reply: responseText });
}