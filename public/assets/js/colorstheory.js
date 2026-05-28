const niveis = {
    facil: [
        { combinacao: ['vermelho', 'amarelo'], opcoes: ['laranja', 'verde', 'roxo'], resposta: 'laranja' },
        { combinacao: ['azul', 'amarelo'], opcoes: ['verde', 'vermelho', 'roxo'], resposta: 'verde' },
        { combinacao: ['vermelho', 'azul'], opcoes: ['roxo', 'preto', 'rosa'], resposta: 'roxo' }
    ],
    medio: [
        { combinacao: ['preto', 'branco'], opcoes: ['cinza', 'branco', 'azul'], resposta: 'cinza' },
        { combinacao: ['vermelho', 'verde'], opcoes: ['marrom', 'preto', 'roxo'], resposta: 'marrom' },
        { combinacao: ['azul', 'branco'], opcoes: ['azul claro', 'verde', 'cinza'], resposta: 'azul claro' }
    ],
    dificil: [
        { texto: "Qual destas é uma cor QUENTE? 🔥", opcoes: ['vermelho', 'azul', 'verde'], resposta: 'vermelho' },
        { texto: "Qual é a cor complementar do AMARELO? 🎨", opcoes: ['roxo', 'verde', 'laranja'], resposta: 'roxo' },
        { texto: "Qual cor representa a CALMA (Cor Fria)? ❄️", opcoes: ['azul', 'amarelo', 'laranja'], resposta: 'azul' }
    ]
};

const mapaDeCores = {
    'vermelho': '#ef4444', 'amarelo': '#facc15', 'azul': '#3b82f6', 
    'verde': '#22c55e', 'roxo': '#a855f7', 'laranja': '#f97316', 
    'branco': '#ffffff', 'preto': '#000000', 'rosa': '#f472b6', 
    'cinza': '#94a3b8', 'marrom': '#78350f', 'azul claro': '#93c5fd'
};

let perguntasAtuais = [];
let indice = 0;
let nivelAtivo = 'facil';
let animacaoIdleInterval = null;
let animacaoFeedbackInterval = null;

const somAcerto = new Audio('/assets/audio/acerto.mp3');
const somErro = new Audio('/assets/audio/erro.mp3');

function iniciarJogo(nivel) {
    nivelAtivo = nivel;
    perguntasAtuais = niveis[nivel];
    indice = 0;
    document.getElementById('seletor-nivel').style.display = 'none';
    document.getElementById('area-jogo').style.display = 'block';
    mostrarPergunta();
}

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
}

function iniciarIdle() {
    pararAnimacoes();
    const img = document.getElementById("img-educao-portugues");
    if (img) img.src = "/assets/img/Normal.png";
    animacaoIdleInterval = setInterval(() => {
        const i = document.getElementById("img-educao-portugues");
        if (i) {
            i.src = "/assets/img/Piscando.png";
            setTimeout(() => { if(animacaoIdleInterval) i.src = "/assets/img/Normal.png" }, 200);
        }
    }, 3000);
}

function mostrarPergunta() {
    if (indice >= perguntasAtuais.length) {
        finalizarJogo();
        return;
    }

    const progTexto = document.getElementById("progresso-texto");
    const progFill = document.getElementById("progress-fill");
    const areaChallenge = document.getElementById("frase");
    const opcoesContainer = document.getElementById("opcao");
    
    progTexto.innerText = `Pergunta ${indice + 1} de ${perguntasAtuais.length}`;
    progFill.style.width = `${((indice + 1) / perguntasAtuais.length) * 100}%`;
    
    document.getElementById("resultado").innerText = "";
    document.getElementById("resultado-correto").innerText = "";
    opcoesContainer.innerHTML = "";

    const p = perguntasAtuais[indice];

    if (p.combinacao) {
        areaChallenge.innerHTML = "";
        p.combinacao.forEach((c, i) => {
            if (i > 0) areaChallenge.innerHTML += '<span style="color:white; font-size:40px; margin:0 15px; vertical-align:middle;">+</span>';
            const block = document.createElement("div");
            block.style.cssText = `display:inline-block; width:80px; height:80px; background-color:${mapaDeCores[c]}; border-radius:15px; border:4px solid #fff; vertical-align:middle;`;
            areaChallenge.appendChild(block);
        });
    } else {
        areaChallenge.innerHTML = `<span style="color:white; font-size:1.5rem;">${p.texto}</span>`;
    }

    p.opcoes.forEach(opcao => {
        const btn = document.createElement("button");
        btn.className = "btn-resposta";
        btn.innerHTML = `
            <span style="display:inline-block; width:20px; height:20px; background:${mapaDeCores[opcao] || '#fff'}; border-radius:50%; margin-right:10px; border:2px solid #000; vertical-align:middle;"></span>
            ${opcao.toUpperCase()}
        `;
        btn.onclick = () => verificarResposta(opcao);
        opcoesContainer.appendChild(btn);
    });

    iniciarIdle();
}

function verificarResposta(opcao) {
    const p = perguntasAtuais[indice];
    const resEl = document.getElementById("resultado");
    const img = document.getElementById("img-educao-portugues");
    
    pararAnimacoes();
    const botoes = document.querySelectorAll(".btn-resposta");
    botoes.forEach(b => b.disabled = true);

    if (opcao === p.resposta) {
        resEl.innerText = "CORRETO! ✅";
        resEl.className = "correto";
        img.src = "/assets/img/Feliz.png";
        somAcerto.play().catch(() => {});
        indice++;
        setTimeout(mostrarPergunta, 2000);
    } else {
        resEl.innerText = "OPS! INCORRETO ❌";
        resEl.className = "incorreto";
        document.getElementById("resultado-correto").innerText = `A resposta era: ${p.resposta.toUpperCase()}`;
        animacaoFeedbackInterval = alternarImagem("img-educao-portugues", "Triste", "Triste_piscando", 500);
        somErro.play().catch(() => {});
        indice++;
        setTimeout(mostrarPergunta, 3000);
    }
}

function finalizarJogo() {
    document.getElementById('area-jogo').innerHTML = `
        <div class="text-center text-white py-5">
            <h1 class="display-3">Mestre das Cores! 🎨</h1>
            <p class="fs-4">Você completou o nível ${nivelAtivo.toUpperCase()}!</p>
            <button onclick="location.reload()" class="btn-resposta mt-4">Jogar Novamente</button>
        </div>
    `;
    const img = document.getElementById("img-educao-portugues");
    if (img) img.src = "/assets/img/Feliz.png";
}
