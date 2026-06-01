import '../css/quiz.css';

const bancoQuestoes = {
    facil: [
        { pergunta: "Quantas cores tem o arco-íris?", opcoes: ["5", "7", "10", "3"], resposta: "7" },
        { pergunta: "Qual é o maior animal terrestre?", opcoes: ["Leão", "Elefante", "Girafa", "Dinossauro"], resposta: "Elefante" },
        { pergunta: "O Sol é uma estrela ou um planeta?", opcoes: ["Estrela", "Planeta", "Satélite", "Cometa"], resposta: "Estrela" },
        { pergunta: "Quantos meses tem um ano?", opcoes: ["10", "12", "6", "24"], resposta: "12" },
        { pergunta: "Qual é a cor da esmeralda?", opcoes: ["Azul", "Vermelho", "Verde", "Amarelo"], resposta: "Verde" }
    ],
    medio: [
        { pergunta: "Qual é o planeta mais próximo do Sol?", opcoes: ["Terra", "Marte", "Mercúrio", "Vênus"], resposta: "Mercúrio" },
        { pergunta: "Quem pintou a 'Mona Lisa'?", opcoes: ["Van Gogh", "Leonardo da Vinci", "Picasso", "Salvador Dalí"], resposta: "Leonardo da Vinci" },
        { pergunta: "Quantos continentes existem no mundo?", opcoes: ["5", "6", "7", "4"], resposta: "6" },
        { pergunta: "Qual é o gás que nós respiramos para sobreviver?", opcoes: ["Gás Carbônico", "Oxigênio", "Nitrogênio", "Hélio"], resposta: "Oxigênio" },
        { pergunta: "Em qual continente fica o Brasil?", opcoes: ["Europa", "África", "América", "Ásia"], resposta: "América" }
    ],
    dificil: [
        { pergunta: "Qual é o metal cujo símbolo químico é Au?", opcoes: ["Prata", "Ouro", "Cobre", "Alumínio"], resposta: "Ouro" },
        { pergunta: "Quem escreveu 'Os Lusíadas'?", opcoes: ["Machado de Assis", "Luís de Camões", "Fernando Pessoa", "Eça de Queirós"], resposta: "Luís de Camões" },
        { pergunta: "Qual é o país com a maior população do mundo?", opcoes: ["Índia", "China", "EUA", "Rússia"], resposta: "Índia" },
        { pergunta: "Em que ano o homem pisou na Lua pela primeira vez?", opcoes: ["1965", "1969", "1972", "1959"], resposta: "1969" },
        { pergunta: "Qual é o maior oceano da Terra?", opcoes: ["Atlântico", "Índico", "Pacífico", "Ártico"], resposta: "Pacífico" }
    ]
};

let nivelAtual = 'facil';
let perguntasSorteistas = [];
let indiceQuestao = 0;
let acertos = 0;

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
    const imgElement = document.getElementById("img-educao-quiz");
    if (imgElement) imgElement.src = "/assets/img/Normal.png";
    
    animacaoIdleInterval = setInterval(() => {
        const img = document.getElementById("img-educao-quiz");
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
    perguntasSorteistas = [...bancoQuestoes[nivel]].sort(() => Math.random() - 0.5);
    indiceQuestao = 0;
    acertos = 0;
    
    document.getElementById('seletor-nivel').style.display = 'none';
    document.getElementById('area-jogo').style.display = 'block';
    
    mostrarQuestao();
}

function mostrarQuestao() {
    if (indiceQuestao >= perguntasSorteistas.length) {
        finalizarJogo();
        return;
    }

    const questaoAtual = perguntasSorteistas[indiceQuestao];
    const perguntaEl = document.getElementById('pergunta');
    const opcoesEl = document.getElementById('opcoes');
    const progTexto = document.getElementById("progresso-texto");
    const progFill = document.getElementById("progress-fill");
    
    document.getElementById('resultado').innerText = '';
    document.getElementById('resultado-correto').innerText = '';
    
    progTexto.innerText = `Pergunta ${indiceQuestao + 1} de ${perguntasSorteistas.length}`;
    progFill.style.width = `${((indiceQuestao + 1) / perguntasSorteistas.length) * 100}%`;

    perguntaEl.innerText = questaoAtual.pergunta;
    
    // Embaralha as opções
    const opcoes = [...questaoAtual.opcoes].sort(() => Math.random() - 0.5);

    opcoesEl.innerHTML = opcoes.map(op => `
        <button class="btn-resposta" onclick="verificarResposta('${op}')">${op}</button>
    `).join('');

    iniciarIdle();
}

function verificarResposta(escolha) {
    const questaoAtual = perguntasSorteistas[indiceQuestao];
    const resEl = document.getElementById('resultado');
    const resCorretoEl = document.getElementById('resultado-correto');
    const imgElement = document.getElementById("img-educao-quiz");
    
    pararAnimacoes();
    const botoes = document.querySelectorAll(".btn-resposta");
    botoes.forEach(b => b.disabled = true);

    if (escolha === questaoAtual.resposta) {
        resEl.innerText = "CORRETO! ✅";
        resEl.className = "correto";
        if (imgElement) imgElement.src = "/assets/img/Feliz.png";
        somAcerto.play().catch(() => {});
        acertos++;
        indiceQuestao++;
        setTimeout(mostrarQuestao, 2000);
    } else {
        resEl.innerText = "OPS! INCORRETO ❌";
        resEl.className = "incorreto";
        resCorretoEl.innerText = `A resposta era: ${questaoAtual.resposta}`;
        animacaoFeedbackInterval = alternarImagem("img-educao-quiz", "Triste", "Triste_piscando", 500);
        somErro.play().catch(() => {});
        indiceQuestao++;
        setTimeout(mostrarQuestao, 3000);
    }
}

function finalizarJogo() {
    const porcentagem = (acertos / perguntasSorteistas.length) * 100;
    let mensagemFinal = "";
    
    if (porcentagem === 100) mensagemFinal = "Incrível! Você é um gênio! 🌟";
    else if (porcentagem >= 70) mensagemFinal = "Muito bem! Você conhece muito! 👏";
    else mensagemFinal = "Bom trabalho! Continue estudando para saber ainda mais! 📚";

    document.getElementById('area-jogo').innerHTML = `
      <div style="text-align:center; padding: 20px; color: white;">
        <h1 style="font-size: 3rem; margin-bottom: 20px;">Fim do Quiz! 🏁</h1>
        <p style="font-size: 1.5rem; margin-bottom: 10px;">Você acertou ${acertos} de ${perguntasSorteistas.length} perguntas.</p>
        <p style="font-size: 1.2rem; margin-bottom: 30px;">${mensagemFinal}</p>
        <button onclick="location.reload()" class="btn-resposta" style="background:#facc15; box-shadow:none;">Jogar Novamente</button>
        <br><br>
        <a href="/" style="color: #facc15; text-decoration: none; font-size: 1.2em;">Voltar para o Início</a>
      </div>
    `;
    const imgElement = document.getElementById("img-educao-quiz");
    if (imgElement) imgElement.src = "/assets/img/Feliz.png";
}
window.iniciarJogo = iniciarJogo;
window.verificarResposta = verificarResposta;
