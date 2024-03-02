const board = document.getElementById("board");
const cells = document.querySelectorAll(".cell");
const symbols = document.querySelectorAll(".symbol");
const overlay = document.getElementById("overlay");
const tiesCounter = document.getElementById("tiesCounter");
const xPlayerWins = document.getElementById("xPlayerWins");
const oPlayerWins = document.getElementById("oPlayerWins");
const tiesCounterDiv = document.getElementById("tiesCounterDiv");
const xScoreDiv = document.getElementById("xScoreDiv");
const oScoreDiv = document.getElementById("oScoreDiv");
const moveSound = document.getElementById("moveSound");
const victorySound = document.getElementById("victorySound");
const tieSound = document.getElementById("tieSound");

let isFirstClick = true;
let startingPlayer;

let currentPlayer = "X"; // Current player
let isGameOver = false;

// ClickCount for the ResetGame Function. Is currently used to make sure that the Match doesn't imediately Restart during a Player Last Move
let clickCount = 0;

function initStarterClassAndScores() {
  // Initial Class Italic Class for "X"
  xScoreDiv.classList.add("italic-text");

  // Initial Class Symbol for "X" on Hover
  symbols.forEach((symbol) => {
    symbol.classList.add("cross");
    symbol.classList.remove("circle");
  });

  // Start the Counter from "00" by adding Text to it
  tiesCounter.textContent = String(
    Number(tiesCounter.textContent) + 0
  ).padStart(2, "0");
  xPlayerWins.textContent = String(
    Number(xPlayerWins.textContent) + 0
  ).padStart(2, "0");
  oPlayerWins.textContent = String(
    Number(oPlayerWins.textContent) + 0
  ).padStart(2, "0");

  return {
    message: "Initiated game successfully",
  };
}

initStarterClassAndScores();

const checkForWinnerAndTie = () => {
  if (!cells || cells.length !== 9) {
    return { checkForWinnerMessage: "Invalid Cells State" };
  }

  // Winning Combinations, Rows, Collumns, and Diagonals
  const winningCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (const combo of winningCombos) {
    const [a, b, c] = combo;
    if (
      cells[a].classList.contains(currentPlayer.toLowerCase()) &&
      cells[b].classList.contains(currentPlayer.toLowerCase()) &&
      cells[c].classList.contains(currentPlayer.toLowerCase())
    ) {
      isGameOver = true;

      return {
        nextStartingPlayer: startingPlayer,
        playerWhoDidTheLastMove: currentPlayer,
        winningCombination: combo,
        checkForWinnerMessage: "Game Over, a Winning Combination has been done",
      };
    }
  }

  // Check if all cells are filled
  if (
    [...cells].every(
      (cell) => cell.classList.contains("x") || cell.classList.contains("o")
    )
  ) {
    isGameOver = true;

    return {
      playerWhoDidTheLastMove: currentPlayer,
      checkForWinnerMessage:
        "Tie, no winning Combintaions found and all Cells were filled",
    };
  }

  return {
    checkForWinnerMessage: "No Winners or Ties, match will keep going",
  };
};

