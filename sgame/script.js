document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const scale = 20;
    const rows = canvas.height / scale;
    const columns = canvas.width / scale;

    let snake = [{x: 5 * scale, y: 5 * scale}];
    let food = {x: Math.floor(Math.random() * columns) * scale, y: Math.floor(Math.random() * rows) * scale};
    let dx = scale;
    let dy = 0;
    let score = 0;
    let speed = 100;
    let changingDirection = false;
    let paused = false;
    let interval;

    const snakeImage = new Image();
    snakeImage.src = 'snake.png'; // Path to your snake image

    const foodImage = new Image();
    foodImage.src = 'food.png'; // Path to your food image

    document.addEventListener('keydown', changeDirection);
    document.getElementById('pauseButton').addEventListener('click', pauseGame);
    document.getElementById('resumeButton').addEventListener('click', resumeGame);

    function startGame() {
        interval = setInterval(() => {
            if (!paused) {
                updateGame();
            }
        }, speed);
    }

    function updateGame() {
        if (gameOver()) {
            clearInterval(interval);
            document.getElementById('status').textContent = `Game Over! Final Score: ${score}`;
            return;
        }
        changingDirection = false;
        clear();
        drawFood();
        moveSnake();
        drawSnake();
        increaseSpeed();
        document.getElementById('status').textContent = `Score: ${score} | Speed: ${(100 / speed).toFixed(1)}x`;
    }

    function clear() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    function drawSnake() {
        snake.forEach(part => {
            ctx.drawImage(snakeImage, part.x, part.y, scale, scale);
        });
    }

    function moveSnake() {
        const head = {x: snake[0].x + dx, y: snake[0].y + dy};
        snake.unshift(head);

        if (head.x === food.x && head.y === food.y) {
            score++;
            food = {x: Math.floor(Math.random() * columns) * scale, y: Math.floor(Math.random() * rows) * scale};
        } else {
            snake.pop();
        }
    }

    function drawFood() {
        ctx.drawImage(foodImage, food.x, food.y, scale, scale);
    }

    function changeDirection(event) {
        if (changingDirection) return;
        changingDirection = true;
        const keyPressed = event.code;
        if (keyPressed === 'ArrowUp' && dy === 0) {
            dx = 0;
            dy = -scale;
        } else if (keyPressed === 'ArrowDown' && dy === 0) {
            dx = 0;
            dy = scale;
        } else if (keyPressed === 'ArrowLeft' && dx === 0) {
            dx = -scale;
            dy = 0;
        } else if (keyPressed === 'ArrowRight' && dx === 0) {
            dx = scale;
            dy = 0;
        }
    }

    function gameOver() {
        const head = snake[0];
        return (
            head.x < 0 ||
            head.x >= canvas.width ||
            head.y < 0 ||
            head.y >= canvas.height ||
            snake.slice(1).some(part => part.x === head.x && part.y === head.y)
        );
    }

    function increaseSpeed() {
        if (score % 5 === 0 && score > 0) {
            speed = Math.max(50, speed - 10); // Increase speed every 5 points
            clearInterval(interval);
            startGame();
        }
    }

    function pauseGame() {
        paused = true;
        document.getElementById('pauseButton').style.display = 'none';
        document.getElementById('resumeButton').style.display = 'inline-block';
    }

    function resumeGame() {
        paused = false;
        document.getElementById('pauseButton').style.display = 'inline-block';
        document.getElementById('resumeButton').style.display = 'none';
    }

    snakeImage.onload = () => {
        foodImage.onload = () => {
            startGame();
        };
    };
});
