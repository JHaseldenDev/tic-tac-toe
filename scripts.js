let player1, player2, currentTurn, gameActive, timerId, cells;
const winningMessageDiv = document.getElementById("winning-message");
const timerDiv = document.getElementById("timer");

document.getElementById("start-button").addEventListener("click", startGame);
document.getElementById("reset-button").addEventListener("click", resetGame);

function startGame() {
    player1 = document.getElementById("player1").value;
    player2 = document.getElementById("player2").value;
    if (!player1 || !player2) {
        alert("Please enter names for both players");
        return;
    }
    currentTurn = player1;
    gameActive = true;
    this.disabled = true;
    document.getElementById("reset-button").disabled = false;

    // Create the game board
    const gameBoard = document.getElementById("game-board");
    cells = [];
    for (let i = 0; i < 9; i++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.addEventListener('click', handleClick, { once: true });
        gameBoard.appendChild(cell);
        cells.push(cell);
    }

    startTimer();
}

function resetGame() {
    cells.forEach(cell => {
        cell.innerText = '';
        cell.style.backgroundColor = "#718093";
    });
    document.getElementById("start-button").disabled = false;
    this.disabled = true;
    gameActive = false;
    stopTimer();
    timerDiv.innerText = "00:00";
}

function startTimer() {
    let seconds = 0;
    timerId = setInterval(function() {
        seconds++;
        let minutes = Math.floor(seconds / 60);
        let remainingSeconds = seconds % 60;
        timerDiv.innerText = `${pad(minutes)}:${pad(remainingSeconds)}`;
    }, 1000);
}

function stopTimer() {
    clearInterval(timerId);
}

function pad(number) {
    return number < 10 ? "0" + number : number;
}

cells.forEach(cell => {
    cell.addEventListener('click', handleClick, { once: true })
});

function handleClick(e) {
    const cell = e.target;
    if (!gameActive || cell.innerText !== '') return;
    cell.innerText = currentTurn === player1 ? "X" : "O";
    cell.style.backgroundColor = currentTurn === player1 ? "#ff6347" : "#4682b4";
    checkWin();
    currentTurn = currentTurn === player1 ? player2 : player1;
}

function checkWin() {
    let isWinningCombination = false;
    winningCombinations.forEach(combination => {
        if (cells[combination[0]].innerText !== '' && cells[combination[0]].innerText === cells[combination[1]].innerText && cells[combination[1]].innerText === cells[combination[2]].innerText) {
            isWinningCombination = true;
            combination.forEach(index => cells[index].style.backgroundColor = "green");
        }
    });
    if (isWinningCombination) {
        winningMessageDiv.innerText = `${currentTurn} Wins!`;
        gameActive = false;
        document.getElementById("reset-button").disabled = false;
        stopTimer();
    }
}
