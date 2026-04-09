import { NextRequest, NextResponse } from "next/server";
import { creatorsDb } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const address = searchParams.get("address");

    if (!address) {
      return NextResponse.json({ error: "address required" }, { status: 400 });
    }

    const creator = creatorsDb.get(address.toLowerCase());
    if (!creator) {
      return NextResponse.json({ error: "Creator not found" }, { status: 404 });
    }

    return NextResponse.json(creator);
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { address, name, bio, handle, avatarUrl } = body;

    if (!address || !name) {
      return NextResponse.json(
        { error: "address and name required" },
        { status: 400 }
      );
    }

    const creator = {
      address: address.toLowerCase(),
      name,
      bio: bio ?? "",
      handle: handle ?? address.slice(0, 8),
      avatarUrl: avatarUrl ?? null,
      totalReceived: "0",
      tipCount: 0,
      joinedAt: new Date().toISOString(),
    };

    creatorsDb.set(address.toLowerCase(), creator);
    return NextResponse.json(creator, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
