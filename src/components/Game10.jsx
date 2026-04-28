import { useState, useEffect, useRef } from "react"

// TRICK: Tetris uses a "locked board" + "current shape" pattern:
//   - lockedBoard: 2D array of 0s and 1s (cemented pieces)
//   - currentShape: 2D array of the falling piece
//   - shapePos: {row, col} position of the piece top-left corner
//   - getDisplayBoard(): merge locked board + current shape for rendering

// TRICK: validMove() checks ALL cells of the current shape against the
// locked board and borders. Loop over shape cells, if solid (1), check:
//   - Row/col within bounds
//   - No collision with locked board
// This ONE function handles all validation.

// TRICK: "Ref callback" pattern to avoid stale closures in setInterval:
//   const savedFn = useRef();
//   useEffect(() => { savedFn.current = fn });  // update ref every render
//   useEffect(() => {
//     const loop = setInterval(() => savedFn.current(), tickRate);
//     return () => clearInterval(loop);
//   }, []);  // empty deps = stable interval, reads latest fn via ref

// TRICK: When piece can't move down, "cement" it onto the locked board,
// then spawn a new shape. Simple and works.

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

    // GOOD: single validation function for all moves
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
        if (validMove(shapePos.row, nextCol)) {
            setShapePos({...shapePos, col: nextCol})
        }
    }

    // GOOD: cement shape onto locked board
    const cementShape = () => {
        let newLockedBoard = lockedBoard.map(row => [...row])
        for (let r=0; r < currentShape.length; r++) {
            for (let c=0; c < currentShape[r].length; c++) {
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

    // GOOD: merge locked board + current shape for display
    const getDisplayBoard = () => {
        let displayBoard = lockedBoard.map(row => [...row])
        for (let r=0; r < currentShape.length; r++) {
            for (let c=0; c < currentShape[r].length; c++) {
                if (currentShape[r][c] !== 0) {
                    const drawRow = shapePos.row + r
                    const drawCol = shapePos.col + c

                    if (drawRow < 20 && drawCol >=0 && drawCol < 10) {
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

    // GOOD: ref callback pattern to avoid stale closures in setInterval
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

    // TRICK: stable event listener using ref callback
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

    // TRICK: game loop with stable interval, reads latest function via ref
    useEffect(() => {
        const tickRate = 750
        const gameLoop = setInterval(() => {
            if (savedAttemptMoveDown.current) {
                savedAttemptMoveDown.current()
            }
        }, tickRate)
        return () => clearInterval(gameLoop);
    }, [])

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