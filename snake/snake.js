const cvs = document.getElementById('gameCanvas');

const ctx = cvs.getContext('2d');

const tileSize = 20;

const maxSpeed = 20;


const player = {
    speed : {
        x: 0,
        y: 0
    },
    position : {
        x: cvs.width/2,
        y: cvs.height/2
    },
    trail : [],
    tail : 5
}

const food = {
    position : {
        x:tileSize * Math.floor(Math.random()*29),
        y:tileSize * Math.floor(Math.random()*29)
    },
    getPosition : () => {
        /*
        29 because we need a number between 0-580(see cvs height and width) 
        so random generate numb er between 0 and 1 multiplaying it by 29 gives us a number between 0 and 29
        (int because of math.floor) and multiplying by 20 gives a multiple of 20 b/w 0 - 580
        */ 
        food.position.x = tileSize * Math.floor(Math.random()*29);     
        food.position.y = tileSize * Math.floor(Math.random()*29);
    }
}

const displayFood = () => {    
    ctx.fillStyle = 'red';
    ctx.fillRect(food.position.x,food.position.y,tileSize,tileSize);
}


setInterval(() => {
    
    //recolors over the canvas so previous drawings are removed and new drawing is made on top
    ctx.fillStyle = '#3e3e3e';
    ctx.fillRect(0,0,cvs.width,cvs.height);

    displayFood();

    player.position.x += player.speed.x; 
    player.position.y += player.speed.y;
    //wrapping
    if(player.position.x<0){
        player.position.x = cvs.width -tileSize;
    }
    if(player.position.y<0){
        player.position.y = cvs.height -tileSize;
    }
    if(player.position.x>(cvs.width - tileSize)){
        player.position.x = 0;
    }
    if(player.position.y>(cvs.height -tileSize)){
        player.position.y = 0;
    }

    //makes a rectangle for every block of snake
    
    player.trail.forEach(block => {
        ctx.fillStyle = 'green';
        ctx.fillRect(block.x,block.y,tileSize,tileSize);
        if(block.x == player.position.x && block.y === player.position.y){
            player.tail = 5;
        }
    }); 
    
    player.trail.push({x:player.position.x,y:player.position.y});

    while(player.trail.length > player.tail) {
        player.trail.shift();
    }

    //eats food
    if(food.position.x === player.position.x && food.position.y === player.position.y){
        player.tail++;
        food.getPosition();
    } 
    console.log(player.trail); 
},1000/10);

document.addEventListener('keydown',event => {
    switch (event.keyCode) {
        case 37:
            if(player.speed.x === 0){
                player.speed.y = 0;
                player.speed.x = -maxSpeed;
            }
            break;
        case 38:
            if(player.speed.y === 0){
                player.speed.x = 0;
                player.speed.y = -maxSpeed;
            }
            break;
        case 39:
            if(player.speed.x === 0){
                player.speed.y = 0;
                player.speed.x = maxSpeed;
            }
            break;
        case 40:
            if(player.speed.y === 0){
                player.speed.x = 0;
                player.speed.y = maxSpeed;
            }
            break;            
    }
    console.log(event.keyCode);
})

