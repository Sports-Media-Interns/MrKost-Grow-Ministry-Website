export default function ServicesLoading() {
  return (
    <main className="min-h-screen flex flex-col pt-16">
      {/* Hero skeleton */}
      <div className="relative py-24 px-4 bg-muted animate-pulse">
        <div className="mx-auto max-w-screen-xl text-center">
          <div className="h-4 w-32 bg-muted-foreground/10 rounded mx-auto mb-4" />
          <div className="h-12 w-72 bg-muted-foreground/10 rounded mx-auto mb-6" />
          <div className="h-5 w-96 bg-muted-foreground/10 rounded mx-auto max-w-full" />
        </div>
      </div>

      {/* Service selector skeleton */}
      <div className="py-12 px-4">
        <div className="mx-auto max-w-screen-xl">
          <div className="h-8 w-80 bg-muted rounded mx-auto mb-6 max-w-full" />
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {Array.from({ length: 7 }).map((_, i) => (
              <div
                key={i}
                className="h-11 w-40 bg-muted rounded-[11px] animate-pulse"
              />
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <div className="aspect-[16/9] bg-muted rounded-2xl animate-pulse mb-8" />
              <div className="h-4 w-48 bg-muted rounded mb-3" />
              <div className="h-8 w-64 bg-muted rounded mb-4" />
              <div className="h-20 w-full bg-muted rounded" />
            </div>
            <div className="bg-muted rounded-2xl p-8 animate-pulse">
              <div className="h-6 w-32 bg-muted-foreground/10 rounded mb-6" />
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="h-4 w-full bg-muted-foreground/10 rounded mb-4"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
