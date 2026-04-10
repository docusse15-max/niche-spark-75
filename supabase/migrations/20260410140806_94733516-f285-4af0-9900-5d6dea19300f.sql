ALTER TABLE public.activity_logs ADD COLUMN IF NOT EXISTS latitude double precision;
ALTER TABLE public.activity_logs ADD COLUMN IF NOT EXISTS longitude double precision;
ALTER TABLE public.activity_logs ADD COLUMN IF NOT EXISTS user_agent text DEFAULT '';
ALTER TABLE public.activity_logs ADD COLUMN IF NOT EXISTS page text DEFAULT '';