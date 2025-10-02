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

interface TeamMember {
  id: string;
  name: string;
  position: string;
  initials: string;
  bio: string | null;
  avatar_url: string | null;
  is_published: boolean;
  sort_order: number;
}

export function TeamAdmin() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    const { data, error } = await supabase
      .from("team_members")
      .select("*")
      .order("sort_order");

    if (error) {
      toast({ title: "Error loading team members", variant: "destructive" });
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
      initials: formData.get("initials") as string,
      bio: formData.get("bio") as string || null,
      avatar_url: formData.get("avatar_url") as string || null,
      is_published: formData.get("is_published") === "on",
      sort_order: parseInt(formData.get("sort_order") as string) || 0,
    };

    if (editingMember) {
      const { error } = await supabase
        .from("team_members")
        .update(memberData)
        .eq("id", editingMember.id);

      if (error) {
        toast({ title: "Error updating team member", variant: "destructive" });
      } else {
        toast({ title: "Team member updated successfully" });
        setIsDialogOpen(false);
        setEditingMember(null);
        fetchMembers();
      }
    } else {
      const { error } = await supabase.from("team_members").insert([memberData]);

      if (error) {
        toast({ title: "Error creating team member", variant: "destructive" });
      } else {
        toast({ title: "Team member created successfully" });
        setIsDialogOpen(false);
        fetchMembers();
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this team member?")) return;

    const { error } = await supabase.from("team_members").delete().eq("id", id);

    if (error) {
      toast({ title: "Error deleting team member", variant: "destructive" });
    } else {
      toast({ title: "Team member deleted successfully" });
      fetchMembers();
    }
  };

  if (loading) return <div>Loading team members...</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Team Management</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingMember(null)} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Team Member
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingMember ? "Edit Team Member" : "Add New Team Member"}
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
                <Label htmlFor="initials">Initials</Label>
                <Input
                  id="initials"
                  name="initials"
                  defaultValue={editingMember?.initials}
                  required
                  maxLength={3}
                  placeholder="JD"
                />
              </div>
              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  name="bio"
                  defaultValue={editingMember?.bio || ""}
                  rows={3}
                  placeholder="Optional biography"
                />
              </div>
              <div>
                <Label htmlFor="avatar_url">Avatar URL</Label>
                <Input
                  id="avatar_url"
                  name="avatar_url"
                  type="url"
                  defaultValue={editingMember?.avatar_url || ""}
                  placeholder="https://example.com/avatar.jpg"
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

      <div className="grid gap-4">
        {members.map((member) => (
          <div
            key={member.id}
            className="p-4 rounded-lg border bg-card flex justify-between items-start"
          >
            <div className="flex gap-4 flex-1">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-xl font-bold">
                {member.initials}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-semibold">{member.name}</h3>
                  {!member.is_published && (
                    <span className="text-xs bg-muted px-2 py-1 rounded">
                      Draft
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mb-1">
                  {member.position}
                </p>
                {member.bio && (
                  <p className="text-xs text-muted-foreground">{member.bio}</p>
                )}
              </div>
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
      </div>
    </div>
  );
}
