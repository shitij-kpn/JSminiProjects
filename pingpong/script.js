const cvs = document.getElementById("GameCanvas");

const ctx = cvs.getContext('2d');

const GAME_WIDTH = cvs.getAttribute("width");

const GAME_HEIGHT = cvs.getAttribute("height");

let Score1 = 0;

let Score2 = 0;

class player{
    constructor(x,y){
        this.gameheight = GAME_HEIGHT;
        this.gamewidth = GAME_WIDTH;

        this.position = {
            x: x,
            y: y
        }

        this.dimensions = {
            breadth : 20 ,
            length : 100
        };

        this.maxSpeed = 7;

        this.speed = 0;
    }
    
    draw(){
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(this.position.x , this.position.y, this.dimensions.breadth , this.dimensions.length);
    }

    moveUp(){
        this.speed = -this.maxSpeed;
    }
    moveDown(){
        this.speed = this.maxSpeed;
    }
    update(dt){
        this.position.y += this.speed;

        if(this.position.y < 0){
            this.position.y = 0;
        }
        if((this.position.y + this.dimensions.length) > this.gameheight){
            this.position.y = this.gameheight - this.dimensions.length;
        }

    }

    stop(){
        this.speed = 0;
    }
}

class Ball{
    constructor(){

        this.gameheight = GAME_HEIGHT;
        
        this.gamewidth = GAME_WIDTH;
        
        this.radius = 12;

        this.position = {
            x : this.gamewidth/2,
            y : this.gameheight/2
        };

        this.speed = {
            x: 8,
            y: 8
        };

    }
    draw(){
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2, true);
        ctx.fill();
    }

    update(dt){
        this.position.x += this.speed.x;
        this.position.y += this.speed.y;
        if(this.position.x <= player1.position.x + player1.dimensions.breadth){
            if(this.position.y >= player1.position.y 
                && this.position.y <= player1.position.y + player1.dimensions.length){
                    this.speed.x = -this.speed.x;
            }
        }

        if(this.position.x >= player2.position.x){
            if(this.position.y >= player2.position.y 
                && this.position.y <= player2.position.y + player2.dimensions.length){
                    this.speed.x = -this.speed.x;
            }
        }

        if(this.position.y < this.radius || this.position.y > this.gameheight - this.radius){
            this.speed.y = -this.speed.y;
        }
        
        
        if(this.position.x > GAME_WIDTH){
            Score1 += 1;
            document.getElementById("score1").innerHTML = `${Score1}`;
            this.resetBallCenter();
        }
        if(this.position.x < 0){
            Score2 += 1;
            document.getElementById("score2").innerHTML = `${Score2}`;
            this.resetBallCenter();
        }
    }
    resetBallCenter(){
        
        this.position.x = this.gamewidth/2;
        
        this.position.y = this.gameheight/2;

        this.speed = {
            x:8,
            y:8
        }; 
    }
}

class Input{
    constructor(){
        document.addEventListener("keydown",(event)=>{
            switch(event.keyCode){
                case 38:
                    player2.moveUp();
                    break;
                case 40:
                    player2.moveDown();
                    break;
                case 87:
                    player1.moveUp();
                    break;
                case 83:
                    player1.moveDown();
                    break;
            }
        });
        document.addEventListener("keyup",event =>{
            switch(event.keyCode){
                case 38:
                    if (player2.speed < 0)
                        player2.stop();
                    break;
                case 40:
                    if(player2.speed > 0 )
                        player2.stop();
                    break;
                case 87:
                    if (player1.speed < 0)
                        player1.stop();
                    break;
                case 83:
                    if (player1.speed > 0)
                        player1.stop();
                    break;
            }
        });
    } 
}



let player1 = new player(10,GAME_HEIGHT/2);

let player2 = new player(GAME_WIDTH-30,GAME_HEIGHT/2);

new Input();

let ball = new Ball();

let lastTime = 0;


function updateAll(time){

    let dt = time - lastTime ;

    lastTime = time;

    ctx.clearRect(0,0,GAME_WIDTH,GAME_HEIGHT);

    ctx.fillStyle = '#000000';
    ctx.fillRect(0,0,GAME_WIDTH,GAME_HEIGHT);

    player1.update(dt);

    player1.draw();

    player2.update(dt);

    player2.draw(); 
    
    ball.update(dt);

    ball.draw();

    window.requestAnimationFrame(updateAll);

} 

window.requestAnimationFrame(updateAll);