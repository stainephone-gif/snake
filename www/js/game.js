// ==================== ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ ====================
const GRID_SIZE = 20;
const CELL_SIZE = 20;
let canvas, ctx;
let gameLoop;
let isPaused = false;
let isGameOver = false;

// Настройки
let settings = {
    difficulty: 'normal', // easy, normal, hard
    soundEnabled: true,
    vibrationEnabled: true
};

// Игровое состояние
let gameState = {
    snake: [],
    direction: { x: 1, y: 0 },
    nextDirection: { x: 1, y: 0 },
    food: null,
    score: 0,
    speed: 150,
    portals: [],
    obstacles: [],
    powerUps: [],
    activePowerUps: {
        shield: 0,
        magnet: 0,
        double: 0
    }
};

// Статистика
let stats = {
    highScore: 0,
    gamesPlayed: 0
};

// Цвета
const COLORS = {
    background: '#0a0e27',
    grid: 'rgba(0, 243, 255, 0.1)',
    snake: ['#00f3ff', '#ff00ff'],
    snakeHead: '#ffff00',
    food: '#00ff88',
    portal: '#aa00ff',
    obstacle: '#ff0055',
    powerUpShield: '#00f3ff',
    powerUpMagnet: '#ff00ff',
    powerUpDouble: '#ffff00'
};

// ==================== ИНИЦИАЛИЗАЦИЯ ====================
// Capacitor автоматически готов, просто ждём загрузки DOM
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(initGame, 100);
    });
} else {
    setTimeout(initGame, 100);
}

function initGame() {
    loadStats();
    setupCanvas();
    setupEventListeners();
    showLoadingScreen();
}

function setupCanvas() {
    canvas = document.getElementById('game-canvas');
    ctx = canvas.getContext('2d');
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
}

function resizeCanvas() {
    const maxSize = Math.min(window.innerWidth - 40, window.innerHeight - 250);
    const gridPixelSize = GRID_SIZE * CELL_SIZE;
    const scale = maxSize / gridPixelSize;

    canvas.width = gridPixelSize;
    canvas.height = gridPixelSize;
    canvas.style.width = (gridPixelSize * scale) + 'px';
    canvas.style.height = (gridPixelSize * scale) + 'px';
}

// ==================== ЭКРАНЫ ====================
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
}

function showLoadingScreen() {
    showScreen('loading-screen');
    setTimeout(() => {
        showScreen('menu-screen');
        updateMenuStats();
    }, 2000);
}

function updateMenuStats() {
    document.getElementById('high-score').textContent = stats.highScore;
    document.getElementById('games-played').textContent = stats.gamesPlayed;
    document.getElementById('difficulty-text').textContent =
        settings.difficulty === 'easy' ? 'ЛЁГКАЯ' :
        settings.difficulty === 'normal' ? 'НОРМАЛЬНАЯ' : 'СЛОЖНАЯ';
    document.getElementById('sound-text').textContent = settings.soundEnabled ? 'ВКЛ' : 'ВЫКЛ';
    document.getElementById('sound-icon').textContent = settings.soundEnabled ? '🔊' : '🔇';
    document.getElementById('vibration-text').textContent = settings.vibrationEnabled ? 'ВКЛ' : 'ВЫКЛ';
}

// ==================== ОБРАБОТЧИКИ СОБЫТИЙ ====================
function setupEventListeners() {
    // Меню
    document.getElementById('start-btn').addEventListener('click', startGame);
    document.getElementById('difficulty-btn').addEventListener('click', toggleDifficulty);
    document.getElementById('sound-btn').addEventListener('click', toggleSound);
    document.getElementById('vibration-btn').addEventListener('click', toggleVibration);

    // Игра
    document.getElementById('pause-btn').addEventListener('click', togglePause);
    document.getElementById('resume-btn').addEventListener('click', togglePause);
    document.getElementById('restart-btn').addEventListener('click', restartGame);
    document.getElementById('menu-btn').addEventListener('click', backToMenu);
    document.getElementById('play-again-btn').addEventListener('click', restartGame);
    document.getElementById('back-menu-btn').addEventListener('click', backToMenu);

    // Свайп управление
    setupSwipeControls();

    // Клавиатура (для тестирования)
    document.addEventListener('keydown', handleKeyboard);
}

