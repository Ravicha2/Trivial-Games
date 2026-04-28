import { useState } from "react";

// TRICK: Rock-paper-scissors is the simplest game — good warmup.
// The win logic can be written as a lookup table instead of if/else chains:
//   const wins = { rock: "scissors", paper: "rock", scissors: "paper" }
//   if (wins[user] === bot) → user wins

// TRICK: Using emojis for UI — no need for images or CSS, just use strings.

const Game5 = () => {
    const option = ["🪨", "📃", "✂️"]
    const [userWin, setUserWin] = useState("")
    const [userChose, setUserChose] = useState("")
    const [botChose, setBotChose] = useState("")

    const botChoose = () => {
        const botChose = option[Math.floor(Math.random() * option.length)]
        return botChose
    }
    const handlePlay = (userChose) => {
        const botChose = botChoose()
        // GOOD: lookup table approach — much cleaner than nested if/else
        const wins = { "🪨": "✂️", "📃": "🪨", "✂️": "📃" }
        let win;
        if (botChose === userChose) {
            win = "Draw"
        } else if (wins[userChose] === botChose) {
            win = "User win"
        } else {
            win = "Bot win"
        }
        setUserChose(userChose)
        setBotChose(botChose)
        setUserWin(win)
    }
    return (
        <>
        <h1>Hello lets play the Rock Paper Scissor!</h1>
        <h2>{userWin}</h2>
        <div className="flex flex-col items-center">
            <p className='mb-2 border rounded-full w-10 h-10'>🤖</p>
            {
            userChose &&
            <div>
                {botChose}
            </div>
            }
        </div>
        <p>Vs</p>
        <div className='flex flex-col items-center'>
            {
                userChose &&
                <div>
                {userChose}
            </div>
            }
            <p className="mb-2 border rounded-full w-10 h-10">🤓</p>
        </div>
        <div className='flex flex-row justify-around mt-2'>
            <button className='border-1 p-2 rounded' onClick={() => handlePlay("🪨")}>🪨</button>
            <button className='border-1 p-2 rounded' onClick={() => handlePlay("📃")}>📃</button>
            <button className='border-1 p-2 rounded' onClick={() => handlePlay("✂️")}>✂️</button>
        </div>
        </>
    )
}

export default Game5;