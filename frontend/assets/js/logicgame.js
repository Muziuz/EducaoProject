import '../css/logicgame.css';

// Definição das Fases (0=Chão, 1=Parede, 2=Buraco, 3=Osso)
const fases = [
    {
        mapa: [
            [0, 0, 0, 0, 3]
        ],
        inicio: { x: 0, y: 0 },
        mensagem: "Nível 1: Siga em frente! Use andar(4)."
    },
    {
        mapa: [
            [0, 0, 2, 0, 0],
            [0, 1, 0, 0, 3]
        ],
        inicio: { x: 0, y: 0 },
        mensagem: "Nível 2: Cuidado com o buraco! Tente virar e pular."
    },
    {
        mapa: [
            [0, 1, 3],
            [0, 1, 0],
            [0, 0, 0]
        ],
        inicio: { x: 0, y: 0 },
        mensagem: "Nível 3: Um pequeno labirinto. Planeje suas viradas!"
    },
    {
        mapa: [
            [0, 0, 0, 0, 0],
            [1, 1, 1, 1, 0],
            [3, 0, 0, 0, 0],
            [0, 1, 1, 1, 1],
            [0, 0, 0, 0, 0]
        ],
        inicio: { x: 0, y: 0 },
        mensagem: "Nível 4: O ziguezague! Ótimo para usar repetir()."
    },
    {
        mapa: [
            [0, 2, 0, 2, 0],
            [0, 0, 0, 0, 0],
            [2, 0, 1, 0, 2],
            [0, 0, 0, 0, 3],
            [0, 2, 0, 2, 0]
        ],
        inicio: { x: 0, y: 1 },
        mensagem: "Nível Final: O Campo Minado! Cuidado onde pisa!"
    }
];

let faseAtual = 0;
let educao = { x: 0, y: 0, direcao: 'Leste', vivo: true, pegouOsso: false };
let animacaoIdleInterval = null;
let animacaoFeedbackInterval = null;
const somAcerto = new Audio('/assets/audio/acerto.mp3');
const somErro = new Audio('/assets/audio/erro.mp3');

const dormir = (ms) => new Promise(resolve => setTimeout(resolve, ms));

function pararAnimacoes() {
    if (animacaoIdleInterval) clearInterval(animacaoIdleInterval);
    if (animacaoFeedbackInterval) clearInterval(animacaoFeedbackInterval);
    animacaoIdleInterval = null;
    animacaoFeedbackInterval = null;
}

function iniciarIdle() {
    pararAnimacoes();
    const imgElement = document.getElementById("img-educao-logica");
    if (imgElement) imgElement.src = "/assets/img/Normal.png";
    
    animacaoIdleInterval = setInterval(() => {
        const img = document.getElementById("img-educao-logica");
        if (img) {
            img.src = "/assets/img/Piscando.png";
            setTimeout(() => {
                if (animacaoIdleInterval) img.src = "/assets/img/Normal.png";
            }, 200);
        }
    }, 3000);
}

function desenharMapa() {
    const tabuleiro = document.getElementById('tabuleiro');
    const config = fases[faseAtual];
    const mapa = config.mapa;

    tabuleiro.innerHTML = ''; 
    // Ajusta a grade dinamicamente baseada no tamanho do mapa
    tabuleiro.style.gridTemplateColumns = `repeat(${mapa[0].length}, 60px)`;

    for (let y = 0; y < mapa.length; y++) {
        for (let x = 0; x < mapa[y].length; x++) {
            const celula = document.createElement('div');
            celula.className = 'celula';

            let conteudo = '';
            if (mapa[y][x] === 1) conteudo = '🧱';
            if (mapa[y][x] === 2) conteudo = '🕳️';
            if (mapa[y][x] === 3) conteudo = '🦴';

            if (educao.x === x && educao.y === y) {
                if (!educao.vivo) conteudo = '💀'; 
                else if (educao.pegouOsso) conteudo = '🎉'; 
                else {
                    if (educao.direcao === 'Leste') conteudo = '🐶➡️';
                    else if (educao.direcao === 'Oeste') conteudo = '⬅️🐶';
                    else if (educao.direcao === 'Norte') conteudo = '🐶⬆️';
                    else if (educao.direcao === 'Sul') conteudo = '🐶⬇️';
                }
            }
            celula.innerText = conteudo;
            tabuleiro.appendChild(celula);
        }
    }
}

async function andar(passos) {
    for (let i = 0; i < passos; i++) {
        if (!educao.vivo || educao.pegouOsso) return;
        let proximoX = educao.x;
        let proximoY = educao.y;
        if (educao.direcao === 'Leste') proximoX++;
        else if (educao.direcao === 'Oeste') proximoX--;
        else if (educao.direcao === 'Norte') proximoY--;
        else if (educao.direcao === 'Sul') proximoY++;

        if (verificarMovimento(proximoX, proximoY)) {
            educao.x = proximoX;
            educao.y = proximoY;
            await verificarDestino(proximoX, proximoY);
        } else return;

        desenharMapa();
        await dormir(500);
    }
}

