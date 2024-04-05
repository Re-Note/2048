document.addEventListener('DOMContentLoaded', () => {
    const gridContainer = document.getElementById('grid-container');
    const scoreDisplay = document.getElementById('score'); // 점수를 표시할 요소 참조
    const gridSize = 4;
    let grid = [];
    let score = 0;

    // 게임 초기화, 점수 초기화도 추가
    function initializeGame() {
        grid = [];
        for (let i = 0; i < gridSize; i++) {
            grid[i] = [];
            for (let j = 0; j < gridSize; j++) {
                grid[i][j] = 0;
            }
        }
        score = 0;
        addNewTile();
        addNewTile();
        updateGrid();
        updateScore(); // 초기화할 때 점수 업데이트
    }

// 새 타일 추가
    function addNewTile() {
        const availableCells = [];
        for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j < gridSize; j++) {
                if (grid[i][j] === 0) {
                    availableCells.push({ x: i, y: j });
                }
            }
        }
        if (availableCells.length > 0) {
            const randomIndex = Math.floor(Math.random() * availableCells.length);
            const randomCell = availableCells[randomIndex];
            const newValue = Math.random() < 0.9 ? 2 : 4;
            grid[randomCell.x][randomCell.y] = newValue;

            // 새로운 타일 생성
            const newTileElement = document.createElement('div');
            newTileElement.classList.add('tile');
            newTileElement.textContent = newValue;
            newTileElement.classList.add(`number-${newValue}`);
            newTileElement.style.top = `${randomCell.x * 110}px`;
            newTileElement.style.left = `${randomCell.y * 110}px`;
            gridContainer.appendChild(newTileElement);

            // 다음 프레임에서 애니메이션 클래스 추가
            requestAnimationFrame(() => {
                newTileElement.classList.add('new-tile');

                // 애니메이션 완료 후 클래스 제거
                setTimeout(() => {
                    newTileElement.classList.remove('new-tile');
                }, 300); // 애니메이션 지속시간
            });
        }
    }





    // 그리드 업데이트
    function updateGrid() {
        gridContainer.innerHTML = '';
        for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j < gridSize; j++) {
                const tile = document.createElement('div');
                tile.classList.add('tile');
                const value = grid[i][j];
                tile.textContent = value === 0 ? '' : value;
                tile.classList.add(`number-${value}`); // 해당 숫자에 맞는 클래스 추가
                tile.style.top = `${i * 110}px`;
                tile.style.left = `${j * 110}px`;
                gridContainer.appendChild(tile);
            }
        }
    }


    // 방향키 입력 처리
    function moveTiles(event) {
        let moved = false;
        switch(event.key) {
            case 'ArrowUp':
                moved = moveUp();
                break;
            case 'ArrowDown':
                moved = moveDown();
                break;
            case 'ArrowLeft':
                moved = moveLeft();
                break;
            case 'ArrowRight':
                moved = moveRight();
                break;
        }
        if (moved) {
            addNewTile();
            updateGrid();
            checkGameEnd();
            updateScore(); // 이동 후에 점수 업데이트
        }
    }

    // 타일을 위로 이동
    function moveUp() {
        let moved = false;
        for (let j = 0; j < gridSize; j++) {
            for (let i = 1; i < gridSize; i++) {
                if (grid[i][j] !== 0) {
                    let row = i;
                    while (row > 0 && (grid[row - 1][j] === 0 || grid[row - 1][j] === grid[i][j])) {
                        if (grid[row - 1][j] === 0) {
                            grid[row - 1][j] = grid[row][j];
                            grid[row][j] = 0;
                            row--;
                            moved = true;
                        } else if (grid[row - 1][j] === grid[i][j]) {
                            grid[row - 1][j] *= 2;
                            score += grid[row - 1][j];
                            grid[row][j] = 0;
                            moved = true;
                            break;
                        }
                    }
                }
            }
        }
        return moved;
    }

    // 타일을 아래로 이동
    function moveDown() {
        let moved = false;
        for (let j = 0; j < gridSize; j++) {
            for (let i = gridSize - 2; i >= 0; i--) {
                if (grid[i][j] !== 0) {
                    let row = i;
                    while (row < gridSize - 1 && (grid[row + 1][j] === 0 || grid[row + 1][j] === grid[i][j])) {
                        if (grid[row + 1][j] === 0) {
                            grid[row + 1][j] = grid[row][j];
                            grid[row][j] = 0;
                            row++;
                            moved = true;
                        } else if (grid[row + 1][j] === grid[i][j]) {
                            grid[row + 1][j] *= 2;
                            score += grid[row + 1][j];
                            grid[row][j] = 0;
                            moved = true;
                            break;
                        }
                    }
                }
            }
        }
        return moved;
    }

    // 타일을 왼쪽으로 이동
    function moveLeft() {
        let moved = false;
        for (let i = 0; i < gridSize; i++) {
            for (let j = 1; j < gridSize; j++) {
                if (grid[i][j] !== 0) {
                    let col = j;
                    while (col > 0 && (grid[i][col - 1] === 0 || grid[i][col - 1] === grid[i][j])) {
                        if (grid[i][col - 1] === 0) {
                            grid[i][col - 1] = grid[i][col];
                            grid[i][col] = 0;
                            col--;
                            moved = true;
                        } else if (grid[i][col - 1] === grid[i][j]) {
                            grid[i][col - 1] *= 2;
                            score += grid[i][col - 1];
                            grid[i][col] = 0;
                            moved = true;
                            break;
                        }
                    }
                }
            }
        }
        return moved;
    }

    // 타일을 오른쪽으로 이동
    function moveRight() {
        let moved = false;
        for (let i = 0; i < gridSize; i++) {
            for (let j = gridSize - 2; j >= 0; j--) {
                if (grid[i][j] !== 0) {
                    let col = j;
                    while (col < gridSize - 1 && (grid[i][col + 1] === 0 || grid[i][col + 1] === grid[i][j])) {
                        if (grid[i][col + 1] === 0) {
                            grid[i][col + 1] = grid[i][col];
                            grid[i][col] = 0;
                            col++;
                            moved = true;
                        } else if (grid[i][col + 1] === grid[i][j]) {
                            grid[i][col + 1] *= 2;
                            score += grid[i][col + 1];
                            grid[i][col] = 0;
                            moved = true;
                            break;
                        }
                    }
                }
            }
        }
        return moved;
    }

    // 게임 종료 여부 확인
    function checkGameEnd() {
        let gameOver = true;
        for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j < gridSize; j++) {
                if (grid[i][j] === 0) {
                    gameOver = false;
                    break;
                }
                if ((i < gridSize - 1 && grid[i][j] === grid[i + 1][j]) ||
                    (j < gridSize - 1 && grid[i][j] === grid[i][j + 1])) {
                    gameOver = false;
                    break;
                }
            }
            if (!gameOver) break;
        }
        if (gameOver) {
            endGame();
        }
    }

    // 게임 종료 처리
    function endGame() {
        alert(`Game Over! Your Score: ${score}`);
        // 여기서 필요한 추가 작업 수행 가능
    }

    // 현재 점수 업데이트
    function updateScore() {
        scoreDisplay.textContent = score;
    }

    // 게임 초기화
    initializeGame();

    // 키보드 이벤트 리스너 등록
    document.addEventListener('keydown', moveTiles);
});
