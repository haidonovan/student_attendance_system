export default function Loading() {
  return (
    <div className="flex flex-1 flex-col gap-4 sm:gap-6 p-3 sm:p-4 lg:p-6 bg-slate-50 dark:bg-slate-900">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="h-8 w-64 bg-slate-200 dark:bg-slate-700 rounded animate-pulse mb-2"></div>
          <div className="h-4 w-96 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-9 w-24 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
          <div className="h-9 w-32 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
        </div>
      </div>

      {/* Statistics Skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4">
        {Array.from({ length: 7 }).map((_, i) => (
          <div
            key={i}
            className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-3 sm:p-4"
          >
            <div className="h-4 w-20 bg-slate-200 dark:bg-slate-700 rounded animate-pulse mb-2"></div>
            <div className="h-6 w-12 bg-slate-200 dark:bg-slate-700 rounded animate-pulse mb-1"></div>
            <div className="h-3 w-16 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
          </div>
        ))}
      </div>

      {/* Filters Skeleton */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-6">
        <div className="h-6 w-32 bg-slate-200 dark:bg-slate-700 rounded animate-pulse mb-4"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 w-16 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
              <div className="h-10 w-full bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Charts Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-6">
          <div className="h-6 w-48 bg-slate-200 dark:bg-slate-700 rounded animate-pulse mb-2"></div>
          <div className="h-4 w-64 bg-slate-200 dark:bg-slate-700 rounded animate-pulse mb-4"></div>
          <div className="h-64 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
        </div>
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-6">
          <div className="h-6 w-32 bg-slate-200 dark:bg-slate-700 rounded animate-pulse mb-2"></div>
          <div className="h-4 w-48 bg-slate-200 dark:bg-slate-700 rounded animate-pulse mb-4"></div>
          <div className="h-64 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
        </div>
      </div>

      {/* Reports List Skeleton */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-6">
        <div className="h-6 w-32 bg-slate-200 dark:bg-slate-700 rounded animate-pulse mb-4"></div>
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="p-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50"
            >
              <div className="h-5 w-3/4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse mb-2"></div>
              <div className="h-4 w-1/2 bg-slate-200 dark:bg-slate-700 rounded animate-pulse mb-2"></div>
              <div className="h-3 w-full bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
