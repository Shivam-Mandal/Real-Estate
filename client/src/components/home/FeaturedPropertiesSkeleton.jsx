import { Skeleton } from "../common/Skeleton";

export const FeaturedPropertiesSkeleton = () => (
  <section className="py-12 md:py-16">
    <div className="shell">
      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="glass-card overflow-hidden p-0">
            <Skeleton className="h-72 w-full rounded-none" />
            <div className="space-y-4 p-6">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-5 w-56" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-24 w-full rounded-3xl" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);
