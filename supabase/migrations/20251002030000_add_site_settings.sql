-- Create site_settings table
CREATE TABLE public.site_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view site settings"
ON public.site_settings FOR SELECT
USING (true);

CREATE POLICY "Admins and editors can manage site settings"
ON public.site_settings FOR ALL
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));

-- Trigger for updated_at
CREATE TRIGGER set_site_settings_updated_at
  BEFORE UPDATE ON public.site_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default settings
INSERT INTO public.site_settings (key, value) VALUES
  ('company_name', 'PT Mada Jagad Mulia'),
  ('company_address', 'Jl. Raya Tulungrejo, Bojonegoro, East Java, Indonesia'),
  ('company_phone', '+62 123 4567 890'),
  ('company_email', 'info@madajagadmulia.com'),
  ('whatsapp_number', '6281234567890'),
  ('hero_title', 'Building a Sustainable Future'),
  ('hero_subtitle', 'Delivering engineering and construction solutions that serve people, nature, and progress.'),
  ('about_text', 'PT Mada Jagad Mulia is a leading engineering and construction company committed to excellence, innovation, and sustainability.');