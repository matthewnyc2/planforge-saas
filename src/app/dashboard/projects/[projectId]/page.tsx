"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus, Trash2, GripVertical, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { cn, getInitials, getPriorityColor } from "@/lib/utils";

interface Task {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  order: number;
  dueDate: string | null;
  assignee: { id: string; name: string | null; email: string } | null;
}

interface Project {
  id: string;
  name: string;
  description: string | null;
  status: string;
  priority: string;
  color: string;
  tasks: Task[];
  owner: { id: string; name: string | null; email: string };
}

const columns = [
  { id: "todo", label: "To Do", tint: "bg-muted/40", accent: "text-muted-foreground", countBg: "bg-muted" },
  { id: "in-progress", label: "In Progress", tint: "bg-primary/[0.03]", accent: "text-primary", countBg: "bg-primary/10" },
  { id: "done", label: "Done", tint: "bg-secondary/[0.04]", accent: "text-secondary", countBg: "bg-secondary/10" },
];

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.projectId as string;

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [newTaskStatus, setNewTaskStatus] = useState("todo");
  const [taskForm, setTaskForm] = useState({ title: "", description: "", priority: "medium", status: "todo" });
  const [draggedTask, setDraggedTask] = useState<string | null>(null);

  const fetchProject = useCallback(async () => {
    const res = await fetch(`/api/projects/${projectId}`);
    if (res.ok) {
      setProject(await res.json());
    } else {
      router.push("/dashboard/projects");
    }
    setLoading(false);
  }, [projectId, router]);

  useEffect(() => { fetchProject(); }, [fetchProject]);

  function openNewTask(status: string) {
    setEditingTask(null);
    setNewTaskStatus(status);
    setTaskForm({ title: "", description: "", priority: "medium", status });
    setTaskDialogOpen(true);
  }

  function openEditTask(task: Task) {
    setEditingTask(task);
    setTaskForm({ title: task.title, description: task.description || "", priority: task.priority, status: task.status });
    setTaskDialogOpen(true);
  }

  async function saveTask(e: React.FormEvent) {
    e.preventDefault();
    if (editingTask) {
      await fetch(`/api/projects/${projectId}/tasks/${editingTask.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskForm),
      });
    } else {
      await fetch(`/api/projects/${projectId}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...taskForm, status: newTaskStatus }),
      });
    }
    setTaskDialogOpen(false);
    fetchProject();
  }

  async function deleteTask(taskId: string) {
    await fetch(`/api/projects/${projectId}/tasks/${taskId}`, { method: "DELETE" });
    fetchProject();
  }

  async function moveTask(taskId: string, newStatus: string) {
    await fetch(`/api/projects/${projectId}/tasks/${taskId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    fetchProject();
  }

  async function deleteProject() {
    if (!confirm("Delete this project and all its tasks? This cannot be undone.")) return;
    await fetch(`/api/projects/${projectId}`, { method: "DELETE" });
    router.push("/dashboard/projects");
  }

  function handleDragStart(e: React.DragEvent, taskId: string) {
    setDraggedTask(taskId);
    e.dataTransfer.effectAllowed = "move";
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }

  function handleDrop(e: React.DragEvent, status: string) {
    e.preventDefault();
    if (draggedTask) {
      moveTask(draggedTask, status);
      setDraggedTask(null);
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin w-8 h-8 rounded-full" style={{ border: '3px solid hsl(var(--muted))', borderTopColor: 'hsl(var(--primary))' }} />
    </div>
  );
  if (!project) return null;

  const totalTasks = project.tasks.length;
  const doneTasks = project.tasks.filter((t) => t.status === "done").length;
  const progress = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

  return (
    <div>
      {/* Header */}
      <div className="mb-10">
        <Link href="/dashboard/projects" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" />Back to Projects
        </Link>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 rounded-full shadow-sm" style={{ backgroundColor: project.color }} />
            <h1 className="text-2xl font-bold font-display">{project.name}</h1>
            <Badge variant="outline" className={cn("rounded-full", getPriorityColor(project.priority))}>{project.priority}</Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={deleteProject} className="text-destructive hover:text-destructive hover:bg-destructive/5">
              <Trash2 className="w-4 h-4 mr-1.5" />Delete
            </Button>
          </div>
        </div>
        {project.description && <p className="text-muted-foreground mt-3 max-w-2xl leading-relaxed">{project.description}</p>}
        <div className="flex items-center gap-6 mt-5">
          <div className="flex items-center gap-3 text-sm">
            <span className="text-muted-foreground">Progress:</span>
            <div className="w-36 h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full gradient-primary rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
            </div>
            <span className="font-semibold font-display">{progress}%</span>
          </div>
          <span className="text-sm text-muted-foreground">{doneTasks} / {totalTasks} tasks done</span>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {columns.map((col) => {
          const columnTasks = project.tasks.filter((t) => t.status === col.id).sort((a, b) => a.order - b.order);
          return (
            <div
              key={col.id}
              className={cn("rounded-2xl p-5 min-h-[320px] transition-colors", col.tint)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, col.id)}
            >
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2.5">
                  <h3 className={cn("font-semibold text-sm font-display", col.accent)}>{col.label}</h3>
                  <span className={cn("text-xs px-2.5 py-1 rounded-full font-medium", col.countBg, col.accent)}>
                    {columnTasks.length}
                  </span>
                </div>
                <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg" onClick={() => openNewTask(col.id)}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-3">
                {columnTasks.map((task) => (
                  <Card
                    key={task.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, task.id)}
                    className={cn(
                      "p-4 cursor-grab active:cursor-grabbing hover:shadow-lg hover:shadow-primary/5 transition-all duration-200 bg-card",
                      draggedTask === task.id && "opacity-40 scale-95"
                    )}
                  >
                    <div className="flex items-start gap-2.5">
                      <GripVertical className="w-4 h-4 text-muted-foreground/30 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className={cn("text-sm font-medium", col.id === "done" && "line-through text-muted-foreground")}>{task.title}</p>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-6 w-6 flex-shrink-0 rounded-lg">
                                <MoreVertical className="w-3 h-3" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="rounded-xl">
                              <DropdownMenuItem onClick={() => openEditTask(task)}>Edit</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {columns.filter((c) => c.id !== task.status).map((c) => (
                                <DropdownMenuItem key={c.id} onClick={() => moveTask(task.id, c.id)}>
                                  Move to {c.label}
                                </DropdownMenuItem>
                              ))}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive" onClick={() => deleteTask(task.id)}>Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        {task.description && <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2 leading-relaxed">{task.description}</p>}
                        <div className="flex items-center gap-2 mt-3">
                          <Badge variant="outline" className={cn("text-xs px-2 py-0 rounded-full", getPriorityColor(task.priority))}>
                            {task.priority}
                          </Badge>
                          {task.assignee && (
                            <Avatar className="h-5 w-5">
                              <AvatarFallback className="text-[10px] bg-primary/10 text-primary">
                                {getInitials(task.assignee.name || task.assignee.email)}
                              </AvatarFallback>
                            </Avatar>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}

                {columnTasks.length === 0 && (
                  <div className="text-center py-10">
                    <p className="text-xs text-muted-foreground/60 mb-3">No tasks</p>
                    <Button variant="ghost" size="sm" className="text-xs" onClick={() => openNewTask(col.id)}>
                      <Plus className="w-3 h-3 mr-1" />Add task
                    </Button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Task Dialog */}
      <Dialog open={taskDialogOpen} onOpenChange={setTaskDialogOpen}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle className="font-display">{editingTask ? "Edit Task" : "New Task"}</DialogTitle>
            <DialogDescription>{editingTask ? "Update the task details." : "Add a new task to this project."}</DialogDescription>
          </DialogHeader>
          <form onSubmit={saveTask} className="space-y-5">
            <div className="space-y-2">
              <Label className="font-medium">Title</Label>
              <Input value={taskForm.title} onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })} placeholder="Task title" required className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label className="font-medium">Description</Label>
              <Textarea value={taskForm.description} onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })} placeholder="Optional description" className="rounded-xl" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="font-medium">Priority</Label>
                <Select value={taskForm.priority} onValueChange={(v) => setTaskForm({ ...taskForm, priority: v })}>
                  <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="font-medium">Status</Label>
                <Select value={editingTask ? taskForm.status : newTaskStatus} onValueChange={(v) => editingTask ? setTaskForm({ ...taskForm, status: v }) : setNewTaskStatus(v)}>
                  <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="todo">To Do</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="done">Done</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button type="submit" className="w-full">{editingTask ? "Save Changes" : "Create Task"}</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
