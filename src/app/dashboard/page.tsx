import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { FolderOpen, CheckCircle2, Clock, AlertCircle, Plus, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getPriorityColor } from "@/lib/utils";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;

  const projects = await prisma.project.findMany({
    where: { ownerId: userId },
    include: { tasks: { select: { id: true, status: true, priority: true } } },
    orderBy: { updatedAt: "desc" },
  });

  const allTasks = projects.flatMap((p) => p.tasks);
  const todoCount = allTasks.filter((t) => t.status === "todo").length;
  const inProgressCount = allTasks.filter((t) => t.status === "in-progress").length;
  const doneCount = allTasks.filter((t) => t.status === "done").length;
  const highPriorityCount = allTasks.filter((t) => t.priority === "high" && t.status !== "done").length;

  const stats = [
    { label: "Total Projects", value: projects.length, icon: FolderOpen, color: "text-primary bg-primary/5" },
    { label: "To Do", value: todoCount, icon: Clock, color: "text-muted-foreground bg-muted/60" },
    { label: "In Progress", value: inProgressCount, icon: AlertCircle, color: "text-primary bg-primary/5" },
    { label: "Completed", value: doneCount, icon: CheckCircle2, color: "text-secondary bg-secondary/10" },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-2xl font-bold font-display">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back, {session?.user?.name?.split(" ")[0] || "there"}!</p>
        </div>
        <Link href="/dashboard/projects">
          <Button><Plus className="w-4 h-4 mr-2" />New Project</Button>
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-2xl font-bold font-display">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {highPriorityCount > 0 && (
        <Card className="mb-10 bg-amber-50/30">
          <CardContent className="p-5 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600" />
            <p className="text-sm"><span className="font-semibold text-amber-800">{highPriorityCount} high-priority task{highPriorityCount !== 1 ? "s" : ""}</span> <span className="text-amber-700">need attention</span></p>
          </CardContent>
        </Card>
      )}

      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-lg font-semibold font-display">Recent Projects</h2>
        <Link href="/dashboard/projects" className="text-sm text-primary hover:underline flex items-center gap-1">
          View all <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {projects.slice(0, 6).map((project) => {
          const total = project.tasks.length;
          const done = project.tasks.filter((t) => t.status === "done").length;
          const progress = total > 0 ? Math.round((done / total) * 100) : 0;

          return (
            <Link key={project.id} href={`/dashboard/projects/${project.id}`}>
              <Card className="hover:shadow-lg hover:shadow-primary/5 transition-all duration-200 cursor-pointer h-full">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3.5 h-3.5 rounded-full shadow-sm" style={{ backgroundColor: project.color }} />
                      <CardTitle className="text-base">{project.name}</CardTitle>
                    </div>
                    <Badge variant="outline" className={`rounded-full ${getPriorityColor(project.priority)}`}>{project.priority}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  {project.description && <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{project.description}</p>}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{done} / {total} tasks</span>
                      <span className="font-medium font-display">{progress}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full gradient-primary rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {projects.length === 0 && (
        <Card>
          <CardContent className="p-16 text-center">
            <FolderOpen className="w-12 h-12 text-muted-foreground/40 mx-auto mb-5" />
            <h3 className="text-lg font-semibold font-display mb-2">No projects yet</h3>
            <p className="text-muted-foreground mb-6">Create your first project to get started.</p>
            <Link href="/dashboard/projects"><Button>Create Project</Button></Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
