import '../css/library.css';
import livrosLocais from './livros-locais.json';

const API_URL = 'https://gutendex.com/books/';

// Função para buscar livros locais do nosso JSON
async function buscarLivrosLocais() {
    return livrosLocais;
}

async function carregarLivros(categoria = '', termo = '') {
    const container = document.getElementById('livros-container');
    container.innerHTML = '<div class="carregando">Buscando tesouros literários... 📚</div>';
    
    try {
        // 1. Buscamos os livros locais primeiro
        let livrosExibir = await buscarLivrosLocais();

        // 2. Filtramos os locais se houver busca ou categoria
        if (termo) {
            livrosExibir = livrosExibir.filter(l => 
                l.title.toLowerCase().includes(termo.toLowerCase()) || 
                l.authors[0].name.toLowerCase().includes(termo.toLowerCase())
            );
        } else if (categoria) {
            livrosExibir = livrosExibir.filter(l => 
                l.subjects && l.subjects.some(s => s.toLowerCase().includes(categoria.toLowerCase()))
            );
        }

        // 3. Buscamos na API externa para completar o acervo
        let url = `${API_URL}?languages=pt`;
        if (termo) url += `&search=${encodeURIComponent(termo)}`;
        else if (categoria) url += `&topic=${encodeURIComponent(categoria)}`;
        else url += `&search=infantil,children`;

        const respostaAPI = await fetch(url);
        const dadosAPI = await respostaAPI.json();
        
        // Combinamos os locais com os da API (evitando duplicatas simples pelo título)
        const titulosLocais = livrosExibir.map(l => l.title.toLowerCase());
        const livrosAPI = dadosAPI.results.filter(l => !titulosLocais.includes(l.title.toLowerCase()));
        
        livrosExibir = [...livrosExibir, ...livrosAPI];

        if (livrosExibir.length === 0) {
            container.innerHTML = '<p class="erro">Não encontramos nenhum livro. Tente outro termo!</p>';
            return;
        }

        container.innerHTML = livrosExibir.map(livro => renderizarLivro(livro)).join('');

    } catch (erro) {
        container.innerHTML = '<p class="erro">Ops! Erro ao carregar biblioteca.</p>';
        console.error(erro);
    }
}

function renderizarLivro(livro) {
    const capa = livro.formats['image/jpeg'] || 'https://via.placeholder.com/200x250/1e293b/facc15?text=EduCão+Livros';
    const linkLeitura = livro.formats['text/html'] || livro.formats['application/pdf'] || '#';
    
    let autor = 'Autor Desconhecido';
    if (livro.authors && livro.authors.length > 0) {
        const partes = livro.authors[0].name.split(', ');
        autor = partes.length > 1 ? `${partes[1]} ${partes[0]}` : partes[0];
    }

    return `
        <div class="card-livro">
            <div class="capa-wrapper">
                <img src="${capa}" alt="Capa de ${livro.title}" class="capa-livro">
            </div>
            <div class="info-livro">
                <h3 class="titulo-livro" title="${livro.title}">${livro.title}</h3>
                <p class="autor-livro">${autor}</p>
            </div>
            <a href="${linkLeitura}" target="_blank" class="btn-ler">📖 Ler agora</a>
        </div>
    `;
}

function buscar() {
    const termo = document.getElementById('input-busca').value;
    if (termo.length > 2 || termo.length === 0) {
        carregarLivros('', termo);
    }
}

document.addEventListener('DOMContentLoaded', () => carregarLivros());

window.buscar = buscar;
window.carregarLivros = carregarLivros;
