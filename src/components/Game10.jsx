import { useState, useEffect, useRef } from "react"

const randomShape = () => {
    const shapes = [
        [[1,0,0],
        [1,1,1],],
        [[0,1,0],
        [1,1,1]],
        [[1,1,1,1]]
    ]
    return shapes[Math.floor(Math.random() * shapes.length)]
}

const createBoard = () => {
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
    const [board, setBoard] = useState(createBoard())
    const [currentShape, setCurrentShape] = useState(randomShape())
    const shapeRef = useRef( {row:0, col:0} );

    const renderBoard = (board) => {
        return (
            board.map((row, rowIdx) => {
                return (
                    <div 
                        key={rowIdx}
                        className="flex flex-row justify-center "
                    >
                        {row.map((col, colIdx) => {
                            return (
                                <div 
                                    key={colIdx}
                                    className={`border w-6 h-4 text-xs ${col === 0 ? 'bg-transparent' : 'bg-blue-400'}`}
                                >
                                </div>
                            )
                        })}
                    </div>
                )
            })
        )
    }

    const moveShape = (board, currentShapeRef, shape,moveRow, moveCol) => {
        let newBoard = board.map(row => [...row])
        let newShapeCoord = []
        let oldShapeCoord = []
        const currentRow = parseInt(currentShapeRef.current.row)
        const currentCol = parseInt(currentShapeRef.current.col)
        for (let [rowIdx, row] of shape.entries()) {
            let newRowCoord = []
            let oldRowCoord = []
            for (let [colIdx, col] in row) {
                const rowInt = parseInt(rowIdx)
                const colInt = parseInt(colIdx)
                newRowCoord.push([currentRow+rowInt+moveRow, currentCol+colInt+moveCol])
                oldRowCoord.push([currentRow+rowInt, currentCol+colInt])
            }
            newShapeCoord.push(newRowCoord)
            oldShapeCoord.push(oldRowCoord)
        }
        for (let [rowIdx, row] of oldShapeCoord.entries()) {
            for (let [colIdx, col] of row.entries()) {
                if (col[0] < 0 || col[0] > 9 || col[1] < 0 || col[1] > 9) return;
                newBoard[col[0]][col[1]] = 0
            }
        }
        for (let [rowIdx, row] of newShapeCoord.entries()) {
            for (let [colIdx, col] of row.entries()) {
                if (col[0] < 0 || col[0] > 9 || col[1] < 0 || col[1] > 9) return;
                newBoard[col[0]][col[1]] = shape[rowIdx][colIdx]
            }
        }
        setBoard(newBoard)
        shapeRef.current = {row: shapeRef.current.row + moveRow, col: shapeRef.current.col + moveCol }
    }

    return (
        <>
            <h1>Hello lets play the Tetris!</h1>
            <div>
                {renderBoard(board)}
            </div>
            <button onClick={() => moveShape(board, shapeRef, currentShape, 1, 1)}>move</button>
        </>
    )
}

export default Game10