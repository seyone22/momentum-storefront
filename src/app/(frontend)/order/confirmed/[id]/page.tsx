import { Suspense } from "react";
import OrderConfirmedClient from "./OrderConfirmedClient";

export const dynamic = "force-dynamic";

interface ConfirmedPageProps {
  params: Promise<{ id: string }>;
}

async function ConfirmedContent({ params }: ConfirmedPageProps) {
  const { id } = await params;
  return <OrderConfirmedClient orderId={id} />;
}

export default function OrderConfirmedPage({ params }: ConfirmedPageProps) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#fbfbf9] flex items-center justify-center text-xs uppercase tracking-widest text-neutral-500">Loading Order Confirmation...</div>}>
      <ConfirmedContent params={params} />
    </Suspense>
  );
}
