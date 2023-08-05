let player1, player2, currentTurn, gameActive, timerId;
const winningMessageDiv = document.getElementById("winning-message");
const timerDiv = document.getElementById("timer");
const gameBoard = document.getElementById("game-board");
let cells = [];  

const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],  // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8],  // Columns
    [0, 4, 8], [2, 4, 6]               // Diagonals
];

document.getElementById("start-button").addEventListener("click", startGame);
document.getElementById("reset-button").addEventListener("click", resetGame);

function startGame() {
    player1 = document.getElementById("player1").value;
    player2 = document.getElementById("player2").value;
    if (!player1 || !player2) {
        alert("Please enter names for both players");
        return;
    }
    currentTurn = "X";
    gameActive = true;
    this.disabled = true;
    document.getElementById("reset-button").disabled = false;
    winningMessageDiv.innerText = "";

    // Create the game board
    while (gameBoard.firstChild) {
        gameBoard.removeChild(gameBoard.firstChild);
    }
    for (let i = 0; i < 9; i++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.addEventListener('click', handleClick, { once: true });
        gameBoard.appendChild(cell);
    }

    cells = Array.from(document.querySelectorAll(".cell"));
    startTimer();
}

function resetGame() {
    cells.forEach(cell => {
        cell.innerText = '';
        cell.style.backgroundColor = "#2f3640";
        cell.removeEventListener('click', handleClick);  
        cell.addEventListener('click', handleClick, { once: true });
    });
    document.getElementById("start-button").disabled = false;
    this.disabled = true;
    gameActive = false;
    stopTimer();
    timerDiv.innerText = "00:00";
    winningMessageDiv.innerText = "";
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

function handleClick(e) {
    const cell = e.target;
    if (!gameActive || cell.innerText !== '') return;
    cell.innerText = currentTurn;
    if (checkWin()) {
        winningMessageDiv.innerText = `${currentTurn === "X" ? player1 : player2} Wins!`;
        winningMessageDiv.style.visibility = 'visible';
        winningMessageDiv.style.opacity = '1';
        gameActive = false;
        document.getElementById("reset-button").disabled = false;
        stopTimer();
    } else if (isTie()) {
        winningMessageDiv.innerText = "It's a Tie!";
        winningMessageDiv.style.visibility = 'visible';
        winningMessageDiv.style.opacity = '1';
        gameActive = false;
        document.getElementById("reset-button").disabled = false;
        stopTimer();
    } else {
        currentTurn = currentTurn === "X" ? "O" : "X";
    }
}

function isTie() {
    return [...cells].every(cell => cell.innerText === 'X' || cell.innerText === 'O');
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
        winningMessageDiv.innerText = `${currentTurn === "X" ? player1 : player2} Wins!`;
        winningMessageDiv.style.visibility = 'visible';
        winningMessageDiv.style.opacity = '1';
        gameActive = false;
        document.getElementById("reset-button").disabled = false;
        stopTimer();
    }
}
