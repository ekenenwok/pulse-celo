-- Run this in the Supabase SQL editor to create the pulses table.
create table if not exists pulses (
  id uuid primary key default gen_random_uuid(),
  from_address text not null,
  to_address text not null,
  amount text not null,
  reaction text not null,
  tx_hash text not null,
  created_at timestamptz not null default now()
);

create index if not exists pulses_created_at_idx on pulses (created_at desc);
