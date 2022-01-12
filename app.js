function initializeGame() {
    // Initialize variables
    const gameFrame = document.querySelector('.grille');
    const gameEnemiesContainer = document.querySelector('.enemy-container');
    const gamePlayerContainer = document.querySelector('.player-container');

    console.log(gameFrame);

    // Initialize the game
    // Show 3 lines of 12 enemys
    for (let i = 0; i < 3; i++) {
        // Add the enemy to alien-container div
        const enemyColumn = document.createElement('div');
        enemyColumn.classList.add('enemy-column');
        enemyColumn.classList.add('enemy-column-' + i);
        enemyColumn.style.left = '0%';
        enemyColumn.style.marginTop = `${i * 25}px`;
        gameEnemiesContainer.appendChild(enemyColumn);

        for (let j = 0; j < 12; j++) {
            // Add the enemy to alien-container div
            const enemy = document.createElement('div');
            enemy.classList.add('alien');
            enemy.classList.add('alien-' + j + '-' + i);
            enemyColumn.appendChild(enemy);
        }
    }

    // Add the player to the game-frame div
    const player = document.createElement('div');
    player.classList.add('tireur');
    player.style.left = '50%';
    player.style.top = '75%';
    gamePlayerContainer.appendChild(player);
}

function initializeAliens() {
    // Move aliens to left and right
    let moveToLeft = false;
    const gameEnemiesContainer = document.querySelectorAll('.enemy-column');

    setInterval(() => {
        gameEnemiesContainer.forEach(enemyColumn => {
            const enemyColumnLeft = parseInt(enemyColumn.style.left.replace('%', ''));

            if (!moveToLeft) {
                if (enemyColumnLeft < 40) {
                    enemyColumn.style.left = `${enemyColumnLeft + 1}%`;
                } else {
                    moveToLeft = true;
                }
            } else {
                if (enemyColumnLeft > 0) {
                    enemyColumn.style.left = `${enemyColumnLeft - 1}%`;
                } else {
                    moveToLeft = false;
                }
            }
        });
    }, 50);

}

function sendShoot() {
    // Create the bullet
    const bullet = document.createElement('div');
    bullet.classList.add('bullet');

    // Get actual player position
    const player = document.querySelector('.tireur');
    const playerLeft = player.style.left;
    const playerTop = player.style.top;

    bullet.style.left = playerLeft;
    bullet.style.bottom = 90 - parseInt(playerTop.replace('%', '')) + '%';
    bullet.style.position = 'absolute';

    // Add the bullet to the game-frame div
    const gameFrame = document.querySelector('.grille');
    gameFrame.appendChild(bullet);

    // Move the bullet
    setInterval(() => {
        const bulletTop = parseInt(bullet.style.bottom.replace('%', ''));
        bullet.style.bottom = `${bulletTop + 1}%`;
    }, 50);
}

async function startScript(responseTime) {
    await initializeGame();
    console.log("Game initialized (" + (new Date().getTime() - responseTime) + "ms)");
    await initializeAliens();
}

function movePlayer(direction, responseTime) {
    const player = document.querySelector('.tireur');
    const playerLeft = parseInt(player.style.left.replace('%', ''));
    const speed = 5;

    if (direction === 'left') {
        if ((playerLeft - speed) > (0 - speed)) {
            player.style.left = `${playerLeft - speed}%`;
            console.log("Player moved left (" + (new Date().getTime() - responseTime) + "ms)");
        }
    } else if (direction === 'right') {
        if ((playerLeft + speed) < 100) {
            player.style.left = `${playerLeft + speed}%`;
            console.log("Player moved right (" + (new Date().getTime() - responseTime) + "ms)");
        }
    } else if (direction === 'up') {
        sendShoot();
        console.log("Player shooted (" + (new Date().getTime() - responseTime) + "ms)");
    }

}

function checkKey(e) {
    // Move the player if the key is pressed
    switch (e.keyCode) {
        case 37:
            movePlayer('left', new Date().getTime());
            break;
        case 38:
            movePlayer('up', new Date().getTime());
            break;
        case 39:
            movePlayer('right', new Date().getTime());
            break;
    }
}

document.addEventListener(`DOMContentLoaded`, (async) => {
    startScript(new Date().getTime());
    document.onkeydown = checkKey;
});