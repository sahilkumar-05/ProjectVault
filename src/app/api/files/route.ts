import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import cloudinary from "@/lib/cloudinary";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File;
  const projectId = formData.get("projectId") as string;

  if (!file || !projectId) {
    return NextResponse.json({ error: "File and projectId are required" }, { status: 400 });
  }

  // Confirm the project belongs to this user
  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project || project.userId !== session.user.id) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  const isPdf = file.type === "application/pdf";
  const isImage = file.type.startsWith("image/");

  if (!isPdf && !isImage) {
    return NextResponse.json({ error: "Only images and PDFs are allowed" }, { status: 400 });
  }

  // Convert file to base64 for Cloudinary upload
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;

  
const uploadResult = await cloudinary.uploader.upload(base64, {
    folder: `projectvault/${projectId}`,
    resource_type: "image",
    public_id: isPdf ? file.name.replace(/\.[^/.]+$/, "") : undefined,
    format: isPdf ? "pdf" : undefined,
    use_filename: true,
    unique_filename: true,
  });
  
  const savedFile = await prisma.projectFile.create({
    data: {
      projectId,
      url: uploadResult.secure_url,
      type: isPdf ? "pdf" : "image",
      filename: file.name,
    },
  });

  return NextResponse.json(savedFile, { status: 201 });
}

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const projectId = searchParams.get("projectId");

  if (!projectId) {
    return NextResponse.json({ error: "projectId is required" }, { status: 400 });
  }

  const files = await prisma.projectFile.findMany({
    where: { projectId },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(files);
}