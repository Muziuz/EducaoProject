exports.index = (req, res) => {
    const nivelFicticio = {
        nome: "Primeiros Passos do EduCão",
        missao: "Ajude o EduCão a chegar no osso!",
        mapa: [
            [0, 0, 0],
            [0, 1, 0], // Ex: 1 pode ser o personagem, 0 caminho livre
            [0, 0, 2]  // Ex: 2 pode ser o objetivo
        ]
    };

    res.render('jogo-logica', { nivel: nivelFicticio });
}