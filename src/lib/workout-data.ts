export type Exercise = {
  id: string
  name: string
  type: "time" | "reps"
  durationSec?: number // for type === "time"
  reps?: number // for type === "reps"
  asset?: string // image path or remote url
}

export const workoutMeta = {
  title: "FULL BODY WORKOUT - DAY 1",
  totalWorkouts: 18,
  totalMinutes: 10,
  description: "Scientifically proven to assist weight loss and improve cardiovascular function.",
}

export const exercises: Exercise[] = [
  {
    id: "high-stepping",
    name: "HIGH STEPPING",
    type: "time",
    durationSec: 30,
    asset: "https://images.unsplash.com/photo-1546483875-ad9014c88eba?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "side-hop",
    name: "SIDE HOP",
    type: "time",
    durationSec: 30,
    asset: "https://images.unsplash.com/photo-1517963879433-6ad2b056d964?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "squats",
    name: "SQUATS",
    type: "reps",
    reps: 12,
    asset: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "wall-pushups",
    name: "WALL PUSH-UPS",
    type: "reps",
    reps: 12,
    asset: "https://images.unsplash.com/photo-1579758629938-03607ccdbaba?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "butt-bridge",
    name: "BUTT BRIDGE",
    type: "reps",
    reps: 12,
    asset: "https://images.unsplash.com/photo-1558611848-73f7eb4001a1?auto=format&fit=crop&w=600&q=80",
  },
]
