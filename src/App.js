import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import wordsArray from "./wordsArray";
import wordsSet from "./wordsSet";
import alphabet from "./alphabet";
var _ = require("lodash");

const createLetterArray = () => {
  let letterArray = [];
  for (let i = 0; i < 26; i++) {
    letterArray[i] = "unknown";
  }
  return letterArray;
};

const createGuessArray = () => {
  let guessArray = [];
  for (let i = 0; i < 6; i++) {
    guessArray.push(["_", "_", "_", "_", "_"]);
  }
  return guessArray;
};

const createGuessKeyArray = () => {
  let guessKeyArray = [];
  for (let i = 0; i < 6; i++) {
    guessKeyArray.push(["unknown", "unknown", "unknown", "unknown", "unknown"]);
  }
  return guessKeyArray;
};

const chooseWord = () => {
  let word =
    wordsArray[Math.floor(Math.random() * wordsArray.length)].toUpperCase();
  while (word[4] === "S") {
    word =
      wordsArray[Math.floor(Math.random() * wordsArray.length)].toUpperCase();
  }
  return word;
};

function App() {
  const [letterArray, setLetterArray] = useState(createLetterArray());
  const [guesses, setGuesses] = useState(createGuessArray());
  const [guessKey, setGuessKey] = useState(createGuessKeyArray());
  const [index1, setIndex1] = useState(0);
  const [index2, setIndex2] = useState(0);
  const [guessWord, setGuessWord] = useState(chooseWord());
  const [statusMessage, setStatusMessage] = useState(
    "Press enter to check the word"
  );
  const [gameOver, setGameOver] = useState(false);
  const [streak, setStreak] = useState(Number(localStorage.getItem("streak")) || 0);
  const [longestStreak, setLongestStreak] = useState(
    Number(localStorage.getItem("longestStreak")) || 0
  );
  const [gameOverMessage, setGameOverMessage] = useState("");
  const divRef = useRef(null);

  const handleKeyPress = (e) => {
    if (!gameOver) {
      let guessesCopy = _.cloneDeep(guesses);
      //backspace to delete a character
      if (e.keyCode === 8 || e.keyCode === 46) {
        if (index2 !== 0) {
          if (index2 !== 4) {
            guessesCopy[index1][index2 - 1] = "_";
            setGuesses(guessesCopy);
            setIndex2(index2 - 1);
          } else {
            if (guessesCopy[index1][index2] === "_") {
              guessesCopy[index1][index2 - 1] = "_";
              setIndex2(index2 - 1);
            } else {
              guessesCopy[index1][index2] = "_";
            }
            setGuesses(guessesCopy);   
          }
        }
      }
      //alphabetical character
      else if (
        (e.keyCode >= 65 && e.keyCode <= 90) ||
        (e.keyCode >= 97 && e.keyCode <= 122)
      ) {
        guessesCopy[index1][index2] = String.fromCharCode(e.keyCode);
        setGuesses(guessesCopy);
        if (index2 < 4) {
          setIndex2(index2 + 1);
        }
      }
      //enter
      else if (e.keyCode === 13) {
        //end of word
        if (index2 === 4 && guesses[index1][index2] !== "_") {
          //is word in dictionary
          if (isValid(index1)) {
            //check letters of word
            checkWord();
          } else {
            setStatusMessage("Please enter a valid word");
          }
        } else {
          setStatusMessage("Not enough letters");
        }
      }
      console.log(index1, index2);
    }
  };

  const checkWord = () => {
    setStatusMessage("Press enter to check the word");
    if (index1 <= 5) {
      let allCorrect = true;
      let guessKeyCopy = _.cloneDeep(guessKey);
      let letterArrayCopy = _.cloneDeep(letterArray);
      for (let i = 0; i < guesses[index1].length; i++) {
        //if letter is in corret place
        if (guesses[index1][i] === guessWord[i]) {
          guessKeyCopy[index1][i] = "correct";
          let letterIndex = guesses[index1][i].charCodeAt(0) - 65;
          letterArrayCopy[letterIndex] = "correct";
        } else if (guessWord.includes(guesses[index1][i])) {
          guessKeyCopy[index1][i] = "known";
          let letterIndex = guesses[index1][i].charCodeAt(0) - 65;
          if (letterArrayCopy[letterIndex] === "unknown") {
            letterArrayCopy[letterIndex] = "known";
          }
          allCorrect = false;
        } else {
          guessKeyCopy[index1][i] = "incorrect";
          let letterIndex = guesses[index1][i].charCodeAt(0) - 65;
          if (letterArrayCopy[letterIndex] === "unknown") {
            letterArrayCopy[letterIndex] = "incorrect";
          }
          allCorrect = false;
        }
      }
      setGuessKey(guessKeyCopy);
      setLetterArray(letterArrayCopy);
      if (allCorrect) {
        endGame("win");
      } else if (index1 >= 5) {
        endGame("loss");
      }
    }
    setIndex1(index1 + 1);
    setIndex2(0);
  };

  const isValid = (ind) => {
    if (wordsSet.has(guesses[ind].join("").toLowerCase())) {
      return true;
    }
    return false;
  };

  const endGame = async (status) => {
    //block additional user actions
    setIndex1(10);
    setGameOver(true);

    if (status === "win") {
      localStorage.setItem("streak", streak + 1);
      if (streak + 1 > longestStreak) {
        setLongestStreak(streak + 1);
        localStorage.setItem("longestStreak", streak + 1);
      }
      setStreak(streak + 1);
      setGameOverMessage("Congratulations! You won!");
    } else {
      localStorage.setItem("streak", 0);
      setStreak(0);
      setGameOverMessage("Better luck next time!");
    }
  };

  const newGame = () => {
    setLetterArray(createLetterArray());
    setGuesses(createGuessArray());
    setGuessKey(createGuessKeyArray());
    setIndex1(0);
    setIndex2(0);
    setGuessWord(chooseWord());
    setStatusMessage("Press enter to check the word");
    setGameOver(false);
    setGameOverMessage("");
    divRef.current.focus();
  };

  useEffect(() => {
    divRef.current.focus();
  }, []);

  return (
    <div tabindex="0" className="App" onKeyDown={handleKeyPress} ref={divRef}>
      <div className="main-header">
        <h1>Welcome to Infinite Wordle</h1>
        <p>
          Based on{" "}
          <a target="_blank" href="https://www.powerlanguage.co.uk/wordle/">
            Wordle
          </a>
        </p>
        <p>Longest Streak: {longestStreak}</p>
        <p>Current Streak: {streak}</p>
        <p className="status-message">{statusMessage}</p>
      </div>
      <div className="game-board">
        <div className="row row-0">
          {guesses[0].map((item, idx) => {
            return <div className={"block " + guessKey[0][idx]}>{item}</div>;
          })}
        </div>
        <div className="row row-1">
          {guesses[1].map((item, idx) => {
            return <div className={"block " + guessKey[1][idx]}>{item}</div>;
          })}
        </div>
        <div className="row row-2">
          {guesses[2].map((item, idx) => {
            return <div className={"block " + guessKey[2][idx]}>{item}</div>;
          })}
        </div>
        <div className="row row-3">
          {guesses[3].map((item, idx) => {
            return <div className={"block " + guessKey[3][idx]}>{item}</div>;
          })}
        </div>
        <div className="row row-4">
          {guesses[4].map((item, idx) => {
            return <div className={"block " + guessKey[4][idx]}>{item}</div>;
          })}
        </div>
        <div className="row row-5">
          {guesses[5].map((item, idx) => {
            return <div className={"block " + guessKey[5][idx]}>{item}</div>;
          })}
        </div>
      </div>
      <div className="alphabet-key">
        {letterArray.map((item, idx) => {
          if (letterArray[idx] === "unknown") {
            return <div className="letter-key unknown">{alphabet[idx]}</div>;
          } else if (letterArray[idx] === "known") {
            return <div className="letter-key known">{alphabet[idx]}</div>;
          } else if (letterArray[idx] === "correct") {
            return <div className="letter-key correct">{alphabet[idx]}</div>;
          } else if (letterArray[idx] === "incorrect") {
            return <div className="letter-key incorrect">{alphabet[idx]}</div>;
          }
        })}
      </div>
      <div className="game-over">
        {gameOver ? <h3>{gameOverMessage}</h3> : ""}
        {gameOver ? (
          <h3>
            Correct Word:{" "}
            <a
              href={
                "http://www.google.com/search?q=" +
                guessWord.toLowerCase() +
                "+definition"
              }
              target="_blank"
            >
              {guessWord}
            </a>
          </h3>
        ) : (
          ""
        )}
        {gameOver ? <button className="new-game-button" onClick={newGame}>New Game</button> : ""}
      </div>
    </div>
  );
}

export default App;
