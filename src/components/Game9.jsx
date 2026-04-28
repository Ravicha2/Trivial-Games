import { useEffect } from "react"
import { useState, useRef } from "react"

// TRICK: Game loop with setInterval — the standard pattern for real-time games:
//   useEffect(() => {
//     const gameLoop = setInterval(() => { /* update state */ }, tickRate)
//     return () => clearInterval(gameLoop)
//   }, [dependencies])

// TRICK: useRef for positions that the game loop reads — avoids stale closures.
// State values inside setInterval are stale (captured at creation time).
// Solution: keep real-time positions in refs, use setState only for rendering.
//   const posRef = useRef({x: 30, y: 10})
//   posRef.current = { x: nextX, y: nextY }  // update ref (immediate)
//   setSnake(prev => [...prev, posRef.current])  // update state (triggers render)

// TRICK: Snake body = array of positions. Each tick, push new head position
// and slice to length. When food eaten, increase slice length. This avoids
// complex linked-list logic.

// TRICK: Wrapping borders — if snake goes off screen, wrap to other side:
//   if (nextX > width) nextX = 0;
//   if (nextX < 0) nextX = width;

const Game9 = () => {
    const [snake, setSnake] = useState([{x:30, y:10}, {x:31, y:10}, {x:32, y:10}])
    const snakeRef = useRef({ x: 32, y: 10 }); // snake head — useRef to avoid stale closure

    const randomPos = () => {
        const posX = Math.floor(Math.random() * 800)
        const posY = Math.floor(Math.random() * 460)
        return {x: posX, y: posY}
    }

    const [food, setFood] = useState(randomPos())
    const [direction, setDirection] = useState([1,0])
    const [marks, setMarks] = useState(0)
    const foodRef = useRef(food) // useRef for food position (no stale closure)

    useEffect(() => {
        const tickRate = 50
        const hitbox = 20
        const gameLoop = setInterval(() => {

            // calculate next position using ref (not stale state)
            let nextX = snakeRef.current.x + 5*(direction[0]);
            let nextY = snakeRef.current.y + 5*(direction[1]);

            // GOOD: wrap-around borders
            if (nextX > 800-20) {
                nextX = 0;
            } else if (nextX < 0) {
                nextX = 800-20;
            }
            if (nextY > 460-20) {
                nextY = 0
            } else if (nextY < 0) {
                nextY = 460-20
            }

            snakeRef.current = { x:nextX, y: nextY };

            // check eat food using refs (no stale closure)
            const snakeX = snakeRef.current.x
            const snakeY = snakeRef.current.y
            const distX = Math.abs(snakeX - foodRef.current.x)
            const distY = Math.abs(snakeY - foodRef.current.y)

            if (distX < hitbox && distY < hitbox) {
                const newPos = randomPos()
                foodRef.current = newPos;
                setFood(newPos)
                setMarks((marks) => marks+1)
            }

            // GOOD: snake grows by increasing slice length when food is eaten
            setSnake((prevSnake) => {
                const newBody = [...prevSnake, snakeRef.current]
                return newBody.slice(-(3+marks))
            });
        }, tickRate);
        return () => clearInterval(gameLoop);
    }, [direction])

    // TRICK: keyboard handler — no dependency array = re-registers every render
    // (simpler than managing stale closures for direction state)
    useEffect(() => {
        const handleSwipe = (e) => {
            e.preventDefault()
            if (e.key === "ArrowLeft") {
                setDirection([-1, 0])
            } else if (e.key === "ArrowRight") {
                setDirection([1, 0])
            } else if (e.key === "ArrowUp") {
                setDirection([0, -1])
            } else if (e.key === "ArrowDown") {
                setDirection([0, 1])
            } else {
                return
            }
        }

        window.addEventListener("keydown", handleSwipe)
        return () => {
            window.removeEventListener("keydown", handleSwipe)
        }
    })


    return (
        <>
            <h1>Hello lets play the Snake Game!</h1>
            <h2>Your marks is {marks}</h2>
            <div className="flex flex-col items-center justify-center border w-fit mx-auto">
            <div className="board" style={{ position: 'relative', width: '800px', height: '460px', background: '#f0f0f0' }}>
                {snake.map((segment, index) => (
                    <div
                    key={index}
                    className={`absolute text-sm`}
                    style={{
                        left: `${segment.x}px`,
                        top: `${segment.y}px`,
                    }}
                >
                    🟢
                </div>
                ))}
                <div
                    className="food"
                    style={{
                    position: 'absolute',
                    left: `${food.x}px`,
                    top: `${food.y}px`,
                    width: '10px',
                    height: '10px',
                    background: 'transparent'
                    }}
                >
                    🍖
                </div>
            </div>
            </div>
        </>
    )
}

export default Game9