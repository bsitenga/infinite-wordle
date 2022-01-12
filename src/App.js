import React, { useState } from "react";
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

function App() {
  const [letterArray, setLetterArray] = useState(createLetterArray());
  const [guesses, setGuesses] = useState([
    ["_", "_", "_", "_", "_"],
    ["_", "_", "_", "_", "_"],
    ["_", "_", "_", "_", "_"],
    ["_", "_", "_", "_", "_"],
    ["_", "_", "_", "_", "_"],
    ["_", "_", "_", "_", "_"],
  ]);
  const [guessKey, setGuessKey] = useState([
    ["unknown", "unknown", "unknown", "unknown", "unknown"],
    ["unknown", "unknown", "unknown", "unknown", "unknown"],
    ["unknown", "unknown", "unknown", "unknown", "unknown"],
    ["unknown", "unknown", "unknown", "unknown", "unknown"],
    ["unknown", "unknown", "unknown", "unknown", "unknown"],
    ["unknown", "unknown", "unknown", "unknown", "unknown"],
  ]);
  const [index1, setIndex1] = useState(0);
  const [index2, setIndex2] = useState(0);
  // const [guessWord, setGuessWord] = useState(
  //   wordsArray[Math.floor(Math.random() * wordsArray.length)].toUpperCase()
  // );
  const [guessWord, setGuessWord] = useState("VAULT");
  const [statusMessage, setStatusMessage] = useState(
    "Press enter to check the word"
  );
  const [gameOver, setGameOver] = useState(false);

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
            guessesCopy[index1][index2] = "_";
            guessesCopy[index1][index2 - 1] = "_";
            setGuesses(guessesCopy);
            setIndex2(index2 - 1);
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
        if (index2 === 4) {
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
      console.log("congrats");
    } else {
      console.log("loss");
    }
  };

  return (
    <div className="App" onKeyDown={handleKeyPress} tabIndex="0">
      <div className="main-header">
        <h1>Welcome to Infinite Wordle</h1>
        <p>
          Based on{" "}
          <a target="_blank" href="https://www.powerlanguage.co.uk/wordle/">
            Wordle
          </a>
        </p>
        <p>{statusMessage}</p>
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
    </div>
  );
}

export default App;
