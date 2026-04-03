import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { taskSchema } from "@/lib/validations";

export async function PATCH(
  request: Request,
  { params }: { params: { projectId: string; taskId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const project = await prisma.task.findUnique({
      where: { id: params.taskId },
      include: { project: { select: { ownerId: true } } },
    });
    if (!project) return NextResponse.json({ error: "Task not found" }, { status: 404 });
    if (project.project.ownerId !== userId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const body = await request.json();

    // Handle simple status update (from drag-and-drop or status buttons)
    if (body.status && Object.keys(body).length <= 2) {
      const task = await prisma.task.update({
        where: { id: params.taskId },
        data: {
          status: body.status,
          order: body.order ?? undefined,
        },
        include: {
          assignee: {
            select: { id: true, name: true, email: true, image: true },
          },
        },
      });
      return NextResponse.json(task);
    }

    // Full update
    const data = taskSchema.partial().parse(body);
    const task = await prisma.task.update({
      where: { id: params.taskId },
      data: {
        ...data,
        dueDate: data.dueDate ? new Date(data.dueDate) : data.dueDate === null ? null : undefined,
      },
      include: {
        assignee: {
          select: { id: true, name: true, email: true, image: true },
        },
      },
    });

    return NextResponse.json(task);
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { projectId: string; taskId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const task = await prisma.task.findUnique({
      where: { id: params.taskId },
      include: { project: { select: { ownerId: true } } },
    });
    if (!task) return NextResponse.json({ error: "Task not found" }, { status: 404 });
    if (task.project.ownerId !== userId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    await prisma.task.delete({
      where: { id: params.taskId },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
