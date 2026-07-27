CREATE TABLE public.admin_settings (
  id int PRIMARY KEY DEFAULT 1,
  password_hash text NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT admin_settings_singleton CHECK (id = 1)
);

GRANT ALL ON public.admin_settings TO service_role;

ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;

-- No policies. Only service_role (used by admin server functions) may read/write.

INSERT INTO public.admin_settings (id, password_hash)
VALUES (1, 'bc3cccb57d68a8162178493717eae3ed342d671d6cd67d4efa249e6127381eac')
ON CONFLICT (id) DO NOTHING;