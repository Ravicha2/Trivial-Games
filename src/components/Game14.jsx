import { useState } from "react"


const Game14 = () => {
    const [towers, setTowers] = useState([
        [1, 2, 3],
        [0, 0, 0],
        [0, 0, 0],
    ])

    const renderTowers = (towers) => {
        return (towers.map((row, rowId) => {
            return (
                <div
                    key={rowId}
                    className="flex flex-col w-fit mx-40 items-center justify-center">
                    {row.map((col, colId) => {
                        return (
                        <div
                            className={`flex flex-row h-20 w-5 justify-center bg-yellow-600`}
                            key={colId}
                        >
                            {(towers[rowId][colId] !== 0) && 
                            <div 
                                className={`
                                    absolute justify-center h-20 w-${towers[rowId][colId] * 10} border 
                                    ${towers[rowId][colId] === 1 ? 'bg-red-300' : (towers[rowId][colId] === 2 ? 'bg-yellow-300' : 'bg-green-300')}
                                    `}
                            >
                            </div>
                            }
                        </div>)
                    })}
                </div>
            )
        }))
    }
    return (
        <>
            <h1>Let's Play tower of Hanoi</h1>
            <div className="flex flex-row justify-center mt-30">
                {renderTowers(towers)}
            </div>
        </>
    )
    }
export default Game14