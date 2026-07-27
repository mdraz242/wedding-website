
-- site_content: key/value JSON store for editable site content (homepage sections, services, brand assets, etc.)
CREATE TABLE public.site_content (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_content TO anon;
GRANT SELECT ON public.site_content TO authenticated;
GRANT ALL ON public.site_content TO service_role;
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "site_content public read" ON public.site_content FOR SELECT USING (true);

-- media_folders: virtual folder tree for the media library
CREATE TABLE public.media_folders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  parent_id UUID REFERENCES public.media_folders(id) ON DELETE CASCADE,
  path TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.media_folders TO anon;
GRANT SELECT ON public.media_folders TO authenticated;
GRANT ALL ON public.media_folders TO service_role;
ALTER TABLE public.media_folders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "media_folders public read" ON public.media_folders FOR SELECT USING (true);

-- media_assets: catalog of files uploaded to the `media` storage bucket
CREATE TABLE public.media_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  folder_id UUID REFERENCES public.media_folders(id) ON DELETE SET NULL,
  storage_path TEXT NOT NULL UNIQUE,
  filename TEXT NOT NULL,
  mime_type TEXT,
  size_bytes BIGINT,
  width INT,
  height INT,
  alt_text TEXT,
  tags TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.media_assets TO anon;
GRANT SELECT ON public.media_assets TO authenticated;
GRANT ALL ON public.media_assets TO service_role;
ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "media_assets public read" ON public.media_assets FOR SELECT USING (true);

CREATE INDEX idx_media_assets_folder ON public.media_assets(folder_id);
CREATE INDEX idx_media_assets_filename ON public.media_assets(filename);

-- Seed a root folder
INSERT INTO public.media_folders (name, path) VALUES ('Library', '/') ON CONFLICT DO NOTHING;

-- Seed default site_content sections (empty scaffolds; server fns will fill in)
INSERT INTO public.site_content (key, value) VALUES
  ('brand', '{"logo_url": null, "favicon_url": null, "tagline": "The Best | Since 1966"}'::jsonb),
  ('homepage.hero', '{"headline": "Timeless imagery, cinematic storytelling.", "subheadline": "Kamal Studios — since 1966", "video_urls": []}'::jsonb),
  ('homepage.about', '{"title": "A legacy in every frame", "body": "Since 1966, Kamal Studios has captured India''s most treasured moments."}'::jsonb),
  ('homepage.signature_services', '{"items": []}'::jsonb),
  ('homepage.marquee', '{"items": ["58+ Years of Craft", "10,000+ Weddings", "300+ Awards", "Global Publications"]}'::jsonb)
ON CONFLICT DO NOTHING;
