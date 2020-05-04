import React, { Component, useState } from "react";
import { render } from "react-dom";
import Hello from "./Hello";
import "./style.css";

const StarsDisplay = (props) => (
  <>
    {utils.range(1, props.count).map((starId) => (
      <div key={starId} className="star" />
    ))}
  </>
);

const PlayNumber = (props) => (
  <button
    className="number"
    style={{ backgroundColor: colors[props.status] }}
    onClick={() => props.onClick(props.number, props.status)}
  >
    {props.number}
  </button>
);

const StarMatch = () => {
  const [stars, setStars] = useState(utils.random(1, 9));
  const [availableNumbers, setAvailableNumbers] = useState(utils.range(1, 9));
  const [candidateNums, setcandidateNums] = useState([]);

  const candidatesAreWrong = utils.sum(candidateNums) > stars;

  const numberStatus = (number) => {
    if (!availableNumbers.includes(number)) {
      return "used";
    }
    if (candidateNums.includes(number)) {
      return candidatesAreWrong ? "candidate" : "wrong";
    }
    return "available";
  };

  const onNumberClicked = (number, currentStatus) => {
    if (currentStatus == 'used') {
      return;
    }

    const newCandidatesNums = candidateNums.concat(number);

    if (utils.sum(newCandidatesNums) !== stars){
        setcandidateNums(newCandidatesNums);
    } else {
      const newAvailableNums = availableNumbers.filter(
        n=> !newCandidatesNums.includes(n)
      );
      setStars(utils.randomSumIn(newAvailableNums, 9))
      setAvailableNumbers(newAvailableNums);
      setcandidateNums([]);
    }

  };

  return (
    <div className="game">
      <div className="help">
        Pick 1 or more numbers that sum to the number of stars
      </div>
      <div className="body">
        <div className="left">
          <StarsDisplay count={stars} />
        </div>
        <div className="right">
          {utils.range(1, 9).map((number) => (
            <PlayNumber
              key={number}
              status={numberStatus(number)}
              number={number}
              onClick={onNumberClicked}
            />
          ))}
        </div>
      </div>
      <div className="timer">Time Remaining: 10</div>
    </div>
  );
};

// Color Theme
const colors = {
  available: "lightgray",
  used: "lightgreen",
  wrong: "lightcoral",
  candidate: "deepskyblue",
};

// Math science
const utils = {
  // Sum an array
  sum: (arr) => arr.reduce((acc, curr) => acc + curr, 0),

  // create an array of numbers between min and max (edges included)
  range: (min, max) => Array.from({ length: max - min + 1 }, (_, i) => min + i),

  // pick a random number between min and max (edges included)
  random: (min, max) => min + Math.floor(Math.random() * (max - min + 1)),

  // Given an array of numbers and a max...
  // Pick a random sum (< max) from the set of all available sums in arr
  randomSumIn: (arr, max) => {
    const sets = [[]];
    const sums = [];
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0, len = sets.length; j < len; j++) {
        const candidateSet = sets[j].concat(arr[i]);
        const candidateSum = utils.sum(candidateSet);
        if (candidateSum <= max) {
          sets.push(candidateSet);
          sums.push(candidateSum);
        }
      }
    }
    return sums[utils.random(0, sums.length - 1)];
  },
};

class App extends Component {
  constructor() {
    super();
    this.state = {
      name: "React",
    };
  }

  render() {
    return <StarMatch />;
  }
}

render(<StarMatch />, document.getElementById("root"));
