document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.getElementById('game-board');
    const coinsElement = document.getElementById('coins');
    const scoreElement = document.getElementById('score');
    const turnElement = document.getElementById('turn');
    const buildingOptionsContainer = document.getElementById('building-options');

    // Starting stats
    let coins = 3;
    let score = 0;
    let turn = 0;
    //let grid = createGrid(20, 20); //CALLED TWICE
    let firstBuilding = true; // Track if it's the first building being placed

    const buildingTypes = ['R', 'I', 'C', 'O', '*'];

    // Creation of game board
    function createGrid(rows, cols) {
        // gameBoard.style.gridTemplateColumns = `repeat(${cols}, 25px)`;
        // gameBoard.style.gridTemplateRows = `repeat(${rows}, 25px)`;
        // gameBoard.innerHTML = '';
        const grid = [];
        for (let row = 0; row < rows; row++) {
            const rowArr = [];
            for (let col = 0; col < cols; col++) {
                const cell = document.createElement('div');
                // cell.innerHTML = col;
                cell.classList.add('cell');
                cell.dataset.row = row;
                cell.dataset.col = col;
                cell.addEventListener('dragover', handleDragOver);
                cell.addEventListener('drop', handleDrop);
                gameBoard.appendChild(cell);
                rowArr.push(cell);
            }
            grid.push(rowArr);
        }
        return grid;
    }

    // Update coins
    function updateCoins(value) {
        coins += value;
        coins = Math.max(coins, 0); // Ensure coins are not less than 0
        coinsElement.textContent = coins;
        if (coins <= 0) {
            endGame(); // Call endGame before updating turn
        }
    }

    // Update Score
    function updateScore(value) {
        score += value;
        scoreElement.textContent = score;
    }

    // Update turn
    function updateTurn(value) {
        turn += value;
        turnElement.textContent = turn;
    }

    // Checks if building placement is valid
    function isValidPlacement(row, col) {
        if (firstBuilding) return true; // Allow placing the first building anywhere
        if (grid[row] && grid[row][col] && grid[row][col].textContent !== '') {
            return false; // Cell is already occupied
        }
        const neighbors = [
            { r: row - 1, c: col },
            { r: row + 1, c: col },
            { r: row, c: col - 1 },
            { r: row, c: col + 1 }
        ];
        return neighbors.some(neighbor => {
            return grid[neighbor.r] && grid[neighbor.r][neighbor.c] && grid[neighbor.r][neighbor.c].textContent !== '';
        });
    }

    // Adds building to cell
    function addBuilding(row, col, type) {
        const cell = grid[row][col];
        cell.innerHTML = `${type}`; // Remove image URL
        cell.classList.add('building', type); // Add a CSS class to visually represent the building
        // Add scoring logic here
        firstBuilding = false;
        updateBuildingOptions(); // Generate new building options
    }

    // Updates next building option 
    function updateBuildingOptions() {
        buildingOptionsContainer.innerHTML = '';
        const option1 = buildingTypes[Math.floor(Math.random() * buildingTypes.length)];
        let option2 = buildingTypes[Math.floor(Math.random() * buildingTypes.length)];
        while (option2 === option1) {
            option2 = buildingTypes[Math.floor(Math.random() * buildingTypes.length)];
        }

        const div1 = document.createElement('div');
        div1.innerHTML = `${option1}`; // Remove image URL
        div1.classList.add('building-option', 'draggable');
        div1.draggable = true;
        div1.addEventListener('dragstart', handleDragStart);

        const div2 = document.createElement('div');
        div2.innerHTML = `${option2}`; // Remove image URL
        div2.classList.add('building-option', 'draggable');
        div2.draggable = true;
        div2.addEventListener('dragstart', handleDragStart);

        buildingOptionsContainer.appendChild(div1);
        buildingOptionsContainer.appendChild(div2);
    }

    // Building drag function
    function handleDragStart(event) {
        event.dataTransfer.setData('text/plain', event.target.textContent.trim());
    }

    function handleDragOver(event) {
        event.preventDefault();
    }

    function handleDrop(event) {
        event.preventDefault();
        if (coins <= 0) {
            alert("Game Over! Please start a new game.");
            return;
        }
        const building = event.dataTransfer.getData('text/plain');
        const row = parseInt(event.target.dataset.row);
        const col = parseInt(event.target.dataset.col);
        if (coins > 0 && isValidPlacement(row, col)) {
            addBuilding(row, col, building);
            updateCoins(-1);
            updateScore(1); // Simple scoring for now
            updateTurn(1);
            saveGameState(); // Save the game state after each turn
        } else {
            alert("Invalid placement! Buildings must be placed orthogonally to existing buildings.");
        }
    }

    // Start Game
    function startGame() {
        coins = 3;
        score = 0;
        turn = 0;
        grid = createGrid(20, 20);
        coinsElement.textContent = coins;
        scoreElement.textContent = score;
        turnElement.textContent = turn; // Update the displayed turn
        firstBuilding = true;
        updateBuildingOptions(); // Generate initial building options
        saveGameState(); // Save the initial game state
    }

    // End game
    function endGame() {
        // Display a message to the player
        alert('Game Over! Click OK to see your final score.');

        // Save the game state before redirecting
        saveGameState();

        // Redirect to result.html
        window.location.href = 'end-game.html';
    }

    // Saves current state of gameboard 
    function saveGameState() {
        const gameState = {
            board: grid.map(row => row.map(cell => cell.innerHTML)),
            coins: coins,
            score: score,
            turn: turn
        };
        localStorage.setItem('gameState', JSON.stringify(gameState));
    }

    // Automatically start the game in Arcade Mode
    startGame();
});
