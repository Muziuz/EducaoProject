const express = require('express');
const router = express.Router();
const homecontroller = require('./src/controllers/homecontroller');
const librarycontroller = require('./src/controllers/librarycontroller');
const wordscompletioncontroller = require('./src/controllers/wordscompletioncontroller');
const fouroperationscontroller = require('./src/controllers/fouroperationscontroller');
const colorstheorycontroller = require('./src/controllers/colorstheorycontroller');
const canvacontroller = require('./src/controllers/canvacontroller');
const jogoLogicaController = require('./src/controllers/jogo-logicacontroller');
const quizcontroller = require('./src/controllers/quizcontroller');
const chesscontroller = require('./src/controllers/chesscontroller');
const mathminecontroller = require('./src/controllers/mathminecontroller');

router.get('/', homecontroller.index);
router.get('/acervo', librarycontroller.index);
router.get('/complete-as-palavras', wordscompletioncontroller.index);
router.get('/quatro-operacoes', fouroperationscontroller.index);
router.get('/teoria-das-cores', colorstheorycontroller.index);
router.get('/canva', canvacontroller.index);
router.get('/jogo-logica', jogoLogicaController.index);
router.get('/quiz', quizcontroller.index);
router.get('/xadrez', chesscontroller.index);
router.get('/campo-minado-matematico', mathminecontroller.index);

module.exports = router;
