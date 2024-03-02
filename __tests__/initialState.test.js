describe("initial state", () => {
  it("should initialize classes and text content correctly", () => {
    // Set up the initial HTML structure
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

    // Import the function to be tested
    const { initStarterClassAndScores } = require("../script.js");

    // Get symbols elements
    const symbols = Array.from(document.querySelectorAll(".symbol"));

    // Get initial score values
    const xPlayerScore = String(Number(xPlayerWins.textContent)).padStart(
      2,
      "0"
    );
    const oPlayerScore = String(Number(oPlayerWins.textContent)).padStart(
      2,
      "0"
    );
    const tiesCounterScore = String(
      Number(tiesCounter.textContent) + 0
    ).padStart(2, "0");

    // Act
    const result = initStarterClassAndScores();

    // Assert initial scores are set to 0
    expect(xPlayerScore).toBe("00");
    expect(oPlayerScore).toBe("00");
    expect(tiesCounterScore).toBe("00");

    // Assert symbols have correct initial classes
    symbols.forEach((symbol) => {
      expect(symbol.classList.contains("cross")).toBe(true);
      expect(symbol.classList.contains("circle")).toBe(false);
    });

    // Assert score divs have correct initial classes
    expect(xScoreDiv.classList.contains("italic-text")).toBe(true);
    expect(oScoreDiv.classList.contains("italic-text")).toBe(false);

    // Assert the message returned by the function
    expect(result.message).toBe("Initiated game successfully");
  });
});
