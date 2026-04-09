import { NextRequest, NextResponse } from "next/server";

const PRIVY_APP_ID = process.env.PRIVY_APP_ID!;
const PRIVY_APP_SECRET = process.env.PRIVY_APP_SECRET!;
const PRIVY_API = "https://api.privy.io/v1";

function privyHeaders() {
  const credentials = Buffer.from(
    `${PRIVY_APP_ID}:${PRIVY_APP_SECRET}`
  ).toString("base64");
  return {
    Authorization: `Basic ${credentials}`,
    "privy-app-id": PRIVY_APP_ID,
    "Content-Type": "application/json",
  };
}

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json({ error: "userId required" }, { status: 400 });
    }

    const listRes = await fetch(
      `${PRIVY_API}/wallets?chain_type=starknet&user_id=${encodeURIComponent(userId)}`,
      { headers: privyHeaders() }
    );

    if (listRes.ok) {
      const listData = await listRes.json();
      const existing = (listData?.data ?? []).find(
        (w: { chain_type: string }) => w.chain_type === "starknet"
      );
      if (existing) {
        return NextResponse.json({
          walletId: existing.id,
          publicKey: existing.public_key,
          address: existing.address,
        });
      }
    }

    const createRes = await fetch(`${PRIVY_API}/wallets`, {
      method: "POST",
      headers: privyHeaders(),
      body: JSON.stringify({ chain_type: "starknet", user_id: userId }),
    });

    if (!createRes.ok) {
      const errText = await createRes.text();
      console.error("Privy wallet create error:", errText);
      return NextResponse.json(
        { error: "Failed to create Starknet wallet" },
        { status: createRes.status }
      );
    }

    const walletData = await createRes.json();

    return NextResponse.json({
      walletId: walletData.id,
      publicKey: walletData.public_key,
      address: walletData.address,
    });
  } catch (err) {
    console.error("Wallet creation error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
