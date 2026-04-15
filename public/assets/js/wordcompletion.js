const perguntas = [
  { frase: "O gato bebe _____.", opcoes: ["leite", "pedra", "areia", "papel"], resposta: "leite" },
  { frase: "Qual palavra é um animal?", opcoes: ["mesa", "cachorro", "lápis", "cadeira"], resposta: "cachorro" },
  { frase: "Qual palavra está escrita corretamente?", opcoes: ["cazamento", "kazamento", "casamento", "casamemto"], resposta: "casamento" },
  { frase: "O sol nasce de _____.", opcoes: ["dia", "noite", "manhã", "tarde"], resposta: "manhã" },
  { frase: "Qual palavra rima com 'pato'?", opcoes: ["gato", "casa", "mesa", "bola"], resposta: "gato" },
  { frase: "Qual dessas palavras é uma fruta?", opcoes: ["banana", "cadeira", "livro", "sapato"], resposta: "banana" },
  { frase: "Eu uso _____ para escrever.", opcoes: ["garfo", "lápis", "prato", "copo"], resposta: "lápis" },
  { frase: "Qual palavra começa com a letra B?", opcoes: ["gato", "bola", "mesa", "sapato"], resposta: "bola" },
  { frase: "Qual dessas palavras é um objeto da escola?", opcoes: ["caderno", "cachorro", "banana", "peixe"], resposta: "caderno" },
  { frase: "O peixe vive na _____.", opcoes: ["árvore", "água", "casa", "rua"], resposta: "água" },
  { frase: "Qual palavra é uma cor?", opcoes: ["azul", "sapato", "livro", "bola"], resposta: "azul" },
  { frase: "Qual dessas palavras é um alimento?", opcoes: ["arroz", "cadeira", "janela", "carro"], resposta: "arroz" },
  { frase: "A galinha põe _____.", opcoes: ["pedra", "ovos", "folhas", "areia"], resposta: "ovos" },
  { frase: "Qual palavra está escrita corretamente?", opcoes: ["escóla", "escola", "iscola", "esqola"], resposta: "escola" },
  { frase: "Qual palavra representa um lugar?", opcoes: ["parque", "lápis", "bola", "banana"], resposta: "parque" }
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
    const imgElement = document.getElementById("img-educao-portugues");
    if (imgElement) imgElement.src = "/assets/img/Normal.png";
    
    animacaoIdleInterval = setInterval(() => {
        const img = document.getElementById("img-educao-portugues");
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
  const fraseElemento = document.getElementById("frase");
  const opcoesContainer = document.getElementById("opcao");
  const resultadoElemento = document.getElementById("resultado");
  const resultadoCorretoElemento = document.getElementById("resultado-correto");

  if (indice >= perguntas.length) {
    document.body.innerHTML = `
      <div style="text-align:center; padding: 50px; background: #0f172a; min-height: 100vh; color: white;">
        <h1 style="font-size: 3rem; margin-bottom: 20px;">Parabéns! 🎉</h1>
        <p style="font-size: 1.5rem; margin-bottom: 30px;">Você completou todos os desafios!</p>
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
  if (fraseElemento) fraseElemento.innerText = perguntaAtual.frase;
  if (opcoesContainer) {
      opcoesContainer.innerHTML = "";
      perguntaAtual.opcoes.forEach((opcao) => {
        const botao = document.createElement("button");
        botao.innerText = opcao;
        botao.className = "btn-resposta";
        botao.onclick = () => verificarResposta(opcao);
        opcoesContainer.appendChild(botao);
      });
  }
  
  if (resultadoElemento) resultadoElemento.innerText = "";
  if (resultadoCorretoElemento) resultadoCorretoElemento.innerText = "";
  
  iniciarIdle();
}

function verificarResposta(opcaoEscolhida) {
  const perguntaAtual = perguntas[indice];
  const resultadoElemento = document.getElementById("resultado");
  const resultadoCorretoElemento = document.getElementById("resultado-correto");
  const imgElement = document.getElementById("img-educao-portugues");

  pararAnimacoes();
  const botoes = document.querySelectorAll(".btn-resposta");
  botoes.forEach(b => b.disabled = true);

  if (opcaoEscolhida === perguntaAtual.resposta) {
    if (resultadoElemento) {
        resultadoElemento.innerText = "CORRETO ✅";
        resultadoElemento.className = "correto";
    }
    if (imgElement) imgElement.src = "/assets/img/Feliz.png";
    somAcerto.play().catch(() => {});
    indice++;
    setTimeout(mostrarPergunta, 2000); 
  } else {
    if (resultadoElemento) {
        resultadoElemento.innerText = "INCORRETO ❌";
        resultadoElemento.className = "incorreto";
    }
    if (resultadoCorretoElemento) resultadoCorretoElemento.innerText = `A resposta certa era: ${perguntaAtual.resposta}`;
    
    // Animação de erro: triste <-> triste_piscando
    animacaoFeedbackInterval = alternarImagem("img-educao-portugues", "Triste", "Triste_piscando", 500);
    
    somErro.play().catch(() => {});
    indice++; 
    setTimeout(mostrarPergunta, 3000);
  }
}

document.addEventListener("DOMContentLoaded", mostrarPergunta);
