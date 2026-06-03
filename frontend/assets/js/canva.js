const canvas = document.getElementById('telaPintura');
const ctx = canvas.getContext('2d', { willReadFrequently: true });
const imgEducao = document.getElementById('img-educao-artes');
const textoMissao = document.getElementById('texto-missao');
const btnVerificar = document.getElementById('btnVerificar');

let desenhando = false;
let corAtual = '#000000';
let tamanhoPincel = 5;
let modoBorracha = false;
let modoBalde = false;
let missaoAtiva = null;

const missoes = [
    { texto: "Desenhe um grande Sol Amarelo! ☀️", corAlvo: '#facc15' },
    { texto: "Desenhe uma Árvore Verde! 🌳", corAlvo: '#22c55e' },
    { texto: "Desenhe o Mar Azul! 🌊", corAlvo: '#3b82f6' },
    { texto: "Desenhe uma Flor Vermelha! 🌹", corAlvo: '#ef4444' },
    { texto: "Faça um desenho usando apenas a cor preta! 🖤", corAlvo: '#000000' }
];

// Configurações iniciais
ctx.lineCap = 'round';
ctx.lineJoin = 'round';
ctx.strokeStyle = corAtual;
ctx.lineWidth = tamanhoPincel;

// Animação Idle
setInterval(() => {
    if (imgEducao && !desenhando) {
        imgEducao.src = "/assets/img/Piscando.png";
        setTimeout(() => imgEducao.src = "/assets/img/Normal.png", 200);
    }
}, 4000);

// Função de Preenchimento (Balde)
function floodFill(startX, startY, fillRGB) {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const width = imageData.width;
    const height = imageData.height;
    const data = imageData.data;

    const startPos = (startY * width + startX) * 4;
    const startR = data[startPos];
    const startG = data[startPos + 1];
    const startB = data[startPos + 2];
    const startA = data[startPos + 3];

    // Se a cor de destino for igual à cor inicial, não faz nada
    if (startR === fillRGB[0] && startG === fillRGB[1] && startB === fillRGB[2] && startA === 255) return;

    const stack = [[startX, startY]];

    while (stack.length) {
        const [x, y] = stack.pop();
        let pixelPos = (y * width + x) * 4;

        // Sobe até encontrar a borda superior
        while (y >= 0 && matchStartColor(pixelPos)) {
            y--;
            pixelPos -= width * 4;
        }
        pixelPos += width * 4;
        y++;

        let reachLeft = false;
        let reachRight = false;

        // Desce preenchendo e verificando vizinhos laterais
        while (y < height && matchStartColor(pixelPos)) {
            colorPixel(pixelPos);

            if (x > 0) {
                if (matchStartColor(pixelPos - 4)) {
                    if (!reachLeft) {
                        stack.push([x - 1, y]);
                        reachLeft = true;
                    }
                } else if (reachLeft) {
                    reachLeft = false;
                }
            }

            if (x < width - 1) {
                if (matchStartColor(pixelPos + 4)) {
                    if (!reachRight) {
                        stack.push([x + 1, y]);
                        reachRight = true;
                    }
                } else if (reachRight) {
                    reachRight = false;
                }
            }

            y++;
            pixelPos += width * 4;
        }
    }

    ctx.putImageData(imageData, 0, 0);

    function matchStartColor(pixelPos) {
        return data[pixelPos] === startR &&
               data[pixelPos + 1] === startG &&
               data[pixelPos + 2] === startB &&
               data[pixelPos + 3] === startA;
    }

    function colorPixel(pixelPos) {
        data[pixelPos] = fillRGB[0];
        data[pixelPos + 1] = fillRGB[1];
        data[pixelPos + 2] = fillRGB[2];
        data[pixelPos + 3] = 255;
    }
}

function hexToRgb(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return [r, g, b];
}

// Lógica de Missões
document.getElementById('btnNovaMissao').addEventListener('click', () => {
    missaoAtiva = missoes[Math.floor(Math.random() * missoes.length)];
    textoMissao.innerText = missaoAtiva.texto;
    btnVerificar.style.display = 'block';
    if (imgEducao) imgEducao.src = "/assets/img/Normal.png";
});

