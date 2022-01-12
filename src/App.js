import React, { useState } from "react";
import "./App.css";

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
  ]);
  const [guessKey, setGuessKey] = useState([
    ["unknown", "unknown", "unknown", "unknown", "unknown"],
    ["unknown", "unknown", "unknown", "unknown", "unknown"],
    ["unknown", "unknown", "unknown", "unknown", "unknown"],
    ["unknown", "unknown", "unknown", "unknown", "unknown"],
    ["unknown", "unknown", "unknown", "unknown", "unknown"],
  ]);
  const alphabet = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
  ];

  return (
    <div className="App">
      <div className="main-header">
        <h1>Welcome to Infinite Wordle</h1>
        <p>
          Based on{" "}
          <a target="_blank" href="https://www.powerlanguage.co.uk/wordle/">
            Wordle
          </a>
        </p>
      </div>
      <div className="game-board">
        <div className="row row-0">
          {guesses[0].map((item) => {
            return <div className="block a-1">{item}</div>;
          })}
        </div>
        <div className="row row-1">
          {guesses[1].map((item) => {
            return <div className="block a-1">{item}</div>;
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
            return <div className="letter-key correct">{alphabet[idx]}</div>;
          }
        })}
      </div>
    </div>
  );
}

export default App;
