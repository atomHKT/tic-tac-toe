"use strict";

const globals = (() => {
    const COLORS = {
        'green': 'rgba(80, 227, 194, 1)',
        'red': 'rgba(227, 80, 97, 1)',
        'blue': 'rgba(8, 138, 251, 1)',
        'draw': 'rgba(155, 157, 158, 1)'
    };

    const WINPATTERNS = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    return {
        COLORS,
        WINPATTERNS
    }
})();

const createPlayer = (name, color) => {
    return {
        name,
        color
    }
};

const gameBoard = (() => {
    let boardArray;
    const gameGrid = document.getElementById('game-grid');

    // create grid divs and corresponding event listener
    function initBoard() {
        this.boardArray = ['', '', '', '', '', '', '', '', ''];
        this.gameGrid.innerHTML = "";
        this.boardArray.forEach((elem, ind, arr) => {
            let gridItem = document.createElement('div');
            gridItem.className = 'grid-item';
            gameGrid.appendChild(gridItem);
            gridItem.setAttribute('data-val', ind);
            gridItem.addEventListener('click', (e) => {
                e.target.style.backgroundColor = game.currentPlayer.color;
                e.target.style.pointerEvents = 'none';
                this.boardArray[e.target.dataset.val] = game.currentPlayer.name;
                game.checkEndTurn();
            });
        });
    };

    // check if board game is full
    const checkBoardFull = (arr) => {
        return arr.indexOf("") === -1;
    };

    return {
        gameGrid,
        boardArray,
        initBoard,
        checkBoardFull
    }
})();

const game = (() => {
    const gameResult = document.getElementById('game-result');
    const textResult = document.getElementById('winner-draw');
    const player1 = createPlayer('Player 1', globals.COLORS.blue);
    const player2 = createPlayer('Player 2', globals.COLORS.red);
    let currentPlayer = player1;

    gameBoard.initBoard();

    gameResult.addEventListener('click', () => {
        gameResult.classList.toggle('is-visible');
        gameBoard.gameGrid.classList.toggle('is-hidden');
        gameBoard.initBoard();
    });

    const checkWin = (player) => {
        return globals.WINPATTERNS.some(elem => {
            return elem.every(val => {
                return gameBoard.boardArray[val] === player.name
            });
        });
    };

    const nextPlayer = (player) => {
        if (player === player1) {
            return player2;
        } else {
            return player1;
        }
    }

    const displayWinner = (player, str) => {
        gameBoard.gameGrid.classList.toggle('is-hidden');
        gameResult.classList.toggle('is-visible');
        textResult.innerHTML = str;
        if (str === 'DRAW') {
            textResult.style.color = globals.COLORS.draw;
        } else {
            textResult.style.color = player.color;
        }
    }

    function checkEndTurn() {
        let root = document.querySelector(':root');
        if (checkWin(this.currentPlayer)) {
            displayWinner(this.currentPlayer, 'WINNER');

        } else {
            if (gameBoard.checkBoardFull(gameBoard.boardArray)) {
                displayWinner('', 'DRAW');
            }
            this.currentPlayer = nextPlayer(this.currentPlayer);
            root.style.setProperty('--color-hover', this.currentPlayer.color);
        }
    };

    return {
        currentPlayer,
        checkEndTurn
    }
})();