const handleClick = (clickEvent) => {
  const checkResult = checkForWinnerAndTie(cells);

  if (isGameOver) {
    return {
      message: checkResult,
    };
  }

  // Return if the Clicked Cell has already been marked
  if (
    clickEvent.target.classList.contains("x") ||
    clickEvent.target.classList.contains("o")
  ) {
    return {
      currentPlayerTurn: currentPlayer,
      message: "Cell already marked. Returning",
    };
  }

  if (isFirstClick) {
    if (currentPlayer === "X") {
      startingPlayer = "O";
    } else if (currentPlayer === "O") {
      startingPlayer = "X";
    }

    isFirstClick = false;
  }

  // Add "X" or "O" Classes to the Clicked Cell
  clickEvent.target.classList.add(currentPlayer.toLowerCase());

  function playMoveSound() {
    moveSound.currentTime = 0.225; // Reset the sound to the beginning
    moveSound.volume = 0.75; // Reset the sound to the beginning
    moveSound.play();
  }

  playMoveSound();

  if (currentPlayer === "X") {
    // Change Symbols for the Hover Effect to be "O" on Click
    symbols.forEach((symbol) => {
      symbol.classList.add("circle");
      symbol.classList.remove("cross");
    });

    // Add and Remove Special Score Class, making it have only one at each Time
    if (oScoreDiv && xScoreDiv && tiesCounterDiv) {
      oScoreDiv.classList.add("italic-text");
      xScoreDiv.classList.remove("italic-text");
      tiesCounterDiv.classList.remove("italic-text");
    }
  } else if (currentPlayer === "O") {
    // Change Symbols for the Hover Effect to be "X" on Click
    symbols.forEach((symbol) => {
      symbol.classList.add("cross");
      symbol.classList.remove("circle");
    });

    if (oScoreDiv && xScoreDiv && tiesCounterDiv) {
      // Add and Remove Special Class, making it have only one at each Time
      xScoreDiv.classList.add("italic-text");
      oScoreDiv.classList.remove("italic-text");
      tiesCounterDiv.classList.remove("italic-text");
    }
  }

  const checkResultAgain = checkForWinnerAndTie(cells);

  if (
    checkResultAgain.checkForWinnerMessage ===
    "Game Over, a Winning Combination has been done"
  ) {
    function playVictorySound() {
      victorySound.currentTime = 0;
      victorySound.play();
    }

    playVictorySound();

    // Remove Hover Symbols Class
    symbols.forEach((symbol, index) => {
      // Add Class to all Cells Symbols to make them feel... "Disabled" during the Victory process
      symbol.classList.add("gray-filter");
      symbol.classList.remove("cross", "circle");

      // Highlights the Winning Comination Symbols by giving it Classes
      if (checkResultAgain.winningCombination.includes(index)) {
        symbol.classList.add("blink", "filter-white");
      }
    });

    // Increase the Score depending on who Won
    if (checkResultAgain.playerWhoDidTheLastMove === "X") {
      xPlayerWins.textContent = String(
        Number(xPlayerWins.textContent) + 1
      ).padStart(2, "0");
    } else if (checkResultAgain.playerWhoDidTheLastMove === "O") {
      oPlayerWins.textContent = String(
        Number(oPlayerWins.textContent) + 1
      ).padStart(2, "0");
    }

    // Displays the Restart Message Overlay
    overlay.classList.add("display-block");

    // Switch the Starting Player based on who Started last Turn
    currentPlayer = startingPlayer;

    return {
      message: "A winning combination was found on this turn",
      checkResultWinningCombination: checkResultAgain,
    };
  } else if (
    checkResultAgain.checkForWinnerMessage ===
    "Tie, no winning Combintaions found and all Cells were filled"
  ) {
    function playTieSound() {
      tieSound.currentTime = 0;
      tieSound.play();
    }

    playTieSound();

    // Remove Hover Symbols Class
    symbols.forEach((symbol) => {
      symbol.classList.remove("cross", "circle");
    });

    // Update Tie Score
    tiesCounter.textContent = String(
      Number(tiesCounter.textContent) + 1
    ).padStart(2, "0");

    // Tie Effects on the whole Board on MatchOver
    board.classList.add("blink", "gray-filter-tie");

    // Display Restart Game Overlay
    overlay.classList.add("display-block");

    // Add Class to Tie Score so it stands out
    tiesCounterDiv.classList.add("italic-text");
    oScoreDiv.classList.remove("italic-text");
    xScoreDiv.classList.remove("italic-text");

    // Switch the Starting Player based on who Started last Turn
    currentPlayer = startingPlayer;

    // Return so it doesn't run any further
    return {
      message: "A tie happened on this turn",
      checkResultWinningCombination: checkResultAgain,
    };
  }

  if (currentPlayer === "X") {
    currentPlayer = "O";
  } else if (currentPlayer === "O") {
    currentPlayer = "X";
  }

  return {
    isFirstClick: isFirstClick,
    currentPlayerTurn: currentPlayer,
    message: checkResult,
  };
};

// Triggers handleClick everytime after Clicking a Cell
cells.forEach((cell) => cell.addEventListener("click", handleClick));

const resetGame = () => {
  if (currentPlayer === "O") {
    // Hover Symbols Class
    symbols.forEach((symbol) => {
      symbol.classList.add("circle");
      symbol.classList.remove("cross");
    });

    // Score Classes
    oScoreDiv.classList.add("italic-text");
    xScoreDiv.classList.remove("italic-text");
    tiesCounterDiv.classList.remove("italic-text");
  } else if (currentPlayer === "X") {
    // Hover Symbols Class
    symbols.forEach((symbol) => {
      symbol.classList.add("cross");
      symbol.classList.remove("circle");
    });

    // Score Classes
    xScoreDiv.classList.add("italic-text");
    oScoreDiv.classList.remove("italic-text");
    tiesCounterDiv.classList.remove("italic-text");
  }

  // Remove Classes 'X' and 'O' from every Cell
  cells.forEach((cell) => {
    cell.classList.remove("x", "o");
  });

  // Reset the GameOver State
  isGameOver = false;

  return {
    currentPlayer,
    isGameOver,
    message: "Game resetted sucessfully",
  };
};

const boardClickToReset = () => {
  if (isGameOver) {
    // Increase CliclCount on Click if it's Game Over
    clickCount++;

    // Runs the Code if on GameOver, the User Clicks Exactly twice on the Board. The First Click is always the Player Last Move, and the Second Click is if they want to Reset the Game or not
    if (clickCount === 2) {
      const resetGameResult = resetGame();

      // Remove GameOver Classes
      symbols.forEach((symbol, index) => {
        symbol.classList.remove("blink", "filter-white", "gray-filter");
      });

      // Remove GameOver Classes
      board.classList.remove(
        "blink",
        "filter-white",
        "gray-filter",
        "gray-filter-tie"
      );

      // Remove Restart Game Overlay
      overlay.classList.remove("display-block");

      isFirstClick = true;

      // Resets Click Count
      clickCount = 0;

      return {
        resetGameResult,
        clickCount,
        isFirstClick,
        message: "Game has been resetted sucessfully after 2 clicks",
      };
    }

    return {
      clickCount,
      message: "Click one more time to reset the Game",
    };
  }
};

board.addEventListener("click", boardClickToReset);

if (typeof module !== "undefined" && module.exports) {
  // This is Node.js or Jest environment
  module.exports = {
    handleClick,
    initStarterClassAndScores,
    resetGame,
    boardClickToReset,
  };
}
