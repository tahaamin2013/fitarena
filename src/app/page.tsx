import { CategoryGrid } from "@/components/category-grid"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Page() {
  return (
    <main className="font-sans">
      <section className="px-4 md:px-8 pt-8 md:pt-12 pb-6 md:pb-8 mx-auto">
        <div className="rounded-xl border bg-card text-card-foreground p-6 md:p-10">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <h1 className="text-4xl md:text-6xl font-extrabold text-balance tracking-tight">Fit Arena</h1>
              <p className="mt-2 text-sm md:text-base text-muted-foreground leading-relaxed">
                Choose a focus area or start a full session. No sign-in required.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Button asChild size="lg" className="rounded-full">
                <Link href="/run/all" aria-label="Start all workouts">
                  Start All
                </Link>
              </Button>
              <Button asChild variant="secondary" size="lg" className="rounded-full">
                <a href="#categories" aria-label="Jump to categories">
                  Explore
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section id="categories" aria-labelledby="categories-heading" className="px-4 md:px-8 pb-12 mx-auto">
        <h2 id="categories-heading" className="text-xl md:text-2xl font-semibold sr-only">
          Workout Categories
        </h2>
        <CategoryGrid />
      </section>
    </main>
  )
}
