const colors = [
    { combinacao: ['vermelho', 'amarelo'], opcoes: ['laranja', 'verde', 'roxo'], resposta: 'laranja' },
    { combinacao: ['azul', 'amarelo'], opcoes: ['verde', 'vermelho', 'púrpura'], resposta: 'verde' },
    { combinacao: ['vermelho', 'azul'], opcoes: ['roxo', 'preto', 'rosa'], resposta: 'roxo' },
    { combinacao: ['vermelho', 'branco'], opcoes: ['rosa', 'roxo', 'cinza'], resposta: 'rosa' },
    { combinacao: ['preto', 'branco'], opcoes: ['cinza', 'branco', 'laranja'], resposta: 'cinza' },
    { combinacao: ['vermelho', 'verde'], opcoes: ['marrom', 'azul', 'preto'], resposta: 'marrom' }
];

const mapaDeCores = {
    'vermelho': '#ef4444', 
    'amarelo': '#facc15', 
    'azul': '#3b82f6', 
    'verde': '#22c55e', 
    'roxo': '#a855f7', 
    'púrpura': '#a855f7', 
    'laranja': '#f97316', 
    'branco': '#ffffff', 
    'preto': '#000000', 
    'rosa': '#f472b6', 
    'cinza': '#94a3b8', 
    'marrom': '#78350f'
};

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
  const areaChallenge = document.getElementById("frase");
  const opcoesContainer = document.getElementById("opcao");
  const resultadoElemento = document.getElementById("resultado");
  const resultadoCorreto = document.getElementById("resultado-correto");

  if (indice >= colors.length) {
    document.body.innerHTML = `
      <div style="text-align:center; padding: 50px; background: #0f172a; min-height: 100vh; color: white;">
        <h1 style="font-size: 3rem; margin-bottom: 20px;">Parabéns! 🎨</h1>
        <p style="font-size: 1.5rem; margin-bottom: 30px;">Você agora é um Mestre das Cores!</p>
        <button onclick="location.reload()" style="padding:15px 30px; font-size:18px; cursor:pointer; border-radius:10px; background: #facc15; font-weight: bold; border: none;">Jogar Novamente</button>
        <br><br>
        <a href="/" style="color: #facc15; text-decoration: none; font-size: 1.2em;">Voltar para o Início</a>
      </div>
    `;
    return;
  }

  if (progTexto) progTexto.innerText = `Pergunta ${indice + 1} de ${colors.length}`;
  if (progFill) progFill.style.width = `${((indice + 1) / colors.length) * 100}%`;

  const cor = colors[indice];
  if (areaChallenge) areaChallenge.innerHTML = "";
  if (opcoesContainer) {
      opcoesContainer.innerHTML = "";
      cor.combinacao.forEach((c, i) => {
        if (i > 0) {
          const plus = document.createElement("span");
          plus.innerText = "+";
          plus.style.fontSize = "40px";
          plus.style.margin = "0 15px";
          plus.style.verticalAlign = "middle";
          plus.style.color = "white";
          areaChallenge.appendChild(plus);
        }
        const block = document.createElement("div");
        block.style.display = "inline-block";
        block.style.width = "80px";
        block.style.height = "80px";
        block.style.backgroundColor = mapaDeCores[c.toLowerCase()] || c;
        block.style.borderRadius = "15px";
        block.style.border = "4px solid #fff";
        block.style.verticalAlign = "middle";
        areaChallenge.appendChild(block);
      });

      cor.opcoes.forEach(opcao => {
        const btn = document.createElement("button");
        btn.className = "btn-resposta";
        btn.innerHTML = `
            <span style="display:inline-block; width:25px; height:25px; background:${mapaDeCores[opcao.toLowerCase()]}; border-radius:50%; margin-right:10px; border:2px solid #000; vertical-align:middle;"></span>
            ${opcao.toUpperCase()}
        `;
        btn.onclick = () => verificarResposta(opcao);
        opcoesContainer.appendChild(btn);
      });
  }

  if (resultadoElemento) resultadoElemento.innerText = "";
  if (resultadoCorreto) resultadoCorreto.innerText = "";
  
  iniciarIdle();
}

function verificarResposta(opcao) {
  const current = colors[indice];
  const resultadoElemento = document.getElementById("resultado");
  const resultadoCorreto = document.getElementById("resultado-correto");
  const imgElement = document.getElementById("img-educao-portugues");

  pararAnimacoes();
  const botoes = document.querySelectorAll(".btn-resposta");
  botoes.forEach(b => b.disabled = true);

  if (opcao === current.resposta) {
    if (resultadoElemento) {
        resultadoElemento.innerText = "CORRETO! ✅";
        resultadoElemento.className = "correto";
    }
    if (imgElement) imgElement.src = "/assets/img/Feliz.png";
    somAcerto.play().catch(() => {});
    indice++;
    setTimeout(mostrarPergunta, 2000);
  } else {
    if (resultadoElemento) {
        resultadoElemento.innerText = "OPS! INCORRETO ❌";
        resultadoElemento.className = "incorreto";
    }
    if (resultadoCorreto) resultadoCorreto.innerText = `A mistura correta era: ${current.resposta.toUpperCase()}`;
    
    animacaoFeedbackInterval = alternarImagem("img-educao-portugues", "Triste", "Triste_piscando", 500);
    
    somErro.play().catch(() => {});
    indice++;
    setTimeout(mostrarPergunta, 3000);
  }
}

document.addEventListener("DOMContentLoaded", mostrarPergunta);
