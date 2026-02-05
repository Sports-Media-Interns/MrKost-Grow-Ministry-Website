export default function TravelLoading() {
  return (
    <main className="min-h-screen flex flex-col pt-16">
      {/* Hero skeleton */}
      <div className="relative py-24 px-4 bg-muted animate-pulse">
        <div className="mx-auto max-w-screen-xl text-center">
          <div className="h-4 w-32 bg-muted-foreground/10 rounded mx-auto mb-4" />
          <div className="h-12 w-80 bg-muted-foreground/10 rounded mx-auto mb-6 max-w-full" />
          <div className="h-5 w-96 bg-muted-foreground/10 rounded mx-auto max-w-full" />
        </div>
      </div>

      {/* Map skeleton */}
      <div className="py-24 px-4">
        <div className="mx-auto max-w-screen-xl">
          <div className="h-8 w-64 bg-muted rounded mx-auto mb-8" />
          <div className="h-[700px] bg-muted rounded-xl animate-pulse" />
        </div>
      </div>

      {/* Tabs skeleton */}
      <div className="px-4 pb-24">
        <div className="mx-auto max-w-screen-xl">
          <div className="h-6 w-56 bg-muted rounded mx-auto mb-6" />
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="h-11 w-36 bg-muted rounded-[11px] animate-pulse"
              />
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-48 bg-muted rounded-xl animate-pulse"
              />
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
