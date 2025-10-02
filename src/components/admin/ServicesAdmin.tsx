import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, LayoutGrid, Eye, EyeOff, GripVertical } from "lucide-react";
import { BatchActions } from "@/components/admin/BatchActions";
import { GlassCard } from "@/components/GlassCard";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  bg_color: string;
  is_published: boolean;
  sort_order: number;
}

interface ColorOption {
  value: string;
  bgValue: string;
  label: string;
}

const colorOptions: ColorOption[] = [
  { value: "text-blue-500", bgValue: "bg-blue-500/10", label: "Blue" },
  { value: "text-green-500", bgValue: "bg-green-500/10", label: "Green" },
  { value: "text-purple-500", bgValue: "bg-purple-500/10", label: "Purple" },
  { value: "text-amber-500", bgValue: "bg-amber-500/10", label: "Amber" },
  { value: "text-red-500", bgValue: "bg-red-500/10", label: "Red" },
  { value: "text-pink-500", bgValue: "bg-pink-500/10", label: "Pink" },
];

const iconOptions = [
  "LayoutGrid", "Activity", "Box", "Building", "Cog", "Database",
  "FileText", "Globe", "Heart", "Home", "Image", "Link", "Map",
  "MessageSquare", "Phone", "Settings", "Shield", "Star", "Tool",
  "Zap"
];

export function ServicesAdmin() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .order("sort_order");

    if (error) {
      toast({ title: "Error loading services", variant: "destructive" });
    } else {
      setServices(data || []);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const serviceData = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      icon: formData.get("icon") as string,
      color: formData.get("color") as string,
      bg_color: formData.get("bg_color") as string,
      is_published: formData.get("is_published") === "on",
      sort_order: parseInt(formData.get("sort_order") as string) || services.length,
    };

    if (editingService) {
      const { error } = await supabase
        .from("services")
        .update(serviceData)
        .eq("id", editingService.id);

      if (error) {
        toast({ title: "Error updating service", variant: "destructive" });
      } else {
        toast({ title: "Service updated successfully" });
        setIsDialogOpen(false);
        setEditingService(null);
        fetchServices();
      }
    } else {
      const { error } = await supabase.from("services").insert([serviceData]);

      if (error) {
        toast({ title: "Error creating service", variant: "destructive" });
      } else {
        toast({ title: "Service created successfully" });
        setIsDialogOpen(false);
        fetchServices();
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this service?")) return;

    const { error } = await supabase.from("services").delete().eq("id", id);

    if (error) {
      toast({ title: "Error deleting service", variant: "destructive" });
    } else {
      toast({ title: "Service deleted successfully" });
      fetchServices();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-pulse text-lg">Loading services...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Services Management</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="default" onClick={() => setEditingService(null)} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Service
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingService ? "Edit Service" : "Add New Service"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Enter service title"
                  defaultValue={editingService?.title}
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Enter service description"
                  defaultValue={editingService?.description}
                  required
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="icon">Icon</Label>
                <Select
                  name="icon"
                  defaultValue={editingService?.icon || "LayoutGrid"}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select an icon" />
                  </SelectTrigger>
                  <SelectContent>
                    {iconOptions.map((icon) => (
                      <SelectItem key={icon} value={icon}>
                        {icon}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="color">Color Theme</Label>
                <Select
                  name="color"
                  defaultValue={editingService ? 
                    colorOptions.find(o => o.value === editingService.color)?.value || colorOptions[0].value 
                    : colorOptions[0].value
                  }
                  onValueChange={(value) => {
                    const option = colorOptions.find(o => o.value === value);
                    if (option) {
                      const bgInput = document.querySelector('input[name="bg_color"]') as HTMLInputElement;
                      if (bgInput) bgInput.value = option.bgValue;
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a color" />
                  </SelectTrigger>
                  <SelectContent>
                    {colorOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center gap-2">
                          <div className={`w-4 h-4 rounded ${option.bgValue}`} />
                          {option.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  type="hidden"
                  name="bg_color"
                  defaultValue={editingService?.bg_color || colorOptions[0].bgValue}
                />
              </div>
              <div>
                <Label htmlFor="sort_order">Sort Order</Label>
                <Input
                  id="sort_order"
                  name="sort_order"
                  type="number"
                  defaultValue={editingService?.sort_order || services.length}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_published"
                  name="is_published"
                  defaultChecked={editingService?.is_published ?? true}
                />
                <Label htmlFor="is_published">Published</Label>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="ghost" onClick={() => {
                  setIsDialogOpen(false);
                  setEditingService(null);
                }}>
                  Cancel
                </Button>
                <Button type="submit">Save</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {selectedIds.length > 0 && (
        <BatchActions
          selectedIds={selectedIds}
          tableName="services"
          onSuccess={fetchServices}
          onClearSelection={() => setSelectedIds([])}
        />
      )}

      <div className="grid gap-4">
        {services.map((service) => (
          <GlassCard
            key={service.id}
            className={`flex items-start gap-4 p-4 ${
              selectedIds.includes(service.id) ? "ring-2 ring-primary" : ""
            }`}
          >
            <Checkbox
              checked={selectedIds.includes(service.id)}
              onCheckedChange={(checked) => {
                if (checked) {
                  setSelectedIds([...selectedIds, service.id]);
                } else {
                  setSelectedIds(selectedIds.filter(id => id !== service.id));
                }
              }}
            />

            <div className={`p-3 ${service.bg_color} rounded-xl`}>
              <LayoutGrid className={`h-5 w-5 ${service.color}`} />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold truncate">{service.title}</h3>
                    {!service.is_published && (
                      <span className="text-xs text-muted-foreground">Draft</span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {service.description}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setEditingService(service);
                      setIsDialogOpen(true);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(service.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <GripVertical className="h-4 w-4 cursor-move" />
                  </Button>
                </div>
              </div>
              <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
                <span>Order: {service.sort_order}</span>
                {service.is_published ? (
                  <span className="flex items-center gap-1">
                    <Eye className="h-3 w-3" /> Published
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <EyeOff className="h-3 w-3" /> Draft
                  </span>
                )}
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};