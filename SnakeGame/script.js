const board=document.querySelector('.board');
const highScoreElement=document.querySelector('#high-score');
const scoreElement=document.querySelector('#score');
const timeElement=document.querySelector('#time');
const gameStatus=document.querySelector('.game-status');
const blockWidth=30;
const blockHeight=30;
const cols=Math.floor(board.clientWidth/blockWidth);
const rows=Math.floor(board.clientHeight/blockHeight);
const blocks=[];
const snake=[[0,5],[0,4],[0,3]]
let direction='right'
let pause=false
let isFoodAvailable=false
let isGameOver=false;
let highScore=0;
let score=0;
let elapsedSeconds=0;
let gameInterval;
let timerInterval;

for( i=0;i<rows;i++){
    blocks[i]=[]
    for(j=0;j<cols;j++){
    const block=document.createElement('div');
    block.classList.add('block');
    board.appendChild(block);
     blocks[i][j]=block
    }
}


function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function foodGeneration(){
    let correctpos=false;
    while(!correctpos){
    let row=getRandomInt(0,rows-1)
    let col=getRandomInt(0,cols-1)
    if(!blocks[row][col].classList.contains('fill')){
        blocks[row][col].classList.add('food');
        correctpos=true;
        isFoodAvailable=true
    }
    return
    }
    
}
function gameOver(){
    highScore=Math.max(highScore,score);
    highScoreElement.textContent=highScore;
    clearInterval(gameInterval);
    clearInterval(timerInterval);
}
function updateTime(){
    const minutes=String(Math.floor(elapsedSeconds/60)).padStart(2,'0');
    const seconds=String(elapsedSeconds%60).padStart(2,'0');
    timeElement.textContent=`${minutes}-${seconds}`;
}
function updateGameStatus(){
    if(isGameOver){
        gameStatus.textContent='GAME OVER';
        gameStatus.classList.add('is-visible','is-game-over');
    } else if(pause){
        gameStatus.textContent='PAUSED';
        gameStatus.classList.add('is-visible');
        gameStatus.classList.remove('is-game-over');
    } else {
        gameStatus.textContent='';
        gameStatus.classList.remove('is-visible','is-game-over');
    }
}
function snakePos(snake,direction){
    if(pause || isGameOver) return;
    let headCol=snake[0][1];
    let headRow=snake[0][0];
    if(direction=='left') headCol-=1;
    else if(direction=='right') headCol+=1;
    else if(direction=='up') headRow-=1;
    else headRow+=1;
    if(headCol < 0 || headCol >= cols || headRow < 0 || headRow >= rows ||
       blocks[headRow][headCol].classList.contains('fill')){
        isGameOver=true;
        return
    }
    snake.unshift([headRow,headCol]);
    if(blocks[headRow][headCol].classList.contains('food')){
     blocks[headRow][headCol].classList.remove('food');
     isFoodAvailable=false;
     score+=1;
     scoreElement.textContent=score;
     return;
    }
    let tail=snake.pop();
    blocks[tail[0]][tail[1]].classList.remove('fill')
}

function render(){
    if(pause) return;
    snake.forEach((block)=>{
        blocks[block[0]][block[1]].classList.add('fill')
    })
}


document.addEventListener('keydown', (event) => {
    if(event.code=='Space'){
        event.preventDefault();
        if(isGameOver) {
            isGameOver=!isGameOver;
            updateGameStatus()
            resetGame()
            gameStart()
            return
        }
        pause=!pause;
        updateGameStatus();
    }
   else if (event.key === 'ArrowUp' && direction !== 'down') {
        direction = 'up';
    } else if (event.key === 'ArrowDown' && direction !== 'up') {
        direction = 'down';
    } else if (event.key === 'ArrowLeft' && direction !== 'right') {
        direction = 'left';
    } else if (event.key === 'ArrowRight' && direction !== 'left') {
        direction = 'right';
    }
});

function gameStart(){
    gameInterval=setInterval(()=>{
  snakePos(snake,direction)
  if(isGameOver) {
    updateGameStatus();
    gameOver();
    return;
  }
  render();
  if(!isFoodAvailable) foodGeneration()
},200)

    timerInterval=setInterval(()=>{
        if(!pause && !isGameOver){
            elapsedSeconds+=1;
            updateTime();
        }
    },1000)
}

function resetGame(){
    direction='right'
    score=0;
    elapsedSeconds=0;
    scoreElement.textContent=score;
    updateTime();
    for(let i=0;i<rows;i++){
        for(let j=0;j<cols;j++){
            blocks[i][j].classList.remove('fill','food')
        }
    }
    snake.length=0;
    snake.push([0,5],[0,4],[0,3])
    isFoodAvailable=false;

}

gameStart()