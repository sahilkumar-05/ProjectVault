import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET all projects for logged-in user
export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const projects = await prisma.project.findMany({
    where: { userId: session.user.id as string },
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json(projects);
}

// POST create new project
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name, description, techStack, githubUrl } = await req.json();

  if (!name || name.trim().length === 0) {
    return NextResponse.json({ error: "Project name is required" }, { status: 400 });
  }

  const project = await prisma.project.create({
    data: {
      userId: session.user.id as string,
      name: name.trim(),
      description: description || null,
      techStack: techStack || [],
      githubUrl: githubUrl || null,
    },
  });

  return NextResponse.json(project, { status: 201 });
}