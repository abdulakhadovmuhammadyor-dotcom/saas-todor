import { Suspense } from "react";
import { LessonContent } from "@/components/lesson-content";
import { lessons } from "@/lib/content";

export function generateStaticParams() {
  return lessons.map((lesson) => ({ id: lesson.id }));
}

function LessonFallback() {
  return <div className="mx-auto h-96 max-w-7xl animate-pulse px-4 py-10 sm:px-6 lg:px-8" />;
}

async function Lesson({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <LessonContent id={id} />;
}

export default function LessonPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense fallback={<LessonFallback />}>
      <Lesson params={params} />
    </Suspense>
  );
}
