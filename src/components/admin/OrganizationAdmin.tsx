import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

interface OrgMember {
  id: string;
  name: string;
  position: string;
  level: number;
  is_published: boolean;
  sort_order: number;
}

export function OrganizationAdmin() {
  const [members, setMembers] = useState<OrgMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingMember, setEditingMember] = useState<OrgMember | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    const { data, error } = await supabase
      .from("organization_structure")
      .select("*")
      .order("level")
      .order("sort_order");

    if (error) {
      toast({ title: "Error loading organization structure", variant: "destructive" });
    } else {
      setMembers(data || []);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const memberData = {
      name: formData.get("name") as string,
      position: formData.get("position") as string,
      level: parseInt(formData.get("level") as string),
      is_published: formData.get("is_published") === "on",
      sort_order: parseInt(formData.get("sort_order") as string) || 0,
    };

    if (editingMember) {
      const { error } = await supabase
        .from("organization_structure")
        .update(memberData)
        .eq("id", editingMember.id);

      if (error) {
        toast({ title: "Error updating position", variant: "destructive" });
      } else {
        toast({ title: "Position updated successfully" });
        setIsDialogOpen(false);
        setEditingMember(null);
        fetchMembers();
      }
    } else {
      const { error } = await supabase.from("organization_structure").insert([memberData]);

      if (error) {
        toast({ title: "Error creating position", variant: "destructive" });
      } else {
        toast({ title: "Position created successfully" });
        setIsDialogOpen(false);
        fetchMembers();
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this position?")) return;

    const { error } = await supabase.from("organization_structure").delete().eq("id", id);

    if (error) {
      toast({ title: "Error deleting position", variant: "destructive" });
    } else {
      toast({ title: "Position deleted successfully" });
      fetchMembers();
    }
  };

  if (loading) return <div>Loading organization structure...</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Organization Structure</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingMember(null)} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Position
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingMember ? "Edit Position" : "Add New Position"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  defaultValue={editingMember?.name}
                  required
                />
              </div>
              <div>
                <Label htmlFor="position">Position</Label>
                <Input
                  id="position"
                  name="position"
                  defaultValue={editingMember?.position}
                  required
                />
              </div>
              <div>
                <Label htmlFor="level">Level (1=top, 2=middle, 3=bottom)</Label>
                <Input
                  id="level"
                  name="level"
                  type="number"
                  min="1"
                  max="3"
                  defaultValue={editingMember?.level || 1}
                  required
                />
              </div>
              <div>
                <Label htmlFor="sort_order">Sort Order</Label>
                <Input
                  id="sort_order"
                  name="sort_order"
                  type="number"
                  defaultValue={editingMember?.sort_order || 0}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_published"
                  name="is_published"
                  defaultChecked={editingMember?.is_published ?? true}
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
                    setEditingMember(null);
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

      <div className="space-y-6">
        {[1, 2, 3].map((level) => {
          const levelMembers = members.filter((m) => m.level === level);
          const levelNames = ["Top Management", "Middle Management", "Staff"];
          
          return (
            <div key={level}>
              <h3 className="text-lg font-semibold mb-3">{levelNames[level - 1]}</h3>
              <div className="grid gap-3">
                {levelMembers.map((member) => (
                  <div
                    key={member.id}
                    className="p-4 rounded-lg border bg-card flex justify-between items-center"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold">{member.name}</h4>
                        {!member.is_published && (
                          <span className="text-xs bg-muted px-2 py-1 rounded">
                            Draft
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{member.position}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditingMember(member);
                          setIsDialogOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(member.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                {levelMembers.length === 0 && (
                  <p className="text-sm text-muted-foreground italic">
                    No positions added yet
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
