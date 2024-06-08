const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const scale = 20;
const rows = canvas.height / scale;
const columns = canvas.width / scale;

let snake;
let apple;
let score = 0;
let changingDirection = false;
let gameOver = false;
const eatSound = document.getElementById('eatSound');
const hitSound = document.getElementById('hitSound');

(function setup() {
    snake = new Snake();
    apple = new Apple();
    apple.pickLocation();

    window.setInterval(() => {
        if (!gameOver) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            snake.update();
            snake.draw();
            apple.draw();

            if (snake.eat(apple)) {
                apple.pickLocation();
                score++;
                document.getElementById('score').innerText = 'Score: ' + score;
                eatSound.play(); // Jouer le son
            }

            snake.checkCollision();
            snake.checkWallCollision();
        } else {
            drawGameOver();
        }
    }, 100); // Intervalle réduit pour plus de fluidité
}());

window.addEventListener('keydown', evt => {
    const direction = evt.key.replace('Arrow', '');
    if (!changingDirection) {
        snake.changeDirection(direction);
        changingDirection = true;
    }
});

function Snake() {
    this.x = 0;
    this.y = 0;
    this.xSpeed = scale * 1;
    this.ySpeed = 0;
    this.total = 0;
    this.tail = [];

    this.draw = function() {
        ctx.fillStyle = "#00FF00";

        for (let i = 0; i < this.tail.length; i++) {
            ctx.fillRect(this.tail[i].x, this.tail[i].y, scale, scale);
        }

        ctx.fillRect(this.x, this.y, scale, scale);
    }

    this.update = function() {
        changingDirection = false; // Réinitialisation du verrouillage ici

        for (let i = 0; i < this.tail.length - 1; i++) {
            this.tail[i] = this.tail[i + 1];
        }

        this.tail[this.total - 1] = { x: this.x, y: this.y };

        this.x += this.xSpeed;
        this.y += this.ySpeed;

        // Détection de collision avec les bords du canevas
        if (this.x >= canvas.width || this.x < 0 || this.y >= canvas.height || this.y < 0) {
            endGame();
        }
    }

    this.changeDirection = function(direction) {
        switch(direction) {
            case 'Up':
                if (this.ySpeed === 0) {
                    this.xSpeed = 0;
                    this.ySpeed = -scale * 1;
                }
                break;
            case 'Down':
                if (this.ySpeed === 0) {
                    this.xSpeed = 0;
                    this.ySpeed = scale * 1;
                }
                break;
            case 'Left':
                if (this.xSpeed === 0) {
                    this.xSpeed = -scale * 1;
                    this.ySpeed = 0;
                }
                break;
            case 'Right':
                if (this.xSpeed === 0) {
                    this.xSpeed = scale * 1;
                    this.ySpeed = 0;
                }
                break;
        }
    }

    this.eat = function(apple) {
        if (this.x === apple.x && this.y === apple.y) {
            this.total++;
            return true;
        }

        return false;
    }

    this.checkCollision = function() {
        for (let i = 0; i < this.tail.length; i++) {
            if (this.x === this.tail[i].x && this.y === this.tail[i].y) {
                endGame();
            }
        }
    }

    this.checkWallCollision = function() {
        if (this.x >= canvas.width || this.x < 0 || this.y >= canvas.height || this.y < 0) {
            endGame();
        }
    }
}

function Apple() {
    this.x;
    this.y;

    this.pickLocation = function() {
        this.x = Math.floor(Math.random() * rows) * scale;
        this.y = Math.floor(Math.random() * columns) * scale;
    }

    this.draw = function() {
        ctx.fillStyle = "#FF0000";
        ctx.fillRect(this.x, this.y, scale, scale);
    }
}

function endGame() {
    gameOver = true;
    hitSound.play(); // Jouer le son
}

function drawGameOver() {
    ctx.fillStyle = "white";
    ctx.font = "50px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2);
}

function resetGame() {
    score = 0;
    document.getElementById('score').innerText = 'Score: ' + score;
    snake = new Snake();
    apple = new Apple();
    apple.pickLocation();
    gameOver = false;
}
