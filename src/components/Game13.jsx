import { useState, useEffect, useRef } from "react"

// TRICK: Dino Run uses the same pattern as Flappy Bird:
//   - Game loop with setInterval
//   - useRef for real-time positions (avoids stale closures)
//   - setTick(dummy) to force re-render (since refs don't trigger renders)

// TRICK: useRef + force-render pattern:
//   const pos = useRef(initialValue)   // real-time position (no stale closure)
//   const [,setTick] = useState(0)     // force re-render
//   pos.current = newValue              // update ref
//   setTick(t => t+1)                  // trigger render
// This is faster than useState for positions that update every tick.

// TRICK: Jump trajectory as a fixed array — TRAJECTORY = [-10,-10,...]
// When jumping, walk through the array. When done, gravity takes over.
// Much simpler than velocity/acceleration physics.

// TRICK: Obstacle spawning — when last obstacle is far enough left,
// spawn a new one. Random distance between obstacles = random spacing.

const randomInt = (min, max) =>
  min + Math.floor(Math.random() * (max - min + 1));

const TRAJECTORY = [-10,-10,-10,-10,-10,-10,-10,-10, ]
const gravity = 10
const GROUND_Y = 170
const moveSpeed = 5
let screenWidth = 800
let screenHeight = 200
let cactusWidth = 10
const DinoX = 100

const Game13= () => {
    const [start, setStart] = useState(true)
    const jumpIndex = useRef(-1)
    const dinoPos = useRef(GROUND_Y)
    const [,setTick] = useState(0)  // GOOD: force re-render since refs don't trigger renders
    const cacti = useRef([])

    const createCactus = () => {
        const cactus = {
            x: 800,
            height: randomInt(20,50),
        }
        return cactus
    }

    // GOOD: jump via trajectory array — simple and effective
    const jump = () => {
        if (start) {
            if (dinoPos.current === GROUND_Y) {
                jumpIndex.current = 0
            }
        }
    }

    const renderCacti = () => {
        return (cacti.current.map((cactus, cactusIndex) => {
            return (
                <div
                    key={cactusIndex}
                    className="absolute"
                    style={{
                        left: `${cactus.x}px`,
                        bottom: `0px`,
                        height: `${cactus.height}px`,
                        width: '10px',
                        backgroundColor: 'green'
                    }}
                >
                </div>
            )
        }))
    }

    // GOOD: simple collision — check if dino overlaps with nearest cactus
    const collide = (dinoPos, cactiPos) => {
        if (cactiPos.length === 0) return false
        let nearestCacti
        if (cactiPos[0].x > DinoX) {
            nearestCacti = cactiPos[0]
        } else {
            nearestCacti = cactiPos[1]
        }

        if ((nearestCacti.x - DinoX) > 10) return false
        // Check if dino's Y position is above the cactus height
        if ((screenHeight - nearestCacti.height - dinoPos) > 10) return false
        return true
    }

    useEffect(() => {
        if (start) {
            const tickRate = 50
            const gameLoop = setInterval(() => {

                // GOOD: jump via trajectory array, gravity when not jumping
                if (jumpIndex.current < 0) {
                    dinoPos.current = Math.min(GROUND_Y, dinoPos.current + gravity)
                } else {
                    dinoPos.current += TRAJECTORY[jumpIndex.current]
                    jumpIndex.current += 1
                    if (jumpIndex.current >= TRAJECTORY.length) {
                        jumpIndex.current = -1
                    }
                }

                // Move obstacles left, remove off-screen ones
                let nextCacti = []
                for (let cactus of cacti.current) {
                    let newX = cactus.x - moveSpeed
                    if (newX + cactusWidth > 0) {
                        nextCacti.push({...cactus, x:newX})
                    }
                }

                // GOOD: spawn new cactus when last one is far enough left
                let lastCactus = nextCacti[nextCacti.length-1]
                if (nextCacti.length === 0) {
                    const cactusObject = createCactus()
                    nextCacti.push(cactusObject)
                }
                if (lastCactus && lastCactus.x < (screenWidth - randomInt(200, 500))) {
                    const cactusObject = createCactus()
                    nextCacti.push(cactusObject)
                }
                cacti.current = nextCacti

                if (collide(dinoPos.current, cacti.current)) {
                    console.log("hit")
                }

                // Force re-render since we're using refs
                setTick(prev => prev +1)
            }, tickRate)
            return () => clearInterval(gameLoop);
        }
    }, [start])

    useEffect(() => {
        const handleKey = (e) => {
            if (e.key === 'ArrowUp') {
            e.preventDefault();
            jump();
            }
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);

    }, [start]);


    return (
        <div className="flex flex-col items-center">
            <h1>Hello let's play Dino Run!</h1>
            <div
                className={`relative w-[800px] h-[200px] bg-sky-400`}
                onClick={() => setStart(currStart => !currStart)}
            >
                {renderCacti()}
                <div
                    className="absolute text-2xl"
                    style={{
                        top: `${dinoPos.current}px`,
                        left: `${DinoX}px`
                    }}
                >
                    🐸
                </div>
            <div
                className="absolute w-[800px] h-[50px] top-[200px] bg-yellow-600"
            ></div>
            </div>
        </div>
    )
}

export default Game13