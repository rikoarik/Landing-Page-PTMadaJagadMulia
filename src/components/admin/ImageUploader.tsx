import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { ImageIcon, Loader2, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface ImageUploaderProps {
  initialImage?: string | null;
  bucketName: string;
  folderPath: string;
  onUpload: (url: string) => void;
  onRemove?: () => void;
}

export function ImageUploader({ initialImage, bucketName, folderPath, onUpload, onRemove }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(initialImage || null);
  const { toast } = useToast();

  const uploadImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${folderPath}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);

      const imageUrl = data.publicUrl;
      setPreview(imageUrl);
      onUpload(imageUrl);
      
      toast({
        title: "Image uploaded successfully",
        variant: "default",
      });
    } catch (error: any) {
      toast({
        title: "Error uploading image",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = async () => {
    if (preview && onRemove) {
      setPreview(null);
      onRemove();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Input
          type="file"
          accept="image/*"
          onChange={uploadImage}
          disabled={uploading}
          className="max-w-sm"
        />
        {uploading && (
          <Loader2 className="h-4 w-4 animate-spin" />
        )}
      </div>

      {preview && (
        <div className="relative w-full max-w-sm">
          <div className="relative aspect-video rounded-lg overflow-hidden bg-black/5">
            <img
              src={preview}
              alt="Preview"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
          <Button
            variant="destructive"
            size="icon"
            className="absolute -top-2 -right-2 h-6 w-6"
            onClick={handleRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {!preview && !uploading && (
        <div className="w-full max-w-sm aspect-video rounded-lg bg-black/5 flex items-center justify-center">
          <ImageIcon className="h-8 w-8 text-muted-foreground" />
        </div>
      )}
    </div>
  );
}