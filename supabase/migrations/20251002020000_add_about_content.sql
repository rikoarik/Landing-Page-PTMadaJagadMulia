-- Create about_content table
CREATE TABLE public.about_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT NOT NULL,
  image_url TEXT,
  stats JSONB DEFAULT '{}',
  version INTEGER DEFAULT 1,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  published_at TIMESTAMP WITH TIME ZONE
);

ALTER TABLE public.about_content ENABLE ROW LEVEL SECURITY;

-- RLS Policies for about_content
CREATE POLICY "Anyone can view published about content"
ON public.about_content FOR SELECT
USING (is_published = true);

CREATE POLICY "Admins and editors can manage about content"
ON public.about_content FOR ALL
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));

-- Create about_content_history table for tracking changes
CREATE TABLE public.about_content_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  about_content_id UUID NOT NULL REFERENCES public.about_content(id),
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT NOT NULL,
  image_url TEXT,
  stats JSONB DEFAULT '{}',
  version INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

ALTER TABLE public.about_content_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies for about_content_history
CREATE POLICY "Admins and editors can view history"
ON public.about_content_history FOR SELECT
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));

-- Create trigger to update updated_at
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.about_content
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();