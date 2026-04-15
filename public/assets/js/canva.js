
const canvas = document.getElementById('telaPintura');
const ctx = canvas.getContext('2d');


let desenhando = false;


ctx.lineWidth = 10; 
ctx.lineCap = 'round';
ctx.lineJoin = 'round';


canvas.addEventListener('mousedown', (evento) => {
    desenhando = true;
    ctx.beginPath(); 
    ctx.moveTo(evento.offsetX, evento.offsetY); 
});


canvas.addEventListener('mousemove', (evento) => {
    if (!desenhando) return; 
    ctx.lineTo(evento.offsetX, evento.offsetY); 
    ctx.stroke(); 
});


canvas.addEventListener('mouseup', () => {
    desenhando = false;
});


canvas.addEventListener('mouseout', () => {
    desenhando = false;
});


const seletorCor = document.getElementById('seletorCor');
seletorCor.addEventListener('input', (evento) => {
    ctx.strokeStyle = evento.target.value; 
});


const btnLimpar = document.getElementById('btnLimpar');
btnLimpar.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});