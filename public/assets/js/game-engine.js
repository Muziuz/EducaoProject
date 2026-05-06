const personagem = { x: 0, y: 0, direcao: 'leste' };

function executarLogica() {
    const codigo = document.getElementById('command-input').value;
    const comandos = codigo.split(';').map(c => c.trim().toLowerCase());

    comandos.forEach((cmd, index) => {
        setTimeout(() => {
            if (cmd === 'andar()') moverPersonagem();
            if (cmd === 'virar()') mudarDirecao();
            atualizarInterface();
        }, index * 500); // Delay para animar o movimento
    });
}

function moverPersonagem() {
    // Lógica para alterar as coordenadas x ou y baseada na direção
    console.log("Personagem moveu!");
}