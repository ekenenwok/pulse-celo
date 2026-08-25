import { createClient } from "@supabase/supabase-js";

export type Pulse = {
  id: string;
  from_address: string;
  to_address: string;
  amount: string;
  reaction: string;
  tx_hash: string;
  created_at: string;
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase =
  supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

// In-memory fallback so the app runs in Demo Mode without Supabase configured.
const demoPulses: Pulse[] = [];

export async function savePulse(pulse: Omit<Pulse, "id" | "created_at">) {
  const row: Pulse = {
    ...pulse,
    id: crypto.randomUUID(),
    created_at: new Date().toISOString(),
  };

  if (supabase) {
    const { error } = await supabase.from("pulses").insert(row);
    if (error) throw error;
    return row;
  }

  demoPulses.unshift(row);
  demoPulses.splice(50); // keep it bounded
  return row;
}

export async function listPulses(limit = 25): Promise<Pulse[]> {
  if (supabase) {
    const { data, error } = await supabase
      .from("pulses")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);
    if (error) throw error;
    return data as Pulse[];
  }

  return demoPulses.slice(0, limit);
}