document.getElementById('btnVerificar').addEventListener('click', () => {
    if (!missaoAtiva) return;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let corEncontrada = false;
    const rgbAlvo = hexToRgb(missaoAtiva.corAlvo);

    for (let i = 0; i < imageData.length; i += 4) {
        if (imageData[i + 3] > 200 && 
            Math.abs(imageData[i] - rgbAlvo[0]) < 30 && 
            Math.abs(imageData[i+1] - rgbAlvo[1]) < 30 && 
            Math.abs(imageData[i+2] - rgbAlvo[2]) < 30) {
            corEncontrada = true;
            break;
        }
    }

    if (corEncontrada) {
        textoMissao.innerHTML = "✨ <b>INCRÍVEL!</b> Você conseguiu! ✨";
        if (imgEducao) imgEducao.src = "/assets/img/Feliz.png";
        btnVerificar.style.display = 'none';
        new Audio('/assets/audio/acerto.mp3').play().catch(() => {});
    } else {
        textoMissao.innerText = "Humm... ainda não vi a cor certa. Tente usar mais " + missaoAtiva.corAlvo + "!";
    }
});

// Eventos de Desenho e Balde
function obterPosicao(e) {
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    // Calcula a escala entre o tamanho interno (canvas.width) e o tamanho exibido (rect.width)
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    return { 
        x: Math.round((clientX - rect.left) * scaleX), 
        y: Math.round((clientY - rect.top) * scaleY) 
    };
}

canvas.addEventListener('mousedown', (e) => {
    const pos = obterPosicao(e);
    if (modoBalde) {
        floodFill(pos.x, pos.y, hexToRgb(corAtual));
        if (imgEducao) imgEducao.src = "/assets/img/Feliz.png";
        setTimeout(() => imgEducao.src = "/assets/img/Normal.png", 1000);
    } else {
        desenhando = true;
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
        if (imgEducao) imgEducao.src = "/assets/img/Feliz.png";
    }
});

canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    const pos = obterPosicao(e);
    if (modoBalde) {
        floodFill(pos.x, pos.y, hexToRgb(corAtual));
        if (imgEducao) imgEducao.src = "/assets/img/Feliz.png";
        setTimeout(() => imgEducao.src = "/assets/img/Normal.png", 1000);
    } else {
        desenhando = true;
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
        if (imgEducao) imgEducao.src = "/assets/img/Feliz.png";
    }
}, { passive: false });

canvas.addEventListener('mousemove', (e) => {
    if (!desenhando || modoBalde) return;
    const pos = obterPosicao(e);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
});

canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    if (!desenhando || modoBalde) return;
    const pos = obterPosicao(e);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
}, { passive: false });

const parar = () => { desenhando = false; if (imgEducao && !missaoAtiva) imgEducao.src = "/assets/img/Normal.png"; };
canvas.addEventListener('mouseup', parar);
canvas.addEventListener('mouseout', parar);
canvas.addEventListener('touchend', parar);

// Ferramentas
document.querySelectorAll('.color-swatch').forEach(swatch => {
    swatch.addEventListener('click', () => {
        modoBorracha = false;
        corAtual = swatch.getAttribute('data-color');
        ctx.strokeStyle = corAtual;
        ctx.globalCompositeOperation = 'source-over';
        document.getElementById('btnBorracha').classList.replace('btn-light', 'btn-outline-light');
    });
});

document.getElementById('seletorCor').addEventListener('input', (e) => {
    corAtual = e.target.value;
    ctx.strokeStyle = corAtual;
    ctx.globalCompositeOperation = 'source-over';
});

document.querySelectorAll('.brush-size-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.brush-size-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        ctx.lineWidth = parseInt(btn.getAttribute('data-size'));
    });
});

document.getElementById('btnBalde').addEventListener('click', () => {
    modoBalde = !modoBalde;
    modoBorracha = false;
    const btn = document.getElementById('btnBalde');
    btn.classList.toggle('btn-outline-light');
    btn.classList.toggle('btn-warning');
    document.getElementById('btnBorracha').classList.replace('btn-light', 'btn-outline-light');
    ctx.globalCompositeOperation = 'source-over';
});

document.getElementById('btnBorracha').addEventListener('click', () => {
    modoBorracha = !modoBorracha;
    modoBalde = false;
    ctx.globalCompositeOperation = modoBorracha ? 'destination-out' : 'source-over';
    document.getElementById('btnBorracha').classList.toggle('btn-outline-light');
    document.getElementById('btnBorracha').classList.toggle('btn-light');
    document.getElementById('btnBalde').classList.replace('btn-warning', 'btn-outline-light');
});

document.getElementById('btnLimpar').addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (imgEducao) imgEducao.src = "/assets/img/Triste.png";
    setTimeout(() => imgEducao.src = "/assets/img/Normal.png", 1000);
});

document.getElementById('btnSalvar').addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = 'desenho.png';
    link.href = canvas.toDataURL();
    link.click();
});
