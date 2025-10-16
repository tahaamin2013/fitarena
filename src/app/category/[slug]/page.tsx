import Link from "next/link"
import Image from "next/image"
import { getWorkout } from "@/lib/workouts"
import { CATEGORIES } from "@/lib/categories"
import { ChevronLeft } from 'lucide-react'

export default function CategoryPlanPage({
  params,
}: {
  params: { slug: string }
}) {
  const { slug } = params
  const category = CATEGORIES.find((c) => c.slug === slug)
  const items = getWorkout(slug)

  return (
    <main className="min-h-dvh bg-background">
      {/* Header */}
 <header className="fixed top-0 left-0 w-full z-50 bg-gradient-to-b from-black/70 to-transparent px-4 md:px-8 py-4 flex items-center">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-white hover:opacity-80 transition-opacity"
        aria-label="Back to home"
      >
        <ChevronLeft className="w-5 h-5 stroke-current" aria-hidden="true" />
        <span>Back</span>
      </Link>
    </header>
      {/* Cover */}
      <div className="relative h-48 md:h-64">
        {category ? (
          <>
            <Image
              src={
                category.image || "/placeholder.svg?height=400&width=1200&query=category%20cover" || "/placeholder.svg"
              }
              alt={`${category.title} cover`}
              fill
              priority
unoptimized

              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
            <div className="absolute inset-x-4 md:inset-x-8 bottom-5 md:bottom-8 text-white">
              <h2 className="text-2xl md:text-3xl font-semibold">{category.title} Workout</h2>
              {category.tagline ? <p className="text-white/80">{category.tagline}</p> : null}
            </div>
          </>
        ) : null}
      </div>

      {/* List */}
      <section aria-labelledby="workout-list-heading" className="px-4 md:px-8 py-6 md:py-10">
        <h3 id="workout-list-heading" className="sr-only">
          Workout items
        </h3>

        <ul className="space-y-3">
          {items.map((ex, idx) => (
            <li
              key={ex.id}
              className="group flex items-center gap-4 rounded-xl border bg-card/60 backdrop-blur p-3 md:p-4 hover:bg-card transition-colors"
            >
              <Link
                href={`/run/${slug}?start=${idx}`}
                className="flex items-center gap-4 flex-1"
                aria-label={`Start ${ex.name}`}
              >
                <div className="relative h-14 w-20 md:h-16 md:w-24 overflow-hidden rounded-lg ring-1 ring-border group-hover:ring-2 group-hover:ring-foreground/20 transition">
                  <Image
                    src={
                      ex.image || "/placeholder.svg?height=120&width=160&query=exercise%20image" || "/placeholder.svg"
                    }
                    alt={ex.name}
                    fill
                       priority
unoptimized
                    sizes="(max-width:768px) 33vw, 200px"
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-foreground truncate w-[220px] sm:w-full">{ex.name}</div>
                  <div className="text-xs text-muted-foreground">00:{String(ex.duration).padStart(2, "0")}</div>
                </div>
              </Link>
              <div className="text-sm text-muted-foreground tabular-nums">
                {idx + 1}/{items.length}
              </div>
            </li>
          ))}
        </ul>

        {/* Sticky CTA */}
        <div className="sticky bottom-0 -mb-6 pb-5 mt-6 md:mt-8">
          <Link
            href={`/run/${slug}`}
            className="block w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90 text-center text-base md:text-lg py-3 md:py-4 shadow-lg"
          >
            Start
          </Link>
        </div>
      </section>
    </main>
  )
}