function toggleDifficulty() {
    const difficulties = ['easy', 'normal', 'hard'];
    const currentIndex = difficulties.indexOf(settings.difficulty);
    settings.difficulty = difficulties[(currentIndex + 1) % difficulties.length];
    updateMenuStats();
    saveSettings();
    vibrate(50);
}

function toggleSound() {
    settings.soundEnabled = !settings.soundEnabled;
    updateMenuStats();
    saveSettings();
    vibrate(50);
}

function toggleVibration() {
    settings.vibrationEnabled = !settings.vibrationEnabled;
    updateMenuStats();
    saveSettings();
    vibrate(50);
}

// ==================== СВАЙП УПРАВЛЕНИЕ ====================
function setupSwipeControls() {
    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;

    canvas.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
    }, false);

    canvas.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        touchEndY = e.changedTouches[0].screenY;
        handleSwipe();
    }, false);

    function handleSwipe() {
        const diffX = touchEndX - touchStartX;
        const diffY = touchEndY - touchStartY;
        const minSwipeDistance = 30;

        if (Math.abs(diffX) < minSwipeDistance && Math.abs(diffY) < minSwipeDistance) {
            return;
        }

        if (Math.abs(diffX) > Math.abs(diffY)) {
            // Горизонтальный свайп
            if (diffX > 0 && gameState.direction.x === 0) {
                gameState.nextDirection = { x: 1, y: 0 };
            } else if (diffX < 0 && gameState.direction.x === 0) {
                gameState.nextDirection = { x: -1, y: 0 };
            }
        } else {
            // Вертикальный свайп
            if (diffY > 0 && gameState.direction.y === 0) {
                gameState.nextDirection = { x: 0, y: 1 };
            } else if (diffY < 0 && gameState.direction.y === 0) {
                gameState.nextDirection = { x: 0, y: -1 };
            }
        }
    }
}

function handleKeyboard(e) {
    if (isGameOver || isPaused) return;

    switch(e.key) {
        case 'ArrowUp':
        case 'w':
            if (gameState.direction.y === 0) {
                gameState.nextDirection = { x: 0, y: -1 };
            }
            break;
        case 'ArrowDown':
        case 's':
            if (gameState.direction.y === 0) {
                gameState.nextDirection = { x: 0, y: 1 };
            }
            break;
        case 'ArrowLeft':
        case 'a':
            if (gameState.direction.x === 0) {
                gameState.nextDirection = { x: -1, y: 0 };
            }
            break;
        case 'ArrowRight':
        case 'd':
            if (gameState.direction.x === 0) {
                gameState.nextDirection = { x: 1, y: 0 };
            }
            break;
    }
}

// ==================== ИГРОВАЯ ЛОГИКА ====================
function startGame() {
    vibrate(50);
    resetGame();
    showScreen('game-screen');
    gameLoop = setInterval(update, gameState.speed);
}

function resetGame() {
    // Начальная позиция змейки
    gameState.snake = [
        { x: 10, y: 10 },
        { x: 9, y: 10 },
        { x: 8, y: 10 }
    ];
    gameState.direction = { x: 1, y: 0 };
    gameState.nextDirection = { x: 1, y: 0 };
    gameState.score = 0;
    gameState.activePowerUps = { shield: 0, magnet: 0, double: 0 };

    // Скорость в зависимости от сложности
    gameState.speed = settings.difficulty === 'easy' ? 200 :
                     settings.difficulty === 'normal' ? 150 : 100;

    isPaused = false;
    isGameOver = false;

    // Генерация объектов
    generateFood();
    generateObstacles();
    generatePortals();

    updateScoreDisplay();
}

