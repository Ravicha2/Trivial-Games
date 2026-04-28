import { useState } from "react";

// TRICK: 3x3 tic-tac-toe is the simplest grid game — use it as your
// "starter template" for any turn-based grid game (connect4, minesweeper, etc.)
// Core pattern: 2D array state + click handler + win check + turn toggle.

// TRICK: Hardcode the 3x3 buttons inline instead of mapping — faster to
// write, no index/key issues. Only map if the board is bigger than 3x3.

// TRICK: Win check pattern — loop rows, loop cols, then check 2 diagonals
// separately. Don't overthink it. For 3x3 this is ~15 lines.

// TRICK: `isWinningCell` for highlighting the winning line — just store
// the winning cells as an array of {r,c} objects and check membership.

const Game1 = () => {
    const [table, setTable] = useState(
        [
            ["","",""],
            ["","",""],
            ["","",""],
        ]
    )
    const [turn, setTurn] = useState("X")
    const [winner, setWinner] = useState("")
    const [winningCells, setWinningCells] = useState([])

    const getWinningCells = (index, how, direction) => {
        if (how === 'row') {
            setWinningCells([{r: index, c: 0}, {r: index, c: 1}, {r: index, c: 2}])
        } else if (how === 'col') {
            setWinningCells([{r: 0, c: index}, {r: 1, c: index}, {r: 2, c: index}])
        } else if (how === 'diagonal') {
            if (direction === 'left') {
                setWinningCells([{r: 0, c: 0}, {r: 1, c: 1}, {r: 2, c: 2}])
            } else {
                setWinningCells([{r: 2, c: 0}, {r: 1, c: 1}, {r: 0, c: 2}])
            }
        }
    }

    const isWinningCell = (row, col) => {
        for (let e of winningCells) {
            if (e.r === row && e.c === col) {
                return true
            }
        }
        return false
    }

    const newState = (row, col) => {
        if (table[row][col] === "X" || table[row][col] === "O") return;

        // BUG FIX: must deep copy! `let newTable = table` is a reference, not a copy
        let newTable = table.map(row => [...row])
        newTable[row][col] = turn

        // GOOD: check win BEFORE switching turns, so the current player wins
        for (let i=0; i<3; i++ ) {
            if (newTable[i][0] && newTable[i][0] === newTable[i][1] && newTable[i][1] === newTable[i][2]) {
                setWinner(turn)
                getWinningCells(i, 'row')
                setTable(newTable)
                return;
            } else if (newTable[0][i] && newTable[0][i] === newTable[1][i] && newTable[1][i] === newTable[2][i]) {
                setWinner(turn)
                getWinningCells(i, 'col')
                setTable(newTable)
                return;
            }
        }
        if (newTable[0][0] && newTable[0][0] === newTable[1][1] && newTable[1][1] === newTable[2][2]) {
            setWinner(turn)
            getWinningCells("", 'diagonal', 'left')
            setTable(newTable)
            return;
        }
        if (newTable[2][0] && newTable[2][0] === newTable[1][1] && newTable[1][1] === newTable[0][2]) {
            setWinner(turn)
            getWinningCells("", 'diagonal', 'right')
            setTable(newTable)
            return;
        }

        setTable(newTable)
        // TRICK: toggle turns with ternary — `setTurn(turn === "X" ? "O" : "X")`
        setTurn(turn === "X" ? "O" : "X")
    }

    // TRICK: draw check — just loop and check for empty cells
    const draw = () => {
        for (let i=0; i<3; i++) {
            for (let j=0; j<3; j++) {
                if (table[i][j] === "") {
                    return false
                }
            }
        }
        return true
    }
    return (
    <>
        <h1>Hello lets play Tic Tac Toe</h1>
        {winner && `Winner is ${turn}`}
        {draw() && "Draw!"}
        <div>
            <button
                style={{width: 50, height: 50 , margin:10, backgroundColor: isWinningCell(0,0) ? "green" : "gray" }} disabled={!!winner || table[0][0] !== ""}  onClick={() => newState(0,0)}>{table[0][0]}</button>
            <button style={{width: 50, height: 50 , margin:10, backgroundColor: isWinningCell(0,1) ? "green" : "gray"}} disabled={!!winner || table[0][1] !== ""}  onClick={() => newState(0,1)}>{table[0][1]}</button>
            <button style={{width: 50, height: 50 , margin:10, backgroundColor: isWinningCell(0,2) ? "green" : "gray"}} disabled={!!winner || table[0][2] !== ""}  onClick={() => newState(0,2)}>{table[0][2]}</button>
        </div>
        <div>
            <button style={{width: 50, height: 50 , margin:10, backgroundColor: isWinningCell(1,0) ? "green" : "gray"}} disabled={!!winner || table[1][0] !== ""}  onClick={() => newState(1,0)}>{table[1][0]}</button>
            <button style={{width: 50, height: 50 , margin:10, backgroundColor: isWinningCell(1,1) ? "green" : "gray"}} disabled={!!winner || table[1][1] !== ""}  onClick={() => newState(1,1)}>{table[1][1]}</button>
            <button style={{width: 50, height: 50 , margin:10, backgroundColor: isWinningCell(1,2) ? "green" : "gray"}} disabled={!!winner || table[1][2] !== ""}  onClick={() => newState(1,2)}>{table[1][2]}</button>
        </div>
        <div>
            <button style={{width: 50, height: 50 , margin:10, backgroundColor: isWinningCell(2,0) ? "green" : "gray"}} disabled={!!winner || table[2][0] !== ""}  onClick={() => newState(2,0)}>{table[2][0]}</button>
            <button style={{width: 50, height: 50 , margin:10, backgroundColor: isWinningCell(2,1) ? "green" : "gray"}} disabled={!!winner || table[2][1] !== ""}  onClick={() => newState(2,1)}>{table[2][1]}</button>
            <button style={{width: 50, height: 50 , margin:10, backgroundColor: isWinningCell(2,2) ? "green" : "gray"}} disabled={!!winner || table[2][2] !== ""}  onClick={() => newState(2,2)}>{table[2][2]}</button>
        </div>
    </>

    )
}

export default Game1;