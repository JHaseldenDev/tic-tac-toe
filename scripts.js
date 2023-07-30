// Factory function to create players
const createPlayer = (name, marker) => {
    return { name, marker };
};

// Module for game board
const gameBoard = (() => {
    let board = Array(3).fill().map(() => Array(3).fill(''));

    const getBoard = () => board;

    const setCell = (row, col, marker) => {
        board[row][col] = marker;
    };

    const reset = () => {
        board = Array(3).fill().map(() => Array(3).fill(''));
    };

    return { getBoard, setCell, reset };
})();

// Module for display controller
const displayController = (() => {
    const cells = document.querySelectorAll('.cell');

    const updateCell = (cell, marker) => {
        cell.textContent = marker;
    };

    const addClickListener = (listener) => {
        cells.forEach(cell => {
            cell.addEventListener('click', listener, { once: true });
        });
    };

    return { updateCell, addClickListener };
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
        const row = cell.parentElement;
        const board = row.parentElement;
        const rowIndex = Array.from(board.children).indexOf(row);
        const colIndex = Array.from(row.children).indexOf(cell);

        gameBoard.setCell(rowIndex, colIndex, currentPlayer.marker);
        displayController.updateCell(cell, currentPlayer.marker);

        if (checkWin(currentPlayer)) {
            alert(`Player ${currentPlayer.name} wins!`);
            gameBoard.reset();
        }

        currentPlayer = currentPlayer === player1 ? player2 : player1;
    };

    const checkWin = (player) => {
        // Implement checkWin logic here
    };

    return { start };
})();

// Start game
game.start();