function update() {
    if (isPaused || isGameOver) return;

    gameState.direction = gameState.nextDirection;

    // Новая позиция головы
    const head = { ...gameState.snake[0] };
    head.x += gameState.direction.x;
    head.y += gameState.direction.y;

    // Проверка порталов
    const portal = checkPortalCollision(head);
    if (portal) {
        const otherPortal = gameState.portals.find(p => p !== portal);
        if (otherPortal) {
            head.x = otherPortal.x;
            head.y = otherPortal.y;
            vibrate(100);
        }
    }

    // Проверка границ (проход через стены на лёгком уровне)
    if (settings.difficulty === 'easy') {
        if (head.x < 0) head.x = GRID_SIZE - 1;
        if (head.x >= GRID_SIZE) head.x = 0;
        if (head.y < 0) head.y = GRID_SIZE - 1;
        if (head.y >= GRID_SIZE) head.y = 0;
    } else {
        if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
            if (gameState.activePowerUps.shield > 0) {
                gameState.activePowerUps.shield = 0;
                updatePowerUpDisplay();
                vibrate([100, 50, 100]);
                // Отталкиваем змейку
                head.x = gameState.snake[0].x;
                head.y = gameState.snake[0].y;
                return;
            } else {
                endGame();
                return;
            }
        }
    }

    // Проверка столкновения с собой
    if (checkSelfCollision(head)) {
        if (gameState.activePowerUps.shield > 0) {
            gameState.activePowerUps.shield = 0;
            updatePowerUpDisplay();
            vibrate([100, 50, 100]);
            return;
        } else {
            endGame();
            return;
        }
    }

    // Проверка столкновения с препятствиями
    if (checkObstacleCollision(head)) {
        if (gameState.activePowerUps.shield > 0) {
            gameState.activePowerUps.shield = 0;
            updatePowerUpDisplay();
            vibrate([100, 50, 100]);
            return;
        } else {
            endGame();
            return;
        }
    }

    // Добавляем новую голову
    gameState.snake.unshift(head);

    // Проверка поедания еды
    let ateFood = false;
    if (head.x === gameState.food.x && head.y === gameState.food.y) {
        ateFood = true;
        const points = gameState.activePowerUps.double > 0 ? 20 : 10;
        gameState.score += points;
        vibrate(50);
        generateFood();

        // Случайная генерация power-up
        if (Math.random() < 0.3) {
            generatePowerUp();
        }
    }

    // Магнит - автоматическое притягивание еды
    if (gameState.activePowerUps.magnet > 0) {
        const distance = Math.abs(head.x - gameState.food.x) + Math.abs(head.y - gameState.food.y);
        if (distance <= 3) {
            ateFood = true;
            const points = gameState.activePowerUps.double > 0 ? 20 : 10;
            gameState.score += points;
            vibrate(30);
            generateFood();
        }
    }

    // Проверка power-ups
    const powerUp = checkPowerUpCollision(head);
    if (powerUp) {
        activatePowerUp(powerUp);
        gameState.powerUps = gameState.powerUps.filter(p => p !== powerUp);
    }

    // Убираем хвост если не съели еду
    if (!ateFood) {
        gameState.snake.pop();
    }

    // Уменьшаем время активных power-ups
    updatePowerUps();

    updateScoreDisplay();
    draw();
}

function checkSelfCollision(head) {
    for (let i = 1; i < gameState.snake.length; i++) {
        if (head.x === gameState.snake[i].x && head.y === gameState.snake[i].y) {
            return true;
        }
    }
    return false;
}

function checkObstacleCollision(head) {
    return gameState.obstacles.some(obs => obs.x === head.x && obs.y === head.y);
}

function checkPortalCollision(head) {
    return gameState.portals.find(p => p.x === head.x && p.y === head.y);
}

function checkPowerUpCollision(head) {
    return gameState.powerUps.find(p => p.x === head.x && p.y === head.y);
}

// ==================== ГЕНЕРАЦИЯ ОБЪЕКТОВ ====================
function generateFood() {
    let position;
    do {
        position = {
            x: Math.floor(Math.random() * GRID_SIZE),
            y: Math.floor(Math.random() * GRID_SIZE)
        };
    } while (isOccupied(position));
    gameState.food = position;
}

