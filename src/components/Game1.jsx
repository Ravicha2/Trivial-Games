import { useEffect, useState } from "react";

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
            setWinningCells([(index, 0), (index, 1), (index, 2)])
        } else if (how === 'col') {
            setWinningCells([(0, index), (1, index), (2, index)])
        } else if (how === 'diagonal') {
            if (direction === 'left') {
                setWinningCells([(0, 0), (1, 1), (2, 2)])
            } else {
                setWinningCells([(2, 0), (1, 1), (0, 2)])
            }
        }
    }

    const isWinningCell = (row, col) => {
        if (winningCells[row] === col) {
            return true
        }
        return false
    }

    const newState = (row, col) => {
        if (table[row][col] === "X" || table[row][col] === "O") return;

        let newTable = table
        newTable[row][col] = turn
        setTable(newTable)

        for (let i=0; i<3; i++ ) {
            if (table[i][0] && table[i][0] === table[i][1] && table[i][1] === table[i][2]) {
                setWinner(turn)
                getWinningCells(i, 'row')
                return;
            } else if (table[0][i] && table[0][i] === table[1][i] && table[1][i] === table[2][i]) {
                setWinner(turn)
                getWinningCells(i, 'col')
                return;
            }
        }
        if (table[0][0] && table[0][0] === table[1][1] && table[1][1] === table[2][2]) {
            setWinner(turn)
            getWinningCells("", 'diagonal', 'right')
            return;
        }
        if (table[2][0] && table[2][0] === table[1][1] && table[1][1] === table[0][2]) {
            setWinner(turn)
            getWinningCells("", 'diagonal', 'left')
            return;
        }

        if (turn === "X") {
            setTurn("O")
        } else {
            setTurn("X")
        }
    }

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