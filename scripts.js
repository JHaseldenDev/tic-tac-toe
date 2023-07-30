// Factory function to create players
const createPlayer = (name, marker) => {
    return { name, marker };
};

// Module for game board
const gameBoard = (() => {
    let board = Array(3).fill().map(() => Array(3).fill(''));

    const getBoard = () => board;

    const setCell = (row, col, marker) => {
        if(board[row][col] === '') {
            board[row][col] = marker;
            return true;
        }
        return false;
    };

    const reset = () => {
        board = Array(3).fill().map(() => Array(3).fill(''));
    };

    const checkWin = (marker) => {
        const winConditions = [
            [[0, 0], [0, 1], [0, 2]],
            [[1, 0], [1, 1], [1, 2]],
            [[2, 0], [2, 1], [2, 2]],
            [[0, 0], [1, 0], [2, 0]],
            [[0, 1], [1, 1], [2, 1]],
            [[0, 2], [1, 2], [2, 2]],
            [[0, 0], [1, 1], [2, 2]],
            [[0, 2], [1, 1], [2, 0]],
        ];

        return winConditions.find(condition => condition.every(([row, col]) => board[row][col] === marker));
    };

    return { getBoard, setCell, reset, checkWin };
})();

// Module for display controller
const displayController = (() => {
    const cells = document.querySelectorAll('.cell');
    const resetButton = document.querySelector('.reset-button');

    const render = () => {
        const gameBoardData = gameBoard.getBoard();
        gameBoardData.forEach((rowData, rowIndex) => {
            rowData.forEach((cellData, cellIndex) => {
                cells[rowIndex * 3 + cellIndex].textContent = cellData;
            });
        });
    };

    const addClickListener = (listener) => {
        cells.forEach(cell => {
            cell.addEventListener('click', listener);
        });
    };

    const highlightWin = (winCells) => {
        winCells.forEach(([row, col]) => {
            cells[row * 3 + col].style.backgroundColor = 'green';
        });
    };

    const clearHighlights = () => {
        cells.forEach(cell => {
            cell.style.backgroundColor = '';
        });
    };

    resetButton.addEventListener('click', () => {
        gameBoard.reset();
        clearHighlights();
        render();
    });

    return { render, addClickListener, highlightWin, clearHighlights };
})();

// Module for game
const game = (() => {
    let currentPlayer;
    const player1 = createPlayer('Player 1', 'X');
    const player2 = createPlayer('Player 2', 'O');

    const start = () => {
        currentPlayer = player1;
        displayController.addClickListener(handleClick);
    };

    const handleClick = (e) => {
        const cell = e.target;
        const row = Math.floor(cell.id / 3);
        const col = cell.id % 3;

        if (gameBoard.setCell(row, col, currentPlayer.marker)) {
            displayController.render();

            const winCells = gameBoard.checkWin(currentPlayer.marker);
            if (winCells) {
                displayController.highlightWin(winCells);
                setTimeout(() => {
                    alert(`Player ${currentPlayer.name} wins!`);
                    resetGame();
                }, 100); // delay to allow DOM update
                return; // end the game
            }

            if (isTie()) {
                alert('The game is a tie!');
                resetGame();
                return; // end the game
            }

            // Switch players
            currentPlayer = currentPlayer === player1 ? player2 : player1;
        }
    };

    const resetGame = () => {
        gameBoard.reset();
        displayController.clearHighlights();
        displayController.render();
        start();  // Start a new game
    };

    const isTie = () => {
        const board = gameBoard.getBoard();
        return board.flat().every(cell => cell !== '');
    };

    return { start };
})();

// Start game
game.start();
