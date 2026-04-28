import { useState } from "react";

// TRICK: Deck as { C:[...], H:[...], D:[...], S:[...] } — each suit is an
// array, drawCard picks a random suit then a random card. Simple and works.

// TRICK: drawCard returns [card, newDeck] — functional style so you can
// chain draws: `const [c1, d1] = drawCard(deck); const [c2, d2] = drawCard(d1)`
// This avoids mutation and works with React state.

// TRICK: Ace counting — count aces, add 11 each, then while >21 subtract 10.
// Only ~5 lines and handles any number of aces.

// TRICK: Cards as [suit, value] tuples — easy to display and calculate.

const createDeck = () => ({
    C: ["A","2","3","4","5","6","7","8","9","10","J","Q","K"],
    H: ["A","2","3","4","5","6","7","8","9","10","J","Q","K"],
    D: ["A","2","3","4","5","6","7","8","9","10","J","Q","K"],
    S: ["A","2","3","4","5","6","7","8","9","10","J","Q","K"],
});

const copyDeck = (deck) => {
    const next = {};
    for (const suit in deck) next[suit] = [...deck[suit]];
    return next;
};

const drawCard = (deck) => {
    const suits = ["C","H","D","S"];
    const newDeck = copyDeck(deck);
    const available = suits.filter(s => newDeck[s].length > 0);
    if (!available.length) return null;

    while (true) {
        const suit = available[Math.floor(Math.random() * available.length)];
        if (!newDeck[suit].length) continue;
        const idx = Math.floor(Math.random() * newDeck[suit].length);
        const value = newDeck[suit][idx];
        newDeck[suit].splice(idx, 1);
        return [[suit, value], newDeck];
    }
};

// GOOD: Ace handling — add 11 first, then convert to 1 if bust
const calculateValue = (hand) => {
    let sum = 0;
    let aces = 0;
    for (const card of hand) {
        const val = card[1];
        if (val === "A") {
            aces++;
            sum += 11;
        } else if (["J","Q","K"].includes(val)) {
            sum += 10;
        } else {
            sum += parseInt(val);
        }
    }
    while (sum > 21 && aces > 0) {
        sum -= 10;
        aces--;
    }
    return sum;
};

const dealInitial = () => {
    let deck = createDeck();
    const [bCard1, d1] = drawCard(deck);
    const [pCard1, d2] = drawCard(d1);
    const [bCard2, d3] = drawCard(d2);
    const [pCard2, d4] = drawCard(d3);

    const bankerHand = [bCard1, bCard2];
    const playerHand = [pCard1, pCard2];
    return {
        deck: d4,
        bankerHand,
        playerHand,
        bankerSum: calculateValue(bankerHand),
        playerSum: calculateValue(playerHand),
    };
};

const SUIT_SYMBOL = { C: "♣", H: "♥", D: "♦", S: "♠" };
const RED_SUITS = ["H", "D"];

const Game3 = () => {
    const init = dealInitial();

    const [deck, setDeck] = useState(init.deck);
    const [bankerCard, setBankerCard] = useState(init.bankerHand);
    const [playerCard, setPlayerCard] = useState(init.playerHand);
    const [playerSum, setPlayerSum]   = useState(init.playerSum);
    const [bankerSum, setBankerSum]   = useState(init.bankerSum);
    const [winner, setWinner]         = useState("");
    const [gameOver, setGameOver]     = useState(false);

    const hit = () => {
        if (gameOver) return;

        const [newCard, newDeck] = drawCard(deck);
        const newHand = [...playerCard, newCard];
        const newSum  = calculateValue(newHand);

        setPlayerCard(newHand);
        setPlayerSum(newSum);
        setDeck(newDeck);

        if (newSum > 21) {
            setWinner("Banker wins! Player busted.");
            setGameOver(true);
        }
    };

    const stay = () => {
        if (gameOver) return;

        let localDeck = copyDeck(deck);
        let localHand = [...bankerCard];
        let localSum  = calculateValue(localHand);

        // GOOD: Banker draws until 17+ (standard casino rule)
        while (localSum <= 16) {
            const result = drawCard(localDeck);
            if (!result) break;
            const [newCard, newDeck] = result;
            localHand = [...localHand, newCard];
            localSum  = calculateValue(localHand);
            localDeck = newDeck;
        }

        setBankerCard(localHand);
        setBankerSum(localSum);
        setDeck(localDeck);

        if (localSum > 21) {
            setWinner("Player wins! Banker busted.");
        } else if (playerSum > localSum) {
            setWinner("Player wins!");
        } else if (localSum > playerSum) {
            setWinner("Banker wins!");
        } else {
            setWinner("It's a tie!");
        }
        setGameOver(true);
    };

    // GOOD: reset pattern — just re-run the init function and set all state
    const reset = () => {
        const next = dealInitial();
        setDeck(next.deck);
        setBankerCard(next.bankerHand);
        setPlayerCard(next.playerHand);
        setPlayerSum(next.playerSum);
        setBankerSum(next.bankerSum);
        setWinner("");
        setGameOver(false);
    };


    return (
        <div className='flex flex-col justify-center'>
            <h1>Hello lets play the Black Jack!</h1>
            <h2>{`${winner}`}</h2>
            <div className='mb-5'>
                <h2>Banker</h2>
                <div className='flex flex-row justify-center'>
                    {bankerCard.map((card,index) => (
                        <div key={index} className='border-1 m-1 w-7 h-10'>{gameOver ? card : ""}</div>
                    ))}
                </div>
                <div>{`Total Banker Value is ${gameOver ? bankerSum : "..." }`}</div>
            </div>
            <div className='mb-5'>
                <h2>Player</h2>
                <div className='flex flex-row justify-center'>
                    {playerCard.map((card,index) => (
                        <div key={index} className='border-1 m-1 w-7 h-10'>{card}</div>
                    ))}
                </div>
                <div>{`Total Player Value is ${playerSum}`}</div>
            </div>
            <div className='flex flex-row justify-center'>
                <button className="border p-3 w-20 flex mx-auto justify-center" onClick={hit}>Hit me</button>
                <button className="border p-3 w-20 flex mx-auto justify-center" onClick={stay}>Stay</button>
            </div>
            <div onClick={reset}>Play again</div>
        </div>
    )
}

export default Game3;