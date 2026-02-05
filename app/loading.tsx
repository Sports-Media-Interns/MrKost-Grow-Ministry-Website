export default function Loading() {
  return (
    <main className="min-h-screen flex items-center justify-center pt-16">
      <div className="flex flex-col items-center gap-4">
        <div className="size-10 border-4 border-muted border-t-accent rounded-full animate-spin" />
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    </main>
  )
}
