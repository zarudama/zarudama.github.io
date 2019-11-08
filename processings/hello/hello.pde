int x;
int y;
int vx;
int vy;
float tx,ty;
PImage gaiImage;
PImage gai;
void setup() {
  size(600,600);
  vx = 5 + random(5);
  vy = 5 + random(5);
  gaiImage = loadImage("gai.png");
  gai = gaiImage.get(0, 0, 32, 32);
  imageMode(CENTER);
}

void draw() {
  //tx += (mouseX - tx) * 0.1;
  tx = tx * 0.9f + mouseX * 0.1f;
  ty += (mouseY - ty) * 0.1;
  gai = gaiImage.get(0, 0, 32, 32);
  image(gai, int(tx), int(ty));
  //image(gaiImage, 300, 300);
  image(gai, 300, 300);
  fill(0,0,200,5);
  rect(0,0,600,600);
  fill(255,255,255);
  x+=vx;
  y+=vy;
  ellipse(x,y,40,40);
  if (x >= 600 || x <= 0) {
    vx = -vx;
  }
  if (y >= 600 || y <= 0) {
    vy = -vy;
  }
}

