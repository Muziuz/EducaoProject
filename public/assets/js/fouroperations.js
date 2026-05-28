let nivelAtual = 'facil';
let respostaCorreta;
let acertos = 0;
const metaAcertos = 10;

let animacaoIdleInterval = null;
let animacaoFeedbackInterval = null;

const somAcerto = new Audio('/assets/audio/acerto.mp3');
const somErro = new Audio('/assets/audio/erro.mp3');

function alternarImagem(id, img1, img2, tempo) {
    const imgElement = document.getElementById(id);
    if (!imgElement) return null;
    let estado = false;
    return setInterval(() => {
        imgElement.src = estado ? `/assets/img/${img1}.png` : `/assets/img/${img2}.png`;
        estado = !estado;
    }, tempo);
}

function pararAnimacoes() {
    if (animacaoIdleInterval) clearInterval(animacaoIdleInterval);
    if (animacaoFeedbackInterval) clearInterval(animacaoFeedbackInterval);
    animacaoIdleInterval = null;
    animacaoFeedbackInterval = null;
}

function iniciarIdle() {
    pararAnimacoes();
    const imgElement = document.getElementById("img-educao-matematica");
    if (imgElement) imgElement.src = "/assets/img/Normal.png";
    
    animacaoIdleInterval = setInterval(() => {
        const img = document.getElementById("img-educao-matematica");
        if (img) {
            img.src = "/assets/img/Piscando.png";
            setTimeout(() => {
                if (animacaoIdleInterval) img.src = "/assets/img/Normal.png";
            }, 200);
        }
    }, 3000);
}

function iniciarJogo(nivel) {
    nivelAtual = nivel;
    document.getElementById('seletor-nivel').style.display = 'none';
    document.getElementById('area-jogo').style.display = 'block';
    acertos = 0;
    gerarQuestao();
}

function gerarQuestao() {
    if (acertos >= metaAcertos) {
        finalizarJogo();
        return;
    }

    const questaoEl = document.getElementById('questao');
    const opcoesEl = document.getElementById('opcoes');
    const progTexto = document.getElementById("progresso-texto");
    const progFill = document.getElementById("progress-fill");
    
    document.getElementById('resultado').innerText = '';
    document.getElementById('resultado-correto').innerText = '';
    
    progTexto.innerText = `Progresso: ${acertos} de ${metaAcertos}`;
    progFill.style.width = `${(acertos / metaAcertos) * 100}%`;

    let questaoTexto = "";
    let opcoes = [];

    if (nivelAtual === 'facil') {
        let a = Math.floor(Math.random() * 10) + 1;
        let b = Math.floor(Math.random() * 10) + 1;
        let op = Math.random() > 0.5 ? '+' : '-';
        if (op === '-' && a < b) [a, b] = [b, a];
        questaoTexto = `${a} ${op} ${b}`;
        respostaCorreta = op === '+' ? a + b : a - b;
    } else if (nivelAtual === 'medio') {
        let tipo = Math.floor(Math.random() * 3);
        if (tipo === 0) {
            let a = Math.floor(Math.random() * 10) + 1;
            let b = Math.floor(Math.random() * 10) + 1;
            questaoTexto = `${a} × ${b}`;
            respostaCorreta = a * b;
        } else if (tipo === 1) {
            let b = Math.floor(Math.random() * 8) + 2;
            respostaCorreta = Math.floor(Math.random() * 9) + 1;
            let a = b * respostaCorreta;
            questaoTexto = `${a} ÷ ${b}`;
        } else {
            let a = Math.floor(Math.random() * 50) + 10;
            let b = Math.floor(Math.random() * 40) + 10;
            questaoTexto = `${a} + ${b}`;
            respostaCorreta = a + b;
        }
    } else {
        let tipo = Math.floor(Math.random() * 2);
        if (tipo === 0) {
            let a = Math.floor(Math.random() * 5) + 2;
            let b = Math.floor(Math.random() * 5) + 1;
            let c = Math.floor(Math.random() * 4) + 2;
            questaoTexto = `(${a} + ${b}) × ${c}`;
            respostaCorreta = (a + b) * c;
        } else {
            let f = [2, 4, 6, 8, 10][Math.floor(Math.random() * 5)];
            questaoTexto = `Metade de ${f*10}`;
            respostaCorreta = f*5;
        }
    }

    questaoEl.innerText = questaoTexto;
    opcoes = [respostaCorreta];
    while (opcoes.length < 4) {
        let errada = respostaCorreta + (Math.floor(Math.random() * 7) - 3);
        if (errada !== respostaCorreta && errada >= 0 && !opcoes.includes(errada)) {
            opcoes.push(errada);
        }
    }
    opcoes.sort(() => Math.random() - 0.5);

    opcoesEl.innerHTML = opcoes.map(op => `
        <button class="btn-resposta" onclick="verificarResposta(${op})">${op}</button>
    `).join('');

    iniciarIdle();
}

function verificarResposta(escolha) {
    const resEl = document.getElementById('resultado');
    const resCorretoEl = document.getElementById('resultado-correto');
    const imgElement = document.getElementById("img-educao-matematica");
    
    pararAnimacoes();
    const botoes = document.querySelectorAll(".btn-resposta");
    botoes.forEach(b => b.disabled = true);

    if (escolha === respostaCorreta) {
        resEl.innerText = "CORRETO! ✅";
        resEl.className = "correto";
        if (imgElement) imgElement.src = "/assets/img/Feliz.png";
        somAcerto.play().catch(() => {});
        acertos++;
        setTimeout(gerarQuestao, 2000);
    } else {
        resEl.innerText = "OPS! INCORRETO ❌";
        resEl.className = "incorreto";
        resCorretoEl.innerText = `A resposta era: ${respostaCorreta}`;
        animacaoFeedbackInterval = alternarImagem("img-educao-matematica", "Triste", "Triste_piscando", 500);
        somErro.play().catch(() => {});
        setTimeout(gerarQuestao, 3000);
    }
}

function finalizarJogo() {
    document.getElementById('area-jogo').innerHTML = `
      <div style="text-align:center; padding: 20px; color: white;">
        <h1 style="font-size: 3rem; margin-bottom: 20px;">Parabéns! 🏆</h1>
        <p style="font-size: 1.5rem; margin-bottom: 30px;">Você dominou a matemática do nível ${nivelAtual.toUpperCase()}!</p>
        <button onclick="location.reload()" class="btn-resposta" style="background:#facc15; box-shadow:none;">Jogar Novamente</button>
        <br><br>
        <a href="/" style="color: #facc15; text-decoration: none; font-size: 1.2em;">Voltar para o Início</a>
      </div>
    `;
    const imgElement = document.getElementById("img-educao-matematica");
    if (imgElement) imgElement.src = "/assets/img/Feliz.png";
}
