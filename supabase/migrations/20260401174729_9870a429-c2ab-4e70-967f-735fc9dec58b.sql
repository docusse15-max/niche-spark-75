
CREATE TABLE public.activity_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  action TEXT NOT NULL,
  lead_empresa TEXT NOT NULL,
  lead_id TEXT NOT NULL DEFAULT '',
  author TEXT NOT NULL DEFAULT 'Sistema',
  details TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read activity logs"
  ON public.activity_logs FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert activity logs"
  ON public.activity_logs FOR INSERT
  WITH CHECK (true);
