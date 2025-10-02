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

interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  company: string | null;
  is_published: boolean;
  sort_order: number;
}

export function TestimonialsAdmin() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    const { data, error } = await supabase
      .from("testimonials")
      .select("*")
      .order("sort_order");

    if (error) {
      toast({ title: "Error loading testimonials", variant: "destructive" });
    } else {
      setTestimonials(data || []);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const testimonialData = {
      quote: formData.get("quote") as string,
      author: formData.get("author") as string,
      role: formData.get("role") as string,
      company: formData.get("company") as string || null,
      is_published: formData.get("is_published") === "on",
      sort_order: parseInt(formData.get("sort_order") as string) || 0,
    };

    if (editingTestimonial) {
      const { error } = await supabase
        .from("testimonials")
        .update(testimonialData)
        .eq("id", editingTestimonial.id);

      if (error) {
        toast({ title: "Error updating testimonial", variant: "destructive" });
      } else {
        toast({ title: "Testimonial updated successfully" });
        setIsDialogOpen(false);
        setEditingTestimonial(null);
        fetchTestimonials();
      }
    } else {
      const { error } = await supabase.from("testimonials").insert([testimonialData]);

      if (error) {
        toast({ title: "Error creating testimonial", variant: "destructive" });
      } else {
        toast({ title: "Testimonial created successfully" });
        setIsDialogOpen(false);
        fetchTestimonials();
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this testimonial?")) return;

    const { error } = await supabase.from("testimonials").delete().eq("id", id);

    if (error) {
      toast({ title: "Error deleting testimonial", variant: "destructive" });
    } else {
      toast({ title: "Testimonial deleted successfully" });
      fetchTestimonials();
    }
  };

  if (loading) return <div>Loading testimonials...</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Testimonials Management</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingTestimonial(null)} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Testimonial
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingTestimonial ? "Edit Testimonial" : "Add New Testimonial"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="quote">Quote</Label>
                <Textarea
                  id="quote"
                  name="quote"
                  defaultValue={editingTestimonial?.quote}
                  required
                  rows={4}
                />
              </div>
              <div>
                <Label htmlFor="author">Author</Label>
                <Input
                  id="author"
                  name="author"
                  defaultValue={editingTestimonial?.author}
                  required
                />
              </div>
              <div>
                <Label htmlFor="role">Role/Position</Label>
                <Input
                  id="role"
                  name="role"
                  defaultValue={editingTestimonial?.role}
                  required
                />
              </div>
              <div>
                <Label htmlFor="company">Company (optional)</Label>
                <Input
                  id="company"
                  name="company"
                  defaultValue={editingTestimonial?.company || ""}
                />
              </div>
              <div>
                <Label htmlFor="sort_order">Sort Order</Label>
                <Input
                  id="sort_order"
                  name="sort_order"
                  type="number"
                  defaultValue={editingTestimonial?.sort_order || 0}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_published"
                  name="is_published"
                  defaultChecked={editingTestimonial?.is_published ?? true}
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
                    setEditingTestimonial(null);
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
        {testimonials.map((testimonial) => (
          <div
            key={testimonial.id}
            className="p-4 rounded-lg border bg-card flex justify-between items-start"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-lg font-semibold">{testimonial.author}</h3>
                {!testimonial.is_published && (
                  <span className="text-xs bg-muted px-2 py-1 rounded">
                    Draft
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                {testimonial.role}
                {testimonial.company && ` • ${testimonial.company}`}
              </p>
              <p className="text-sm italic">"{testimonial.quote}"</p>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setEditingTestimonial(testimonial);
                  setIsDialogOpen(true);
                }}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => handleDelete(testimonial.id)}
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
