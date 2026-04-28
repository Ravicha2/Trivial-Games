import { useState, useEffect } from "react";

// TRICK: Data fetching pattern for games that need external data:
//   1. useState(null) for loading state
//   2. useEffect with [] deps to fetch on mount
//   3. Conditional render: if (!data) return "Loading..."
// This is the simplest async data pattern — no libraries needed.

// TRICK: Multiple choice quiz pattern:
//   - Store choices as an array
//   - Pick a random index for the correct answer
//   - Fill other slots with random distractors
//   - Check answer by comparing selected choice to correct answer name

// TRICK: Use .map() on the country data to transform it into the shape you
// need (just {flag, name}) right in the .then() — keeps state simple.

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
    // GOOD: randomly place correct answer among distractors
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

  // GOOD: re-render new question when score changes
  useEffect(() => {
    renderGame()
  }, [countCorrect, countWrong])

  // Keyboard shortcuts — map number keys to answer indices
  useEffect(() => {
    const handleChoose = (e) => {
      if (e.key === "1") {
        checkAnswer(0)  // FIX: keyboard index should match button index
      } else if (e.key === "2") {
        checkAnswer(1)
      } else if (e.key === "3") {
        checkAnswer(2)
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