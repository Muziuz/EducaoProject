const perguntas = [
    { pergunta: "Quanto é 5 + 7?", opcoes: ["10", "11", "12", "13"], resposta: "12" },
    { pergunta: "Quanto é 15 - 8?", opcoes: ["5", "6", "7", "8"], resposta: "7" },
    { pergunta: "Quanto é 3 x 4?", opcoes: ["12", "9", "15", "10"], resposta: "12" },
    { pergunta: "Quanto é 20 ÷ 4?", opcoes: ["4", "5", "6", "10"], resposta: "5" },
    { pergunta: "Quanto é 9 + 9?", opcoes: ["16", "17", "18", "19"], resposta: "18" },
    { pergunta: "Quanto é 50 - 25?", opcoes: ["20", "25", "30", "15"], resposta: "25" },
    { pergunta: "Quanto é 6 x 7?", opcoes: ["42", "36", "48", "40"], resposta: "42" },
    { pergunta: "Quanto é 81 ÷ 9?", opcoes: ["7", "8", "9", "10"], resposta: "9" },
    { pergunta: "Quanto é 100 - 45?", opcoes: ["65", "55", "45", "50"], resposta: "55" },
    { pergunta: "Quanto é 8 x 5?", opcoes: ["35", "40", "45", "50"], resposta: "40" },
];

let indice = 0;
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

function mostrarPergunta() {
    const progTexto = document.getElementById("progresso-texto");
    const progFill = document.getElementById("progress-fill");
    const perguntaMat = document.getElementById("pergunta-matematica");
    const areaOpcoes = document.getElementById("opcoes-respostas");
    const resFeedback = document.getElementById("resultado-feedback");
    const resCorreto = document.getElementById("resultado-correto");

    if (indice >= perguntas.length) {
        document.body.innerHTML = `
          <div style="text-align:center; padding: 50px; background: #0f172a; min-height: 100vh; color: white;">
            <h1 style="font-size: 3rem; margin-bottom: 20px;">Parabéns! 🏆</h1>
            <p style="font-size: 1.5rem; margin-bottom: 30px;">Você é um mestre da matemática!</p>
            <button onclick="location.reload()" style="padding:15px 30px; font-size:18px; cursor:pointer; border-radius:10px; background: #facc15; font-weight: bold; border: none;">Jogar Novamente</button>
            <br><br>
            <a href="/" style="color: #facc15; text-decoration: none; font-size: 1.2em;">Voltar para o Início</a>
          </div>
        `;
        return;
    }

    if (progTexto) progTexto.innerText = `Pergunta ${indice + 1} de ${perguntas.length}`;
    if (progFill) progFill.style.width = `${((indice + 1) / perguntas.length) * 100}%`;

    const perguntaAtual = perguntas[indice];
    if (perguntaMat) perguntaMat.innerText = perguntaAtual.pergunta;
    if (areaOpcoes) {
        areaOpcoes.innerHTML = "";
        perguntaAtual.opcoes.forEach((opcao) => {
            const botao = document.createElement("button");
            botao.innerText = opcao;
            botao.className = "btn-resposta";
            botao.onclick = () => verificarResposta(opcao);
            areaOpcoes.appendChild(botao);
        });
    }

    if (resFeedback) resFeedback.innerText = "";
    if (resCorreto) resCorreto.innerText = "";
    
    iniciarIdle();
}

function verificarResposta(opcaoSelecionada) {
    const perguntaAtual = perguntas[indice];
    const resFeedback = document.getElementById("resultado-feedback");
    const resCorreto = document.getElementById("resultado-correto");
    const imgElement = document.getElementById("img-educao-matematica");

    pararAnimacoes();
    const botoes = document.querySelectorAll(".btn-resposta");
    botoes.forEach(b => b.disabled = true);

    if (opcaoSelecionada === perguntaAtual.resposta) {
        if (resFeedback) {
            resFeedback.innerText = "CORRETO ✅";
            resFeedback.className = "correto";
        }
        if (imgElement) imgElement.src = "/assets/img/Feliz.png";
        somAcerto.play().catch(() => {});
        indice++;
        setTimeout(mostrarPergunta, 2000);
    } else {
        if (resFeedback) {
            resFeedback.innerText = "INCORRETO ❌";
            resFeedback.className = "incorreto";
        }
        if (resCorreto) resCorreto.innerText = `A resposta era: ${perguntaAtual.resposta}`;
        
        animacaoFeedbackInterval = alternarImagem("img-educao-matematica", "Triste", "Triste_piscando", 500);
        
        somErro.play().catch(() => {});
        indice++; 
        setTimeout(mostrarPergunta, 3000);
    }
}

document.addEventListener("DOMContentLoaded", mostrarPergunta);
