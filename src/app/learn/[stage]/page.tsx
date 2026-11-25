import { Suspense } from "react";
import { LearnStageContent } from "@/components/learn-stage-content";
import { levels } from "@/lib/content";

export function generateStaticParams() {
  return levels.map((level) => ({ stage: level.id }));
}

function LearnStageFallback() {
  return <div className="mx-auto h-96 max-w-7xl animate-pulse px-4 py-12 sm:px-6 lg:px-8" />;
}

async function LearnStage({
  params,
}: {
  params: Promise<{ stage: string }>;
}) {
  const { stage } = await params;
  return <LearnStageContent stage={stage} />;
}

export default function LearnStagePage({
  params,
}: {
  params: Promise<{ stage: string }>;
}) {
  return (
    <Suspense fallback={<LearnStageFallback />}>
      <LearnStage params={params} />
    </Suspense>
  );
}
