import { useState, useEffect, useRef } from "react";

const randomInt = (min, max) =>
  min + Math.floor(Math.random() * (max - min + 1));

const Game12 = () => {
    const [start, setStart] = useState(false)
    const [gameOver, setGameOver] = useState(false)
    const [gameState, setGameState] = useState({
        birdPos: {x:100, y:200},
        currentPipes: []
    })

    const flap = () => {
        if (start) {
            setGameState((prevState => {
                const flapY = prevState.birdPos.y - 40

                if (!canMove(flapY)) {
                    return prevState
                } else {
                    const newGameState = { ...prevState, birdPos: {x: prevState.birdPos.x, y: flapY }}
                    return newGameState
                }
            }))
        }
    }

    const canMove = (purposedPos) => {
        return (purposedPos >= 0 && purposedPos <= 460)
    }

    const createPipe = () => {
        const pipeObject = {
            x: 800,
            gapTop: randomInt(80,200), 
            gapSize: randomInt(80,120)
        }
        return pipeObject
    }

    const renderPipes = () => {
        const pipes = gameState.currentPipes
        return (pipes.map((pipe, pipeIndex) => {
            return (
                <div key={pipeIndex}>
                    <div
                    key={`${pipeIndex}-top`}
                    className="absolute"
                    style={{
                        left: `${pipe.x}px`,
                        top: `0px`,
                        height: `${pipe.gapTop}px`,
                        width: '50px',
                        backgroundColor: 'green'
                    }}
                    >
                    </div>
                    <div
                    key={`${pipeIndex}-bot`}
                    className="absolute"
                    style={{
                        left: `${pipe.x}px`,
                        bottom: `0`,
                        height: `${460 - (pipe.gapTop + pipe.gapSize)}px`,
                        width: '50px',
                        backgroundColor: 'green'
                    }}
                    >
                    </div>
                </div>
            )
        }))
    }

    const collide = (birdPos, pipesPos) => {
        if (pipesPos.length === 0) return
        const birdX = birdPos.x
        const birdY = birdPos.y
        let nearestPipe;
        if (pipesPos[0].x > birdX) {
            nearestPipe = pipesPos[0]
        } else {
            nearestPipe = pipesPos[1]
        }

        if ((nearestPipe.x - birdPos.x) > 30) return false

        if (birdY > nearestPipe.gapTop && birdY < nearestPipe.gapTop + nearestPipe.gapSize) {
            return false
        } else {
            return true
        }

    }

    useEffect(() => {
        const handleKey = (e) => {
            if (e.key === 'ArrowUp') {
            e.preventDefault();
            flap();
            }
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    
    }, [start]);

    useEffect(() => {
        if (start) {
            const tickRate = 50
            const gameLoop = setInterval(() => {
                setGameState(prevState => {
                    const gravity = 5
                    const birdPos = prevState.birdPos
                    const prevPipes = prevState.currentPipes
                    
                    // gravity
                    let newBirdPos
                    const purposedBirdY = birdPos.y + gravity
                    if (purposedBirdY > 460 || purposedBirdY < 0) {
                        newBirdPos = birdPos
                    } else {
                        newBirdPos = {...birdPos, y:purposedBirdY}
                    }

                    // moving pipe
                    let nextPipes = []
                    const moveSpeed = 5
                    let screenWidth = 800
                    let pipeWidth = 50
                    let distBetweenPipe = 300
                    for (let pipe of prevPipes) {
                        let newX = pipe.x - moveSpeed
                        if (newX + pipeWidth > 0) {
                            nextPipes.push({...pipe, x:newX})
                        }
                    }
                    let lastPipe = nextPipes[nextPipes.length-1]
                    if (nextPipes.length === 0) {
                        const pipeObject = createPipe()
                        nextPipes.push(pipeObject)
                    }
                    if (lastPipe && lastPipe.x < (screenWidth - distBetweenPipe)) {
                        const pipeObject = createPipe()
                        nextPipes.push(pipeObject)
                    }

                    if (collide(newBirdPos, nextPipes)) {
                        setGameOver(true)
                        setStart(false)
                    } 
                    return {
                        birdPos: newBirdPos,
                        currentPipes: nextPipes
                    }

                })
            }, tickRate)
            return () => clearInterval(gameLoop);
        }
    }, [start])

    const reset = () => {
        setGameState({
            birdPos: {x:100, y:200},
            currentPipes: []
        })
        setStart(true)
        setGameOver(false)
    }

    return (
        <div className="flex flex-col items-center">
            <h1>Hello Let's Play Flappy Bird</h1>   
            <div 
                className="relative w-[800px] h-[480px] bg-[url('https://cdn.visualwilderness.com/wp-content/uploads/2019/12/Norway-Landscape-Photography-3-550x309.jpg')] bg-cover bg-center"
            >
                {renderPipes()}
                <div 
                    className="absolute text-2xl"
                    style={{
                        top: `${gameState.birdPos.y}px`,
                        left: `${gameState.birdPos.x}px`
                    }}
                >🐥</div>
                {gameOver ? 
                <div 
                className={`text-6xl relative top-40 text-red-500 bg-white/50 rounded${start && 'hidden'}`}
                >
                    Game Over
                </div>
                :
                <div 
                    className={`text-6xl relative top-40 ${start && 'hidden'}`}
                    onClick={() => setStart(true)}
                >
                    ▶️
                </div>}

            </div>
            {gameOver ? 
            <button 
                className="my-10 border p-2 rounded"
                onClick={() => reset(false)}
            >
                retry
            </button>
            :
            <button 
                className="my-10 border p-2 rounded"
                onClick={() => setStart(false)}
            >
                Pause
            </button>
            }
            </div>
    )
}

export default Game12;