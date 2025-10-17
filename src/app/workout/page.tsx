"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"
import { exercises as baseExercises } from "@/lib/workout-data"
import { Button } from "@/components/ui/button"

type Phase = "setup" | "exercise" | "rest" | "complete"

const SETUP_SECONDS = 10
const REST_SECONDS = 10

export default function WorkoutRunnerPage() {
  const [index, setIndex] = useState(0)
  const [phase, setPhase] = useState<Phase>("setup")
  const [isPaused, setPaused] = useState(false)
  const [secondsLeft, setSecondsLeft] = useState(SETUP_SECONDS)
  const [isMuted, setMuted] = useState(false)

  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null)

  const exercises = useMemo(() => baseExercises, [])
  const current = exercises[index]
  const next = exercises[index + 1]

  const timeoutsRef = useRef<number[]>([])
  const lastSpokenNumberRef = useRef<number | null>(null)
  const speakNumbersAfterRef = useRef<number>(0)
  const exerciseStartAtRef = useRef<number>(0)

  function pickDefaultVoice(list: SpeechSynthesisVoice[]) {
    const en = list.filter((v) => v.lang?.toLowerCase().startsWith("en"))
    const prefer = [
      "Microsoft Mark", // requested default
      // additional sensible fallbacks
      "Microsoft Zira",
      "Google UK English Female",
      "Samantha",
      "Victoria",
      "Serena",
      "Zoe",
      "Allison",
      "Joanna",
    ]
    const byPreferred = en.find((v) => prefer.some((n) => v.name.toLowerCase().includes(n.toLowerCase())))
    if (byPreferred) return byPreferred
    const byNameHint = en.find((v) => /female|woman|girl|mark/i.test(v.name))
    if (byNameHint) return byNameHint
    return en[0] || list[0] || null
  }

  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return
    const synth = window.speechSynthesis

    const load = () => {
      const list = synth.getVoices()
      if (list && list.length) {
        setVoices(list)
        setSelectedVoice((prev) => prev ?? pickDefaultVoice(list))
      }
    }

    load()
    synth.onvoiceschanged = load
    return () => {
      synth.onvoiceschanged = null
    }
  }, [])

  const speakNow = (text: string) =>
    new Promise<void>((resolve) => {
      if (typeof window === "undefined" || isMuted || !text) return resolve()
      const synth = window.speechSynthesis
      if (!synth) return resolve()
      const u = new SpeechSynthesisUtterance(text)
      if (selectedVoice) u.voice = selectedVoice
      u.rate = 1
      // make Microsoft Mark neutral pitch, others slightly brighter
      const isMark = !!selectedVoice?.name?.toLowerCase().includes("mark")
      u.pitch = isMark ? 1.0 : 1.15
      u.lang = (selectedVoice?.lang as string) || "en-US"
      u.onend = () => resolve()
      synth.speak(u)
    })

  // keep simple speak for non-queued numbers (we cancel before numbers)
  const speak = (text: string) => {
    if (typeof window === "undefined" || isMuted || !text) return
    const synth = window.speechSynthesis
    if (!synth) return
    if (/^\d+$/.test(text)) {
      synth.cancel()
    }
    const u = new SpeechSynthesisUtterance(text)
    if (selectedVoice) u.voice = selectedVoice
    u.rate = 1
    const isMark = !!selectedVoice?.name?.toLowerCase().includes("mark")
    u.pitch = isMark ? 1.0 : 1.15
    u.lang = (selectedVoice?.lang as string) || "en-US"
    synth.speak(u)
  }

  const clearPendingTimeouts = () => {
    timeoutsRef.current.forEach((id) => window.clearTimeout(id))
    timeoutsRef.current = []
  }

  useEffect(() => {
    if (phase === "setup") setSecondsLeft(SETUP_SECONDS)
    if (phase === "exercise") {
      if (current?.type === "time") setSecondsLeft(current.durationSec ?? 30)
      else setSecondsLeft(30)
    }
    if (phase === "rest") setSecondsLeft(REST_SECONDS)
  }, [phase, index, current])

  useEffect(() => {
    if (phase === "complete") {
      speak("Workout complete. Great job!")
      return
    }

    lastSpokenNumberRef.current = null
    // Block numbers until we explicitly allow them after spoken phrases
    speakNumbersAfterRef.current = Number.MAX_SAFE_INTEGER

    const synth = typeof window !== "undefined" ? window.speechSynthesis : null
    if (synth) synth.cancel()
    clearPendingTimeouts()

    const run = async () => {
      if (phase === "setup" && current) {
        await speakNow("Ready to go")
        // keep numbers blocked in setup
        return
      }
      if (phase === "exercise" && current) {
        await speakNow("Start the exercise")
        await speakNow(current.name)
        speakNumbersAfterRef.current = Date.now() + 3000
        return
      }
      if (phase === "rest") {
        await speakNow("Take a rest")
        if (next) await speakNow(`Next, ${next.name}`)
        speakNumbersAfterRef.current = Number.MAX_SAFE_INTEGER
        return
      }
    }

    run()

    return () => {
      clearPendingTimeouts()
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, index, selectedVoice, isMuted])

  useEffect(() => {
    if (phase === "complete" || isPaused || isMuted) return
    if (secondsLeft <= 0) return
    if (phase !== "exercise") return
    if (Date.now() < speakNumbersAfterRef.current) return

    if (lastSpokenNumberRef.current !== secondsLeft) {
      speak(String(secondsLeft))
      lastSpokenNumberRef.current = secondsLeft
    }
    // ...
  }, [secondsLeft, isPaused, isMuted, phase, selectedVoice])

  useEffect(() => {
    if (phase === "complete") return
    if (isPaused) return

    const id = window.setInterval(() => {
      setSecondsLeft((s) => {
        if (phase === "exercise" && Date.now() < exerciseStartAtRef.current) {
          return s
        }
        if (s <= 1) {
          handlePhaseAdvance()
          return 0
        }
        return s - 1
      })
    }, 1000)

    return () => window.clearInterval(id)
  }, [phase, isPaused, index])

  const handlePhaseAdvance = () => {
    setPaused(false)
    setSecondsLeft(0)

    if (phase === "setup") {
      setPhase("exercise")
      return
    }

    if (phase === "exercise") {
      if (index < exercises.length - 1) {
        playBell()
        setPhase("rest")
      } else {
        setPhase("complete")
      }
      return
    }

    if (phase === "rest") {
      setIndex((i) => i + 1)
      setPhase("setup")
      return
    }
  }

  const handleSkip = () => {
    if (phase === "setup") {
      setPhase("exercise")
      return
    }
    if (phase === "exercise") {
      if (index < exercises.length - 1) {
        setPhase("rest")
      } else {
        setPhase("complete")
      }
      return
    }
    if (phase === "rest") {
      setIndex((i) => i + 1)
      setPhase("setup")
      return
    }
  }

  const handleAdd20 = () => {
    if (phase === "rest") setSecondsLeft((s) => s + 20)
  }

  const totalUnits = exercises.length * 2
  const completedUnits = index * 2 + (phase === "exercise" ? 1 : phase === "rest" ? 2 : 0)

  let __faAudioCtx: AudioContext | null = null
  function getAudioCtx() {
    if (typeof window === "undefined") return null
    const Ctx = (window.AudioContext || window.AudioContext)
    if (!Ctx) return null
    if (!__faAudioCtx) __faAudioCtx = new Ctx()
    return __faAudioCtx
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

  useEffect(() => {
    if (phase === "exercise") {
      exerciseStartAtRef.current = Date.now() + 3000
    } else {
      exerciseStartAtRef.current = 0
    }
  }, [phase, index])

  return (
    <div className="min-h-dvh bg-background text-foreground flex flex-col">
      <div className="h-2 w-full bg-muted rounded-full">
        <div
          className="h-full bg-[color:var(--accent-500)] transition-all rounded-full"
          style={{ width: `${(completedUnits / totalUnits) * 100}%` }}
        />
      </div>

      <header className="flex items-center justify-between px-4 md:px-6 py-3 max-w-5xl mx-auto w-full">
        <Link href="/" aria-label="Back">
          <span className="text-xl md:text-2xl">{"←"}</span>
        </Link>
        <div className="flex items-center gap-3">
          {/* Voice toggle remains */}
          <Button
            variant="secondary"
            onClick={() => setMuted((m) => !m)}
            aria-pressed={isMuted}
            aria-label={isMuted ? "Enable voice" : "Disable voice"}
            className="h-9"
          >
            Voice: {isMuted ? "Off" : "On"}
          </Button>
        </div>
      </header>

      <main className="flex-1 px-4 md:px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8 items-start">
          <div className="flex flex-col items-center">
            {phase !== "complete" && (
              <img
                src={
                  phase === "setup"
                    ? "/images/setup-ready.png"
                    : phase === "rest"
                      ? "/images/rest-screen.png"
                      : current?.asset || "/images/exercise-running.jpeg"
                }
                alt={phase === "setup" ? "Ready to go" : phase === "rest" ? "Rest" : current?.name || "Exercise"}
                className="w-full max-w-sm md:max-w-md h-64 md:h-96 object-contain"
              />
            )}
          </div>

          <div className="w-full max-w-sm md:max-w-md mx-auto md:mx-0 bg-card rounded-xl p-4 shadow-sm">
            {phase === "setup" && (
              <section className="mt-4 text-center md:text-left">
                <p className="text-2xl md:text-3xl font-extrabold tracking-wide" style={{ color: "var(--accent-500)" }}>
                  READY TO GO!
                </p>
                <Countdown seconds={secondsLeft} />
                <div className="mt-6 flex items-center justify-center md:justify-start gap-3">
                  <Button variant="secondary" onClick={() => setPaused((p) => !p)}>
                    {isPaused ? "Resume" : "Pause"}
                  </Button>
                  <Button onClick={handleSkip}>Skip</Button>
                </div>
              </section>
            )}

            {phase === "exercise" && current && (
              <section className="mt-4">
                <div className="flex items-baseline justify-between">
                  <p className="text-2xl md:text-3xl font-bold" style={{ color: "var(--accent-500)" }}>
                    {`${secondsLeft.toString().padStart(2, "0")}"`}/
                    {current.type === "time" ? `${(current.durationSec || 30).toString().padStart(2, "0")}"` : `30"`}
                  </p>
                </div>
                <p className="mt-2 text-lg md:text-xl font-semibold">{current.name}</p>

                <div className="mt-6 flex items-center justify-center md:justify-start gap-3">
                  <Button variant="secondary" onClick={() => setPaused((p) => !p)}>
                    {isPaused ? "Resume" : "Pause"}
                  </Button>
                  <Button onClick={handleSkip}>Next</Button>
                </div>
              </section>
            )}

            {phase === "rest" && (
              <section className="mt-2">
                <div className="relative rounded-xl overflow-hidden">
                  <img
                    src="/images/rest-screen.png"
                    alt="Take a rest background"
                    className="w-full h-44 md:h-56 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40" aria-hidden="true" />
                  <div className="absolute inset-0 p-4 text-white flex flex-col justify-center items-center">
                    <p className="text-xl md:text-2xl font-bold">Take a rest</p>
                    <div className="text-4xl md:text-5xl font-extrabold mt-1">{secondsLeft}</div>
                    <div className="mt-3 flex items-center gap-3">
                      <Button variant="secondary" onClick={handleAdd20}>
                        +20s
                      </Button>
                      <Button onClick={handleSkip}>SKIP</Button>
                    </div>
                  </div>
                </div>

                {next && (
                  <div className="mt-3 rounded-lg border p-3 bg-card">
                    <p className="text-sm text-muted-foreground">Next</p>
                    <p className="text-sm md:text-base font-semibold">
                      {index + 2}/{exercises.length} {next.name}{" "}
                      {next.type === "time"
                        ? `00:${(next.durationSec || 0).toString().padStart(2, "0")}`
                        : `x ${next.reps}`}
                    </p>
                    <div className="mt-2 flex items-center gap-3">
                      <img
                        src={next.asset || "/images/exercise-running.jpeg"}
                        alt={`${next.name} preview`}
                        className="h-16 w-16 object-contain"
                        
                      />
                      <p className="text-xs md:text-sm text-muted-foreground">Get ready for the next movement.</p>
                    </div>
                  </div>
                )}
              </section>
            )}

            {phase === "complete" && (
              <section className="mt-10 text-center md:text-left">
                <div className="text-3xl md:text-4xl font-extrabold" style={{ color: "var(--accent-500)" }}>
                  Workout Complete!
                </div>
                <p className="mt-2 text-sm md:text-base text-muted-foreground">Great job finishing today’s session.</p>
                <div className="mt-6 flex items-center justify-center md:justify-start gap-3">
                  <Link href="/" className="block">
                    <Button variant="secondary">Back to Home</Button>
                  </Link>
                  <Button
                    onClick={() => {
                      setIndex(0)
                      setPhase("setup")
                      setPaused(false)
                      setSecondsLeft(SETUP_SECONDS)
                    }}
                  >
                    Restart
                  </Button>
                </div>
              </section>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

function Countdown({ seconds }: { seconds: number }) {
  return (
    <div className="mt-6 flex items-center justify-center md:justify-start">
      <div className="h-20 w-20 md:h-24 md:w-24 rounded-full border-8 border-[color:var(--accent-200)] flex items-center justify-center">
        <div className="h-14 w-14 md:h-16 md:w-16 rounded-full bg-[color:var(--accent-50)] flex items-center justify-center">
          <span className="text-3xl md:text-4xl font-extrabold">{seconds}</span>
        </div>
      </div>
    </div>
  )
}
