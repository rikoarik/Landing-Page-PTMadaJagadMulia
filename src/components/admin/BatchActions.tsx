import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, ArrowUpDown, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";

type TableName = "organization_structure" | "projects" | "services" | "team_members" | "testimonials";

interface BatchActionsProps {
  selectedIds: string[];
  tableName: TableName;
  onSuccess: () => void;
  onClearSelection: () => void;
}

export function BatchActions({ selectedIds, tableName, onSuccess, onClearSelection }: BatchActionsProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handlePublish = async (publish: boolean) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from(tableName)
        .update({ is_published: publish })
        .in('id', selectedIds);

      if (error) throw error;

      toast({
        title: `Successfully ${publish ? 'published' : 'unpublished'} ${selectedIds.length} items`,
        variant: "default",
      });
      onSuccess();
      onClearSelection();
    } catch (error: any) {
      toast({
        title: `Error updating items`,
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete ${selectedIds.length} items? This cannot be undone.`)) {
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase
        .from(tableName)
        .delete()
        .in('id', selectedIds);

      if (error) throw error;

      toast({
        title: `Successfully deleted ${selectedIds.length} items`,
        variant: "default",
      });
      onSuccess();
      onClearSelection();
    } catch (error: any) {
      toast({
        title: `Error deleting items`,
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2 py-4">
      <div className="text-sm text-foreground/60">
        {selectedIds.length} items selected
      </div>
      
      <div className="flex-1" />

      <Button
        variant="outline"
        size="sm"
        className="gap-2"
        onClick={() => handlePublish(true)}
        disabled={loading}
      >
        <Eye className="h-4 w-4" />
        Publish
      </Button>

      <Button
        variant="outline"
        size="sm"
        className="gap-2"
        onClick={() => handlePublish(false)}
        disabled={loading}
      >
        <EyeOff className="h-4 w-4" />
        Unpublish
      </Button>

      <Button
        variant="destructive"
        size="sm"
        className="gap-2"
        onClick={handleDelete}
        disabled={loading}
      >
        <Trash2 className="h-4 w-4" />
        Delete
      </Button>
    </div>
  );
}