function generateObstacles() {
    gameState.obstacles = [];
    if (settings.difficulty === 'easy') return;

    const count = settings.difficulty === 'normal' ? 3 : 6;
    for (let i = 0; i < count; i++) {
        let position;
        do {
            position = {
                x: Math.floor(Math.random() * GRID_SIZE),
                y: Math.floor(Math.random() * GRID_SIZE)
            };
        } while (isOccupied(position) || isTooCloseToStart(position));
        gameState.obstacles.push(position);
    }
}

function generatePortals() {
    gameState.portals = [];
    for (let i = 0; i < 2; i++) {
        let position;
        do {
            position = {
                x: Math.floor(Math.random() * GRID_SIZE),
                y: Math.floor(Math.random() * GRID_SIZE)
            };
        } while (isOccupied(position) || isTooCloseToStart(position));
        gameState.portals.push(position);
    }
}

function generatePowerUp() {
    const types = ['shield', 'magnet', 'double'];
    const type = types[Math.floor(Math.random() * types.length)];

    let position;
    do {
        position = {
            x: Math.floor(Math.random() * GRID_SIZE),
            y: Math.floor(Math.random() * GRID_SIZE),
            type: type
        };
    } while (isOccupied(position));

    gameState.powerUps.push(position);

    // Удалить через 10 секунд
    setTimeout(() => {
        gameState.powerUps = gameState.powerUps.filter(p => p !== position);
    }, 10000);
}

function isOccupied(pos) {
    return gameState.snake.some(s => s.x === pos.x && s.y === pos.y) ||
           (gameState.food && gameState.food.x === pos.x && gameState.food.y === pos.y) ||
           gameState.obstacles.some(o => o.x === pos.x && o.y === pos.y) ||
           gameState.portals.some(p => p.x === pos.x && p.y === pos.y) ||
           gameState.powerUps.some(p => p.x === pos.x && p.y === pos.y);
}

function isTooCloseToStart(pos) {
    const startX = 10, startY = 10;
    return Math.abs(pos.x - startX) < 5 && Math.abs(pos.y - startY) < 5;
}

// ==================== POWER-UPS ====================
function activatePowerUp(powerUp) {
    gameState.activePowerUps[powerUp.type] = 100; // 100 тиков = ~15 секунд
    updatePowerUpDisplay();
    vibrate([50, 50, 50]);
}

function updatePowerUps() {
    let updated = false;
    Object.keys(gameState.activePowerUps).forEach(key => {
        if (gameState.activePowerUps[key] > 0) {
            gameState.activePowerUps[key]--;
            updated = true;
        }
    });
    if (updated) {
        updatePowerUpDisplay();
    }
}

function updatePowerUpDisplay() {
    const container = document.getElementById('active-powerups');
    container.innerHTML = '';

    Object.entries(gameState.activePowerUps).forEach(([type, time]) => {
        if (time > 0) {
            const div = document.createElement('div');
            div.className = `powerup-indicator powerup-${type}`;
            const seconds = Math.ceil(time / 6.67); // примерно 150ms на тик
            const icon = type === 'shield' ? '🛡️' : type === 'magnet' ? '🧲' : '×2';
            div.textContent = `${icon} ${seconds}s`;
            container.appendChild(div);
        }
    });
}

// ==================== ОТРИСОВКА ====================
function draw() {
    // Очистка
    ctx.fillStyle = COLORS.background;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Сетка
    ctx.strokeStyle = COLORS.grid;
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= GRID_SIZE; i++) {
        ctx.beginPath();
        ctx.moveTo(i * CELL_SIZE, 0);
        ctx.lineTo(i * CELL_SIZE, canvas.height);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i * CELL_SIZE);
        ctx.lineTo(canvas.width, i * CELL_SIZE);
        ctx.stroke();
    }

    // Порталы
    gameState.portals.forEach(portal => {
        drawPortal(portal.x, portal.y);
    });

    // Препятствия
    gameState.obstacles.forEach(obs => {
        drawObstacle(obs.x, obs.y);
    });

    // Power-ups
    gameState.powerUps.forEach(powerUp => {
        drawPowerUp(powerUp);
    });

    // Еда
    if (gameState.food) {
        drawFood(gameState.food.x, gameState.food.y);
    }

    // Змейка
    gameState.snake.forEach((segment, index) => {
        if (index === 0) {
            drawSnakeHead(segment.x, segment.y);
        } else {
            drawSnakeSegment(segment.x, segment.y, index);
        }
    });
}

