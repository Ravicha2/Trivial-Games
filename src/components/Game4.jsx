import words from "../assets/words.json"
import { useState } from "react";


const Game4 = () => {
    const [word, setWord] = useState(words[Math.floor(Math.random() * words.length)])
    const [guessWord, setGuessWord] = useState("")
    const [allGuessedWord, setAllGuessedWord] = useState([])
    const [win, setWin] = useState(false)

    const checkInclusion = (char, index) => {
        const wordTiles = word.split("")
        if (wordTiles[index] === char) {
            return [char, "g"]
        } else if (word.includes(char)) {
            return [char, "y"]
        } else {
            return [char, "n"]
        }
    }

    const labelInclusion  = (attempted) => {
        const chars = attempted.split("").map((char, index) => checkInclusion(char, index))
        return chars
    }


    const handleSumbit = (e) => {
        e.preventDefault()
        if (allGuessedWord.length >= 5) return;
        if (guessWord.length !== 5) return;
        const attempted = guessWord
        const labelledChars = labelInclusion(attempted)
        setAllGuessedWord([...allGuessedWord, labelledChars])
        setGuessWord('')
    }

    return (
        <div>
            <h1>Hello lets play the Wordle!</h1>
            <div className="flex flex-row justify-center text-xl gap-2">

                {
                (win || (allGuessedWord.length === 5)) && 
                ( win 
                    ? 
                    <> 
                        <h2>You win🥇</h2>
                        <h2>, the word is</h2>
                        <h3>{word}</h3>
                    </>
                    : 
                    <> 
                        <h2>You Lose</h2>
                        <h2>the word is</h2>
                        <h3>{word}</h3>
                    </>
                ) 
                }
            </div>
            <div className="flex flex-col items-center mb-5">
                {allGuessedWord.map((guess,i) => (
                    <div key={i} className="flex flex-row gap-2 mb-2">
                        {guess.map((char,j) => (
                            <p key={j} className={`border p-2 ${char[1] === 'g' ? 'bg-green-300' : char[1] === 'y' ? 'bg-yellow-300' : 'bg-gray-300'}`}>{char[0]}</p>
                        ))}
                    </div>
                ))}
            </div>
            <form onSubmit={handleSumbit}>
                <input 
                    className="border-1 border-gray-300"
                    type="text"
                    value={guessWord} 
                    onChange={(e) => setGuessWord(e.target.value.toUpperCase())}
                    maxLength="5"
                />
                <input 
                    type="submit"
                />
            </form>
        </div>
    )
}

export default Game4;