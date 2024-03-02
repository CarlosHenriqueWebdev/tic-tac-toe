describe("handle click", () => {
  const baseHtml = `
<div id="board"></div>
<div id="overlay"></div>

<div id="tiesCounterDiv"></div>
<div id="xScoreDiv"></div>
<div id="oScoreDiv"></div>

<span id="xPlayerWins"></span>
<span id="oPlayerWins"></span>
<span id="tiesCounter"></span>

<audio id="moveSound"></audio>
<audio id="victorySound"></audio>
<audio id="tieSound"></audio>
`;

  beforeEach(() => {
    // Reset the handleClick function and isGameOver variable
    jest.resetModules();

    jest.spyOn(HTMLMediaElement.prototype, "play").mockImplementation(() => {});
  });

  afterEach(() => {
    // Important, as it removes the "Play error"
    jest
      .spyOn(HTMLMediaElement.prototype, "play")
      .mockImplementation(() => {})
      .mockRestore();
  });

  it("should switch the player turn", () => {
    // ID must stay the same as the one on the Script that is being tested
    document.body.innerHTML = `
    <div>
      <div class="cell"></div>
      <div class="cell"></div>
      <div class="cell"></div>
      <div class="cell"></div>
      <div class="cell"></div>
      <div class="cell"></div>
      <div class="cell"></div>
      <div class="cell"></div>
      <div class="cell"></div>

      ${baseHtml}
    </div>
  `;

    const { handleClick } = require("../script.js");

    // Get the cells after setting up the HTML structure
    const cells = Array.from(document.querySelectorAll(".cell"));

    // Mock the event object with a target property
    const clickEvent = { target: cells[0] };

    const result = handleClick(clickEvent);

    expect(result.message.checkForWinnerMessage).toBe(
      "No Winners or Ties, match will keep going"
    );
    expect(result.currentPlayerTurn).toBe("O");

    // Mock the event object with a target property
    const clickEventTwo = { target: cells[1] };

    const resultTwo = handleClick(clickEventTwo);

    expect(resultTwo.currentPlayerTurn).toBe("X");
  });

  it("should be a game over if there is a winning combination", () => {
    document.body.innerHTML = `
  <div>
  <div class="cell x"></div>
  <div class="cell x"></div>
  <div class="cell x"></div>
  <div class="cell"></div>
  <div class="cell"></div>
  <div class="cell"></div>
  <div class="cell"></div>
  <div class="cell"></div>
  <div class="cell"></div>

  ${baseHtml}
  </div>
  `;

    const cells = Array.from(document.querySelectorAll(".cell"));

    const { handleClick } = require("../script.js");

    // Mock the event object with a target property
    const clickEvent = { target: cells[0] };

    const result = handleClick(clickEvent);

    expect(result.message.checkForWinnerMessage).toBe(
      "Game Over, a Winning Combination has been done"
    );
  });

  it("should return a message if the board cells state is currently invalid", () => {
    document.body.innerHTML = `
  <div>
  <div class="cell"></div>

  ${baseHtml}
  </div>
  `;

    const cells = Array.from(document.querySelectorAll(".cell"));

    const { handleClick } = require("../script.js");

    // Mock the event object with a target property
    const clickEvent = { target: cells[0] };

    const result = handleClick(clickEvent);

    expect(result.message.checkForWinnerMessage).toBe("Invalid Cells State");
  });

  it("should give a tie message upon a tie being done", () => {
    document.body.innerHTML = `
    <div>
    <div class="cell x"></div>
    <div class="cell o"></div>
    <div class="cell x"></div>
    <div class="cell x"></div>
    <div class="cell o"></div>
    <div class="cell o"></div>
    <div class="cell o"></div>
    <div class="cell x"></div>
    <div class="cell x"></div>

    ${baseHtml}
  </div>  
  `;

    const cells = Array.from(document.querySelectorAll(".cell"));

    const { handleClick } = require("../script.js");

    // Mock the event object with a target property
    const clickEvent = { target: cells[0] };

    const result = handleClick(clickEvent);

    expect(result.message.checkForWinnerMessage).toBe(
      "Tie, no winning combinations found and all cells were filled"
    );
  });

  it("should return if the cell is already marked", () => {
    document.body.innerHTML = `
    <div>
    <div class="cell x"></div>
    <div class="cell"></div>
    <div class="cell"></div>
    <div class="cell"></div>
    <div class="cell"></div>
    <div class="cell"></div>
    <div class="cell"></div>
    <div class="cell"></div>
    <div class="cell"></div>

    ${baseHtml}
  </div>  
  `;

    const { handleClick } = require("../script.js");

    const cells = Array.from(document.querySelectorAll(".cell"));

    // Mock the event object with a target property
    const clickEvent = { target: cells[0] };

    const result = handleClick(clickEvent);

    expect(result.message).toBe("Cell already marked. Returning");
    expect(result.currentPlayerTurn).toBe("X");
  });

  it("should add class to the cell if it is not marked and play the move sound", () => {
    // ID must stay the same as the one on the Script that is being tested
    document.body.innerHTML = `
        <div>
        <div class="cell"></div>
        <div class="cell"></div>
        <div class="cell"></div>
        <div class="cell"></div>
        <div class="cell"></div>
        <div class="cell"></div>
        <div class="cell"></div>
        <div class="cell"></div>
        <div class="cell"></div>
      
        ${baseHtml}
        </div>
        `;

    const { handleClick } = require("../script.js");
    const cells = Array.from(document.querySelectorAll(".cell"));

    const clickEvent = { target: cells[0] };

    handleClick(clickEvent);

    expect(cells[0].classList.contains("x")).toBe(true);
    expect(HTMLMediaElement.prototype.play).toHaveBeenCalledTimes(1);
  });

  it("should change symbols for the hover effect based on the current player", () => {
    document.body.innerHTML = `
    <div>
    <div class="cell"></div>
    <div class="cell"></div>
    <div class="cell"></div>
    <div class="cell"></div>
    <div class="cell"></div>
    <div class="cell"></div>
    <div class="cell"></div>
    <div class="cell"></div>
    <div class="cell"></div>
    
    <div class="symbol"></div>
    <div class="symbol"></div>
    <div class="symbol"></div>
    <div class="symbol"></div>
    <div class="symbol"></div>
    <div class="symbol"></div>
    <div class="symbol"></div>
    <div class="symbol"></div>
    <div class="symbol"></div>
  
    ${baseHtml}
  </div>  
  `;

    const { handleClick } = require("../script.js");
    const cells = Array.from(document.querySelectorAll(".cell"));
    const symbols = Array.from(document.querySelectorAll(".symbol"));

    // Mock click event on the first cell
    const clickEvent = { target: cells[0] };

    // Initially, currentPlayer is "X", so symbols should be updated to show "O" for hover effect
    const result = handleClick(clickEvent);

    symbols.forEach((symbol) => {
      expect(symbol.classList.contains("circle")).toBe(true);
      expect(symbol.classList.contains("cross")).toBe(false);
    });

    expect(result.currentPlayerTurn).toBe("O");

    // Mock click event on the first cell
    const clickEventTwo = { target: cells[1] };

    // Change currentPlayer to "O" and check if symbols are updated to show "X" for hover effect
    const resultTwo = handleClick(clickEventTwo);

    symbols.forEach((symbol) => {
      expect(symbol.classList.contains("circle")).toBe(false);
      expect(symbol.classList.contains("cross")).toBe(true);
    });

    expect(resultTwo.currentPlayerTurn).toBe("X");
  });

  it("should give special class to the scoreboard based on which player turn it is", () => {
    // ID must stay the same as the one on the Script that is being tested
    document.body.innerHTML = `
        <div>
        <div class="cell"></div>
        <div class="cell"></div>
        <div class="cell"></div>
        <div class="cell"></div>
        <div class="cell"></div>
        <div class="cell"></div>
        <div class="cell"></div>
        <div class="cell"></div>
        <div class="cell"></div>
        
        ${baseHtml}
        </div>
        `;

    const { handleClick } = require("../script.js");
    const cells = Array.from(document.querySelectorAll(".cell"));

    // Mock click event on the first cell
    const clickEvent = { target: cells[0] };

    // Initially, currentPlayer is "X", so symbols should be updated to show "O" for hover effect
    handleClick(clickEvent);

    // Check if scores are updated correctly
    expect(oScoreDiv.classList.contains("italic-text")).toBe(true);
    expect(xScoreDiv.classList.contains("italic-text")).toBe(false);
    expect(tiesCounterDiv.classList.contains("italic-text")).toBe(false);

    // Mock click event on the first cell
    const clickEventTwo = { target: cells[1] };

    // Change currentPlayer to "O" and check if symbols are updated to show "X" for hover effect
    handleClick(clickEventTwo);

    // Check if scores are updated correctly
    expect(oScoreDiv.classList.contains("italic-text")).toBe(false);
    expect(xScoreDiv.classList.contains("italic-text")).toBe(true);
    expect(tiesCounterDiv.classList.contains("italic-text")).toBe(false);
  });

  it("should trigger the winning condition + play the victory sound if there's a winner + give each symbol a disabled effect class as the game is over + remove their hover effects + update the score based on who won + add class to overlay + and other winning effects", () => {
    document.body.innerHTML = `
    <div>
    <div class="cell"></div>
    <div class="cell x"></div>
    <div class="cell x"></div>
    <div class="cell"></div>
    <div class="cell"></div>
    <div class="cell"></div>
    <div class="cell"></div>
    <div class="cell"></div>
    <div class="cell"></div>

    <div class="symbol"></div>
    <div class="symbol"></div>
    <div class="symbol"></div>
    <div class="symbol"></div>
    <div class="symbol"></div>
    <div class="symbol"></div>
    <div class="symbol"></div>
    <div class="symbol"></div>
    <div class="symbol"></div>

    ${baseHtml}
    </div>
    `;

    const { handleClick } = require("../script.js");
    const cells = Array.from(document.querySelectorAll(".cell"));
    const symbols = Array.from(document.querySelectorAll(".symbol"));

    const clickEvent = { target: cells[0] };

    const result = handleClick(clickEvent);

    const updateWinnerScore = String(Number(xPlayerWins.textContent)).padStart(
      2,
      "0"
    );

    expect(result.message).toBe("A winning combination was found on this turn");

    expect(result.checkResultWinningCombination.winningCombination).toEqual([
      0, 1, 2,
    ]);

    expect(updateWinnerScore).toBe("01");

    expect(overlay.classList.contains("display-block")).toBe(true);

    symbols.forEach((symbol) => {
      expect(symbol.classList.contains("gray-filter")).toBe(true);
      expect(symbol.classList.contains("circle")).toBe(false);
      expect(symbol.classList.contains("cross")).toBe(false);
    });

    expect(
      symbols[0].classList.contains("blink") &&
        symbols[0].classList.contains("filter-white") &&
        symbols[1].classList.contains("blink") &&
        symbols[1].classList.contains("filter-white") &&
        symbols[2].classList.contains("blink") &&
        symbols[2].classList.contains("filter-white")
    ).toBe(true);

    expect(
      symbols[3].classList.contains("blink") ||
        symbols[4].classList.contains("filter-white") ||
        symbols[5].classList.contains("blink") ||
        symbols[6].classList.contains("filter-white") ||
        symbols[7].classList.contains("blink") ||
        symbols[8].classList.contains("filter-white")
    ).toBe(false);

    expect(HTMLMediaElement.prototype.play).toHaveBeenCalledTimes(2);
  });

  it("should give a tie message upon a tie being done", () => {
    document.body.innerHTML = `
    <div>
    <div class="cell"></div>
    <div class="cell o"></div>
    <div class="cell x"></div>
    <div class="cell x"></div>
    <div class="cell o"></div>
    <div class="cell o"></div>
    <div class="cell o"></div>
    <div class="cell x"></div>
    <div class="cell x"></div>

    <div class="symbol"></div>
    <div class="symbol"></div>
    <div class="symbol"></div>
    <div class="symbol"></div>
    <div class="symbol"></div>
    <div class="symbol"></div>
    <div class="symbol"></div>
    <div class="symbol"></div>
    <div class="symbol"></div>
    
    ${baseHtml}
  </div>  
  `;

    const cells = Array.from(document.querySelectorAll(".cell"));

    const { handleClick } = require("../script.js");

    // Mock the event object with a target property
    const clickEvent = { target: cells[0] };

    const result = handleClick(clickEvent);

    expect(result.message).toBe("A tie happened on this turn");
  });

  it("should switch the starting player turn based on who started last time", () => {
    document.body.innerHTML = `
    <div>
    <div class="cell"></div>
    <div class="cell o"></div>
    <div class="cell x"></div>
    <div class="cell x"></div>
    <div class="cell o"></div>
    <div class="cell o"></div>
    <div class="cell o"></div>
    <div class="cell x"></div>
    <div class="cell x"></div>

    <div class="symbol"></div>
    <div class="symbol"></div>
    <div class="symbol"></div>
    <div class="symbol"></div>
    <div class="symbol"></div>
    <div class="symbol"></div>
    <div class="symbol"></div>
    <div class="symbol"></div>
    <div class="symbol"></div>
    
    ${baseHtml}
  </div>  
  `;

    const cells = Array.from(document.querySelectorAll(".cell"));

    const { handleClick } = require("../script.js");

    // Mock the event object with a target property
    const clickEvent = { target: cells[0] };

    const result = handleClick(clickEvent);

    expect(result.message).toBe("A tie happened on this turn");
  });
});
