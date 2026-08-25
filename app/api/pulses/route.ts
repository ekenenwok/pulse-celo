import { NextRequest, NextResponse } from "next/server";
import { listPulses, savePulse } from "@/lib/store";
import { generateReaction } from "@/lib/groq";

export async function GET() {
  const pulses = await listPulses(25);
  return NextResponse.json({ pulses });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { fromAddress, toAddress, amount, note, txHash } = body ?? {};

  if (!fromAddress || !toAddress || !amount || !txHash) {
    return NextResponse.json(
      { error: "fromAddress, toAddress, amount and txHash are required" },
      { status: 400 }
    );
  }

  const reaction = await generateReaction({ amount, note });

  const pulse = await savePulse({
    from_address: fromAddress,
    to_address: toAddress,
    amount,
    reaction,
    tx_hash: txHash,
  });

  return NextResponse.json({ pulse });
}
