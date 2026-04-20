import { useEffect, useState } from 'react';

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
        const state = [botChose, userChose]
        let win;
        if ((state[0] === "🪨" && state[1] === "📃") || (state[1] === "🪨" && state[0] === "📃")) {
            win = userChose === "🪨" ? "Bot win" : "User win"

        } else if ((state[0] === "✂️" && state[1] === "📃") || (state[1] === "✂️" && state[0] === "📃")) {
            win = userChose === "📃" ? "Bot win" : "User win"

        } else if ((state[0] === "✂️" && state[1] === "🪨") || (state[1] === "✂️" && state[0] === "🪨")) {
            win = userChose === "✂️" ? "Bot win" : "User win"

        } else if (userChose) {
            win = "Draw"
        }
        console.log(win)
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