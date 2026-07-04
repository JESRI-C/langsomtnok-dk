CREATE TABLE public.cancellation_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number TEXT,
  full_name TEXT NOT NULL,
  address TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  order_date DATE,
  received_date DATE,
  reason TEXT,
  signed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ip_hash TEXT,
  user_agent TEXT,
  status TEXT NOT NULL DEFAULT 'received',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT ALL ON public.cancellation_requests TO service_role;
ALTER TABLE public.cancellation_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role manages cancellation requests"
  ON public.cancellation_requests FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');