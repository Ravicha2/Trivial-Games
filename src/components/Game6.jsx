import { useState } from "react";

// TRICK: Connect 4 is tic-tac-toe but with gravity — column click drops piece
// to lowest empty row. The "gravity drop" is just a loop from top, find first
// occupied cell, place above it.

// TRICK: Win check using countInDirection — count consecutive same-player
// cells in both directions along each axis (horizontal, vertical, 2 diagonals).
// If total >= 4, win. This pattern scales to any N-in-a-row game.

// TRICK: countInDirection(rowStep, colStep, board, row, col, player) walks
// in one direction from the last placed piece. Call it for + and - of each axis:
//   horizontal: (0,-1) and (0,+1)
//   vertical:   (+1,0) only (pieces drop from top, no need to check up)
//   diag1:      (-1,-1) and (+1,+1)
//   diag2:      (+1,-1) and (-1,+1)

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

            // BUG FIX: use newBoard (updated) for win check, not old board
            const isWon = checkwin(newBoard, latestRow-1, colIndex, currentPlayer)
            if (isWon) {
                setPlayerWin(currentPlayer)
                return;
            }
            setCurrentPlayer(currentPlayer === 1 ? 2 : 1)
        }

    }

    // TRICK: use ternary chains for cell coloring — faster than class names
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