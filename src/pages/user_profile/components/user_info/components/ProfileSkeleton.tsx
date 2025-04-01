// components/ProfileSkeleton.tsx
export const ProfileSkeleton = () => (
  <section className="animate-pulse bg-white dark:bg-gray-900 rounded-lg shadow-md overflow-hidden">
    <div className="relative h-48 bg-gray-200">
      <div className="w-full h-full bg-gray-300" />
      <div className="absolute -bottom-16 left-4">
        <div className="w-32 h-32 rounded-full bg-gray-300 border-4 border-white" />
      </div>
    </div>

    <div className="pt-20 px-6 pb-6 space-y-4">
      <div className="mb-4 space-y-2">
        <div className="h-6 bg-gray-300 w-1/2 rounded" />
        <div className="h-4 bg-gray-300 w-1/3 rounded" />
        <div className="h-4 bg-gray-300 w-1/4 rounded" />
        <div className="h-4 bg-gray-300 w-1/6 rounded" />
      </div>

      <div className="flex max-w-xl flex-wrap gap-2">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-8 bg-gray-300 rounded-full flex-grow" />
        ))}
      </div>

      <div className="space-y-1">
        <div className="h-4 bg-gray-300 w-full rounded" />
        <div className="h-4 bg-gray-300 w-1/2 rounded" />
      </div>
    </div>
  </section>
);
