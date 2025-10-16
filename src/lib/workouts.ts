export type Exercise = {
  id: string
  name: string
  duration: number // seconds
  image: string
}

export function getWorkout(category: string): Exercise[] {
  const commonLegs = [
    {
      id: "high-stepping",
      name: "High Stepping",
      duration: 30,
     
      image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=1200&auto=format&fit=crop",
    },
    {
      id: "side-hop",
      name: "Side Hop",
      duration: 30,
     
      image: "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?q=80&w=1200&auto=format&fit=crop",
    },
    {
      id: "squats",
      name: "Squats",
      duration: 30,
     
      image: "https://images.unsplash.com/photo-1597076537010-6d0f87c5d3cb?q=80&w=1200&auto=format&fit=crop",
    },
  ]

  const map: Record<string, Exercise[]> = {
    eyes: [
      {
        id: "palming",
        name: "Palming",
        duration: 30,
       
        image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=1200&auto=format&fit=crop",
      },
      {
        id: "near-far-focus",
        name: "Near–Far Focus",
        duration: 30,
       
        image: "https://images.unsplash.com/photo-1516744096552-aec945acef07?q=80&w=1200&auto=format&fit=crop",
      },
      {
        id: "figure-eight",
        name: "Figure Eight",
        duration: 30,
       
        image: "https://images.unsplash.com/photo-1511452885600-a3d2c9148a31?q=80&w=1200&auto=format&fit=crop",
      },
    ],
    legs: commonLegs,
    neck: [
      {
        id: "neck-tilts",
        name: "Neck Tilts",
        duration: 30,
       
        image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=1200&auto=format&fit=crop",
      },
      {
        id: "neck-rotations",
        name: "Neck Rotations",
        duration: 30,
       
        image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=1200&auto=format&fit=crop",
      },
      {
        id: "chin-tucks",
        name: "Chin Tucks",
        duration: 30,
       
        image: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?q=80&w=1200&auto=format&fit=crop",
      },
    ],
    posture: [
      {
        id: "wall-angel",
        name: "Wall Angel",
        duration: 30,
       
        image: "https://images.unsplash.com/photo-1552196563-55cd4e45efb3?q=80&w=1200&auto=format&fit=crop",
      },
      {
        id: "scapular-retraction",
        name: "Scapular Retraction",
        duration: 30,
       
        image: "https://images.unsplash.com/photo-1517832606299-7ae9b720a186?q=80&w=1200&auto=format&fit=crop",
      },
      {
        id: "plank",
        name: "Plank",
        duration: 30,
       
        image: "https://images.unsplash.com/photo-1518314916381-77a37c2a49ae?q=80&w=1200&auto=format&fit=crop",
      },
    ],
      hocey: [
      {
        id: "light-jog",
        name: "Light Jog",
        duration: 300,
        image: "/lightjog.gif",
      },
      {
        id: "shuttle-runs",
        name: "Shuttle Runs",
        duration: 300,
       
        image: "/run.gif",
      },
      {
        id: "plansk-left",
        name: "Forward Leg Swings Left",
        duration: 60,
        image: "/legf.gif",
      },
     
         {
        id: "plasnk-right",
        name: "Forward Leg Swings Right",
        duration: 60,
       
        image: "/legf.gif",
      },
            {
        id: "jump-rope",
        name: "Jump Rope",
        duration: 60,
        image: "/jumprope.gif",
      },
      {
        id: "lateral-leg-swings-left",
        name: "Lateral Leg Swings Left",
        duration: 60,
       
        image: "/legl.gif",
      },
      {
        id: "lateral-leg-swings-right",
        name: "Lateral Leg Swings Right",
        duration: 60,
       
        image: "/legl.gif",
      },
      {
        id: "hip-openers",
        name: "Hip Openers",
        duration: 60,
       
        image: "/leg-openers.gif",
      },
  


        {
        id: "arm-circles",
        name: "Arm Circles",
        duration: 60,
       
        image: "/armcircles.gif",
      },
           {
        id: "side-lunges",
        name: "Side Lunges",
        duration: 60,
       
        image: "/sidelungs.gif",
      },
               {
        id: "hip-circles",
        name: "Hip Circles",
        duration: 60,

        image: "/hipcircles.gif",
      },
     
                      {
        id: "standing-hip-opener",
        name: "Standing Hip Opener Left",
        duration: 60,

        image: "/standinghipopner.gif",
      },
                        {
        id: "standing-hip-opener",
        name: "Standing Hip Opener Right",
        duration: 60,

        image: "/standinghipopner.gif",
      },
      

                          {
        id: "dribble-jog",
        name: "Dribble Jog",
        duration: 120,

        image: "/dribblejog.gif",
      },
                                {
        id: "straight-dribble",
        name: "Straight dribble ",
        duration: 120,

        image: "/dribblejog.gif",
      },

                                    {
        id: "straight-dribble",
        name: "Zig Zag Dribble",
        duration: 120,

        image: "/straightdribble.gif",
      },
                                    {
        id: "push-pass-drill-1",
        name: "Push Pass Drill 1",
        duration: 120,

        image: "/puspassdrill1.gif",
      },
                                     {
        id: "push-pass-drill-2",
        name: "Push Pass Drill 2",
        duration: 120,

        image: "/puspassdrill2.gif",
      },
      
                                       {
        id: "sweep-pass-drill",
        name: "Sweep Pass Drill",
        duration: 120,

        image: "/sweeppassdrill.gif",
      },
                                       {
        id: "full-ball-rotation",
        name: "Full Ball Rotation",
        duration: 120,

        image: "/fullballrotation.gif",
      },
      
                                   {
        id: "keep-looking-up",
        name: "Keep Looking Up",
        duration: 120,

        image: "/keeplookingup.gif",
      },
      
      
                                   {
        id: "open-space-dribbling",
        name: "Open-space free dribbling with changes of pace",
        duration: 120,

        image: "/openspacedribbling.gif",
      },

                                  {
        id: "push-pass-in-pairs",
        name: "Push pass in pairs, 2 m apart",
        duration: 120,

        image: "/pushpassdrill.gif",
      },
      



      
                                  {
        id: "4-cone-box-drill-backpedal-sprint",
        name: "4 Cone Box Drill (Backpedal - Sprint)",
        duration: 120,

        image: "/pushpassdrill.gif",
      },
      


  












                                  {
        id: "straight-dribble",
        name: "Push Pass",
        duration: 600,

        image: "/pushpass.gif",
      },
                                   {
        id: "hit-pass",
        name: "Hit Pass",
        duration: 600,

        image: "/hitpass.gif",
      },
                                  {
        id: "hook-block-tackle-practice",
        name: "Hook + Block Tackle Practice",
        duration: 600,

        image: "/hookblocktacklepractice.gif",
      },
                                 {
        id: "block-tackle-jab",
        name: "block tackle + jab + reverse tackle",
        duration: 600,

        image: "/blocktacklejabreversetackle.gif",
      },
    
                                   {
        id: "moving-pass-receive",
        name: "Moving pass & receive",
        duration: 600,

        image: "/movingpassreceive.gif",
      },
    
                             {
        id: "receive-stationary-pass-with-soft-hands",
        name: "Receive stationary pass with soft hands",
        duration: 600,

        image: "/receivestationarypasswithsofthands.gif",
      },

                                 {
        id: "tackling-drill-number-1",
        name: "Tackling Drill number 1  ",
        duration: 600,

        image: "/tacklingdrillnumber1.gif",
      },
                                     {
        id: "flat-stick-tackle-on-rolling-ball",
        name: "Flat stick tackle on rolling ball",
        duration: 600,

        image: "/flatsticktackleonrollingball.gif",
      },
                                {
        id: "left-hand-keep-ups",
        name: "Left Hand Keep Ups",
        duration: 600,

        image: "/lefthandkeepups.gif",
      },

                            {
        id: "stopping-exercise",
        name: "Stopping Exercise",
        duration: 600,

        image: "/stoppingexercise.gif",
      },
    

                          {
        id: "agility-zig-zag-drill",
        name: "Agility Zig Zag Drill",
        duration: 600,

        image: "/agilityzigzagdrill.gif",
      },

                      {
        id: "cone-sprints",
        name: "Cone sprints",
        duration: 600,

        image: "/conesprints.gif",
      },
    

                                    {
        id: "shooting",
        name: "Shooting",
        duration: 600,

        image: "/shooting.gif",
      },
      
    ],
  
    "hockey-drills": [
      {
        id: "quick-feet",
        name: "Quick Feet",
        duration: 30,
       
        image: "https://images.unsplash.com/photo-1542144582-1ba00456b5d5?q=80&w=1200&auto=format&fit=crop",
      },
      {
        id: "lateral-shuffles",
        name: "Lateral Shuffles",
        duration: 30,
       
        image: "https://images.unsplash.com/photo-1518619801082-0a731bb107aa?q=80&w=1200&auto=format&fit=crop",
      },
      {
        id: "stick-handling",
        name: "Stick Handling",
        duration: 30,
       
        image: "https://images.unsplash.com/photo-1529088746738-57231cfd6789?q=80&w=1200&auto=format&fit=crop",
      },
    ],
  }

  if (category === "all") {
    // flatten in a consistent order using the keys we already expose elsewhere
    const order = ["eyes", "legs", "neck", "posture", "foots", "hockey-drills"] as const
    const combined = order.flatMap((k) => map[k] || [])
    // return at least something sensible if map is empty
    return combined.length ? combined : commonLegs
  }

  return map[category] || commonLegs
}
