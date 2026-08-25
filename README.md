# PULSE

Every pulse is real value, moved — not simulated. Send cUSD to someone
on Celo, and an AI agent writes the reaction line that goes with the
transfer. No likes, no farmed volume: just two independent wallets and a
public ledger of real transfers.

Built for the Celo Agents at Work Hackathon — Track 1: Value Moved.

## Stack
- Next.js 14 (App Router) + Tailwind
- ethers for wallet connect + cUSD transfers (MiniPay / any injected Celo wallet)
- Groq (llama3-8b-8192) for the reaction line agent
- Supabase for the public ledger (optional — falls back to in-memory Demo Mode)
