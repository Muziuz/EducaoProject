async function carregarLivros() {
  const container = document.getElementById('livros-container');
  
  try {
    const resposta = await fetch('https://gutendex.com/books/?languages=pt'); 
    const dados = await resposta.json();
    const livros = dados.results;

    container.innerHTML = livros.map(livro => {
      const capa = livro.formats['image/jpeg'] || 'https://via.placeholder.com/200x250?text=Sem+Capa';
      const linkLeitura = livro.formats['text/html'] || '#';

      return `
        <div class="card-livro">
          <img src="${capa}" alt="Capa de ${livro.title}" class="capa-livro">
          <div class="info-livro">
            <h3 class="titulo-livro">${livro.title}</h3>
            <p class="autor-livro">${livro.authors[0]?.name || 'Autor Desconhecido'}</p>
          </div>
          <a href="${linkLeitura}" target="_blank" class="btn-ler">Ler Agora</a>
        </div>
      `;
    }).join('');

  } catch (erro) {
    container.innerHTML = '<p>Erro ao carregar livros. Tente novamente mais tarde.</p>';
    console.error(erro);
  }
}
carregarLivros();