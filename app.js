/*
 * GLOBAL VARIABLES
 */
let canShoot = true;
let levelDifficulty = 1;


/*
 * END GLOBAL VARIABLES
 */

function initializeGame() {
    // Initialize variables
    const gameFrame = document.querySelector('.grille');
    const gameEnemiesContainer = document.querySelector('.enemy-container');
    const gamePlayerContainer = document.querySelector('.player-container');

    const music = document.createElement('audio');
    music.src = 'ressources/Sounds/Music.mp3';
    music.loop = true;
    music.play();

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

    // Add the music

}

function initializeAliens() {
    // Move aliens to left and right
    let moveToLeft = false;
    let endGame = false;
    let stopAlien = false;
    let createBtn = false;
    const gameEnemiesContainer = document.querySelectorAll('.enemy-column');

    let myGame = setInterval(() => {
        gameEnemiesContainer.forEach(enemyColumn => {
            const enemyColumnLeft = parseInt(enemyColumn.style.left.replace('%', ''));
            const enemyColumnTop = parseInt(enemyColumn.style.top.replace('%', ''));
            const aliens = document.querySelectorAll('.alien');



            if (!endGame) {
                if (!stopAlien) {
                    stopAlien = true;
                    if (!moveToLeft) {
                        if (enemyColumnLeft < 40) {
                            enemyColumn.style.left = `${enemyColumnLeft + (1 * levelDifficulty)}%`;
                        } else if (enemyColumnTop < 150) {
                            enemyColumn.style.top = `${enemyColumnTop + 1}%`;
                            enemyColumn.style.left = `${enemyColumnLeft}`;
                            setTimeout(() => {
                                moveToLeft = true;
                            }, 50);
                        } else if (enemyColumnTop === 150) {
                            enemyColumn.style.left = `20%`;

                        }
                    } else {
                        if (enemyColumnLeft > 0) {
                            enemyColumn.style.left = `${enemyColumnLeft - (1 * levelDifficulty)}%`;
                        } else if (enemyColumnTop < 150) {
                            enemyColumn.style.top = `${enemyColumnTop + 1}%`;
                            enemyColumn.style.left = `${enemyColumnLeft}`;
                            setTimeout(() => {
                                moveToLeft = false;
                            }, 50)
                        } else if (enemyColumnTop >= 150) {
                            enemyColumn.style.left = `22.5%`;
                            setTimeout(() => {
                                endGame = true;
                            }, 50);
                        }
                    }




                    aliens.forEach(alien => {
                        if (alien.style.opacity !== '0') {
                            stopAlien = false;
                        }
                    });
                } else if (stopAlien) {

                    enemyColumn.style.left = `${enemyColumnLeft}%`;
                    enemyColumn.style.top = `${enemyColumnTop}%`;

                    return;
                }

            } else if (!stopAlien && endGame) {
                clearInterval(myGame);
                if (!createBtn) {
                    document.querySelector('.enemy-container').innerHTML = '';
                    document.querySelector('.player-container').innerHTML = '';

                    document.querySelector('.grille').innerHTML += `<p class='message'>Game over !</p>`;

                    levelDifficulty = 1;

                    createRestartButton("Recommencer ?");
                    createBtn = true;
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
        // Play laser sound
        const laserSound = new Audio('ressources/Sounds/Laser.mp3');
        laserSound.play();
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
            if (canShoot) {
                movePlayer('up', new Date().getTime());
                canShoot = false;
                setTimeout(() => {
                    canShoot = true;
                }, 1000);
            }
            break;
        case 39:
            movePlayer('right', new Date().getTime());
            break;
        default:
            break;
    }
}

function createRestartButton(text) {
    let createBtn = false;
    let createDiv = true;
    const btnRestart = document.createElement('div');
    btnRestart.classList.add('restartDiv');

    if (createDiv) {
        document.body.appendChild(btnRestart);
        createDiv = false;
        createBtn = true;
    }

    if (createBtn) {
        const restartButton = document.createElement('button');
        restartButton.classList.add('restartBtn');
        restartButton.innerHTML = text;
        btnRestart.appendChild(restartButton);
    }

}

document.addEventListener(`DOMContentLoaded`, (async) => {
    startScript(new Date().getTime());
    document.onkeydown = checkKey;

    const gameStartedAt = new Date().getTime();

    // Check if the restart button is clicked
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('restartBtn')) {
            if(levelDifficulty === 1){
                const score = document.querySelector('.score-number');
                score.innerHTML = `0`;
            }

            //Delete all bullets
            const bullets = document.querySelectorAll('.bullet');
            bullets.forEach(bullet => {
                bullet.remove();
            });

            document.querySelector('.message').remove();
            document.querySelector('.restartDiv').remove();

            startScript(new Date().getTime());
        }
    });

    // Check if bullet hit an alien
    setInterval(() => {
        // Get all bullets positions X, Y
        const bullets = document.querySelectorAll('.bullet');
        const aliens = document.querySelectorAll('.alien');

        bullets.forEach(bullet => {
            // If bullet bottom is greater than 100%
            if (parseInt(bullet.style.bottom.replace('%', '')) > 100) {
                // Remove the bullet
                bullet.remove();
            } else {
                // Get bullet position X, Y in the screen
                const bulletX = bullet.getBoundingClientRect().left + window.scrollX;
                const bulletY = bullet.getBoundingClientRect().top + window.scrollY;

                // Check if bullet hit an alien
                aliens.forEach(alien => {
                    // Get alien position X, Y in the screen
                    const alienX = alien.getBoundingClientRect().left + window.scrollX;
                    const alienY = alien.getBoundingClientRect().top + window.scrollY;

                    // If the bullet is in the alien
                    if (bulletX > alienX && bulletX < (alienX + alien.offsetWidth) && bulletY > alienY && bulletY < (alienY + alien.offsetHeight) && alien.style.opacity !== '0') {
                        // Remove the bullet
                        bullet.remove();
                        // Remove the alien
                        alien.style.opacity = 0;

                        // Play explosion sounds
                        const explosionSound = new Audio('ressources/Sounds/Explosion.mp3');
                        explosionSound.play();


                        // Check if all aliens are invisible
                        const aliens = document.querySelectorAll('.alien');
                        let allInvisible = false;
                        aliens.forEach(alien => {
                            if (alien.style.opacity !== '0') {
                                allInvisible = true;
                            }
                        });



                        if (!allInvisible) {
                            document.querySelector('.enemy-container').innerHTML = '';
                            document.querySelector('.player-container').innerHTML = '';

                            document.querySelector('.grille').innerHTML += `<p class='message'>You win!</p>`;

                            levelDifficulty++;

                            createRestartButton("Passer au niveau suivant");
                        }

                        const score = document.querySelector('.score-number');
                        const multiplier = document.querySelector('.multiplier');
                        const scoreValue = parseInt(score.innerHTML);

                        console.log(multiplier.innerHTML)

                        // Time left to finish the game
                        const timeLeft = parseInt(bullet.style.bottom.replace('%', ''));

                        multiplier.innerHTML = `+${levelDifficulty * timeLeft} !`;
                        score.innerHTML = (levelDifficulty * timeLeft) + scoreValue ;
                    }
                });
            }
        });
    }, 50);
});