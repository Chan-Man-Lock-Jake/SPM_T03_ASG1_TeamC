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

    let firstBuilding = true;

    // R = Residential
    // I = Industry
    // C = Commercial
    // O = Park
    // * = Road
    const buildingTypes = ['R', 'I', 'C', 'O', '*'];

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

    //BreakPoint ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    function handleDragStart(e) {
        e.dataTransfer.setData('text/plain', e.target.textContent.trim());
    }

    function handleDragOver(e) {
        e.preventDefault();
    }

    function handleDragDrop(e) {
        e.preventDefault();
        if (coins <= 0) {
            alert("Game Over! Please start a new game.");
            return;
        }
        const building = e.dataTransfer.getData('text/plain');
        const row = parseInt(e.target.dataset.row);
        const col = parseInt(e.target.dataset.col);
        if (checkBuilding(row, col)) {
            addBuilding(row, col, building);
            generateBuilding();
            turn++
            turnElement.textContent = turn;
            saveGameState();
        } else {
            alert("Invalid placement! Buildings must be placed orthogonally to existing buildings.");
        }
    }

    function createBoard(rows, cols) {
        gameBoard.style.gridTemplateColumns = `repeat(${cols}, 40px)`;
        gameBoard.style.gridTemplateRows = `repeat(${rows}, 40px)`;
        const grid = [];
        for (let row = 0; row < rows; row++) {
            const rowArr = [];
            for (let col = 0; col < cols; col++) {
                const cell = document.createElement('div');
                // cell.innerHTML = `${row} ${col}`;
                cell.classList.add('cell');
                cell.dataset.row = row;
                cell.dataset.col = col;
                cell.addEventListener('dragover', handleDragOver);
                cell.addEventListener('drop', handleDragDrop);
                gameBoard.appendChild(cell);
                rowArr.push(cell);
            }
            grid.push(rowArr);
        }
        return grid;
    }

    function countCoin(type, neighbors) {
        neighbors.forEach(neighbor => {

            // Coins can only be generated when:
            // 1. Industry per Residential
            // 2. Commercial per Residential

            if ((type === 'R' && (neighbor.textContent === 'I' || neighbor.textContent === 'C')) || (neighbor.textContent === 'R' && (type === 'I' || type === 'C'))) {
                coins += 1;
            } 
        });
        coinsElement.textContent = coins;
    }

    function countScore(type, neighbors, row, col) {
        let neighborsTxt = neighbors.map(neighbor => neighbor.textContent);

        // Score is increased when:
        // 1. Residential per Industry 
        // 2. Residential per Residential
        // 3. Residential per Commerical
        // 4. Residential per Park 
        // Done 5. Industry per Industry (itself is one point)
        // 6. Commercial per Commercial (adjacent > 1)
        // 7. Park per Park (adjacent > 1)
        // Done 8. Road per Road (in a row > 1)

        switch (type) {
            // For Industry:
            case 'I':
                score += 1;
                break;
            // For Park:
            case 'O':
                //1.All sides have O
                //1.1 0 sides of sides have O (+5)
                //1.2 1 sides of sides have O (+4)
                //1.3 2 sides of sides have O (+3)
                //1.4 3 sides of sides have O (+2)
                //1.5 ALL sides of sides have O (+1)
                //2.Three sides have O
                //2.1 0 sides of sides have O (+4)
                //2.2 1 sides of sides have O (+3)
                //2.3 2 sides of sides have O (+2)
                //2.4 ALL sides of sides have O (+1)
                //3 Two sides have O
                //3.1 0 sides of sides have O (+3)
                //3.2 1 sides of sides have O (+2)
                //3.3 ALL sides of sides have O (+1)
                //4 One sides have O
                //4.1 0 sides of sides have O (+2)
                //4.2 ALL sides of sides have O (+1)
                //5 No sides have O (+0)
                const adjacent = [
                    [row - 1, col],
                    [row, col - 1],
                    [row, col + 1],
                    [row + 1, col]
                ];

                for (const [adjX, adjY] of adjacent) {

                }

                break;
            // For Road:
            case '*':
                // Case 1.0 Both side Road
                if (neighbors[1].textContent === '*' && neighbors[2].textContent === '*') {
                    // 1.1 Both side of side Nothing (+3)
                    if ((grid[row][col - 2] === "Left Border" || grid[row][col - 2].textContent !== '*') && grid[row][col + 2].textContent !== '*') {
                        score += 3;
                    // 1.2 One side of side Nothing (+2)
                    } else if (grid[row][col - 2].textContent !== '*' || grid[row][col + 2].textContent !== '*') {
                        score += 2;
                        console.log("first");
                    // 1.3 No side of side Nothing (+1)
                    } else {
                        score += 1;
                    }
                // Case 2.0 One side Road
                } else if (neighbors[1] === "Left Border" || !grid[row][col - 2]) {
                    score += 1;
                    console.log("left");
                } else if (neighbors[1].textContent === '*' || neighbors[2].textContent === '*') { //BORDER
                    // 2.1 Side of side Nothing (+2)
                    if ((grid[row][col - 2].textContent !== '*' && neighbors[2].textContent !== '*') || (grid[row][col + 2].textContent !== '*' && neighbors[1].textContent !== '*')) {
                        score += 2
                        console.log("second");
                    // 2.2 Side of side Road (+1)
                    } else {
                        score += 1;
                    }
                }
                break;
        }
        scoreElement.textContent = score;
    }

    function addBuilding(row, col, type) {
        const cell = grid[row][col];
        cell.innerHTML = `${type}`;
        cell.classList.add('building');

        let neighbors = [
            row != 0 ? grid[row - 1][col] : "Top Border", //TOP
            col != 0 ? grid[row][col - 1] : "Left Border", //LEFT
            col != 19 ? grid[row][col + 1] : "Right Border", //RIGHT
            row != 19 ? grid[row + 1][col] : "Bottom Border" //BOTTOM
        ];

        countScore(type, neighbors, row, col);
        countCoin(type, neighbors);
        coins -= 1;
    }

    function checkBuilding(row, col) {
        if (firstBuilding) {
            firstBuilding = false;
            coins -= 1;
            return true
        };
        if (grid[row] && grid[row][col] && grid[row][col].textContent !== '') {
            return false;
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

    function generateBuilding() {
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

        buildingOptionsContainer.appendChild(div1)
        buildingOptionsContainer.appendChild(div2);
    }

    function endGame() {
        // Display a message to the player
        alert('Game Over! Click OK to see your final score.');

        // Save the game state before redirecting
        saveGameState();

        // Redirect to result.html
        window.location.href = 'end-game.html';
    }

    function saveGameState() {
        const gameState = {
            board: grid.map(row => row.map(cell => cell.innerHTML)),
            coins: coins,
            score: score,
            turn: turn
        };
        localStorage.setItem('gameState', JSON.stringify(gameState));
    }

    function startGame() {
        coins = 10;
        score = 0;
        turn = 0;
        grid = createBoard(20, 20);
        coinsElement.textContent = coins;
        scoreElement.textContent = score;
        turnElement.textContent = turn;
        generateBuilding();
        saveGameState();
    }

    startGame();
});