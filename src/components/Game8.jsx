import { useState } from "react";

const createBoard = () => {
    let numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
    const removeIndex = () => {return Math.floor(Math.random() * numbers.length)}
    let table= []
    for (let i=0; i <4; i++) {
        const row = []
        for (let j=0; j<4; j++) {
            let index = removeIndex()
            const number = numbers[index] ? numbers[index] : ""
            row.push(number)
            numbers.splice(index,1)
        }
        table.push(row)
    }
    return table
}

const Game8 = () => {
    const [table, setTable] = useState(createBoard())

    const renderTable = (table) => {
        return (table.map((row, rowIndex) => {
            return (
            <div className="flex flex-row justify-center" key={`${rowIndex}`}>
                {row.map((cell,colIndex) => {
                    return (
                        <div 
                            className={`border w-10 h-10`}
                            key={colIndex}
                            onClick={() => moveTile(rowIndex, colIndex)}
                        >
                            {cell}
                        </div>
                    )
                })}
            </div>
            )
        }))
    }

    const moveTile = (rowIndex, colIndex) => {
        const movable = [
            [rowIndex-1, colIndex], [rowIndex, colIndex-1], [rowIndex+1, colIndex], [rowIndex, colIndex+1],
        ]
        const newTable = table.map((row) => [...row])
        for (let tile of movable) {
            const row = tile[0]
            const col = tile[1]
            if (row >= 0 && row < 4 && col >= 0 && col < 4) {
                if (newTable[row][col] === "") {
                    newTable[row][col] = newTable[rowIndex][colIndex]
                    newTable[rowIndex][colIndex] = ""
                }
            }
        }
        setTable(newTable)
    }

    return (
        <>
            <h1>Hello lets play the 15 Puzzle!</h1>
            <div>
                {renderTable(table)}
            </div>
        </>
    )
}

export default Game8;