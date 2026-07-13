alter table public.form_submissions
  add column if not exists customer_confirmation_sent_at timestamptz,
  add column if not exists customer_confirmation_error text;
