import { useEffect, useState } from "react";

const createBoard = (placeholder) => {
    return [
        [placeholder, placeholder, placeholder, placeholder, placeholder, placeholder, placeholder, placeholder, placeholder,],
        [placeholder, placeholder, placeholder, placeholder, placeholder, placeholder, placeholder, placeholder, placeholder,],
        [placeholder, placeholder, placeholder, placeholder, placeholder, placeholder, placeholder, placeholder, placeholder,],
        [placeholder, placeholder, placeholder, placeholder, placeholder, placeholder, placeholder, placeholder, placeholder,],
        [placeholder, placeholder, placeholder, placeholder, placeholder, placeholder, placeholder, placeholder, placeholder,],
        [placeholder, placeholder, placeholder, placeholder, placeholder, placeholder, placeholder, placeholder, placeholder,],
        [placeholder, placeholder, placeholder, placeholder, placeholder, placeholder, placeholder, placeholder, placeholder,],
        [placeholder, placeholder, placeholder, placeholder, placeholder, placeholder, placeholder, placeholder, placeholder,],
        [placeholder, placeholder, placeholder, placeholder, placeholder, placeholder, placeholder, placeholder, placeholder,],
    ]
}


const Game7 = () => {
    const [board, setBoard] = useState(createBoard(0));
    const [started, setStarted] = useState(false);
    const [showBoard, setShowBoard] = useState(createBoard("H"));
    const [gameOver, setGameOver] = useState(false)
    const [win, setWin] = useState(false)


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
        return newBoard
    }

    const boardTraversal = (labelledBoard, rowIndex, colIndex) => {
        let exploreBoard = showBoard.map(row => [...row])
        let stack = [[rowIndex, colIndex]]
        exploreBoard[rowIndex][colIndex] = labelledBoard[rowIndex][colIndex]
        while (stack.length > 0) {
            const pos = stack.pop()
            const posX = pos[0]
            const posY = pos[1]

            if (labelledBoard[posX][posY] === 0) {
                const perimeter = [
                    [posX-1, posY-1], [posX, posY-1], [posX+1, posY-1],
                    [posX-1, posY],                   [posX+1, posY],
                    [posX-1, posY+1], [posX, posY+1], [posX+1, posY+1],
                ]
                for (let pos of perimeter) {
                    if (pos[0]>=0 && pos[0] < 9 && pos[1] >=0 && pos[1] < 9) {
                        if (exploreBoard[pos[0]][pos[1]] === "H") {
                            exploreBoard[pos[0]][pos[1]] = labelledBoard[posX][posY]
                            stack.push([pos[0], pos[1]])
                        }
                    }
                }
            } else {
                exploreBoard[posX][posY] = labelledBoard[posX][posY]
            }
        }
        return exploreBoard
    }

    const handleClick = (rowIndex, colIndex) => {
        if (showBoard[rowIndex][colIndex] === '⛳️') return;
        let exploredBoard;
        if (!started) {
            const newBoard = plantMines(board, [rowIndex, colIndex])
            setStarted(true)
            exploredBoard = boardTraversal(newBoard, rowIndex, colIndex)
            setShowBoard(exploredBoard)
        } else {
            if (board[rowIndex][colIndex] < 0) {
                setGameOver(true)
            }
            exploredBoard = boardTraversal(board, rowIndex, colIndex)
            setShowBoard(exploredBoard)
        }

        let revealCount = 0
        for (let row of exploredBoard) {
            for (let cell of row) {
                if (cell !== 'H' && cell !== '⛳️') {
                    revealCount += 1
                }
            }
        }
        console.log(revealCount)
        if (revealCount === 71) {
            setWin(true)
            console.log("Win")
        }
    }

    const handleRightClick = (e, rowIndex, colIndex) => {
        e.preventDefault()
        const newBoard = showBoard.map((row) => [...row])
        if (newBoard[rowIndex][colIndex] === '⛳️') {
            newBoard[rowIndex][colIndex] = 'H'
        } else {
            newBoard[rowIndex][colIndex] = '⛳️'
        }
        setShowBoard(newBoard)
    }

    const renderboard = (board) => {
        return (board.map((row, rowIndex) => {
            return (
            <div className="flex flex-row" key={`${rowIndex}`}>
                {row.map((cell,colIndex) => {
                    return (
                        <div 
                            className={`border w-10 h-10 ${cell === 0 ? 'bg-gray-500 text-gray-300' : (cell === 1 ? 'bg-gray-400 text-red-500' : (cell >= 2 ? 'bg-gray-800 text-green-400' : 'bg-gray-500 text-gray-200'))}`}
                            key={colIndex}
                            onClick={() => handleClick(rowIndex, colIndex)}
                            onContextMenu={(e) => handleRightClick(e, rowIndex, colIndex)}
                        >
                            {cell === -1 ? '💣' : (cell === "H" ? '' : cell)}
                        </div>
                    )
                })}
            </div>
            )
        }))
    }

    useEffect(() => {
        if (gameOver) {
            setShowBoard(board)
        }
    }, [gameOver])

    return (
        <>
            <h1>Hello lets play the Minesweeper!</h1>
            <h2>{gameOver && 'Busstttted!! Game Over'}</h2>
            <h2>{win && 'Congratulation you WIN🏆'}</h2>
            <div className="flex flex-col items-center">
                {renderboard(showBoard)}
            </div>
        </>
    )
}

export default Game7;