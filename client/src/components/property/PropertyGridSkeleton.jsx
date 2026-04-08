import { Skeleton } from "../common/Skeleton";

export const PropertyGridSkeleton = ({ count = 6 }) => (
  <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
    {Array.from({ length: count }).map((_, index) => (
      <div key={index} className="overflow-hidden rounded-[28px] border border-slate-200 bg-white p-0 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <Skeleton className="h-72 w-full rounded-none" />
        <div className="space-y-4 p-6">
          <Skeleton className="h-5 w-28" />
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-11 w-36 rounded-full" />
        </div>
      </div>
    ))}
  </div>
);
