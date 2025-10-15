"use client"

import Link from "next/link"
import { exercises, workoutMeta } from "@/lib/workout-data"
import { Button } from "@/components/ui/button"

export default function WorkoutList() {
  return (
    <div className="min-h-dvh bg-background text-foreground flex flex-col">
      <header className="relative">
        <div className="absolute inset-0 bg-black/40" aria-hidden="true" />
        <img
          src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1600&q=80"
          alt="Workout header"
          className="h-48 md:h-64 w-full object-cover"
        />
        <div className="absolute inset-0 px-4 md:px-6 py-3 flex flex-col justify-end gap-2 max-w-5xl mx-auto">
          <div className="text-white/90 text-sm md:text-base font-medium">{workoutMeta.title}</div>
          <div className="flex items-center gap-6 text-white/90 text-xs md:text-sm">
            <div>
              <span className="font-semibold">{workoutMeta.totalWorkouts}</span> Workouts
            </div>
            <div>
              <span className="font-semibold">{workoutMeta.totalMinutes}</span> minutes
            </div>
          </div>
          <p className="text-white/80 text-xs md:text-sm leading-5 max-w-[56ch]">{workoutMeta.description}</p>
        </div>
      </header>

      <main className="flex-1 px-4 md:px-6 py-4">
        <div className="max-w-3xl mx-auto">
          <ul className="divide-y divide-border rounded-md bg-card">
            {exercises.map((ex) => (
              <li key={ex.id} className="flex items-center justify-between py-3">
                <div className="flex flex-col">
                  <span className="text-sm font-semibold">{ex.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {ex.type === "time" ? `00:${(ex.durationSec || 0).toString().padStart(2, "0")}` : `x ${ex.reps}`}
                  </span>
                </div>
                <img
                  src={ex.asset || "/images/exercise-running.jpeg"}
                  alt={`${ex.name} thumbnail`}
                  className="h-12 w-12 object-contain"
                />
              </li>
            ))}
          </ul>
        </div>
      </main>

      <footer className="p-4 md:p-6">
        <div className="max-w-3xl mx-auto">
          <Link href="/workout" className="block">
            <Button
              className="w-full h-12 rounded-full text-base font-semibold"
              style={{ backgroundColor: "var(--accent-500)", color: "white" }}
            >
              Start
            </Button>
          </Link>
        </div>
      </footer>
    </div>
  )
}
