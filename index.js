document.addEventListener("DOMContentLoaded", function () {
    const airplane = document.querySelector(".airplane");
    const gameContainer = document.querySelector(".game-container");
    let score = 0;
    let isGameOver = false;

    function checkCollision(projectile) {
        const airplaneRect = airplane.getBoundingClientRect();
        const obstacles = document.querySelectorAll(".obstacle");
        obstacles.forEach(function (obstacle) {
            const obstacleRect = obstacle.getBoundingClientRect();
            if (
                airplaneRect.left < obstacleRect.right &&
                airplaneRect.right > obstacleRect.left &&
                airplaneRect.top < obstacleRect.bottom &&
                airplaneRect.bottom > obstacleRect.top
            ) {
                endGame();
            }
            if (projectile) {
                const projectileRect = projectile.getBoundingClientRect();
                if (
                    projectileRect.left < obstacleRect.right &&
                    projectileRect.right > obstacleRect.left &&
                    projectileRect.top < obstacleRect.bottom &&
                    projectileRect.bottom > obstacleRect.top
                ) {
                    obstacle.remove();
                    score += 10;
                    document.getElementById("score").innerText = "Score: " + score;
                    projectile.remove();
                }
            }
        });
    }

    function endGame() {
        isGameOver = true;
        alert("Game Over! Score: " + score);
        restartBtn.style.display = "block";
    }

    function resetObstacles() {
        const obstacles = document.querySelectorAll(".obstacle");
        obstacles.forEach(function (obstacle) {
            obstacle.remove();
        });
    }

    restartBtn.addEventListener("click", function () {
        // Reseteaza jocul
        score = 0;
        isGameOver = false;
        restartBtn.style.display = "none"; // Ascunde butonul de restart
        document.getElementById("score").innerText = "Score: " + score;
        resetObstacles(); // Resetam obstacolele
        createObstacle(); // Cream noi obstacole
    });

    document.addEventListener("keydown", function (event) {
        if (!isGameOver) {
            if (event.key === "ArrowLeft") {
                moveLeft();
            } else if (event.key === "ArrowRight") {
                moveRight();
            } else if (event.key === "ArrowUp") {
                moveUp();
            } else if (event.key === "ArrowDown") {
                moveDown();
            } else if (event.key === " ") {
                shootProjectile();
            }
        }
    });

    function moveLeft() {
        const airplaneLeft = parseInt(window.getComputedStyle(airplane).getPropertyValue("left"));
        if (airplaneLeft > 0) {
            airplane.style.left = airplaneLeft - 10 + "px";
        }
    }

    function moveRight() {
        const airplaneLeft = parseInt(window.getComputedStyle(airplane).getPropertyValue("left"));
        const gameContainerRect = gameContainer.getBoundingClientRect();
        const airplaneWidth = airplane.offsetWidth;
        if (airplaneLeft + airplaneWidth < gameContainerRect.width) {
            airplane.style.left = airplaneLeft + 10 + "px";
        }
    }

    function moveUp() {
        const airplaneTop = parseInt(window.getComputedStyle(airplane).getPropertyValue("top"));
        const gameContainerRect = gameContainer.getBoundingClientRect();
        const airplaneRect = airplane.getBoundingClientRect();
    
        // Calculam pozitia minima in sus pe care avionul o poate avea pentru a nu depasi marginea superioara a chenarului
        const minUpPosition = gameContainerRect.top;
    
        if (airplaneRect.top > minUpPosition) {
            airplane.style.top = airplaneTop - 10 + "px";
        }
    }

    function moveDown() {
        const airplaneTop = parseInt(window.getComputedStyle(airplane).getPropertyValue("top"));
        const gameContainerRect = gameContainer.getBoundingClientRect();
        const airplaneRect = airplane.getBoundingClientRect();


        if (airplaneRect.bottom < gameContainerRect.bottom) {
            airplane.style.top = airplaneTop + 10 + "px";
        }
    }

    function shootProjectile() {
        const projectile = document.createElement("div");
        projectile.classList.add("projectile");
        gameContainer.appendChild(projectile);
        
        let projectileTop = parseInt(window.getComputedStyle(airplane).getPropertyValue("top")) + 20;
        let projectileLeft = parseInt(window.getComputedStyle(airplane).getPropertyValue("left")) + 70;
        projectile.style.top = projectileTop + "px";
        projectile.style.left = projectileLeft + "px";

        const projectileInterval = setInterval(function () {
            if (!isGameOver) {
                projectileLeft += 10;
                projectile.style.left = projectileLeft + "px";
                checkCollision(projectile);
                checkProjectileOutOfBounds(projectile, projectileInterval);
            } else {
                clearInterval(projectileInterval);
            }
        }, 50);
    }

    function checkProjectileOutOfBounds(projectile, interval) {
        const projectileRect = projectile.getBoundingClientRect();
        const gameContainerRect = gameContainer.getBoundingClientRect();
        if (projectileRect.right > gameContainerRect.right) {
            clearInterval(interval);
            projectile.remove();
        }
    }

    function createObstacle() {
        const obstacle = document.createElement("div");
        obstacle.classList.add("obstacle");
    
        // Generam o pozitie aleatoare pentru obstacol în interiorul chenarului albastru
        const gameContainerRect = gameContainer.getBoundingClientRect();
        const maxTop = gameContainerRect.height - 50; // Inalțimea chenarului albastru minus inaltimea obstacolului
        const obstacleTop = Math.floor(Math.random() * maxTop);
        const obstacleLeft = gameContainerRect.width;
    
        // Setam pozitia obstacolului
        obstacle.style.top = obstacleTop - 10 + "px";
        obstacle.style.left = obstacleLeft - 10 + "px";
    
        gameContainer.appendChild(obstacle);
    
        const obstacleInterval = setInterval(function () {
            if (!isGameOver) {
                const obstacleLeft = parseInt(window.getComputedStyle(obstacle).getPropertyValue("left"));
                if (obstacleLeft > -50) {
                    obstacle.style.left = obstacleLeft - 10 + "px";
                } else {
                    clearInterval(obstacleInterval);
                    obstacle.remove();
                    createObstacle();
                }
                checkCollision();
            } else {
                clearInterval(obstacleInterval);
            }
        }, 100);
    }

    createObstacle();
});
