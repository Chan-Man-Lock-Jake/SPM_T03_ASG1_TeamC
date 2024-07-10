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

    //BreakPoint ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    function handleDragStart(e) {
        e.dataTransfer.setData('text/plain', e.target.textContent.trim());
    }

    function handleDragOver(e) {
        e.preventDefault();
        //e.target.style.backgroundColor = 'red';
    }

    function handleDragDrop(e) {
        e.preventDefault();
        if (coins <= 0) {
            alert("Game Over! Please start a new game.");
            endGame();
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
        let score = 0;
        console.log(type);
        switch (type) {
            case 'R':
                score = countResidential(neighbors);
                break;
            case 'I':
                score += 1;
                break;
            case 'C' :
                score = countCommercial(neighbors);
                break;
            case 'O':
                score = countPark(neighbors);
                break;
            case '*':
                score = countRoad(neighbors);
                break;
        }   
        grid[row][col].dataset.score = score;
    }

    function countResidential(neighbor) {
        let score = 0;
        for (let e = 0; e < 4; e++) {
            if (typeof neighbor[e] === 'string') {
                continue;
            }
            if (neighbor[e].dataset.building === 'I') {
                score += 1;
                break;
            } else if (neighbor[e].dataset.building === 'R' || neighbor[e].dataset.building === 'C') {
                score += 1;
            } else if (neighbor[e].dataset.building === 'O') {
                score += 2;
            }
        }
        return score;
    }

    function countCommercial(neighbor) {
        let score = 0;
        for (let e = 0; e < 4; e++) {
            if (typeof neighbor[e] === 'string') {
                continue;
            }
            if (neighbor[e].dataset.building === 'C') {
                score += 1;
            }
        }
        return score;
    }

    function countPark(neighbor) {
        let score = 0;
        for (let e = 0; e < 4; e++) {
            if (typeof neighbor[e] === 'string') {
                continue;
            }
            if (neighbor[e].dataset.building === 'O') {
                score += 1;
            }
        }
        return score;
    }

    function countRoad(neighbor) {
        let score = 0;
        for (let e = 0; e < 4; e++) {
            if (typeof neighbor[e] === 'string') {
                continue;
            }
            if (neighbor[e].dataset.building === '*' && (e === 1 || e === 2)) {
                score += 1;
                break;
            }
        }
        console.log(score, "ROAD")
        return score;

    }

    function totalScore() {
        let totalScore = 0;
        for(let e = 0; e < grid.length; e++) {
            for(let j = 0; j < grid.length; j++) {
                console.log(grid[e][j].dataset.score);
                !isNaN(parseInt(grid[e][j].dataset.score)) ? totalScore += parseInt(grid[e][j].dataset.score) : '' ;
            }
        }
        console.log(totalScore);
        return totalScore;
    }

    // Place building at the given row & col
    function addBuilding(row, col, type) {
        const cell = grid[row][col];
        cell.innerHTML = `${type}`;
        cell.dataset.building = type;
        cell.classList.add('building');

        // Neighbors of the building placed
        let neighbors = [
            row != 0 ? grid[row - 1][col] : "Top Border", //TOP
            col != 0 ? grid[row][col - 1] : "Left Border", //LEFT
            col < grid.length - 1 ? grid[row][col + 1] : "Right Border", //RIGHT
            row < grid.length - 1 ? grid[row + 1][col] : "Bottom Border" //BOTTOM
        ];

        countScore(type, neighbors, row, col);

        for (let i = 0; i < 4; i++) {            
            if (typeof neighbors[i] === 'string') {
                continue;
            }

            const neighborRow = parseInt(neighbors[i].dataset.row);
            const neighborCol = parseInt(neighbors[i].dataset.col);

            // grid[neighborRow][neighborCol].style.backgroundColor = 'Red';
            // grid[neighborRow - 1][neighborCol].style.backgroundColor = 'Green';
            // grid[neighborRow][neighborCol - 1].style.backgroundColor = 'Yellow';
            // grid[neighborRow][neighborCol + 1].style.backgroundColor = 'Blue';
            // grid[neighborRow + 1][neighborCol].style.backgroundColor = 'White';

            let neighbors2 = [
                neighborRow - 1 > 0 ? grid[neighborRow - 1][neighborCol] : "Top Border", //TOP
                neighborCol != 0 ? grid[neighborRow][neighborCol - 1] : "Left Border", //LEFT
                neighborCol < grid.length - 1 ? grid[neighborRow][neighborCol + 1] : "Right Border", //RIGHT
                neighborRow < grid.length - 1 ? grid[neighborRow + 1][neighborCol] : "Bottom Border" //BOTTOM
            ];

            countScore(neighbors[i].dataset.building, neighbors2, neighborRow, neighborCol)
        }

        scoreElement.textContent = totalScore();
        coins -= 1;
        countCoin(type, neighbors);
    }

    function checkBuilding(row, col) {
        if (firstBuilding) {
            firstBuilding = false;
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