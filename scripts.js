let player1, player2 = "AI", currentTurn, gameActive, timerId, aiPlayer = false, difficulty = "easy"; // Added default value for difficulty
const winningMessageDiv = document.getElementById("winning-message");
const timerDiv = document.getElementById("timer");
const gameBoard = document.getElementById("game-board");
let cells = [];

const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

document.getElementById("start-button").addEventListener("click", startGame);
document.getElementById("reset-button").addEventListener("click", resetGame);
document.addEventListener("DOMContentLoaded", function() {
    togglePlayer2Input();
});


function startGame() {
    player1 = document.getElementById("player1").value || "Player 1";  // Default to "Player 1" if no name is provided

    let player2Type = document.getElementById("player2-type").value;
    if (player2Type === "human") {
        player2 = document.getElementById("player2-name").value || "Player 2";  // Default to "Player 2" if no name is provided
    }

    aiPlayer = (player2Type === "AI");
    difficulty = document.getElementById("difficulty").value; // Assuming you have a dropdown with id "difficulty" for AI difficulty selection

    currentTurn = "X";
    gameActive = true;

    document.getElementById("start-button").disabled = true;
    document.getElementById("reset-button").disabled = false;
    winningMessageDiv.innerText = "";

    createGameBoard();
    startTimer();
}

function createGameBoard() {
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
}

function resetGame() {
    cells.forEach(cell => {
        cell.innerText = '';
        cell.style.backgroundColor = "#2f3640";
        cell.removeEventListener('click', handleClick);
        cell.addEventListener('click', handleClick, { once: true });
    });
    document.getElementById("start-button").disabled = false;
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

/*function handleClick(e) {
    const cell = e.target;
    if (!gameActive || cell.innerText !== '') return;
    cell.innerText = currentTurn;
    cell.style.backgroundColor = currentTurn === "X" ? "#ff6347" : "#4682b4";
    
    if (checkWin()) {
        displayWinner();
        stopTimer();
    } else if (isBoardFull(cells)) {
        winningMessageDiv.innerText = "It's a Tie!";
        gameActive = false;
    } else {
        currentTurn = currentTurn === "X" ? "O" : "X";
        if (aiPlayer && currentTurn === "O") {
            aiMove();
        }
    }
}*/

function handleClick(e) {
    const cell = e.target;
    if (!gameActive || cell.innerText !== '') return;
    cell.innerText = currentTurn;
    cell.style.backgroundColor = currentTurn === "X" ? "#ff6347" : "#4682b4";
    
    if (checkWin()) {
        displayWinner();
        stopTimer();
    } else if (isBoardFull(cells)) {
        winningMessageDiv.innerText = "It's a Tie!";
        gameActive = false;
    } else {
        currentTurn = currentTurn === "X" ? "O" : "X";
    }
}


function isBoardFull(board) {
    return board.every(cell => cell.innerText !== '');
}


function checkWin() {
    let isWinningCombination = false;
    for (let combination of winningCombinations) {
        if (cells[combination[0]].innerText && cells[combination[0]].innerText === cells[combination[1]].innerText && cells[combination[1]].innerText === cells[combination[2]].innerText) {
            isWinningCombination = true;
            for (let index of combination) {
                cells[index].style.backgroundColor = "green";
            }
        }
    }
    return isWinningCombination;
}

function displayWinner() {
    winningMessageDiv.innerText = `${currentTurn === "X" ? player1 : player2} Wins!`;
    gameActive = false;
    document.getElementById("reset-button").disabled = false;
}


// AI Functions
function aiMove() {
    if (difficulty === "easy") {
        randomMove();
    } else if (difficulty === "medium") {
        if (!blockOrWin("O") && !blockOrWin("X")) {
            randomMove();
        }
    } else {
        minimaxMove();
    }
}

function randomMove() {
    let availableCells = cells.filter(cell => cell.innerText === '');
    let randomCell = availableCells[Math.floor(Math.random() * availableCells.length)];
    randomCell.click();
}

function blockOrWin(playerSign) {
    for (let combination of winningCombinations) {
        if (cells[combination[0]].innerText === playerSign && cells[combination[1]].innerText === playerSign && cells[combination[2]].innerText === '') {
            cells[combination[2]].click();
            return true;
        } else if (cells[combination[0]].innerText === playerSign && cells[combination[2]].innerText === playerSign && cells[combination[1]].innerText === '') {
            cells[combination[1]].click();
            return true;
        } else if (cells[combination[1]].innerText === playerSign && cells[combination[2]].innerText === playerSign && cells[combination[0]].innerText === '') {
            cells[combination[0]].click();
            return true;
        }
    }
    return false;
}

// Minimax functions are implemented as previously explained
function minimax(board, depth, isMaximizing) {
    let winner = checkWinForMinimax(board);
    if (winner !== null) {
        return winner === 'X' ? -10 + depth : 10 - depth;
    }

    if (isBoardFull(board)) {
        return 0;
    }

    let bestScore = isMaximizing ? -Infinity : Infinity;
    for (let i = 0; i < board.length; i++) {
        if (board[i] === '') {
            board[i] = isMaximizing ? 'O' : 'X';
            let score = minimax(board, depth + 1, !isMaximizing);
            board[i] = '';  // Reset the cell
            bestScore = isMaximizing ? Math.max(score, bestScore) : Math.min(score, bestScore);
        }
    }
    return bestScore;
}

function minimaxMove() {
    let bestScore = -Infinity;
    let bestMove;

    // Check all cells
    for (let i = 0; i < cells.length; i++) {
        if (cells[i].innerText === '') {
            cells[i].innerText = 'O';
            let board = cells.map(cell => cell.innerText);
            let score = minimax(board, 0, false);  // 0 is the initial depth, and false means next turn is of player X
            cells[i].innerText = '';  // Reset the cell
            if (score > bestScore) {
                bestScore = score;
                bestMove = i;
            }
        }
    }

    cells[bestMove].click();  // AI chooses the best move
}

function checkWinForMinimax(board) {
    for (let combination of winningCombinations) {
        if (board[combination[0]] && board[combination[0]] === board[combination[1]] && board[combination[1]] === board[combination[2]]) {
            return board[combination[0]];
        }
    }
    return null;
}

function isBoardFull(board) {
    return board.every(cell => cell !== '');
}

function togglePlayer2Input() {
    const playerType = document.getElementById("player2-type").value;
    const player2NameInput = document.getElementById("player2-name");
    const difficultyDropdown = document.getElementById("difficulty");

    if (playerType === "AI") {
        player2NameInput.style.display = 'none';
        difficultyDropdown.style.display = 'block';
    } else {
        player2NameInput.style.display = 'block';
        difficultyDropdown.style.display = 'none';
    }
}