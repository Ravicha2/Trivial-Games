import { useState, useEffect } from "react";

const Game2 = () => {
    const [table, setTable] = useState(
        [
            ["", "", "", ""],
            ["", "", "", ""],
            ["", "", "", ""],
            ["", "", "", ""],
        ]
    )

    const getFreeCell = (table) => {
        let freeCell = []
        for (let i=0; i<4; i++) {
            for (let j=0; j<4; j++) {
                if (table[i][j] === "") {
                    freeCell.push([i,j])
                }
            }
        }
        return freeCell
    }

    const getRandomVal = (min=0,max=3) => {
        const bin = [2,4,8,16]
        const index = Math.floor(Math.random() * (max - min + 1)) + min
        return bin[index];
    }
     
    const randomIndex = (min=0, max) => {
        const index = Math.floor(Math.random() * (max - min + 1)) + min
        return index
    }

    const randomFill = (newTable, freeCell) => {
        if (freeCell.length >= 5) {
            for (let i=0; i<2;i++) {
                const index = randomIndex(0, freeCell.length-1)
                const row = freeCell[index][0]
                const col = freeCell[index][1]
                newTable[row][col] = getRandomVal()
            }
        } else {
            const index = randomIndex(0, freeCell.length-1)
            const row = freeCell[index][0]
            const col = freeCell[index][1]
            newTable[row][col] = getRandomVal()
        }
        setTable(newTable)
    }

    const swipeLeft = (table, left=true) => {
        let newTable = table.map(row => [...row])
        let swipedTable = []
        for (let i=0; i<4; i++) {
            const newStack = []
            let prev = ""
            if (left) {
                for (let j=0; j<4;j++) {
                    if (!table[i][j]) {
                        continue
                    }
                    if (table[i][j] === prev) {
                        newStack[newStack.length - 1] *= 2
                        prev *= 2
                    } else {
                        newStack.push(newTable[i][j])
                        prev = table[i][j]
                    }
                }
            } 
            while (newStack.length < 4) {
                newStack.push("")
            }
        
            swipedTable.push(newStack)
        }
        return swipedTable;
    }

    const rotateBoard = (table, left) => {
        let newBoard = [
            ["", "", "", ""],
            ["", "", "", ""],
            ["", "", "", ""],
            ["", "", "", ""],
        ]
        if (left) {
            for (let i=0;i<4;i++) {
                for (let j=0;j<4;j++) {
                    newBoard[3-j][i] = table[i][j]
                }
            }
        } else {
            for (let i=0;i<4;i++) {
                for (let j=0;j<4;j++) {
                    newBoard[j][3-i] = table[i][j]
                }
            }
        }
        return newBoard
    }

    useEffect(() => {
        const freeCell = getFreeCell(table);
        const newTable = table.map(row => [...row])
        randomFill(newTable, freeCell)

    },[])

    useEffect(() => {
        const handleSwipe = (e) => {
            if (e.key === "ArrowLeft") {
                const swiped = swipeLeft(table)
                randomFill(swiped, getFreeCell(swiped));
            } 
            if (e.key === "ArrowRight") {
                const rotatedBoard = rotateBoard(rotateBoard(table, true), true)
                const swiped = swipeLeft(rotatedBoard)
                const swipedBoard = rotateBoard(rotateBoard(swiped, false), false)
                randomFill(swipedBoard, getFreeCell(swipedBoard));
            }
            if (e.key === "ArrowUp") {
                const rotatedBoard = rotateBoard(table,true)
                const swiped = swipeLeft(rotatedBoard)
                const swipedBoard = rotateBoard(swiped,false)
                randomFill(swipedBoard, getFreeCell(swipedBoard));
            }
            if (e.key === "ArrowDown") {
                const rotatedBoard = rotateBoard(table,false)
                const swiped = swipeLeft(rotatedBoard)
                const swipedBoard = rotateBoard(swiped,true)
                randomFill(swipedBoard, getFreeCell(swipedBoard));
            }
        }
        window.addEventListener("keydown", handleSwipe)
        return () => {
            window.removeEventListener("keydown", handleSwipe)
        }
    }, [table])


    return (
    <>
        <h1>Hello lets play 2048!</h1>
        <div style={{display:"flex", justifyContent: "center"}}>
            <div style={{width: 30, height:30, border:'1px solid white' }}>{table[0][0]}</div>
            <div style={{width: 30, height:30, border:'1px solid white' }}>{table[0][1]}</div>
            <div style={{width: 30, height:30, border:'1px solid white' }}>{table[0][2]}</div>
            <div style={{width: 30, height:30, border:'1px solid white' }}>{table[0][3]}</div>
        </div>
        <div style={{display:"flex", justifyContent: "center"}}>
            <div style={{width: 30, height:30, border:'1px solid white' }}>{table[1][0]}</div>
            <div style={{width: 30, height:30, border:'1px solid white' }}>{table[1][1]}</div>
            <div style={{width: 30, height:30, border:'1px solid white' }}>{table[1][2]}</div>
            <div style={{width: 30, height:30, border:'1px solid white' }}>{table[1][3]}</div>
        </div>
        <div style={{display:"flex", justifyContent: "center"}}>
            <div style={{width: 30, height:30, border:'1px solid white' }}>{table[2][0]}</div>
            <div style={{width: 30, height:30, border:'1px solid white' }}>{table[2][1]}</div>
            <div style={{width: 30, height:30, border:'1px solid white' }}>{table[2][2]}</div>
            <div style={{width: 30, height:30, border:'1px solid white' }}>{table[2][3]}</div>
        </div>
        <div style={{display:"flex", justifyContent: "center"}}>
            <div style={{width: 30, height:30, border:'1px solid white' }}>{table[3][0]}</div>
            <div style={{width: 30, height:30, border:'1px solid white' }}>{table[3][1]}</div>
            <div style={{width: 30, height:30, border:'1px solid white' }}>{table[3][2]}</div>
            <div style={{width: 30, height:30, border:'1px solid white' }}>{table[3][3]}</div>
        </div>
    </>
    )
}

export default Game2;