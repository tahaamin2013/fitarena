"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { getWorkout, type Exercise } from "@/lib/workouts"

type Phase = "setup" | "exercise" | "rest" | "complete"

function useSpeechWithMarkDefault() {
  const synthRef = useRef<SpeechSynthesis | null>(null)
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  const [voice, setVoice] = useState<SpeechSynthesisVoice | null>(null)
  const [enabled, setEnabled] = useState(true)

  useEffect(() => {
    synthRef.current = window.speechSynthesis
    const load = () => {
      const v = window.speechSynthesis.getVoices()
      setVoices(v)
      // Prefer Microsoft Mark (en-US) as requested
      const preferred =
        v.find((vv) => vv.name.includes("Microsoft Mark")) ||
        v.find((vv) => vv.name.includes("Mark")) ||
        v.find((vv) => vv.name.includes("Google US English")) ||
        v.find((vv) => vv.lang?.toLowerCase().startsWith("en"))
      if (preferred) setVoice(preferred)
    }
    load()
    window.speechSynthesis.onvoiceschanged = load
    return () => {
      window.speechSynthesis.onvoiceschanged = null
    }
  }, [])

  const speak = (text: string, opts?: { rate?: number; pitch?: number }) => {
    if (!enabled) return Promise.resolve()
    const s = synthRef.current
    if (!s) return Promise.resolve()
    const u = new SpeechSynthesisUtterance(text)
    if (voice) u.voice = voice
    u.rate = opts?.rate ?? 1
    u.pitch = opts?.pitch ?? 1
    s.cancel()
    s.speak(u)
    return new Promise<void>((resolve) => {
      u.onend = () => resolve()
      u.onerror = () => resolve()
    })
  }

  const cancel = () => synthRef.current?.cancel()

  return {
    voices,
    voice,
    setVoice,
    enabled,
    setEnabled,
    speak,
    cancel,
  }
}

let __faBellAudio: HTMLAudioElement | null = null
function playBell() {
  if (typeof window === "undefined") return
  if (!__faBellAudio) {
    __faBellAudio = new Audio("/sounds/bell.mp3")
    __faBellAudio.preload = "auto"
  }
  try {
    __faBellAudio.currentTime = 0
    void __faBellAudio.play()
  } catch (e) {
    // ignore autoplay restrictions
  }
}

