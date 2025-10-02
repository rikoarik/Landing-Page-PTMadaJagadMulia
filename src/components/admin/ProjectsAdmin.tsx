import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Save, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface Project {
  id: string;
  title: string;
  description: string;
  year: string;
  location: string;
  tags: string[];
  image_url: string | null;
  is_published: boolean;
  sort_order: number;
}

export function ProjectsAdmin() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("sort_order");

    if (error) {
      toast({ title: "Error loading projects", variant: "destructive" });
    } else {
      setProjects(data || []);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const tagsString = formData.get("tags") as string;
    const tags = tagsString.split(",").map((t) => t.trim()).filter(Boolean);

    const projectData = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      year: formData.get("year") as string,
      location: formData.get("location") as string,
      tags,
      image_url: formData.get("image_url") as string || null,
      is_published: formData.get("is_published") === "on",
      sort_order: parseInt(formData.get("sort_order") as string) || 0,
    };

    if (editingProject) {
      const { error } = await supabase
        .from("projects")
        .update(projectData)
        .eq("id", editingProject.id);

      if (error) {
        toast({ title: "Error updating project", variant: "destructive" });
      } else {
        toast({ title: "Project updated successfully" });
        setIsDialogOpen(false);
        setEditingProject(null);
        fetchProjects();
      }
    } else {
      const { error } = await supabase.from("projects").insert([projectData]);

      if (error) {
        toast({ title: "Error creating project", variant: "destructive" });
      } else {
        toast({ title: "Project created successfully" });
        setIsDialogOpen(false);
        fetchProjects();
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    const { error } = await supabase.from("projects").delete().eq("id", id);

    if (error) {
      toast({ title: "Error deleting project", variant: "destructive" });
    } else {
      toast({ title: "Project deleted successfully" });
      fetchProjects();
    }
  };

  if (loading) return <div>Loading projects...</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Projects Management</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingProject(null)} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Project
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingProject ? "Edit Project" : "Add New Project"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  defaultValue={editingProject?.title}
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  defaultValue={editingProject?.description}
                  required
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="year">Year</Label>
                  <Input
                    id="year"
                    name="year"
                    defaultValue={editingProject?.year}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    name="location"
                    defaultValue={editingProject?.location}
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  name="tags"
                  defaultValue={editingProject?.tags?.join(", ")}
                  placeholder="Infrastructure, Sustainable, GIS"
                />
              </div>
              <div>
                <Label htmlFor="image_url">Image URL</Label>
                <Input
                  id="image_url"
                  name="image_url"
                  type="url"
                  defaultValue={editingProject?.image_url || ""}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div>
                <Label htmlFor="sort_order">Sort Order</Label>
                <Input
                  id="sort_order"
                  name="sort_order"
                  type="number"
                  defaultValue={editingProject?.sort_order || 0}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_published"
                  name="is_published"
                  defaultChecked={editingProject?.is_published ?? true}
                />
                <Label htmlFor="is_published">Published</Label>
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="gap-2">
                  <Save className="h-4 w-4" />
                  Save
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsDialogOpen(false);
                    setEditingProject(null);
                  }}
                  className="gap-2"
                >
                  <X className="h-4 w-4" />
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {projects.map((project) => (
          <div
            key={project.id}
            className="p-4 rounded-lg border bg-card flex justify-between items-start"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-lg font-semibold">{project.title}</h3>
                {!project.is_published && (
                  <span className="text-xs bg-muted px-2 py-1 rounded">
                    Draft
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                {project.description}
              </p>
              <div className="flex gap-2 text-xs text-muted-foreground">
                <span>📍 {project.location}</span>
                <span>📅 {project.year}</span>
                {project.tags && project.tags.length > 0 && (
                  <span>🏷️ {project.tags.join(", ")}</span>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setEditingProject(project);
                  setIsDialogOpen(true);
                }}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => handleDelete(project.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
