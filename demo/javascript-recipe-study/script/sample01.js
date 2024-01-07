class Player extends GameObject {
    constructor(game, x, y, w, h){
        super();
        this.game = game;
        this.animState = new Animation(
                            30,
                           ['./image/player_state0.png',
                            './image/player_state1.png']);
        this.animWalk = new Animation(
                            30,
                           ['./image/player_walk0.png',
                            './image/player_walk1.png']);
	    this.sprite = game.createSprite(x, y, w, h);
        this.reset();
    }
    reset() {
        this.speed = 0.05 + randFloat(0.1);
	    this.vx = randSign() * this.speed;
	    this.vy = randSign() * this.speed;
        this.x = randFloat(this.game.CELL_XMAX);
        this.y = randFloat(this.game.CELL_YMAX);

	    this.sprite.anim = this.animWalk;
	    this.sprite.setXY(this.x, this.y);
    }
    update() {
        if(this.game.isKeyUp()) {
		    this.y -= this.vy;
        }
        if(this.game.isKeyDown()) {
		    this.y += this.vy;
        }
        if(this.game.isKeyLeft()) {
		    this.x -= this.vx;
        }
        if(this.game.isKeyRight()) {
		    this.x += this.vx;
        }
		if (this.x < 0) this.x = 0;
        if (this.x > this.game.CELL_XMAX-1) this.x = this.game.CELL_XMAX-1;
		if (this.y < 0) this.y = 0;
        if (this.y > this.game.CELL_YMAX-1) this.y = this.game.CELL_YMAX-1;
        if(this.game.isKeyEnter()) {
		    this.reset();
        }
		this.sprite.setXY(this.x, this.y);
	}
}

class MyGame extends Game {
    PLAYER_COUNT = 255;
    constructor(){
        super();
        this.players = new Array();
        for (let i=0; i<this.PLAYER_COUNT; i++) {
            this.players[i] = new Player(this, 0, 0, 32, 32);
            this.addGameObject(this.players[i]);
        }
    }
    update() {
        for (let i=0; i<this.players.length; i++) {
            this.players[i].update();
        }
	}
}

(() => {
    window.addEventListener('load', () => {
        let game = new MyGame();
        game.execute();
    }, false);
})();
