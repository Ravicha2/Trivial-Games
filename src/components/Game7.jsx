import { useState } from "react";

const createBoard = () => {
    return [
        [0, 0, 0, 0, 0, 0, 0, 0, 0,],
        [0, 0, 0, 0, 0, 0, 0, 0, 0,],
        [0, 0, 0, 0, 0, 0, 0, 0, 0,],
        [0, 0, 0, 0, 0, 0, 0, 0, 0,],
        [0, 0, 0, 0, 0, 0, 0, 0, 0,],
        [0, 0, 0, 0, 0, 0, 0, 0, 0,],
        [0, 0, 0, 0, 0, 0, 0, 0, 0,],
        [0, 0, 0, 0, 0, 0, 0, 0, 0,],
        [0, 0, 0, 0, 0, 0, 0, 0, 0,],
    ]
}


const Game7 = () => {
    const [board, setBoard] = useState(createBoard());
    const [started, setStarted] = useState(false)

    const plantMines = (board, clickedCell, numMines=10) => {
        let mines = []
        let newBoard = board.map(row => [...row])
        while (mines.length < numMines) {
            const posX = Math.floor(Math.random() * board.length)
            const posY = Math.floor(Math.random() * board.length)
            if (newBoard[posX][posY] !== -1 && (posX !== clickedCell[0] && posY !== clickedCell[1])) {
                newBoard[posX][posY] = -1
                mines.push([posX, posY])
            }
        }

        const setPerimeter = (board, posX, posY) => {
            const perimeter = [
                [posX-1, posY-1], [posX, posY-1], [posX+1, posY-1],
                [posX-1, posY],                   [posX+1, posY],
                [posX-1, posY+1], [posX, posY+1], [posX+1, posY+1],
            ]
            for (let pos of perimeter) {
                if (pos[0]>=0 && pos[0] < 9 && pos[1] >=0 && pos[1] < 9) {
                    if (board[pos[0]][pos[1]] !== -1) {
                        board[pos[0]][pos[1]] += 1
                    }
                }
            }
            return board
        }
        
        for (let mine of mines) {
            const setPerimeterBoard = setPerimeter(newBoard, mine[0], mine[1])
            newBoard = setPerimeterBoard
        }

        setBoard(newBoard)
    }

    const handleClick = (rowIndex, colIndex) => {
        if (!started) {
            plantMines(board, [rowIndex, colIndex])
            setStarted(true)
        }

    }

    const renderboard = (board) => {
        return (board.map((row, rowIndex) => {
            return (
            <div className="flex flex-row" key={`${rowIndex}`}>
                {row.map((cell,colIndex) => {
                    return (
                        <div 
                            className={`border w-10 h-10 bg-gray-800`}
                            key={colIndex}
                            onClick={() => handleClick(rowIndex, colIndex)}
                        >
                            {cell}
                        </div>
                    )
                })}
            </div>
            )
        }))
    }

    return (
        <>
            <h1>Hello lets play the Minesweeper!</h1>
            <div className="flex flex-col items-center">
                {renderboard(board)}
            </div>
        </>
    )
}

export default Game7;