import '../css/mathmine.css';

const GRID_SIZE = 6;
const TARGET_PROGRESS = 15;
let grid = [];
let currentPos = { x: 0, y: 0 };
let progress = 0;
let correctAnswer = null;

const gridEl = document.getElementById('math-grid');
const questionBox = document.getElementById('question-box');
const progressEl = document.getElementById('progress-val');
const winScreen = document.getElementById('game-win');
const loseScreen = document.getElementById('game-over');

function initGame() {
    progress = 0;
    currentPos = { x: 0, y: 0 };
    winScreen.classList.add('hidden');
    loseScreen.classList.add('hidden');
    generateGrid();
    updateUI();
    nextTurn();
}

function generateGrid() {
    grid = [];
    gridEl.innerHTML = '';
    for (let y = 0; y < GRID_SIZE; y++) {
        grid[y] = [];
        for (let x = 0; x < GRID_SIZE; x++) {
            const val = Math.floor(Math.random() * 50) + 1;
            grid[y][x] = {
                val: val,
                cleared: false,
                element: createCellElement(x, y, val)
            };
            gridEl.appendChild(grid[y][x].element);
        }
    }
}

function createCellElement(x, y, val) {
    const div = document.createElement('div');
    div.className = 'grid-cell';
    div.innerText = val;
    div.dataset.x = x;
    div.dataset.y = y;
    div.onclick = () => handleCellClick(x, y);
    return div;
}

function nextTurn() {
    // Definir vizinhos válidos
    const neighbors = getNeighbors(currentPos.x, currentPos.y);
    
    // Escolher um vizinho para ser a resposta correta
    const targetNeighbor = neighbors[Math.floor(Math.random() * neighbors.length)];
    correctAnswer = grid[targetNeighbor.y][targetNeighbor.x].val;
    
    // Gerar pergunta para essa resposta
    generateQuestion(correctAnswer);
    highlightPotential(neighbors);
}

function getNeighbors(cx, cy) {
    const n = [];
    const dirs = [[0,1], [0,-1], [1,0], [-1,0]];
    dirs.forEach(([dx, dy]) => {
        const nx = cx + dx, ny = cy + dy;
        if (nx >= 0 && nx < GRID_SIZE && ny >= 0 && ny < GRID_SIZE && !grid[ny][nx].cleared) {
            n.push({x: nx, y: ny});
        }
    });
    return n;
}

function generateQuestion(answer) {
    const type = Math.floor(Math.random() * 3);
    let q = '';
    if (type === 0) { // Soma
        const a = Math.floor(Math.random() * answer);
        q = `${a} + ${answer - a}`;
    } else if (type === 1) { // Subtração
        const a = Math.floor(Math.random() * 20) + 1;
        q = `${answer + a} - ${a}`;
    } else { // Multiplicação simplificada
        const factors = [];
        for(let i=1; i<=answer; i++) if(answer%i === 0 && i < 12 && (answer/i) < 12) factors.push(i);
        if (factors.length > 0) {
            const f1 = factors[Math.floor(Math.random() * factors.length)];
            q = `${f1} × ${answer / f1}`;
        } else {
            q = `${answer} + 0`;
        }
    }
    questionBox.innerText = q;
}

function highlightPotential(neighbors) {
    // Limpar destaques
    document.querySelectorAll('.grid-cell').forEach(el => {
        el.classList.remove('neighbor', 'active');
    });
    
    // Destacar atual
    grid[currentPos.y][currentPos.x].element.classList.add('active');
    grid[currentPos.y][currentPos.x].element.innerText = '🐕';

    // Destacar vizinhos
    neighbors.forEach(n => {
        grid[n.y][n.x].element.classList.add('neighbor');
    });
}

function handleCellClick(x, y) {
    const neighbors = getNeighbors(currentPos.x, currentPos.y);
    const isNeighbor = neighbors.some(n => n.x === x && n.y === y);
    
    if (!isNeighbor) return;

    if (grid[y][x].val === correctAnswer) {
        // Acertou
        grid[currentPos.y][currentPos.x].cleared = true;
        grid[currentPos.y][currentPos.x].element.classList.add('cleared');
        grid[currentPos.y][currentPos.x].element.innerText = '';
        
        currentPos = { x, y };
        progress++;
        updateUI();

        if (progress >= TARGET_PROGRESS) {
            winScreen.classList.remove('hidden');
        } else {
            nextTurn();
        }
    } else {
        // Errou
        loseScreen.classList.remove('hidden');
    }
}

function updateUI() {
    progressEl.innerText = progress;
}

initGame();
window.initGame = initGame;
