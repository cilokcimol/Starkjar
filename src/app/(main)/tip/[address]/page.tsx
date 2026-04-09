import { Metadata } from "next";
import { TipPageClient } from "@/components/tip/TipPageClient";

type Props = {
  params: Promise<{ address: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { address } = await params;

  let creatorName = "a creator";
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/api/creator?address=${address}`,
      { cache: "no-store" }
    );
    if (res.ok) {
      const data = await res.json();
      creatorName = data.name;
    }
  } catch {}

  return {
    title: `Tip ${creatorName} on Starkjar`,
    description: `Send gasless STRK tips to ${creatorName} on Starknet. Powered by Starkzap SDK. Zero gas fees required.`,
  };
}

export default async function TipPage({ params }: Props) {
  const { address } = await params;

  let creator = null;
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/api/creator?address=${address}`,
      { cache: "no-store" }
    );
    if (res.ok) {
      creator = await res.json();
    }
  } catch {}

  return <TipPageClient creatorAddress={address} initialCreator={creator} />;
}
