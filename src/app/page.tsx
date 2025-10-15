import { CategoryGrid } from "@/components/category-grid"

export default function Page() {
  return (
    <main className="font-sans">
      <section className="px-4 md:px-8 pt-8 md:pt-12 pb-6 md:pb-8 mx-auto max-w-6xl">
        <div className="fa-hero p-6 md:p-10">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <h1 className="text-4xl md:text-6xl font-extrabold text-balance">Fit Arena</h1>
              <p className="mt-2 text-sm md:text-base opacity-90">
                Choose a focus area or start a full session. No sign-in required.
              </p>
            </div>
            <a
              href="/run/all"
              className="inline-flex items-center justify-center h-11 px-6 rounded-full text-base md:text-lg"
              style={{ backgroundColor: "var(--background)", color: "var(--foreground)" }}
              aria-label="Start all workouts"
            >
              Start All
            </a>
          </div>
        </div>
      </section>

      <section className="px-4 md:px-8 pb-12 mx-auto max-w-6xl">
        {/* categories grid */}
        <CategoryGrid />
      </section>
    </main>
  )
}
