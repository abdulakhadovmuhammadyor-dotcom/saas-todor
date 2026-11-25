import { Suspense } from "react";
import { BillingContent } from "@/components/billing-content";

function BillingFallback() {
  return (
    <div className="mx-auto h-96 max-w-6xl animate-pulse rounded-xl bg-muted/40 px-4 py-12 sm:px-6 lg:px-8" />
  );
}

async function BillingParams({
  searchParams,
}: {
  searchParams: Promise<{ canceled?: string; success?: string }>;
}) {
  const params = await searchParams;
  return <BillingContent canceled={params.canceled === "1"} success={params.success === "1"} />;
}

export default function BillingPage({
  searchParams,
}: {
  searchParams: Promise<{ canceled?: string; success?: string }>;
}) {
  return (
    <Suspense fallback={<BillingFallback />}>
      <BillingParams searchParams={searchParams} />
    </Suspense>
  );
}
