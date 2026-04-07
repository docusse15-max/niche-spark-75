
CREATE TABLE public.visitas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id TEXT NOT NULL DEFAULT '',
  lead_empresa TEXT NOT NULL,
  comercial TEXT NOT NULL,
  data_visita TIMESTAMP WITH TIME ZONE NOT NULL,
  duracao_min INTEGER NOT NULL DEFAULT 30,
  status TEXT NOT NULL DEFAULT 'pendente',
  notas TEXT DEFAULT '',
  endereco TEXT DEFAULT '',
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.visitas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read visitas" ON public.visitas FOR SELECT USING (true);
CREATE POLICY "Anyone can insert visitas" ON public.visitas FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update visitas" ON public.visitas FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete visitas" ON public.visitas FOR DELETE USING (true);
