import { useState, useEffect, useRef } from "react"

const randomShape = () => {
    const shapes = [
        [
            [1,0,0],
            [1,1,1],
        ],
        [
            [0,1,0],
            [1,1,1]
        ],
        [
            [1,1,1,1]
        ]
    ]
    return shapes[Math.floor(Math.random() * shapes.length)]
}

const createEmptyBoard = () => {
    let board = []
    for (let i=0; i<20;i++) {
        let row = []
        for (let i=0;i<10;i++) {
            row.push(0)
        }
        board.push(row)
    }
    return board
}

const Game10 = () => {
    const [lockedBoard, setLockedBoard] = useState(createEmptyBoard())
    const [currentShape, setCurrentShape] = useState(randomShape())
    const [shapePos, setShapePos] = useState({ row: 0, col: 0 });

    const validMove = (targetRow, targetCol) => {
        for (let r=0; r < currentShape.length; r++) {
            for (let c=0; c < currentShape[r].length; c++) {
                const isSolidBlock = currentShape[r][c] !== 0

                if (isSolidBlock) {
                    const predictedRow = targetRow + r
                    const predictedCol = targetCol + c

                    // hit border
                    if (predictedRow >= 20 || predictedCol >= 10 || predictedCol < 0) return false
                    // hit cement
                    if (lockedBoard[predictedRow][predictedCol] !== 0) return false

                }
            }
        }
        return true
    }

    const attemptMoveDown = () => {
        const nextRow = shapePos.row + 1
        if (validMove(nextRow, shapePos.col)) {
            setShapePos({...shapePos, row: nextRow})
        } else {
            cementShape();
            spawnNewShape();
        }
    }

    const attemptMoveX = (direction) => {
        const nextCol = shapePos.col + direction
        const end = currentShape.length + nextCol
        if (nextCol < 0 || end >= 10) return
        if (validMove(shapePos.row, nextCol)) {
            setShapePos({...shapePos, col: nextCol})
        }
    }    

    const cementShape = () => {
        let newLockedBoard = lockedBoard.map(row => [...row])
        for (let r=0; r < currentShape.length; r++) {
            for (let c=0; c < currentShape[r].length; c++) {
                // if block, move down and add to cement
                if (currentShape[r][c] !== 0){
                    const finalRow = shapePos.row + r
                    const finalCol = shapePos.col + c
                    newLockedBoard[finalRow][finalCol] = currentShape[r][c]
                }
            } 
        }
        setLockedBoard(newLockedBoard);
    }

    const spawnNewShape = () => {
        setCurrentShape(randomShape())
        setShapePos({ row:0, col:0})
    }

    const getDisplayBoard = () => {
        let displayBoard = lockedBoard.map(row => [...row])
        for (let r=0; r < currentShape.length; r++) {
            for (let c=0; c < currentShape[r].length; c++) {
                if (currentShape[r][c] !== 0) {
                    const drawRow = shapePos.row + r
                    const drawCol = shapePos.col + c

                    if (drawRow < 20 && drawCol >=0 && drawCol < 20) {
                        displayBoard[drawRow][drawCol] = currentShape[r][c]
                    }
                }
            }
        }
        return displayBoard
    }

    const renderBoard = (board) => {
        return (board.map((row, rowId) => {
                return (<div 
                    key={rowId}
                    className="flex flex-row w-fit">
                    {row.map((col, colId) => {
                        return (
                        <div
                            className={`flex flex-row w-5 h-5 ${col === 0 ? 'bg-transparent' : (lockedBoard[rowId][colId] === 1 ? 'bg-green-500' :'bg-blue-500')}`}
                            key={colId}
                        >
                        </div>)
                    })}
                </div>)
            })
        )
    }

    const savedAttemptMoveDown = useRef();

    useEffect(() => {
        savedAttemptMoveDown.current = attemptMoveDown
    })

    const savedHandleSwipe = useRef();

    useEffect(() => {
        savedHandleSwipe.current = (e) => {
            e.preventDefault();
            if (e.key === "ArrowLeft") {
                attemptMoveX(-1);
            } else if (e.key === "ArrowRight") {
                attemptMoveX(1);
            }
        };
    });

    useEffect(() => {
        const listener = (e) => {
            if (savedHandleSwipe.current) {
                savedHandleSwipe.current(e);
            }
        };
    
        window.addEventListener("keydown", listener);
        
        return () => {
            window.removeEventListener("keydown", listener);
        };
    }, []);

    useEffect(() => {
        const tickRate = 750
        const gameLoop = setInterval(() => {
            if (savedAttemptMoveDown.current) {
                savedAttemptMoveDown.current()
            }
        }, tickRate)
        return () => clearInterval(gameLoop);
    }, [])

    useEffect(() => {
        const handleSwipe = (e) => {
            e.preventDefault()
            if (e.key === "ArrowLeft") {
                attemptMoveX(-1)
            } else if (e.key === "ArrowRight") {
                attemptMoveX(1)
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
            <h1>Hello lets play the Tetris!</h1>
            <div className="border w-fit mx-auto">
                {renderBoard(getDisplayBoard())}
            </div>
        </>
    )
}

export default Game10