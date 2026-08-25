import Groq from "groq-sdk";

const client = process.env.GROQ_API_KEY
  ? new Groq({ apiKey: process.env.GROQ_API_KEY })
  : null;

/**
 * Generates a short one-line reaction to a pulse (a tip/transfer).
 * Falls back to a static line in demo mode if no GROQ_API_KEY is set.
 */
export async function generateReaction(params: {
  amount: string;
  note?: string;
  senderTag?: string;
}): Promise<string> {
  const { amount, note, senderTag } = params;

  if (!client) {
    return demoReaction(amount);
  }

  const prompt = `You write a single short line (max 14 words) reacting to someone sending ${amount} cUSD${
    note ? ` with the note: "${note}"` : ""
  }${senderTag ? ` from ${senderTag}` : ""}.
Tone: warm, a little witty, never cringe, never emoji-heavy. No hashtags. Output only the line, no quotes.`;

  try {
    const completion = await client.chat.completions.create({
      model: "llama3-8b-8192",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 40,
      temperature: 0.9,
    });
    const text = completion.choices[0]?.message?.content?.trim();
    return text || demoReaction(amount);
  } catch {
    return demoReaction(amount);
  }
}

function demoReaction(amount: string) {
  const lines = [
    `${amount} cUSD, sent clean — the ledger notices.`,
    `A small pulse, a real one. ${amount} cUSD moved.`,
    `Value in motion: ${amount} cUSD, no strings.`,
    `That's ${amount} cUSD of real appreciation, onchain.`,
  ];
  return lines[Math.floor(Math.random() * lines.length)];
}