function drawSnakeHead(x, y) {
    const centerX = x * CELL_SIZE + CELL_SIZE / 2;
    const centerY = y * CELL_SIZE + CELL_SIZE / 2;
    const radius = CELL_SIZE / 2 - 2;

    // Градиент для головы
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
    gradient.addColorStop(0, COLORS.snakeHead);
    gradient.addColorStop(1, COLORS.snake[1]);

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fill();

    // Свечение
    ctx.shadowBlur = 15;
    ctx.shadowColor = COLORS.snakeHead;
    ctx.fill();
    ctx.shadowBlur = 0;
}

function drawSnakeSegment(x, y, index) {
    const progress = index / gameState.snake.length;
    const gradient = ctx.createLinearGradient(
        x * CELL_SIZE, y * CELL_SIZE,
        (x + 1) * CELL_SIZE, (y + 1) * CELL_SIZE
    );
    gradient.addColorStop(0, COLORS.snake[0]);
    gradient.addColorStop(1, COLORS.snake[1]);

    ctx.fillStyle = gradient;
    ctx.fillRect(x * CELL_SIZE + 2, y * CELL_SIZE + 2, CELL_SIZE - 4, CELL_SIZE - 4);

    // Лёгкое свечение
    ctx.shadowBlur = 10;
    ctx.shadowColor = COLORS.snake[0];
    ctx.fillRect(x * CELL_SIZE + 2, y * CELL_SIZE + 2, CELL_SIZE - 4, CELL_SIZE - 4);
    ctx.shadowBlur = 0;
}

function drawFood(x, y) {
    const centerX = x * CELL_SIZE + CELL_SIZE / 2;
    const centerY = y * CELL_SIZE + CELL_SIZE / 2;

    ctx.fillStyle = COLORS.food;
    ctx.shadowBlur = 20;
    ctx.shadowColor = COLORS.food;
    ctx.beginPath();
    ctx.arc(centerX, centerY, CELL_SIZE / 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
}

function drawPortal(x, y) {
    const centerX = x * CELL_SIZE + CELL_SIZE / 2;
    const centerY = y * CELL_SIZE + CELL_SIZE / 2;

    // Вращающийся портал
    const rotation = (Date.now() / 1000) % (Math.PI * 2);

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(rotation);

    const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, CELL_SIZE / 2);
    gradient.addColorStop(0, COLORS.portal);
    gradient.addColorStop(1, 'transparent');

    ctx.fillStyle = gradient;
    ctx.shadowBlur = 25;
    ctx.shadowColor = COLORS.portal;
    ctx.beginPath();
    ctx.arc(0, 0, CELL_SIZE / 2 - 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.restore();
}

function drawObstacle(x, y) {
    ctx.fillStyle = COLORS.obstacle;
    ctx.shadowBlur = 15;
    ctx.shadowColor = COLORS.obstacle;
    ctx.fillRect(x * CELL_SIZE + 1, y * CELL_SIZE + 1, CELL_SIZE - 2, CELL_SIZE - 2);
    ctx.shadowBlur = 0;

    // Крестик
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x * CELL_SIZE + 4, y * CELL_SIZE + 4);
    ctx.lineTo((x + 1) * CELL_SIZE - 4, (y + 1) * CELL_SIZE - 4);
    ctx.moveTo((x + 1) * CELL_SIZE - 4, y * CELL_SIZE + 4);
    ctx.lineTo(x * CELL_SIZE + 4, (y + 1) * CELL_SIZE - 4);
    ctx.stroke();
}

