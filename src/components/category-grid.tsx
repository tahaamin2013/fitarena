"use client"

import Link from "next/link"
import Image from "next/image"
import { CATEGORIES } from "@/lib/categories"

export function CategoryGrid() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
      {CATEGORIES.map((c) => (
        <Link
          key={c.slug}
          href={`/category/${c.slug}`}
          className="fa-tile block group relative h-36 md:h-48"
          aria-label={`Open ${c.title} workouts`}
        >
          <Image
            src={c.image || "/placeholder.svg?height=300&width=400&query=category%20image"}
            alt={`${c.title} background`}
            fill
            priority={true}
            sizes="(max-width:768px) 50vw, 33vw"
            className="object-cover opacity-80 group-hover:opacity-90 transition"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-black/5" />
          <div className="absolute inset-x-4 bottom-4 flex items-center justify-between">
            <div>
              <div className="text-white text-lg md:text-xl font-semibold text-balance">{c.title}</div>
              {c.tagline ? <p className="text-white/80 text-xs md:text-sm">{c.tagline}</p> : null}
            </div>
            <span className="fa-cta inline-flex items-center justify-center h-9 w-9 rounded-full">→</span>
          </div>
        </Link>
      ))}
    </div>
  )
}
