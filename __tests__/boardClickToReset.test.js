describe("resetGame", () => {
  it("should reset game state and remove classes on second click after game over", () => {
    document.body.innerHTML = `
    <div>
    <div class="cell "></div>
    <div class="cell x"></div>
    <div class="cell x"></div>
    <div class="cell "></div>
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

    jest.spyOn(HTMLMediaElement.prototype, "play").mockImplementation(() => {});

    const { boardClickToReset, handleClick } = require("../script.js");

    const cells = Array.from(document.querySelectorAll(".cell"));
    const symbols = Array.from(document.querySelectorAll(".symbol"));

    const clickEvent = { target: cells[0] };

    const triggerWin = handleClick(clickEvent);

    expect(triggerWin.message).toBe(
      "A winning combination was found on this turn"
    );

    // Simulate click event. Calls it twice so the clickCount can go up
    const firstClick = boardClickToReset();

    expect(firstClick.message).toBe("Click one more time to reset the Game");
    expect(firstClick.clickCount).toBe(1);

    const secondClick = boardClickToReset();

    expect(secondClick.resetGameResult.message).toBe(
      "Game resetted sucessfully"
    );
    expect(secondClick.message).toBe(
      "Game has been resetted sucessfully after 2 clicks"
    );
    expect(secondClick.clickCount).toBe(0);
    expect(secondClick.isFirstClick).toBe(true);

    // Check that classes are removed
    symbols.forEach((symbol) => {
      expect(symbol.classList.contains("blink")).toBe(false);
      expect(symbol.classList.contains("filter-white")).toBe(false);
      expect(symbol.classList.contains("gray-filter")).toBe(false);
    });

    expect(board.classList.contains("blink")).toBe(false);
    expect(board.classList.contains("filter-white")).toBe(false);
    expect(board.classList.contains("gray-filter")).toBe(false);
    expect(board.classList.contains("gray-filter-tie")).toBe(false);
    expect(overlay.classList.contains("display-block")).toBe(false);
  });
});
