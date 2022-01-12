function initializeGame() {
    // Initialize variables
    const gameFrame = document.querySelector('.grille');
    const gameEnemiesContainer = document.querySelector('.enemy-container');
    const gamePlayerContainer = document.querySelector('.player-container');

    // Initialize the game
    // Show 3 lines of 12 enemys
    for (let i = 0; i < 3; i++) {
        // Add the enemy to alien-container div
        const enemyColumn = document.createElement('div');
        enemyColumn.classList.add('enemy-column');
        enemyColumn.classList.add('enemy-column-' + i);
        enemyColumn.style.left = '0%';
        enemyColumn.style.top = '0%';
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
    let endGame = false;
    const gameEnemiesContainer = document.querySelectorAll('.enemy-column');

    setInterval(() => {
        gameEnemiesContainer.forEach(enemyColumn => {
            const enemyColumnLeft = parseInt(enemyColumn.style.left.replace('%', ''));
            const enemyColumnTop = parseInt(enemyColumn.style.top.replace('%', ''));
            if (!endGame) {
                if (!moveToLeft) {
                    if (enemyColumnLeft < 40) {
                        enemyColumn.style.left = `${enemyColumnLeft + 1}%`;
                    } else if (enemyColumnTop < 150) {
                        enemyColumn.style.top = `${enemyColumnTop + 10}%`;
                        enemyColumn.style.left = `${enemyColumnLeft}`;
                        setTimeout(() => {
                            moveToLeft = true;
                        }, 50);
                    } else if (enemyColumnTop === 150) {
                        enemyColumn.style.left = `20%`;

                    }
                } else {
                    if (enemyColumnLeft > 0) {
                        enemyColumn.style.left = `${enemyColumnLeft - 1}%`;
                    } else if (enemyColumnTop < 150) {
                        enemyColumn.style.top = `${enemyColumnTop + 10}%`;
                        enemyColumn.style.left = `${enemyColumnLeft}`;
                        setTimeout(() => {
                            moveToLeft = false;
                        }, 50)
                    } else if (enemyColumnTop === 150) {
                        enemyColumn.style.left = `22.5%`;
                        setTimeout(() => {
                            endGame = true;
                        }, 50);

                    }
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

    // Check if bullet hit an alien
    setInterval(() => {
        const bullets = document.querySelectorAll('.bullet');
        bullets.forEach(bullet => {
            const bulletBottom = parseInt(bullet.style.bottom.replace('%', ''));
            const bulletLeft = parseInt(bullet.style.left.replace('%', ''));

            if (bulletBottom > 100) {
                bullet.remove();
            } else {
                const aliens = document.querySelectorAll('.alien');
                const aliensColumns = document.querySelectorAll('.enemy-column');

                aliensColumns.forEach(aliensColumns => {
                    const aliensColumnsLeft = parseInt(aliensColumns.style.left.replace('%', ''));
                    const aliensColumnsTop = parseInt(aliensColumns.style.top.replace('%', ''));

                    console.log(`${bulletLeft} = ${aliensColumnsLeft}`);

                    if (bulletLeft === aliensColumnsLeft) {
                        aliens.forEach(alien => {
                            alien.remove();
                            bullet.remove();
                        });

                        bullet.remove();
                    }
                });
            }
        });
    }, 50);
});