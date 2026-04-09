import { NextRequest, NextResponse } from "next/server";
import { tipsDb, creatorsDb } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const creatorAddress = searchParams.get("creator");

    if (!creatorAddress) {
      return NextResponse.json({ error: "creator address required" }, { status: 400 });
    }

    const tips = tipsDb.get(creatorAddress.toLowerCase()) ?? [];
    return NextResponse.json({ tips });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { creatorAddress, donorAddress, amount, message, txHash } = body;

    if (!creatorAddress || !donorAddress || !amount || !txHash) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const tip = {
      id: `${txHash}-${Date.now()}`,
      creatorAddress: creatorAddress.toLowerCase(),
      donorAddress: donorAddress.toLowerCase(),
      amount,
      message: message ?? "",
      txHash,
      timestamp: new Date().toISOString(),
    };

    const existing = tipsDb.get(creatorAddress.toLowerCase()) ?? [];
    tipsDb.set(creatorAddress.toLowerCase(), [tip, ...existing]);

    const creator = creatorsDb.get(creatorAddress.toLowerCase());
    if (creator) {
      creator.tipCount = (creator.tipCount ?? 0) + 1;
      creatorsDb.set(creatorAddress.toLowerCase(), creator);
    }

    return NextResponse.json({ tip }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
