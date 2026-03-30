"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FolderOpen, Plus, Trash2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getPriorityColor } from "@/lib/utils";

interface Project {
  id: string;
  name: string;
  description: string | null;
  status: string;
  priority: string;
  color: string;
  createdAt: string;
  tasks: { id: string; status: string }[];
}

const colors = ["#6366f1", "#ec4899", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4", "#6b7280"];

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ name: "", description: "", priority: "medium", color: "#6366f1" });

  useEffect(() => { fetchProjects(); }, []);

  async function fetchProjects() {
    const res = await fetch("/api/projects");
    if (res.ok) setProjects(await res.json());
    setLoading(false);
  }

  async function createProject(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    if (res.ok) {
      setDialogOpen(false);
      setFormData({ name: "", description: "", priority: "medium", color: "#6366f1" });
      fetchProjects();
    }
  }

  async function deleteProject(id: string) {
    if (!confirm("Delete this project and all its tasks?")) return;
    await fetch(`/api/projects/${id}`, { method: "DELETE" });
    fetchProjects();
  }

  const filtered = projects.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin w-8 h-8 rounded-full" style={{ border: '3px solid hsl(var(--muted))', borderTopColor: 'hsl(var(--primary))' }} />
    </div>
  );

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-2xl font-bold font-display">Projects</h1>
          <p className="text-muted-foreground mt-1">{projects.length} project{projects.length !== 1 ? "s" : ""}</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="w-4 h-4 mr-2" />New Project</Button>
          </DialogTrigger>
          <DialogContent className="rounded-2xl">
            <DialogHeader>
              <DialogTitle className="font-display">Create Project</DialogTitle>
              <DialogDescription>Add a new project to organize your tasks.</DialogDescription>
            </DialogHeader>
            <form onSubmit={createProject} className="space-y-5">
              <div className="space-y-2">
                <Label className="font-medium">Project Name</Label>
                <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="My new project" required className="rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label className="font-medium">Description</Label>
                <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="What is this project about?" className="rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label className="font-medium">Priority</Label>
                <Select value={formData.priority} onValueChange={(v) => setFormData({ ...formData, priority: v })}>
                  <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="font-medium">Color</Label>
                <div className="flex gap-2.5">
                  {colors.map((c) => (
                    <button key={c} type="button" onClick={() => setFormData({ ...formData, color: c })}
                      className={`w-8 h-8 rounded-full transition-all ${formData.color === c ? "ring-2 ring-primary ring-offset-2 scale-110" : "opacity-70 hover:opacity-100"}`}
                      style={{ backgroundColor: c }} />
                  ))}
                </div>
              </div>
              <Button type="submit" className="w-full">Create Project</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mb-8">
        <div className="relative max-w-sm">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search projects..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 rounded-xl" />
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((project) => {
          const total = project.tasks.length;
          const done = project.tasks.filter((t) => t.status === "done").length;
          const progress = total > 0 ? Math.round((done / total) * 100) : 0;

          return (
            <Card key={project.id} className="group hover:shadow-lg hover:shadow-primary/5 transition-all duration-200">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <Link href={`/dashboard/projects/${project.id}`} className="flex items-center gap-3 flex-1">
                    <div className="w-3.5 h-3.5 rounded-full flex-shrink-0 shadow-sm" style={{ backgroundColor: project.color }} />
                    <CardTitle className="text-base hover:text-primary transition-colors">{project.name}</CardTitle>
                  </Link>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={`rounded-full ${getPriorityColor(project.priority)}`}>{project.priority}</Badge>
                    <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive rounded-lg" onClick={() => deleteProject(project.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Link href={`/dashboard/projects/${project.id}`}>
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
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filtered.length === 0 && projects.length > 0 && (
        <Card><CardContent className="p-16 text-center"><p className="text-muted-foreground">No projects match your search.</p></CardContent></Card>
      )}

      {projects.length === 0 && (
        <Card>
          <CardContent className="p-16 text-center">
            <FolderOpen className="w-12 h-12 text-muted-foreground/40 mx-auto mb-5" />
            <h3 className="text-lg font-semibold font-display mb-2">No projects yet</h3>
            <p className="text-muted-foreground mb-6">Create your first project to start managing tasks.</p>
            <Button onClick={() => setDialogOpen(true)}><Plus className="w-4 h-4 mr-2" />Create Project</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
