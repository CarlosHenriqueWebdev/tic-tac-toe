describe("resetGame", () => {
  it("should reset the game state correctly", () => {
    // Set up the initial game state
    document.body.innerHTML = `
      <div>
      <div class="cell x"></div>
      <div class="cell x"></div>
      <div class="cell o"></div>
      <div class="cell o"></div>
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
      </div>
    `;

    const { resetGame } = require("../script.js");

    const cells = Array.from(document.querySelectorAll(".cell"));
    const symbols = Array.from(document.querySelectorAll(".symbol"));

    // Act
    const result = resetGame();

    // Assert
    cells.forEach((cell) => {
      expect(cell.classList.contains("x")).toBe(false);
      expect(cell.classList.contains("o")).toBe(false);
    });

    symbols.forEach((symbol) => {
      expect(symbol.classList.contains("cross")).toBe(true);
      expect(symbol.classList.contains("circle")).toBe(false);
    });

    expect(xScoreDiv.classList.contains("italic-text")).toBe(true);
    expect(oScoreDiv.classList.contains("italic-text")).toBe(false);
    expect(tiesCounterDiv.classList.contains("italic-text")).toBe(false);

    // Check the result of the resetGame function
    expect(result.message).toBe("Game resetted sucessfully");
    expect(result.isGameOver).toBe(false);
    expect(result.currentPlayer).toBe("X");
  });
});