function virar(novaDirecao) {
    const direcoesValidas = ['Leste', 'Oeste', 'Norte', 'Sul'];
    novaDirecao = novaDirecao.replace(/['"]/g, '');
    novaDirecao = novaDirecao.charAt(0).toUpperCase() + novaDirecao.slice(1).toLowerCase();
    if (direcoesValidas.includes(novaDirecao)) {
        educao.direcao = novaDirecao;
        document.getElementById('mensagem').innerText = "Virei para o " + novaDirecao + "!";
        desenharMapa();
    }
}

async function pular() {
    if (!educao.vivo || educao.pegouOsso) return;
    let proximoX = educao.x;
    let proximoY = educao.y;
    if (educao.direcao === 'Leste') proximoX += 2;
    else if (educao.direcao === 'Oeste') proximoX -= 2;
    else if (educao.direcao === 'Norte') proximoY -= 2;
    else if (educao.direcao === 'Sul') proximoY += 2;
    
    document.getElementById('mensagem').innerText = "Boing!";
    if (verificarMovimento(proximoX, proximoY)) {
        educao.x = proximoX;
        educao.y = proximoY;
        await verificarDestino(proximoX, proximoY);
    }
    desenharMapa();
    await dormir(500);
}

function verificarMovimento(x, y) {
    const mapa = fases[faseAtual].mapa;
    if (y < 0 || y >= mapa.length || x < 0 || x >= mapa[0].length) {
        document.getElementById('mensagem').innerText = "Au! Bati no muro!";
        return false;
    }
    if (mapa[y][x] === 1) {
        document.getElementById('mensagem').innerText = "Au au! Tem um obstáculo!";
        return false;
    }
    return true;
}

async function verificarDestino(x, y) {
    const mapa = fases[faseAtual].mapa;
    const imgElement = document.getElementById("img-educao-logica");
    
    if (mapa[y][x] === 2) {
        educao.vivo = false;
        pararAnimacoes();
        if (imgElement) {
            let estado = false;
            animacaoFeedbackInterval = setInterval(() => {
                imgElement.src = estado ? `/assets/img/Triste.png` : `/assets/img/Triste_piscando.png`;
                estado = !estado;
            }, 500);
        }
        somErro.play().catch(() => {});
        document.getElementById('mensagem').innerText = "Game Over! Caiu no buraco!";
    } else if (mapa[y][x] === 3) {
        educao.pegouOsso = true;
        pararAnimacoes();
        if (imgElement) imgElement.src = "/assets/img/Feliz.png";
        somAcerto.play().catch(() => {});
        document.getElementById('mensagem').innerText = "Parabéns! Próxima fase em instantes...";
        
        await dormir(2000);
        avancarFase();
    }
}

function avancarFase() {
    if (faseAtual < fases.length - 1) {
        faseAtual++;
        resetarPosicao();
    } else {
        document.getElementById('mensagem').innerText = "VOCÊ VENCEU TODOS OS NÍVEIS! 🎉";
        document.body.innerHTML = `
            <div style="text-align:center; padding: 50px; background: #0f172a; min-height: 100vh; color: white;">
                <h1 style="font-size: 3.5rem; color: #facc15;">Mestre da Lógica! 🏆</h1>
                <p style="font-size: 1.5rem;">Você completou todos os desafios do Educão!</p>
                <button onclick="location.reload()" class="btn-resposta" style="margin-top:20px;">Jogar Novamente</button>
            </div>
        `;
    }
}

function resetarPosicao() {
    const config = fases[faseAtual];
    educao = { 
        x: config.inicio.x, 
        y: config.inicio.y, 
        direcao: 'Leste', 
        vivo: true, 
        pegouOsso: false 
    };
    document.getElementById('mensagem').innerText = config.mensagem;
    document.getElementById('progresso-texto').innerText = `Fase ${faseAtual + 1} de ${fases.length}`;
    document.getElementById('progress-fill').style.width = `${((faseAtual + 1) / fases.length) * 100}%`;
    desenharMapa();
    iniciarIdle();
}

async function lerEExecutar() {
    const config = fases[faseAtual];
    educao = { x: config.inicio.x, y: config.inicio.y, direcao: 'Leste', vivo: true, pegouOsso: false };
    iniciarIdle();
    desenharMapa();
    await dormir(500);

    const texto = document.getElementById('codigo').value;
    const linhas = texto.split('\n');
    for (let linha of linhas) {
        linha = linha.trim();
        if (!linha) continue;
        if (linha.startsWith('repetir')) {
            let matchLoop = linha.match(/repetir\((\d+),\s*(.+)\)/);
            if (matchLoop) {
                let vezes = parseInt(matchLoop[1]);
                let comandoInterno = matchLoop[2].trim();
                for (let i = 0; i < vezes; i++) {
                    await executarComando(comandoInterno);
                    if (!educao.vivo || educao.pegouOsso) break;
                }
            }
        } else await executarComando(linha);
        if (!educao.vivo || educao.pegouOsso) break;
    }
}

async function executarComando(comando) {
    if (comando.startsWith('andar')) {
        let match = comando.match(/andar\((\d+)\)/);
        if (match) await andar(parseInt(match[1]));
    } else if (comando.startsWith('virar')) {
        let match = comando.match(/virar\((.+)\)/);
        if (match) virar(match[1]);
    } else if (comando.startsWith('pular')) await pular();
}

document.addEventListener('DOMContentLoaded', () => {
    resetarPosicao();
});

window.lerEExecutar = lerEExecutar;
