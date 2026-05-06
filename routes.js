const express = require('express');
const router = express.Router();
const homecontroller = require('./src/controllers/homecontroller');
const librarycontroller = require('./src/controllers/librarycontroller');
const wordscompletioncontroller = require('./src/controllers/wordscompletioncontroller');
const fouroperationscontroller = require('./src/controllers/fouroperationscontroller');
const colorstheorycontroller = require('./src/controllers/colorstheorycontroller');
const canvacontroller = require('./src/controllers/canvacontroller');
const jogoLogicaController = require('./src/controllers/jogo-logicacontroller');

router.get('/', homecontroller.index);
router.get('/acervo', librarycontroller.index);
router.get('/complete-as-palavras', wordscompletioncontroller.index);
router.get('/quatro-operacoes', fouroperationscontroller.index);
router.get('/teoria-das-cores', colorstheorycontroller.index);
router.get('/canva', canvacontroller.index);
router.get('/jogo-logica', jogoLogicaController.index);

module.exports = router;
