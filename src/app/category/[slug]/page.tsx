import Link from "next/link"
import Image from "next/image"
import { getWorkout } from "@/lib/workouts"
import { CATEGORIES } from "@/lib/categories"

export default function CategoryPlanPage({
  params,
}: {
  params: { slug: string }
}) {
  const { slug } = params
  const category = CATEGORIES.find((c) => c.slug === slug)
  const items = getWorkout(slug)

  return (
    <main className="min-h-dvh bg-[var(--background)]">
      <header className="mx-auto max-w-4xl px-4 md:px-8 py-4 flex items-center">
        <Link href="/" style={{ color: "var(--muted-foreground)" }}>
          ← Back
        </Link>
      </header>

      <div className="relative h-48 md:h-64">
        {category ? (
          <>
            <Image
              src={category.image || "/placeholder.svg?height=400&width=1200&query=category%20cover"}
              alt={`${category.title} cover`}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/45" />
            <div className="absolute inset-x-4 md:inset-x-8 bottom-5 md:bottom-8 text-white">
              <h2 className="text-2xl md:text-3xl font-semibold">{category.title} Workout</h2>
              {category.tagline ? <p className="text-white/80">{category.tagline}</p> : null}
            </div>
          </>
        ) : null}
      </div>

      <section className="mx-auto max-w-4xl px-4 md:px-8 py-6 md:py-10">
        <ul className="space-y-3">
          {items.map((ex, idx) => (
            <li key={ex.id} className="fa-tile flex items-center gap-4 p-3 md:p-4">
              <Link href={`/run/${slug}?start=${idx}`} className="flex items-center gap-4 flex-1">
                <div className="relative h-14 w-20 md:h-16 md:w-24 overflow-hidden rounded-lg">
                  <Image
                    src={ex.image || "/placeholder.svg?height=120&width=160&query=exercise%20image"}
                    alt={ex.name}
                    fill
                    sizes="(max-width:768px) 33vw, 200px"
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="font-semibold" style={{ color: "var(--foreground)" }}>
                    {ex.name}
                  </div>
                  <div className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                    00:{String(ex.duration).padStart(2, "0")}
                  </div>
                </div>
              </Link>
              <div className="text-sm" style={{ color: "var(--muted-foreground)" }}>
                {idx + 1}/{items.length}
              </div>
            </li>
          ))}
        </ul>

        <div className="sticky bottom-0 mt-6 md:mt-8">
          <Link
            href={`/run/${slug}`}
            className="fa-cta block text-center w-full rounded-full py-3 md:py-4 text-base md:text-lg"
          >
            Start
          </Link>
        </div>
      </section>
    </main>
  )
}
