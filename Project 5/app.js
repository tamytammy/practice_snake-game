
//先抓取html內的canvas element
const canvas = document.getElementById('myCanvas');
//透過canvas methods 取得畫布(drawing context)
const ctx = canvas.getContext('2d');

//設定初始單位，長寬=320
const unit = 20;
const row = canvas.height / unit; // 16
const col = canvas.width / unit; // 16

//製作蛇身，設立空array，每一個index為一個物件，每個物件為一個座標
//透過這個方法取得一隻蛇身
let snake = [];

//設置蛇的初始座標
function createSnake(){
    snake[0] ={
    x:80,
    y:0,
};
snake[1] ={
    x:60,
    y:0,
};
snake[2] ={
    x:40,
    y:0,
};
snake[3] ={
    x:20,
    y:0,
};
}


//設置果實，因為他必須隨機新增，因此把它作為一個物件使用
class Fruit{
    //讓隨機小數 * 長/寬(row/col) → 可以控制這個數值整數後 < 16
    //並用floor(化為整數後) * 最小單位unit → 視為座標使用
    constructor(){
        this.x = Math.floor(Math.random() * row) * unit;
        this.y = Math.floor(Math.random() * col) * unit;
    }
    //生成果實
    drawFruit(){
        ctx.fillStyle = "yellow";
        ctx.fillRect(this.x , this.y , unit, unit);
    }
    //每次吃到果實後，隨機新增果實辦法
    //overFruit = 是否蛇頭覆蓋在果實上 →預設為無(沒有吃到)
    pickLocation(){
        let overFruit = false;
        let newX;
        let newY;
//確認是否座標有覆蓋的情形，覆蓋為true，否則為false預設值
    function checkLocation(newX, newY){
        for(let i =0 ; i < snake.length ; i++){
            if(newX == snake[0].x && newY == snake[0].y){
                overFruit = true;
                return;
            }else{
                overFruit = false;
            }
        }
    }
    //使用do...while，當覆蓋為true，生成新的newX,newY
    //先設定隨機生成，再透過確認座標功能確認
        do{
            newX = Math.floor(Math.random() * row) * unit;
            newY = Math.floor(Math.random() * row) * unit;
            checkLocation(newX,newY);
        }while(overFruit);
    //若以上為true，則新生成果實座標，使果實座標不重複
        this.x = newX;
        this.y = newY;
    }
}

//初始值設定
createSnake(); // 創建初始蛇
let myFruit = new Fruit(); // 創建初始果實

let score = 0;  //設定初始分數
let highScore ;  // 指定最高分數
highestScore(); //執行加載最高分數function，若有顯示，無 = 0
document.getElementById('myScore').innerHTML = `目前分數：${score}`;
document.getElementById('highScore').innerHTML = `最高分數：${highScore}`;


//設定使用上下左右按鍵操控蛇的方向
window.addEventListener("keydown", changeDirection);
//設置預設方向 = right
let d = "right";
//要使用d != 是因為如果剛好是反方向，是沒辦法大反轉過來的，不合邏輯
function changeDirection(e){
    if(e.key == "ArrowLeft" && d != "right"){
        d = "left";
    }else if(e.key == "ArrowUp" && d != "down"){
        d = "up";
    }else if(e.key == "ArrowRight" && d != "left"){
        d = "right";
    }else if (e.key == "ArrowDown" && d != "up"){
        d = "down";
    }
}


function draw(){

//每次開始畫圖前，都先確認蛇的頭是否吃到自己的身體
//吃到身體，停止遊戲(clearInterval)，並且跳出結束視窗(alert)
//index設定為1(身體的部分)開始跑，把座標拿去跟頭(index[0])比較
    for(let i = 1 ; i < snake.length ; i++){
        if(snake[i].x == snake[0].x && snake[i].y == snake[0].y){
            clearInterval(myGame);
            alert("Game Over!");
            return;
        }
    }
    //透過setInterval方式，每100毫秒會重新設置畫布顏色與長寬
    //為了去覆蓋舊的蛇身，讓畫面只顯示新的蛇
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width , canvas.height);

    //每次開始都會隨機新增果實
    myFruit.drawFruit();
    //使用for loop畫出蛇身
    for(let i = 0; i < snake.length ; i++){
    
    //透過index，讓蛇身與蛇頭區分出來，fillstyle為填充顏色
    if(i == 0){
        ctx.fillStyle = "lightBlue";
    }else{
        ctx.fillStyle = "pink";
    }
    //strokeStyle是框的顏色，以區分目前已有多少個身體
    ctx.strokeStyle = "white";

    //前置style都設置好後，透過fillRect,strokeRect填滿長方形，參數(x,y, width, height)
    ctx.fillRect(snake[i].x , snake[i].y, unit, unit);
    ctx.strokeRect(snake[i].x , snake[i].y , unit, unit);
    }
    
    //抓取蛇頭的位置座標，再根據d方向做(x,y)座標加減，讓他在畫面上面移動
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if(d == "left"){
        snakeX -= unit;
    }else if(d == "up"){
        snakeY -= unit;
    }else if(d == "down"){
        snakeY += unit;
    }else if(d == "right"){
        snakeX += unit;
    }
//在設定一個新的蛇頭，空的array，放入上面根據d方向移動過後的(x,y)座標，作為新的頭
   let newHead = {
    x: snakeX,
    y: snakeY,
   };

//限制蛇在ctx裡面(320*320)，通過邊界座標點時，重新設置座標點
   if(newHead.x == 320){
    newHead.x = 0;
   }else if(newHead.y == 320){
    newHead.y = 0;
   }else if (newHead.x == -20){
    newHead.x = 300;
   }else if (newHead.y == -20){
    newHead.y = 300;
   }

//通過是否吃到果實來判定pop()
//蛇頭座標等於果實座標 == 吃到果實 == unshift新增頭
if(snake[0].x == myFruit.x && snake[0].y == myFruit.y){
    myFruit.pickLocation();
//如果碰到果實，分數往上加，並同時更新分數至本機
//透過下面sethighscore的function，如果是目前分數大於最高分數，則重新存取最高分數
    score++;
    setHighScore(score);
    document.getElementById('myScore').innerHTML = `目前分數：${score}`;
    document.getElementById('highScore').innerHTML = `最高分數：${highScore}`;
}else{
    snake.pop();
}
   snake.unshift(newHead);
}

//每1毫秒讓蛇移動的遊戲
let myGame = setInterval(draw, 100);

//加載最高分數，如果沒有最高分數，則為0
//有的話，則getitem highestscore
function highestScore(){
    if(localStorage.getItem('highestScore') == null){
        highScore = 0;
    }else{
        highScore = Number(localStorage.getItem('highestScore'));
    }
}
//設定highestscore抓取
//如果目前分數 > 最高分數則取最高分數為highestscore至本機
function setHighScore(score){
    if(score > highScore){
        localStorage.setItem("highestScore", score);
        highScore = score;
    }
}



