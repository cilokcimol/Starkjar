import { NextRequest, NextResponse } from "next/server";

const PRIVY_APP_ID = process.env.PRIVY_APP_ID!;
const PRIVY_APP_SECRET = process.env.PRIVY_APP_SECRET!;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { walletId, hash } = body;

    if (!walletId || !hash) {
      return NextResponse.json(
        { error: "walletId and hash are required" },
        { status: 400 }
      );
    }

    const credentials = Buffer.from(
      `${PRIVY_APP_ID}:${PRIVY_APP_SECRET}`
    ).toString("base64");

    const response = await fetch(
      `https://api.privy.io/v1/wallets/${walletId}/rpc`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${credentials}`,
          "privy-app-id": PRIVY_APP_ID,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          method: "stark_sign",
          params: { hash },
        }),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      console.error("Privy signing error:", errText);
      return NextResponse.json(
        { error: "Privy signing failed" },
        { status: response.status }
      );
    }

    const data = await response.json();
    const signature: string = data?.data?.signature ?? data?.signature ?? "";

    if (!signature) {
      return NextResponse.json(
        { error: "No signature returned by Privy" },
        { status: 500 }
      );
    }

    return NextResponse.json({ signature });
  } catch (err) {
    console.error("Wallet signing error:", err);
    return NextResponse.json(
      { error: "Failed to sign transaction" },
      { status: 500 }
    );
  }
}
