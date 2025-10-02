import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { GlassCard } from "@/components/GlassCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { BarChart2, Eye, EyeOff, History, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";

import type { Json } from "@/integrations/supabase/types";

interface AboutContent {
  id: string;
  title: string;
  subtitle: string | null;
  description: string;
  image_url: string | null;
  stats: Json;
  version: number;
  is_published: boolean;
  created_at: string | null;
  updated_at: string | null;
  published_at: string | null;
}

interface AboutHistory {
  id: string;
  about_content_id: string;
  version: number;
  title: string;
  subtitle: string | null;
  description: string;
  image_url: string | null;
  stats: Json;
  created_at: string;
  created_by: string | null;
}

export function AboutAdmin() {
  const [content, setContent] = useState<AboutContent | null>(null);
  const [history, setHistory] = useState<AboutHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchContent();
    fetchHistory();
  }, []);

  const fetchContent = async () => {
    const { data } = await supabase
      .from('about_content')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (data) {
      setContent(data);
    } else {
      // Create initial content if none exists
      const { data: newContent } = await supabase
        .from('about_content')
        .insert({
          title: 'About Us',
          subtitle: 'Our Story',
          description: 'Enter your company description here...',
          stats: {},
          version: 1,
          is_published: false,
        })
        .select()
        .single();

      if (newContent) {
        setContent(newContent);
      }
    }
    setLoading(false);
  };

  const fetchHistory = async () => {
    const { data } = await supabase
      .from('about_content_history')
      .select('*')
      .order('version', { ascending: false });

    if (data) {
      setHistory(data);
    }
  };

  const handleSave = async () => {
    if (!content) return;

    // Create history record
    await supabase
      .from('about_content_history')
      .insert({
        about_content_id: content.id,
        title: content.title,
        subtitle: content.subtitle,
        description: content.description,
        image_url: content.image_url,
        stats: content.stats,
        version: content.version + 1,
      });

    // Update current content
    const { error } = await supabase
      .from('about_content')
      .update({
        ...content,
        version: content.version + 1,
        updated_at: new Date().toISOString(),
      })
      .eq('id', content.id);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error saving content",
        description: error.message,
      });
    } else {
      toast({
        title: "Content saved successfully",
        description: "Your changes have been saved.",
      });
      fetchHistory();
    }
  };

  const handlePublish = async () => {
    if (!content) return;

    const { error } = await supabase
      .from('about_content')
      .update({
        is_published: !content.is_published,
        published_at: !content.is_published ? new Date().toISOString() : null,
      })
      .eq('id', content.id);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error updating publish status",
        description: error.message,
      });
    } else {
      setContent({
        ...content,
        is_published: !content.is_published,
        published_at: !content.is_published ? new Date().toISOString() : null,
      });
      toast({
        title: content.is_published ? "Content unpublished" : "Content published",
        description: content.is_published
          ? "The content is now hidden from the website."
          : "The content is now visible on the website.",
      });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grid gap-6">
      {/* Editor */}
      <GlassCard className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">About Content</h2>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePublish}
            >
              {content?.is_published ? (
                <>
                  <EyeOff className="w-4 h-4 mr-2" />
                  Unpublish
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4 mr-2" />
                  Publish
                </>
              )}
            </Button>
            <Button onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>

        <div className="grid gap-6">
          <div>
            <Input
              placeholder="Title"
              value={content?.title ?? ''}
              onChange={(e) =>
                setContent(content ? { ...content, title: e.target.value } : null)
              }
            />
          </div>
          <div>
            <Input
              placeholder="Subtitle"
              value={content?.subtitle ?? ''}
              onChange={(e) =>
                setContent(content ? { ...content, subtitle: e.target.value } : null)
              }
            />
          </div>
          <div>
            <Textarea
              placeholder="Description"
              value={content?.description ?? ''}
              onChange={(e) =>
                setContent(content ? { ...content, description: e.target.value } : null)
              }
              rows={10}
            />
          </div>
          <div>
            <Input
              placeholder="Image URL"
              value={content?.image_url ?? ''}
              onChange={(e) =>
                setContent(content ? { ...content, image_url: e.target.value } : null)
              }
            />
          </div>
        </div>
      </GlassCard>

      {/* History */}
      <GlassCard className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <History className="w-5 h-5" />
          <h3 className="text-xl font-semibold">Version History</h3>
        </div>
        <ScrollArea className="h-[300px]">
          <div className="space-y-4">
            {history.map((version) => (
              <div
                key={version.id}
                className="p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium">Version {version.version}</div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(version.created_at).toLocaleDateString()}
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  {version.title}
                  {version.subtitle && ` - ${version.subtitle}`}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </GlassCard>
    </div>
  );
}