import words from "../assets/words.json"
import { useState } from "react";

// TRICK: Wordle check pattern — use [char, label] tuples where label is
// "g" (green=correct position), "y" (yellow=wrong position but in word), "n" (gray=not in word).
// This makes rendering trivial — just check the label for background color.

// TRICK: For a real Wordle, handle duplicate letters properly:
//   1. First pass: mark exact matches (green)
//   2. Second pass: mark remaining letters that exist in word (yellow)
//   This code doesn't handle duplicates — fine for exam speed.

// TRICK: Store all guesses in an array, each guess is an array of [char, label].
// Rendering is just nested .map() — rows then cells.

const Game4 = () => {
    const [word, setWord] = useState(words[Math.floor(Math.random() * words.length)])
    const [guessWord, setGuessWord] = useState("")
    const [allGuessedWord, setAllGuessedWord] = useState([])
    const [win, setWin] = useState(false)

    // GOOD: clean check function — returns [char, "g"/"y"/"n"] for each position
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
        // GOOD: check for win condition by seeing if all labels are "g"
        if (labelledChars.every(c => c[1] === "g")) {
            setWin(true)
        }
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