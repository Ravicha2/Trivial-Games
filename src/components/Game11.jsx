// Technical Requirements
// Data Fetching: * On initial component mount, fetch the list of all countries from: 
// https://restcountries.com/v3.1/all?fields=name,flags.
// Question Generation: Randomly select one country as the "Correct Answer" and display its flag image.
// Multiple Choice: Provide four (4) clickable options. One must be the correct name, and the other three must be unique, random "distractors" from the country list.
// Shuffle: Ensure the correct answer is not always in the same button position.
// State Management:
// Track the user's current score.
// Track the game status (e.g., "Waiting for Guess", "Correct!", or "Wrong!").
// Once a selection is made, provide immediate visual feedback and transition to the next question after a short delay (e.g., 2 seconds).                      

import { useState, useEffect } from "react";

const Game11 = () => {
  const [currentCountry, setCurrentCountry] = useState('')
  const [countryData, setCountryData] = useState(null)
  const [displayAnswer, setDisplayAnswer] = useState(['', '', ''])
  const [countCorrect, setCountCorrect] = useState(0)
  const [countWrong, setCountWrong] = useState(0)

  const randomCountry = () => {
    return countryData[Math.floor(Math.random() * countryData.length)]
  }

  useEffect(() => {
    fetch('https://restcountries.com/v3.1/all?fields=name,flags')
      .then(response => response.json())
      .then(json => json.map(country => {
        return {
          flag: country.flags.svg,
          name: country.name.common
        }
      }))
      .then(json => setCountryData(json))
      .catch(error => console.error(error));
  }, []);

  const renderGame = () => {
    if (!countryData) return;
    const country = countryData[Math.floor(Math.random() * countryData.length)]
    setCurrentCountry(country)
    let choice = displayAnswer.map(country => randomCountry().name)
    choice[Math.floor(Math.random() * choice.length)] = country.name
    setDisplayAnswer(choice)
  }

  useEffect(() => {
    renderGame()
  }, [countryData])

  const checkAnswer = (choiceIndex) => {
    const answer = displayAnswer[choiceIndex]
    if (answer === currentCountry.name) {
      setCountCorrect(count => count + 1)
    } else {
      setCountWrong(count => count + 1)
    }
  }

  useEffect(() => {
    renderGame()
  }, [countCorrect, countWrong])

  useEffect(() => {
    const handleChoose = (e) => {
      if (e.key === "1") {
        checkAnswer(1)
      } else if (e.key === "2") {
        checkAnswer(2)
      } else if (e.key === "3") {
        checkAnswer(3)
      } else {
        return 
      }
    }
    window.addEventListener("keydown", handleChoose)
    return () => {
        window.removeEventListener("keydown", handleChoose)
    }
  },[])

  return (
    <>
      <h1>Hello Let's play FlagGuessr</h1>
      <h2 className="mb-4">your got right: {countCorrect}, wrong: {countWrong}</h2>
      <div className="w-full flex flex-col items-center mx-auto">
        <img className='w-80' src={currentCountry.flag}/>
        <div className="flex flex-row gap-10 mt-5">
          <button 
            className="border rounded-xl p-2 bg-gray-300 text-black"
            onClick={() => checkAnswer(0)}
          >
            {displayAnswer[0]}
          </button>
          <button 
            className="border rounded-xl p-2 bg-gray-300 text-black"
            onClick={() => checkAnswer(1)}
          >
            {displayAnswer[1]}
          </button>
          <button 
            className="border rounded-xl p-2 bg-gray-300 text-black"
            onClick={() => checkAnswer(2)}
          >
            {displayAnswer[2]}
          </button>
        </div>
      </div>
    </>
  )
  }

export default Game11;