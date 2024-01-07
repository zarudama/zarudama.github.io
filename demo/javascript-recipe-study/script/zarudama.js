// 乱数
function randFloat2(from, to) {
	return Math.random()*(to-from)+from;
}
function randFloat(to) {
	return randFloat2(0, to);
}
function randInt2(from, to) {
	return Math.floor(randFloat2(from, to));
}
function randInt(to) {
	//return randInt2(0, to);
	return randInt2(1, to-1);
}
function randSign() {
	return randInt(2)*2-1;
}

/**
 * 画像管理のためのクラス
 */
class MyImage {
    constructor(imagePath){
        this.image = new Image();
        this.image.src = imagePath;
        this.ready = false;
        this.image.addEventListener('load', () => {
            // 画像のロードが完了したら準備完了フラグを立てる
            this.ready = true;
        }, false);
    }
}

/**
 * アニメーション管理のためのクラス
 */
class Animation {
    /**
     * @constructor
     * @param {number} wait - 画像を表示する間隔(frame数)
     * @param {Array} imagePaths - アニメーション用の画像パス文字列の配列
     */
    constructor(wait, imagePaths){
        this.counter = 0;
        this.wait = wait;
        this.frame = 0;
        this.images = new Array();
        imagePaths.map((v) => {
           this.images.push(new MyImage(v));
        });
    }
    /**
     * 画像の読み込みが完了したかチェックする。
     */
    isReady(){
        let ready = true;
        for (let i = 0; i < this.images.length; i++) {
           if (this.images[i].ready == false) {
               ready = false;
               break;
           }
        }
        return ready;
    }
    /**
     * アニメーションを進める
     */
    update(){
        this.counter++;
        if (this.counter % this.wait == 0) {
            this.frame++;
        }
        this.frame = this.frame % this.images.length;
    }
    /**
     * 現在のフレームの画像を取得する
     */
    get currentIamge(){
        return this.images[this.frame].image;
    }
}

// 座標はCELL単位で指定する。
class Sprite {
    constructor(ctx, x, y, w, h){
        this.ctx = ctx;
        this.y = y;
        this.x = x;
        this.w = w;
        this.h = h;
        this.cell_size = w;
        this.anim_ = null;
    }
	setXY(x, y) {
        this.x = x;
        this.y = y;
    }
    isReady(){
        return this.anim_.isReady();
    }
    set anim(val) {
        this.anim_ = val;
    }
    get anim() {
        return this.anim_;
    }
    draw(cellSize, viewX, viewY){
        this.ctx.drawImage(
            this.anim_.currentIamge,
            this.x * cellSize, this.y * cellSize,
            //this.x, this.y,
            this.w, this.h
        );
        //function(viewX, viewY) {
        //    if (obj.updated && viewX==obj.viewX && viewY==obj.viewY) return;
        //    obj.updated=true;
        //    obj.viewX=viewX;
        //    obj.viewY=viewY;
    
        //    var style=obj.img.style;
        //    style.left=Math.floor((obj.x-viewX)*CELL_SIZE)+"px";
        //    style.top=Math.floor((obj.y-viewY)*CELL_SIZE)+"px";
        //    style.width=Math.floor(obj.xSize*CELL_SIZE)+"px";
        //    style.height=Math.floor(obj.ySize*CELL_SIZE)+"px";
        //    
        //    obj.img.src=obj.animImage[obj.animIndex];
        //}
        if (this.anim_ != null) {
            this.anim_.update();
        }
    }
}

class GameObject {
    reset() {}
    update() {}
}

class Game {
    constructor() {
        this.CANVAS_WIDTH = 640;
        this.CANVAS_HEIGHT = 480;
        this.CELL_SIZE = 32;
        this.CELL_XMAX = this.CANVAS_WIDTH / this.CELL_SIZE;
        this.CELL_YMAX = this.CANVAS_HEIGHT / this.CELL_SIZE;

        this.KEY_COUNT = 256;
        this.KEY_LEFT='ArrowLeft';
        this.KEY_RIGHT='ArrowRight';
        this.KEY_UP='ArrowUp';
        this.KEY_DOWN='ArrowDown';
        this.KEY_SPACE='Space';
        this.KEY_ENTER='Enter';
        this.KEY_ESC='Escape';
        

        this.sprites = new Array();
        this.gameObjects = new Array();

        this.canvas = document.body.querySelector('#main_canvas');
        this.ctx = this.canvas.getContext('2d');

        this.canvas.width = this.CANVAS_WIDTH;
        this.canvas.height = this.CANVAS_HEIGHT;

        this.startTime = null;
        this.viewX = 0;
        this.viewY = 0;

        this.keys = new Array();
        for (let i=0; i<this.KEY_COUNT; i++) {
            this.keys[i]=false;
        }
    }
    isKey(code) {
        return this.keys[code];
    }
    isKeyUp() {
        return this.isKey(this.KEY_UP);
    }
    isKeyDown() {
        return this.isKey(this.KEY_DOWN);
    }
    isKeyLeft() {
        return this.isKey(this.KEY_LEFT);
    }
    isKeyRight() {
        return this.isKey(this.KEY_RIGHT);
    }
    isKeySpace() {
        return this.isKey(this.KEY_SPACE);
    }
    isKeyEnter() {
        return this.isKey(this.KEY_ENTER);
    }
    isKeyEsc() {
        return this.isKey(this.KEY_ESC);
    }

    execute(){
        this.startLoadCheck();
    }

    startLoadCheck(){
        let obj = this;
        function eventSetting(){
            window.addEventListener('keydown', (event) => {
                obj.keys[event.key] = true;
            }, false);
            window.addEventListener('keyup', (event) => {
                obj.keys[event.key] = false;
            }, false);
        }
        function loadCheck(){
            let ready = true;
            ready = ready && obj.isReady();
            if(ready === true){
                eventSetting();
                obj.startTime = Date.now();
                obj.startRender();
            }else{
                setTimeout(loadCheck, 100);
            }
        }
        loadCheck();
    }


    isReady(){
        let ready = true;
        for (let i=0; i<this.sprites.length; i++) {
            if (!this.sprites[i].anim.isReady()) break;
        }
        return ready;
    }

    reset(){
        for (let i=0; i<obj.gameObjects.length; i++) {
            obj.gameObjects[i].reset();
        }
    }

    // レンダリングする。メインループ
    startRender(){
        let obj = this;
        function render(){
            obj.clearScreen();
            let nowTime = (Date.now() - obj.startTime) / 1000;

            // 移動処理
            for (let i=0; i<obj.gameObjects.length; i++) {
                obj.gameObjects[i].update();
            }

            // 描画更新
            for (let i=0; i<obj.sprites.length; i++) {
                obj.sprites[i].draw(obj.CELL_SIZE, obj.viewX, obj.viewY);
                    }

            requestAnimationFrame(render);
        }
        render();
    }

    createSprite(x,y,w,h) {
    	let sp = new Sprite(this.ctx, x, y, w, h);
        this.sprites.push(sp);
        return sp;
    }

    addGameObject(go) {
        this.gameObjects.push(go);
        return go;
    }

    // 画面をクリアする
    clearScreen(){
        this.ctx.globalAlpha = 1.0;
        this.ctx.fillStyle = '#eeeeee';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height); 
    }

    drawLine(x1, y1, x2, y2, color, ){
        if(color != null){
            this.context2d.strokeStyle = color;
        }
        this.context2d.lineWidth = 1;
        this.context2d.beginPath();
        this.context2d.moveTo(x1, y1);
        this.context2d.lineTo(x2, y2);
        this.context2d.closePath();
        this.context2d.stroke();
    }
}

