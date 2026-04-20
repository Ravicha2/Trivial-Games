import { useEffect, useState } from "react";

const createBoard = () => {
    return [
        [0, 0, 0, 0, 0, 0, 0,],
        [0, 0, 0, 0, 0, 0, 0,],
        [0, 0, 0, 0, 0, 0, 0,],
        [0, 0, 0, 0, 0, 0, 0,],
        [0, 0, 0, 0, 0, 0, 0,],
        [0, 0, 0, 0, 0, 0, 0,],
    ]
}

const countInDirection = (rowStep, colStep, board, dropRow, dropCol, player) => {
    let count = 0;
    let row = dropRow + rowStep
    let col = dropCol + colStep

    while (row >= 0 && row < 6 && col >= 0 && col < 7 && board[row][col] === player) {
        count++
        row += rowStep
        col += colStep
    }
    return count
}


const checkwin = (board, droppingRow, droppingCol, player) => {
    const horizontal = 1 
    + countInDirection(0, -1, board, droppingRow, droppingCol, player)
    + countInDirection(0, 1, board,droppingRow, droppingCol, player)
    if (horizontal >= 4) return true;

    const vertical = 1 + countInDirection(1, 0, board, droppingRow, droppingCol, player);
    if (vertical >= 4) return true;

    const diagonal1 = 1
        + countInDirection(-1, -1, board, droppingRow, droppingCol, player)
        + countInDirection(1, 1, board, droppingRow, droppingCol, player);
    if (diagonal1 >= 4) return true;

    const diagonal2 = 1 
        + countInDirection(1, -1, board, droppingRow, droppingCol, player)
        + countInDirection(-1, 1, board, droppingRow, droppingCol, player);
    if (diagonal2 >= 4) return true;
}

const Game6 = () => {
    const [board, setBoard] = useState(createBoard());
    const [currentPlayer, setCurrentPlayer] = useState(1);
    const [playerWin, setPlayerWin] = useState("")
    let droppingRow;
    let droppingCol;

    const handleColumnClick = (colIndex) => {
        const newBoard = board.map(row => [...row])
        let latestRow = 0;
        for (let row of newBoard) {
            if (row[colIndex] === 0) {
                latestRow += 1
            } else {
                break
            }
        }
        if (latestRow) {
            newBoard[latestRow-1][colIndex] = currentPlayer
            setBoard(newBoard)
            droppingRow = latestRow-1
            droppingCol = colIndex

            const isWon = checkwin(board, droppingRow, droppingCol, currentPlayer)
            if (isWon) {
                setPlayerWin(currentPlayer)
                return;
            }
            if (currentPlayer === 1) {
                setCurrentPlayer(2)
            } else {
                setCurrentPlayer(1)
            }
        }

    }

    const renderboard = (board) => {
        return (board.map((row, rowIndex) => {
            return (
            <div className="flex flex-row" key={`${rowIndex}`}>
                {row.map((cell,colIndex) => {
                    return (
                        <div 
                            className={`border w-10 h-10 rounded-full 
                                ${cell === 1 
                                    ? 'bg-red-500' 
                                    : 
                                    (cell === 2 
                                        ? 'bg-yellow-500' 
                                        : 'bg-white'
                                    )
                                }`
                            } 
                            key={colIndex}
                            onClick={() => handleColumnClick(colIndex)}
                        >
                        </div>
                    )
                })}
            </div>
            )
        }))
    }

    return (
        <>
            <h1>Hello lets play the Connect 4!</h1>
            <h2>{playerWin && `the player ${playerWin} win!`}</h2>
            <div className="flex flex-col items-center">
                {renderboard(board)}
            </div>
        </>
    )
}

export default Game6;