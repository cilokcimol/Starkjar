import { NextRequest, NextResponse } from "next/server";

const AVNU_PAYMASTER_URL = "https://sepolia.paymaster.avnu.fi";
const AVNU_API_KEY = process.env.AVNU_PAYMASTER_API_KEY;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (AVNU_API_KEY) {
      headers["x-paymaster-api-key"] = AVNU_API_KEY;
    }

    const response = await fetch(AVNU_PAYMASTER_URL, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (err) {
    console.error("Paymaster proxy error:", err);
    return NextResponse.json(
      { error: "Paymaster request failed" },
      { status: 500 }
    );
  }
}
