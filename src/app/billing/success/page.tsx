import { Suspense } from "react";
import { SuccessHandler } from "@/components/success-handler";

function SuccessFallback() {
  return <div className="mx-auto h-64 max-w-lg animate-pulse rounded-xl bg-muted/40" />;
}

async function SuccessParams({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const params = await searchParams;
  return <SuccessHandler sessionId={params.session_id ?? ""} />;
}

export default function BillingSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <Suspense fallback={<SuccessFallback />}>
        <SuccessParams searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