export default function RunPage({
  params,
  searchParams,
}: {
  params: { slug: string }
  searchParams: { start?: string }
}) {
  const { slug } = params
  const all = useMemo(() => getWorkout(slug), [slug])
  const startIndex = Math.max(
    0,
    Math.min(Number.parseInt(searchParams?.start ?? "0", 10) || 0, Math.max(0, all.length - 1)),
  )

  const [idx, setIdx] = useState(startIndex)
  const [phase, setPhase] = useState<Phase>("setup")
  const [remaining, setRemaining] = useState(10)
  const [restLeft, setRestLeft] = useState(10)
  const [paused, setPaused] = useState(false)
  const pausedRef = useRef(false)
  const { /* voices, */ voice, /* setVoice, */ enabled, setEnabled, speak, cancel } = useSpeechWithMarkDefault()

  const current: Exercise | null = all[idx] ?? null
  const nextOne: Exercise | null = all[idx + 1] ?? null

  // Timers
  useEffect(() => {
    let interval: string | number | NodeJS.Timeout | undefined
    let timeout: string | number | NodeJS.Timeout | undefined

    if (phase === "setup") {
      setRemaining(10)
      interval = setInterval(() => {
        if (pausedRef.current) return
        setRemaining((s) => {
          if (s <= 1) {
            clearInterval(interval)
            setPhase("exercise")
            return 0
          }
          return s - 1
        })
      }, 1000)
    }

    if (phase === "exercise" && current) {
      setRemaining(current.duration)

      const startTicking = () => {
        interval = setInterval(() => {
          if (pausedRef.current) return
          setRemaining((s) => {
            if (s <= 1) {
              clearInterval(interval)
              if (idx < all.length - 1) {
                playBell() // bell right before rest
                setPhase("rest")
                setRestLeft(10)
              } else {
                setPhase("complete")
              }
              return 0
            }
            return s - 1
          })
        }, 1000)
      }

      timeout = setTimeout(startTicking, 3000)
    }

    if (phase === "rest") {
      interval = setInterval(() => {
        if (pausedRef.current) return
        setRestLeft((s) => {
          if (s <= 1) {
            clearInterval(interval)
            setIdx((i) => i + 1)
            setPhase("setup")
            return 0
          }
          return s - 1
        })
      }, 1000)
    }

    return () => {
      clearInterval(interval)
      clearTimeout(timeout)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, idx, slug])

  // Voice sequences
  useEffect(() => {
    let cancelled = false
    async function run() {
      cancel()
      if (!current) return
      if (phase === "setup") {
        await speak("Ready to go!", { rate: 1.0 })
        return
      } else if (phase === "exercise") {
        await speak("Start the exercise", { rate: 1.02 })
        await speak(current.name, { rate: 1.02 })
        await new Promise((r) => setTimeout(r, 3000))
      } else if (phase === "rest") {
        await speak("Take a rest", { rate: 1.0 })
        const nextName = nextOne?.name ?? "next exercise"
        await speak(`Next: ${nextName}`, { rate: 1.02 })
      } else if (phase === "complete") {
        await speak("Workout complete! Great job.", { rate: 1.0 })
      }
    }
    run()
    return () => {
      cancelled = true
      cancel()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, idx, slug])

  const numberStartAtRef = useRef<number>(0)
  const initialDurationRef = useRef<number>(0)
  const lastSpokenRef = useRef<string | null>(null)

  useEffect(() => {
    if (phase === "exercise" && current) {
      numberStartAtRef.current = Date.now() + 3000
      initialDurationRef.current = current.duration
      lastSpokenRef.current = null
    } else {
      numberStartAtRef.current = Number.MAX_SAFE_INTEGER
    }
  }, [phase, idx]) // keep same deps

  useEffect(() => {
    if (phase !== "exercise") return
    if (paused) return
    if (Date.now() < numberStartAtRef.current) return
    if (remaining <= 0) return

    const init = initialDurationRef.current

    // For durations above 60s: announce on each full-minute boundary
    if (init > 60) {
      if (remaining % 60 === 0) {
        const minutes = Math.floor(remaining / 60)
        const key = `m-${minutes}`
        if (minutes > 0 && lastSpokenRef.current !== key) {
          void speak(`${minutes} minute${minutes === 1 ? "" : "s"} remaining`, { rate: 1.02 })
          lastSpokenRef.current = key
        }
      }
      return
    }

    // For exactly 60s: announce once at 40s remaining (after 20s have elapsed)
    if (init === 60) {
      if (remaining === 40 && lastSpokenRef.current !== "s-40") {
        void speak(`40 seconds remaining`, { rate: 1.05 })
        lastSpokenRef.current = "s-40"
      }
      return
    }

    // Otherwise (below 60s) keep quiet to avoid per-second spam (no-op)
  }, [remaining, phase, paused, speak])

  useEffect(() => {
    pausedRef.current = paused
    if (paused) cancel()
  }, [paused, cancel])

  function skipRest() {
    setIdx((i) => Math.min(i + 1, all.length - 1))
    setPhase("setup")
  }

  function add20s() {
    setRestLeft((s) => s + 20)
  }

  const total = all.length
  const progress = Math.round(((idx + (phase === "exercise" ? 0.5 : 0)) / total) * 100)

  const backHref = slug === "all" ? "/" : `/category/${slug}`

  return (
    <main className="min-h-dvh bg-[var(--background)]">
      <header className="mx-auto max-w-4xl px-4 md:px-8 py-4 md:py-6 flex items-center justify-between">
        <Link href={backHref} style={{ color: "var(--muted-foreground)" }}>
          ← Back
        </Link>
        <div className="flex items-center gap-2">
          <button
            className="fa-cta rounded-full px-3 py-1 text-sm"
            onClick={() => setEnabled((s) => !s)}
            aria-pressed={enabled}
          >
            {enabled ? "Voice On" : "Voice Off"}
          </button>
          <button
            className="fa-cta rounded-full px-3 py-1 text-sm"
            onClick={() => setPaused((s) => !s)}
            aria-pressed={paused}
          >
            {paused ? "Resume" : "Pause"}
          </button>
        </div>
      </header>

      {phase !== "complete" && current && (
        <section className="mx-auto max-w-4xl px-4 md:px-8 pb-8">
          <div className="h-3 md:h-4 rounded-full bg-black/10 overflow-hidden mb-6">
            <div
              className="h-full fa-cta"
              style={{ width: `${progress}%` }}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={progress}
              role="progressbar"
            />
          </div>

          <div className="fa-tile p-4 md:p-6 flex flex-col items-center text-center">
            <div className="relative w-full aspect-[4/3] max-w-xl">
              <Image
                src={
                  (phase === "rest" ? nextOne?.image || current?.image || "" : current?.image || "") ||
                  "/placeholder.svg?height=400&width=600&query=exercise%20image"
                }
                alt={phase === "rest" ? nextOne?.name || current?.name || "exercise" : current?.name || "exercise"}
                fill
                className="object-cover rounded-xl"
                sizes="(max-width:768px) 100vw, 800px"
                priority
          
              loading="eager"
              />
            </div>

            {phase === "setup" && (
              <>
                <h2 className="mt-5 text-2xl md:text-3xl font-extrabold" style={{ color: "var(--foreground)" }}>
                  READY TO GO!
                </h2>
                <div className="mt-4 fa-cta inline-flex items-center justify-center rounded-full w-16 h-16 text-2xl">
                  {remaining}
                </div>
              </>
            )}

            {phase === "exercise" && (
              <>
                <div className="mt-5 text-sm" style={{ color: "var(--muted-foreground)" }}>
                  {String(current.duration - remaining).padStart(2, "0")} /{String(current.duration).padStart(2, "0")}
                </div>
                <h2 className="mt-1 text-2xl md:text-3xl font-extrabold" style={{ color: "var(--foreground)" }}>
                  {current.name}
                </h2>
                <div className="mt-4 fa-cta inline-flex items-center justify-center rounded-full w-16 h-16 text-2xl">
                  {current.duration > 60 ? Math.ceil(remaining / 60) : remaining}
                </div>
                <div className="mt-4 flex items-center gap-3">
                  <button
                    className="fa-tile px-4 py-2 rounded-full"
                    onClick={() => {
                      setRestLeft(10)
                      setPhase("rest")
                    }}
                  >
                    Pause/Rest
                  </button>
                  <button
                    className="fa-cta px-4 py-2 rounded-full"
                    onClick={() => {
                      if (idx < total - 1) {
                        playBell()
                        setRestLeft(10)
                        setPhase("rest")
                      } else {
                        setPhase("complete")
                      }
                    }}
                  >
                    Next →
                  </button>
                </div>
              </>
            )}

            {phase === "rest" && (
              <>
                <h2 className="mt-5 text-2xl md:text-3xl font-extrabold" style={{ color: "var(--foreground)" }}>
                  Take a rest
                </h2>
                <div className="mt-2 fa-cta inline-flex items-center justify-center rounded-full w-16 h-16 text-2xl">
                  {restLeft}
                </div>
                <div className="mt-3" style={{ color: "var(--muted-foreground)" }}>
                  Next: <strong>{nextOne?.name ?? "—"}</strong>
                </div>
                <div className="mt-4 flex items-center gap-3">
                  <button className="fa-tile px-4 py-2 rounded-full" onClick={add20s}>
                    +20s
                  </button>
                  <button className="fa-cta px-4 py-2 rounded-full" onClick={skipRest}>
                    Skip
                  </button>
                </div>
              </>
            )}
          </div>
        </section>
      )}

      {phase === "complete" && (
        <section className="mx-auto max-w-2xl px-4 md:px-8 py-12 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold" style={{ color: "var(--foreground)" }}>
            Workout Complete!
          </h2>
          <p className="mt-2" style={{ color: "var(--muted-foreground)" }}>
            Great job finishing the {slug.replace("-", " ")} session.
          </p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <Link className="fa-tile px-5 py-3 rounded-full" href={`/category/${slug}`}>
              Repeat
            </Link>
            <Link className="fa-cta px-5 py-3 rounded-full" href="/">
              Back Home
            </Link>
          </div>
        </section>
      )}

      {/* Global bottom Pause/Resume button */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 w-full max-w-4xl px-4 md:px-8">
        <button
          className="fa-tile w-full px-5 py-3 rounded-full"
          onClick={() => setPaused((p) => !p)}
          aria-pressed={paused}
        >
          {paused ? "Resume" : "Pause"}
        </button>
      </div>
    </main>
  )
}