function drawPowerUp(powerUp) {
    const centerX = powerUp.x * CELL_SIZE + CELL_SIZE / 2;
    const centerY = powerUp.y * CELL_SIZE + CELL_SIZE / 2;

    const color = powerUp.type === 'shield' ? COLORS.powerUpShield :
                  powerUp.type === 'magnet' ? COLORS.powerUpMagnet :
                  COLORS.powerUpDouble;

    // Пульсирующий эффект
    const pulse = Math.sin(Date.now() / 200) * 2 + CELL_SIZE / 3;

    ctx.fillStyle = color;
    ctx.shadowBlur = 20;
    ctx.shadowColor = color;
    ctx.beginPath();
    ctx.arc(centerX, centerY, pulse, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Символ
    ctx.fillStyle = 'white';
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const symbol = powerUp.type === 'shield' ? '🛡' :
                   powerUp.type === 'magnet' ? '🧲' : '×2';
    ctx.fillText(symbol, centerX, centerY);
}

// ==================== ОБНОВЛЕНИЕ UI ====================
function updateScoreDisplay() {
    document.getElementById('current-score').textContent = gameState.score;
    document.getElementById('snake-length').textContent = gameState.snake.length;
}

// ==================== УПРАВЛЕНИЕ ИГРОЙ ====================
function togglePause() {
    isPaused = !isPaused;
    if (isPaused) {
        showScreen('pause-screen');
    } else {
        showScreen('game-screen');
    }
    vibrate(50);
}

function restartGame() {
    vibrate(50);
    clearInterval(gameLoop);
    startGame();
}

function backToMenu() {
    vibrate(50);
    clearInterval(gameLoop);
    showScreen('menu-screen');
    updateMenuStats();
}

function endGame() {
    isGameOver = true;
    clearInterval(gameLoop);
    stats.gamesPlayed++;

    const isNewRecord = gameState.score > stats.highScore;
    if (isNewRecord) {
        stats.highScore = gameState.score;
    }

    saveStats();

    document.getElementById('final-score').textContent = gameState.score;
    document.getElementById('final-length').textContent = gameState.snake.length;
    document.getElementById('new-record').style.display = isNewRecord ? 'flex' : 'none';

    vibrate([200, 100, 200]);
    setTimeout(() => {
        showScreen('gameover-screen');
    }, 500);
}

// ==================== ХРАНИЛИЩЕ ====================
function loadStats() {
    try {
        const saved = localStorage.getItem('neonSnakeStats');
        if (saved) {
            stats = JSON.parse(saved);
        }
        const savedSettings = localStorage.getItem('neonSnakeSettings');
        if (savedSettings) {
            settings = JSON.parse(savedSettings);
        }
    } catch (e) {
        console.error('Error loading stats:', e);
    }
}

function saveStats() {
    try {
        localStorage.setItem('neonSnakeStats', JSON.stringify(stats));
    } catch (e) {
        console.error('Error saving stats:', e);
    }
}

function saveSettings() {
    try {
        localStorage.setItem('neonSnakeSettings', JSON.stringify(settings));
    } catch (e) {
        console.error('Error saving settings:', e);
    }
}

// ==================== УТИЛИТЫ ====================
async function vibrate(pattern) {
    if (!settings.vibrationEnabled) return;

    try {
        // Проверяем доступность Capacitor Haptics
        if (window.Capacitor && window.Capacitor.Plugins.Haptics) {
            const { Haptics, ImpactStyle } = window.Capacitor.Plugins;

            if (Array.isArray(pattern)) {
                // Для паттернов используем несколько вибраций
                for (let i = 0; i < pattern.length; i += 2) {
                    if (pattern[i] > 0) {
                        await Haptics.impact({ style: ImpactStyle.Medium });
                    }
                    if (pattern[i + 1]) {
                        await new Promise(resolve => setTimeout(resolve, pattern[i + 1]));
                    }
                }
            } else {
                // Простая вибрация
                if (pattern < 100) {
                    await Haptics.impact({ style: ImpactStyle.Light });
                } else if (pattern < 200) {
                    await Haptics.impact({ style: ImpactStyle.Medium });
                } else {
                    await Haptics.impact({ style: ImpactStyle.Heavy });
                }
            }
        } else if (navigator.vibrate) {
            // Fallback для браузера
            navigator.vibrate(pattern);
        }
    } catch (e) {
        console.warn('Vibration not supported:', e);
    }
}

// Запуск анимации порталов
setInterval(() => {
    if (!isPaused && !isGameOver && gameState.portals.length > 0) {
        draw();
    }
}, 50);
