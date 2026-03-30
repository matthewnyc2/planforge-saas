import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { taskSchema } from "@/lib/validations";

export async function POST(
  request: Request,
  { params }: { params: { projectId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const data = taskSchema.parse(body);

    // Get the highest order for the status column
    const maxOrderTask = await prisma.task.findFirst({
      where: { projectId: params.projectId, status: data.status },
      orderBy: { order: "desc" },
    });

    const task = await prisma.task.create({
      data: {
        title: data.title,
        description: data.description || null,
        status: data.status,
        priority: data.priority,
        assigneeId: data.assigneeId || null,
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
        order: (maxOrderTask?.order ?? -1) + 1,
        projectId: params.projectId,
      },
      include: {
        assignee: {
          select: { id: true, name: true, email: true, image: true },
        },
      },
    });

    return NextResponse.json(task, { status: 201 });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
