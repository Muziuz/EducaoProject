const niveis = {
    facil: [
        { frase: "O gato bebe _____.", opcoes: ["leite", "pedra", "papel"], resposta: "leite" },
        { frase: "O sol brilha no _____.", opcoes: ["mar", "céu", "chão"], resposta: "céu" },
        { frase: "Eu uso _____ nos pés.", opcoes: ["meias", "luvas", "chapéu"], resposta: "meias" }
    ],
    medio: [
        { frase: "O pássaro está voando _____ alto.", opcoes: ["muinto", "muito", "muto"], resposta: "muito" },
        { frase: "Papai foi comprar _____.", opcoes: ["açúcar", "asúcar", "assúcar"], resposta: "açúcar" },
        { frase: "Nós _____ futebol ontem.", opcoes: ["jogamos", "jogaremos", "jogam"], resposta: "jogamos" }
    ],
    dificil: [
        { frase: "Qual é o antônimo de 'efêmero'?", opcoes: ["duradouro", "rápido", "curto"], resposta: "duradouro" },
        { frase: "Escolha a grafia correta:", opcoes: ["excessão", "exceção", "esceção"], resposta: "exceção" },
        { frase: "Complete: Ele _____ o convite com prazer.", opcoes: ["aceitou", "aceito", "aceitasse"], resposta: "aceitou" }
    ]
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
    const fraseElemento = document.getElementById("frase");
    const opcoesContainer = document.getElementById("opcao");
    
    progTexto.innerText = `Pergunta ${indice + 1} de ${perguntasAtuais.length}`;
    progFill.style.width = `${((indice + 1) / perguntasAtuais.length) * 100}%`;
    
    document.getElementById("resultado").innerText = "";
    document.getElementById("resultado-correto").innerText = "";
    
    const p = perguntasAtuais[indice];
    fraseElemento.innerText = p.frase;
    
    opcoesContainer.innerHTML = "";
    p.opcoes.forEach(opcao => {
        const btn = document.createElement("button");
        btn.className = "btn-resposta";
        btn.innerText = opcao.toUpperCase();
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
            <h1 class="display-3">Gênio das Palavras! ✍️</h1>
            <p class="fs-4">Você completou o nível ${nivelAtivo.toUpperCase()}!</p>
            <button onclick="location.reload()" class="btn-resposta mt-4">Jogar Novamente</button>
        </div>
    `;
    const img = document.getElementById("img-educao-portugues");
    if (img) img.src = "/assets/img/Feliz.png";
}
